import { clearEvent, div, E, g, One, S, wrap } from "galho";
import { each as m_each } from "galho/m";
import { rect } from "galho/s";
import { call, delay, t, valid } from "inutil";
import { Alias, bind, create as orray, extend, L, reloadAll, remove, sort } from "orray";
import { $, body, C, doc, dropdown, hc, icon } from "./galhui";
import { crudHandler, FieldPlatform, ICrud, kbHandler, kbHTp, OutputCtx, RecordStyle } from "./list";
import { cb } from "./menu";
import { wait } from "./wait";

export interface Sort {
  multiple?: bool;
  clear?: bool;
  call(column: TableColumn, active: bool): any;
}
function defineSize(items: { size?: num }[], apply?: boolean) {
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

export type TableOption<T> = TableOptionObj<T> | ((item: T, index: number) => One);
export type ValueType = 's' | 'd' | 'b' | 'n';
export type TAlign = "center" | "justify" | "left" | "right" | "start" | "end";
export interface TableColumn {
  key: str;
  size?: int;
  align?: TAlign;
  text?: any,
  tp?: ValueType;
  desc?: bool;
  /**options */
  opts?: any;
  compare?(a: any, b: any): number;
  fmt?: /*string | */((ctx: OutputCtx, options) => any);
}
export interface TableOptionObj<T> {
  head?: any,
  item(item: T, index: number): One,
  foot?(item: T, index: number): One
}
export interface ITable<T extends Dic> extends ICrud<T> {
  // data?: L<T>;
  columns?: L<TableColumn>
  allColumns?: TableColumn[];
  enumarate?: boolean;
  options?: TableOption<T>[];

  resize?: boolean;
  head?(column: TableColumn);

  foot?: boolean;
  footData?: L<T>;
  empty?: () => void;

  key?: string;
  style?: RecordStyle;
  sort?: Sort;
  corner?: any;
  p?: FieldPlatform
}
export default class Table<T extends Dic> extends E<ITable<T>, { resizeCol: never }>{
  // get data() { return this.i.data as L<T>; }
  get footData() { return this.i.footData as L<T>; }
  get columns() { return this.i.columns; }

  data: L<T>;
  constructor(i: ITable<T>, data?: Alias<T>) {
    // i.data = data as L;
    super(i);
    this.data = extend(data, {
      g: i.single ? null : ["on"],
      key: i.key,
      clear: true
    });
    if (i.foot)
      i.footData = extend<T>(i.footData, {
        key: i.key,
        clear: true
      });
    let delayIndex: int;
    i.columns = orray<TableColumn>(i.columns, { g: i.sort && ["sort"] }).onupdate(() => {
      delayIndex = delay(delayIndex, () => {
        reloadAll(this.data);
        i.foot && reloadAll(i.footData);
      })
    });

    if (!i.head) i.head = (c) => c.text;
  }
  head: S;
  body: S;
  foot: S;

  view() {
    let
      i = this.i,
      cols = i.columns,
      all = i.allColumns,
      opts = i.options && valid(i.options),
      data = this.data as L<T>,
      insert = (value: T, j: number, e?: boolean, foot?: boolean) => {
        let r: S, side = div(C.item, e ? j + 1 : ' ').cls(C.side);
        (async () => {
          for (var t = Array<any>(), k = 0; k < cols.length; k++) {
            let c = cols[k], v = value[c.key];
            if (c.fmt)
              v = await c.fmt({ v, p: i.p }, c.opts);
            t[k] = wrap(v, "i").css({ textAlign: c.align, width: c.size + 'px' });
          }
          let t2 = div(hc(C.table, C.item), [
            side, t,
            opts && opts.map((opt) => (!foot || (opt as TableOptionObj<T>).foot) && wrap((foot ? (opt as TableOptionObj<T>).foot : (opt as TableOptionObj<T>).item)(value, j), 'td').on('dblclick', (e) => { e.stopPropagation(); }))
          ]).d(value);
          i.style && i.style(t2, value, j);
          r ? r.replace(t2) : r = t2;
        })();
        return r ||= wait().add(side);
      },
      headerOptions = all && dropdown(null, all.map(c =>
        cb(cols.includes(c), c.text, (v) => {
          if (v) {
            cols.push(c);
            sort(cols, (a, b) => all.indexOf(a) - all.indexOf(b));
          } else remove(cols, c);

        }))).on("click", e => e.stopPropagation()),
      bd = bind(data, crudHandler(div("bd"), data, "tb-i", i), {
        insert: (value, index) => insert(value, index, t(i.enumarate)),
        tag(s, active) {
          s.cls(C.current, active).e.scrollIntoView({
            block: "nearest",
            inline: "nearest"
          });
        },
        groups: { on: (s, active) => s.cls("on", active) }
      });

    return call(div(hc(C.table)), s => {
      s
        .prop('tabIndex', 0)
        .add([
          bind(cols, this.head = div([C.head], [
            wrap(i.corner).cls([C.side, C.item]),
            opts && opts.map((opt) => div(null, (opt as TableOptionObj<T>).head))
          ]), {
            insert: (c, _i, p) => {
              let s = wrap(i.head(c), C.item).css({ textAlign: c.align, width: c.size + 'px' });
              if (i.resize)
                div([C.separator]).addTo(s).on('mousedown', e => {
                  clearEvent(e);
                  let
                    index = cols.indexOf(c) + 1,
                    //t = '.' + C.item + ':nth-child(' + (index + 2) + ')',
                    rows = this.body.childs().child(index);

                  this.foot && rows.push(...this.foot.childs().child(index));

                  rows.push(s.e);
                  body.css({ cursor: 'col-resize', userSelect: "none" });
                  function move(e) {
                    c.size = (c.size = Math.max($.rem * 3, e.clientX - rect(s).left));
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
          }),
          this.body = bd,
          this.foot = i.foot && bind(i.footData, g('tfoot'), {
            insert(value, index) {
              return insert(value, index, false, true);
            }
          })
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
            bd.prop("scrollLeft", l).css("left", l+"px");
          }
        });
      i.resize && s.cls(C.bordered);
    });
  }

  private _rData(p: S) {
    let
      cols = this.i.columns,
      r = Array<Dic<string>>(cols.length);

    m_each(p.childs(), (s, i) => {
      let t = r[i] = {}, cells = s.childs();
      for (let j = 0; j < cols.length; j++)
        t[cols[j].key] = g(cells[j + 1]).text();
    });
    return r;
  }
  renderedData() {
    return this._rData(this.body);
  }
  renderedFoot() {
    return this._rData(this.foot);
  }
}
