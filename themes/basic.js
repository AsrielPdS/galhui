"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.light = exports.lightTheme = exports.rgb = exports.rgba = exports.dark = exports.darkTheme = exports.style = exports.core = exports.select = exports.dropdown = exports.accordion = exports.mobImgSelector = exports.output = exports.tab = exports.table = exports.list = exports.listItem = exports.listHelper = exports.modal = exports.panel = exports.menu = exports.menubar = exports.input = exports.button = exports.icon = void 0;
const css = require("galho/css");
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
function menu({ menu }) {
    return {
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
    };
}
exports.menu = menu;
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
function listHelper(_) {
    return {
        overflow: "hidden scroll",
    };
}
exports.listHelper = listHelper;
function listItem({ o, n, h, a, v }) {
    return {
        display: "flex",
        whiteSpace: "nowrap",
        flexDirection: "row",
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
            padding: 0,
            ...listHelper(l),
            ".i": {
                margin: "1px 0 0",
                ...listItem(l),
                ["." + "sd" /* side */]: {
                    width: "2em",
                    borderRight: (0, style_1.border)(brd),
                },
            }
        },
    };
}
exports.list = list;
const table = ({ menu, fg, list: l, brd }) => ({
    [(0, galhui_1.cc)("tb" /* table */)]: {
        padding: 0,
        //display: "flex",
        outline: "none",
        overflow: "auto hidden",
        ".hd": {
            display: "flex",
            backgroundColor: menu,
            height: 2 /* menuH */ + "em",
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
        ".bd": {
            position: "relative",
            minWidth: "100%",
            height: `calc(100% - ${2 /* menuH */}em)`,
            ...listHelper(l)
        },
        //line
        " .tb-i": {
            display: "flex",
            whiteSpace: "nowrap",
            flexDirection: "row",
            width: "fit-content",
            minHeight: "1.2em",
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
            ".i": {
                padding: `${0.3 /* acentVPad */}em ${0.4 /* acentHPad */}em`,
                overflow: "hidden",
                textOverflow: "ellipsis",
                margin: 0,
                borderRight: (0, style_1.border)(brd),
                borderBottom: (0, style_1.border)(brd),
            }
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
    ctx(menu);
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
    add(menu);
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
const core = (p, tag = css({})) => (0, style_1.styleCtx)(p, css({
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
const style = (p, tag) => (0, exports.core)(p, tag)(icon)(exports.button)(dropdown)(select)(input)(panel)(exports.modal)(menu)(exports.menubar)(exports.table)(tab)(output)(list)(exports.table)(mobImgSelector);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBa0M7QUFDbEMsc0NBQStEO0FBQy9ELG9DQUE0SDtBQXNDNUgsU0FBZ0IsSUFBSTtJQUNsQixPQUFPO1FBQ0wsQ0FBQyxJQUFJLGNBQU0sRUFBRSxDQUFDLEVBQUU7WUFDZCxNQUFNLEVBQUUsS0FBSztZQUNiLGFBQWEsRUFBRSxRQUFRO1lBQ3ZCLENBQUMsSUFBSSxnQkFBVSxDQUFDLEVBQUU7Z0JBQ2hCLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7WUFDRCxDQUFDLElBQUksY0FBUyxDQUFDLEVBQUU7Z0JBQ2YsTUFBTSxFQUFFLEtBQUs7YUFDZDtTQUNGO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFiRCxvQkFhQztBQUNNLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBWSxFQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNoRSxPQUFPO0lBQ1AsQ0FBQyxHQUFHLGtCQUFTLENBQUMsRUFBRTtRQUNkLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDNUIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzlCLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtLQUM5QjtJQUNELENBQUMsSUFBQSxXQUFFLG9CQUFVLENBQUMsRUFBRTtRQUNkLFlBQVksRUFBRSw4QkFBMkIsSUFBSTtRQUM3QyxHQUFHLElBQUEsV0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENB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