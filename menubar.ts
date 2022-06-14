import { cl, div, g, One } from "galho";
import { $, C, HAlign, hc, icon, Icon } from "./galhui";

export type Items = any;//Array<One | Array<Items>>;
export const menubar = (...items: Items) => div("_ bar", items);
export const item = (i: Icon, text: any, action?: (e: MouseEvent) => any) => g("button", "i", [icon(i), text]).on("click", action);
export const a = (i: Icon, text: any,href?:str) => g("a", "i", [icon(i), text]).prop("href", href);
export const right = () => div(HAlign.right);
export const sep = () => g("hr");