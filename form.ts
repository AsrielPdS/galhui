import { clearEvent, div, E, g, HSElement, m, MRender, One, onfocusout, S } from "galho";
import { any, fromArray } from "galho/dic.js";
import { Alias, extend, L } from "galho/orray.js";
import { assign, bool, byKey, def, Dic, edate, falses, filter, float, int, isA, isO, isS, isU, Key, l, Primitive, str, Task, unk, z } from "galho/util.js";
import { $, busy, C, cancel, Color, confirm, ibt, Icon, icon, Label, label, menuitem, Size, w } from "./galhui.js";
import { errorMessage, IRoot, mdOnBlur, modal, Root, setRoot, setValue, TextInputTp, tip } from "./io.js";
import { up } from "./util.js";

interface FormValidator {
  query: str;
  type?: str;
  fields: str[];
  msg?: str;
}

// export type Error = {
//   tp?: str;
//   info?: str;
//   params?: Dic<Key>;
// } | str;
export type Error = MRender | S | str;

/**coisas executadas quando alguma ação acontece dentro do form */
type BotCallback = (src: Dic<any>, form: FormBase<any, any>) => any;
export type Bot = [...src: str[], call: BotCallback];

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
interface EError extends MRender { tp: ErrorType, params?: Dic }
export function error(tp: ErrorType, msg?: str, params?: Dic): EError { return { tp, params, render: () => msg } }
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

export interface iFormBase {
  /**@default "form" */
  tag?: keyof HTMLElementTagNameMap
  readOnly?: bool;
  validators?: FormValidator[];
  hidden?: Dic;
  // meta?: Dic;
  bots?: Bot[];
}

