import type { Content, HSElement, HTMLTag, NotRender, One, Property, Render } from "galho";
import { Component, G, active, clearEvent, delay, div, g, getAll, isE, onfocusout, svg, toSVG, wrap } from "galho";
import type { GTr, HTDialog, HTInput, HTTr } from "galho/elements.js";
import { L, orray, range } from "galho/orray.js";
import type { Dic, Key, Task, bool, falsy, float, int, str } from "galho/util.js";
import { call, def, isA, isF, isN, isP, isS, l, t } from "galho/util.js";
import { anim } from "./util.js";

declare global {
  /** Global settings for the UI framework. */
  interface Settings {
    /** Function to resolve file URIs. */
    fileURI?: (name: string) => string;
    /** Shortcut key mappings. */
    sc?: { edit?: str; remove?: str; };
    /** Default icon scale/viewBox. */
    is?: str;
    /** Input delay in milliseconds. */
    delay?: int;
    /** Mobile device flag. */
    mob?: bool;
    /** Root rem measurement. */
    rem: float;
    /** Outline form style setting. */
    oform?: bool;
  }

  /** Standard text labels dictionary. */
  interface Words {
    cancel?: str;
    confirm?: str;
    search?: str;
    yes?: str;
    no?: str;
    camera?: str;
    required?: str;
    invalidFmt?: str;
  }

  /** Global application icons configuration. */
  interface Icons {
    /** Dropdown indicator. */
    dd: Icon;
    /** Info tooltip icon. */
    info: Icon;
    /** Minus/reduction icon. */
    minus: Icon;
    /** Close dialog button. */
    close: str;
    /** Cancel operation icon. */
    cancel: Icon;
    /** Search field icon. */
    search: Icon;
    /** Upload file icon. */
    upload: Icon;
    /** Upward arrow. */
    up: Icon;
    /** Downward arrow. */
    down: Icon;
    /** Cut clipboard icon. */
    cut: Icon;
    /** Copy clipboard icon. */
    copy: Icon;
    /** Paste clipboard icon. */
    paste: Icon;
  }
}

/** Represents format types supported by form values. */
export type FormatType = "s" | "d" | "b" | "n";

/**
 * Standard CSS classes used within the framework components.
 * @deprecated Use component styling configurations instead.
 */
export const enum C {
  full = "full",
  disabled = "ds",
  message = "msg",
  buttons = "bs",
  accordion = "ac",
  close = "cl",
  tab = "ta",
  link = "lk",
  loading = "ld",
  select = "sel",
  checkbox = "cb",
  switch = "sw",
  side = "sd",
  main = "ma",
  separator = "div",
  bordered = "brd",
  on = "on",
  current = "crt",
  inline = "inline",
  mobile = "m"
}

/** Global dictionary containing registered icons. */
export const icons: Partial<Icons> = {};

/** Global framework settings object. */
export const $: Settings = {
  delay: 500,
  rem: 16
};

/** Global framework localized words dictionary. */
export const w: Partial<Words> = {};

/** Type definition for a child node renderable within components. */
export type Child = str | int | float | G<HSElement> | Render;

/**
 * Returns the word unchanged.
 * @param key The word key.
 */
export function word(key: str) { return key; }

/**
 * Replaces formatted tokens `{word}` with translated words in a format string.
 * @param format The format string.
 */
export function sentence(format: str) {
  const exp = /\{\w+\}/;
  format.replace(exp, (v) => w[v.slice(1, v.length - 1)]);
}

/** Vertical alignment options. */
export const enum VAlign {
  top = 't',
  middle = 'm',
  bottom = 'b'
}

/** Short representation of vertical alignment options. */
export type vAlign = "t" | "m" | "b";

/** Horizontal alignment options. */
export const enum HAlign {
  left = 'l',
  center = 'c',
  right = 'r',
  justify = "j"
}

/** Short representation of horizontal alignment options. */
export type hAlign = "l" | "c" | "r" | "j";

/**
 * Legacy layout orientation option.
 * @deprecated Use {@link Ori} instead.
 */
export const enum OriOld {
  h = 'h',
  v = 'v'
}

/** Layout orientation string representation. */
export type Ori = "v" | "h";

/** Standard component scale metrics. */
export type Size = "xxl" | "xl" | "l" | "n" | "s" | "xs" | "xxs";

