import type { CSSSep, Property } from "galho";
import { css, type Style, type Styles } from "galho";
import { assign, type bool, def, type float, isA, isB, isN, isO, type str, toStr } from "galho/util.js";
import { HAlign } from "./galhui.js";
import { filterDic } from "./util.js";

/**
 * Returns an RGBA CSS color string.
 * @param r Red component (0-255 or float)
 * @param g Green component (0-255 or float)
 * @param b Blue component (0-255 or float)
 * @param a Alpha component (0-1)
 */
export const rgba = (r: float, g: float, b: float, a: float) => `rgba(${r},${g},${b},${a})`;

/**
 * Returns an RGB CSS color string.
 * @param r Red component (0-255 or float)
 * @param g Green component (0-255 or float)
 * @param b Blue component (0-255 or float)
 */
export const rgb = (r: float, g: float, b: float) => `rgb(${r},${g},${b})`;

/**
 * Normalizes a font-weight value or returns "bold" when true.
 * @param v The boolean or fontWeight value.
 */
export function bold(v: bool | Property.FontWeight) {
  return v ? isB(v) ? "bold" : v : null;
}

/**
 * Normalizes a font-style value or returns "italic" when true.
 * @param v The boolean or fontStyle value.
 */
export function italic(v: bool | Property.FontStyle) {
  return v ? isB(v) ? "italic" : v : null;
}

/**
 * Creates style rules for a font configuration.
 * Can be a number (rem size) or a Font object.
 */
export const font = (v: Font) => v && (isN(v) ?
  { fontSize: v + "rem" } :
  v.f ?
    { font: `${toStr(italic(v.i))} ${toStr(bold(v.b))} ${v.s}rem ${v.f}` } :
    { fontSize: v.s && (v.s + "rem"), fontWeight: bold(v.b), fontStyle: italic(v.i) }
),
/**
 * Normalizes a Border object to a CSS border string.
 */
bord = (b: Border) => b && `${b.w || 1}px ${b.s || "solid"} ${b.c}`,
/**
 * Normalizes a Borders specification to style rules.
 */
bords = (b: Borders): Style => b &&
  (isA(b) ? {
    borderTop: bord(b[0]),
    borderRight: bord(b[1]),
    borderBottom: bord(def(b[2], b[0])),
    borderLeft: bord(def(b[3], b[1]))
  } : { border: bord(b) }),
/**
 * Creates style rules for a TBlock block configuration (padding, margin, colors, borders, fonts).
 */
block = (v: TBlock): Style => v && filterDic({
  color: v.fg,
  padding: spc(v.pad),
  margin: spc(v.mrg),
  borderRadius: spc(v.rad),
  ...bords(v.brd),
  background: v.bg,
  ...font(v.f)
});

/**
 * Creates a CSS border string.
 * @param color The border color.
 * @param size The border size in pixels. Defaults to 1.
 */
export const border = (color: str, size = 1) => `${size}px solid ${color}`;

/**
 * Formats a space parameter (like margin or padding) into a CSS space string.
 * @param v The space configuration.
 * @param unit The unit to use. Defaults to "em".
 */
export const spc = (v: SpaceFull, unit = "em") => v == null ? null : (isN(v) ? v + unit : v.map(v => v + unit).join(" "));

/**
 * Creates a style object for background and foreground colors.
 * @param bg The CSS background property.
 * @param fg The CSS color property.
 */
export const bfg = (bg: Property.Background, fg: Property.Color): Style => ({
  background: bg, color: fg
});

/**
 * Creates a style object with margin and padding.
 * @param mrg Margin value(s).
 * @param pad Padding value(s).
 */
export const box = (mrg: SpaceFull, pad: SpaceFull): Style => ({
  margin: spc(mrg), padding: spc(pad)
});

/** Chainable function used to add styles; carries accumulated CSS in `css`. */
export type StyleFnAdd<T> = ((style?: StyleFn<T> | Styles) => StyleFnAdd<T>) & { css?: str };

/** A style function that receives a style context and returns styles. */
export type StyleFn<T> = (ctx: StyleCtx<T>) => Styles;

/** Context passed to a `StyleFn`, extended with `StyleFnAdd` helpers. */
export type StyleCtx<T> = T & StyleFnAdd<T>;

/**
 * Creates a style context object that aggregates styles.
 * @param options Base options for the context.
 * @param sep The CSS separator to use.
 */
export function styleCtx<T = any>(options: T, sep?: CSSSep) {
  let
    list: StyleFn<T>[] = [],
    add: StyleFnAdd<T> = (style) => {
      if (isO(style))
        add.css += css(<any>style, sep);
      else if (!list.includes(style)) {
        list.push(style);
        add.css += css((<any>style)(add), sep);
      }
      return add;
    };
  add.css = "";
  return assign(add, options);
}

type Space = float | [x: float, y: float];
type SpaceFull = Space | [t: float, h: float, b: float] | [t: float, l: float, b: float, r: float];
interface Border {
  /** Width in pixels */
  w?: float;
  /** Border style */
  s?: Property.BorderStyle;
  /** Border color */
  c?: Property.Color;
}
type Borders = Border | [Border, Border] | [Border, Border, Border] | [Border, Border, Border, Border];
interface TBlock {
  /** Foreground color */
  fg?: Property.Color;
  /** Margin in rem */
  mrg?: SpaceFull;
  /** Padding in rem */
  pad?: SpaceFull;
  /** Border radius in rem */
  rad?: float;
  /** Border specification */
  brd?: Borders;
  /** Background */
  bg?: Property.Background;
  /** Font options */
  f?: Font;
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
};
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
});
/**horizontal space */
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