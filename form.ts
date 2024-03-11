import { Component, G, One, Render, clearEvent, div, g, m, onfocusout } from "galho";
import { HTInput, HTTextArea } from "galho/elements.js";
import orray, { Alias, L, extend } from "galho/orray.js";
import { AnyDic, Dic, Key, Primitive, Task, assign, bool, byKey, call, def, falsy, filter, float, int, is, isA, isO, isS, isU, l, str, unk } from "galho/util.js";
import { $, C, Icon, Label, SelectBase, SingleSelectBase, Size, TextInputTp, busy, cancel, confirm, errorMessage, pSelectBase, iSingleSelectBase, ibt, icon, icons, label, menuitem, modal, selectRoot, setValue, tip, w, close } from "./galhui.js";
import { anyProp, arrayToDic } from "./util.js";

// export type Error = {
//   tp?: str;
//   info?: str;
//   params?: Dic<Key>;
// } | str;
export type Error = Render | G | str;

interface FieldGroup {
  on(e: "input", callback: (input: Input) => any): this;
  input(key: PropertyKey): Input;
}
/**coisas executadas quando alguma ação acontece dentro do form */
type BotCallback<T extends FieldGroup> = (src: Dic<any>, form: T) => any;
export type Bot<T extends FieldGroup = FieldGroup> = PropertyKey[] & {
  srcs: Dic; call: BotCallback<T>
};
export const bot = <T extends FieldGroup = FieldGroup>(src: PropertyKey[], call: BotCallback<T>): Bot<T> =>
  assign(src, { srcs: {}, call });
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