/** Semantic theme colors. */
export type Color = "error" | "main" | "side" | "warn" | "accept";

/**
 * Returns a G wrapper around the document body.
 */
export const body = () => new G(document.body);

/**
 * Returns a G wrapper around the document node.
 */
export const doc = () => new G(document as any);

/** CSS Selector mapping all element types that can receive keyboard focus. */
export const focusable = ":not(:disabled):is(a[href],button,input,textarea,select,[tabindex])";

/** Representation definition of an SVG or text icon graphic. */
export type Icon = { d: str, c?: str | Color } | str | G<SVGSVGElement> | falsy;

/**
 * Helper to build an SVG icon element.
 * @param d The icon shape/configuration.
 * @param s Optional size constraints.
 */
export function icon(dt: Icon, size?: Size): G<SVGSVGElement>;
export function icon(d: Icon, s?: Size) {
  if (d) {
    if (isS(d)) d = { d };
    else if (isE(d))
      return d.c(`icon ${s || ''}`);
    return svg('svg', {
      fill: d.c || "currentColor",
      viewBox: $.is || "0 0 24 24",
    }, svg('path', { d: d.d })).c(`icon ${s || ''}`);
  }
}

/** Label components representing text, graphics, or structured icons. */
export type Label = [icon: Icon, text: any] | One | str | falsy;

/**
 * Creates a normalized UI label.
 * @param v Label contents configuration.
 * @param cls CSS classes to apply.
 */
export const label = (v: Label, cls?: str) =>
  v && ((isS(v) ? div(0, v) : isA(v) ? div([icon(v[0]), v[1]]) : g(v)))?.c(cls);

/** Button element click callback signature. */
export type click = ((this: HTMLButtonElement, e: MouseEvent) => any) | falsy;

/** Standard HTML Button element types. */
export type ButtonType = "submit" | "reset" | "button";

/**
 * Standard text button constructor.
 * @param text The button text contents.
 * @param click Button press callback function.
 * @param type Element type attribute.
 */
export function bt(text: any, click?: click, type: ButtonType = "button") {
  return g("button", "_ bt", text).p("type", type).on("click", click);
}

/**
 * Navigational anchor element builder.
 * @param text Inner contents text/elements.
 * @param href Navigation target URL.
 */
export const link = (text: Child, href?: str) => g("a", "_ link", text).p("href", href);

/**
 * Creates an icon button.
 * @param i Icon asset configuration.
 * @param text Optional text label.
 * @param click Click callback function.
 * @param type Standard HTML button type attribute.
 */
export function ibt(i: Icon, text: Child, click?: click, type: ButtonType = "button") {
  return g("button", "_ bt", [icon(i), text])
    .p("type", type)
    .c("icon", !text).on("click", click);
}

/**
 * Creates an accept/positive action button.
 * @param i Icon asset configuration.
 * @param text Element text label.
 * @param click Trigger callback.
 * @param type HTML Button type attribute.
 */
export function positive(i: Icon, text: Child, click?: click, type?: ButtonType) {
  return ibt(i, text, click, type).c("accept");
}

/**
 * Creates a dismissive/negative action button.
 * @param i Icon asset configuration.
 * @param text Element text label.
 * @param click Trigger callback.
 * @param type HTML Button type attribute.
 */
export function negative(i: Icon, text: Child, click?: click, type?: ButtonType) {
  return ibt(i, text, click, type).c("error");
}

/**
 * Builds an anchor tag styled as a link with a leading icon.
 * @param i Icon asset configuration.
 * @param text Element text label.
 * @param href Navigate target URI.
 */
export function ilink(i: Icon, text: Child, href?: str) {
  return g("a", C.link, [icon(i), text]).p("href", href);
}

/**
 * Builds a dismissive close button.
 * @param click Dismiss callback.
 */
export function close(click?: click) {
  return g("button", `_ ${C.close}`, icon(icons.close)).p({ type: "button", tabIndex: -1 }).on("click", click);
}

/**
 * Builds a standardized cancel action button.
 * @param click Cancel callback.
 */
export function cancel(click?: click) {
  return negative(icons.cancel, w.cancel, click);
}

/**
 * Builds a standardized confirmation/submit action button.
 * @param click Confirm callback.
 */
export function confirm(click?: click) {
  return positive(null, w.confirm, click, "submit");
}

