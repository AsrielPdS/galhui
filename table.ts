import { clearEvent, div, E, g, m, One, S, wrap } from "galho";
import { Alias, extend, L } from "galho/orray.js";
import { bool, def, Dic, int, isN, isS, l, str, t } from "galho/util.js";
import { dropdown } from "./dropdown.js";
import { $, body, C, doc, icon, w } from "./galhui.js";
import { crudHandler, FieldPlatform, ICrud, kbHandler, OutputCtx, RecordStyle } from "./list.js";
import { menucb } from "./menu.js";
import { up } from "./util.js";

export interface Sort {
  multiple?: bool;
  clear?: bool;
  call(column: Column, active: bool): any;
}
function defineSize(items: { size?: int }[]) {
  let
    size = 0,
    l = items.length,
    sizes = [];
  for (let i of items) {
    let s = i.size || 1 / l;
    sizes.push(s);
    size += s;
  }
  for (let i = 0; i < l; i++)
    items[i].size = (sizes[i] / size) * 100;
}
export const editing = Symbol();

export type Option<T> = ((item: T, index: number) => One);
export type DataType = 's' | 'd' | 'b' | 'n';
export type TAlign = "center" | "justify" | "left" | "right" | "start" | "end";
export interface Column {
  key: str;
  size?: int;
  align?: TAlign;
  text?: any,
  dt?: DataType;
  desc?: bool;
  input?(): One;
  compare?(a: any, b: any): number;
  fmt?: ((ctx: OutputCtx) => any) | str;
}
export interface ITable<T extends Dic> extends ICrud<T> {
  // data?: L<T>;
  /**columns */
  cols?: L<Column>
  allColumns?: Column[];
  reqColumns?: str[];
  enum?: boolean;
  // options?: Option<T>[];

  resize?: boolean;
  head?(column: Column);

  empty?: () => void;

  key?: string;
  style?: RecordStyle;
  sort?: Sort;
  corner?: any;
  p?: FieldPlatform;
  fill?: bool;
  foot?: Foot[];
}
export type Foot = (tb: Table) => One;
export default class Table<T extends Dic = Dic> extends E<ITable<T>, { resizeCol: never }>{
  // get data() { return this.i.data as L<T>; }
  // get footData() { return this.i.foot as L<T>; }
  get cols() { return this.i.cols; }

