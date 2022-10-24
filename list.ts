import { cl, clearEvent, div, E, g, m, One, S, wrap } from "galho";
import orray, { Alias, extend, L, range } from "galho/orray.js";
import { bool, call, def, Dic, fmt, int, isF, isN, isS, l, str, t } from "galho/util.js";
import { $, body, C, Child, close, doc, icon, Icon, logo, menucb, MenuItems, Size, w } from "./galhui.js";
import { ctx, idropdown } from "./hover.js";
import { up } from "./util.js";

export type CrudMenu<T> = (...items: T[]) => void | MenuItems;
export interface ICrud<T> {
  /**field used as primary key */
  key?: keyof T;
  /**
   * called when user select this element by mouse or arrow key
   */
  focus?(item: T, state: bool): any;
  open?(...items: T[]): any;
  menu?: CrudMenu<T>;
  remove?(items: T[]): any | true;
  single?: boolean;
}
export interface FieldPlatform {
  null: () => any;
  invalidIcon: () => any;
  /**format for number */
  numberFmt?: str;
  /**format for checkbox */
  checkboxFmt?: str;
  dateFmt?: str;
  timeFmt?: str;
  html: boolean;
  interactive: boolean;
  format: boolean;
}
// export class OutputCtx {
//   /**key of current field */
//   /**record/item */
//   constructor(public k: string, public r: Dic, public p: FieldPlatform) { }

//   get val() { return this.r[this.k]; }
//   get null() { return this.p.null(); }
//   get valid() { return isV(this.val); }
//   // get html() { return this.p.html; }
//   // get format() { return this.p.format; }
//   // get interactive() { return this.p.interactive; }
// }

export interface OutputCtx<T = any> {
  /**value */
  v: T;
  /**platform */
  p?: FieldPlatform;
  /**src */
  s?: Dic;
}

export const defRenderer: FieldPlatform = {
  null: () => div(0, icon($.i.null)),
  invalidIcon: () => icon('image-broken'),
  checkboxFmt: "icon",
  html: true,
  interactive: true,
  format: true
}

export function crudHandler<T>(e: S, dt: L<T>, i: ICrud<T>) {
  let click = (ev: MouseEvent) => range.add(dt, "on", e.d(), range.tp(ev.ctrlKey, ev.shiftKey));
  return e.on({
    click,
    dblclick: i.open && (() => i.open(...range.list(dt, "on"))),
    contextmenu: i.menu && (e => {
      click(e);
      let t = i.menu(...range.list(dt, "on"));
      t && ctx(e, t)
    })
  })
}
export const kbHTp = <T>(dt: L<T>, dist: int, { ctrlKey: ctrl, shiftKey: shift }: KeyboardEvent) =>
  shift ? range.move(dt, "on", dist, range.tp(ctrl, false)) :
    ctrl ? range.movePivot(dt, "on", dist) :
      range.move(dt, "on", dist, range.Tp.set);

export function kbHandler<T>(dt: L<T>, e: KeyboardEvent, i: ICrud<T>, noArrows?: bool) {
  switch (e.key) {
    case "Delete":
      let t0 = range.list(dt, "on");
      if (t0.length && i.remove) {
        (async () => {
          if ((await i.remove(t0)) !== false)
            for (let i of t0)
              dt.remove(i);
        })();
      } else return;

      break;
    case "Home":
      kbHTp(dt, -range.pivot(dt, "on"), e);
      break;
    case "End":
      kbHTp(dt, dt.length - range.pivot(dt, "on"), e);
      break;
    case "PageDown":
      kbHTp(dt, 10, e);
      break;
    case "PageUp":
      kbHTp(dt, -10, e);
      break;
    case "Enter":
      if (i.open) {
        i.open(...range.list(dt, "on"));
        break;
      } else return;

    case "ArrowUp":
      if (noArrows) return;
      kbHTp(dt, -1, e);
      break;
    case "ArrowDown":
      if (noArrows) return;
      kbHTp(dt, 1, e);
      break;
    default:
      return;
  }
  return true;
}