/**
 * Wraps buttons in a container block.
 * @param buttons Buttons array.
 */
export function buttons(...buttons: G[]) {
  return div(C.buttons, buttons);
}

/**
 * Image element creator helper.
 * @param src Image path source URI.
 * @param cls CSS classes to apply.
 */
export const img = (src: str, cls?: str) => g("img", cls).p("src", src);

/**
 * Navigational anchor element builder.
 * @param href Navigation target URI.
 * @param content Inside element content.
 * @param cls CSS classes to apply.
 */
export const a = (href: str, content: any, cls?: str) => g("a", cls, content).p("href", href);

/**
 * Divider tag creator.
 * @param cls CSS classes to apply.
 */
export const hr = (cls?: str) => g("hr", cls);

/**
 * Normalizes logo representation to an element.
 * @param v Image path, SVG markup string, or Icon structure.
 */
export function logo(v: str | Icon) {
  if (v) {
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
}

type Tt = "s" | "e" | "c";

/** String layout directives for aligned viewport placement. */
export type FluidAlign = Ori | `${Ori}${Tt}` | `${Ori}${Tt}${Tt}` | [Ori, Tt?, Tt?];

/** Viewport bounds measurements. */
export interface FluidRect { x: float, y: float, right: float, bottom: float }

/**
 * Places an absolute element positioned fluidly around a reference bounding rect.
 * @param refRect Relative context bounds.
 * @param e Element being positioned.
 * @param align Layout options directive.
 */
export function hoverBox(refRect: FluidRect, e: G, align: FluidAlign): void;
export function hoverBox({ x, y, right: r, bottom: b }: FluidRect, e: G, [o, side, main]: FluidAlign) {
  let
    { innerHeight: wh, innerWidth: ww } = window,
    { width: ew, height: eh } = e.rect,
    h = o == "h",
    border = $.rem * .4,
    [ws, wm, es, em, s0, m0, s1, m1] = h ? [wh, ww, eh, ew, y, x, b, r] : [ww, wh, ew, eh, x, y, r, b];
  main ||= (m0 + (m1 - m0) / 2) > (wm / 2) ? "s" : "e";
  e
    .css({
      ["max" + (h ? "Width" : "Height")]: (main == "e" ? wm - m1 : m0) - border * 2 + "px",
      [h ? "left" : "top"]: (main == "e" ? m1 + border : Math.max(0, m0 - em) - border) + "px",
      ["max" + (h ? "Height" : "Width")]: (side == "e" ? ws - s0 : s1) - border + "px",
      [h ? "top" : "left"]: Math.max(0, Math.min(ws - es, side == "s" ? s1 - es : side == "e" ? s0 : s0 + (s1 - s0) / 2 - es / 2)) + "px",
    });
}

/** Settings configuring generic framework message notifications. */
export interface Notify {
  /** Color theme setting. */
  style?: Color;
  /** Whether dialog exposes a manual close button. */
  close?: bool;
  /** Vertical positioning directive. */
  v?: Tt;
  /** Horizontal positioning directive. */
  h?: Tt;
}

/**
 * Generates an automatic self-dismissing feedback banner.
 * @param content Inside element contents.
 * @param config Notification settings configuration.
 */
export function notify(content: any, { style, close: cl, v, h }: Notify) {
  let temp = div(`_ notify msg ${style || ""} ${v || ""} ${h || ""}`).addTo(body());
  let r = () => temp.remove();
  temp.add([
    content,
    t(cl) && close(r)
  ]);
  setTimeout(r, 2_000);
}

/** Menu items layout task definition. */
export type MenuItems = Task<Array<GTr | HTTr | MenuItems>>;

/** Table row element reference wrapper. */
export type Tr = One<HTMLTableRowElement>;

/** Types representing menu contents. */
export type MenuContent = Content<(NotRender | Tr | (NotRender | Tr)[])[] | Tr>;

/**
 * Menu table shell element constructor.
 * @param items Menu records content configuration.
 */
export function menu(items?: MenuContent) { return div("_ menu", g("table", 0, items)); }

/**
 * Menu item row renderer helper.
 * @param i Icon asset configuration.
 * @param text Option label.
 * @param action Trigger callback function.
 * @param side Ancillary right aligned option content.
 * @param disabled Element disabled status flag.
 */
export function menuitem(i: Icon, text: any, action?: falsy | ((e: MouseEvent) => any), side?: any, disabled?: bool) {
  return g("tr", `i ${disabled ? C.disabled : ""}`, [
    g("td", 0, icon(i)),
    g("td", 0, text),
    g("td", C.side, side),
    g("td")
  ]).on("click", !disabled && action);
}

/**
 * Renders a menu checkable toggle option.
 * @param checked Toggle status.
 * @param text Option label.
 * @param toggle Trigger status change callback.
 * @param id Element unique index.
 * @param disabled Option disabled status.
 */
export function menucb(checked: bool, text: any, toggle?: (this: G<HTInput>, checked: bool) => any, id?: str, disabled?: bool) {
  let input = g("input", { id, checked, disabled, indeterminate: checked == null, type: "checkbox" });
  toggle && input.on("input", () => toggle.call(input, input.e.checked));
  return g("tr", `i ${disabled ? C.disabled : ""}`, [
    g("td", 0, input),
    g("td", 0, text).on("click", () => input.e.click()),
    g("td"), g("td")
  ]).on("click", e => e.stopPropagation());
}

/**
 * Appends a waiting spinner wrapper record within menu lists.
 * @param callback Promise action mapping resource completion callback.
 */
export function menuwait(callback?: WaitCB) {
  return call(g("tr", 0, g("td", 0, wait(WaitType.out)).p("colSpan", 4)), tr => waiter(tr, callback));
}

/**
 * Nested submenu list builder component.
 * @param i Icon asset configuration.
 * @param text Submenu label option.
 * @param items Submenu records array.
 */
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
  });
});

