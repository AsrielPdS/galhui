import { Component, G, type One, type Render, clearEvent, div, g, m, onfocusout } from "galho";
import type { HTInput, HTTextArea } from "galho/elements.js";
import orray, { type Alias, L, extend } from "galho/orray.js";
import type { AnyDic, Dic, Key, Primitive, Task, bool, falsy, float, int, str } from "galho/util.js";
import { assign, byKey, call, def, filter, is, isA, isO, isS, isU, l } from "galho/util.js";
import type { Icon, Label, SingleSelectBase, Size, TextInputTp, iSingleSelectBase, pSelectBase } from "./galhui.js";
import { $, C, busy, cancel, close, confirm, errorMessage, ibt, icon, icons, label, menuitem, modal, selectRoot, setValue, tip, w } from "./galhui.js";
import { anyProp, arrayToDic, date, dateTime, month } from "./util.js";

/** A form error: a renderable, a DOM node (`G`) or a plain string. */
export type Error = Render | G | str;

interface FieldGroup {
  on(e: "input", callback: (input: Input) => any): this;
  input(key: PropertyKey): Input;
}

/** Callback function signature for form bot operations. */
type BotCallback<T extends FieldGroup> = (src: Dic<any>, form: T) => any;

/** Bot configuration: a list of source keys mapping to a callback triggered on source field updates. */
export type Bot<T extends FieldGroup = FieldGroup> = PropertyKey[] & {
  srcs: Dic;
  call: BotCallback<T>;
};

/**
 * Creates a `Bot` instance from source fields keys and target action callback.
 * @param src Source fields keys.
 * @param call Action callback.
 */
export const bot = <T extends FieldGroup = FieldGroup>(src: PropertyKey[], call: BotCallback<T>): Bot<T> =>
  assign(src, { srcs: {}, call });

/** Types representing standard validation errors. */
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

interface EError extends Render {
  tp: ErrorType;
  params?: Dic;
}

/**
 * Instantiates a validation error wrapper.
 * @param tp Error category enum.
 * @param msg Custom detailed details output message.
 * @param params Details layout parameters.
 */
export const error = (tp: ErrorType, msg?: str, params?: Dic): EError =>
  ({ tp, params, render: () => msg });

/**
 * Standard required validator error helper.
 */
export const req = () => error(ErrorType.required, w.required);

/** Translation key errors dictionary map. */
export type Errors = Dic<() => any>;

interface FormEvents extends AnyDic<any[]> {
  input: [Input];
  fill: [data: Dic];
  requestsubmit: [e: SubmitEvent];
  submit: [data: Dic];
  cancel: [];
}

/**
 * Starts up field data synchronization trackers on containers.
 * @param container Input fields parent elements.
 */
export function setupbots(container: Form | CompostIn) {
  if (container.p.bots)
    for (let bot of container.p.bots) {
      let srcs = bot.srcs = {};
      for (let field of bot)
        srcs[field] = container.input(field).value;
      setTimeout(bot.call, 0, srcs, container);
    }
}

/** Configuration interface mapping common form parameters. */
export interface iFormBase {
  /**
   * HTML tag mapping key representation.
   * @default "form"
   */
  tag?: keyof HTMLElementTagNameMap;
  /** Disables updating form control fields. */
  readOnly?: bool;
  /** Hidden form control values dataset. */
  hidden?: Dic;
  /** Visibility toggle callback. */
  offFN?: (e: G, isOff: bool) => void;
}

/**
 * Base form layout class mapping validation, elements query, reset, and submittal states.
 */
