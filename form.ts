import { Component, G, One, Render, clearEvent, div, g, m, onfocusout } from "galho";
import { Alias, L, extend } from "galho/orray.js";
import { Dic, Key, Primitive, Task, assign, bool, byKey, def, falsy, filter, float, int, is, isA, isO, isS, isU, l, str } from "galho/util.js";
import { $, C, Color, Icon, Label, SingleSelectBase, Size, TextInputTp, busy, cancel, confirm, errorMessage, iSingleSelectBase, ibt, icon, icons, label, menuitem, modal, selectRoot, setValue, tip, w } from "./galhui.js";
import { anyProp, arrayToDic, up } from "./util.js";


// export type Error = {
//   tp?: str;
//   info?: str;
//   params?: Dic<Key>;
// } | str;
export type Error = Render | G | str;

interface FieldGroup {
  input(key: str): Input;
}
/**coisas executadas quando alguma ação acontece dentro do form */
type BotCallback<T extends FieldGroup> = (src: Dic<any>, form: T) => any;
export type Bot<T extends FieldGroup = FieldGroup> = [...src: str[], call: BotCallback<T>];
export const enum ErrorType {
  required = "req",
  numberTooBig = "number_too_big",
  numberTooSmall = "number_too_small",
  invalidFormat = "invalid_format",
  textTooLong = "text_too_long",
  textTooShort = "text_too_short",
  isDecimal = "is_decimal",
  isNegative = "is_negative",
  tooOlder = "too_older",
  tooYoung = "too_young",
  moreItems = "more_items",
  lessItems = "less_items",
  unsubmited = "unsubmited"
}
interface EError extends Render { tp: ErrorType, params?: Dic }
export const error = (tp: ErrorType, msg?: str, params?: Dic): EError =>
  ({ tp, params, render: () => msg })
export const req = () => error(ErrorType.required, w.required);
export type Errors = Dic<() => any>;

// export const errors: Errors = {};
//export const inputs: Dic<{ new(i: IInput, ctx?: IInputContext): Input; }> = {};