interface FormEvents extends AnyDic<any[]> {
  input: [Input];
  fill: [data: Dic];
  requestsubmit: [e: SubmitEvent];
  submit: [data: Dic];
  cancel: [];
}
export function setupbots(container: Form | CompostIn) {
  if (container.p.bots)
    for (let bot of container.p.bots) {
      let srcs = bot.srcs = {};//, cb = bot.at(-1) as BotCallback<T>;
      for (let field of bot)
        srcs[field] = container.input(field).value;
      setTimeout(bot.call, 0, srcs, container);
    }
  // if (bots) {
  //   // let calc = (input?: Input | void) => input ?
  //   //   srcs[input.name] = input.value :
  //   //   cb(srcs, container);
  //   for (let bot of bots) {
  //     let srcs: AnyDic = {}, cb = bot.at(-1) as BotCallback<T>;

  //     container.on("input", (input) => bot.includes(input.name) && calc(cb, input));
  //     // for (let i = 0; i < bot.length - 1; i++) {
  //     //   let src = bot[i] as str;
  //     //   let inp = container.input(src);
  //     //   srcs[src] = inp.value;
  //     //   inp.onset(["value", "off"], calc);
  //     // }
  //     setTimeout(calc, 0, cb);
  //   }
  // }
}
export interface iFormBase {
  /**@default "form" */
  tag?: keyof HTMLElementTagNameMap
  readOnly?: bool;
  hidden?: Dic;
  // bots?: Bot<any>[];
  /**called when input enter/exit off */
  offFN?: (e: G, isOff: bool) => void;
}
/** */
export class FormBase<T extends iFormBase = any, Ev extends FormEvents = any> extends Component<T, Ev> {
  inputs: Input[];
  constructor(i: T, inputs: (Input | falsy)[]);
  constructor(inputs: (Input | falsy)[]);
  constructor(p: T | (Input | falsy)[], inputs?: (Input | falsy)[]) {
    if (isA(p)) {
      inputs = p;
      p = {} as T;
    }
    super(p);
    this.inputs = filter(inputs)
    // checkBot(this, i.bots);
  }
  view(): One { throw 1; }
  get isDef() {
    for (let input of this.inputs)
      if (!input.isDef())
        return false;

    return true;
  }
  input<T extends Input>(key: PropertyKey) {
    for (let input of this.inputs)
      if (input.name == key || (is(input, CompostIn) && (input = input.input(key))))
        return input as T;
  }
  errors: AnyDic<Error[]> = {};
  setErrors(key: PropertyKey, errors?: Error[]) {
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
  reset(...fields: PropertyKey[]) {
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
export async function dataAsync(form: FormBase, edited?: bool, req?: bool) {
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

export const onOffHide = (e: G, isOff: bool) => e.c("off", isOff);
export const onOffDisable = (e: G, isOff: bool) => e.c("off", isOff);
export interface InputContainer {
  outline?: bool;
  labelSz?: int
  /**called when input enter/exit off */
  offFN?: (e: G, isOff: bool) => void;
}
/** */
export interface iForm extends iFormBase, InputContainer {
  errorDiv?: G;
  bots?: Bot<Form>[];
}
export class Form extends FormBase<iForm> implements FieldGroup {
  errDiv: G;

  constructor(i: iForm, inputs: (Input | falsy)[]);
  constructor(inputs: (Input | falsy)[]);
  constructor(p: iForm | (Input | falsy)[], inputs?: Input[]) {
    super(p as iForm, inputs);
    this.errDiv = (p = this.p).errorDiv || errorMessage();
    if (p.outline == null)
      p.outline = $.oform;
    this.inputs.forEach(this.addInput, this);
    this.on("input", (input) => {
      if ((p as iForm).bots)
        for (let bot of (p as iForm).bots)
          if (bot.includes(input.name)) {
            bot.call(assign(bot.srcs, { [input.name]: input.value }), this);
          }
    });
    setupbots(this);
    // this.p.labelSz ||= 40;
    // this.on('input', (input: Input) => {
    //   let e = input.field(this).attr("edited", !input.isDef());
    //   (p as iForm).offFN?.(e, !!input.p.off)
    // });
  }
  addInput(input: Input) {
    input.form = this;
    input
      .onset(["value", "off"], () => {
        input.visited && this.setErrors(input.name, input.invalid(input.value));
        let e = input.field(this.p).attr("edited", !input.isDef());
        this.p.offFN?.(e, !!input.p.off)
        this.emit("input", input);
      })
      .observeVisited(i => this.setErrors(i.name, i.invalid(i.value)));
  }
  view() {
    let { p: i, inputs: inp } = this;
    return g(i.tag || 'form', "_ form", [
      inp.map(i => i.field(this.p)),
      this.errDiv
    ]);
  }

  setErrors(key: PropertyKey, errors?: Error[]) {
    super.setErrors(key, errors);
    this.errDiv.set(renderErrors(this.inputs, this.errors));
  }
}

// export function mdform(hd: Label, inputs: Input[], cb?: (dt: Dic, form: FormBase) => Task<unk>, confirm?: S<HTMLButtonElement>, noCancel?: bool, sz?: Size): Promise<Dic>
// export function mdform(hd: Label, form: FormBase, cb?: (dt: Dic, form: FormBase) => Task<unk>, confirm?: S<HTMLButtonElement>, noCancel?: bool, sz?: Size): Promise<Dic>
/**modal form */
export function mdform<T = Dic>(hd: Label, form: Input[] | FormBase, cb?: (dt: Dic, form: FormBase) => Task<T | void>, ok = confirm(), noCancel?: bool, sz?: Size) {
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
  name?: PropertyKey;
  info?: str;
  req?: bool;
  outline?: bool;
  text?: Label;
  tip?: any;
  off?: bool;
}
export function field(bd: One, i: Field, container: InputContainer, sz = container.labelSz) {
  let o = def(container.outline, i.outline);
  let t = div("_ " + (o ? "oi" : "ii"), [
    (!o || i.text) && g('label', "hd", [
      i.text,
      i.tip && tip(icon(icons.info), i.tip)
    ]).css("width", `${sz}%`).attr({ for: i.name as str }),
    bd = g(bd, "bd").css("width", `${100 - sz}%`),
    !!i.req && g("span", "req", "*"),
  ]);
  if (i.off)
    container.offFN?.(bd, true);
  return t;
}


export function expand(form: Form, ...main: PropertyKey[]) {
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
// export const text = (v: str) => v && (v[0].toUpperCase() + v.slice(1).replace(/_/g, ' '));
export const up = (v: str): str => v && def(w[v], (v[0].toUpperCase() + v.slice(1).replace(/_/g, ' ')));
export interface pInput<V = unknown, D = V> extends Field {
  //tp: Key;
  value?: V;
  def?: D;
  submit?(data: Dic);
  // side?: bool;
}
export abstract class Input<V = unknown, P extends pInput<V, any> = pInput<V>, Ev extends AnyDic<any[]> = {}> extends Component<P, Ev> {
  constructor(p: P) {
    super(p);
    if (isU(p.text)) p.text = up(p.name as str);
    if (isU(p.value)) p.value = this.def;
  }
  get name() { return this.p.name; }
  get value() { return def<V>(this.p.value, this.null); }
  set value(v) { this.set("value", v); }

  fill?(src: AnyDic, setAsDefault?: bool) {
    let k = this.p.name;
    if (k in src) {
      if (setAsDefault)
        this.set("def", src[k])
      this.value = src[k];
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
    g(this).c("error", state);
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
  field(container: InputContainer, sz?: int) {
    return this.#f ||= field(this, this.p, container, sz);
  }
  submit(this: this, data: AnyDic, edited?: bool, req?: bool): any//Task<void>
  submit(data: AnyDic) {
    let { name, value, submit } = this.p;
    if (submit) submit(data);
    else data[name] = value;
  }
  /**null value used for clear method */
  get null(): V { return null; }
}
export interface Input<V, P extends pInput<V, any>, Ev extends AnyDic<any[]>> {
  form?: FormBase;
}
// function inputBind<I, Inp extends InputElement>(e: E<I>, input: S<Inp>, prop: keyof I, field: keyof Inp = 'value') {
//   e.bind(input, () => input.e[field as str] = e.i[prop], prop);
//   return input.p(field, def<any>(e.i[prop], null)).on('input', () => {
//     let v = <any>input.e[field];
//     e.set(prop, v === '' || (typeof v === 'number' && isNaN(v)) ? null : v);
//   });;
// }

export interface TextInValidation {
  pattern?: RegExp;
  min?: int;
  max?: int;
  length?: int;
}
//------------TEXT------------------------
export interface iTextIn extends pInput<str>, TextInValidation {
  input?: TextInputTp | "ta";
  /**place holder */
  ph?: str;
}
export class TextIn extends Input<str, iTextIn, { input: [str] }> {
  view() {
    let p = this.p, r: G<HTInput | HTTextArea>;
    if (p.input == 'ta') {
      r = g('textarea', "_ in v")
        .on('keydown', (e) => {
          if (e.key == "Enter") {
            if (e.ctrlKey)
              e.preventDefault();
            else e.stopPropagation();
          }
        });
    } else r = g("input", "_ in").p('type', p.input || 'text');
    r.p({
      minLength: p.length || p.min, maxLength: p.length || p.max,
      name: p.name as str, id: p.name as str,
      placeholder: p.ph || ''
    })
      .on({
        input: () => {
          this.emit("input", r.v());
          this.set("value", r.v() || null)
        },
        focus() { r.e.select() }
      });
    // if (p.min) r.e.minLength = p.min;
    // if (p.max) r.e.maxLength = p.max;
    return this.bind(r, () => r.e.value = p.value || '', "value");
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
export type iNumbIn = pInput<int> & NumberFmt & {
  //tp: FT.number,
  unsigned?: bool;
  unit?: str;
  /**place holder */
  ph?: str;
};
export class NumbIn extends Input<float, iNumbIn> {
  view() {
    let i = this.p, inp = <G<HTInput>>g("input", {
      type: 'number',
      placeholder: i.ph || '',
      step: i.integer ? <any>1 : 'any',
      name: i.name as str, id: i.name as str, value: i.value as any,
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
export function validateNumber(p: NumberFmt & pInput<int>, value: int) {
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
export interface iCheckIn extends pInput<bool> {
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
              name: i.name as str,
              oninput: () => {
                this.set('value', true);
              }
            }),
            'Sim'
          ]),
          g('label', `${C.checkbox} i`, [
            g("input", {
              type: 'radio',
              name: i.name as str,
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
        let inp: G<HTInput> = g("input", {
          type: 'checkbox',
          name: i.name as str, id: i.name as str,
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
export interface iTimeIn extends pInput<str> {
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
      name: i.name as str, id: i.name as str,
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
      name: i.name as str, id: i.name as str,
      placeholder: i.ph,
      value: i.value
    });
    this.onset("value", () => inp.e.value = i.value);
    return inp.on("input", () => this.set("value", inp.e.value || null));
  }
  get def() {
    return this.p.def == "now" ? new Date().toISOString().slice(0, 10) : null;
  }
  fill(src: AnyDic<any>, setAsDefault?: boolean): void {
    let k = this.p.name;
    if (k in src) {
      let v = src[k];
      this.value = v ? new Date(v).toISOString().slice(0, 10) : null;
      if (setAsDefault)
        this.set("def", v)
    }
  }
}

const monthV = (v: str) => v?.slice(0, 7) || null;
const dateDefV = (v: "now" | str) => monthV(v == "now" ? new Date().toISOString() : v);
export class MonthIn extends Input<str, iTimeIn> {
  view() {
    let i = this.p;
    let inp = g("input", "_ in").p({
      type: "month",
      name: i.name as str, id: i.name as str,
      placeholder: i.ph,
      value: monthV(i.value),
    });
    ;
    // this.onset("value", () =>);
    return this.bind(inp, (_, p) => {
      if ("max" in p) inp.e.max = p.max as str;
      if ("min" in p) inp.e.min = p.min as str;
      if ("value" in p) inp.e.value = monthV(i.value);
    }).on("input", () => this.set("value", inp.e.value || null));
  }
  get def() { return dateDefV(this.p.def); }
  isDef(value = this.value, def = this.def) {
    return dateDefV(def) === monthV(value);
  }
  submit(data: AnyDic) {
    data[this.p.name] = this.value ? this.value + "-01" : null;
  }
}

/**date & time input */
export class DTIn extends Input<str, iTimeIn> {
  view() {
    let i = this.p, inp = g("input", "_ in").p({
      type: "datetime-local",
      name: i.name as str, id: i.name as str,
      placeholder: i.ph
    }).on("input", () => {
      this.set("value", inp.v() || null);
    });
    return this.bind(inp, () => inp.v(i.value || ""));
  }
}

//------------ SELECT -----------------------
export type iSelectIn<T extends Dic, K extends keyof T = any> = pInput<T[K]> & iSingleSelectBase<T> & {
  /**menu width will change acord to content */
  fluid?: boolean;
}
export class SelectIn<T extends Dic = Dic, K extends keyof T = any> extends Input<T[K], iSelectIn<T, K>, { open: [bool] }> implements SingleSelectBase<K, T> {
  options: L<T, T[K]>;
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
    let { p, options } = this;
    let label = g("span");
    let items = options.bind(g("table"), {
      insert: v => {
        let t = p.item(v);
        return (is(t, G) && t.is("tr") ? t : menuitem(v.i, t)).d(v[options.key])
      },
      tag(active, i, p, tag) {
        let s = p.child(i);
        s.c(tag, active);

        if (active) {
          menu.e.scroll({ top: s.p('offsetTop') - menu.p('clientHeight') / 2 + s.p('clientHeight') / 2 });
        }
      }
    }).on("click", ({ currentTarget: ct, target: t }) =>
      ct != t && (this.set("open", false).value = g(t as Element).closest("tr").d()));
    let menu = div("_ menu", items);
    let root = selectRoot(this, options, label, menu, v => this.value = v as any).attr({ name: p.name as str });
    setValue(this, label);
    this.on(e => ("value" in e) && setValue(this, label));

    return root;
  }
  option(k: T[K]) { return this.options.find(k); }
}

export type pMSelectIn<T extends Dic, K extends keyof T = any> = pInput<L<T[K]>, T[K][]> & pSelectBase & {
  /**menu width will change acord to content */
  fluid?: boolean;
  item?(v: T): any;
  /**placeholder */
  ph?: any;
}
export class MSelectIn<T extends Dic = Dic, K extends keyof T = any> extends Input<L<T[K]>, pMSelectIn<T, K>> {

  options: L<T, T[K]>;
  constructor(p: pMSelectIn<T, K>, options?: Alias<T, T[K]>, key: K = <any>0) {
    super(p);
    p.item ||= v => def(v[1], v[key]);
    (p.value = orray(p.def).on(() => this.set(["value"])))
      .parse = v => p.value.has(v) ? void 0 : v;
    this.options = extend<T, T[K]>(options, { key, parse: e => isO(e) ? e : <T>{ [key]: e } });
  }
  option(k: T[K]) { return this.options.find(k); }
  view(): G {
    let { p, options } = this;
    let label = p.value.bind(div(), {
      insert: k => g("span", "i", [p.item(this.option(k)), close(() => p.value.remove(k))]),
      empty: v => label.c("ph", v).set(v && p.ph)
    });
    let items = g("table").on("click", ({ currentTarget: ct, target: t }) => {
      if (ct != t) {
        this.set("open", false);
        p.value.push(g(t as Element).closest("tr").d());
      }
    });
    let menu = div("_ menu", items);
    let root = selectRoot(this, options, label, menu, v => this.value.push(v as any)).attr({ name: p.name as str });

    options.bind(items, {
      insert: v => {
        let t = p.item(v);
        return (is(t, G) && t.is("tr") ? t : menuitem(v.i, t)).d(v[options.key])
      },
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
  get value() { return this.p.value; }
  set value(v) { this.p.value.set(v); }

  isDef(val = this.value, def = this.def || []) {
    return l(val) == l(def) && val.every(v => def.includes(v));
  }
}

export interface iMobSelect<T = Dic> extends pInput<Key> {
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
      .p("name", p.name as str)
  }
}
//------------ RADIO ------------------------

export type RadioOption = [key: Key, text?: any, icon?: Icon];
export interface iRadioIn extends pInput<Key> {
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
        name: i.name as str,
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

export interface iChecklistIn extends pInput<Key[]> {
  options?: (RadioOption | str)[];
}
export class ChecklistIn extends Input<Key[], iChecklistIn>{
  view() {
    let p = this.p, v = p.value;
    return g("span", "_ col", p.options.map<RadioOption>(v => isS(v) ? [v] : v).map(([key, text, ico]) => g('label', C.checkbox, [
      call(g("input", {
        type: 'checkbox',
        name: `${p.name as Key}_${key}`,
        checked: v.includes(key),
      }), i => i.on("input", () => {
        i.e.checked ? v.push(key) : v.splice(v.indexOf(key), 1);
        this.set(['value'])
      })),
      ico && icon(ico),
      text || key
    ])));
  }
  get def() { return []; }
}

//------------ password ------------------------
interface iPWIn extends pInput<str> {
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
      type: 'password', name: i.name as str,
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

export interface iCustomIn<V, O> extends pInput<V> {
  submit?: CustomIn<V, O>["submit"];
  isDef?: CustomIn<V, O>["isDef"];// (this: CustomIn<V> & O, value?: V, def?: V): bool
  validate?: CustomIn<V, O>["validate"];
  fill?: CustomIn<V, O>["fill"];
}
export class CustomIn<V = any, O = {}> extends Input<V> {
  constructor(i: iCustomIn<V, O>, public view?: (this: CustomIn<V> & O) => One) {
    super(i);
    if (i.submit) this.submit = i.submit;
    if (i.isDef) this.isDef = i.isDef;
    if (i.validate) this.validate = i.validate;
    if (i.fill) this.fill = i.fill;
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
interface iCompostIn extends pInput<Dic>, InputContainer {
  sub?: bool | "array";
  bots?: Bot<CompostIn>[];
  labelSz?: int;
  row?: bool
}
export class CompostIn extends Input<Dic, iCompostIn> implements FieldGroup {
  #f: Form;
  get form() { return this.#f }
  set form(v) {
    this.#f = v;
    for (let i of this.inputs)
      i.form = v;
  }
  subfield(input: Input, container: InputContainer): G;
  subfield(input: Input) {
    return g(input)//.field(container);
  }
  constructor(p: iCompostIn, inputs?: Input<any>[]) {
    p.value = null;
    super(p);
    for (let input of this.inputs = filter(inputs))
      input.onset(["value", "off"], () => {
        // input.visited && this.setErrors(input.name, input.invalid);
        let f = this.form;
        let e = this.subfield(input, f.p).attr("edited", !input.isDef());
        f.p.offFN?.(e, !!input.p.off)
        f.emit("input", input);
        this.set(["value"]);
        if (p.bots)
          for (let bot of p.bots)
            if (bot.includes(input.name)) {
              bot.call(assign(bot.srcs, { [input.name]: input.value }), this);
            }
      });
    setupbots(this);
  }
  inputs?: Input<any>[];
  get def() { return arrayToDic(this.inputs, v => [v.name as str, v.def]) }
  get value() { return arrayToDic(this.inputs, v => [v.name as str, v.value]); }
  set value(v: Dic) {
    this.inputs.forEach(i => i.name in v && (i.value = v ? v[i.name as str] : i.null));
  }
  view(): G {
    for (let input of this.inputs)
      input.onset('value', () => this.set(['value']));

    return g("span", "_ join", this.inputs);
  }
  fill(value: Dic, setAsDefault?: bool) {
    if (this.p.sub)
      if (!(value = value[this.p.name as str]))
        return;
    for (let i of this.inputs)
      i.fill(value, setAsDefault);
  }
  validate(_v: Dic, omit: bool, focus?: bool) {
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
    if (i.sub) data = data[i.name as str] = i.sub == "array" ? [] : {};
    for (let inp of edited && !i.sub ? inputs.filter(i => (req && i.p.req) || !i.isDef()) : inputs)
      inp.p.off || inp.submit(data, edited, req);
  }
  input(key: PropertyKey) {
    for (let input of this.inputs)
      if (input.name == key || (is(input, CompostIn) && (input = input.input(key))))
        return input;
  }
  isDef(v = this.value, def = this.def) {
    for (let i of this.inputs)
      if (!i.isDef(v[i.name as str], def[i.name as str]))
        return false;
    return true;
  }
}
export function fieldGroup(title: Label, inputs: Input[], form?: Form, sz?: int) {
  return g("fieldset", "_ formg", [
    //TODO: remove sub element in label
    g("legend", 0, label(title)),
    inputs.map(i => i.field(form.p, sz))
  ]);
}
export class GroupIn extends CompostIn {
  view(): G { throw 1; }
  subfield(input: Input, container: InputContainer) {
    let p = this.p;
    return input.field(p.row ? { offFN: p.offFN, outline: true } : container, p.labelSz);
  }
  field(container: InputContainer) {
    let { p, inputs } = this;
    return this.$ ||= g("fieldset", "_ formg " + (p.row ? "row" : ""), [
      //TODO: remove sub element in label
      g("legend", 0, label(p.text)),
      inputs.map(i => this.subfield(i, container))
    ]);//fieldGroup(this.p.text, this.inputs, form, this.p.labelSz);
  }
  observeVisited(handler: (input: Input) => any) {
    for (let i of this.inputs)
      i.observeVisited(handler);
  }
}
