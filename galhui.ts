import { ANYElement, cl, div, g, Input, isE, Render, S, svg, toSVG, wrap } from "galho";
import { bool, call, Dic, falses, float, int, isN, isP, isS, str, Task } from "galho/util.js";
import { uuid } from "./util.js";

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
/**@deprecated classes */
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
  g("button", "_ bt", text).p("type", type).on("click", click);
export const link = (text: Child, href?: str) => g("a", ["_", C.link], text).p("href", href);

/** button with icon */
export const ibt = (i: Icon, text: Child, click?: click, type: ButtonType = "button") =>
  g("button", "_ bt", [icon(i), text])
    .p("type", type)
    .c(C.icon, !text).on("click", click);

/** @deprecated */
export const ibutton = ibt;
export const positive = (i: Icon, text: Child, click?: click, type?: ButtonType) =>
  ibt(i, text, click, type).c(Color.accept);
export const negative = (i: Icon, text: Child, click?: click, type?: ButtonType) =>
  ibt(i, text, click, type).c(Color.error);

/** link with icon */
export const ilink = (i: Icon, text: Child, href?: str) => g("a", C.link, [icon(i), text]).p("href", href);

/**close button */
export const close = (click?: click) => div(hc(C.close), icon($.i.close)).on("click", click);
/**cancel button */
export const cancel = (click?: click) => negative($.i.cancel, w.cancel, click,);
/**confirm button */
export const confirm = (click?: click) => positive($.i.check, w.confirm, click, "submit");

export const buttons = (...buttons: S[]) => div(C.buttons, buttons);

export const img = (src: str, cls?: str | str[]) => g("img", cls).p("src", src)
export const a = (href: str, content: any, cls?: str | str[]) => g("a", cls, content).p("href", href)
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
type Tt = /*start*/"s" | /*end*/"e" |/*center*/ "c";
export type FluidAlign = Ori | `${Ori}${Tt}` | `${Ori}${Tt}${Tt}` | [Ori, Tt?, Tt?];
export interface FluidRect { x: float, y: float, right: float, bottom: float }
export function fluid({ x, y, right: r, bottom: b }: FluidRect, menu: S, [o, side, main]: FluidAlign) {
  /*m:main,s:side */
  let
    { innerHeight: wh, innerWidth: ww } = window,
    { width: mw, height: mh } = menu.rect(),
    h = o == "h",
    e = $.rem * .4,
    [ws, wm, ms, mm, s0, m0, s1, m1] = h ? [wh, ww, mh, mw, y, x, b, r] : [ww, wh, mw, mh, x, y, r, b];
  main ||= (m0 + (m1 - m0) / 2) > (wm / 2) ? "s" : "e";
  menu
    .css({
      ["max" + (h ? "Width" : "Height")]: (main == "e" ? wm - m1 : m0) - e * 2 + "px",
      [h ? "left" : "top"]: (main == "e" ? m1 + e : Math.max(0, m0 - mm) - e) + "px",
      [h ? "top" : "left"]: Math.max(0, Math.min(ws - ms, side == "s" ? s1 - ms : side == "e" ? s0 : s0 + (s1 - s0) / 2 - ms / 2)) + "px",
    });
}
type _MenuItems = Array<S<HTMLTableRowElement> | HTMLTableRowElement | MenuItems> | (() => MenuItems);
export type MenuItems = Task<_MenuItems>;

export function menu(items?: MenuItems) { return div("_ menu", g("table", 0, items)); }

/**menu item */
export const menuitem = (i: Icon, text: any, action?: click, side?: any) => g("tr", C.item, [
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
    g("td", 0, g("label", 0, text).p("htmlFor", id)),
    g("td"), g("td")
  ]);
}
export const menuwait = (callback?: WaitCB) =>
  call(g("tr", 0, g("td", 0, wait(WaitType.out)).p("colSpan", 4)), tr => waiter(tr, callback));
export const submenu = (i: Icon, text: any, items: MenuItems) => call(g("tr", "i", [
  g("td", 0, icon(i)),
  g("td", 0, text),
  g("td"),
  g("td", 0, icon("menuR"))
]), e => {
  let mn: S;
  e.on("click", () => {
    e.tcls(C.on).is('.' + C.on) ?
      fluid(e.rect(), (mn ||= g("table", C.menu, items)).addTo(e), "h") :
      mn.remove();
  })
});
export const menusep = () => g("tr",C.separator);

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

/**call back */
export type WaitCB = PromiseLike<any> | (() => Promise<any>);

/**wait type */
export const enum WaitType {
  inline,
  out,
}
/**place holder */
export function ph(type = WaitType.out) {
  switch (type) {
    case WaitType.inline:
    case WaitType.out:
      return div(C.loading, [
        //icon({ /*s: size, */d: `loading ${C.centered}` }),
        //icon({ /*s: size, */d: `loading ${C.itemA} ${C.centered}` }),
      ]);
  }
}
export function waiter(element: S, cb: WaitCB) {
  cb && (isP(cb) ? cb : cb?.()).then(t => {
    if (t instanceof S) {
      t.c(Array.from(element.e.classList).slice(1));
      t.attr("style",
        (t.attr("style") || "") +
        (element.attr("style") || "")
      )
    }
    element.replace(t);
  });
}
export function wait(body?: WaitCB): S;
export function wait(type: WaitType, body?: WaitCB): S;
export function wait(type?: WaitType | WaitCB, body?: WaitCB): any {
  if (!isN(type)) {
    body = type;
    type = WaitType.inline;
  }
  let loader = ph(type);
  waiter(loader, body);
  return loader;
}


export function busy(container: S) {
  let e = wait(), t = setTimeout(() => {
    container.add(e);
  }, 750);

  return () => {
    e.remove();
    clearTimeout(t);
  }
}