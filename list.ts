import { clearEvent, div, g, One, S, wrap } from "galho";
import { call, isF, t } from "inutil";
import { bind, extend, getTag, L, ontag, remove, setTag } from "orray";
import { add as addSelection, clear as clearSelection, list as selected, move as moveSelection, movePivot as moveSelectionPivot, pivot, SelectionTp, tp as selectionType } from "orray/selector";
import { $, C, Child, close, icon, Icon } from "./galhui";
import { ctx } from "./hover";
import { MenuItems } from "./menu";


export interface ICrud<T> {
  /**field used as primary key */
  key?: keyof T;
  /**
   * called when user select this element by mouse or arrow key
   */
  focus?(item: T, state: bool): any;
  open?(...items: T[]): any;
  menu?(...items: T[]): void | MenuItems;
  remove?(...items: T[]): any | true;
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
}

export const defRenderer: FieldPlatform = {
  null: () => div(0, $.null),
  invalidIcon: () => icon('image-broken'),
  checkboxFmt: "icon",
  html: true,
  interactive: true,
  format: true,
  dateFmt: "d",
  timeFmt: "t",
  numberFmt: "0,0.00"
}



export function crudHandler<T>(p: S, dt: L<T>, cls: str, i: ICrud<T>) {
  let
    focus = ({ currentTarget: ct, target: t, ctrlKey: ctrl, shiftKey: shift }: MouseEvent) => {
      if (ct == t)
        clearSelection(dt, "on");
      else addSelection(dt, "on", g(<Element>t).closest('.' + cls).d(), selectionType(ctrl, shift));
    };
  return p.on({
    click: focus,
    dblclick: i.open && (() => i.open(...selected(dt, "on"))),
    contextmenu: i.menu && ((e) => {
      focus(e);
      let t = i.menu(...selected(dt, "on"));
      if (t) ctx(e, t)
    })
  })
}
export const kbHTp = <T>(dt: L<T>, dist: int, { ctrlKey: ctrl, shiftKey: shift }: KeyboardEvent) =>
  shift ? moveSelection(dt, "on", dist, selectionType(ctrl, false)) :
    ctrl ? moveSelectionPivot(dt, "on", dist) :
      moveSelection(dt, "on", dist, SelectionTp.set);

export function kbHandler<T>(dt: L<T>, e: KeyboardEvent, i: ICrud<T>) {
  switch (e.key) {
    case "Delete":
      let t = selected(dt, "on");
      if (t.length && i.remove) {
        (async () => {
          if ((await i.remove(...t)) !== false)
            for (let i of t)
              remove(dt, i);
        })();
      } else return;

      break;
    case "Home":
      kbHTp(dt, -pivot(dt, "on"), e);
      break;
    case "End":
      kbHTp(dt, dt.length - pivot(dt, "on"), e);
      break;
    case "PageDown":
      kbHTp(dt, 10, e);
      break;
    case "PageUp":
      kbHTp(dt, -10, e);
      break;
    case "Enter":
      if (i.open) {
        i.open(...selected(dt, "on"));
        break;
      } else return;

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
}
export function list<T>(i: IList<T>, data: L<T> | T[]) {
  let
    dt = extend(data, {
      g: i.single ? null : ["on"],
      clear: true, key: i.key
    }),
    // opts = i.options,
    e = t(i.enum);
  return bind(dt, crudHandler(g("ol", "_ list"), dt, "i", i), {
    insert: (value, index) => div("i", [
      div([C.side], e ? index + 1 : ' ')
         .css('flexBasis', `${$.rem * 2.5}px`),
      wrap(i.item(value), "bd")
    ]).d(value),
    tag(s, active) {
      s.cls(C.current, active).e.scrollIntoView({
        block: "nearest",
        inline: "nearest"
      });
      if (i.single) s.cls("on", active);
    },
    groups(s, on, _, key) { s.cls(key, on) }
  });
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
  bind(items, div([C.menubar]), {
    tag: (v, a) => v.cls("on", a),
    insert: value => div("i", [
      icon(value.icon),
      value.text,
      removeble && close(e => { clearEvent(e); remove(items, value); })
    ]).on('click', () => setTag(items, "on", value))
  }),
  call(div("bd"), bd => {
    let cb = (v: TabItem) => {
      bd.attr("id", false).uncls();
      if (v) {
        bd.set(isF(v.body) ? (v.body = v.body(v)) : v.body);
        v.focus?.(bd, true);
      } else bd.set(empty?.());

    };
    ontag(items, "on", cb);
    cb(getTag(items, "on")?.value);
  }),
])