/**
 * Renders an inline divider line inside menus.
 */
export const menusep = () => g("tr", "_ hr");

/**
 * Standard horizontal toolbar constructor.
 * @param items Toolbar children elements.
 * @deprecated Use containedBar instead.
 */
export function menubar(...items: any) { return div("_ bar", items); }

/**
 * Renders a semantic container navigation bar.
 * @param items Toolbar elements.
 */
export function containedBar(...items: any) {
  return g("nav", "_ bar", div("_ container", items));
}

/**
 * Returns a right aligned empty layout divider cell.
 * @deprecated Use CSS margins instead.
 */
export function right() { return div(HAlign.right); }

/**
 * Menu bar action button builder.
 * @param i Icon configuration.
 * @param text Option label.
 * @param action Trigger callback function.
 */
export function mbitem(i: Icon, text: any, action?: (e: MouseEvent) => any) {
  return g("button", "i", [icon(i), text]).p({ type: "button" }).on("click", action);
}

/**
 * Menu bar element divider helper.
 */
export function mbsep() { return g("hr"); }

/**
 * Renders a checked option toggler in menu bars.
 * @param checked Toggle status.
 * @param text Option label.
 * @param toggle Trigger status change callback.
 * @param disabled Option disabled status.
 */
export function barcb(checked: bool, text: any, toggle?: (this: G<HTInput>, checked: bool) => any, disabled?: bool) {
  let input = g("input", { checked, disabled, indeterminate: checked == null, type: "checkbox" });
  toggle && input.on("input", () => toggle.call(input, input.e.checked));
  return g("label", `i ${disabled ? C.disabled : ""}`, [input, text]);
}

/** Callback types indicating wait completions. */
export type WaitCB = PromiseLike<any> | (() => Promise<any>);

/** Standard progress loading layouts. */
export const enum WaitType {
  inline,
  out,
}

/**
 * Builds generic loading skeletons.
 * @param type Loader style config.
 */
export function ph(type = WaitType.out) {
  switch (type) {
    case WaitType.inline:
    case WaitType.out:
      return div(C.loading, []);
  }
}

/**
 * Replaces element with resource contents when waiter Promise completes.
 * @param element Target loader element.
 * @param cb Promise-like callback.
 */
export function waiter(element: G, cb: WaitCB) {
  cb && (isP(cb) ? cb : cb?.()).then(t => {
    if (t instanceof G) {
      t.c(Array.from(element.e.classList).slice(1));
      t.attr("style",
        (t.attr("style") || "") +
        (element.attr("style") || "")
      );
    }
    element.replace(t);
  });
}

/**
 * Renders a waiting progress element.
 * @param type Waiting design format.
 * @param body Async task trigger.
 */
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

