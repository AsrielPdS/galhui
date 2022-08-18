import { cl, clearEvent, div, E, g, M, One, S, wrap } from "galho";
import { Alias, extend, L, orray } from "orray";
import { l, valid } from "./array.js";
import { Dic } from "./dic.js";
import { dropdown } from "./dropdown.js";
import { $, body, C, doc, icon } from "./galhui.js";
import { crudHandler, FieldPlatform, ICrud, kbHandler, kbHTp, OutputCtx, RecordStyle } from "./list.js";
import { menucb } from "./menu.js";
import { bool, call, delay, int, isF, str, t } from "./util.js";

export interface Sort {
  multiple?: bool;
  clear?: bool;
  call(column: Column, active: bool): any;
}
function defineSize(items: { size?: int }[], apply?: boolean) {
  let
    size = 0,
    l = items.length,
    sizes = [];
  for (let i of items) {
    let s = i.size;
    if ((s || (s = 0)) > 95)
      s = 95;
    else if (s === 0)
      s = 100 / l;
    sizes.push(s);
    size += s;
  }
  let result = sizes.map(s => s * 100 / size);
  if (apply)
    for (let i = 0; i < l; i++)
      items[i].size = result[i];
  return result;
}
export const editing = Symbol();

export interface OptionObj<T> {
  head?: any;
  item(item: T, index: number): One;
}
export type Option<T> = OptionObj<T> | ((item: T, index: number) => One);
export type DataType = 's' | 'd' | 'b' | 'n';
export type TAlign = "center" | "justify" | "left" | "right" | "start" | "end";
export interface Column {
  key: str;
  size?: int;
  align?: TAlign;
  text?: any,
  dt?: DataType;
  desc?: bool;
  /**options */
  opts?: any;
  compare?(a: any, b: any): number;
  fmt?: /*string | */((ctx: OutputCtx, options) => any);
}
export interface ITable<T extends Dic> extends ICrud<T> {
  // data?: L<T>;
  columns?: L<Column>
  allColumns?: Column[];
  reqColumns?: str[];
  enum?: boolean;
  options?: Option<T>[];

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
export type Foot = (cols: L<Column>) => One;
export default class Table<T extends Dic> extends E<ITable<T>, { resizeCol: never }>{
  // get data() { return this.i.data as L<T>; }
  // get footData() { return this.i.foot as L<T>; }
  get columns() { return this.i.columns; }

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
    let delayIndex: int;
    i.columns = orray<Column>(i.columns, { g: i.sort && ["sort"] })
      .onupdate(() => delayIndex = delay(delayIndex, () => {
        this.data.reloadAll();
        i.foot && i.foot.reloadAll();
      }));

    if (!i.head) i.head = (c) => c.text;
  }

  view() {
    let
      i = this.i,
      cols = i.columns,
      all = i.allColumns,
      req = i.reqColumns,
      opts = i.options && valid(i.options).map(o => isF(o) ? { item: o } : o),
      data = this.data,
      headerOptions = all && dropdown(null, all.map(c => {
        return menucb(cols.includes(c), c.text, checked => {
          if (checked) {
            cols.push(c);
            cols.sort((a, b) => all.indexOf(a) - all.indexOf(b));
          } else cols.remove(c);
        }, c.key, req && (req.includes(c.key)))
      })),
      bd = data.bind(crudHandler(div("bd"), data, "tb-i", i), {
        insert(v, _i) {
          let t2 = div("_ ft tb-i", [
            div(C.side, t(i.enum) ? _i + 1 : ' '),
            cols.map(c => wrap(c.fmt ? c.fmt({ v: v[c.key], p: i.p }, c.opts) : v[c.key]).css({ textAlign: c.align, width: c.size + 'px' })),
            opts && opts.map(opt => wrap(opt.item(v, _i), "opt"))
          ]).d(v);
          i.style?.(t2, v, _i);
          return t2;
        },
        tag(s, active) {
          s.cls(C.current, active).e.scrollIntoView({
            block: "nearest",
            inline: "nearest"
          });
        },
        groups: { on: (s, active) => s.cls("on", active) }
      }),
      ft = i.foot && new M(...i.foot?.map(value => g(value(cols), "_ ft tb-i")));

    return call(div(cl("_", "tb", i.fill && "fill")), s => {
      s
        .prop('tabIndex', 0)
        .add([
          cols.bind(div("hd tb-i", [
            wrap(i.corner).cls([C.side, C.item]),
            opts && opts.map((opt) => div(null, (opt as OptionObj<T>).head))
          ]), {
            insert: (c, _i, p) => {
              let s = wrap(i.head(c), C.item).css({ textAlign: c.align, width: c.size + 'px' });
              if (i.resize)
                div([C.separator]).addTo(s).on('mousedown', e => {
                  clearEvent(e);
                  let
                    index = cols.indexOf(c) + 1,
                    //t = '.' + C.item + ':nth-child(' + (index + 2) + ')',
                    rows = bd.childs().child(index);

                  ft && rows.push(...ft.child(index));

                  rows.push(s.e);
                  body.css({ cursor: 'col-resize', userSelect: "none" });
                  function move(e: MouseEvent) {
                    c.size = (c.size = Math.max($.rem * 3, e.clientX - s.rect().left));
                    rows.css({ width: c.size + 'px' });
                  }
                  doc
                    .on('mousemove', move)
                    .on('mouseup', () => {
                      doc.off('mousemove', move);
                      body.uncss(["cursor", "userSelect"]);
                    }, { once: true });
                });

              i.sort && s.on("click", e => {
                let sort = cols.g["sort"];
                if (e.altKey)
                  sort.remove(c);
                else {
                  // if (!md.sort.multiple && !e.ctrlKey)
                  //   g_clear(sort);
                  if (sort.includes(c))
                    if (c.desc) {
                      sort.remove(c);
                      delete c.desc;
                    } else {
                      c.desc = true;
                      sort.reload(c);
                    }
                  else sort.push(c);
                }
              })
              headerOptions && s.on({
                mouseenter() {
                  s.add(headerOptions);
                },
                mouseleave() {
                  headerOptions.remove();
                }
              })
              p.place(_i + 1, s);
            },
            tag(s, active, tag) { s.cls(tag, active); },
            groups: {
              sort(s, active, v, _, _i, p) {
                s = p.child(_i + 1);
                s.child(".sort").try(e => e.remove());
                if (active)
                  s.add(icon("sort-" + (v.desc ? 'desc' : 'asc')).cls("sort"));
                i.sort.call(v, active);
              }
            },
            remove(_, _i, p) { p.unplace(_i + 1); },
            clear(p: S) { p.childs(1).remove(); }
          }), bd, ft
        ])
        .on({
          keydown(e: KeyboardEvent) {
            if (!kbHandler(data, e, i))
              switch (e.key) {
                case "ArrowUp":
                  kbHTp(data, -1, e);
                  break;
                case "ArrowDown":
                  kbHTp(data, 1, e);
                  break;
                default:
                  return;
              }
            clearEvent(e);
          },
          scroll(e) {
            let l = this.scrollLeft;
            bd.prop("scrollLeft", l).css("left", l + "px");
          }
        });
      i.resize && s.cls(C.bordered);
    });
  }
  /**rendered data */
  rData() {
    return _rData(g(this).child('.bd'), this.columns);
  }
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