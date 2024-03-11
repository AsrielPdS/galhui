import { Property } from "galho";
import { css, Style, Styles } from "galho";
import { assign, bool, def, float, isA, isB, isN, isO, str, toStr } from "galho/util.js";
import { HAlign } from "./galhui.js";
import { filterDic } from "./util.js";


export const rgba = (r: float, g: float, b: float, a: float) => `rgba(${r},${g},${b},${a})`;
export const rgb = (r: float, g: float, b: float) => `rgb(${r},${g},${b})`;
export function bold(v: bool | Property.FontWeight) {
  return v ? isB(v) ? "bold" : v : null;
}
export function italic(v: bool | Property.FontStyle) {
  return v ? isB(v) ? "italic" : v : null;
}
export const
  font = (v: Font) => v && (isN(v) ?
    { fontSize: v + "rem" } :
    v.f ?
      { font: `${toStr(italic(v.i))} ${toStr(bold(v.b))} ${v.s}rem ${v.f}` } :
      { fontSize: v.s && (v.s + "rem"), fontWeight: bold(v.b), fontStyle: italic(v.i) }
  ),
  bord = (b: Border) => b && `${b.w || 1}px ${b.s || "solid"} ${b.c}`,
  bords = (b: Borders): Style => b &&
    (isA(b) ? {
      borderTop: bord(b[0]),
      borderRight: bord(b[1]),
      borderBottom: bord(def(b[2], b[0])),
      borderLeft: bord(def(b[3], b[1]))
    } : { border: bord(b) }),
  block = (v: TBlock): Style => v && filterDic({
    color: v.fg,
    padding: spc(v.pad),
    margin: spc(v.mrg),
    borderRadius: spc(v.rad),
    ...bords(v.brd),
    background: v.bg,
    ...font(v.f)
  });
// export const c = (...cls: str[]) => cc(...cls);
export const border = (color: str, size = 1) => `${size}px solid ${color}`;

export const spc = (v: SpaceFull, unit = "em") => v == null ? null : (isN(v) ? v + unit : v.map(v => v + unit).join(" "));

/**back & fore ground */
export const bfg = (bg: Property.Background, fg: Property.Color): Style => ({
  background: bg, color: fg
});
export const box = (mrg: SpaceFull, pad: SpaceFull): Style => ({
  margin: spc(mrg), padding: spc(pad)
});


export type StyleFnAdd<T> = ((style?: StyleFn<T> | Styles) => StyleFnAdd<T>) & { css?: str };
export type StyleFn<T> = (ctx: StyleCtx<T>) => Styles;
export type StyleCtx<T> = T & StyleFnAdd<T>;
export function styleCtx<T = any>(options: T, sep?: str) {
  let
    list: StyleFn<T>[] = [],
    add: StyleFnAdd<T> = (style) => {
      if (isO(style))
        add.css += css(<any>style, null, sep);
      else if (!list.includes(style)) {
        list.push(style);
        add.css += css((<any>style)(add), null, sep);
      }
      return add;
    };
  add.css = "";
  return assign(add, options);
}

type Space = float | [x: float, y: float];
type SpaceFull = Space | [t: float, h: float, b: float] | [t: float, l: float, b: float, r: float];
interface Border {
  /**width */
  w?: float;
  /**style */
  s?: Property.BorderStyle;
  /**color */
  c?: Property.Color;
}
type Borders = Border | [Border, Border] | [Border, Border, Border] | [Border, Border, Border, Border];
//  ( ? b.map(bord).join(' ') : );
interface TBlock {
  /**foreground*/
  fg?: Property.Color;
  /** margin  in rem */
  mrg?: SpaceFull;
  /** padding  in rem */
  pad?: SpaceFull;
  /** border radius in rem */
  rad?: float;
  /** border  in px */
  brd?: Borders;
  /** background*/
  bg?: Property.Background;
  /**font */
  f?: Font
}
type Font = float | {
  /**size */
  s?: float;
  /**family */
  f?: str;
  /**bold */
  b?: bool | Property.FontWeight;
  /**italic */
  i?: bool | Property.FontStyle;
}
interface Stateble extends TBlock {
  /** active*/
  on?: TBlock;
  /** hover*/
  h?: TBlock;
  /** visited*/
  v?: TBlock;
}
const isDark = () => matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
const vpad = (v: str | 0): Style => ({
  paddingTop: v,
  paddingBottom: v
});
const vmarg = (v: str | 0): Style => ({
  marginTop: v,
  marginBottom: v
});
const state = (v: Stateble): Style => v && filterDic({
  ...block(v),
  ":hover": v.h && block(v.h),
  ":visited": v.v && block(v.v),
  ":active,:focus": v.on && block(v.on),
});/**horizontal space */
const hs = (v: SpaceFull) => isN(v) ? v : v[1];
/**vertical space */
const vs = (v: SpaceFull) => isN(v) ? v : v[0];

const topRadius = (v: float, unit = "rem"): Style => ({
  borderTopLeftRadius: v + unit,
  borderTopRightRadius: v + unit
});
const bottomRadius = (v: float, unit = "rem"): Style => ({
  borderBottomLeftRadius: v + unit,
  borderBottomRightRadius: v + unit
});
const rem = (v: float) => v + "rem";
function tAlign(v: HAlign): Property.TextAlign {
  switch (v) {
    case HAlign.left:
      return "left";
    case HAlign.center:
      return "center";
    case HAlign.right:
      return "right";
    case HAlign.justify:
      return "justify";
  }
}