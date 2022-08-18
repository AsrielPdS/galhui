import { active, cl, clearEvent, div, g, HSElement, One, S, wrap } from "galho";
import { bool, ex, Key, str, t, Task } from "./util.js";
import { body, C, cancel, close as closeBT, Color, confirm, HAlign, hc, icon, Icon, negative, positive, VAlign, w } from "./galhui.js";
import type { MenuItems } from "./menu.js";

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
  let resolve: any, p = ex(new Promise<K>(r => resolve = r) as Modal<K>, i);
  p.cb = resolve;
  return p;
}
export function modalBody<K>(md: Modal<K>, bd: any, actions?: S[], i: IBody = {}) {
  md.body = g("form", cl("_ modal panel", i.cls), [
    wrap(bd, "bd"),
    t(i.close) && closeBT(() => closeModal(md)),
    actions && div(C.foot, actions.map(a => a.on('click', e => { e.preventDefault(); closeModal(md, a.d()) })))
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
  return openModal(mapButtons(addClose(md)));
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
/**dropdown with width>=base.width  */
export function fluid({ left: l, right: r, bottom: b, top: t, width: w, height: h }: DOMRectReadOnly, menu: S, vAlign?: VAlign, hAlign?: HAlign, sub?: boolean) {
  let
    wh = window.innerHeight,
    ww = window.innerWidth;

  if (!vAlign)
    vAlign = (t + h / 2) > (wh / 2) ? VAlign.top : VAlign.bottom;

  if (!hAlign)
    hAlign = (l + w / 2) > (ww / 2) ? HAlign.left : HAlign.right;

  menu.css('minWidth', w + 'px');
  if (vAlign == VAlign.top) {
    menu
      .uncss(['top'])
      .css({
        bottom: (wh - (sub ? b : t)) + 'px',
        maxHeight: (sub ? b : t) + 'px'
      })
      .cls(VAlign.bottom, false);

  } else {
    menu
      .uncss(['bottom'])
      .css({
        top: (sub ? t : b) + 'px',
        maxHeight: (wh - (sub ? t : b)) + 'px'
      })
      .cls(VAlign.top, false);

  }
  if (hAlign == HAlign.left) {
    menu
      .uncss(['left'])
      .css('right', (ww - (sub ? l : r)) + 'px')
      .cls(HAlign.right, false);
  } else {
    menu
      .uncss(['right'])
      .css('left', (sub ? r : l) + 'px')
      .cls(HAlign.left, false);
  }
  menu.cls([vAlign, hAlign]);

}
/**dropdown with width=base.width  */
export function fixedMenu(base: S, menu: S, align?: VAlign) {
  base.cls([VAlign.top, VAlign.bottom], false).cls(fixed(base.rect(), menu, align));
}
export function fixed({ left: l, bottom: b, top: t, width: w }: DOMRectReadOnly, menu: S, align?: VAlign) {
  let wh = window.innerHeight;

  menu.css('width', w + 'px');
  if (wh / 2 - t > 0) {
    menu.css({
      left: l + 'px',
      top: b + 'px',
      maxHeight: (wh - b) + 'px'
    }).uncss(['bottom']);
    return VAlign.bottom;
  }

  menu.css({
    left: l + 'px',
    bottom: (wh - t) + 'px',
    maxHeight: t + 'px'
  }).uncss(['top']);
  return VAlign.top;

}
export function popup(div: S, e: () => DOMRectReadOnly) {
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
  requestAnimationFrame(function _() {
    fluid(e(), ctx);
    if (body.contains(ctx))
      requestAnimationFrame(_);
  });
  body.on("wheel", wheelHandler, { passive: false });
}
/**context menu */
export function ctx(e: MouseEvent, data: MenuItems) {
  clearEvent(e);
  popup(div("_ menu", g("table", 0, data)), () => new DOMRect(e.clientX, e.clientY, 0, 0));
}
export function tip<T extends HSElement>(root: S<T>, div: any, vAlign?: VAlign, hAlign?: HAlign) {
  div = wrap(div).cls("_ tip");
  return root?.on({
    mouseenter() {
      body.add(div);
      requestAnimationFrame(function _() {
        fluid(root.rect(), div as S, vAlign, hAlign);
        if (body.contains(div))
          requestAnimationFrame(_);
      });
    },
    mouseleave() { (div as S).remove() }
  });
}