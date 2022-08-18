"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.light = exports.lightTheme = exports.rgb = exports.rgba = exports.dark = exports.darkTheme = exports.style = exports.core = exports.select = exports.dropdown = exports.accordion = exports.mobImgSelector = exports.output = exports.tab = exports.table = exports.list = exports.listItem = exports.listHelper = exports.index = exports.modal = exports.panel = exports.menurow = exports.menu = exports.menubar = exports.input = exports.button = exports.icon = void 0;
const css_js_1 = require("galho/css.js");
const galhui_js_1 = require("../galhui.js");
const style_js_1 = require("../style.js");
function icon() {
    return {
        [`.${"c" /* icon */}`]: {
            height: "1em",
            verticalAlign: "middle",
            ["&." + "xl" /* xl */]: {
                height: "10em",
            },
            ["&." + "l" /* l */]: {
                height: "5em",
            }
        }
    };
}
exports.icon = icon;
const button = (ctx) => ctx(icon) && ({
    //style
    ["." + "lk" /* link */]: {
        color: ctx.a.n,
        ":hover": { color: ctx.a.h },
        ":visited": { color: ctx.a.v },
        ":active": { color: ctx.a.a },
    },
    [(0, galhui_js_1.cc)("bt" /* button */)]: {
        borderRadius: 0.2 /* acentBorderRadius */ + "em",
        ...(0, style_js_1.box)([0, .25, 0, 0], [.78, 1.5]),
        whiteSpace: "nowrap",
        height: "initial",
        background: ctx.bt.n,
        ":hover": { background: ctx.bt.h },
        ":visited": { background: ctx.bt.v },
        ":active": { background: ctx.bt.a },
        ["&." + "full" /* full */]: { display: "block", width: "auto" },
        [`&.${"_a" /* accept */}`]: {},
        [`&.${"_e" /* error */}`]: {
            ...(0, style_js_1.bfg)(ctx.error, "#fff"),
            ":hover": {
            // background:""
            }
        },
        [`&.${"_i" /* main */}`]: {},
        [`&.${"_s" /* side */}`]: {},
        [`&.${"_w" /* warning */}`]: {},
        [`&.${"c" /* icon */}>.${"c" /* icon */}`]: {
            marginRight: ".5rem",
            ":only-child": {
                margin: "0 -.6em",
            },
        },
        ["&." + "l" /* l */]: {
            height: "5em",
        },
        ["&." + "xl" /* xl */]: {
            minHeight: "10em",
            minWidth: "12em",
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            [`.${"c" /* icon */}`]: {
                height: "7em",
            }
        }
    },
    [(0, galhui_js_1.cc)("cl" /* close */)]: {
        // color: s.error,
        background: "none",
        // position: "absolute",
        // right: ".5em",
        // top: ".5em",
        opacity: 0.8,
        ":hover": {
            opacity: 1,
        },
    },
    ["." + "bs" /* buttons */]: {},
});
exports.button = button;
function input(ctx) {
    let { bg, fg, border } = ctx.in;
    return {
        "._.in": {
            padding: ".6em 1em",
            display: "inline-flex",
            alignItems: "center",
            color: fg,
            background: bg,
            border: `1px solid ${border.n}`,
            borderRadius: 0.2 /* acentBorderRadius */ + "em",
            height: "2.4em",
            outline: "0",
            ".bt": {
                margin: 0,
                // height: "1em",
                ...(0, style_js_1.vmarg)("-.6em")
            },
            ["." + "c" /* icon */]: {},
            ":focus": {
                borderColor: border.a,
            },
            input: {
                width: "100%",
                flex: "1 1",
                outline: "none",
                border: "none"
            },
        }
    };
}
exports.input = input;
const menubar = ({ menu }) => ({
    [(0, galhui_js_1.cc)("bar" /* menubar */)]: {
        display: "flex",
        height: 2 /* menuH */ + "em",
        lineHeight: 2 /* menuH */ + "em",
        padding: "0 2vw",
        flex: "0 0 auto",
        background: menu,
        "&.fill": {
            "*": {
                flex: 1
            }
        },
        "*": {
            marginTop: 0,
            marginBottom: 0,
            border: "none",
            margin: "0 .1em",
            padding: "0 .3em",
            minWidth: "2em",
            height: "100%"
        },
        [(0, galhui_js_1.cc)("in" /* input */)]: {
        // background: ,
        },
        [`.i,.in,${(0, galhui_js_1.cc)("dd" /* dropdown */)}`]: {
            ":hover": {
                background: "#b3c2c9",
            },
            ":active,&.on": {
                background: "#9eb6c0",
            }
            // ...state(mn.i)
        },
        ".in": {},
        ".r": {
            flex: 1,
            border: "none",
            minWidth: 0,
            padding: 0,
            margin: 0
        },
        hr: {
            height: "100%",
            margin: 0,
            minWidth: 0,
            padding: 0
        }
    },
});
exports.menubar = menubar;
const menu = ({ menu, disabled }) => ({
    [(0, galhui_js_1.cc)("menu" /* menu */)]: {
        background: menu,
        outline: "none",
        position: "fixed",
        overflow: "auto",
        maxWidth: "80vw",
        boxShadow: "#0004 6px 6px 12px 0px",
        borderRadius: ".15em",
        padding: ".7em .2em",
        minWidth: "16em",
        table: {
            width: "100%",
            borderCollapse: "collapse",
            [(0, galhui_js_1.cc)("div" /* separator */)]: {
                border: "none",
                borderBottom: (0, style_js_1.border)("#000"),
            },
            tr: {
                fontSize: "inherit",
                fontFamily: "inherit",
                lineHeight: "initial",
                padding: "3px 4px",
                // margin:"0 1px",
                td: {
                    //icon
                    ":nth-child(1)": {
                        width: "1.2rem"
                    },
                    //main content
                    ":nth-child(2)": {
                        padding: "3px 0"
                    },
                    //shortcut
                    ":nth-child(3)": {
                        paddingLeft: "1rem",
                        opacity: .7,
                        textAlign: "end"
                    },
                    //submenu icon
                    ":nth-child(4)": {
                        width: "1.4em",
                    },
                },
                [`&.${"div" /* separator */}`]: {
                    borderBottom: "solid 1px #000"
                }
            },
            [`.${"i" /* item */},.${"dd" /* dropdown */}`]: {
                ":hover": {
                    background: "#acc5cf",
                },
                ["&." + "ds" /* disabled */]: {
                    background: disabled,
                },
                // ":active": {
                //   background:"",
                // },
            },
        },
        // display: "table",  
    },
    "._.tip": {
        position: "fixed",
        background: menu,
        padding: ".7em 1em",
    }
});
exports.menu = menu;
const menurow = ({ menu }) => ({
    "._.menurow": {
        background: menu,
        lineHeight: 2 /* menuH */ + "em",
        ".i": {
            padding: "0 2vw",
            display: "block",
            ":hover": {
                background: "#b3c2c9",
            },
            ":active,&.on": {
                background: "#9eb6c0",
            }
        }
    }
});
exports.menurow = menurow;
const panelHelper = () => ({});
function panel(ctx) {
    return {
        "._.panel": {
            display: "flex",
            position: "relative",
            textAlign: "start",
            overflow: "hidden",
            flexDirection: "column",
            background: ctx.bg,
            ".hd": {
                padding: ".1em .7em",
                background: ctx.modal.hd,
                "&:empty": { display: "none" },
                // height:"unset"
            },
            ".bd": {
                ...(0, style_js_1.box)(0, [.5, .8]),
                padding: ".5em 1.7em",
                overflow: "auto",
                flex: "1 1 auto",
                ":first-child": { paddingTop: "1.2em", },
            },
            ".ft": {
                display: "flex",
                padding: ".7em 1em",
                background: ctx.modal.ft,
                flexDirection: "row-reverse",
            },
        },
    };
}
exports.panel = panel;
const modal = (ctx) => (ctx(exports.button)(panel) && {
    [(0, galhui_js_1.cc)("mda" /* modalArea */)]: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#0004",
        zIndex: 2 /* modalArea */,
        overflow: "auto",
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "center",
        // padding: spc(1, "rem"),
    },
    "._.modal": {
        ...(0, style_js_1.box)(0, 0),
        zIndex: 3 /* modal */,
        borderRadius: (0, style_js_1.rem)(.3),
        outline: "none",
        "&.xl": {
            width: "calc(100% - 1rem)",
            height: "calc(100% - 1rem)",
            margin: ".5rem"
        },
        ".hd": {
            padding: "1.2em 1.7em",
        },
        ".bd": {},
        ".ft": {
            padding: "1em 1.7em",
        },
        ["." + "cl" /* close */]: {
            position: "absolute",
            right: 0,
            top: 0,
        }
    },
    [(0, style_js_1.min)(1024 /* laptop */)]: {},
    [(0, style_js_1.min)(768 /* tablet */)]: {
        [(0, galhui_js_1.cc)("modal" /* modal */)]: {
            width: "75%",
            maxWidth: (768 /* tablet */ - 20) + "px",
            /**full screen */
            "&.xl": {
                width: "calc(100% - 3rem)",
                height: "calc(100% - 3rem)",
                margin: "1.5rem",
                maxWidth: "unset"
            },
            "&.l": {
                width: "95%",
                maxWidth: "1020px"
            },
            "&.s": {
                width: "55%"
            },
            "&.xs": {
                width: "35.2%",
                maxWidth: "360px"
            },
        },
    },
    [(0, style_js_1.max)(768 /* tablet */)]: {
        "._.modal": {
            width: "95%",
            minWidth: 0
        }
    }
});
exports.modal = modal;
const index = (ctx) => ({
    "._.index": {
        display: "flex",
        flexDirection: "row",
        ".hd": {},
        ".bd": {
            padding: "1em",
            flex: 1, minWidth: 0,
            overflow: "auto",
            ".hd": { margin: "1em 0 0" }
        }
    }
});
exports.index = index;
function listHelper(_) {
    return {
        overflow: "hidden scroll",
    };
}
exports.listHelper = listHelper;
function listItem({ o, n, h, a, v }) {
    return {
        minHeight: "1.2em",
        background: n,
        ":nth-child(odd)": {
            background: o,
        },
        ":hover": {
            background: h,
        },
        "&.on": {
            background: v,
        },
        ["&." + "crt" /* current */]: {
            outline: `1px solid ${a}`,
        }
    };
}
exports.listItem = listItem;
function list({ brd, list: l }) {
    return {
        "._._.list": {
            width: "100%",
            height: "300px",
            tbody: {
                padding: 0,
                ...listHelper(l),
                ".i": {
                    margin: "1px 0 0",
                    ...listItem(l),
                    ["." + "sd" /* side */]: {
                        width: "2em",
                        borderRight: (0, style_js_1.border)(brd),
                    },
                    ["." + "extra" /* extra */]: {}
                }
            },
            tfoot: { position: "sticky", bottom: 0, background: "#fff" }
        },
    };
}
exports.list = list;
const table = ({ menu, fg, list: l, brd }) => ({
    [(0, galhui_js_1.cc)("tb" /* table */)]: {
        padding: 0,
        display: "flex",
        flexDirection: "column",
        outline: "none",
        overflow: "auto hidden",
        ".bd": {
            position: "relative",
            minWidth: "100%",
            height: `calc(100% - ${2 /* menuH */}em)`,
            ...listHelper(l)
        },
        //line
        " .tb-i": {
            display: "flex",
            flexDirection: "row",
            width: "fit-content",
            minHeight: "1.2em",
            whiteSpace: "nowrap",
            // paddingLeft: "2em",
            ...listItem(l),
            ["." + "sd" /* side */]: {
                // position: "absolute",
                left: 0,
                background: "inherit",
                width: "2em",
                borderRight: (0, style_js_1.border)(brd),
            },
            //cell
            "*": {
                padding: `${0.3 /* acentVPad */}em ${0.4 /* acentHPad */}em`,
                borderRadius: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                margin: 0,
                border: "none",
                borderRight: (0, style_js_1.border)(brd),
                borderBottom: (0, style_js_1.border)(brd),
            }
        },
        ".hd": {
            display: "flex",
            flexShrink: 0,
            flexGrow: 0,
            backgroundColor: menu,
            height: 2 /* menuH */ + "em",
            overflowY: "scroll",
            //cell
            ".i": {
                background: "inherit",
                padding: `${0.3 /* acentVPad */}em .3em`,
                position: "relative",
                flexShrink: 0,
                ["." + "dd" /* dropdown */]: {
                    position: "absolute",
                    lineHeight: "2em",
                    right: 0,
                    top: 0,
                    borderLeft: `solid 1px rgba(34, 36, 38, .15)`,
                    height: "100%"
                },
                ["." + "div" /* separator */]: {
                    cursor: "col-resize",
                    position: "absolute",
                    right: "-4px",
                    top: 0,
                    width: "4px",
                    zIndex: 1 /* front */,
                    height: "100%",
                },
            },
            ["." + "sd" /* side */]: {
                // position: "absolute",
                width: "2em",
            },
        },
        ".ft": {
            overflowY: "scroll",
            flexShrink: 0,
            flexGrow: 0,
        },
        ["&." + "brd" /* bordered */]: {
            ["." + "hd" /* head */]: {
                //cell
                ["." + "i" /* item */]: {
                    border: `1px solid ${fg}`
                },
                [">:not(:first-child)"]: {
                    borderLeft: "none"
                },
                ["." + "sd" /* side */]: {
                    borderTop: "none",
                    borderLeft: "none",
                },
            },
            // ["." + C.body]: {
            //   //row
            //   ["." + C.item]: {
            //     //cell
            //     ["." + C.item]: {
            //       border: `1px solid ${fg}`
            //     },
            //   },
            // },
        },
        "&.fill": {
            " .tb-i": {
                width: "unset",
                ">:not(.sd)": { flexGrow: 1, flexShrink: 1 },
            }
        }
    }
});
exports.table = table;
function tab({ menu }) {
    return {
        [(0, galhui_js_1.cc)("ta" /* tab */)]: {
            [(0, galhui_js_1.cc)("bar" /* menubar */)]: {
                background: menu,
                [(0, galhui_js_1.cc)("cl" /* close */)]: {
                    float: "right",
                    opacity: 0,
                    height: (0, style_js_1.rem)(2 /* menuH */),
                    ":hover": {}
                },
                ":hover": {
                    [(0, galhui_js_1.cc)("cl" /* close */)]: {
                        opacity: 1
                    },
                }
            },
            ["." + "bd" /* body */]: {
                height: `calc(100% - ${2 /* menuH */}px)`
            }
        }
    };
}
exports.tab = tab;
function output() {
    // let { a } = theme;
    return {
        [(0, galhui_js_1.cc)("lb" /* label */)]: {
        // ...block(a),
        //display: "flex",
        //input: {
        //  width: "100%"
        //},
        },
        [(0, galhui_js_1.cc)("ms" /* message */)]: {
            [`&.${"_e" /* error */}`]: {
                ...(0, style_js_1.bfg)("rgb(255, 246, 246)", "rgb(159, 58, 56)" /* error */),
            },
            ...(0, style_js_1.box)([1, 0], [1, 1.5]),
            ":empty": { display: "none" }
        },
    };
}
exports.output = output;
function mobImgSelector(ctx) {
    ctx(exports.button);
    return {
        [(0, galhui_js_1.cc)("m" /* mobile */, "imgsel")]: {
            position: "relative",
            textAlign: "center",
            width: "12em",
            margin: "auto",
            input: {
                display: "none",
            },
            ["." + "bt" /* button */]: {
                margin: 0,
                width: "40px",
                height: "40px",
                borderRadius: "20px",
                position: "absolute",
                right: 0,
                bottom: 0
            },
            ["." + "bd" /* body */]: {
                display: "inline-block",
                lineHeight: "21em",
                overflow: "hidden",
                margin: 0,
                background: "#fff",
                color: "#000",
                height: "12em",
                width: "12em",
                borderRadius: "6em",
                img: { width: "100%" }
            },
        },
    };
}
exports.mobImgSelector = mobImgSelector;
function accordion() {
    return {
        [(0, galhui_js_1.cc)("ac" /* accordion */)]: {
            ["." + "bd" /* body */]: {
                display: "none"
            },
            ["." + "hd" /* head */]: {
                [`&.${"on" /* on */}+.${"bd" /* body */}`]: {
                    display: "block"
                },
            },
        }
    };
}
exports.accordion = accordion;
function dropdown(ctx) {
    ctx(exports.menu);
    return {
        [(0, galhui_js_1.cc)("dd" /* dropdown */)]: {
            ["." + "menu" /* menu */]: {
                position: "fixed",
                zIndex: 4 /* ctxMenu */
            },
            ["." + "c" /* icon */]: {
                padding: "0 .4em"
            }
        }
    };
}
exports.dropdown = dropdown;
function select(add) {
    add(exports.menu);
    return {
        [(0, galhui_js_1.cc)("sel" /* select */)]: {
            minWidth: "10em",
            position: "relative",
            display: "inline-block",
            overflow: "hidden",
            // ["." + C.side]: {
            //   float: "right"
            // },
            ".bd": {
                width: `calc(100% - ${14 /* rem */}px)`,
                display: "inline-flex",
                margin: 0, padding: 0,
                whiteSpace: "normal",
                background: "inherit",
                outline: "none",
                border: "none",
                ["." + "cl" /* close */]: {
                    marginLeft: "auto"
                }
            },
            ".menu": {
                maxWidth: "unset",
                position: "fixed",
                overflow: "hidden auto",
                zIndex: 4 /* ctxMenu */
            },
            /**top */
            "&.t": {},
            /**bottom */
            "&.b": {},
            input: {
                background: "none",
                color: "inherit"
            }
        }
    };
}
exports.select = select;
const core = (p, tag = (0, css_js_1.css)({})) => (0, style_js_1.styleCtx)(p, (0, css_js_1.css)({
    html: {
        fontSize: 14 /* rem */ + "px",
        fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif" /* ff */,
    },
    body: {
        background: p.bg,
        color: p.fg,
        margin: 0
    },
    button: {
        background: "none",
        color: "inherit",
        border: "none"
    },
    a: {
        color: "inherit",
        textDecoration: "none"
    },
    hr: { margin: 0, },
    input: {
        background: "inherit",
        color: "inherit",
        border: "none"
    },
    "*": {
        boxSizing: "border-box",
    },
    "._.off": { display: "none!important" },
    "._.row": { display: "flex", flexDirection: "row" },
    "._.col": { display: "flex", flexDirection: "column", ".fill": { flex: 1 } },
}, tag));
exports.core = core;
const style = (p, tag) => (0, exports.core)(p, tag)(icon)(exports.button)(dropdown)(select)(input)(panel)(exports.modal)(exports.menu)(exports.menubar)(exports.menurow)(exports.table)(tab)(exports.index)(output)(list)(exports.table)(mobImgSelector);
exports.style = style;
/**full style,dark theme */
exports.darkTheme = {
    bg: "#1c313a",
    fg: "#fff",
    error: "#ab000d",
    menu: "",
    disabled: "#999ea0",
    list: { n: "#e0f7fa", o: "" },
    modal: {
        hd: "",
        ft: "",
    },
    bt: { n: "", h: "", a: "" },
    in: { bg: "", border: { n: "" } },
    a: { n: "#1976d2", v: "#6a1b9a", a: "#0d47a1", h: "" },
};
const dark = (tag) => (0, exports.style)(exports.darkTheme, tag);
exports.dark = dark;
const rgba = (r, g, b, a) => `rgba(${r},${g},${b},${a})`;
exports.rgba = rgba;
const rgb = (r, g, b) => `rgb(${r},${g},${b})`;
exports.rgb = rgb;
exports.lightTheme = {
    fg: "#000",
    bg: "#fff",
    error: "#ef5350",
    menu: "#cfd8dc",
    disabled: "#999ea0",
    list: { n: "#fff", o: "#f6f6f6", h: "#e0f7fa", a: "#03a9f4", v: "#e0f7fa" },
    modal: {
        hd: "#e0f7fa",
        ft: "#e0f7fa",
    },
    brd: (0, exports.rgba)(34, 36, 38, .15),
    bt: { n: "#1976d2", h: "#1976d2", a: "#1976d2" },
    in: { bg: "", border: { n: (0, exports.rgba)(34, 36, 38, .15), a: (0, exports.rgb)(133, 183, 217) } },
    a: { n: "#1976d2", v: "#6a1b9a", a: "#0d47a1", h: "" },
};
/**full style,light theme */
const light = (tag) => (0, exports.style)(exports.lightTheme, tag);
exports.light = light;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx5Q0FBa0Q7QUFDbEQsNENBQWtEO0FBQ2xELDBDQUE2RztBQXdDN0csU0FBZ0IsSUFBSTtJQUNsQixPQUFPO1FBQ0wsQ0FBQyxJQUFJLGNBQU0sRUFBRSxDQUFDLEVBQUU7WUFDZCxNQUFNLEVBQUUsS0FBSztZQUNiLGFBQWEsRUFBRSxRQUFRO1lBQ3ZCLENBQUMsSUFBSSxnQkFBVSxDQUFDLEVBQUU7Z0JBQ2hCLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7WUFDRCxDQUFDLElBQUksY0FBUyxDQUFDLEVBQUU7Z0JBQ2YsTUFBTSxFQUFFLEtBQUs7YUFDZDtTQUNGO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFiRCxvQkFhQztBQUNNLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBWSxFQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUM1RCxPQUFPO0lBQ1AsQ0FBQyxHQUFHLGtCQUFTLENBQUMsRUFBRTtRQUNkLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDNUIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzlCLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtLQUM5QjtJQUNELENBQUMsSUFBQSxjQUFFLG9CQUFVLENBQUMsRUFBRTtRQUNkLFlBQVksRUFBRSw4QkFBMkIsSUFBSTtRQUM3QyxHQUFHLElBQUEsY0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENB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