export interface IList<T> extends ICrud<T> {
  data?: L<T>;
  item(value: T): any;
  single?: boolean;
  enum?: boolean;
  /**keydown 
   * @default true */
  kd?: bool;
}
export function list<T>(i: IList<T>, data: L<T> | T[]) {
  let
    dt = extend(data, {
      g: i.single ? null : ["on"],
      clear: true, key: i.key
    }),
    e = t(i.enum),
    r = dt.bind(g("ol", "_ list"), {
      insert: v => crudHandler(wrap(i.item(v), "i").d(v), dt, i),
      tag(s, active, tag) {
        tag == "on" && s.c(C.current, active).e.scrollIntoView({
          block: "nearest",
          inline: "nearest"
        });
        s.c(tag, active);
      },
      groups(s, on, _, key) { s.c(key, on) }
    });
  return t(i.kd) ? r.p("tabIndex", 0).on("keydown", e => kbHandler(data as L<T>, e, i) && clearEvent(e)) : r;
}

export type RecordStyle = ((row: S, value: Dic, index: int) => void);



export interface TabItem {
  icon?: Icon;
  // tp?: string;
  text?: Child;
  focus?: (body: S, enter: boolean) => any,
  body: ((v: TabItem) => Child) | Child;
}
export const tab = (items: L<TabItem>, removeble: boolean, empty?: () => One) => div([C.tab], [
  items.bind(div([C.menubar]), {
    tag: (v, a) => v.c("on", a),
    insert: value => div("i", [
      icon(value.icon),
      value.text,
      removeble && close(e => { clearEvent(e); items.remove(value); })
    ]).on('click', () => items.tag("on", value))
  }),
  call(div("bd"), bd => {
    let cb = (v: TabItem) => {
      bd.attr("id", false);
      if (v) {
        bd.set(isF(v.body) ? (v.body = v.body(v)) : v.body);
        v.focus?.(bd, true);
      } else bd.set(empty?.());

    };
    items.ontag("on", cb);
    cb(items.tags?.on.v);
  }),
]);

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
      hdOpts = all && idropdown(null, all.map(c => {
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
        .p('tabIndex', 0)
        .on("keydown", (e) => kbHandler(data, e, i) && clearEvent(e));

    data.bind(d, {
      insert: (s, j, p) => {
        let t2 = div("_ tr i", [
          div(C.side),
          cols.map(c => {
            let v = s[c.key];
            return this.ccss(wrap(c.fmt ? isS(c.fmt) ? fmt(v, c.fmt) : c.fmt({ v, p: i.p, s }) : v).css({ textAlign: c.align }), c);
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

function prev(start: S, parent: S) {
  let e: Element = start.e;
  do {
    let p = e.previousElementSibling;
    while (p && p.lastElementChild)
      p = p.lastElementChild;

    if (p)
      e = p;
    else if (parent.e == (e = e.parentElement))
      e = null;
  } while (e && !e.matches("." + C.head));

  return e && new S(e);
}
function next(start: S, parent: S) {
  let e: Element = start.e;
  do {
    let n = e.firstElementChild || e.nextElementSibling
    if (n)
      e = n;
    else {
      while (!(parent.e == (e = e.parentElement)) && !e.nextElementSibling) { }
      e = parent.e == e ? null : e.nextElementSibling;
    }
  } while (e && !e.matches("." + C.head));

  return e && new S(e);
}
export interface ITree extends ICrud<Branch> {
  toggle?(i: Branch, state: bool): any;

  data?: Alias<Branch, IBranch>;
  /**selected element */
  s?: Branch;
}

export function tree(i: ITree) {

  let
    d = div("_ tree"),
    click = ({ currentTarget: c, target: t }: MouseEvent) => {
      if (c == t)
        select(i);
      else select(g(<Element>t).closest(".i").d());
    };
  return orray(i.data, v => v instanceof Branch ? v : new Branch(i, v, 0)).bind(d.p("tabIndex", 0)).on({
    keydown: (e) => {
      let f = i.s;

      switch (e.key) {
        case "ArrowUp":
          let p = prev(f.head, d);
          if (p) {
            select(i, p.d<Branch>());
            break;
          } else return;
        case "ArrowDown":
          let n = next(f.head, d);
          if (n) {
            select(i, n.d<Branch>());
            break;
          } else return;
        case "ArrowLeft":
          if (f.i.open) {
            f.set("open", false);
            break;
          } else {
            let p = prev(f.head, d);
            if (p) {
              select(i, p.d<Branch>());
              break;
            } else return;
          }
        case "ArrowRight":
          if (f.i.dt && !f.i.open) {
            f.set("open", true);
            break;
          } else {
            let n = next(f.head, d);
            if (n) {
              select(i, n.d<Branch>());
              break;
            } else return;
          }
        default:
          return;
      }
      clearEvent(e);
    },
    click,
    dblclick: i.open && (() => i.open(i.s)),
    contextmenu: i.menu && ((e) => {
      click(e);
      let t = i.menu(i.s);
      if (t) {
        ctx(e, t);
        e.preventDefault();
      }
    })
  });
}
export function query({ data }: ITree, text: string) {
  text = text.toLowerCase();
  for (let item of data)
    (<Branch>item).filter((e) => (e.key + '').toLowerCase().indexOf(text) != -1);
}
export function select(i: ITree, e?: Branch) {
  let f = i.focus, o = i.s, n = i.s = e;
  if (o) {
    o.head.c(C.on, false);
    f?.(o, false);
  }
  if (n) {
    n.head.c(C.on);
    f?.(n, true);
  }
}
// export class Tree extends E<ITree> {
//   data: L<Branch, IBranch>;
//   constructor(i: ITree, data?: L<Branch, IBranch>) {
//     super(i);
//     this.data = orray(data, { parse: v => v instanceof Branch ? v : new Branch(this, v, 0) });
//   }


//   private _ficused: Branch
// }
export interface IBranch {
  side?: Child;
  key?: str;
  icon?: Icon;
  tp?: str;
  dt?: Alias<Branch, IBranch>;
  open?: bool;
}
export class Branch extends E<IBranch> {
  uuid?: number;
  // dt: L<Branch, IBranch>;
  constructor(public ctx: ITree, i: IBranch, public level: number) {
    super(i);
    i.dt && (i.dt = orray<Branch, IBranch>(i.dt, v => v instanceof Branch ? v : new Branch(ctx, v, level + 1)));
  }
  get key() { return this.i.key; }

  get(path: string) {
    var t1 = path.split('/', 2);
    let result = (this.i.dt as L<Branch>).find(t1[0]);
    if (t1.length > 1) {
      if (result.i.dt)
        result = result.get(t1[1]);
      else throw "";
    }
    return result;
  }
  head: S;
  view() {
    let
      i = this.i,
      h = this.head = div(C.head, div(C.body, [i.key, i.side && wrap(i.side, C.side)]))
        .css("paddingLeft", $.rem * this.level + "px").d(this);
    if (i.dt) {
      let body = (i.dt as L<Branch>).bind(div()), ico = icon('menuR');

      return this.bind(div(C.item, [
        h.prepend(div(0, ico).on('click', e => { this.toggle("open"); clearEvent(e) })),
        i.open && body
      ]).d(this), (t) => {
        if (i.open) {
          t.add(body);
          ico.replace(ico = icon('menuD'));
        } else {
          body.remove();
          ico.replace(ico = icon('menuR'));
        }
        this.ctx.toggle?.(this, i.open);
      }, 'open');
    } else return h.c(C.item).d(this).prepend(icon(i.icon));
  }
  filter(filter: (item: IBranch) => boolean, /*sub: boolean = true,*/  ok = false) {
    //obs: ok � para que se o parent passar no filtro todos os filhos devem passar tambem
    //obs: any � para se algum dos filhos dele passar ele tambem passa
    ok || (ok = filter(this.i));
    let any: boolean, dt = <Branch[]>this.i.dt;
    if (dt)
      for (let item of dt) {
        any = item.filter(filter, ok) || any;
      }
    // this.div.c(C.off, !any);
    return ok;
  }
}
// .on({
//   contextmenu: tp.ctx && ((e) => ctx(e, tp.ctx(i))),
//   dblclick: tp.open && (() => tp.open(i)),
//   click: () => this.ctx.focus(this),
// })


interface Node {
  key?: str;
  txt?: str;
  icon?: Icon;
}
export interface iGrid<T> extends ICrud<T> {
  sz: Size;
  info?: {
    fields: str[];
    max: int;
    showKey?: bool;
  };
  dt: L<T>;
  defIcon: Icon;

}
export class Grid<T extends Node> extends E<iGrid<T>>{
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
      d = div().attr("resize", true);
    setTimeout(() => this.resize());
    return dt.bind(this.bind(d, () => d.c(cl("_", i.sz, "grid")), "sz"), {
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
      groups: (e, v, _, k) => e.c(k, v),
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