/**
 * Returns a loading placeholder.
 * @param sz Layout sizing scale. Defaults to "n".
 */
export function loading(sz = "n") { return div("_ blank", div("_ load " + sz)); }

/**
 * Resolves asynchronous processes wrapping element interactions with busy states.
 */
export function busy<T>(cb: () => Task<T>, sz?: Size, time?: int): G | T;
export function busy(container: G, cb: (close: () => void) => any, sz?: Size, time?: int): Promise<void>;
export function busy(arg0: any, arg1?: any, arg2?: any, arg3?: any) {
  if (isF(arg0)) {
    let e = g("span");
    (async () => {
      let t = setTimeout(() => e.replace(e = loading(arg1)), def(arg2, 750));
      e.replace(e = await arg0());
      clearTimeout(t);
    })();
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
      try { await arg1(close); }
      finally { close(); }
    })();
  }
}

/**
 * Asynchronously translates standard file blobs to Base64 data strings.
 * @param v Blob object file resource.
 */
export const blobToBase64 = (v: Blob) => new Promise<str>((rs, rj) => {
  var reader = new FileReader();
  reader.readAsDataURL(v);
  reader.onloadend = () => rs(reader.result as str);
  reader.onerror = rj;
});

/**
 * Sets document mouse event listeners tracking cursor translations.
 * @param cursor CSS cursor identifier configuration.
 * @param move Translation track change listener.
 * @param endcallback mouseUp complete callback.
 */
export function moveondoc(cursor: Property.Cursor, move: (e: MouseEvent) => void, endcallback?: (e: MouseEvent) => void) {
  topLayer().css({ cursor, userSelect: "none" });
  doc()
    .on('mousemove', move)
    .one('mouseup', e => {
      topLayer().uncss("cursor", "userSelect");
      doc().off('mousemove', move);
      endcallback?.(e);
    });
}

/** Valid text-based HTML inputs. */
export type TextInputTp = "text" | "email" | "url" | "tel";

/** Supported form controls. */
export type InputTp = TextInputTp | "number" | "search" | "checkbox" | "radio" | "password";

/**
 * Renders a standard HTML input field wrapper.
 * @param type Control type format.
 * @param name Key input namespace.
 * @param ph Optional background placeholder.
 * @param input Value update callback function.
 */
export const input = (type: InputTp, name: str, ph?: str, input?: (e: Event) => any) =>
  g("input", { type, name, placeholder: ph }).c("_ in").on("input", input);

/**
 * Renders a multiline textarea input control.
 * @param name Key input namespace.
 * @param ph Background label text placeholder.
 * @param input Callback mapping changes.
 */
export const textarea = (name: str, ph: str, input?: (text: str) => void) =>
  g("textarea", { name, placeholder: ph }).c("_ in").on("input", input && (function () { input(this.value); }));

/**
 * Renders a checklist switch option.
 * @param label Option text.
 * @param input Callback mapping status updates.
 * @param checked Initial toggle state.
 */
export const checkbox = (label: any, input?: (checked: bool) => void, checked?: bool) =>
  g("label", "_ cb", [g("input", { type: "checkbox", checked }).on("input", input && (function () { input(this.checked); })), label]);

/**
 * Renders a single-select radio button option.
 * @param label Option text.
 * @param name Option namespace block.
 * @param input Callback mapping status updates.
 * @param checked Initial toggle state.
 */
export const radio = (label: any, name: str, input?: (checked: bool) => void, checked?: bool) =>
  g("label", "_ cb", [g("input", { type: "radio", checked, name }).on("input", input && (function () { input(this.checked); })), label]);

/**
 * Renders a standard search input field.
 * @param input Search terms changes callback.
 * @param value Preloaded query value string.
 */
export function search(input?: (value: str) => any, value?: str) {
  let t = g("input", { type: "search", placeholder: w.search, value }), i = icon(icons.search);
  input && delay(t, "input", $.delay, () => input(t.v()));
  return (i ? div([t, i]) : t).c("_ in");
}

/**
 * Builds standard output text elements.
 * @param content Inside element contents.
 */
export const output = (...content) => g("span", "_ out", content);

/**
 * Builds key-value layout elements.
 * @param key Label property header.
 * @param val Label value property.
 * @param c Text thematic coloring configuration.
 * @param tag Custom wrapper tag. Defaults to "span".
 */
