"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.light = exports.lightTheme = exports.rgb = exports.rgba = exports.dark = exports.darkTheme = exports.style = exports.core = exports.select = exports.dropdown = exports.accordion = exports.mobImgSelector = exports.output = exports.tab = exports.table = exports.list = exports.listItem = exports.listHelper = exports.index = exports.modal = exports.panel = exports.menurow = exports.menu = exports.menubar = exports.input = exports.button = exports.icon = void 0;
const css_1 = require("galho/css");
const galhui_1 = require("../galhui");
const style_1 = require("../style");
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
    [(0, galhui_1.cc)("bt" /* button */)]: {
        borderRadius: 0.2 /* acentBorderRadius */ + "em",
        ...(0, style_1.box)([0, .25, 0, 0], [.78, 1.5]),
        whiteSpace: "nowrap",
        height: "initial",
        background: ctx.bt.n,
        ":hover": { background: ctx.bt.h },
        ":visited": { background: ctx.bt.v },
        ":active": { background: ctx.bt.a },
        ["&." + "full" /* full */]: { display: "block", width: "auto" },
        [`&.${"_a" /* accept */}`]: {},
        [`&.${"_e" /* error */}`]: {
            ...(0, style_1.bfg)(ctx.error, "#fff"),
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
    [(0, galhui_1.cc)("cl" /* close */)]: {
        // color: s.error,
        background: "none",
        position: "absolute",
        right: ".5em",
        top: ".5em",
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
            color: fg,
            background: bg,
            border: `1px solid ${border.n}`,
            borderRadius: 0.2 /* acentBorderRadius */ + "em",
            height: "2.4em",
            outline: "0",
            ".bt": {
                margin: 0,
                // height: "1em",
                ...(0, style_1.vmarg)("-.6em")
            },
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
    [(0, galhui_1.cc)("bar" /* menubar */)]: {
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
        [(0, galhui_1.cc)("in" /* input */)]: {
        // background: ,
        },
        [`.${"i" /* item */},${(0, galhui_1.cc)("dd" /* dropdown */)}`]: {
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
const menu = ({ menu }) => ({
    [(0, galhui_1.cc)("menu" /* menu */)]: {
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
            [(0, galhui_1.cc)("div" /* separator */)]: {
                border: "none",
                borderBottom: (0, style_1.border)("#000"),
            },
            tr: {
                fontSize: "inherit",
                fontFamily: "inherit",
                lineHeight: "initial",
                padding: "3px 4px",
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
                ["." + "ds" /* disabled */]: {
                    background: "grey",
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
                ...(0, style_1.box)(0, [.5, .8]),
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
    [(0, galhui_1.cc)("mda" /* modalArea */)]: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#0004",
        zIndex: 2 /* modalArea */,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: (0, style_1.spc)(1, "rem"),
    },
    [(0, galhui_1.cc)("modal" /* modal */)]: {
        ...(0, style_1.box)(0, 0),
        zIndex: 3 /* modal */,
        borderRadius: (0, style_1.rem)(.3),
        outline: "none",
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
        },
    },
    [(0, style_1.min)(1024 /* laptop */)]: {},
    [(0, style_1.min)(768 /* tablet */)]: {
        [(0, galhui_1.cc)("modal" /* modal */)]: {
            width: "75%",
            maxWidth: (768 /* tablet */ - 20) + "px",
            /**full screen */
            [`.${"xl" /* xl */}`]: {
                width: "95%",
                height: "100%"
            },
            [`.${"l" /* l */}`]: {
                width: "95%",
                maxWidth: "1020px"
            },
            [`.${"s" /* s */}`]: {
                width: "55%"
            },
            [`.${"xs" /* xs */}`]: {
                width: "35.2%",
                maxWidth: "360px"
            },
        },
    },
    [(0, style_1.max)(768 /* tablet */)]: {
        [(0, galhui_1.cc)("modal" /* modal */)]: {
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
                        borderRight: (0, style_1.border)(brd),
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
    [(0, galhui_1.cc)("tb" /* table */)]: {
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
                borderRight: (0, style_1.border)(brd),
            },
            //cell
            "*": {
                padding: `${0.3 /* acentVPad */}em ${0.4 /* acentHPad */}em`,
                borderRadius: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                margin: 0,
                border: "none",
                borderRight: (0, style_1.border)(brd),
                borderBottom: (0, style_1.border)(brd),
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
        [(0, galhui_1.cc)("ta" /* tab */)]: {
            [(0, galhui_1.cc)("bar" /* menubar */)]: {
                background: menu,
                [(0, galhui_1.cc)("cl" /* close */)]: {
                    float: "right",
                    opacity: 0,
                    height: (0, style_1.rem)(2 /* menuH */),
                    ":hover": {}
                },
                ":hover": {
                    [(0, galhui_1.cc)("cl" /* close */)]: {
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
        [(0, galhui_1.cc)("lb" /* label */)]: {
        // ...block(a),
        //display: "flex",
        //input: {
        //  width: "100%"
        //},
        },
        [(0, galhui_1.cc)("ms" /* message */)]: {
            [`&.${"_e" /* error */}`]: {
                ...(0, style_1.bfg)("rgb(255, 246, 246)", "rgb(159, 58, 56)" /* error */),
            },
            ...(0, style_1.box)([1, 0], [1, 1.5]),
            ":empty": { display: "none" }
        },
    };
}
exports.output = output;
function mobImgSelector(ctx) {
    ctx(exports.button);
    return {
        [(0, galhui_1.cc)("m" /* mobile */, "imgsel")]: {
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
        [(0, galhui_1.cc)("ac" /* accordion */)]: {
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
        [(0, galhui_1.cc)("dd" /* dropdown */)]: {
            ["." + "menu" /* menu */]: {
                position: "fixed",
                zIndex: 4 /* ctxMenu */
            }
        }
    };
}
exports.dropdown = dropdown;
function select(add) {
    add(exports.menu);
    return {
        [(0, galhui_1.cc)("sel" /* select */)]: {
            minWidth: "10em",
            position: "relative",
            display: "inline-block",
            overflow: "hidden",
            // ["." + C.side]: {
            //   float: "right"
            // },
            ["." + "bd" /* body */]: {
                width: `calc(100% - ${14 /* rem */}px)`,
                display: "inline-flex",
                margin: 0, padding: 0,
                whiteSpace: "normal", background: "inherit",
                outline: "none", border: "none"
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
const core = (p, tag = (0, css_1.css)({})) => (0, style_1.styleCtx)(p, (0, css_1.css)({
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
    "._.row": { display: "flex", flexDirection: "row" },
    "._.col": { display: "flex", flexDirection: "column", ".fill": { flex: 1 } },
    [(0, galhui_1.cc)("off" /* off */)]: { display: "none" }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtQ0FBK0M7QUFDL0Msc0NBQStEO0FBQy9ELG9DQUE0SDtBQXNDNUgsU0FBZ0IsSUFBSTtJQUNsQixPQUFPO1FBQ0wsQ0FBQyxJQUFJLGNBQU0sRUFBRSxDQUFDLEVBQUU7WUFDZCxNQUFNLEVBQUUsS0FBSztZQUNiLGFBQWEsRUFBRSxRQUFRO1lBQ3ZCLENBQUMsSUFBSSxnQkFBVSxDQUFDLEVBQUU7Z0JBQ2hCLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7WUFDRCxDQUFDLElBQUksY0FBUyxDQUFDLEVBQUU7Z0JBQ2YsTUFBTSxFQUFFLEtBQUs7YUFDZDtTQUNGO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFiRCxvQkFhQztBQUNNLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBWSxFQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUM1RCxPQUFPO0lBQ1AsQ0FBQyxHQUFHLGtCQUFTLENBQUMsRUFBRTtRQUNkLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDNUIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzlCLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtLQUM5QjtJQUNELENBQUMsSUFBQSxXQUFFLG9CQUFVLENBQUMsRUFBRTtRQUNkLFlBQVksRUFBRSw4QkFBMkIsSUFBSTtRQUM3QyxHQUFHLElBQUEsV0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENB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