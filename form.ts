import { div, E, g, m, MRender, One, onfocusout, S, span } from "galho";
import { any, fromArray } from "galho/dic.js";
import { Alias, extend, L } from "galho/orray.js";
import { assign, bool, byKey, date, def, Dic, falses, filter, float, int, isA, isS, isU, Key, l, Primitive, str, Task } from "galho/util.js";
import { $, C, Color, ibt, Icon, icon, menuitem, w } from "./galhui.js";
import { IRoot, Root, setRoot, setValue } from "./hover.js";
import { errorMessage, TextInputTp } from "./io.js";
import { up } from "./util.js";

interface FormValidator {
  query: str;
  type?: str;
  fields: str[];
  msg?: str;
}
interface IDataContext {
  parent?: IDataContext;
  getData?(key: Key, onupdate?: (value: unknown) => void): unknown;
}
export interface IInputContext extends IDataContext {
  inline?: bool;
  /** */
  tp?: str;
}

// export type Error = {
//   tp?: str;
//   info?: str;
//   params?: Dic<Key>;
// } | str;
export type Error = MRender | S | str;

/**coisas executadas quando alguma ação acontece dentro do form */
export interface Bot {
  srcs?: str[];
  tp: str;
}
type BotCall = <T extends Bot = Bot>(this: FormBase<any, any>, src: Dic<any>, opts: T,) => any;

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

export const bots: Dic<BotCall> = {};
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
  /**set true if this form is inside another form
   * when dis is true will be used div tag instead of form tag
   * */
  intern?: bool;
  readOnly?: bool;
  validators?: FormValidator[];
  hidden?: Dic;
  meta?: Dic;
  bots?: Bot[];
  parent?: IDataContext;
}