interface FormEvents extends Dic<any[]> {
  input: [Input];
  fill: [data: Dic];
  requestsubmit: [e: SubmitEvent];
  submit: [data: Dic];
  cancel: [];
}
function checkBot<T extends FieldGroup>(container: T, bots: Bot<T>[]) {
  if (bots) {
    for (let bot of bots) {
      let srcs: Dic = {}, cb = bot.at(-1) as BotCallback<T>;
      function calc(this: Input | void) {
        if (this)
          srcs[this.name] = this.value;
        cb(srcs, container);
      }
      for (let i = 0; i < bot.length - 1; i++) {
        let src = bot[i] as str;
        let inp = container.input(src);
        srcs[src] = inp.value;
        inp.onset(["value", "off"], calc);
      }
      setTimeout(calc);
    }
  }
}
export interface iFormBase {
  /**@default "form" */
  tag?: keyof HTMLElementTagNameMap
  readOnly?: bool;
  hidden?: Dic;
  // meta?: Dic;
  bots?: Bot<FormBase>[];
  /**called when input enter/exit off */
  offFN?: (e: G, isOff: bool) => void;
}
/** */
export class FormBase<T extends iFormBase = iFormBase, Ev extends FormEvents = FormEvents> extends Component<T, Ev> implements FieldGroup {
  inputs: Input[];
  constructor(i: T, inputs: (Input | falsy)[]);
  constructor(inputs: (Input | falsy)[]);
  constructor(i: T | (Input | falsy)[], inputs?: (Input | falsy)[]) {
    if (isA(i)) {
      inputs = i;
      i = {} as T;
    }
    super(i);
    this.inputs = filter(inputs)
    checkBot(this, i.bots);
  }
  view(): One { throw 1; }
  get isDef() {
    for (let input of this.inputs)
      if (!input.isDef())
        return false;

    return true;
  }
  input<T extends Input>(key: str) {
    for (let input of this.inputs)
      if (input.name == key || (is(input, CompostIn) && (input = input.input(key))))
        return input as T;
  }
  errors: Dic<Error[]> = {};
  setErrors(key: str, errors?: Error[]) {
    this.errors[key] = errors;
    this.input(key)?.error(!!errors);
  }
  valid(omit?: bool, focus = !omit) {
    if (omit)
      return !this.inputs.some(i => i.invalid(i.value, true));

    for (let input of this.inputs) {
      let inv = input.invalid(input.value, omit, focus);
      this.setErrors(input.name, inv);

      if (inv && focus) {
        input.focus();
        focus = false;
      }
    }
    //use isto para incluir erros não gerados por inputs direitamente
    return !anyProp(this.errors, e => e && l(e));
  }
  focus() {
    for (let input of this.inputs)
      if (!input.p.off) {
        input.focus();
        break;
      }
    return this;
  }
  // get def() {
  //   let r: Dic = {};
  //   for (let { key, def } of this.inputs)
  //     r[key] = def;
  //   return r;
  // }
  // /**default data */
  // def(): Dic;
  // def(value: Dic): this;
  // def(value: null): this;
  // def(v?: Dic) {
  //   if (isU(v)) {
  //     let r: Dic = {};
  //     for (let { key, def } of this.inputs)
  //       r[key] = def;
  //     return r;
  //   } else this.inputs.forEach(i => v ?
  //     i.key in v && i.set("def", v?.[i.key]) :
  //     i.set("def", null)
  //   );
  // }
  fill(value: Dic, setAsDefault?: bool) {
    this
      .emit("fill", value).inputs
      .forEach(i => i.fill(value, setAsDefault));
    return this;
  }
  reset(...fields: str[]) {
    for (let i of l(fields) ? this.inputs.filter(i => fields.includes(i.name)) : this.inputs) {
      i.visited = false;
      i.value = i.def;
    }
    return this;
  }
  // clear(...fields: str[]) {
  //   for (let i of l(fields) ? this.inputs.filter(i => fields.includes(i.key)) : this.inputs)
  //     i.value(i.null);
  //   return this;
  // }
  /**
   * get value of form
   * @param edited se true only return fields that heve a value
   * @param req se true fields required with default value will be returned too
   */
  data(edited?: bool, req?: bool) {
    let inputs = this.inputs;

    let r: Dic = assign({}, this.p.hidden);
    for (let input of edited ? inputs.filter(i => (req && i.p.req) || !i.isDef()) : inputs)
      input.p.off || input.submit(r, edited, req);
    this.emit("submit", r);
    return r;
  }
  formData(edited?: bool, required?: bool) {
    let
      r = new FormData(),
      data = this.data(edited, required);
    for (let key in data)
      r.append(key, <str>data[key]);
    return r;
  }
}
async function dataAsync(form: FormBase, edited?: bool, req?: bool) {
  let inputs = form.inputs;

  let r: Dic = assign({}, form.p.hidden);
  for (let input of edited ? inputs.filter(i => (req && i.p.req) || !i.isDef()) : inputs)
    input.p.off || await input.submit(r, edited, req);
  form.emit("submit", r);
  return r;
}
function renderErrors(inputs: Input[], errs: Dic<Error[]>) {
  let result: G[][] = [];

  for (let key in errs) {
    let i = byKey(inputs, key, "name");
    result.push(errs[key]?.map(err => div([i && [g("b", 0, i.p.text), ": "], err])));
    // {
    // (isS(error)) && (error = { tp: error });
    // result.push(div([
    //   i && [g("b", 0, i.i.text), ": "],
    //   errors[error.tp](),
    //   error.info && g("sub", 0, error.info),
    // ]));
    // }
  }
  return result;
}

export const onOffHide = (e: G, isOff: bool) => e.c("_ off", isOff);
export const onOffDisable = (e: G, isOff: bool) => e.c("_ off", isOff);
/** */
export interface iForm extends iFormBase {
  errorDiv?: G;
  outline?: bool;
  bots?: Bot<Form>[];
  labelSz?: int
}
export class Form extends FormBase<iForm> {
  errDiv: G;

