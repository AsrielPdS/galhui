import { active, cl, clearEvent, delay, div, E, g, HSElement, One, onfocusout, S, svg, wrap } from "galho";
import { Alias, extend, L, orray, range } from "galho/orray.js";
import { assign, bool, byKey, call, def, Dic, fmt, int, is, isO, isP, isS, isU, Key, l, Pair, str, sub, t, Task } from "galho/util.js";
import { $, body, C, cancel, close, close as closeBT, Color, confirm, fluid, FluidAlign, FluidRect, hc, ibt, icon, Icon, Label, label, mbitem, MBItems, menu, menuitem, MenuItems, negative, positive, Size, VAlign, w, wait } from "./galhui.js";
import { anim } from "./util.js";
import { SelectIn } from "./form.js";
import { output } from "./io.js";

export interface IPagging {
  limit?: number;
  pag?: number;
  total?: number;
  hideOnSingle?: boolean;
  setlimit?: boolean;
  min?: number;
  viewtotal?: boolean;
  extreme?: boolean;
}
export class Pagging extends E<IPagging>{
  view() {
    let
      i = this.i,
      pags: number,
      count = g('span'),
      total: S;
    if (i.setlimit) {
      var limits = new SelectIn<Pair<str, int>, 0>({
        value: i.limit,
        fluid: true,
        clear: false
      }, [
        i.min,
        i.min * 5,
        i.min * 10,
        i.min * 10,
        i.min * 20,
        [0, 'Mostrar todos']
      ]);
    }

    return this.bind(div("_ bar pag", [
      i.extreme && mbitem($.i.first, null, () => this.set('pag', 1)),
      mbitem($.i.prev, null, () => this.set('pag', i.pag - 1)),
      output(),
      mbitem($.i.next, null, () => this.set('pag', i.pag + 1)),
      i.extreme && mbitem($.i.last, count, () => this.set('pag', pags)),
      limits && [
        g("hr"),
        limits.onset("value", ({ value }) => { this.set('limit', value); })
      ],
      i.viewtotal && [g("hr"), total = output()]
    ]), (s) => {
      if (i.viewtotal)
        total.set(`${Math.min(i.total - i.limit * (i.pag - 1), i.limit || i.total) || 0} / ${i.total || 0}`)
      pags = i.limit ? Math.ceil((i.total || 0) / i.limit) : 1;
      s.c(C.off, !!(pags < 2 && i.hideOnSingle));

      let t = i.extreme ? 0 : 1
      s.child(2 - t).set(i.pag);

      s.childs<HTMLButtonElement>(0, 2 - t).p('disabled', i.pag == 1);
      s.childs<HTMLButtonElement>(3 - t, 5 - t * 2).p('disabled', i.pag == pags);

      count.set(pags);
    });
  }

  get pags() {
    let { limit: l, total: t } = this.i;
    return l ? Math.ceil((t || 0) / l) : 1
  }
}