/** */
export class FormBase<T extends iFormBase = iFormBase, Ev extends FormEvents = FormEvents> extends E<T, Ev> implements IInputContext {
  inputs: Input[];
  constructor(i: T, inputs?: Input[]);
  constructor(inputs: (Input | falses)[]);
  constructor(i: T | (Input | falses)[], inputs?: Input[]) {
    if (isA(i)) {
      inputs = filter(i);
      i = {} as T;
    }
    super(i);

    this.inputs = inputs.map(input => {
      //let input = <Input>Reflect.construct(inputs[i.tp], [i, this]);
      input.onset(["value", "off"], () => {
        input.visited && this.setErrors(input.key, input.invalid);
        this.emit("input", input);
      });
      input.observeVisited(() => this.setErrors(input.key, input.invalid));
      return input;
    });

    if (i.bots)
      for (let bot of i.bots) {
        let srcs: Dic = {}
        let calc = () => bots[bot.tp].call(this, srcs, bot);
        for (let src of bot.srcs)
          srcs[src] = this.getData(src, calc);
      }
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
  /**default data */
  def(): Dic;
  def(value: Dic): this;
  def(value: null): this;
  def(v?: Dic) {
    if (isU(v)) {
      let r: Dic = {};
      for (let { key, def } of this.inputs)
        r[key] = def;
      return r;
    } else this.inputs.forEach(i => v && i.key in v && i.set("def", v?.[i.key]));
  }
  fill(value: Dic, setAsDefault?: bool) {
    if (setAsDefault)
      this.def(value);
    this
      .emit("fill", value).inputs
      .forEach(i => i.fill ? i.fill(value) : i.key in value && (i.value = value[i.key]));
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

  getData(key: Key, onupdate?: (value: unknown) => void) {
    let i = this.i, target: unknown = this.inputs.find(f => f.key == key);

    //se for input
    if (target) {
      onupdate && (<Input>target).on(onupdate);
    }
    //se for meta
    else if (i.hidden && key in i.hidden)
      target = i.hidden[key];
    else if (i.meta && key in i.meta)
      target = i.meta[key];
    else target = i.parent ? i.parent.getData(key, onupdate) : null;

    return target;
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

/** */
export interface iForm extends iFormBase {
  errorDiv?: S;
  outline?: bool;
}

export class Form extends FormBase<iForm> {
  errDiv: S;

  constructor(i: iForm, inputs?: Input[]);
  constructor(inputs: (Input | falses)[]);
  constructor(i: iForm | (Input | falses)[], inputs?: Input[]) {
    super(i as any, inputs as any);
    this.on('input', (input: Input) => setTimeout(() => {
      g(input).parent()?.attr("edited", !input.isDef());
    }));
    this.errDiv = this.i.errorDiv || errorMessage();
  }
  view() {
    let { i, inputs: inp } = this;
    return g(i.intern ? 'div' : 'form', "_ form", [
      fields(inp, def(i.outline, $.oform)),
      this.errDiv
    ]);
  }

  setErrors(key: str, errors?: Error[]) {
    super.setErrors(key, errors);
    this.errDiv.set(renderErrors(this.inputs, this.errors));
  }
}
export function fields(inputs: Input[], outline?: bool) {
  return inputs.map(input => input.field(outline));
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
export interface iInput<V = unknown, D = V> {
  //tp: Key;
  k?: str;
  g?: str[];
  off?: bool;
  /**@default true */
  req?: bool;
  text?: any;
  outline?: bool;
  /**place holder */
  ph?: str;
  value?: V;
  def?: D;
  // side?: bool;
}
export abstract class Input<V = unknown, I extends iInput<V, any> = iInput<V>, A = never, Ev extends Dic<any[]> = {}> extends E<I, Ev> {// & { input: [V] }
  public ctx?: IInputContext
  constructor(i: I) {
    super(i);
    if (isU(i.text)) i.text = def(w[i.k], up(i.k));
    if (isU(i.value)) i.value = this.def;
  }
  get key() { return this.i.k; }
  get value() { return def<V>(this.i.value, null); }
  set value(v) { this.set("value", v); }

  fill?(value: Dic): any;
  get def() { return def(<V>this.i.def, this.null); }
  get inline() { return this.ctx?.inline; }
  isDef(value = this.value, def = this.def) {
    return def === value;
  }
  isNull(value = this.value) { return this.isDef(value, this.null); }

  visited?: bool;
  observeVisited(handler: () => any) {
    onfocusout(g(this), () => {
      this.visited = true;
      handler();
    });
  }
  field(outline: bool): One {
    let i = this.i;
    outline ||= i.outline;
    return div(outline ? "_ oi" : "_ ii", [
      g('label', "hd", i.text).attrs({ for: i.k, title: i.text }),
      g(this, "bd"),
      !!i.req && g('span', "req", '*'),
    ]);
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

  submit(data: Dic, edited?: bool, req?: bool): Task<void>
  submit(data: Dic) {
    data[this.i.k] = this.value;
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
      r = g('textarea', "_ in v").props({
        name: i.k, id: i.k,
        placeholder: i.ph || ''
      }).on('keydown', (e) => {
        if (e.key == "Enter") {
          if (e.ctrlKey)
            e.preventDefault();
          else e.stopPropagation();
        }
      });
    } else r = g("input", "_ in").props({
      type: i.input || 'text',
      name: i.k, id: i.k, placeholder: i.ph || ''
    });
    r.on("input", () => this.set("value", r.e.value || null));
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
  focus() {
    if (this.i.input == 'ta' && this.inline)
      g(this).first().focus();
    else g(this).focus();
    return this;
  }
}
/**text input */
export const textIn = (k: str, req?: bool, input?: TextInputTp | "ta") =>
  new TextIn({ k, req, input });
//------------NUMBER------------------------
export interface NumberFormat {
  min?: int;
  max?: int;
  openMin?: int;
  openMax?: int;
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
        placeholder: this.inline ? i.text : i.ph || '',
        value: i.value
      })
      .on({
        input: () => this.set("value", inp.e.value ? inp.e.valueAsNumber : null),
        focus() { inp.e.select() }
      });
    this.onset("value", () => inp.e.value = <any>i.value);

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
    (i.unit ? $.first() : $).focus();
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
      omin = i.openMin,
      omax = i.openMax;

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
class CheckIn extends Input<bool, iCheckIn>  {
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
          s.child(i.value ? 0 : 1).first().prop('checked', true);
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
/**check box input*/
export const checkIn = (key: str, text?: str) =>
  new CheckIn({ k: key, text });

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

    return this.bind(g("input").props({
      type: 'time',
      name: i.k, id: i.k,
      placeholder: i.ph,
    }).on('input', function () {
      _this.set('value', this.value + ':00');
    }), (s) => s.prop('value', i.value && i.value.slice(0, 5)), 'value');
  }
}

export const time = (key: str, req?: bool) =>
  new TimeIn({ k: key, req });
export interface iDateIn extends iInput<str, str> {
  //tp: FT.date,
  min?: str | int;
  max?: str | int;
}
export class DateIn extends Input<str, iDateIn> {
  view() {
    let
      i = this.i,
      inp = g("input", "_ in").p({
        type: "date",
        name: i.k, id: i.k,
        placeholder: i.ph,
        value: i.value
      })
    this.onset("value", () => inp.e.value = i.value);
    return inp.on("input", () => this.set("value", inp.e.value || null));
  }
  get def() {
    let y: int, m: int, d: int;
    return this.i.def == "now" ? ([y, m, d] = date(new Date()), `${y}-${m}-${d}`) : null;
  }
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
    return this.i.def == "now" ? ([y, m, d] = date(new Date()), `${y}-${m}`) : null;
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
export type iSelectIn<T extends Dic> = iInput<Key> & IRoot<T> & {}
export class SelectIn<T extends Dic = Dic> extends Input<Key, iSelectIn<T>, never, { open: [bool] }> implements Root {
  options: L;
  active: T;
  #l: S;
  constructor(i: iSelectIn<T>, src: Alias<T>, key: keyof T = "key") {
    super(i);
    this.options = extend<T>(src, { key });
    this.onset("value", v => {
      this.active = this.options.find(v.value);
      setValue(this, this.#l)
    });
  }
  // get value() { return this.i.value; }
  // set value(v: Key) {
  //   this.active = this.options.find(v);
  //   setValue(this, this.#l);
  //   this.set("value", v);
  // }
  option(k: Key) { return this.options.find(k); }

  view() {
    //TODO: checar se é mobile e usar o tag select nativo
    let
      i = this.i,
      label = this.#l = g("span"),
      o = this.options,
      menu = div("_ menu", [
        o.bind(g("table"), {
          insert: v => menuitem(0, i.item(v), () => this.value = v[o.key]),
          tag(active, i, p, tag) {
            let s = p.child(i).c(tag, active).e as HTMLElement;
            active && menu.e.scroll({ top: s.offsetTop - menu.e.clientHeight / 2 + s.clientHeight / 2 });
          }
        })
      ]),
      m = setRoot(this, o, label, menu).p({ id: i.k }).c("in");
    setValue(this, label);
    return m;
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
    let i = this.i;
    if (this.inline)
      throw "not implemented";

    return this.bind(span(i.layout == 'column' ? C.menu : '', i.options.map<Option>(v => isS(v) ? [v] : v).map(([key, text, ico]) => g('label', [C.checkbox, "i"], [
      g("input", {
        type: 'radio',
        value: <string>key,
        name: i.k,
        checked: key == i.value,
        oninput: () => { this.set('value', key); }
      }),
      ico && icon(ico),
      text || key
    ]))).on('click', (e: MouseEvent) => {
      if (e.altKey) {
        g(<Element>e.currentTarget).queryAll('input').p('checked', false);
        this.set('value', null);
      }
    }), (s) => {
      s.queryAll<HTMLInputElement>('input').forEach(input => {
        input.checked = input.value == i.value;
      });
    }, 'value').css('position', 'relative');
    //this.fill(options);
    //return e;
  }
}
// export const radio = (key: str, options?: L<Option, str>, req?: bool) =>
//   new RadioInput({ key, req, options });

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
  submit?: (this: CustomIn<V> & O, data: Dic, edited?: bool, req?: bool) => Task<void>;
  
}
export class CustomIn<V, O = {}> extends Input {
  constructor(i: iCustomIn<V, O>, public view: (this: CustomIn<V> & O) => One) {
    super(i);
    i.submit && (this.submit = i.submit)
  }
}
//------------
interface iCompostIn extends iInput<Dic> {
  inputs?: Input<any>[];
  sub?: bool;
}
export class CompostIn extends Input<Dic, iCompostIn> {
  get ins() { return this.i.inputs; }
  get def() { return fromArray(this.ins, v => [v.key, v.def]) }
  view(): S {
    let i = this.i;
    for (let input of i.inputs)
      input.onset('value', () => this.set(['value']));

    return div("_ join", i.inputs);
  }
  get value() { return fromArray(this.ins, v => [v.key, v.value]); }
  set value(v: Dic) {
    this.ins.forEach(i => i.key in v && (i.value = v ? v[i.key] : i.null));
  }
  fill(value: Dic) { this.value = value; }
  validate(v: Dic) {
    let err: Error[] = [];
    for (let i of this.ins)
      err.push(...i.validate(v[i.key]));
    return err;
  }
  focus() {
    this.ins[0]?.focus();
    return this;
  }
  // reset() {
  //   for (let i of this.ins)
  //     i.reset();
  //   return this;
  // }
  submit(data: Dic, edited: bool, req: bool) {
    let { ins, i } = this;
    if (i.sub) data = data[i.k] = {};
    for (let i of edited ? ins.filter(i => (req && i.i.req) || !i.isDef()) : ins)
      data[i.key] = i.value;
  }
  isDef(v = this.value, def = this.def) {
    for (let i of this.ins)
      if (!i.isDef(v[i.key], def[i.key]))
        return false;
    return true;
  }
}

export class GroupIn extends CompostIn {
  constructor(i: iCompostIn) {
    i.outline = true; super(i);
  }
  view() {
    let i = this.i;
    return g("fieldset", "_ g form io", [
      g("legend", 0, i.text),
      fields(i.inputs)
    ])
  }
  field() {
    return this;
  }
}