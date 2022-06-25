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
        "._.tip": {
            position: "fixed",
            background: menu,
            padding: ".7em 1em",
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBa0M7QUFDbEMsc0NBQStEO0FBQy9ELG9DQUE0SDtBQXNDNUgsU0FBZ0IsSUFBSTtJQUNsQixPQUFPO1FBQ0wsQ0FBQyxJQUFJLGNBQU0sRUFBRSxDQUFDLEVBQUU7WUFDZCxNQUFNLEVBQUUsS0FBSztZQUNiLGFBQWEsRUFBRSxRQUFRO1lBQ3ZCLENBQUMsSUFBSSxnQkFBVSxDQUFDLEVBQUU7Z0JBQ2hCLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7WUFDRCxDQUFDLElBQUksY0FBUyxDQUFDLEVBQUU7Z0JBQ2YsTUFBTSxFQUFFLEtBQUs7YUFDZDtTQUNGO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFiRCxvQkFhQztBQUNNLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBWSxFQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNoRSxPQUFPO0lBQ1AsQ0FBQyxHQUFHLGtCQUFTLENBQUMsRUFBRTtRQUNkLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDNUIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzlCLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtLQUM5QjtJQUNELENBQUMsSUFBQSxXQUFFLG9CQUFVLENBQUMsRUFBRTtRQUNkLFlBQVksRUFBRSw4QkFBMkIsSUFBSTtRQUM3QyxHQUFHLElBQUEsV0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENB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QUFHLENBQUM7SUFDMUIsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7SUFDaEQsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBQSxZQUFJLEVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUEsV0FBRyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRTtJQUMzRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3ZELENBQUE7QUFDRCw0QkFBNEI7QUFDckIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUF5QixFQUFFLEVBQUUsQ0FBQyxJQUFBLGFBQUssRUFBQyxrQkFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQTlELFFBQUEsS0FBSyxTQUF5RCJ9