export const keyVal = (key: any, val: any, c?: Color | falsy, tag: HTMLTag = "span") =>
  g(tag, `_ out ${c || ""}`, [key, ": ", val]);

/**
 * Builds status notification messages containers.
 * @param c Thematic coloring parameter.
 * @param data Inside text configuration elements.
 */
export const message = (c?: Color, data?) => div("_ msg", data).c(c);

/**
 * Builds standard error notification elements.
 * @param data Details message content.
 */
export const errorMessage = (data?) => message("error", data);

/** Target dialog element reference. */
export type IModal = One<HTMLDialogElement>;

/** Modal dialog element wrapper. */
export type Modal = G<HTDialog>;

/**
 * Base dialog presentation layer creator.
 * @param cls Custom layout wrapper classes.
 * @param hd Header component configuration.
 * @param bd Body rendering layout function.
 * @param blur Whether backdrop clicks dismiss the dialog.
 */
export function dialog(cls: str, hd: any, bd: (close: () => void, modal: Modal) => any, blur = true) {
  let content: Modal = g("dialog", "_ " + cls);
  content.on("cancel", (e) => {
    if (blur) {
      content.remove();
      clearEvent(e);
    }
  });
  if (blur)
    content.on("click", e => {
      if (e.target == e.currentTarget)
        content.remove();
    });
  content
    .add(g("form", 0, [
      hd,
      bd(() => content.remove(), content),
    ]))
    .addTo(body())
    .e.showModal();
  return content as Modal;
}

/**
 * Sidebar overlay presentation wrapper.
 * @param hd Header container layout.
 * @param bd Body container layout.
 * @param blur Whether clicks outside trigger close dismissals.
 */
export function sidebar(hd: any, bd?: any | ((close: () => void, modal: G) => any), blur = true) {
  return dialog("side", hd, isF(bd) ? bd : (() => bd), blur);
}

/**
 * Renders modal prompt window containers.
 * @param hd Modal window title.
 * @param bd Modal window content elements.
 * @param actions Action button builder callback.
 * @param sz Sizing container configuration.
 * @param blur Close on blur state flag.
 */
export function modal(hd: Label, bd?: any, actions?: (close: () => void, modal: G) => any, sz?: Size, blur = true) {
  return dialog(
    "modal " + (sz || ""),
    label(hd, "hd"),
    (cl, c) => [
      isE(bd) ? bd.c("bd") : bd,
      actions && div("ft", actions(cl, c))
    ], blur);
}

/**
 * Renders modal window containing tabs.
 * @param initial Opening layout tab index identifier.
 * @param items Array of configured tab segments.
 * @param actions Form submit controls rendering builder callback.
 * @param sz Sizing container metric. Defaults to "xl".
 */
export function tabModal(initial: int, items: TabItem[], actions: (close: () => void, modal: G) => any = (cl) => confirm(cl), sz = "xl") {
  let form = g("form", "_ tab");
  let content = g("dialog", "_ modal " + (sz || ""), form);
  let hd = div("_ main bar", items.map(([h, b]) => call(label(h, "i"), e => e.on("click", () => {
    form.set([hd, b, div("ft", actions(() => (content as Modal).remove(), content))]);
    hd.childs().c("on", false);
    e.c("on");
  }))));
  content.addTo(body()).e.showModal();
  hd.child<HTMLDivElement>(initial).e.click();
  return content;
}

/**
 * Triggers modal display tracking, appending document lock overlays.
 * @param e Modal container instance wrapper.
 */
export const showDialog = (e: Modal) => e.addTo(body().c("dialog-on")).call("showModal").on("close", () => {
  e.remove();
  body().c("dialog-on", false);
});

/**
 * Displays modal confirmation dialog layout exposing OK/Cancel keys.
 * @param body Custom display elements configuration.
 * @param sz Sizing constraint. Defaults to "xs".
 * @param valid Pre-submission validation checklist callback.
 */
export function mdOkCancel(body: any, sz: Size = "xs", valid = () => true) {
  return new Promise<bool>(ok => modal(null, wrap(body), cl => [
    confirm(() => { if (valid) { cl(); ok(true); } }).css({ width: "50%" }),
    cancel(() => { cl(); ok(false); }).css({ width: "50%" })
  ], sz));
}

