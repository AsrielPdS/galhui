import { div, E, g, S } from "galho";
import { $, C, hc, ibutton } from "./galhui";
import { Select } from "./select";
import { i as menuitem } from "./menu";
import { output } from "./output";

export interface IPagging {
  limit?: number;
  pag?: number;
  total?: number;
  hideOnSingle?: boolean;
  setlimit?: boolean;
  minLimit?: number;
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
      var limits = new Select<number>({
        value: i.limit,
        fluid: true,
        clear: false,
      }, [
        i.minLimit,
        i.minLimit * 2,
        i.minLimit * 4,
        i.minLimit * 10,
        i.minLimit * 20,
        { key: 0, text: 'Mostrar todos' }
      ]);
      g(limits).cls(C.full);
    }

    return this.bind(div("_ bar pag", [
      i.extreme && ibutton($.i.first, null, () => this.set('pag', 1)),
      ibutton($.i.prev, null, () => this.set('pag', i.pag - 1)),
      output(),
      ibutton($.i.next, null, () => this.set('pag', i.pag + 1)),
      i.extreme && ibutton($.i.last, count, () => this.set('pag', pags)),
      limits && [
        g("hr"),
        limits.on('input', (value) => { this.set('limit', value); })
      ],
      i.viewtotal && [ g("hr"), total = div(C.item)]
    ]), (s) => {
      if (i.viewtotal)
        total.set(`${Math.min(i.total - i.limit * (i.pag - 1), i.limit || i.total) || 0} / ${i.total || 0}`)
      pags = i.limit ? Math.ceil((i.total || 0) / i.limit) : 1;
      s.cls(C.off, !!(pags < 2 && i.hideOnSingle));

      let t = i.extreme ? 0 : 1
      s.child(2 - t).set(i.pag);

      s.childs<HTMLButtonElement>(0, 2 - t).prop('disabled', i.pag == 1);
      s.childs<HTMLButtonElement>(3 - t, 5 - t * 2).prop('disabled', i.pag == pags);

      count.set(pags);
    });
  }

  get pags() {
    let { limit: l, total: t } = this.i;
    return l ? Math.ceil((t || 0) / l) : 1
  }
}