  data: L<T>;
  // foot: Foot[];
  constructor(i: ITable<T>, data?: Alias<T>) {
    // i.data = data as L;
    super(i);
    this.data = extend(data, {
      g: i.single ? null : ["on"],
      key: i.key,
      clear: true
    });
    // this.foot = foot && extend<T>(foot, {
    //   key: i.key,
    //   clear: true
    // });

    i.head ||= c => def(def(c.text, w[c.key]), up(c.key));
  }
  /**column css */
  ccss(e: S, i: int, span?: int): S
  ccss(e: S, column: Column): S
  ccss(e: S, c: int | Column, span = 1) {
    let sz = 0;
    if (isN(c)) {
      let cs = this.cols;
      for (let j = 0; j < span; j++)
        sz += cs[c + j].size;
    };
    return e.c("i").css("width", (sz || (c as Column).size) + (this.i.fill ? '%' : 'px'));
  }
  view() {
    let
      i = this.i,
      cols = i.cols,
      all = i.allColumns,
      req = i.reqColumns,
      data = this.data,
      hdOptsLeave: any,
      hdOpts = all && dropdown(null, all.map(c => {
        return menucb(cols.includes(c), def(def(c.text, w[c.key]), up(c.key)), checked => {
          if (checked) {
            cols.push(c);
            cols.sort((a, b) => all.indexOf(a) - all.indexOf(b));
          } else cols.remove(c);
        }, c.key, req && (req.includes(c.key)))
      })).on("click", e => clearEvent(e)),
      hd = cols.bind(div("hd tr", wrap(i.corner, C.side)), {
        insert: (c, j, p) => {
          let s = this.ccss(wrap(i.head(c), C.item), c);
          if (i.resize)
            div([C.separator]).addTo(s).on('mousedown', e => {
              clearEvent(e);
              let
                index = cols.indexOf(c) + 1,
                //t = '.' + C.item + ':nth-child(' + (index + 2) + ')',
                rows = d.childs().child(index);
              body.css({ cursor: 'col-resize', userSelect: "none" });
              function move(e: MouseEvent) {
                c.size = (c.size = Math.max($.rem * 3, e.clientX - s.rect().left));
                rows.css({ width: c.size + 'px' });
              }
              doc.on('mousemove', move).one('mouseup', () => {
                doc.off('mousemove', move);
                body.uncss(["cursor", "userSelect"]);
              });
            });

          i.sort && s.on("click", () => {
            if (cols.tag("sort") == c)
              if (c.desc) {
                c.desc = false;
                cols.tag("sort", null);
              } else {
                c.desc = true;
                cols.retag("sort");
              }
            else {
              c.desc = false;
              cols.tag("sort", c);
            }
          })
          hdOpts && s.on({
            mouseenter() { clearTimeout(hdOptsLeave); s.add(hdOpts) },
            mouseleave() { hdOptsLeave = setTimeout(() => hdOpts.remove().child(".menu")?.remove(), 300); }
          });
          p.place(j + 1, s);
        },
        tag(s, active, tag, v, j, p) {
          switch (tag) {
            case "sort":
              (s = p.child(j + 1)).child(".sort")?.remove();
              if (active)
                s.add(icon($.i[v.desc ? 'desc' : 'asc']).c("sort"));
              i.sort.call(v, active);
              break;
            default:
              s.c(tag, active);
          }
        },
        remove(_, _i, p) { p.unplace(_i + 1); },
        clear(p: S) { p.childs(1).remove(); }
      }),
      foot = (v: Foot) => g(v(this), "_ ft tr"),
      ft = i.foot && m(...i.foot?.map(foot)),
      d: S = div("_ tb" + (i.fill ? " fill" : ""), [hd, ft])
        .prop('tabIndex', 0)
        .on("keydown", (e) => kbHandler(data, e, i) && clearEvent(e));

    data.bind(d, {
      insert: (s, j, p) => {
        let t2 = div("_ tr i", [
          div(C.side),
          cols.map(c => {
            let v = s[c.key];
            return this.ccss(wrap(c.fmt ? isS(c.fmt) ? $.fmt(v, c.fmt) : c.fmt({ v, p: i.p, s }) : v).css({ textAlign: c.align }), c);
          }),
          // i.options && div(C.options, i.options.map(opt => opt(s, _i)))
        ]).d(s);
        i.style?.(t2, s, j);
        p.place(j + 1, crudHandler(t2, data, i));
      },
      tag(s, active) {
        s.c(C.current, active).e.scrollIntoView({
          block: "nearest",
          inline: "nearest"
        });
      },
      remove(_, i, p) { p.unplace(i + 1) },
      clear(s) { s.childs(".i").remove() },
      groups: { on: (s, active) => s.c("on", active) }
    });
    i.cols.onupdate(() => {
      this.data.reloadAll();
      ft?.eachS((f, j) => f.replace(foot(i.foot[j])));
    });
    i.resize && d.c(C.bordered)
    return d;
  }
  // /**rendered data */
  // rData() {
  //   return _rData(g(this).child('.bd'), this.cols);
  // }
}
/**rendered data */
function _rData(p: S, cols: L<Column>) {
  let r: Array<Dic<string>> = [];

  p.childs().do((s, i) => {
    let t = r[i] = {}, cells = s.childs();
    for (let j = 0; j < l(cols); j++)
      t[cols[j].key] = g(cells[j + 1]).text();
  });
  return r;
}