/**
 * Displays modal confirmation dialog layout exposing Yes/No keys.
 * @param body Custom display elements configuration.
 * @param sz Sizing constraint. Defaults to "xs".
 * @param valid Pre-submission validation checklist callback.
 */
export function mdYN(body: any, sz: Size = "xs", valid = () => true) {
  return new Promise<bool>(ok => modal(null, wrap(body), cl => [
    positive(null, w.yes, () => { if (valid) { cl(); ok(true); } }).css({ width: "50%" }),
    negative(null, w.no, () => { cl(); ok(false); }).css({ width: "50%" })
  ], sz));
}

/**
 * Displays standard modal popups exposing single OK action buttons.
 * @param body Custom display content.
 * @param sz Sizing container metric. Defaults to "xs".
 */
export function mdOk(body: any, sz: Size = "xs") {
  return new Promise<void>(ok => modal(null, wrap(body),
    cl => confirm(() => { cl(); ok(); }),
    sz));
}

/**
 * Displays error modal popups styled with alert themes.
 * @param body Custom display content.
 * @param sz Sizing container metric. Defaults to "xs".
 */
export function mdError(body: any, sz: Size = "xs") {
  return new Promise<void>(ok => modal(null, wrap(body),
    cl => confirm(() => { cl(); ok(); }),
    sz).c("error"));
}

/**
 * Locates the current active top dialog element wrapper.
 */
export const topLayer = () => g(getAll(":modal>form").at(-1)) || body();

/**
 * Places custom tooltips overlay fluidly around relative triggers.
 * @param refArea Trigger element boundaries boundaries callback.
 * @param div Display contents overlay.
 * @param align Placement format directive.
 */
export function popup(refArea: () => FluidRect, div: G, align: FluidAlign) {
  return anim(() => topLayer().contains(div) && hoverBox(refArea(), div, align));
}

/**
 * Spawns context menu lists on viewport target click event.
 * @param e Trigger mouse event.
 * @param data Menu choices configuration data.
 * @param align Context overlay align settings. Defaults to "ve".
 */
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

  ctx.queryAll('button').on('click', function () { last ? last.focus() : this.blur(); });
  tl.on("wheel", wheelHandler, { passive: false });
  popup(() => new DOMRect(e.clientX, e.clientY, 0, 0), ctx, align);
}

/**
 * Appends contextual hovering details content over element blocks.
 * @param root Trigger element wrapper.
 * @param content Tooltip text content elements.
 * @param align Overlay placement layout directives.
 */
export function tip<T extends HSElement>(root: One<T>, content: any, align?: FluidAlign): G<T>;
export function tip<T extends HSElement>(root: G<T>, tip: G, align: FluidAlign = "v") {
  if (tip) {
    if (isP(tip)) {
      let t = tip;
      tip = div("_ tip", wait);
      t.then(v => { tip = wrap(v, "_ tip"); });
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
      mouseleave() { tip.remove(); }
    });
  } else return root;
}

/** Select root base config setup. */
export interface iRoot extends pSelectBase {
  /** Allows element to gain focus. */
  tab?: bool;
}

/** Framework select components structure. */
export type Root = Component<iRoot, { open?: [bool] }> & {
  value: Key;
};

/** Select controllers base parameters. */
export interface pSelectBase {
  open?: bool;
  /** Adds dropdown indicator down icon. */
  icon?: bool;
  /** Opens control context when clicked. */
  click?: bool;
  off?: bool;
}

/** Framework select component wrapper. */
export interface SelectBase<T extends pSelectBase = pSelectBase> extends Component<T, { open?: [bool] }> { }

/**
 * Initializes generic framework dropdown elements binding key events.
 * @param me Component wrapper instance.
 * @param options Target list choices structure tracking changes.
 * @param label Control display value container.
 * @param menu Control options choices list wrapper.
 * @param setValue Updates model value callback function.
 * @param tag Custom component wrapper container tags.
 */