export class FormBase<T extends iFormBase = any, Ev extends FormEvents = any> extends Component<T, Ev> {
  /** List of tracked inputs. */
  inputs: Input[];
  constructor(i: T, inputs: (Input | falsy)[]);
  constructor(inputs: (Input | falsy)[]);
  constructor(p: T | (Input | falsy)[], inputs?: (Input | falsy)[]) {
    if (isA(p)) {
      inputs = p;
      p = {} as T;
    }
    super(p);
    this.inputs = filter(inputs);
  }
  view(): One { throw 1; }
  /** Returns whether all input controls match default constraints value configurations. */
  get isDef() {
    for (let input of this.inputs)
      if (!input.isDef())
        return false;
    return true;
  }
  /** Locates input instances in form controls tree key match. */
  input<T extends Input>(key: PropertyKey) {
    for (let input of this.inputs)
      if (input.name == key || (is(input, CompostIn) && (input = input.input(key))))
        return input as T;
  }
  /** Dictionary mapping inputs names to lists of outstanding validation errors. */
  errors: AnyDic<Error[]> = {};
  /**
   * Updates error logs mapping input control states.
   * @param key Tracked input name.
   * @param errors Validation logs details configuration.
   */
  setErrors(key: PropertyKey, errors?: Error[]) {
    this.errors[key] = errors;
    this.input(key)?.error(!!errors);
  }
  /**
   * Triggers validations checklist tracking.
   * @param omit Skips logging error banners update states.
   * @param focus Moves document page focus targeting invalid element.
   */
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
    return !anyProp(this.errors, e => e && l(e));
  }
  /** Highlights the first active form control interface tracking focus. */
  focus() {
    for (let input of this.inputs)
      if (!input.p.off) {
        input.focus();
        break;
      }
    return this;
  }
  /**
   * Pre-loads input states dataset contents.
   * @param value Control values configuration dict.
   * @param setAsDefault Lock inputs values as standard form values settings configurations.
   */
  fill(value: Dic, setAsDefault?: bool) {
    this
      .emit("fill", value).inputs
      .forEach(i => i.fill(value, setAsDefault));
    return this;
  }
  /**
   * Restores input value defaults.
   * @param fields Targeted control fields. If empty, resets all.
   */
  reset(...fields: PropertyKey[]) {
    for (let i of l(fields) ? this.inputs.filter(i => fields.includes(i.name)) : this.inputs) {
      i.visited = false;
      i.value = i.def;
    }
    return this;
  }
  /**
   * Compiles layout fields input values.
   * @param edited Aggregates only modified values logs.
   * @param req Forces presence of required values settings.
   */
  data(edited?: bool, req?: bool) {
    let inputs = this.inputs;
    let r: Dic = assign({}, this.p.hidden);
    for (let input of edited ? inputs.filter(i => (req && i.p.req) || !i.isDef()) : inputs)
      input.p.off || input.submit(r, edited, req);
    this.emit("submit", r);
    return r;
  }
  /**
   * Compiles values logs format mapping standard multipart FormData formats.
   * @param edited Aggregates modified properties.
   * @param required Includes required properties values.
   */
  formData(edited?: bool, required?: bool) {
    let
      r = new FormData(),
      data = this.data(edited, required);
    for (let key in data)
      r.append(key, <str>data[key]);
    return r;
  }
}

/**
 * Asynchronous compilation mapping inputs submission callback actions.
 * @param form Target FormBase instance.
 * @param edited Aggregates modified properties.
 * @param req Includes required properties.
 */
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
  }
  return result;
}

/**
 * Class switcher callback setting hidden states.
 * @param e Target element wrapper.
 * @param isOff Off status flag.
 */
export const onOffHide = (e: G, isOff: bool) => e.c("off", isOff);

/**
 * Class switcher callback setting disabled states.
 * @param e Target element wrapper.
 * @param isOff Off status flag.
 */
export const onOffDisable = (e: G, isOff: bool) => e.c("off", isOff);

/** Standard wrapper style constraints interface. */
export interface InputContainer {
  outline?: bool;
  labelSz?: int;
  /** Visibility toggle callback. */
  offFN?: (e: G, isOff: bool) => void;
}

/** Form layout settings. */
export interface iForm extends iFormBase, InputContainer {
  errorDiv?: G;
  bots?: Bot<Form>[];
}

/**
 * Concrete Form component wrapper layout, linking child element events.
 */
export class Form extends FormBase<iForm> implements FieldGroup {
  /** Validation details display output container. */
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
  }
  /** Registers inputs elements callbacks. */
  addInput(input: Input) {
    input.form = this;
    input
      .onset(["value", "off"], () => {
        input.visited && this.setErrors(input.name, input.invalid(input.value));
        let e = input.field(this.p).attr("edited", !input.isDef());
        this.p.offFN?.(e, !!input.p.off);
        this.emit("input", input);
      })
      .observeVisited(i => this.setErrors(i.name, i.invalid(i.value)));
  }
  view() {
    let { p, inputs } = this;
    return g(p.tag || 'form', "_ form", [
      inputs.map(i => i.field(this.p)),
      this.errDiv
    ]);
  }
  setErrors(key: PropertyKey, errors?: Error[]) {
    super.setErrors(key, errors);
    this.errDiv.set(renderErrors(this.inputs, this.errors));
  }
}

