import { div, g, S } from "galho";
import { is, rect } from "galho/s";
import { call, uuid } from "inutil";
import { C, click, HAlign, icon, Icon } from "./galhui";
import { fluid } from "./hover";
import { CB as WaitCB, tp as WaitTP, wait as _wait, waiter } from "./wait";

 type _MenuItems = Array<S<HTMLTableRowElement> | HTMLTableRowElement | MenuItems> | (() => MenuItems);
export type MenuItems = Task<_MenuItems>;

export function menu(items?: MenuItems) { return div("_ menu", g("table", 0, items)); }

/** */
export const wait = (callback?: WaitCB) =>
  call(g("tr", 0, g("td", 0, _wait(WaitTP.out)).prop("colSpan", 4)), tr => waiter(tr, callback));

  /**menu item */
export const menuitem = (i: Icon, text: any, action?: click, side?) => g("tr", C.item, [
  g("td", 0, icon(i)),
  g("td", 0, text),
  g("td", C.side, side),
  g("td")
]).on("click", action);

/**check box */
export function menucb(checked: bool, text: any, toggle?: (this: S<HTMLInputElement>, checked: bool) => any, id = uuid(4), side?: str) {
  let input = g("input").props({ id, checked, indeterminate: checked == null, type: "checkbox" });
  toggle && input.on("input", () => toggle.call(input, input.e.checked));
  return g("tr", C.item, [
    g("td", 0, input.on("click", e => e.stopPropagation())),
    g("td", 0, g("label", 0, text).prop("htmlFor", id)),
    side && div(C.side, side),
    g("td"),
  ]);
}
export const submenu = (i: Icon, text: any, items: MenuItems) => call(g("tr", C.item, [
  g("td", 0, icon(i)),
  g("td", 0, text),
  g("td"),
  g("td", 0, icon("menuR"))
]), e => {
  let mn: S;
  e.on("click", () => {
    is(e.tcls(C.on), '.' + C.on) ?
      fluid(rect(e),  (mn ||= g("table", C.menu, items)).addTo(e)) :
      mn.remove();
  })
});
export const menusep =()=>g("tr").cls(C.separator);

export type MBItems = any;//Array<One | Array<Items>>;
/** */
export const menubar = (...items: MBItems) => div("_ bar", items);
/** */
export const right = () => div(HAlign.right);
export const mbitem = (i: Icon, text: any, action?: (e: MouseEvent) => any) => g("button", "i", [icon(i), text]).on("click", action);

/**menubar separator */
export const mbsep = () => g("hr");