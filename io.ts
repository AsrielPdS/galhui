import { cl, clearEvent, delay, div, E, g, S, wrap } from "galho";
import { orray } from "galho/orray.js";
import { Select } from "./dropdown.js";
import { $, body, C, Color, hc, icon, w } from "./galhui.js";
import { mbitem } from "./menu.js";
import { bool, Dic, int, isS, isU, str, t, Task } from "galho/util.js";
import { kbHandler, list } from "./list.js";
import { fluid, popup } from "./hover.js";
import { anim } from "./util.js";

//#region input
export type TextInputTp = "text" | "email" | "url" | "tel";
export type InputTp = TextInputTp | "number" | "search" | "checkbox" | "radio" | "password";
export type Input = S<HTMLInputElement | HTMLTextAreaElement>;

export const input = (type: InputTp, name: str, ph?: str, input?: (e: Event) => any) =>
  g("input", { type, name, placeholder: ph }).c("_ in").on("input", input);

export const textarea = (name: str, ph: str, input?: (text: str) => void) =>
  g("textarea", { name, placeholder: ph }).c("_ in").on("input", input && (function () { input(this.value) }));

export const checkbox = (label: any, input?: (checked: bool) => void) =>
  g("label", hc(C.checkbox), [g("input", { type: "checkbox" }).on("input", input && (function () { input(this.checked) })), label]);

export function search(input?: (value: str) => any) {
  let t = g("input", { type: "search", placeholder: w.search }), i = icon($.i.search);
  input && delay(t, "input", $.delay, () => input(t.e.value));
  return (i ? div(0, [t, i]) : t).c("_ in");
}
export function searcher<T extends Dic>(query: (q: str) => Task<T[]>) {
  let
    dt = orray<T>(),
    menu = list({ kd: false, item: v => [div(0, v.name), g("span", "tag", ["NIF: ", v.nif])] }, dt).c("_ tip"),
    _: () => any,
    focus = () => _ ||= (
      menu.addTo(body),
      anim(() => body.contains(i) ? fluid(i.rect(), menu, "vc") : (_(), _ = null))),
    i: Input = delay(g("input", { type: "search", placeholder: "NIF ou Nome da empresa" })
      .on({
        focus, blur() { _(); _ = null; },
        keydown(e) { kbHandler(dt, e, {}) && clearEvent(e) }
      }),
      "input", $.delay, async () => {
        if (i.e.value) {
          focus();
          dt.set(await query(i.e.value))
        } else { _?.(); _ = null; }
      });
  return i;
}
export const lever = (name: str) => g("input", { type: "checkbox", name }).c(C.lever);


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
      g(limits).c("in");
    }

    return this.bind(div("_ bar pag", [
      i.extreme && mbitem($.i.first, null, () => this.set('pag', 1)),
      mbitem($.i.prev, null, () => this.set('pag', i.pag - 1)),
      output(),
      mbitem($.i.next, null, () => this.set('pag', i.pag + 1)),
      i.extreme && mbitem($.i.last, count, () => this.set('pag', pags)),
      limits && [
        g("hr"),
        limits.on('input', (value) => { this.set('limit', value); })
      ],
      i.viewtotal && [g("hr"), total = output()]
    ]), (s) => {
      if (i.viewtotal)
        total.set(`${Math.min(i.total - i.limit * (i.pag - 1), i.limit || i.total) || 0} / ${i.total || 0}`)
      pags = i.limit ? Math.ceil((i.total || 0) / i.limit) : 1;
      s.c(C.off, !!(pags < 2 && i.hideOnSingle));

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
export const keyVal = (key, val) => g("span", "_ in", [key + ": ", val]);

export const message = (c?: Color, data?) => div(hc(C.message), data).c(c);
export const errorMessage = (data?) => message(data).c(Color.error);
export const tip = (e: S, value) => e.prop("title", value);


export interface IOutput<T> {
  key?: str;
  text?: str;
  fmt?: str;
  value?: T;
  color?: Color;
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
        .attr("class", false)
        .c(cl(C.input, i.color))
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
  ]).c(C.on, !!open).on("click", () => (<S>head).tcls(C.on)),
  wrap(body, C.body)
]);
export function accordion(items: AccordionItem[], i: IAccordion = {}) {
  return orray(items).bind(div("_ accordion"), ([hd, bd], j, p) => {
    p.place(j * 2, [
      hd = div(C.head, [
        t(i.icon) && icon("menuR"),
        hd
      ]).c(C.on, i.def == j).on("click", () => {
        if ((hd as S).is('.' + C.on))
          (<S>hd).c(C.on, false);
        else {
          t(i.single) && p.childs("." + C.head).c(C.on, false);
          (<S>hd).c(C.on);
        }
      }),
      wrap(bd, C.body)
    ]);
  });
}
//#endregion