/**
 * Standard modal wrapper manager prompting users filling form control options layout.
 * @param hd Prompt heading context labels.
 * @param form Display controls input elements tree.
 * @param cb Modal validation confirmation submittal callback.
 * @param ok Confirmation action buttons layout.
 * @param noCancel Forces presence confirmation keys skipping cancel.
 * @param sz Sizing container configuration.
 */
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
        noCancel || cancel(() => { cl(); res(null); })
      ], sz,
      !noCancel
    );
    (form as Form).focus();
  });
}

/** Input layouts labels formatting parameters setup. */
export interface Field {
  name?: PropertyKey;
  req?: bool;
  outline?: bool;
  text?: Label;
  tip?: any;
  off?: bool;
}

/**
 * Standard outer wrapper container formatting control element headers.
 * @param bd Value inputs elements content container.
 * @param i Fields labels and tooltip config details parameters.
 * @param container Outer constraints styling config.
 * @param sz Width percentage sizes distribution.
 */
export function field(bd: One, i: Field, container: InputContainer, sz = container.labelSz) {
  let o = def(i.outline, container.outline);
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

/**
 * Form values drawer visibility layout configurations.
 * @param form Form container instance.
 * @param main Display control keys logs.
 */
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

/**
 * Checks document page controls constraints validation logs.
 * @param e Target HTML form reference element.
 */
export function valid(e: HTMLFormElement) {
  for (let c = 0; c < e.length; c++) {
    let i = e[c] as HTMLInputElement;
    if (!i.validity.valid)
      return false;
  }
  return true;
}

/**
 * Gathers target page HTML elements inputs values.
 * @param e HTML Form element.
 */
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

/**
 * Capitalizes string and formats words replacing underscore symbols with spacing.
 * @param v Source label key.
 */
export const up = (v: str): str => v && def(w[v], (v[0].toUpperCase() + v.slice(1).replace(/_/g, ' ')));

/** Inputs options parameters interface. */
export interface pInput<V = unknown, D = V> extends Field {
  value?: V;
  def?: D;
  submit?(data: Dic): any;
}

/**
 * Base abstract Class defining input controllers state variables lifecycle.
 */
export abstract class Input<V = unknown, P extends pInput<V, any> = pInput<V>, Ev extends AnyDic<any[]> = {}> extends Component<P, Ev> {
  constructor(p: P) {
    super(p);
    if (isU(p.text)) p.text = up(p.name as str);
    if (isU(p.value)) p.value = this.def;
  }
  /** Key control identifier. */
  get name() { return this.p.name; }
  /** Current value object. */
  get value() { return def<V>(this.p.value, this.null); }
  set value(v) { this.set("value", v); }

  /** Loads inputs dataset properties. */
  fill?(src: AnyDic, setAsDefault?: bool) {
    let k = this.p.name;
    if (k in src) {
      if (setAsDefault)
        this.set("def", src[k]);
      this.value = src[k];
    }
  }
  /** Default fallback value configuration. */
  get def() { return def(<V>this.p.def, this.null); }
  /** Verifies if parameter value equals standard preset default options. */
  isDef(value = this.value, def = this.def) {
    return def === value;
  }
  /** Verifies if key values match empty control state definitions. */
  isNull(value = this.value) { return this.isDef(value, this.null); }

  /** Identifies whether users interacted focus controls. */
  visited?: bool;
  /** Subscribes callbacks tracking focus-out elements occurrences. */
  observeVisited(handler: (input: Input) => any) {
    onfocusout(g(this), () => {
      this.visited = true;
      handler(this);
    });
  }

  /** Triggers component error state classes display switches. */
  error(state: bool) {
    g(this).c("error", state);
    return this;
  }
  /** Run validations constraints returns arrays of logged errors. */
  invalid(value: V, omit?: bool, focus?: bool) {
    if (this.p.off) return null;
    let v = this.validate(value, omit, focus);
    return l(v) ? v : null;
  }
  validate(value: V, omit?: bool, focus?: bool): Error[];
  validate(value: V): Error[] {
    return (this.p.req && this.isNull(value)) ? [req()] : [];
  }
  #f: G;
  /** Returns standard fields wraps formatting control elements labels. */
  field(container: InputContainer, sz?: int) {
    return this.#f ||= field(this, this.p, container, sz);
  }
  /** Handles values submittal compilations logs updates. */
  submit(this: this, data: AnyDic, edited?: bool, req?: bool): any;
  submit(data: AnyDic) {
    let { name, value, submit } = this.p;
    if (submit) submit(data);
    else data[name] = value;
  }
  /** Standard empty fallback configuration values. */
  get null(): V { return null; }
}

export interface Input<V, P extends pInput<V, any>, Ev extends AnyDic<any[]>> {
  form?: FormBase;
}

/** Configuration interface mapping text validation metrics. */
export interface TextInValidation {
  pattern?: RegExp;
  min?: int;
  max?: int;
  length?: int;
}

/** Standard email validations checking regular expression string. */
export const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

/** Text control inputs configurations details. */
export interface iTextIn extends pInput<str>, TextInValidation {
  rows?: int;
  input?: TextInputTp | "ta";
  ph?: str;
}

/** Text control input component wrapper class. */
export class TextIn extends Input<str, iTextIn, { input: [str] }> {
  view() {
    let p = this.p, r: G<HTInput | HTTextArea>;
    if (p.input == 'ta') {
      r = g('textarea', "_ in v")
        .p("rows", p.rows || 4)
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
          this.set("value", r.v() || null);
        },
        focus() { r.e.select(); }
      });
    return this.bind(r, () => r.e.value = p.value || '', "value");
  }
  validate(value: string) {
    let p = this.p;
    let errs: Error[] = [];

    if (value) {
      if (p.pattern && !p.pattern.test(value))
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

/**
 * Text inputs component instantiation helper.
 * @param k Element values control index keys.
 * @param req Validation required parameters constraints.
 * @param input Elements design layout setting.
 */
export const textIn = (k: str, req?: bool, input?: TextInputTp | "ta") =>
  new TextIn({ name: k, req, input });

/** Standard number validations configurations setting. */
export interface NumberFmt {
  min?: int;
  max?: int;
  omin?: int;
  omax?: int;
  integer?: bool;
}

/** Number input configuration details parameters. */
export type iNumbIn = pInput<int> & NumberFmt & {
  unsigned?: bool;
  unit?: str;
  ph?: str;
};

/** Number control inputs element component class. */
export class NumbIn extends Input<float, iNumbIn> {
  view() {
    let p = this.p, inp = <G<HTInput>>g("input", {
      type: 'number',
      placeholder: p.ph || '',
      step: p.integer ? <any>1 : 'any',
      name: p.name as str, id: p.name as str, value: p.value as any,
      min: (p.min ?? p.omin) as any, max: (p.max ?? p.omax) as any,
      oninput: () => this.value = inp.v() ? inp.e.valueAsNumber : null,
      onfocus() { inp.e.select(); }
    });
    this.onset(["value", "off"], () => {
      inp.v(p.value);
      inp.e.disabled = !!p.off;
    });

    return (p.unit ? g("span", 0, [inp, p.unit]) : inp).c("_ in");
  }
  validate(value: number) {
    return validateNumber(this.p, value);
  }
  focus() {
    let { $, p: i } = this;
    (i.unit ? $.first : $).focus();
    return this;
  }
}

/**
 * Number inputs builder component helper.
 * @param k Values namespace identifier.
 * @param req Required status validation flag.
 * @param text Labels override text parameter.
 * @param unit Measurement values text display labels.
 */
export const numbIn = (k: str, req?: bool, text?: str, unit?: str) =>
  new NumbIn({ name: k, req, text, unit });

/**
 * Helper executing general numeric logic rules validation checks.
 * @param p Number control parameters.
 * @param value Control input value.
 */
export function validateNumber(p: NumberFmt & pInput<int>, value: int) {
  let errs: Error[] = [];
  if (value == null) {
    if (p.req)
      errs.push(req());
  } else {
    if (p.integer && Math.floor(value) != value)
      errs.push(error(ErrorType.isDecimal));
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

/** Checkboxes display formatting options. */
export const enum CBFmt {
  yesNo = "y",
  checkbox = "c",
  switch = "s"
}

/** Checkbox configuration parameters. */
export interface iCheckIn extends pInput<bool> {
  fmt?: CBFmt;
  clear?: bool;
  ph?: str;
}

/** Checkbox input component wrapper. */
export class CheckIn extends Input<bool, iCheckIn> {
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

/** Date and time input options. */
export interface iTimeIn extends pInput<str> {
  min?: str | int;
  max?: str | int;
  ph?: str;
}

/** Time selector input control component wrapper. */
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

/** Date selector input control component wrapper. */
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
    return this.p.def == "now" ? date() : null;
  }
  fill(src: AnyDic<any>, setAsDefault?: boolean): void {
    let k = this.p.name;
    if (k in src) {
      let v = src[k];
      this.value = v ? new Date(v).toISOString().slice(0, 10) : null;
      if (setAsDefault)
        this.set("def", v);
    }
  }
}

const dateDefV = (v: "now" | str) => month(v == "now" ? void 0 : v);

/** Month selector input control component wrapper. */
export class MonthIn extends Input<str, iTimeIn> {
  view() {
    let i = this.p;
    let inp = g("input", "_ in").p({
      type: "month",
      name: i.name as str, id: i.name as str,
      placeholder: i.ph,
      value: month(i.value),
    });
    return this.bind(inp, (_, p) => {
      if ("max" in p) inp.e.max = p.max as str;
      if ("min" in p) inp.e.min = p.min as str;
      if ("value" in p) inp.e.value = month(i.value);
    }).on("input", () => this.set("value", inp.e.value || null));
  }
  get def() { return dateDefV(this.p.def); }
  isDef(value = this.value, def = this.def) {
    return dateDefV(def) === month(value);
  }
  submit(data: AnyDic) {
    data[this.p.name] = this.value ? this.value + "-01" : null;
  }
}

/** Datetime selector input control component wrapper. */
export class DTIn extends Input<str, iTimeIn> {
  get def() {
    return this.p.def == "now" ? dateTime(void 0, ' ', true) : null;
  }
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

/** Selection choices inputs configuration setup parameters. */
export type iSelectIn<T extends Dic, K extends keyof T = any> = pInput<T[K]> & iSingleSelectBase<T> & {
  fluid?: boolean;
};

/** Select single option control component class. */
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
  set value(v) { this.p.value === v || this.set("value", v); }

  view() {
    let { p, options } = this;
    let label = g("span");
    let items = options.bind(g("table"), {
      insert: v => {
        let t = p.item(v);
        return (is(t, G) && t.is("tr") ? t : menuitem(v.i, t)).d(v[options.key]);
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
    let root: G = selectRoot(this, options, label, menu, v => this.value = v as any).attr({ name: p.name as str });
    setValue(this, label);
    this.on(e => ("value" in e) && setValue(this, label));

    return root;
  }
  option(k: T[K]) { return this.options.find(k); }
}

/** Multi-selection inputs config interface setup parameters. */
export type pMSelectIn<T extends Dic, K extends keyof T = any> = pInput<L<T[K]>, T[K][]> & pSelectBase & {
  fluid?: boolean;
  item?(v: T): any;
  ph?: any;
};

/** Select multi-options control component class. */
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
        return (is(t, G) && t.is("tr") ? t : menuitem(v.i, t)).d(v[options.key]);
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

/** Mobile select options parameters configuration. */
export interface iMobSelect<T = Dic> extends pInput<Key> {
  item?(v: T): any;
}

/** Mobile select input dropdown component. */
export class MobSelectIn<T = Dic, K extends keyof T = any> extends Input<Key, iMobSelect<T>, { open: [bool] }> {
  constructor(i: iMobSelect<T>, private options: Alias<T>, private okey?: K) {
    super(i);
  }
  view() {
    let { p, options, okey } = this;
    return g("select", "_ in",
      options.map(v => g("option", { value: v[okey] as any }, p.item(v))))
      .p("name", p.name as str);
  }
}

/** Radio selections option parameters array. */
export type RadioOption = [key: Key, text?: any, icon?: Icon];

/** Radio checklist inputs configuration options. */
export interface iRadioIn extends pInput<Key> {
  options?: (RadioOption | str)[];
  src?: str;
  clear?: bool;
  layout?: 'wrap' | 'column';
}

/** Radio options single selection list component. */
export class RadioIn extends Input<Key, iRadioIn> {
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

/** Multiple select checkboxes setup configuration details. */
export interface iChecklistIn extends pInput<Key[]> {
  options?: (RadioOption | str)[];
}

/** Multiple choice select checklist control elements list. */
export class ChecklistIn extends Input<Key[], iChecklistIn> {
  view() {
    let p = this.p, v = p.value;
    return g("span", "_ col", p.options.map<RadioOption>(v => isS(v) ? [v] : v).map(([key, text, ico]) => g('label', C.checkbox, [
      call(g("input", {
        type: 'checkbox',
        name: `${p.name as Key}_${key}`,
        checked: v.includes(key),
      }), i => i.on("input", () => {
        i.e.checked ? v.push(key) : v.splice(v.indexOf(key), 1);
        this.set(['value']);
      })),
      ico && icon(ico),
      text || key
    ])));
  }
  get def() { return []; }
}

interface iPWIn extends pInput<str> {
  auto?: str;
  capitalCase?: int;
  lowerCase?: int;
  spacialDigit?: int;
  ph?: str;
}

/** Password text input control control components. */
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
      errs: Error[] = [];

    if (i.req && !value)
      errs.push(req());

    return errs;
  }
}

/** Custom input configuration setup parameters. */
export interface iCustomIn<V, O> extends pInput<V> {
  submit?: CustomIn<V, O>["submit"];
  isDef?: CustomIn<V, O>["isDef"];
  validate?: CustomIn<V, O>["validate"];
  fill?: CustomIn<V, O>["fill"];
}

/** Custom developer defined components controls extender wrapper. */
export class CustomIn<V = any, O = {}> extends Input<V> {
  constructor(i: iCustomIn<V, O>, public view?: (this: CustomIn<V> & O) => One) {
    super(i);
    if (i.submit) this.submit = i.submit;
    if (i.isDef) this.isDef = i.isDef;
    if (i.validate) this.validate = i.validate;
    if (i.fill) this.fill = i.fill;
  }
}

interface iCompostIn extends pInput<Dic>, InputContainer {
  sub?: bool | "array";
  bots?: Bot<CompostIn>[];
  labelSz?: int;
  row?: bool;
}

/**
 * Composite group inputs fields class controller mapping multiple sub-fields.
 */
export class CompostIn extends Input<Dic, iCompostIn> implements FieldGroup {
  #f: Form;
  get form() { return this.#f; }
  set form(v) {
    this.#f = v;
    for (let i of this.inputs)
      i.form = v;
  }
  subfield(input: Input, container: InputContainer): G;
  subfield(input: Input) {
    return g(input);
  }
  constructor(p: iCompostIn, inputs?: Input<any>[]) {
    p.value = null;
    super(p);
    for (let input of this.inputs = filter(inputs))
      input.onset(["value", "off"], () => {
        let f = this.form;
        let e = this.subfield(input, f.p).attr("edited", !input.isDef());
        f.p.offFN?.(e, !!input.p.off);
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
  get def() { return arrayToDic(this.inputs, v => [v.name as str, v.def]); }
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
    if (this.p.sub) {
      value = value[this.p.name as str];
      if (!value) return;
    }
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

/**
 * Field set border groups constructor.
 * @param title Fields set label title.
 * @param inputs Form controls list.
 * @param form Form container instance settings.
 * @param sz Sizing columns distribution.
 */
export function fieldGroup(title: Label, inputs: Input[], form?: Form, sz?: int) {
  return g("fieldset", "_ formg", [
    g("legend", 0, label(title)),
    inputs.map(i => i.field(form.p, sz))
  ]);
}

/** Grouped composite fields fieldset class controller container. */
export class GroupIn extends CompostIn {
  view(): G { throw 1; }
  subfield(input: Input, container: InputContainer) {
    let p = this.p;
    return input.field(p.row ? { offFN: p.offFN, outline: true } : container, p.labelSz);
  }
  field(container: InputContainer) {
    let { p, inputs } = this;
    return this.$ ||= g("fieldset", "_ formg " + (p.row ? "row" : ""), [
      g("legend", 0, label(p.text)),
      inputs.map(i => this.subfield(i, container))
    ]);
  }
  observeVisited(handler: (input: Input) => any) {
    for (let i of this.inputs)
      i.observeVisited(handler);
  }
}
