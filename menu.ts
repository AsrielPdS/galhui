import { cl, div, g, Input, S } from "galho";
import { bool, call, Task, uuid } from "./util.js";
import { C, click, HAlign, icon, Icon } from "./galhui.js";
import { fluid } from "./hover.js";
import { CB as WaitCB, tp as WaitTP, wait as _wait, waiter } from "./wait.js";

type _MenuItems = Array<S<HTMLTableRowElement> | HTMLTableRowElement | MenuItems> | (() => MenuItems);
export type MenuItems = Task<_MenuItems>;

export function menu(items?: MenuItems) { return div("_ menu", g("table", 0, items)); }

/** */
export const wait = (callback?: WaitCB) =>
  call(g("tr", 0, g("td", 0, _wait(WaitTP.out)).prop("colSpan", 4)), tr => waiter(tr, callback));

/**menu item */
export const menuitem = (i: Icon, text: any, action?: click, side?:any) => g("tr", C.item, [
  g("td", 0, icon(i)),
  g("td", 0, text),
  g("td", C.side, side),
  g("td")
]).on("click", action);

/**checkbox */
export function menucb(checked: bool, text: any, toggle?: (this: S<HTMLInputElement>, checked: bool) => any, id = uuid(4), disabled?: bool) {
  let input = g("input", { id, checked, disabled, indeterminate: checked == null, type: "checkbox" });
  toggle && input.on("input", () => toggle.call(input, (input as Input).e.checked));
  return g("tr", cl("i", disabled && C.disabled), [
    g("td", 0, input.on("click", e => e.stopPropagation())),
    g("td", 0, g("label", 0, text).prop("htmlFor", id)),
    g("td"), g("td")
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
    e.tcls(C.on).is('.' + C.on) ?
      fluid(e.rect(), (mn ||= g("table", C.menu, items)).addTo(e)) :
      mn.remove();
  })
});
export const menusep = () => g("tr").cls(C.separator);

export type MBItems = any;//Array<One | Array<Items>>;
/** */
export const menubar = (...items: MBItems) => div("_ bar", items);
/** */
export const right = () => div(HAlign.right);
export const mbitem = (i: Icon, text: any, action?: (e: MouseEvent) => any) => g("button", "i", [icon(i), text]).on("click", action);

/**menubar separator */
export const mbsep = () => g("hr");
/**menubar checkbox */
export function barcb(checked: bool, text: any, toggle?: (this: S<HTMLInputElement>, checked: bool) => any, disabled?: bool) {
  let input = g("input", { checked, disabled, indeterminate: checked == null, type: "checkbox" });
  toggle && input.on("input", () => toggle.call(input, (input as Input).e.checked));
  return g("label", cl("i", disabled && C.disabled), [input, text]);
}