  constructor(i: iForm, inputs: (Input | falsy)[]);
  constructor(inputs: (Input | falsy)[]);
  constructor(p: iForm | (Input | falsy)[], inputs?: Input[]) {
    super(p as any, inputs as any);
    this.errDiv = this.p.errorDiv || errorMessage();
    if (this.p.outline == null)
      this.p.outline = $.oform;
    this.inputs.forEach(this.addInput, this);
    // this.p.labelSz ||= 40;
    // this.on('input', (input: Input) => {
    //   let e = input.field(this).attr("edited", !input.isDef());
    //   (p as iForm).offFN?.(e, !!input.p.off)
    // });
  }
  addInput(input: Input) {
    input.form = this;
    input.onset(["value", "off"], () => {
      input.visited && this.setErrors(input.name, input.invalid(input.value));
      let e = input.field(this).attr("edited", !input.isDef());
      this.p.offFN?.(e, !!input.p.off)
      this.emit("input", input);
    });
    input.observeVisited(i => this.setErrors(i.name, i.invalid(i.value)));
  }
  view() {
    let { p: i, inputs: inp } = this;
    return g(i.tag || 'form', "_ form", [
      inp.map(i => i.field(this)),
      this.errDiv
    ]);
  }

  setErrors(key: str, errors?: Error[]) {
    super.setErrors(key, errors);
    this.errDiv.set(renderErrors(this.inputs, this.errors));
  }
}

// export function mdform(hd: Label, inputs: Input[], cb?: (dt: Dic, form: FormBase) => Task<unk>, confirm?: S<HTMLButtonElement>, noCancel?: bool, sz?: Size): Promise<Dic>
// export function mdform(hd: Label, form: FormBase, cb?: (dt: Dic, form: FormBase) => Task<unk>, confirm?: S<HTMLButtonElement>, noCancel?: bool, sz?: Size): Promise<Dic>
/**modal form */
export function mdform<T = Dic>(hd: Label, form: Input[] | FormBase, cb: (dt: Dic, form: FormBase) => Task<T | void>, ok = confirm(), noCancel?: bool, sz?: Size) {
  if (isA(form))
    form = new Form(form);

  return new Promise<T>(res => {
    modal(
      hd, g((form as Form).set("tag", "div"), "bd"),
      (cl, md) => [
        ok.p({ type: "submit" }).on("click", e => {
          e.preventDefault();
          if ((form as Form).valid()) {
            clearEvent(e);
            busy(md, async () => {
              let dt = (form as Form).data();
              res((await cb?.(dt, form as Form)) || dt as any);
              cl();
            });
          }
        }),
        noCancel || cancel(() => { cl(); res(null) })
      ], sz,
      !noCancel
    );
    (form as Form).focus();
  })
}
export interface Field {
  name?: str;
  info?: str;
  req?: bool;
  outline?: bool;
  text?: Label;
  tip?: any;
  off?: bool;
}
export function field(bd: One, i: Field, form?: Form, sz = form?.p?.labelSz) {
  let o = def(form?.p.outline, i.outline), t = div("_ " + (o ? "oi" : "ii"), [
    (!o || i.text) && g('label', "hd", [
      i.text,
      i.tip && tip(icon(icons.info), i.tip)
    ]).css("width", `${sz}%`).attr({ for: i.name }),
    bd = g(bd, "bd").css("width", `${100 - sz}%`),
    !!i.req && g('span', "req", '*'),
  ]);
  if (i.off)
    form?.p.offFN?.(bd, true);
  return t;
}

