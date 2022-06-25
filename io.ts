import { cl, div, E, g, S, wrap } from "galho";
import { delay, is } from "galho/s";
import { isS, isU, t } from "inutil";
import  { orray,bind } from "orray";
import { Select } from "./dropdown";
import { $, C, Color, hc, ibutton, icon, w } from "./galhui";

//#region input
export type InputTp = "text" | "number" | "search" | "checkbox" | "radio" | "password";
export type Input = S<HTMLInputElement | HTMLTextAreaElement>;

export const input = (type: InputTp, name: str, ph?: str, input?: (e: Event) => any) =>
  g("input", { type, name, placeholder: ph }).cls(hc(C.input)).on("input", input);

export const textarea = (name: str, ph: str, input?: (text: str) => void) =>
  g("textarea", { name, placeholder: ph }).cls(hc(C.input)).on("input", input && (function () { input(this.value) }));

export const checkbox = (label: any, input?: (checked: bool) => void) =>
  g("label", hc(C.checkbox), [g("input", { type: "checkbox" }).on("input", input && (function () { input(this.checked) })), label]);

export function search(input?: (value: str) => any) {
  let t = g("input", { type: "search", placeholder: w.search }), i = icon($.i.search);
  input && delay(t, "input", $.delay, () => input(t.e.value));
  return (i ? div(0, [t, i]) : t).cls(hc(C.input));
}
export const lever = (name: str) => g("input", { type: "checkbox", name }).cls(C.lever);


export interface IPagging {
  limit?: number;
  pag?: number;
  total?: number;
  hideOnSingle?: boolean;
  setlimit?: boolean;
  minLimit?: number;
  viewtotal?: boolean;
  extreme?: boolean;
}
export class Pagging extends E<IPagging>{
  view() {
    let
      i = this.i,
      pags: number,
      count = g('span'),
      total: S;
    if (i.setlimit) {
      var limits = new Select<number>({
        value: i.limit,
        fluid: true,
        clear: false,
      }, [
        i.minLimit,
        i.minLimit * 2,
        i.minLimit * 4,
        i.minLimit * 10,
        i.minLimit * 20,
        { key: 0, text: 'Mostrar todos' }
      ]);
      g(limits).cls(C.full);
    }

    return this.bind(div("_ bar pag", [
      i.extreme && ibutton($.i.first, null, () => this.set('pag', 1)),
      ibutton($.i.prev, null, () => this.set('pag', i.pag - 1)),
      output(),
      ibutton($.i.next, null, () => this.set('pag', i.pag + 1)),
      i.extreme && ibutton($.i.last, count, () => this.set('pag', pags)),
      limits && [
        g("hr"),
        limits.on('input', (value) => { this.set('limit', value); })
      ],
      i.viewtotal && [ g("hr"), total = div(C.item)]
    ]), (s) => {
      if (i.viewtotal)
        total.set(`${Math.min(i.total - i.limit * (i.pag - 1), i.limit || i.total) || 0} / ${i.total || 0}`)
      pags = i.limit ? Math.ceil((i.total || 0) / i.limit) : 1;
      s.cls(C.off, !!(pags < 2 && i.hideOnSingle));

      let t = i.extreme ? 0 : 1
      s.child(2 - t).set(i.pag);

      s.childs<HTMLButtonElement>(0, 2 - t).prop('disabled', i.pag == 1);
      s.childs<HTMLButtonElement>(3 - t, 5 - t * 2).prop('disabled', i.pag == pags);

      count.set(pags);
    });
  }

  get pags() {
    let { limit: l, total: t } = this.i;
    return l ? Math.ceil((t || 0) / l) : 1
  }
}
//#endregion

//#region output

export const label = (content) => g("label", hc(C.label), content);
export const output = (...content) => g("span", hc(C.label), content);
export const keyVal = (key, val) => g("span", hc(C.input), [key + ": ", val]);

export const message = (c?: Color, data?) => div(hc(C.message), data).cls(c);
export const errorMessage = (data?) => message(data).cls(Color.error);
export const tip = (e: S, value) => e.prop("title", value);


export interface IOutput<T> {
  key?: str;
  text?:str;
  fmt?: str;
  value?: T;
  color?:Color;
  def?/*: Child*/;

}
export class Output<T = unknown> extends E<IOutput<T>>{
  constructor(model: IOutput<T>);
  constructor(text: string, value: T, format?: string)
  constructor(text: string | IOutput<T>, value?: T, fmt?: string) {
    super(isS(text) ? { text, value, fmt } : text);
  }
  key() { return this.i.key; }
  value(): T;
  value(value: T): this;
  value(value?: T) {
    if (isU(value))
      return this.i.value;
    else this.set('value', value)
    return this;
  }
  view() {
    let i = this.i;
    return this.bind(div(), (s) => {
      s
      .uncls().cls(cl(C.input,i.color))
        .set([
          i.text, ': ',
          $.fmt(i.value, i.fmt, i.def && { def: i.def })
        ]);
    });
  }
}

//#endregion

//#region layouts

export type AccordionItem = [head: any, body: any];
export interface IAccordion {
  icon?: bool, single?: bool, def?: int
}
export const hidden = (head: any, body: any, open?: bool) => div(["_", C.accordion], [
  head = div(C.head, [
    icon("menuR"),
    head
  ]).cls(C.on, !!open).on("click", () => (<S>head).tcls(C.on)),
  wrap(body, C.body)
]);
export function accordion(items: AccordionItem[], i: IAccordion = {}) {
  return bind(orray(items), div("_ accordion"), ([hd, bd], j, p) => {
    p.place(j * 2, [
      hd = div(C.head, [
        t(i.icon) && icon("menuR"),
        hd
      ]).cls(C.on, i.def == j).on("click", () => {
        if (is(<S>hd,'.'+C.on))
          (<S>hd).cls(C.on, false);
        else {
          t(i.single) && p.childs("." + C.head).cls(C.on, false);
          (<S>hd).cls(C.on);
        }
      }),
      wrap(bd, C.body)
    ]);
  });
}
//#endregion