import { Component, Content, G, HSElement, HTMLTag, One, Render, active, clearEvent, delay, div, g, getAll, isE, onfocusout, svg, toSVG, wrap } from "galho";
import { L, orray, range } from "galho/orray.js";
import { Dic, Key, Task, bool, call, def, falsy, float, int, isA, isF, isN, isP, isS, l, str, sub, t } from "galho/util.js";
import { anim } from "./util.js";

/*
----GLOCARY----
ed: Extra Data
in: Input
i : Item
mn: MeNu
*/
declare global {
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
    rem: float;
    /**outline form */
    oform?: bool;
  }
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
    info: Icon; minus: Icon;
    close: Icon; cancel: Icon;
    search: Icon; upload: Icon;
    up: Icon; down: Icon;
  }
}
export type FormatType = "s" | "d" | "b" | "n";

/**@deprecated classes */
export const enum C {
  full = "full",
  disabled = "ds",
  //--components
  //----basic
  //----composite
  message = "msg",
  buttons = "bs",
  heading = "heading",
  accordion = "ac",
  close = "cl",
  tab = "ta",
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
  extra = "extra",
  options = "opts",
  context = "context",
  mobile = "m"
}

export const icons: Partial<Icons> = {}
/**settings */
export const $: Settings = {
  // c: "_",
  delay: 500,
  rem: 16
}
/**words */
export const w: Partial<Words> = {}

export type Child = str | int | float | G<HSElement> | Render;

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
export type Size = "xxl" | "xl" | "l" | "n" | "n" | "s" | "xs" | "xxs";
export const enum Color {
  error = "_e",
  main = "_i",
  /** secundary */
  side = "_s",
  normal = "_m",
  warning = "_w",
  accept = "_a"
}
export const body = () => new G(document.body);
export const doc = () => new G(document as any);

/**selector for element that can gain focus*/
export const focusable = ":not(:disabled):is(a[href],button,input,textarea,select,[tabindex])";

export type Icon = { d: str, c?: str | Color } | str | G<SVGSVGElement> | falsy;
export function icon(dt: Icon, size?: Size): G<SVGSVGElement>;
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
export const label = (v: Label, cls?: str) =>
  v && ((isS(v) ? div(0, v) : isA(v) ? div([icon(v[0]), v[1]]) : g(v)))?.c(cls);

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
    .c("icon", !text).on("click", click);
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
  return g("button", `_ ${C.close}`, icon(icons.close)).p("type", "button").on("click", click);
}
/**cancel button */
export function cancel(click?: click) {
  return negative(icons.cancel, w.cancel, click);
}
/**confirm button */
export function confirm(click?: click) {
  return positive(null, w.confirm, click, "submit");
}

export function buttons(...buttons: G[]) {
  return div(C.buttons, buttons);
}

export function img(src: str, cls?: str) { return g("img", cls).p("src", src) }
export function a(href: str, content: any, cls?: str) { return g("a", cls, content).p("href", href) }
export function hr(cls?: str) { return g("hr", cls); }

