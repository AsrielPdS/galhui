import { ANYElement, cl, div, g, isE, Render, S, svg, toSVG, wrap } from "galho";
import { arr, Arr, Dic, falses, float, int, isS, str } from "galho/util.js";

declare global {
  namespace GalhoUI {
    interface Words {
      cancel?: str;
      confirm?: str;
      search?: str;
      yes?: str;
      no?: str;
      camera?: str;
      save?: str;
    }
    interface Settings {
      /**shortcuts */
      sc?: { edit?: str[]; remove?: str[]; },
      // /**class */
      // c: str;

      /**icon scale */
      is?: str;
      delay?: int;

      /**icons */
      i?: Dic<Icon> & {
        /**dropdown */
        dd?: Icon;
        close?: Icon;
      };
      rem: float;
    }

    // interface Theme {
    // }
  }
}
export type FormatType = "s" | "d" | "b" | "n";

export type Classes =
  "mnb";
/** classes */
export const enum C {
  full = "full",
  disabled = "ds",
  //--components
  //----basic
  icon = "c",
  button = "bt",
  //----composite
  column = "col",
  row = "row",
  pagging = "pag",
  form = "f",
  message = "ms",
  buttons = "bs",
  heading = "heading",
  accordion = "ac",
  dropdown = "dd",
  close = "cl",
  tab = "ta",
  menu = "menu",
  menubar = "bar",
  input = "in",
  link = "lk",
  loading = "ld",
  lever = "lv",
  container = "container",
  modalArea = "mda",
  modal = "modal",
  tree = "tree",
  table = "tb",
  grid = "grd",
  placeholder = "ph",
  select = "sel",
  label = "lb",
  checkbox = "cb",
  switch = "sw",
  //-------------------generic
  group = "g",
  item = "i",
  head = "hd",
  body = "bd",
  foot = "ft",
  side = "sd",
  main = "ma",
  separator = "div",
  //-------------------state
  bordered = "brd",
  on = "on",
  // selected = "sd",
  current = "crt",
  inline = "inline",
  off = "off",
  fileSelector /** border  in px */ = "fileSelector",
  extra = "extra",
  options = "opts",
  context = "context",
  mobile = "m"
}

/**settings */
export const $: GalhoUI.Settings = {
  // c: "_",
  delay: 500,
  rem: 14
}
/**words */
export const w: GalhoUI.Words = {}

export type Child = str | int | float | S<ANYElement> | Render;

export function word(key: str) { return key; }
export function sentence(format: str) {
  const exp = /\{\w+\}/;
  format.replace(exp, (v) => w[v.slice(1, v.length - 1)]);
}
//-----------------------------------------utils
export const enum VAlign {
  top = 't',
  middle = 'm',
  bottom = 'b'
}
export type vAlign = "t" | "m" | "b";

export const enum HAlign {
  left = 'l',
  center = 'c',
  right = 'r',
  justify = "j"
}
export type hAlign = "l" | "c" | "r" | "j";
export const enum OriOld {
  h = 'h',
  v = 'v'
}
export type Ori = "v" | "h";
export const enum Size {
  xl = "xl",
  l = "l",
  normal = "n",
  n = "n",
  s = "s",
  xs = "xs"
}
export const enum Color {
  error = "_e",
  main = "_i",
  /** secundary */
  side = "_s",
  normal = "_m",
  warning = "_w",
  accept = "_a"
}
export const body = new S(document.body);
export const doc = new S(document as any);

/**css class */
export const cc = (...cls: str[]) => `._.${cls.join('-')}`;
/**html class */
export const hc = (...cls: str[]) => ['_', cls.join('-')];

export type Icon = { d: str, c?: str | Color } | str | S<SVGSVGElement> | falses;
export function icon(dt: Icon, size?: Size): S<SVGSVGElement>;
export function icon(d: Icon, s?: Size) {
  if (d) {
    if (isS(d)) d = { d };
    else if (isE(d))
      return d.c(cl(C.icon, s));
    return svg('svg', {
      fill: d.c || "currentColor",
      viewBox: $.is || "0 0 24 24",
    }, svg('path', { d: d.d })).c(cl(C.icon, s));
  }
}

export type click = ((this: HTMLButtonElement, e: MouseEvent) => any) | falses;

export type ButtonType = "button" | "submit" | "clear";
export const bt = (text: Child, click?: click, type: ButtonType = "button") =>
  g("button", "_ bt", text).prop("type", type).on("click", click);
export const link = (text: Child, href?: str) => g("a", ["_", C.link], text).prop("href", href);

/** button with icon */
export const ibt = (i: Icon, text: Child, click?: click, type: ButtonType = "button") =>
  g("button", "_ bt", [icon(i), text])
    .prop("type", type)
    .c(C.icon, !text).on("click", click);

/** @deprecated */
export const ibutton = ibt;
export const positive = (i: Icon, text: Child, click?: click, type?: ButtonType) =>
  ibt(i, text, click, type).c(Color.accept);
export const negative = (i: Icon, text: Child, click?: click, type?: ButtonType) =>
  ibt(i, text, click, type).c(Color.error);

/** link with icon */
export const ilink = (i: Icon, text: Child, href?: str) => g("a", C.link, [icon(i), text]).prop("href", href);

/**close button */
export const close = (click?: click) => div(hc(C.close), icon($.i.close)).on("click", click);
/**cancel button */
export const cancel = (click?: click) => negative($.i.cancel, w.cancel, click,);
/**confirm button */
export const confirm = (click?: click) => positive("confirm", w.confirm, click, "submit");

export const buttons = (...buttons: S[]) => div(C.buttons, buttons);

export const img = (src: str, cls?: str | str[]) => g("img", cls).prop("src", src)
export const a = (href: str, content: any, cls?: str | str[]) => g("a", cls, content).prop("href", href)
export const hr = (cls?: str | str[]) => g("hr", cls);

export function logo(v: str | Icon) {
  if (v)
    if (isS(v)) {
      switch (v[0]) {
        case ".":
        case "/":
          return img(v).c(C.icon);
        case "<":
          return toSVG(v).c(C.icon);
      }
    } else return icon(v);
}

export const panel = (hd: any, bd: any, ft?: any) => div("_ panel", [
  hd && wrap(hd, "hd"),
  wrap(bd, "bd"),
  ft && wrap(ft, "ft")
]);