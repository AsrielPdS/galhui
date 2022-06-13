import { div, S, wrap } from "galho";
import { is } from "galho/s";
import { t } from "inutil";
import { bind, orray } from "orray";
import { C, icon } from "./galhui";

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