export function selectRoot(me: SelectBase, options: L, label: G, menu: G, setValue: (v: Key) => any, tag?: HTMLTag) {
  let p = me.p;
  let root = onfocusout(g(tag || "button", `_ in ${C.select}`, [label.c("bd"), t(p.icon) && icon(icons.dd)?.c(C.side)]), () => me.set("open", false))
    .p("tabIndex", 0).on({
      focus(e) {
        if (p.off) {
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
              let _ = (l(options) == 1 ? options[0] : options.tag('on'));
              _ && setValue(_[options.key]);
              me.set("open", false);
            } else return;
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
      },
    });
  tag || root.attr("type", "button");
  if (t(p.click))
    root.on('click', (e) => {
      if (!menu.contains(e.target as HTMLElement))
        me.toggle("open");
    });
  me.on(state => {
    if ("off" in state) {
      if (p.off) me.set("open", false);
      root.attr("disabled", p.off);
    }
    if ("open" in state) {
      if (p.open && p.off) {
        me.set("open", false);
        return;
      }
      me.emit('open', p.open);
      root.c("on", p.open);

      if (p.open) {
        root.add(menu);
        anim(() => {
          let r = root.rect;
          return body().contains(menu) && (menu.css("minWidth", r.width + "px"), hoverBox(r, menu, "ve"));
        });
      } else {
        root.c([VAlign.bottom, VAlign.top], false);
        menu.remove();
      }
    }
  });

  return root;
}

/** Standard select inputs options configuration. */
export interface iSingleSelectBase<T = Dic> extends pSelectBase {
  clear?: bool;
  ph?: any;
  item?(v: T): any;
}

/** Base select items component definition. */
export interface SingleSelectBase<K = any, T = Dic> extends SelectBase<iSingleSelectBase<T>> {
  option(k: K): Task<Dic>;
  value: K;
}

/**
 * Binds single selection displays updating contents.
 * @param me Selector component wrapper model.
 * @param label Text elements contents container.
 */
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

/**
 * Dynamic popup selector menu wrapper component.
 * @param label Header content toggle display element.
 * @param items Menu layout records contents.
 * @param align Placement fluid format config. Defaults to "ve".
 * @param closeOnBlur Dismisses choices context on blur.
 */
export const dropdown = (label: any, items: MnItems, align: FluidAlign = "ve", closeOnBlur?: bool) =>
  call(div("_ dd i", label).p("tabIndex", 0), e => {
    function cl() { mn?.remove(); e.c("on", false); }
    let mn: G;
    t(closeOnBlur) && onfocusout(e, cl);
    e.on("click", () => {
      if (mn?.parent) cl();
      else {
        (mn ||= isF(items) ? items(cl) as G : menu(items)).addTo(e.c("on"));
        popup(() => e.rect, mn, align);
      }
    });
  });

/**
 * Builds standard icons decorated dropdown controls.
 * @param label Main header label.
 * @param items Dynamic options data list.
 * @param align Layout bounds configurations.
 * @param closeOnBlur Closes context on focus-out events.
 */
export const idropdown = (label: any, items: MnItems, align?: FluidAlign, closeOnBlur?: bool) =>
  dropdown([label, icon(icons.dd)], items, align, closeOnBlur);

/** Accordion segment values item array config. */
export type AccordionItem = [head: any, body: any];

/** Accordion styling constraints setting. */
export interface IAccordion {
  icon?: bool;
  single?: bool;
  def?: int;
}

/**
 * Basic hidden details drawer wrapper component.
 * @param head Visible toggle details header.
 * @param body Drawer contents body.
 * @param open Open configuration status flag.
 */
export const hidden = (head: any, body: any, open?: bool) => div(`_ ${C.accordion}`, [
  head = div("hd", [
    icon("menuR"),
    head
  ]).c(C.on, !!open).on("click", () => (<G>head).tcls(C.on)),
  wrap(body, "bd")
]);

/**
 * Accordion tabs grouping helper.
 * @param items Drawer values array data config.
 * @param i Style settings configuration.
 */
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

/** Tab menu components properties layout. */
export type TabItem = [hd: Label, bd: any];

/**
 * Standard tab navigation layout builder.
 * @param initial Opening tab view index.
 * @param items Configuration segments list.
 */
export function tab(initial: int, items: TabItem[]) {
  let
    hd = div("_ bar", items.map(([h, b]) => call(label(h, "i"), e => e.on("click", () => {
      d.set([hd, b]);
      hd.childs().c("on", false);
      e.c("on");
    })))),
    d = div("_ tab");
  hd.child<HTMLDivElement>(initial).e.click();
  return d;
}