export function fieldGroup(title: Label, inputs: Input[], form?: Form, sz?: int) {
  return g("fieldset", "_ formg", [
    //TODO: remove sub element in label
    g("legend", 0, label(title)),
    inputs.map(i => i.field(form, sz))
  ]);
}
export function expand(form: Form, ...main: str[]) {
  for (let input of form.inputs)
    g(input).c(C.side, !main.includes(input.name));
  g(form).add(m(
    div(`ft _${C.side}`, [
      g("span", 0, "Mostrar todos"),
      ibt(icons.down, null)
    ]),
    div(`ft ${C.side}`, [
      g("span", 0, "Mostrar principais"),
      ibt(icons.up, null),
    ])).on("click", () => g(form).tcls("expand")));
}
export function valid(e: HTMLFormElement) {
  for (let c = 0; c < e.length; c++) {
    let i = e[c] as HTMLInputElement;
    if (!i.validity.valid)
      return false;
  }
  return true;
}
export function value(e: HTMLFormElement) {
  let r: Dic<Primitive | Date> = {};
  for (let c = 0; c < e.length; c++) {
    let i = e[c] as HTMLInputElement;
    if (i.name)
      switch (i.type) {
        case 'radio':
          if (i.checked)
            r[i.name] = i.value;
          break;
        case 'checkbox':
          r[i.name] = i.checked;
          break;
        case 'date':
        case 'time':
        case 'week':
          r[i.name] = i.valueAsDate;
          break;
        case 'number':
        case 'range':
          r[i.name] = i.valueAsNumber;
          break;
        case 'submit':
          break;
        default:
          r[i.name] = i.value;
          break;
      }
  }
  return r;
}
export interface iInput<V = unknown> extends Field {
  //tp: Key;
  value?: V;
  def?: V;
  submit?(data: Dic);
  // side?: bool;
}
export abstract class Input<V = unknown, P extends iInput<V> = iInput<V>, Ev extends Dic<any[]> = {}> extends Component<P, Ev> {
  constructor(p: P) {
    super(p);
    if (isU(p.text)) p.text = def(w[p.name], up(p.name));
    if (isU(p.value)) p.value = this.def;
  }
  get name() { return this.p.name; }
  get value() { return def<V>(this.p.value, null); }
  set value(v) { this.set("value", v); }

  fill?(src: Dic, setAsDefault?: bool) {
    let k = this.p.name;
    if (k in src) {
      this.value = src[k];
      if (setAsDefault)
        this.set("def", src[k])
    }
  }
  get def() { return def(<V>this.p.def, this.null); }
  isDef(value = this.value, def = this.def) {
    return def === value;
  }
  isNull(value = this.value) { return this.isDef(value, this.null); }

  visited?: bool;
  observeVisited(handler: (input: Input) => any) {
    onfocusout(g(this), () => {
      this.visited = true;
      handler(this);
    });
  }

  /**show or hide errors */
  error(state: bool) {
    g(this).c(Color.error, state);
    return this;
  }
  invalid(value: V, omit?: bool, focus?: bool) {
    if (this.p.off) return null;
    let v = this.validate(value, omit, focus);
    return l(v) ? v : null;
  }
  validate(value: V, omit?: bool, focus?: bool): Error[]
  validate(value: V): Error[] {
    return (this.p.req && this.isNull(value)) ? [req()] : [];
  }
  #f: G;
  field(form?: Form, sz?: int) {
    return this.#f ||= field(this, this.p, form, sz);
    //     export function fields(inputs: Input[], form?: Form): One[];
    // export function fields(inputs: Input[], form?: Form) {
    //   return inputs.map(input =>
    //     input.field ?
    //       input.field(form) :
    //       field(input, input.p, form));
    // }
  }
  submit(this: this, data: Dic, edited?: bool, req?: bool): any//Task<void>
  submit(data: Dic) {
    let { name, value, submit } = this.p;
    if (submit) submit(data);
    else data[name] = value;
  }
  /**null value used for clear method */
  get null(): V { return null; }
}
export interface Input<V, P extends iInput<V>, Ev extends Dic<any[]>> {
  form?: FormBase;
}
// function inputBind<I, Inp extends InputElement>(e: E<I>, input: S<Inp>, prop: keyof I, field: keyof Inp = 'value') {
//   e.bind(input, () => input.e[field as str] = e.i[prop], prop);
//   return input.p(field, def<any>(e.i[prop], null)).on('input', () => {
//     let v = <any>input.e[field];
//     e.set(prop, v === '' || (typeof v === 'number' && isNaN(v)) ? null : v);
//   });;
// }

