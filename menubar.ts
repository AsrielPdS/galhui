import { cl, div, g, One } from "galho";
import { $, C, HAlign, hc, icon, Icon } from "./galhui";

export type Items = any;//Array<One | Array<Items>>;
export const menubar = (...items: Items) => div("_ bar", items);
export const item = (i: Icon, text: any, action?: (e: MouseEvent) => any) => g("button", C.item, [icon(i), text]).on("click", action);
export const right = () => div(HAlign.right);
export const sep = () => g("hr");