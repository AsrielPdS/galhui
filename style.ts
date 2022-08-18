import { Property } from "csstype";
import { def, ex, isB, isN, isO, toStr } from "./util.js";
import { cc, HAlign } from "./galhui.js";
import { filter } from "./dic.js";
import { css, Properties, Style, Styles } from "galho/css.js";
import { bool, float, str } from "./util.js";
import { isA } from "./array.js";

export const enum ScreenSize {
  mobileS = 320,
  mobileM = 375,
  mobileL = 425,
  tablet = 768,
  laptop = 1024,
  laptopL = 1440
}
export const enum zIndex {
  back = -1,
  normal = 0,
  front = 1,
  modalArea = 2,
  modal = 3,
  ctxMenu = 4,
}
export const min = (size: ScreenSize) => `@media (min-width: ${size}px)`;
export const max = (size: ScreenSize) => `@media (max-width: ${size}px)`;
export const bold = (v: bool | Property.FontWeight): any =>
  v ? isB(v) ? "bold" : v : null;
export const italic = (v: bool | Property.FontStyle): any =>
  v ? isB(v) ? "italic" : v : null;

export function isDark() {
  return matchMedia && matchMedia('(prefers-color-scheme: dark)').matches
}
export function font(v: Font): Properties {
  return v && (isN(v) ?
    { fontSize: v + "rem" } :
    v.f ?
      { font: `${toStr(italic(v.i))} ${toStr(bold(v.b))} ${v.s}rem ${v.f}` } :
      { fontSize: v.s && (v.s + "rem"), fontWeight: bold(v.b), fontStyle: italic(v.i) }
  )
}
export function center(): Style {
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)"
  }
}
export const block = (v: TBlock): Style => v && filter({
  color: v.fg,
  padding: spc(v.pad),
  margin: spc(v.mrg),
  borderRadius: spc(v.rad),
  ...bords(v.brd),
  background: v.bg,
  ...font(v.f)
});
export const state = (v: Stateble): Style => v && filter({
  ...block(v),
  ":hover": v.h && block(v.h),
  ":visited": v.v && block(v.v),
  ":active,:focus": v.on && block(v.on),
});
export const c = (...cls: str[]) => cc(...cls);
export const rem = (v: float) => v + "rem";
export const border = (color: str, size = 1) => `${size}px solid ${color}`;

export function tAlign(v: HAlign): Property.TextAlign {
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
export const bord = (b: Border) => b && `${b.w || 1}px ${b.s || "solid"} ${b.c}`;
export const bords = (b: Borders): Style => b &&
  (isA(b) ? {
    borderTop: bord(b[0]),
    borderRight: bord(b[1]),
    borderBottom: bord(def(b[2], b[0])),
    borderLeft: bord(def(b[3], b[1]))
  } : { border: bord(b) });
export const spc = (v: SpaceFull, unit = "em") => v==null ? (isN(v) ? v + unit : v.map(v => v + unit).join(" ")) : null;
/**horizontal space */
export const hs = (v: SpaceFull) => isN(v) ? v : v[1];
/**vertical space */
export const vs = (v: SpaceFull) => isN(v) ? v : v[0];

export const topRadius = (v: float, unit = "rem"): Style => ({
  borderTopLeftRadius: v + unit,
  borderTopRightRadius: v + unit
});
export const vpad = (v: str | 0): Style => ({
  paddingTop: v,
  paddingBottom: v
});
export const vmarg = (v: str | 0): Style => ({
  marginTop: v,
  marginBottom: v
});
export const bottomRadius = (v: float, unit = "rem"): Style => ({
  borderBottomLeftRadius: v + unit,
  borderBottomRightRadius: v + unit
});
/**back & fore ground */
export const bfg = (bg: Property.Background, fg: Property.Color): Style => ({
  background: bg, color: fg
});
export const box = (mrg: SpaceFull, pad: SpaceFull): Style => ({
  margin: spc(mrg), padding: spc(pad)
});


export type StyleFnAdd<T> = (style?: StyleFn<T> | Styles) => StyleFnAdd<T>;
export type StyleFn<T> = (ctx: StyleCtx<T>) => Styles;
export type StyleCtx<T> = T & StyleFnAdd<T>;
export function styleCtx<T = any>(options: T, tag = css({})) {
  let
    list: StyleFn<T>[] = [],
    add: StyleFnAdd<T> = (style) => {
      if (isO(style))
        css(<any>style, tag);
      else if (!list.includes(style)) {
        list.push(style);
        css((<any>style)(add), tag);
      }
      return add;
    };
  return ex(add, options);
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
interface MenuStyle {
  /**items */
  i: Stateble;
  /**height in px */
  h?: float;
  /** background */
  bg?: Property.Background;
}
interface TableStyle extends TBlock {
  /**rows */
  r: Stateble;
  h: {

    /**height in px */
    h?: float;
    /** background */
    bg?: Property.Background;
  }
}
/**background foreground */
interface BF {
  /**background */
  bg?: Property.Background;
  /** (foreground)text color*/
  fg?: Property.Color;
}
interface Stateble extends TBlock {
  /** active*/
  on?: TBlock;
  /** hover*/
  h?: TBlock;
  /** visited*/
  v?: TBlock;
}