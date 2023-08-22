import { ANYElement, cl, div, g, Input, isE, One, Render, S, svg, toSVG } from "galho";
import { bool, call, def, falsy, float, int, isA, isF, isN, isP, isS, str, Task } from "galho/util.js";

/*
----GLOCARY----
ed: Extra Data
in: Input
i : Item
mn: MeNu
*/
declare global {
  namespace Galhui {
    interface Words {
      cancel?: str;
      confirm?: str;
      search?: str;
      yes?: str;
      no?: str;
      camera?: str;
      save?: str;
      required?: str;
      invalidFmt?: str;
    }
    interface Icons {
      /**dropdown */
      dd: Icon;
      close: Icon;
      cancel: Icon;
      search: Icon;
      upload: Icon;
      up: Icon; down: Icon;
      minus: Icon;
    }
    interface Settings {
      fileURI?: (name: string) => string;
      /**shortcuts */
      sc?: { edit?: str; remove?: str; },
      // /**class */
      // c: str;

      /**icon scale */
      is?: str;
      delay?: int;
      /**is mobile */
      mob?: bool;
      /**icons */
      i?: Partial<Icons>;
      rem: float;
      /**outline form */
      oform?: bool;
    }

    // interface Theme {
    // }
  }
}
export type FormatType = "s" | "d" | "b" | "n";

