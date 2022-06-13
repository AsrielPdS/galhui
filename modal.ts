import { cl, clearEvent, div, g, One, S, wrap } from "galho";
import { each } from "galho/m";
import { focusout } from "galho/s";
import { ex, t } from "inutil";
import { body, C, cancel, close as closeBT, Color, confirm, hc, icon, Icon, negative, positive, w } from "./galhui";

export interface IModal<K> {
  valid?: (key: K) => Task<bool>;
  /**close on click out of modal */
  blur?: bool;

  // close?: bool;
  // cls?: str | str[];
  // valid?(key: K): any;
  /**submit button(called when press enter) */
  // submit?: S;
}
function _modal(bd: any, actions?: S[], i: any = {}) {
  return new Promise<Key>(res => {
    let
      last = document.activeElement as HTMLElement,
      _close = function (this: any) {
        let dt = this && g(this).d();
        if (!i.valid || i.valid(dt)) {
          area.remove();
          res(<Key>dt);
          last?.focus();
        }
      },
      area = div(hc(C.modalArea), bd = div(cl("_ modal panel", i.cls), [
        t(i.close) && closeBT(_close),
        wrap(bd, "bd"),
        actions && div(C.foot, actions.map(a => a.on('click', _close)))
      ]).d(_close).prop("tabIndex", 0).on('keydown', (e) => {
        switch (e.key) {
          case "Escape":
            _close();
            break;
          case "Enter":
            actions?.[0]?.click();
            break;
          default: return;
        }
        clearEvent(e);
      })).addTo(body);

    t(i.blur) && focusout(bd, _close);

    bd.focus();
  })
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
  each(md.body.child(".ft").childs('[type="button"],[type="submit"]'),
    bt => bt.on("click", e => { e.preventDefault(); closeModal(md, bt.d()) }));
  return md;
}
export function addClose<K>(md: Modal<K>) {
  md.body.add(closeBT(() => closeModal(md)));
  return md;
}

export function fromPanel<K>(panel: One, i: IModal<K> = {}) {
  let md = modal(i);
  md.body = g(panel,"_ modal panel");  
  return openModal(mapButtons(addClose(md)));
}
// export class Modal<K = Key>{
//   constructor(public i: IModal<K> = {}) { }
//   area: S;
//   cb?: (value: K) => K

//   then(cb?: (value: K) => K) { md.cb = cb; }
// }

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