/** */
export class FormBase<T extends iFormBase = iFormBase, Ev extends FormEvents = FormEvents> extends E<T, Ev> {
  inputs: Input[];
  constructor(i: T, inputs: (Input | falses)[]);
  constructor(inputs: (Input | falses)[]);
  constructor(i: T | (Input | falses)[], inputs?: (Input | falses)[]) {
    if (isA(i)) {
      inputs = i;
      i = {} as T;
    }
    inputs = filter(inputs);
    super(i);

    (this.inputs = inputs as Input[]).forEach(this.addInput, this);

    if (i.bots) {
      let form = this;
      for (let bot of i.bots) {
        let srcs: Dic = {}, cb = z(bot) as BotCallback;
        function calc(this: Input | void) {
          if (this)
            srcs[this.key] = this.value;
          cb(srcs, form);
        }
        for (let i = 0; i < bot.length - 1; i++) {
          let src = bot[i] as str;
          let inp = this.input(src);
          srcs[src] = inp.value;
          inp.onset(["value", "off"], calc);
        }
        calc();
      }
    }
  }
  addInput(input: Input) {
    input.onset(["value", "off"], () => {
      input.visited && this.setErrors(input.key, input.invalid);
      this.emit("input", input);
    });
    input.observeVisited(input => this.setErrors(input.key, input.invalid));
  }
  view(): One { throw 1; }
  get isDef() {
    for (let input of this.inputs)
      if (!input.isDef())
        return false;

    return true;
  }
  input(key: str) { return byKey(this.inputs, key); }
  errors: Dic<Error[]> = {};
  setErrors(key: str, errors?: Error[]) {
    this.errors[key] = errors;
    this.input(key)?.error(!!errors);
  }
  valid(omit?: bool, focus = !omit) {
    if (omit)
      for (let input of this.inputs)
        if (input.invalid) return false;

    for (let input of this.inputs) {
      let inv = input.invalid;
      this.setErrors(input.key, inv);

      if (inv && focus) {
        input.focus();
        focus = false;
      }
    }
    //use isto para incluir erros não gerados por inputs direitamente
    return !any(this.errors, e => e && l(e));
  }
  focus() {
    for (let input of this.inputs)
      if (!input.i.off) {
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
    for (let i of l(fields) ? this.inputs.filter(i => fields.includes(i.key)) : this.inputs) {
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

    let r: Dic = assign({}, this.i.hidden);
    for (let input of edited ? inputs.filter(i => (req && i.i.req) || !i.isDef()) : inputs)
      input.i.off || input.submit(r, edited, req);
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

  let r: Dic = assign({}, form.i.hidden);
  for (let input of edited ? inputs.filter(i => (req && i.i.req) || !i.isDef()) : inputs)
    input.i.off || await input.submit(r, edited, req);
  form.emit("submit", r);
  return r;
}
function renderErrors(inputs: Input[], errs: Dic<Error[]>) {
  let result: S[][] = [];

  for (let key in errs) {
    let i = byKey(inputs, key);
    result.push(errs[key]?.map(err => div(0, [i && [g("b", 0, i.i.text), ": "], err])));
    // {
    // (isS(error)) && (error = { tp: error });
    // result.push(div(0, [
    //   i && [g("b", 0, i.i.text), ": "],
    //   errors[error.tp](),
    //   error.info && g("sub", 0, error.info),
    // ]));
    // }
  }
  return result;
}

export const onOffHide = (e: S, isOff: bool) =>
  e.parent.c("_ off", isOff);
export const onOffDisable = (e: S, isOff: bool) =>
  e.parent.c("_ off", isOff);
/** */
export interface iForm extends iFormBase {
  errorDiv?: S;
  outline?: bool;
  /**called when input enter/exit off */
  offFN?: (e: S, isOff: bool) => void;
}

export class Form extends FormBase<iForm> {
  errDiv: S;

  constructor(i: iForm, inputs: (Input | falses)[]);
  constructor(inputs: (Input | falses)[]);
  constructor(i: iForm | (Input | falses)[], inputs?: Input[]) {
    super(i as any, inputs as any);
    this.on('input', (input: Input) => setTimeout(() => {
      let e = g(input);
      e.parent?.attr("edited", !input.isDef());
      this.i.offFN?.(e, !!input.i.off);
    }));
    this.errDiv = this.i.errorDiv || errorMessage();
    if (this.i.outline == null)
      this.i.outline = $.oform;
  }
  view() {
    let { i, inputs: inp } = this;
    return g(i.tag || 'form', "_ form", [
      fields(inp, this),
      this.errDiv
    ]);
  }

  setErrors(key: str, errors?: Error[]) {
    super.setErrors(key, errors);
    this.errDiv.set(renderErrors(this.inputs, this.errors));
  }
}
/**modal form */
export function mdform(hd: Label, inputs: Input[], cb: (dt: Dic, form: FormBase) => Task<unk>, confirm?: S<HTMLButtonElement>, noCancel?: bool, sz?: Size): Form
export function mdform(hd: Label, form: FormBase, cb: (dt: Dic, form: FormBase) => Task<unk>, confirm?: S<HTMLButtonElement>, noCancel?: bool, sz?: Size): Form
export function mdform(hd: Label, form: Input[] | FormBase, cb: (dt: Dic, form: FormBase) => Task<unk>, ok = confirm(), noCancel?: bool, sz?: Size) {
  if (isA(form))
    form = new Form(form);

  modal(
    label(hd, "hd"),
    g(form.set("tag", "div"), "bd"),
    (cl, md) => [
      ok.p({ type: "submit" }).on("click", async e => {
        e.preventDefault();
        if ((form as Form).valid()) {
          clearEvent(e);
          await busy(md, () => cb((form as Form).data(), form as Form));
          cl();
        }
      }),
      noCancel || cancel(cl)
    ], sz,
    !noCancel, true
  );
  form.focus();
  return form;
}
export interface Field {
  k?: str;
  req?: bool;
  outline?: bool;
  text?: Label;
  tip?: any;
  off?: bool;
}
export function field(bd: One, i: Field, form?: Form) {
  let t = div(def(form?.i.outline, i.outline) ? "oi" : "ii", [
    g('label', "hd", [
      i.text,
      i.tip && tip(icon($.i.info), i.tip)
    ]).attrs({ for: i.k }), bd = g(bd, "bd"),
    !!i.req && g('span', "req", '*'),
  ]);
  if (i.off)
    form?.i.offFN?.(bd, true);
  return t;
}
export function fields(inputs: Input[], form?: Form): One[];
export function fields(inputs: Input[], form?: Form) {
  return inputs.map(input =>
    input.field ?
      input.field(form) :
      field(input, input.i, form));
}

export function fieldGroup(title: Label, inputs: Input[], form?: Form) {
  return g("fieldset", "_ formg", [
    //TODO: remove sub element in label
    g("legend", 0, label(title)),
    fields(inputs, form)
  ]);
}
export function expand(form: Form, ...main: str[]) {
  for (let input of form.inputs)
    g(input).c(C.side, !main.includes(input.key));
  g(form).add(m(
    div(["ft", "_" + C.side], [
      g("span", 0, "Mostrar todos"),
      ibt($.i.down, null)
    ]),
    div(["ft", C.side], [
      g("span", 0, "Mostrar principais"),
      ibt($.i.up, null),
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
export interface iInput<V = unknown, D = V> extends Field {
  //tp: Key;
  /**place holder */
  ph?: str;
  value?: V;
  def?: D;
  // side?: bool;
}
export abstract class Input<V = unknown, I extends iInput<V, any> = iInput<V>, A = never, Ev extends Dic<any[]> = {}> extends E<I, Ev> {// & { input: [V] }
  constructor(i: I) {
    super(i);
    if (isU(i.text)) i.text = def(w[i.k], up(i.k));
    if (isU(i.value)) i.value = this.def;
  }
  get key() { return this.i.k; }
  get value() { return def<V>(this.i.value, null); }
  set value(v) { this.set("value", v); }

  fill?(src: Dic, setAsDefault?: bool) {
    let { k } = this.i;
    if (k in src) {
      this.value = src[k];
      if (setAsDefault)
        this.set("def", src[k])
    }
  }
  get def() { return def(<V>this.i.def, this.null); }
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
  get invalid() {
    let e = this.i.off ? [] : this.validate(this.value);
    return l(e) ? e : null;
  }
  validate(value: V): Error[] {
    let
      i = this.i,
      errs: Error[] = [];

    if (i.req && this.isNull(value))
      errs.push(req());

    return errs;
  }
  field?(form?: Form): One;
  submit(this: this, data: Dic, edited?: bool, req?: bool): Task<void>
  submit(data: Dic) {
    let { k, value } = this.i;
    data[k] = value;
  }
  /**null value used for clear method */
  get null(): V { return null; }
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
}
export class TextIn extends Input<str, iTextIn> {
  view() {
    var i = this.i, r: S<HTMLInputElement | HTMLTextAreaElement>;
    if (i.input == 'ta') {
      r = g('textarea', "_ in v").p({
        name: i.k, id: i.k,
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
      name: i.k, id: i.k, placeholder: i.ph || ''
    });
    r.on({
      input: () => this.set("value", r.e.value || null),
      focus() { r.e.select() }
    });
    return this.bind(r, () => r.e.value = i.value || '', "value");
  }
  validate(value: string) {
    var
      i = this.i,
      errs: Error[] = [];

    if (value) {
      if (i.pattern && !(<RegExp>i.pattern).test(value))
        errs.push(error(ErrorType.invalidFormat, w.invalidFmt));

      if (i.max && value.length > i.max)
        errs.push(error(ErrorType.textTooLong, "", { max: i.max }));
      if (i.min && value.length < i.min)
        errs.push(error(ErrorType.textTooShort, "", { min: i.min }));

    } else if (i.req)
      errs.push(req());

    return errs;
  }
}
/**text input */
export const textIn = (k: str, req?: bool, input?: TextInputTp | "ta") =>
  new TextIn({ k, req, input });
//------------NUMBER------------------------
export interface NumberFormat {
  min?: int;
  max?: int;
  /**open min */
  omin?: int;
  /**open max */
  omax?: int;
  format?: str;
  integer?: bool;
}
export type iNumbIn = iInput<int> & NumberFormat & {
  //tp: FT.number,
  unsigned?: bool;
  unit?: str;
};
export class NumbIn extends Input<float, iNumbIn> {
  view() {
    let i = this.i, inp = <S<HTMLInputElement>>g("input")
      .p({
        type: 'number',
        name: i.k, id: i.k,
        step: i.integer ? <any>1 : 'any',
        placeholder: i.ph || '',
        min: i.min || i.omin, max: i.max || i.omax,
        value: i.value
      })
      .on({
        input: () => this.set("value", inp.e.value ? inp.e.valueAsNumber : null),
        focus() { inp.e.select() }
      });
    this.onset(["value", "off"], () => {
      inp.e.value = <any>i.value;
      inp.e.disabled = !!i.off;
    });

    return (i.unit ? div(0, [inp, i.unit]) : inp).c("_ in");
  }
  validate(value: number) {
    return validateNumber(this.i, value);
  }
  // calc(...values: number[]) {
  //   var r = 0;
  //   for (let value of values)
  //     r += value || 0;
  //   return r;
  // }
  focus() {
    let { $, i } = this;
    (i.unit ? $.first : $).focus();
    return this;
  }
}
export const numbIn = (k: str, req?: bool, text?: str, unit?: str) =>
  new NumbIn({ k, req, text, unit });
export function validateNumber(i: NumberFormat & iInput<int>, value: int) {
  let errs: Error[] = [];
  if (value == null) {
    if (i.req)
      errs.push(req());
  } else {
    if (i.integer && Math.floor(value) != value)
      errs.push(error(ErrorType.isDecimal));
    //if (i.unsigned && value < 0)
    //    errs.push({ type: form.ErrorType.isNegative, key });
    let
      max = i.max,
      min = i.min,
      omin = i.omin,
      omax = i.omax;

    if ((max != null) && value > max)
      errs.push(error(ErrorType.numberTooBig, "", { max: max }));
    else if (omax != null && value >= omax)
      errs.push(error(ErrorType.numberTooBig, "", { max: omax }));

    if ((min != null) && value < min)
      errs.push(error(ErrorType.numberTooSmall, "", { min: min }));
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
}
export class CheckIn extends Input<bool, iCheckIn>  {
  view() {
    let i = this.i;
    switch (i.fmt) {
      case CBFmt.yesNo:
        return this.bind(div(null, [
          g('label', [C.checkbox, "i"], [
            g("input", {
              type: 'radio',
              value: <any>1,
              name: i.k,
              oninput: () => {
                this.set('value', true);
              }
            }),
            'Sim'
          ]),
          g('label', [C.checkbox, "i"], [
            g("input", {
              type: 'radio',
              name: i.k,
              value: <any>0,
              oninput: () => {
                this.set('value', false);
              }
            }),
            'No'
          ])
        ]), (s) => {
          s.child(i.value ? 0 : 1).first.prop('checked', true);
        }, 'value');

      default:
        let inp: S<HTMLInputElement> = g("input", {
          type: 'checkbox',
          name: i.k, id: i.k,
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
  //tp: FT.time,
  min?: str | int;
  max?: str | int;
}
export class TimeIn extends Input<str, iTimeIn> {
  view() {
    let
      _this = this,
      i = this.i;

    return this.bind(g("input").p({
      type: 'time',
      name: i.k, id: i.k,
      placeholder: i.ph,
    }).on('input', function () {
      _this.set('value', this.value + ':00');
    }), (s) => s.p('value', i.value && i.value.slice(0, 5)), 'value');
  }
}

export const time = (key: str, req?: bool) =>
  new TimeIn({ k: key, req });
export interface iDateIn extends iInput<str> {
  //tp: FT.date,
  min?: str | int;
  max?: str | int;
}
export class DateIn extends Input<str, iDateIn> {
  view() {
    let i = this.i;
    let inp = g("input", "_ in").p({
      type: "date",
      name: i.k, id: i.k,
      placeholder: i.ph,
      value: i.value
    });
    console.log(i.value);
    this.onset("value", () => inp.e.value = i.value);
    return inp.on("input", () => this.set("value", inp.e.value || null));
  }
  get def() {
    return this.i.def == "now" ? dateISO() : null;
  }
}
function dateISO(v = new Date()) {
  let [y, m, d] = edate(v);
  return `${y}-${(m + "").padStart(2, "0")}-${(d + "").padStart(2, "0")}`;
}

export const dateIn = (key: str, req?: bool, def?: str) =>
  new DateIn({ k: key, req, def });

export class MonthIn extends Input<str, iDateIn> {
  view() {
    let
      i = this.i,
      inp = g("input", "_ in").p({
        type: "month",
        name: i.k, id: i.k,
        placeholder: i.ph,
        value: i.value?.slice(0, 7)
      });
    this.onset("value", () => inp.e.value = i.value?.slice(0, 7));
    return inp.on("input", () => this.set("value", inp.e.value || null));
  }
  get def() {
    let y: int, m: int, d: int;
    return this.i.def == "now" ? ([y, m, d] = edate(new Date()), `${y}-${m}`) : null;
  }

  submit(data: Dic) {
    data[this.i.k] = this.value ? this.value + "-01" : null;
  }
}
export interface iDTIn extends iInput<str> {
  //tp: FT.date,
  min?: str;
  max?: str;
}
export class DTIn extends Input<str, iDTIn> {
  view() {
    let i = this.i, inp = g("input", "_ in").props({
      type: "datetime-local",
      name: i.k, id: i.k,
      placeholder: i.ph
    }).on("input", () => {
      this.set("value", inp.e.value || null);
    });
    return this.bind(inp, () => inp.e.value = i.value || "");
  }
}
//------------ SELECT -----------------------
export type iSelectIn<T extends Dic, K extends keyof T = any> = iInput<T[K]> & IRoot<T> & {
  /**menu width will change acord to content */
  fluid?: boolean;
}
export class SelectIn<T extends Dic = Dic, K extends keyof T = any> extends Input<T[K], iSelectIn<T, K>, never, { open: [bool] }> implements Root {
  options: L<T, K>;
  get active() { return byKey(this.options, this.i.value); }
  constructor(i: iSelectIn<T, K>, options?: Alias<T, T[K]>, key: keyof T = <any>0) {
    super(i);
    i.item ||= (v) => def(v[1], v[key]);
    this.options = extend<T, T[K]>(options, {
      key, parse: (e) => isO(e) ? e : <T>{ [key]: e }
    });
  }
  get value() { return this.i.value; }
  set value(v) { this.i.value === v || this.set("value", v) }

  view() {
    let
      { i, options } = this,
      label = g("span"),
      items = g("table").on("click", ({ currentTarget: ct, target: t }) =>
        ct != t && (this.set("open", false).value = g(t as Element).closest("tr").d())),
      menu = div("_ menu", items),
      root = setRoot(this, options, label, menu).attrs({ name: i.k });
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
export class MobSelectIn<T = Dic, K extends keyof T = any> extends Input<Key, iMobSelect<T>, never, { open: [bool] }> {
  constructor(i: iMobSelect<T>, private options: Alias<T>, private okey?: K) {
    super(i);
  }
  view() {
    let { i, options, okey } = this;
    return g("select", "_ in",
      options.map(v => g("option", { value: v[okey] as any }, i.item(v))))
      .p({ name: i.k, placeholder: i.ph })
  }
}
//------------ RADIO ------------------------

type Option = [key: Key, text?: str, icon?: Icon];
export interface iRadioIn extends iInput<Key> {
  //tp: FT.radio,
  options?: (Option | str)[];
  enum?: str;
  //groupBy?: Val;
  clear?: bool;
  layout?: 'wrap' | 'column';
}
export class RadioIn extends Input<Key, iRadioIn>{
  view() {
    let i = this.i, o = i.options.map<Option>(v => isS(v) ? [v] : v);
    i.layout ||= l(o) > 3 ? "column" : "wrap";

    return this.bind(g("span", i.layout == 'column' ? "_ col" : '', o.map(([key, text, ico]) => g('label', C.checkbox, [
      g("input", {
        type: 'radio',
        value: <string>key,
        name: i.k,
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
}
/**password input */
export class PWIn extends Input<str, iPWIn> {
  view() {
    let i = this.i, inp = g("input", "_ in").p({
      type: 'password', name: i.k,
      placeholder: i.ph
    }).attr('autocomplete', i.auto || false);
    return inp.on("input", () => this.set("value", inp.e.value));
  }
  validate(value: string) {
    var
      i = this.i,
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
}
export class CustomIn<V, O = {}> extends Input<V> {
  constructor(i: iCustomIn<V, O>, public view: (this: CustomIn<V> & O) => One) {
    super(i);
    i.submit && (this.submit = i.submit);
    i.isDef && (this.isDef = i.isDef);
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
  sub?: bool;
}
export class CompostIn extends Input<Dic, iCompostIn> {
  constructor(i: iCompostIn, inputs?: Input<any>[]) {
    i.value = null;
    super(i);
    for (let input of this.inputs = inputs)
      input.onset(["value", "off"], () => this.set(["value"]));
  }
  inputs?: Input<any>[];
  get def() { return fromArray(this.inputs, v => [v.key, v.def]) }
  get value() { return fromArray(this.inputs, v => [v.key, v.value]); }
  set value(v: Dic) {
    this.inputs.forEach(i => i.key in v && (i.value = v ? v[i.key] : i.null));
  }
  view(): S {
    for (let input of this.inputs)
      input.onset('value', () => this.set(['value']));

    return div("_ join", this.inputs);
  }
  fill(value: Dic, setAsDefault?: bool) {
    for (let i of this.inputs)
      i.fill(value, setAsDefault);
  }
  validate(v: Dic) {
    let err: Error[] = [];
    for (let i of this.inputs)
      err.push(...i.validate(v[i.key]));
    return err;
  }
  focus() {
    this.inputs[0]?.focus();
    return this;
  }
  // reset() {
  //   for (let i of this.ins)
  //     i.reset();
  //   return this;
  // }
  submit(data: Dic, edited: bool, req: bool) {
    let { inputs: ins, i } = this;
    if (i.sub) data = data[i.k] = {};
    for (let i of edited ? ins.filter(i => (req && i.i.req) || !i.isDef()) : ins)
      data[i.key] = i.value;
  }
  isDef(v = this.value, def = this.def) {
    for (let i of this.inputs)
      if (!i.isDef(v[i.key], def[i.key]))
        return false;
    return true;
  }
}
export class GroupIn extends CompostIn {
  view(): S { throw 1; }
  field(form?: Form) {
    return this.$ ||= fieldGroup(this.i.text, this.inputs, form);
  }
  observeVisited(handler: (input: Input) => any) {
    for (let i of this.inputs)
      i.observeVisited(handler);
  }
}