//------------TEXT------------------------
export interface iTextIn extends iInput<str> {
  //tp: FT.text;
  pattern?: RegExp;
  input?: TextInputTp | "ta";
  min?: int;
  max?: int;
  /**place holder */
  ph?: str;
}
export class TextIn extends Input<str, iTextIn, { input: [str] }> {
  view() {
    var i = this.p, r: G<HTMLInputElement | HTMLTextAreaElement>;
    if (i.input == 'ta') {
      r = g('textarea', "_ in v").p({
        name: i.name, id: i.name,
        placeholder: i.ph || ''
      }).on('keydown', (e) => {
        if (e.key == "Enter") {
          if (e.ctrlKey)
            e.preventDefault();
          else e.stopPropagation();
        }
      });
    } else r = g("input", "_ in").p({
      type: i.input || 'text',
      name: i.name, id: i.name, placeholder: i.ph || ''
    });
    r.on({
      input: () => {
        this.emit("input", r.v());
        this.set("value", r.v() || null)
      },
      focus() { r.e.select() }
    });
    return this.bind(r, () => r.e.value = i.value || '', "value");
  }
  validate(value: string) {
    let p = this.p;
    let errs: Error[] = [];

    if (value) {
      if (p.pattern && !(<RegExp>p.pattern).test(value))
        errs.push(error(ErrorType.invalidFormat, w.invalidFmt));

      if (p.max && value.length > p.max)
        errs.push(error(ErrorType.textTooLong, "", { max: p.max }));
      if (p.min && value.length < p.min)
        errs.push(error(ErrorType.textTooShort, "", { min: p.min }));

    } else if (p.req)
      errs.push(req());

    return errs;
  }
}
/**text input */
export const textIn = (k: str, req?: bool, input?: TextInputTp | "ta") =>
  new TextIn({ name: k, req, input });
//------------NUMBER------------------------
export interface NumberFmt {
  min?: int;
  max?: int;
  /**open min */
  omin?: int;
  /**open max */
  omax?: int;
  integer?: bool;
}
export type iNumbIn = iInput<int> & NumberFmt & {
  //tp: FT.number,
  unsigned?: bool;
  unit?: str;
  /**place holder */
  ph?: str;
};
export class NumbIn extends Input<float, iNumbIn> {
  view() {
    let i = this.p, inp = <G<HTMLInputElement>>g("input", {
      type: 'number',
      placeholder: i.ph || '',
      step: i.integer ? <any>1 : 'any',
      name: i.name, id: i.name, value: i.value as any,
      min: (i.min ?? i.omin) as any, max: (i.max ?? i.omax) as any,
      oninput: () => this.value = inp.v() ? inp.e.valueAsNumber : null,
      onfocus() { inp.e.select() }
    });
    this.onset(["value", "off"], () => {
      inp.v(i.value);
      inp.e.disabled = !!i.off;
    });

    return (i.unit ? g("span", 0, [inp, i.unit]) : inp).c("_ in");
  }
  validate(value: number) {
    return validateNumber(this.p, value);
  }
  // calc(...values: number[]) {
  //   var r = 0;
  //   for (let value of values)
  //     r += value || 0;
  //   return r;
  // }
  focus() {
    let { $, p: i } = this;
    (i.unit ? $.first : $).focus();
    return this;
  }
}
export const numbIn = (k: str, req?: bool, text?: str, unit?: str) =>
  new NumbIn({ name: k, req, text, unit });
export function validateNumber(p: NumberFmt & iInput<int>, value: int) {
  let errs: Error[] = [];
  if (value == null) {
    if (p.req)
      errs.push(req());
  } else {
    if (p.integer && Math.floor(value) != value)
      errs.push(error(ErrorType.isDecimal));
    //if (i.unsigned && value < 0)
    //    errs.push({ type: form.ErrorType.isNegative, key });
    let { min, max, omin, omax } = p;

    if ((max != null) && value > max)
      errs.push(error(ErrorType.numberTooBig, "", { max }));
    else if (omax != null && value >= omax)
      errs.push(error(ErrorType.numberTooBig, "", { max: omax }));

    if ((min != null) && value < min)
      errs.push(error(ErrorType.numberTooSmall, "", { min }));
    else if (omin != null && value <= omin)
      errs.push(error(ErrorType.numberTooSmall, "", { min: omin }));
  }
  return errs;
}

