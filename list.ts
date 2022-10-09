import { clearEvent, div, g, One, S, wrap } from "galho";
import { bool, call, int, isF, str, t, Dic } from "galho/util.js";
import { extend, L, range } from "galho/orray.js";
import { $, C, Child, close, icon, Icon } from "./galhui.js";
import { ctx } from "./hover.js";
import { MenuItems } from "./menu.js";

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
  return t(i.kd) ? r.props({
    tabIndex: 0, onkeydown(e) { kbHandler(data as L<T>, e, i) && clearEvent(e) }
  }) : r;
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
])