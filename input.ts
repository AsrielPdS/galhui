import { div, g, S } from "galho";
import { delay } from "galho/s";
import { $, C, hc, icon, w } from "./galhui";

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