// /** number input */
// export const number = (key: str, req?: bool) =>
//   new NumberInput({ key, req });
//------------CHECKBOX------------------------
export const enum CBFmt {
  yesNo = "y",
  checkbox = "c",
  switch = "s"
}
export interface iCheckIn extends iInput<bool> {
  //tp: FT.checkbox,
  fmt?: CBFmt;
  clear?: bool;
  /**place holder */
  ph?: str;
}
export class CheckIn extends Input<bool, iCheckIn>  {
  view() {
    let i = this.p;
    switch (i.fmt) {
      case CBFmt.yesNo:
        return this.bind(div(null, [
          g('label', `${C.checkbox} i`, [
            g("input", {
              type: 'radio',
              value: <any>1,
              name: i.name,
              oninput: () => {
                this.set('value', true);
              }
            }),
            'Sim'
          ]),
          g('label', `${C.checkbox} i`, [
            g("input", {
              type: 'radio',
              name: i.name,
              value: <any>0,
              oninput: () => {
                this.set('value', false);
              }
            }),
            'No'
          ])
        ]), (s) => {
          s.child(i.value ? 0 : 1).first.p<any>('checked', true);
        }, 'value');

      default:
        let inp: G<HTMLInputElement> = g("input", {
          type: 'checkbox',
          name: i.name, id: i.name,
          checked: i.value,
          onclick: i.clear && ((e: MouseEvent) => {
            if (e.altKey)
              setTimeout(() => this.set('value', null));
          }),
          oninput: () => this.set('value', inp.p('checked'))
        }).c(C.switch, i.fmt != CBFmt.checkbox);

        return this.bind(inp, s => s.p({
          checked: i.value,
          placeholder: i.ph || (i.value == null ? '' : i.value ? w.yes : w.no)
        }), 'value');

    }
  }
}

//------------ DATE & TIME ------------------------
export interface iTimeIn extends iInput<str> {
  min?: str | int;
  max?: str | int;
  /**place holder */
  ph?: str;
}
export class TimeIn extends Input<str, iTimeIn> {
  view() {
    let
      _this = this,
      i = this.p;

    return this.bind(g("input").p({
      type: 'time',
      name: i.name, id: i.name,
      placeholder: i.ph,
    }).on('input', function () {
      _this.set('value', this.value + ':00');
    }), (s) => s.p('value', i.value && i.value.slice(0, 5)), 'value');
  }
}

export class DateIn extends Input<str, iTimeIn> {
  view() {
    let i = this.p;
    let inp = g("input", "_ in").p({
      type: "date",
      name: i.name, id: i.name,
      placeholder: i.ph,
      value: i.value
    });
    this.onset("value", () => inp.e.value = i.value);
    return inp.on("input", () => this.set("value", inp.e.value || null));
  }
  get def() {
    return this.p.def == "now" ? new Date().toISOString().slice(0, 10) : null;
  }
  fill(src: Dic<any>, setAsDefault?: boolean): void {
    let k = this.p.name;
    if (k in src) {
      let v = src[k];
      this.value = v ? new Date(v).toISOString().slice(0, 10) : null;
      if (setAsDefault)
        this.set("def", v)
    }
  }
}

export class MonthIn extends Input<str, iTimeIn> {
  view() {
    let
      i = this.p,
      inp = g("input", "_ in").p({
        type: "month",
        name: i.name, id: i.name,
        placeholder: i.ph,
        value: i.value?.slice(0, 7)
      });
    this.onset("value", () => inp.e.value = i.value?.slice(0, 7));
    return inp.on("input", () => this.set("value", inp.e.value || null));
  }
  get def() {
    return this.p.def == "now" ? new Date().toISOString().slice(0, 7) : null;
  }

  submit(data: Dic) {
    data[this.p.name] = this.value ? this.value + "-01" : null;
  }
}

/**date & time input */
export class DTIn extends Input<str, iTimeIn> {
  view() {
    let i = this.p, inp = g("input", "_ in").p({
      type: "datetime-local",
      name: i.name, id: i.name,
      placeholder: i.ph
    }).on("input", () => {
      this.set("value", inp.v() || null);
    });
    return this.bind(inp, () => inp.v(i.value || ""));
  }
}

