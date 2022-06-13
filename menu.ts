import { div, g, S } from "galho";
import { is } from "galho/s";
import { call, uuid } from "inutil";
import { C, click, fluid, icon, Icon } from "./galhui";
import { CB as WaitCB, tp as WaitTP, wait as _wait, waiter } from "./wait";

export type Items = Array<S<HTMLTableRowElement> | HTMLTableRowElement | Items> | (() => Items);

export const wait = (callback?: WaitCB) =>
  call(g("tr", 0, g("td", 0, _wait(WaitTP.out)).prop("colSpan", 4)), tr => waiter(tr, callback));
/**menu item */
export const i = (i: Icon, text: any, action?: click, side?) => g("tr", C.item, [
  g("td", 0, icon(i)),
  g("td", 0, text),
  g("td", C.side, side),
  g("td")
]).on("click", action);
/**check box */
export function cb(checked: bool, text: any, toggle?: (this: S<HTMLInputElement>, checked: bool) => any, id = uuid(4), side?: str) {

  let input = g("input").props({ id, checked, indeterminate: checked == null, type: "checkbox" });
  toggle && input.on("input", () => toggle.call(input, input.e.checked));
  return g("tr", C.item, [
    g("td", 0, input.on("click", e => e.stopPropagation())),
    g("td", 0, g("label", 0, text).prop("htmlFor", id)),
    side && div(C.side, side),
    g("td"),
  ]);
}
/** sub menu */
export const sub = (i: Icon, text: any, items: Items) => call(g("tr", C.item, [
  g("td", 0, icon(i)),
  g("td", 0, text),
  g("td"),
  g("td", 0, icon("menuR"))
]), e => {
  let mn: S;
  e.on("click", () => {
    is(e.tcls(C.on), '.' + C.on) ?
      fluid(e, (mn ||= g("table", C.menu, items)).addTo(e)) :
      mn.remove();
  })
});
export const hr = () => g("tr").cls(C.separator);