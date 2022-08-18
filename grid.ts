import { cl, clearEvent, div, E } from "galho";
import { $, C, Size, icon, Icon, logo } from "./galhui.js";
import { L } from "orray";
import { crudHandler, ICrud, kbHandler, kbHTp } from "./list.js";

export interface Node {
  key?: str;
  txt?: str;
  icon?: Icon;
}
export interface IGrid<T> extends ICrud<T> {
  sz: Size;
  info?: {
    fields: str[];
    max: int;
    showKey?: bool;
  };
  dt: L<T>;
  defIcon: Icon;

}
export class Grid<T extends Node> extends E<IGrid<T>>{
  perLine = 1;
  margin = 0;
  get dt() { return this.i.dt; }
  resize() {

    // let
    //   d = g(this),
    //   w = d.rect().width,
    //   mrg = hs(theme.a.mrg),
    //   itemW = hs(theme.grid.sz) + mrg * 2,
    //   spc = w % itemW,
    //   pl = this.perLine = ((w - spc) / itemW),
    //   m = this.margin = (spc / 2) / pl + mrg;
    // d.childs().css({
    //   marginLeft: m + "px",
    //   marginRight: m + "px",
    // })
  }
  view() {
    let
      i = this.i,
      dt = i.dt,
      d = crudHandler(div().attr("resize", true), dt, "grid", i);
    setTimeout(() => this.resize());
    return dt.bind(this.bind(d, () => d.uncls().cls(cl("_", i.sz, "grid")), "sz"), {
      insert: (v) => div(C.item, [
        logo(v.icon) || icon(i.defIcon),
        v.txt || v.key,
        i.info && div(C.side, i.info.fields.map(k => [k, v[k]])
          .filter(v => v[1] != null).slice(0, i.info.max)
          .map(([k, v]) => div(0, [i.info.showKey && k, v])))
      ]).d(v).css({
        marginLeft: this.margin + "px",
        marginRight: this.margin + "px",
      }),
      groups: (e, v, _, k) => e.cls(k, v),
    }).on({
      keydown: (e) => {
        if (!kbHandler(dt, e, i))
          switch (e.key) {
            case "ArrowLeft":
              kbHTp(dt, -1, e);
              break;
            case "ArrowRight":
              kbHTp(dt, 1, e);
              break;
            case "ArrowDown":
              kbHTp(dt, this.perLine, e);
              break;
            case "ArrowUp":
              kbHTp(dt, - this.perLine, e);
              break;
            default:
              return;
          }
        clearEvent(e);
      },
      resize: () => this.resize()
    })
  }
}