//------------ SELECT -----------------------
export type iSelectIn<T extends Dic, K extends keyof T = any> = iInput<T[K]> & iSingleSelectBase<T> & {
  /**menu width will change acord to content */
  fluid?: boolean;
}
export class SelectIn<T extends Dic = Dic, K extends keyof T = any> extends Input<T[K], iSelectIn<T, K>, { open: [bool] }> implements SingleSelectBase<K, T> {
  options: L<T, K>;
  get active() { return byKey<T, K>(this.options, this.p.value, this.options.key); }
  constructor(i: iSelectIn<T, K>, options?: Alias<T, T[K]>, key: K = <any>0) {
    super(i);
    i.item ||= v => def(v[1], v[key]);
    this.options = extend<T, T[K]>(options, {
      key, parse: e => isO(e) ? e : <T>{ [key]: e }
    });
  }
  get value() { return this.p.value; }
  set value(v) { this.p.value === v || this.set("value", v) }

  view() {
    let
      { p: i, options } = this,
      label = g("span"),
      items = g("table").on("click", ({ currentTarget: ct, target: t }) =>
        ct != t && (this.set("open", false).value = g(t as Element).closest("tr").d())),
      menu = div("_ menu", items),
      root = selectRoot(this, options, label, menu, v => this.value = v as any).attr({ name: i.name });
    setValue(this, label);
    this.on(e => ("value" in e) && setValue(this, label));

    options.bind(items, {
      insert: v => menuitem(v.i, i.item(v)).d(v[options.key]),
      tag(active, i, p, tag) {
        let s = p.child(i);
        s.c(tag, active);

        if (active) {
          menu.e.scroll({ top: s.p('offsetTop') - menu.p('clientHeight') / 2 + s.p('clientHeight') / 2 });
        }
      }
    });

    return root;
  }
  option(k: T[K]) {
    return this.options.find(k);
  }
}
export interface iMobSelect<T = Dic> extends iInput<Key> {
  item?(v: T): any
}
export class MobSelectIn<T = Dic, K extends keyof T = any> extends Input<Key, iMobSelect<T>, { open: [bool] }> {
  constructor(i: iMobSelect<T>, private options: Alias<T>, private okey?: K) {
    super(i);
  }
  view() {
    let { p, options, okey } = this;
    return g("select", "_ in",
      options.map(v => g("option", { value: v[okey] as any }, p.item(v))))
      .p("name", p.name)
  }
}
//------------ RADIO ------------------------

export type RadioOption = [key: Key, text?: any, icon?: Icon];
export interface iRadioIn extends iInput<Key> {
  //tp: FT.radio,
  options?: (RadioOption | str)[];
  src?: str;
  //groupBy?: Val;
  clear?: bool;
  layout?: 'wrap' | 'column';
}
export class RadioIn extends Input<Key, iRadioIn>{
  view() {
    let i = this.p, o = i.options.map<RadioOption>(v => isS(v) ? [v] : v);
    i.layout ||= l(o) > 3 ? "column" : "wrap";

    return this.bind(g("span", i.layout == 'column' ? "_ col" : '', o.map(([key, text, ico]) => g('label', C.checkbox, [
      g("input", {
        type: 'radio',
        value: <string>key,
        name: i.name,
        checked: key == i.value,
        oninput: () => { this.set('value', key); }
      }),
      ico && icon(ico),
      text || key
    ]))).on('click', e => {
      if (e.altKey) {
        g(<Element>e.currentTarget).queryAll('input').p('checked', false);
        this.set('value', null);
      }
    }), (s) => {
      s.queryAll<HTMLInputElement>('input').forEach(input => {
        input.checked = input.value == i.value;
      });
    }, 'value').css('position', 'relative');
  }
}
//------------ password ------------------------

interface iPWIn extends iInput<str> {
  //tp: FT.password,
  /**auto complete */
  auto?: str;
  capitalCase?: int;
  lowerCase?: int;
  spacialDigit?: int;
  /**place holder */
  ph?: str;
}
/**password input */
export class PWIn extends Input<str, iPWIn> {
  view() {
    let i = this.p, inp = g("input", "_ in").p({
      type: 'password', name: i.name,
      placeholder: i.ph
    }).attr('autocomplete', i.auto || false);
    return inp.on("input", () => this.set("value", inp.e.value));
  }
  validate(value: string) {
    var
      i = this.p,
      // key = i.key,
      errs: Error[] = [];


    if (i.req && !value)
      errs.push(req());

    return errs;
  }
}

