"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleCtx = exports.box = exports.bfg = exports.bottomRadius = exports.topRadius = exports.vs = exports.hs = exports.spc = exports.tAlign = exports.border = exports.rem = exports.c = exports.state = exports.block = exports.bords = exports.bord = exports.vmarg = exports.vpad = exports.row = exports.col = exports.center = exports.font = exports.isDark = exports.italic = exports.bold = exports.max = exports.min = void 0;
const util_js_1 = require("galho/util.js");
const galhui_js_1 = require("./galhui.js");
const dic_js_1 = require("galho/dic.js");
const css_js_1 = require("galho/css.js");
const min = (size) => `@media (min-width: ${size}px)`;
exports.min = min;
const max = (size) => `@media (max-width: ${size}px)`;
exports.max = max;
const bold = (v) => v ? (0, util_js_1.isB)(v) ? "bold" : v : null;
exports.bold = bold;
const italic = (v) => v ? (0, util_js_1.isB)(v) ? "italic" : v : null;
exports.italic = italic;
function isDark() {
    return matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
}
exports.isDark = isDark;
function font(v) {
    return v && ((0, util_js_1.isN)(v) ?
        { fontSize: v + "rem" } :
        v.f ?
            { font: `${(0, util_js_1.toStr)((0, exports.italic)(v.i))} ${(0, util_js_1.toStr)((0, exports.bold)(v.b))} ${v.s}rem ${v.f}` } :
            { fontSize: v.s && (v.s + "rem"), fontWeight: (0, exports.bold)(v.b), fontStyle: (0, exports.italic)(v.i) });
}
exports.font = font;
const center = () => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    translate: "-50% -50%",
}), col = () => ({
    display: "flex",
    flexDirection: "column"
}), row = (inline) => ({
    display: inline ? "inline-flex" : "flex",
    flexDirection: "row"
}), vpad = (v) => ({
    paddingTop: v,
    paddingBottom: v
}), vmarg = (v) => ({
    marginTop: v,
    marginBottom: v
}), bord = (b) => b && `${b.w || 1}px ${b.s || "solid"} ${b.c}`, bords = (b) => b &&
    ((0, util_js_1.isA)(b) ? {
        borderTop: (0, exports.bord)(b[0]),
        borderRight: (0, exports.bord)(b[1]),
        borderBottom: (0, exports.bord)((0, util_js_1.def)(b[2], b[0])),
        borderLeft: (0, exports.bord)((0, util_js_1.def)(b[3], b[1]))
    } : { border: (0, exports.bord)(b) });
exports.center = center, exports.col = col, exports.row = row, exports.vpad = vpad, exports.vmarg = vmarg, exports.bord = bord, exports.bords = bords;
const block = (v) => v && (0, dic_js_1.filter)({
    color: v.fg,
    padding: (0, exports.spc)(v.pad),
    margin: (0, exports.spc)(v.mrg),
    borderRadius: (0, exports.spc)(v.rad),
    ...(0, exports.bords)(v.brd),
    background: v.bg,
    ...font(v.f)
}), state = (v) => v && (0, dic_js_1.filter)({
    ...(0, exports.block)(v),
    ":hover": v.h && (0, exports.block)(v.h),
    ":visited": v.v && (0, exports.block)(v.v),
    ":active,:focus": v.on && (0, exports.block)(v.on),
});
exports.block = block, exports.state = state;
const c = (...cls) => (0, galhui_js_1.cc)(...cls);
exports.c = c;
const rem = (v) => v + "rem";
exports.rem = rem;
const border = (color, size = 1) => `${size}px solid ${color}`;
exports.border = border;
function tAlign(v) {
    switch (v) {
        case "l" /* left */:
            return "left";
        case "c" /* center */:
            return "center";
        case "r" /* right */:
            return "right";
        case "j" /* justify */:
            return "justify";
    }
}
exports.tAlign = tAlign;
const spc = (v, unit = "em") => v == null ? null : ((0, util_js_1.isN)(v) ? v + unit : v.map(v => v + unit).join(" "));
exports.spc = spc;
/**horizontal space */
const hs = (v) => (0, util_js_1.isN)(v) ? v : v[1];
exports.hs = hs;
/**vertical space */
const vs = (v) => (0, util_js_1.isN)(v) ? v : v[0];
exports.vs = vs;
const topRadius = (v, unit = "rem") => ({
    borderTopLeftRadius: v + unit,
    borderTopRightRadius: v + unit
});
exports.topRadius = topRadius;
const bottomRadius = (v, unit = "rem") => ({
    borderBottomLeftRadius: v + unit,
    borderBottomRightRadius: v + unit
});
exports.bottomRadius = bottomRadius;
/**back & fore ground */
const bfg = (bg, fg) => ({
    background: bg, color: fg
});
exports.bfg = bfg;
const box = (mrg, pad) => ({
    margin: (0, exports.spc)(mrg), padding: (0, exports.spc)(pad)
});
exports.box = box;
function styleCtx(options, tag = (0, css_js_1.css)({})) {
    let list = [], add = (style) => {
        if ((0, util_js_1.isO)(style))
            (0, css_js_1.css)(style, tag);
        else if (!list.includes(style)) {
            list.push(style);
            (0, css_js_1.css)(style(add), tag);
        }
        return add;
    };
    return (0, util_js_1.assign)(add, options);
}
exports.styleCtx = styleCtx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdHlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwyQ0FBdUU7QUFDdkUsMkNBQXlDO0FBQ3pDLHlDQUFzQztBQUN0Qyx5Q0FBOEQ7QUF3QnZELE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBZ0IsRUFBRSxFQUFFLENBQUMsc0JBQXNCLElBQUksS0FBSyxDQUFDO0FBQTVELFFBQUEsR0FBRyxPQUF5RDtBQUNsRSxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQWdCLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixJQUFJLEtBQUssQ0FBQztBQUE1RCxRQUFBLEdBQUcsT0FBeUQ7QUFDbEUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUE2QixFQUFPLEVBQUUsQ0FDekQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFBLGFBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQURwQixRQUFBLElBQUksUUFDZ0I7QUFDMUIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUE0QixFQUFPLEVBQUUsQ0FDMUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFBLGFBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUR0QixRQUFBLE1BQU0sVUFDZ0I7QUFFbkMsU0FBZ0IsTUFBTTtJQUNwQixPQUFPLFVBQVUsSUFBSSxVQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQyxPQUFPLENBQUE7QUFDekUsQ0FBQztBQUZELHdCQUVDO0FBQ0QsU0FBZ0IsSUFBSSxDQUFDLENBQU87SUFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFBLGFBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLEVBQUUsUUFBUSxFQUFFLENBQUMs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