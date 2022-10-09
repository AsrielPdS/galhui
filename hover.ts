import { active, cl, clearEvent, div, g, HSElement, One, onfocusout, S, wrap } from "galho";
import { assign, bool, float, Key, str, t, Task } from "galho/util.js";
import { $, body, C, cancel, close as closeBT, Color, confirm, hc, icon, Icon, negative, Ori, positive, w } from "./galhui.js";
import type { MenuItems } from "./menu.js";
import { anim } from "./util.js";

export interface IModal<K> {
  valid?: (key: K) => Task<unknown>;
  /**close on click out of modal */
  blur?: bool;

  // close?: bool;
  // cls?: str | str[];
  // valid?(key: K): any;
  /**submit button(called when press enter) */
  // submit?: S;
}
interface IBody { cls?: str, close?: bool }
export interface Modal<K> extends Promise<K>, IModal<K> {
  area: S;
  body: S;
  cb: (v: K) => void;
}
//TODO remover valid
export function modal<K = Key>(i: IModal<K> = {}) {
  let resolve: any, p = assign(new Promise<K>(r => resolve = r) as Modal<K>, i);
  p.cb = resolve;
  return p;
}
export function modalBody<K>(md: Modal<K>, bd: any, actions?: S[], i: IBody = {}) {
  md.body = g("form", cl("_ modal panel", i.cls), [
    wrap(bd, "bd"),
    t(i.close) && closeBT(() => closeModal(md)),
    actions && div("ft", actions.map(a => a.on('click', e => { e.preventDefault(); closeModal(md, a.d()) })))
  ]).on('keydown', (e) => {
    if (e.key == "Escape") {
      clearEvent(e);
      closeModal(md);
    }
  });
  return md;
}
export function openModal<K>(md: Modal<K>) {
  if (!md.area) {
    md.area = div(hc(C.modalArea), md.body).addTo(body);
    md.blur && md.area.prop("tabIndex", 0).on("focus", () => closeModal(md));
  }
  return md;
}
export function mdOpen(modal: S, blur?: bool) {
  let t = div(hc(C.modalArea), modal).addTo(body);
  blur && onfocusout(modal, () => t.remove())
  return t;
}
/**define a body and show modal */
export function openBody<K>(md: Modal<K>, bd: any, actions?: S[], i?: IBody) {
  return openModal(modalBody(md, bd, actions, i));
}
export async function closeModal<K>(md: Modal<K>, v?: K) {
  if (md.area && (!md.valid || await md.valid(v))) {
    md.area.remove();
    md.cb(v);
    md.area = null;
  }
}
export function mapButtons<K>(md: Modal<K>) {
  md.body.child(".ft").childs('[type="button"],[type="submit"]')
    .eachS(bt => bt.on("click", e => { e.preventDefault(); closeModal(md, bt.d()) }));
  return md;
}
export function addClose<K>(md: Modal<K>) {
  md.body.add(closeBT(() => closeModal(md)));
  return md;
}

export function fromPanel<K>(panel: One, i: IModal<K> = {}) {
  let md = modal(i);
  md.body = g(panel, "_ modal panel");
  return openModal(mapButtons(md));
}

export const headBody = (i: Icon, title: any, bd: any) => [
  div("hd", [icon(i), title]),
  wrap(bd, "bd"),
];

export function okCancel(body: any, valid?: () => any) {
  return openBody(modal({ valid: valid && (v => !v || valid()) }), body, [confirm().d(true), cancel()]);
}
export function yesNo(body: any, valid?: () => any) {
  return openBody(modal({ valid: valid && (v => !v || valid()) }), body, [positive(null, w.yes).d(true), negative(null, w.no)]);
}
export function ok(msg: any) {
  return openBody(modal(), msg, [confirm()]);
}
export function error(msg: any) {
  return openBody(modal(), msg, [confirm()], { cls: Color.error });
}

type Tt = /*start*/"s" | /*end*/"e" |/*center*/ "c";
export type FluidAlign = Ori | `${Ori}${Tt}` | `${Ori}${Tt}${Tt}` | [Ori, Tt?, Tt?];
interface FluidRect { x: float, y: float, right: float, bottom: float }
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
      ["max" + (h ? "Width" : "Height")]: (main == "e" ? wm - m1 : m0) - e*2 + "px",
      [h ? "left" : "top"]: (main == "e" ? m1 + e : Math.max(0, m0 - mm) - e) + "px",
      [h ? "top" : "left"]: Math.max(0, Math.min(ws - ms, side == "s" ? s1 - ms : side == "e" ? s0 : s0 + (s1 - s0) / 2 - ms / 2)) + "px",
    });
}
export function popup(div: S, e: () => FluidRect, align: FluidAlign) {
  let
    last = active(),
    ctx = div.prop("tabIndex", 0),
    // isOut: bool,
    wheelHandler = (e: Event) => clearEvent(e);
  ctx.queryAll('button').on('click', function () { last.valid ? last.focus() : this.blur() });

  ctx.on({
    focusout: (e: FocusEvent) => ctx.contains(e.relatedTarget as HTMLElement) || (ctx.remove() && body.off("wheel", wheelHandler)),
    keydown(e) {
      if (e.key == "Escape") {
        e.stopPropagation();
        ctx.blur();
      }
    }
  }).addTo(body).focus();
  // .css({
  //   left: opts.clientX + 'px',
  //   top: opts.clientY + 'px'
  // })
  anim(() => (fluid(e(), ctx, align), body.contains(ctx)));
  body.on("wheel", wheelHandler, { passive: false });
}
/**context menu */
export function ctx(e: MouseEvent, data: MenuItems) {
  clearEvent(e);
  popup(div("_ menu", g("table", 0, data)), () => new DOMRect(e.clientX, e.clientY, 0, 0), "ve");
}
export function tip<T extends HSElement>(root: S<T>, div: any, align?: FluidAlign): S<T>
export function tip<T extends HSElement>(root: S<T>, div: S, align: FluidAlign = "v") {
  div = wrap(div, "_ tip");
  return root?.on({
    mouseenter() {
      body.add(div);
      anim(() => body.contains(root) ?
        body.contains(div) && fluid(root.rect(), div as S, align) :
        (div.remove(), false));
    },
    mouseleave() { div.remove() }
  });
}