/**@deprecated classes */
export const enum C {
  full = "full",
  disabled = "ds",
  //--components
  //----basic
  icon = "icon",
  button = "bt",
  //----composite
  column = "col",
  row = "row",
  pagging = "pag",
  form = "f",
  message = "msg",
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
  modalArea = "blank",
  modal = "modal",
  tree = "tree",
  table = "tb",
  grid = "grid",
  placeholder = "ph",
  select = "sel",
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
export const $: Galhui.Settings = {
  // c: "_",
  delay: 500,
  rem: 14
}
/**words */
export const w: Galhui.Words = {}

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
  xxl = "xxl",
  xl = "xl",
  l = "l",
  normal = "n",
  n = "n",
  s = "s",
  xs = "xs",
  xxs = "xxs",
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
export function cc(...cls: str[]) { return `._.${cls.join('-')}`; }
/**html class */
export function hc(...cls: str[]) { return ['_', cls.join('-')]; }

/**selector for element that can gain focus*/
export const focusable = ":not(:disabled):is(a[href],button,input,textarea,select,[tabindex])";

export type Icon = { d: str, c?: str | Color } | str | S<SVGSVGElement> | falsy;
export function icon(dt: Icon, size?: Size): S<SVGSVGElement>;
export function icon(d: Icon, s?: Size) {
  if (d) {
    if (isS(d)) d = { d };
    else if (isE(d))
      return d.c(`icon ${s}`);
    return svg('svg', {
      fill: d.c || "currentColor",
      viewBox: $.is || "0 0 24 24",
    }, svg('path', { d: d.d })).c(`icon ${s}`);
  }
}

export type Label = [icon: Icon, text: any] | One | str | false | "";
export function label(v: Label, cls?: str) {
  return v && ((isS(v) ? div(0, v) : isA(v) ? div(0, [icon(v[0]), v[1]]) : g(v)))?.c(cls);
}

export type click = ((this: HTMLButtonElement, e: MouseEvent) => any) | falsy;

export type ButtonType = "submit" | "reset" | "button";
export function bt(text: any, click?: click, type: ButtonType = "button") {
  return g("button", "_ bt", text).p("type", type).on("click", click);
}
export const link = (text: Child, href?: str) => g("a", ["_", C.link], text).p("href", href);

/** button with icon */
export function ibt(i: Icon, text: Child, click?: click, type: ButtonType = "button") {
  return g("button", "_ bt", [icon(i), text])
    .p("type", type)
    .c(C.icon, !text).on("click", click);
}

export function positive(i: Icon, text: Child, click?: click, type?: ButtonType) {
  return ibt(i, text, click, type).c(Color.accept);
}
export function negative(i: Icon, text: Child, click?: click, type?: ButtonType) {
  return ibt(i, text, click, type).c(Color.error);
}

/** link with icon */
export function ilink(i: Icon, text: Child, href?: str) {
  return g("a", C.link, [icon(i), text]).p("href", href);
}

/**close button */
export function close(click?: click) {
  return g("span", `_ ${C.close}`, icon($.i.close)).on("click", click);
}
/**cancel button */
export function cancel(click?: click) {
  return negative($.i.cancel, w.cancel, click);
}
/**confirm button */
export function confirm(click?: click) {
  return positive(null, w.confirm, click, "submit");
}

export function buttons(...buttons: S[]) {
  return div(C.buttons, buttons);
}

export function img(src: str, cls?: str | str[]) { return g("img", cls).p("src", src) }
export function a(href: str, content: any, cls?: str | str[]) { return g("a", cls, content).p("href", href) }
export function hr(cls?: str | str[]) { return g("hr", cls); }

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

/**
 * if vertical main axis is x
 * start/end means that start/end border will be used as ref(will remein inplace)
 */
type Tt = /*start*/"s" | /*end*/"e" |/*center*/ "c";
export type FluidAlign = Ori | `${Ori}${Tt}` | `${Ori}${Tt}${Tt}` | [Ori, Tt?, Tt?];
export interface FluidRect { x: float, y: float, right: float, bottom: float }
export function hoverBox(refRect: FluidRect, e: S, align: FluidAlign): void;
export function hoverBox({ x, y, right: r, bottom: b }: FluidRect, e: S, [o, side, main]: FluidAlign) {
  /*m:main,s:side,w:windows,e:Element,h:Horizontal */
  let
    { innerHeight: wh, innerWidth: ww } = window,
    { width: ew, height: eh } = e.rect,
    h = o == "h",
    border = $.rem * .4,
    [ws, wm, es, em, s0, m0, s1, m1] = h ? [wh, ww, eh, ew, y, x, b, r] : [ww, wh, ew, eh, x, y, r, b];
  main ||= (m0 + (m1 - m0) / 2) > (wm / 2) ? "s" : "e";
  e
    .css({
      //main
      ["max" + (h ? "Width" : "Height")]: (main == "e" ? wm - m1 : m0) - border * 2 + "px",
      [h ? "left" : "top"]: (main == "e" ? m1 + border : Math.max(0, m0 - em) - border) + "px",
      //side
      ["max" + (h ? "Height" : "Width")]: (side == "e" ? ws - s0 : s1) - border + "px",
      [h ? "top" : "left"]: Math.max(0, Math.min(ws - es, side == "s" ? s1 - es : side == "e" ? s0 : s0 + (s1 - s0) / 2 - es / 2)) + "px",
    });
}

export type MenuItems = Task<Array<S<HTMLTableRowElement> | HTMLTableRowElement | MenuItems>>;
export function menu(items?: any) { return div("_ menu", g("table", 0, items)); }

/**menu item */
export function menuitem(i: Icon, text: any, action?: click, side?: any, disabled?: bool) {
  return g("tr", "i" + (disabled ? " " + C.disabled : ""), [
    g("td", 0, icon(i)),
    g("td", 0, text),
    g("td", C.side, side),
    g("td")
  ]).on("click", !disabled && action);
}
// export function menuitemFull(){
//   return g("tr","i",[g("td"),g("td",{colSpan:3})])
// }

/**checkbox */
export function menucb(checked: bool, text: any, toggle?: (this: S<HTMLInputElement>, checked: bool) => any, id?: str, disabled?: bool) {
  let input = g("input", { id, checked, disabled, indeterminate: checked == null, type: "checkbox" });
  toggle && input.on("input", () => toggle.call(input, (input as Input).e.checked));
  return g("tr", ["i", disabled && C.disabled], [
    g("td", 0, input),
    g("td", 0, text).on("click", () => input.e.click()),
    g("td"), g("td")
  ]).on("click", e => e.stopPropagation());
}
export function menuwait(callback?: WaitCB) {
  return call(g("tr", 0, g("td", 0, wait(WaitType.out)).p("colSpan", 4)), tr => waiter(tr, callback));
}
export const submenu = (i: Icon, text: any, items: MenuItems) => call(g("tr", "i", [
  g("td", 0, icon(i)),
  g("td", 0, text),
  g("td"),
  g("td", 0, icon("menuR"))
]), e => {
  let mn: S;
  e.on("click", () => {
    e.tcls(C.on).is('.' + C.on) ?
      hoverBox(e.rect, (mn ||= g("table", C.menu, items)).addTo(e), "h") :
      mn.remove();
  })
});
export const menusep = () => g("tr", "_ hr");

export type MBItems = any;//Array<One | Array<Items>>;
/** */
export function menubar(...items: MBItems) { return div("_ bar", items); }
/** */
export function right() { return div(HAlign.right); }
export function mbitem(i: Icon, text: any, action?: (e: MouseEvent) => any) {
  return g("button", "i", [icon(i), text]).p({ type: "button" }).on("click", action);
}

/**menubar separator */
export function mbsep() { return g("hr"); }
/**menubar checkbox */
export function barcb(checked: bool, text: any, toggle?: (this: S<HTMLInputElement>, checked: bool) => any, disabled?: bool) {
  let input = g("input", { checked, disabled, indeterminate: checked == null, type: "checkbox" });
  toggle && input.on("input", () => toggle.call(input, (input as Input).e.checked));
  return g("label", ["i", disabled && C.disabled], [input, text]);
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


//todo: colocar no galhui
export function loading(sz = Size.n) { return div("_ blank", div("_ load " + sz)); }
export function busy<T>(cb: () => Task<T>, sz?: Size, time?: int): S | T;
export function busy(container: S, cb: (close: () => void) => any, sz?: Size, time?: int): Promise<void>
export function busy(arg0: any, arg1?: any, arg2?: any, arg3?: any) {

  if (isF(arg0)) {
    let e = g("span");
    (async () => {
      let t = setTimeout(() => e.replace(e = loading(arg1)), def(arg2, 750));
      e.replace(e = await arg0());
      clearTimeout(t);
    })();
    // setTimeout(async () => e.replace(e = await arg0()), def(arg2, 750));
    // let t = await arg0();
    // e.parent && e.replace(t);
    // e = t;
    return e;
  } else {
    let
      e = loading(arg2), p: any,
      t = setTimeout(() => {
        p = arg0.add(e).css("position");
        arg0.css({ position: "relative" });
      }, arg3);
    let close = () => {
      e.remove();
      clearTimeout(t);
      arg0.css({ position: p });
    };
    return (async () => {
      try { await arg1(close) }
      finally { close(); }
    })();
  }

}

export const blobToBase64 = (v: Blob) => new Promise<str>((rs, rj) => {
  var reader = new FileReader();
  reader.readAsDataURL(v);
  reader.onloadend = () => rs(reader.result as str);
  reader.onerror = rj;
})