export function logo(v: str | Icon) {
  if (v)
    if (isS(v)) {
      switch (v[0]) {
        case ".":
        case "/":
          return img(v).c("icon");
        case "<":
          return toSVG(v).c("icon");
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
export function hoverBox(refRect: FluidRect, e: G, align: FluidAlign): void;
export function hoverBox({ x, y, right: r, bottom: b }: FluidRect, e: G, [o, side, main]: FluidAlign) {
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

export type MenuItems = Task<Array<G<HTMLTableRowElement> | HTMLTableRowElement | MenuItems>>;
export type MenuContent = Content<(bool | falsy | One<HTMLTableRowElement>)[]>;
export function menu(items?: MenuContent) { return div("_ menu", g("table", 0, items)); }

/**menu item */
export function menuitem(i: Icon, text: any, action?: (e: MouseEvent) => any, side?: any, disabled?: bool) {
  return g("tr", `i ${disabled ? C.disabled : ""}`, [
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
export function menucb(checked: bool, text: any, toggle?: (this: G<HTMLInputElement>, checked: bool) => any, id?: str, disabled?: bool) {
  let input = g("input", { id, checked, disabled, indeterminate: checked == null, type: "checkbox" });
  toggle && input.on("input", () => toggle.call(input, input.e.checked));
  return g("tr", `i ${disabled ? C.disabled : ""}`, [
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
  let mn: G;
  e.on("click", () => {
    e.tcls(C.on).is('.' + C.on) ?
      hoverBox(e.rect, (mn ||= g("table", "menu", items)).addTo(e), "h") :
      mn.remove();
  })
});
export const menusep = () => g("tr", "_ hr");

/** @deprecated */
export function menubar(...items: any) { return div("_ bar", items); }
/** @deprecated */
export function right() { return div(HAlign.right); }
export function mbitem(i: Icon, text: any, action?: (e: MouseEvent) => any) {
  return g("button", "i", [icon(i), text]).p({ type: "button" }).on("click", action);
}

/**menubar separator */
export function mbsep() { return g("hr"); }
/**menubar checkbox */
export function barcb(checked: bool, text: any, toggle?: (this: G<HTMLInputElement>, checked: bool) => any, disabled?: bool) {
  let input = g("input", { checked, disabled, indeterminate: checked == null, type: "checkbox" });
  toggle && input.on("input", () => toggle.call(input, input.e.checked));
  return g("label", `i ${disabled ? C.disabled : ""}`, [input, text]);
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
export function waiter(element: G, cb: WaitCB) {
  cb && (isP(cb) ? cb : cb?.()).then(t => {
    if (t instanceof G) {
      t.c(Array.from(element.e.classList).slice(1));
      t.attr("style",
        (t.attr("style") || "") +
        (element.attr("style") || "")
      )
    }
    element.replace(t);
  });
}
export function wait(body?: WaitCB): G;
export function wait(type: WaitType, body?: WaitCB): G;
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
export function loading(sz = "n") { return div("_ blank", div("_ load " + sz)); }
export function busy<T>(cb: () => Task<T>, sz?: Size, time?: int): G | T;
export function busy(container: G, cb: (close: () => void) => any, sz?: Size, time?: int): Promise<void>
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
});

//#region input
export type TextInputTp = "text" | "email" | "url" | "tel";
export type InputTp = TextInputTp | "number" | "search" | "checkbox" | "radio" | "password";
export type Input = G<HTMLInputElement | HTMLTextAreaElement>;

export const input = (type: InputTp, name: str, ph?: str, input?: (e: Event) => any) =>
  g("input", { type, name, placeholder: ph }).c("_ in").on("input", input);

export const textarea = (name: str, ph: str, input?: (text: str) => void) =>
  g("textarea", { name, placeholder: ph }).c("_ in").on("input", input && (function () { input(this.value) }));

export const checkbox = (label: any, input?: (checked: bool) => void, checked?: bool) =>
  g("label", "_ cb", [g("input", { type: "checkbox", checked }).on("input", input && (function () { input(this.checked) })), label]);

export function search(input?: (value: str) => any) {
  let t = g("input", { type: "search", placeholder: w.search }), i = icon(icons.search);
  input && delay(t, "input", $.delay, () => input(t.e.value));
  return (i ? div([t, i]) : t).c("_ in");
}



export interface iImgSelector {
  k?: str;
  accept?: str;
  /**placeholder */
  ph?: str;
  value?: Blob;
  w?: float; h?: float;
  loading?: bool;
}
export class ImgSelector extends Component<iImgSelector>{
  view() {
    let i = this.p, l: G;
    let input = g('input', { name: i.k, type: "file", accept: i.accept || "image/*" })
      .on("input", () => {
        let v = input.e.files[0];
        this.set("value", v);
      });
    let e = this.bind(g("span", "_ img-in", input), e =>
      i.loading ? e.add(l = loading()) : l?.remove(), "loading");
    return this.bind(e, async _ => {
      if (i.value) {
        let fr = new FileReader();
        let img = g("img").on("load", () => this.set({ w: img.e.naturalWidth, h: img.e.naturalHeight }));
        if (isS(i.value)) img.p("src", i.value);
        else {
          // i.value = await (await fetch(i.value)).blob();
          fr.onload = () => img.e.src = fr.result as str;
          fr.readAsDataURL(i.value);
        }
        _.set([img, close(() => this.set({ w: null, h: null, value: input.e.value = null }))]);
      } else {
        _.set(g("button", { type: "button" }, [div(0, "+").css("fontSize", "6em"), i.ph])
          .on("click", () => input.e.click()));
      }
    }, "value");
  }
}
export const submitImg = (url: str, value: Blob, img?: ImgSelector) =>
  new Promise<str>((resolve, err) => {
    let r = new XMLHttpRequest;
    r.withCredentials = true;
    r.onload = () => { img?.set("loading", false); resolve(r.responseText) };
    r.onerror = err;
    img?.set("loading", true);
    r.open("POST", url);

    r.send(value);
  });

//#region output

export const output = (...content) => g("span", "_ out", content);
export const keyVal = (key: any, val: any, c?: Color | falsy, tag: HTMLTag = "span") =>
  g(tag, `_ out ${c || ""}`, [key, ": ", val]);

export const message = (c?: Color, data?) => div("_ msg", data).c(c);
export const errorMessage = (data?) => message(Color.error, data);

//#endregion

export type IModal = One<HTMLDialogElement>;
export type Modal = G<HTMLDialogElement>;

/**open modal 
 * @returns modal container, to close modal only remove the modal container */
export function modal(hd: Label, bd?: any, actions?: (close: () => void, modal: G) => any, sz?: Size, blur = true) {
  //
  let content: Modal = g("dialog", "_ modal " + (sz || ""));
  content.on("cancel", (e) => {
    if (!blur) clearEvent(e);
    else content.remove();
  })
  content
    .add(g("form", 0, [
      label(hd, "hd"),
      isE(bd) ? bd.c("bd") : bd,
      actions && div("ft", actions(() => (content as Modal).remove(), content))
    ]))
    .addTo(body())
    .e.showModal();
  return content as Modal;
  // let area = div("_ blank", ).addTo(body);
  // modal.p("tabIndex", 0).focus();
  // blur && mdOnBlur(area);
  // return area;
}
export function tabModal(initial: int, items: TabItem[], actions: (close: () => void, modal: G) => any = (cl) => confirm(cl), sz = "xl") {
  let form = g("form", "_ tab");
  let content = g("dialog", "_ modal " + (sz || ""), form);
  let hd = div("_ main bar", items.map(([h, b]) => call(label(h, "i"), e => e.on("click", () => {
    form.set([hd, b, div("ft", actions(() => (content as Modal).remove(), content))]);
    hd.childs().c("on", false);
    e.c("on");
  }))));
  content.addTo(body()).e.showModal();
  hd.child<HTMLDivElement>(initial).e.click()
  return content;
}
export const showDialog = (e: Modal) => e.addTo(body().c("dialog-on")).call("showModal").on("close", () => {
  e.remove();
  body().c("dialog-on", false);
});
/**modal with ok and cancel buttons */
export function mdOkCancel(body: any, sz: Size = "xs", valid = () => true) {
  return new Promise<bool>(ok => modal(null, wrap(body), cl => [
    confirm(() => { if (valid) { cl(); ok(true) } }).css({ width: "50%" }),
    cancel(() => { cl(); ok(false) }).css({ width: "50%" })
  ], sz));
}

/**modal with yes/no buttons */
export function mdYN(body: any, sz: Size = "xs", valid = () => true) {
  return new Promise<bool>(ok => modal(null, wrap(body), cl => [
    positive(null, w.yes, () => { if (valid) { cl(); ok(true) } }).css({ width: "50%" }),
    negative(null, w.no, () => { cl(); ok(false) }).css({ width: "50%" })
  ], sz));
}
/**modal with ok */
export function mdOk(body: any, sz: Size = "xs") {
  return new Promise<void>(ok => modal(null, wrap(body),
    cl => confirm(() => { cl(); ok() }),
    sz));
}
/**md with error style and ok button */
export function mdError(body: any, sz: Size = "xs") {
  return new Promise<void>(ok => modal(null, wrap(body),
    cl => confirm(() => { cl(); ok() }),
    sz).c(Color.error));
}
const topLayer = () => g(getAll(":modal").at(-1)) || body();
export function popup(refArea: () => FluidRect, div: G, align: FluidAlign) {
  return anim(() => topLayer().contains(div) && hoverBox(refArea(), div, align));
}
/**context menu */
export function ctxmenu(e: MouseEvent, data: MenuItems, align: FluidAlign = "ve") {
  clearEvent(e);
  let last = active(), tl = topLayer();
  let wheelHandler = (e: Event) => clearEvent(e);
  let ctx = div("_ menu", g("table", 0, data)).p("tabIndex", 0)
    .on({
      focusout(e) {
        ctx.contains(e.relatedTarget as HTMLElement) || (ctx.remove() && tl.off("wheel", wheelHandler));
      },
      keydown(e) {
        if (e.key == "Escape") {
          e.stopPropagation();
          ctx.blur();
        }
      }
    }).addTo(tl).focus();

  ctx.queryAll('button').on('click', function () { last ? last.focus() : this.blur() });
  tl.on("wheel", wheelHandler, { passive: false });
  popup(() => new DOMRect(e.clientX, e.clientY, 0, 0), ctx, align);
}
export function tip<T extends HSElement>(root: One<T>, content: any, align?: FluidAlign): G<T>
export function tip<T extends HSElement>(root: G<T>, tip: G, align: FluidAlign = "v") {
  if (isP(tip)) {
    let t = tip;
    tip = div("_ tip", wait);
    t.then(v => { tip = wrap(v, "_ tip") });
  }
  else tip = wrap(tip, "_ tip");
  return (root = g(<any>root))?.on({
    mouseenter() {
      let tl = topLayer();
      tl.add(tip);
      anim(() => tl.contains(root) && tip.parent ?
        hoverBox(root.rect, tip as G, align) :
        (tip.remove(), false));
    },
    mouseleave() { tip.remove() },
    //TODO:focusin,focusout
    // focusout(e) {
    //   tip.remove()
    // },
    // focusin(){

    // }
  });
}

export interface iRoot extends iSelectBase {

  /**gain focus via tab key 
   * @default true
  */
  tab?: bool;
  /**label field */
  // label?: Key;
}
export type Root = Component<iRoot, { open?: [bool] }> & {
  value: Key;
};
export interface iSelectBase {
  open?: bool;
  /**if should have menu-down icon 
   * @default true */
  icon?: bool;
  /**if should open when clicked 
   * @default true */
  click?: bool;
  off?: bool;
}
export interface SelectBase<T extends iSelectBase = iSelectBase> extends Component<T, { open?: [bool] }> { }

/**create root, add handlers */
export function selectRoot(me: SelectBase, options: L, label: G, menu: G, setValue: (v: Key) => any, tag?: HTMLTag) {
  let
    i = me.p,
    root = onfocusout(g(tag || "button", `_ in ${C.select}`, [label.c("bd"), t(i.icon) && icon(icons.dd)?.c(C.side)/*, me.menu*/]), () => me.set("open", false))
      .p("tabIndex", 0)
      .on({
        focus(e) {
          if (i.off) {
            if (e.relatedTarget)
              g(e.relatedTarget as Element).focus();
            else root.blur();
          } else root.c("on");
        },
        keydown(e) {
          switch (e.key) {
            case "ArrowUp":
              me.set("open", true);
              range.move(options, "on", -1, range.tp(e.shiftKey, e.ctrlKey));
              break;
            case "ArrowDown":
              me.set("open", true);
              range.move(options, "on", 1, range.tp(e.shiftKey, e.ctrlKey));
              break;
            case "Enter":
              if (me.p.open) {
                setValue(l(options) == 1 ?
                  options[0][options.key] as any :
                  sub(range.list(options, "on"), options.key as any)[0]);
                me.set("open", false)
              } else return;
              // else {
              //   let frm = g(me).closest("form");
              //   if (frm) frm?.e.requestSubmit();
              //   else return;
              // }
              break;
            case "Escape":
              if (me.p.open) {
                me.set("open", false);
                break;
              } else return;

            default:
              return;
          }
          clearEvent(e);
        }
      });
  tag || root.attr("type", "button")
  if (t(i.click))
    root.on('click', (e) => {
      // if (i.off) {
      //   e.stopImmediatePropagation();
      // } else { }
      if (!menu.contains(e.target as HTMLElement))
        me.toggle("open");

    });
  me.on(state => {
    if ("off" in state) {
      if (i.off) me.set("open", false);
      //{root.blur().attr("disabled", true).p('tabIndex', -1); } 
      root.attr("disabled", i.off)//.p('tabIndex', t(i.tab) ? 0 : -1);

    }
    if ("open" in state) {
      if (i.open && i.off) {
        me.set("open", false);
        return;
      }
      me.emit('open', i.open);
      root.c("on", i.open);

      if (i.open) {
        root.add(menu);
        anim(() => {
          let r = root.rect;
          return body().contains(menu) && (menu.css("minWidth", r.width + "px"), hoverBox(r, menu, "ve"))
        });
      } else {
        root.c([VAlign.bottom, VAlign.top], false);
        menu.remove();
      }
    }
  });

  return root;
}
export interface iSingleSelectBase<T = Dic> extends iSelectBase {
  clear?: bool
  /**placeholder */
  ph?: any;
  item?(v: T): any;
}
export interface SingleSelectBase<K = any, T = Dic> extends SelectBase<iSingleSelectBase<T>> {
  option(k: K): Task<Dic>;
  value: K;
}
export async function setValue(me: SingleSelectBase, label: G) {
  let v = me.value;
  if (label.is("input")) {
    label.p("value", me.value == null ? "" : me.value);
  } else {
    if (v == null) label.c("_ ph").set(me.p.ph);
    else {
      let o = await me.option(v as any);
      label.c("ph", false).set([me.p.item(o), t(me.p.clear) && close(() => me.value = null)]);
      me.set("open", false);
    }
  }
}
type MnItems = MenuContent | ((close: () => any) => G);
export const dropdown = (label: any, items: MnItems, align: FluidAlign = "ve") =>
  call(div("_ dd", label).p("tabIndex", 0), e => {
    function cl() { mn?.remove(); e.c("on", false); }
    let mn: G// = ;
    // onfocusout(e, cl);
    e.on("click", () => {
      if (mn?.parent) cl();
      else {
        (mn ||= isF(items) ? items(cl) as G : menu(items)).addTo(e.c("on"));
        popup(() => e.rect, mn, align);
      }
    });
  });
export const idropdown = (label: any, items: MnItems, align?: FluidAlign) =>
  dropdown([label, icon(icons.dd)], items, align);

export type AccordionItem = [head: any, body: any];
export interface IAccordion {
  icon?: bool, single?: bool, def?: int
}
export const hidden = (head: any, body: any, open?: bool) => div(`_ ${C.accordion}`, [
  head = div("hd", [
    icon("menuR"),
    head
  ]).c(C.on, !!open).on("click", () => (<G>head).tcls(C.on)),
  wrap(body, "bd")
]);
export function accordion(items: AccordionItem[], i: IAccordion = {}) {
  return orray(items).bind(div("_ accordion"), ([hd, bd], j, p) => {
    p.place(j * 2, [
      hd = div("hd", [
        t(i.icon) && icon("menuR"),
        hd
      ]).c(C.on, i.def == j).on("click", () => {
        if ((hd as G).is('.' + C.on))
          (<G>hd).c(C.on, false);
        else {
          t(i.single) && p.childs("." + "hd").c(C.on, false);
          (<G>hd).c(C.on);
        }
      }),
      wrap(bd, "bd")
    ]);
  });
}
export type TabItem = [hd: Label, bd: any];
export function tab(initial: int, items: TabItem[]) {
  let
    hd = div("_ bar", items.map(([h, b]) => call(label(h, "i"), e => e.on("click", () => {
      d.set([hd, b]);
      hd.childs().c("on", false);
      e.c("on");
    })))),
    d = div("_ tab");
  hd.child<HTMLDivElement>(initial).e.click()
  return d;
}
//#endregion

// #region slideshow

export type SShowItem = [src: str, title?: any, alt?: str];
export interface iSlideshow {
  // items?: SShowItem[];
  // index?: int;
  click?: (src: str) => any;
}

export function slideshow(i: iSlideshow, items: SShowItem[], index = 0) {
  let title = div("title"), bd = g("img");
  let p = g("button", "p").html('&#10094;').on("click", () => set(index - 1));
  let n = g("button", "n").html('&#10095;').on("click", () => set(index + 1));
  let indices = items.map((_, i) => g("a").on("click", () => set(i)));
  let set = (i: int) => {
    let t = items[i];
    if (t) {
      bd.p({ src: t[0], alt: t[2] });
      title.set(t[1]);
      p.css("visibility", i ? "visible" : "hidden");
      n.css("visibility", i + 1 < l(items) ? "visible" : "hidden");
      indices[index].c("on", false);
      indices[index = i].c("on");
    }
  };
  set(index);
  if (i.click)
    bd.on("click", () => i.click(items[index][0]));
  return div("_ sshow", [
    p, bd, n, title,
    div("indices", indices)
  ]);
  // div("bd",items.map(i => g("img", { src: i[0], alt: i[2] })))
}
export const sshowModal = (src: str) =>
  showDialog(g("dialog", "_ sshow-md", g("form", 0, [
    g("button", C.close, icon(icons.close)).p("formMethod", "dialog"),
    g("img", { src })
  ])));
export const sshowTitle = (main: str, info?: str) =>
  [main, div("info", info)];
//#endregion

// export interface IOpenSelect<T extends Object = Dic, K extends Key = Key> extends bg.ISelect<T, K> {
//   input?: 'text' | 'number';
//   valid?: (value: string) => boolean;
// }
// export function openSelect<T extends Object = Dic, K extends Key = Key>(input: (this: Select<T, K>, value) => any, options: (T | K)[], i: IOpenSelect<T, K> = {}) {
//   let ip = i.labelE = g('input', { type: i.input }).on('input', function () {
//     input.call(select, this.value);
//   });
//   i.label = (value) => {
//     ip.p('value', <any>value);
//   }
//   let select = new Select<T, K>(i, options);
//   return select;
// }



// export interface ISelectBase<T extends Object, K> extends IRoot {
//   menuE?: S;
//   labelE?: S;

//   /**element in menu or menu itself where items will be added */
//   items?: S<HTMLTableElement>;
//   labelParent?: S;
//   menu?: (this: this, value: T) => One;
//   /**called when value change */
//   setMenu?: (this: this, value: K) => void;
//   /**elemento dentro da label onde a label vai ser renderizada */
//   //labelItem?: S;

//   //label: S | ((key: K) => void);

// }
// export abstract class SelectBase<M extends ISelectBase<T, K> = ISelectBase<any, any>, T extends Object = any, K = Key, E extends SelectEvents = SelectEvents> extends E<M, E>  {
//   menu: S;
//   label: S;

//   options: L<T, K>;
//   abstract setValue(...value: K[]): void;

//   constructor(i: M, options?: Alias<T, K>) {
//     super(i);
//     this.options = extend<T, K>(options, {
//       key: "key",
//       parse: (e) => isO(e) ? e : { key: e } as any
//     });
//   }


//   view(): S {
//     let
//       i = this.i,
//       lb = g(i.labelE || 'div').c("bd");

//     this.label = i.labelParent || lb // model.labelItem || label;

//     this.menu = (i.menuE || div(0, i.items = g("table"))).c("_ menu");

//     //if (model.menuItems && model.menuItems != this.menu) {
//     //  this.menu.setClass(Cls.fill);
//     //  model.menuItems.setClass(Cls.full);
//     //}

//     i.open = false;


//     //if (!md.menuRender)
//     //  md.menuRender = value => div( null, value[md.key]);

//     return root(this, i, this.options);
//   }

//   protected insertItem(value: T) {
//     var model = this.i;

//     return g(model.menu(value))
//       //.setClass(Cls.option)
//       .on('click', (e) => {
//         e.stopPropagation();
//         let k = value[model.key];
//         this.setValue(k);
//       });
//   }
// }
// export interface IMultselect<T extends Object = any, K extends str | num = str> extends ISelectBase<T, K> {
//   value?: L<K>;
//   empty?: (empty: boolean, container?: S) => void;
//   label?: (this: L<K>, value: K, index?: number, container?: S) => void | One;// Child | Promise;
// }
// export class Multselect<T extends Object = { key: str }, K extends str | num = str> extends SelectBase<IMultselect<T, K>, T, K, { add: K[], remove: K[]; input: K[] } & SelectEvents> {
//   constructor(i: IMultselect<T, K>, options?: Array<T | K>) {
//     super(i, options);
//     this.options.addGroup("on");
//     i.value = orray(i.value, {
//       parse(item) {
//         if (this.indexOf(item) == -1)
//           return item;
//       }
//     });
//     //.bindToE(this, "value");
//   }
//   get value() { return this.i.value; }
//   view() {
//     let
//       i = this.i,
//       values = i.value,
//       options = this.options,
//       div = super.view(),
//       mItems = i.items,
//       menu = i.items || this.menu;

//     this.label.css('flexWrap', 'wrap');
//     bind(options, menu, {
//       insert: this.insertItem.bind(this),
//       tag(s, active, tag) {
//         s.c(tag, active);

//         if (active) {
//           vScroll(menu, s.e.offsetTop - menu.p('clientHeight') / 2 + s.p('clientHeight') / 2);
//         }
//       },
//       groups: {
//         ["on"](e, active) { e.c(C.on, active); }
//       }
//     });
//     bind(values, menu, {
//       insert(key) {
//         let index = itemIndex(options, key);
//         if (index != -1)
//           mItems
//             .child(index)
//             .c(C.main);
//       },
//       remove(key) {
//         let index = itemIndex(options, key);
//         if (index != -1)
//           mItems
//             .child(index)
//             .c(C.main, false);
//       }
//     });
//     bind(values, this.label, {
//       insert: i.label,
//       empty: i.empty
//     });

//     return root(this, i).on("keydown", e => {
//       switch (e.key) {
//         case "Delete": {
//           let target = g(e.target as HTMLElement);
//           if (is(target, 'input') || is(target, 'textarea') || !this.delete())
//             return;
//           else break;
//         }
//         case "Backspace": {
//           let target = g(e.target as HTMLElement);
//           if (is(target, 'input') || is(target, 'textarea') || !this.backspace())
//             return;
//           else break;
//         }
//       }
//       keydown(e, this.options);
//     });
//   }

//   delete() {
//     let vl = this.i.value;
//     if (!vl.length)
//       return false;

//     this.removeValue(vl[0]);
//     return true;
//   }
//   backspace() {
//     let vl = this.i.value;

//     if (!vl.length)
//       return false;

//     this.removeValue(z(vl));
//     return true;
//   }

//   setValue(...values: K[]) {
//     let md = this.i;

//     //let list = this.model.value;
//     if (values.length) {
//       //let l = list.length;
//       let inserted: K[] = [];

//       for (let value of values) {
//         if (md.value.indexOf(value) == -1) {
//           inserted.push(value);
//         }
//       }


//       //md.value.push(...values);

//       if (inserted.length > 0) {
//         md.value.push(...inserted);

//         this.emit('add', inserted);
//         this.emit('input', md.value.slice());

//         if (md.open && this.$)
//           this.setMenu(this.$)
//       }
//     }
//   }

//   removeValue(...values: K[]) {
//     let
//       md = this.i,
//       removed: K[] = [];

//     for (let value of values) {
//       let i = md.value.indexOf(value);
//       if (i != -1) {
//         md.value.removeAt(i);
//         removed.push(value);
//       }
//     }

//     if (removed.length > 0) {
//       this.emit('remove', removed);
//       this.emit('input', md.value.slice());

//       if (md.open && this.$)
//         this.setMenu(this.$)
//     }
//   }

//   //setLabel(value: T) {
//   //  var model = this.model;
//   //  return model.menuRender(<T>value)
//   //    .setClass(Cls.option)
//   //    .on('click', (e) => {
//   //      e.stopPropagation();
//   //      let k = value[model.key];
//   //      this.set('value', k);
//   //      model.child.setTag(focusKey, k);
//   //    })
//   //}

// }



// export interface IOpenMultselect<T extends Object = Dic, K extends Key = Key> extends IMultselect<T, K> {
//   input?: 'text' | 'number';
//   valid?: (value: string) => boolean;
//   /**place holder */
//   ph?: str;
// }
// export function openMultselect<T extends Object = Dic, K extends Key = Key>(i: IOpenMultselect<T, K>, allOptions: T[]) {
//   let
//     select = new Multselect<T, K>(assign(i, {
//       label(value) {
//         i.labelE.p('value', value);
//       },
//       labelE: g('input', { type: i.input, placeholder: i.ph }).on({
//         input() {
//           let arg: Arg<str> = { v: this.value };
//           select.emit("type" as any, arg);
//           if (!arg.p) {
//             allOptions ||= opts.slice();
//             let parts = valid(arg.v.split(/\s+/g)).map(q => new RegExp(q, "gu"));
//             opts.set(allOptions.filter(o => parts.every(p => p.test(o[i.key]))));
//           }
//           if (l(opts) == 1)
//             addSelection(opts, "on", opts[0], SelectionTp.set);
//         },
//         keydown(e) {
//           if (e.key == "Enter" && !opts.tags["on"]) {
//             clearEvent(e);
//             let arg: Arg<str> = { v: this.value };
//             if (i.valid ? i.valid(arg.v) : false) {
//               select.emit("submit" as any, arg)
//               if (!arg.p) {
//                 opts.push({ [i.key]: arg.v } as any);
//                 select.setValue(arg.v as K);
//               }
//             }
//           }
//         }
//       })
//     }), allOptions),
//     opts = select.options;
//   g(select).c(C.input)
//   return select;
// }