export interface iCustomIn<V, O> extends iInput<V> {
  submit?: CustomIn<V, O>["submit"];
  isDef?: CustomIn<V, O>["isDef"];
  validate?: CustomIn<V, O>["validate"];
}
export class CustomIn<V = any, O = {}> extends Input<V> {
  constructor(i: iCustomIn<V, O>, public view?: (this: CustomIn<V> & O) => One) {
    super(i);
    i.submit && (this.submit = i.submit);
    i.isDef && (this.isDef = i.isDef);
    i.validate && (this.validate = i.validate);
  }
}
// export interface iOutputIn extends iInput{
// } 
// export class OutputIn extends Input{
//   constructor(i:iOutputIn){
//     super(i);
//   }
//   view() {
//     return div()
//   }
// }
//------------
interface iCompostIn extends iInput<Dic> {
  sub?: bool | "array";
  bots?: Bot<CompostIn>[];
  labelSz?: int;
}
export class CompostIn extends Input<Dic, iCompostIn> implements FieldGroup {
  #f: FormBase;
  get form() { return this.#f }
  set form(v) {
    this.#f = v;
    for (let i of this.inputs)
      i.form = v;
  }
  constructor(i: iCompostIn, inputs?: Input<any>[]) {
    i.value = null;
    super(i);
    for (let input of this.inputs = filter(inputs))
      input.onset(["value", "off"], () => {
        // input.visited && this.setErrors(input.name, input.invalid);
        let e = g(input).attr("edited", !input.isDef());
        this.form.p.offFN?.(e, !!input.p.off)
        this.set(["value"]);
      });
    // setTimeout(() =>
    // this.p.offFN?.(input.field(this).attr("edited", !input.isDef()), !!input.p.off))
    checkBot(this, i.bots);
  }
  inputs?: Input<any>[];
  get def() { return arrayToDic(this.inputs, v => [v.name, v.def]) }
  get value() { return arrayToDic(this.inputs, v => [v.name, v.value]); }
  set value(v: Dic) {
    this.inputs.forEach(i => i.name in v && (i.value = v ? v[i.name] : i.null));
  }
  view(): G {
    for (let input of this.inputs)
      input.onset('value', () => this.set(['value']));

    return g("span", "_ join", this.inputs);
  }
  fill(value: Dic, setAsDefault?: bool) {
    if (this.p.sub)
      if (!(value = value[this.p.name]))
        return;
    for (let i of this.inputs)
      i.fill(value, setAsDefault);
  }
  validate(v: Dic, omit: bool, focus?: bool) {
    let err: Error[] = [];
    for (let input of this.inputs) {
      let inv = input.invalid(input.value, omit, focus);
      inv && err.push(...inv);

      if (inv && focus) {
        input.focus();
        focus = false;
      }
    }
    return err;
  }
  focus() {
    this.inputs[0]?.focus();
    return this;
  }
  submit(data: Dic, edited: bool, req: bool) {
    let { inputs, p: i } = this;
    if (i.sub) data = data[i.name] = i.sub == "array" ? [] : {};
    for (let inp of edited && !i.sub ? inputs.filter(i => (req && i.p.req) || !i.isDef()) : inputs)
      inp.p.off || inp.submit(data, edited, req);
  }
  input(key: str) {
    for (let input of this.inputs)
      if (input.name == key || (is(input, CompostIn) && (input = input.input(key))))
        return input;
  }
  isDef(v = this.value, def = this.def) {
    for (let i of this.inputs)
      if (!i.isDef(v[i.name], def[i.name]))
        return false;
    return true;
  }
}
export class GroupIn extends CompostIn {
  view(): G { throw 1; }
  field(form?: Form) {
    return this.$ ||= fieldGroup(this.p.text, this.inputs, form, this.p.labelSz);
  }
  observeVisited(handler: (input: Input) => any) {
    for (let i of this.inputs)
      i.observeVisited(handler);
  }
}
