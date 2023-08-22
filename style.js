import { css } from "galho";
import { assign, def, isA, isB, isN, isO, toStr } from "galho/util.js";
import { dic } from "../../www/bridge.js";
export function bold(v) {
    return v ? isB(v) ? "bold" : v : null;
}
export function italic(v) {
    return v ? isB(v) ? "italic" : v : null;
}
export const isDark = () => matchMedia && matchMedia('(prefers-color-scheme: dark)').matches, font = (v) => v && (isN(v) ?
    { fontSize: v + "rem" } :
    v.f ?
        { font: `${toStr(italic(v.i))} ${toStr(bold(v.b))} ${v.s}rem ${v.f}` } :
        { fontSize: v.s && (v.s + "rem"), fontWeight: bold(v.b), fontStyle: italic(v.i) }), vpad = (v) => ({
    paddingTop: v,
    paddingBottom: v
}), vmarg = (v) => ({
    marginTop: v,
    marginBottom: v
}), bord = (b) => b && `${b.w || 1}px ${b.s || "solid"} ${b.c}`, bords = (b) => b &&
    (isA(b) ? {
        borderTop: bord(b[0]),
        borderRight: bord(b[1]),
        borderBottom: bord(def(b[2], b[0])),
        borderLeft: bord(def(b[3], b[1]))
    } : { border: bord(b) }), block = (v) => v && dic.filter({
    color: v.fg,
    padding: spc(v.pad),
    margin: spc(v.mrg),
    borderRadius: spc(v.rad),
    ...bords(v.brd),
    background: v.bg,
    ...font(v.f)
}), state = (v) => v && dic.filter({
    ...block(v),
    ":hover": v.h && block(v.h),
    ":visited": v.v && block(v.v),
    ":active,:focus": v.on && block(v.on),
});
// export const c = (...cls: str[]) => cc(...cls);
export const rem = (v) => v + "rem";
export const border = (color, size = 1) => `${size}px solid ${color}`;
export function tAlign(v) {
    switch (v) {
        case "l" /* HAlign.left */:
            return "left";
        case "c" /* HAlign.center */:
            return "center";
        case "r" /* HAlign.right */:
            return "right";
        case "j" /* HAlign.justify */:
            return "justify";
    }
}
export const spc = (v, unit = "em") => v == null ? null : (isN(v) ? v + unit : v.map(v => v + unit).join(" "));
/**horizontal space */
export const hs = (v) => isN(v) ? v : v[1];
/**vertical space */
export const vs = (v) => isN(v) ? v : v[0];
export const topRadius = (v, unit = "rem") => ({
    borderTopLeftRadius: v + unit,
    borderTopRightRadius: v + unit
});
export const bottomRadius = (v, unit = "rem") => ({
    borderBottomLeftRadius: v + unit,
    borderBottomRightRadius: v + unit
});
/**back & fore ground */
export const bfg = (bg, fg) => ({
    background: bg, color: fg
});
export const box = (mrg, pad) => ({
    margin: spc(mrg), padding: spc(pad)
});
export function styleCtx(options, sep) {
    let list = [], add = (style) => {
        if (isO(style))
            add.css += css(style, null, sep);
        else if (!list.includes(style)) {
            list.push(style);
            add.css += css(style(add), null, sep);
        }
        return add;
    };
    add.css = "";
    return assign(add, options);
}
