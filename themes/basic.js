"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.light = exports.lightTheme = exports.dark = exports.darkTheme = exports.style = exports.core = exports.stack = exports.select = exports.dropdown = exports.accordion = exports.mobImgSelector = exports.output = exports.tab = exports.table = exports.list = exports.listItem = exports.listHelper = exports.index = exports.modal = exports.panel = exports.menurow = exports.menu = exports.menubar = exports.input = exports.button = exports.icon = void 0;
const galho_1 = require("galho");
const galhui_js_1 = require("../galhui.js");
const style_js_1 = require("../style.js");
const icon = () => ({
    [`.${"c" /* icon */}`]: {
        height: "1em",
        verticalAlign: "middle",
        "&.xl": {
            height: "10em",
        },
        "&.l": {
            height: "5em",
        }
    }
});
exports.icon = icon;
const button = (ctx) => ctx(exports.icon) && ({
    //style
    "._.a": {
        color: ctx.a.n,
        ":hover": { color: ctx.a.h },
        ":visited": { color: ctx.a.v },
        ":active": { color: ctx.a.a },
    },
    "._.bt": {
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
    ["." + "bs" /* buttons */]: {},
});
exports.button = button;
function input(ctx) {
    let { bg, fg, border } = ctx.in;
    return {
        "textarea._.in": {
            height: "6em",
            resize: "vertical",
        },
        "._.in": {
            padding: ".6em 1em",
            display: "inline-flex!important",
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
            ":focus-within": {
                borderColor: border.a,
            },
            input: {
                width: "100%",
                flex: "1 1",
                outline: "none",
                border: "none"
            },
            ["&." + "_e" /* error */]: {
                borderColor: "#f44336",
            }
        }
    };
}
exports.input = input;
const menubar = ({ menu }) => ({
    "._.bar": {
        display: "flex",
        height: 2 /* menuH */ + "em",
        lineHeight: 2 /* menuH */ + "em",
        padding: "0 2vw",
        flex: "0 0 auto",
        background: menu,
        whiteSpace: "nowrap",
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
            padding: "0 .6em",
            minWidth: "2em",
            height: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            img: { width: "16px", height: "16px" }
        },
        ".i,.in,.dd": {
            background: "inherit",
            ":hover": {
                background: "#b3c2c9",
            },
            ":active,&.on": {
                background: "#9eb6c0",
            }
        },
        ".hd": { fontWeight: 500 },
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
        },
        "&.main": {
            background: "#9eb6c0",
            height: "2.4em",
            paddingTop: ".3em",
            ".i:active,.i.on": {
                background: menu,
                borderRadius: ".3em .3em 0 0"
            }
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
            [`.${"_e" /* error */}`]: {
                background: "#e53935", color: "#fff",
                ":hover": { background: "#ef5350" },
            }
        },
        // display: "table",  
    },
    "._.tip": {
        position: "fixed",
        background: menu,
        padding: ".7em 1em",
        zIndex: 6 /* tip */,
        borderRadius: ".5em",
        boxShadow: "0 0 5px 1px #0004",
        "&.panel>.ft": {
            padding: 0,
            height: "unset",
            background: "inherit"
        }
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
const panel = (ctx) => ({
    "._.panel": {
        // display: "flex",
        // flexDirection: "column",
        position: "relative",
        textAlign: "start",
        overflow: "hidden",
        background: ctx.bg,
        // ["." + C.close]: {
        //   position: "absolute",
        //   right: 0,
        //   top: 0,
        //   background: "#fff",
        //   color: "#f44",
        //   borderRadius: ".7em",
        //   width: "1.3em",
        //   height:"1.3em",
        // },
        ".hd": {
            margin: 0,
            height: "2.2em",
            fontSize: "inherit",
            padding: ".4em 2em",
            background: "#cfd8dc",
            "&:empty": { display: "none" },
            // height:"unset"
        },
        ".bd": {
            ...(0, style_js_1.box)(0, [.5, .8]),
            padding: ".5em 1.7em",
            overflow: "auto",
            height: "calc(100% - 3.8em)",
            ":first-child": { paddingTop: "1.2em", },
        },
        ".hd+.bd": {
            height: "calc(100% - 6em)",
        },
        ".ft": {
            height: "3.8em",
            display: "flex",
            flexDirection: "row-reverse",
            padding: ".6em 1em",
            background: "#dfe5e8",
            hr: {
                border: "none",
                margin: "auto"
            }
        },
    },
});
exports.panel = panel;
const modal = (ctx) => ctx(exports.button)(exports.panel) && {
    [(0, galhui_js_1.cc)("mda" /* modalArea */)]: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#0004",
        zIndex: 3 /* modalArea */,
        overflow: "auto",
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "center",
        // padding: spc(1, "rem"),
    },
    "._.modal": {
        // ...box(0, 0),
        zIndex: 4 /* modal */,
        borderRadius: ".6em",
        width: "calc(100% - 1.4em)",
        height: "calc(100% - 1.4em)",
        margin: ".7em",
        "&.xl,&.l": {},
        "&.xs,&.s": {},
        // ".hd": {
        //   padding: "1.2em 1.7em",
        // },
        // ".bd": {
        // },
        // ".ft": {
        //   padding: "1em 1.7em",
        // }
    },
    [(0, style_js_1.min)(768 /* tablet */)]: {
        [(0, galhui_js_1.cc)("modal" /* modal */)]: {
            width: "75%",
            maxWidth: (768 /* tablet */ - 20) + "px",
            margin: "3em auto 0",
            height: "unset",
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
    [(0, style_js_1.min)(1024 /* laptop */)]: {},
    // [max(ScreenSize.tablet)]: {
    //   "._.modal": {
    //     width: "95%",
    //     minWidth: 0
    //   }
    // }
};
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
const listHelper = (_) => ({
    background: _.n,
});
exports.listHelper = listHelper;
const listItem = ({ h, a, v }) => ({
    ":hover": {
        background: h,
    },
    "&.on": {
        background: v,
    },
    ["&." + "crt" /* current */]: {
        outline: `1px solid ${a}`,
    }
});
exports.listItem = listItem;
const list = ({ brd, list: l }) => ({
    "._.list": {
        width: "100%",
        height: "300px",
        padding: 0,
        margin: 0,
        overflow: "hidden scroll",
        ...(0, exports.listHelper)(l),
        ".i": {
            minHeight: "1.2em",
            ...(0, style_js_1.row)(),
            margin: "1px 0 0",
            ...(0, exports.listItem)(l),
            borderBottom: "solid 1px #0004",
            ["." + "sd" /* side */]: {
                flex: "0 0 2em",
                display: "inline-block",
                padding: ".4em .2em",
                borderRight: (0, style_js_1.border)(brd),
            },
            ".bd": {
                display: "inline-block",
                padding: ".6em .4em"
            }
        },
        tfoot: { position: "sticky", bottom: 0, background: "#fff" }
    },
});
exports.list = list;
const table = ({ menu, fg, list: l, brd }) => ({
    "._.tb": {
        padding: 0,
        outline: "none",
        position: "relative",
        overflow: "auto scroll",
        ...(0, exports.listHelper)(l),
        counterReset: "tb",
        //line
        "*": {
            display: "inline-flex",
            flexDirection: "row",
            height: "2rem",
            whiteSpace: "nowrap",
            ".opts": {
                position: "absolute",
                right: 0,
            },
            //cell
            "*": {
                display: "inline-block",
                padding: `${0.3 /* acentVPad */}em ${0.4 /* acentHPad */}em`,
                borderRadius: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                margin: 0,
                height: "2rem",
                border: "none",
                borderRight: (0, style_js_1.border)(brd),
                borderBottom: (0, style_js_1.border)(brd),
                flexShrink: 0,
            },
            ["." + "sd" /* side */]: {
                flex: "0 0 2em"
            }
        },
        ".i": {
            ...(0, exports.listItem)(l),
            counterIncrement: "tb",
            [`.${"sd" /* side */}:empty::before`]: {
                content: 'counter(tb)',
            },
        },
        ".hd": {
            height: `${2 /* menuH */}em`,
            zIndex: 1 /* front */,
            background: menu,
            fontWeight: 500,
            minWidth: "100%",
            position: "sticky",
            top: 0,
            //cell
            ".i": {
                position: "relative",
                ["." + "dd" /* dropdown */]: {
                    position: "absolute",
                    lineHeight: "2em",
                    right: "4px",
                    top: 0,
                    borderLeft: `solid 1px rgba(34, 36, 38, .15)`,
                    height: "100%"
                },
                ["." + "div" /* separator */]: {
                    cursor: "col-resize",
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: "4px",
                    zIndex: 1 /* front */,
                    height: "100%",
                },
            },
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
            ".tr": {
                width: "100%",
                ".i": { flexGrow: 1, flexShrink: 1, minWidth: 0 },
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
function output(ctx) {
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
            ":empty": { height: 0, padding: 0, margin: 0 },
            transition: "all .2s"
        },
        "._._.join": {
            ...(0, style_js_1.row)(true),
            //para os filhos não removerem bordas do parent
            overflow: "hidden",
            padding: 0,
            "*": { border: "none", flex: "1 auto" },
            ">:not(:last-child)": {
                borderRadius: "0",
                borderRight: `1px solid ${ctx.in.border.n}`,
            },
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
                zIndex: 5 /* ctxMenu */
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
                zIndex: 5 /* ctxMenu */
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
const stack = ({ brd }) => ({
    "._.stack": {
        height: "100%",
        display: "flex",
        hr: {
            flex: "0 0",
            border: "none",
        },
        "&.h": {
            hr: { borderLeft: (0, style_js_1.border)(brd, 4), },
        },
        "&.v": {
            flexDirection: "column",
            hr: { borderTop: (0, style_js_1.border)(brd, 4), },
        },
        "*": { margin: 0, borderRadius: 0 }
    },
});
exports.stack = stack;
const core = (p, tag = (0, galho_1.css)({})) => (0, style_js_1.styleCtx)(p, (0, galho_1.css)({
    html: {
        fontSize: 14 /* rem */ + "px",
        fontFamily: "Roboto,sans-serif" /* ff */,
    },
    body: { margin: 0 },
    button: {
        background: "none",
        color: "inherit",
        border: "none"
    },
    a: {
        color: "inherit",
        textDecoration: "none"
    },
    hr: {
        margin: 0,
        border: "none",
        borderLeft: "solid #0004 1px",
        borderTop: "solid #0004 1px",
    },
    input: {
        background: "inherit",
        color: "inherit",
        border: "none"
    },
    "*": {
        boxSizing: "border-box",
    },
    h1: { fontSize: "1.5em" },
    h2: { fontSize: "1.25em" },
    h3: { fontSize: "1.1em" },
    "._.off": { display: "none!important" },
    "._.row": { display: "flex", flexDirection: "row" },
    "._.col": { display: "flex", flexDirection: "column", ".fill": { flex: 1 } },
    "._.ph": { color: "#000A" },
    ["." + "_w" /* warning */]: { background: "#ffc107!important" },
}, tag));
exports.core = core;
const style = (p, tag) => (0, exports.core)(p, tag)(exports.icon)(exports.button)(dropdown)(select)(input)(exports.panel)(exports.modal)(exports.menu)(exports.menubar)(exports.menurow)(exports.table)(tab)(exports.index)(output)(exports.list)(exports.table)(mobImgSelector)(exports.stack);
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
    brd: (0, galho_1.rgba)(34, 36, 38, .15),
    bt: { n: "#73aae0", h: "#1976d2", a: "#1976d2", },
    in: { bg: "#fff", border: { n: (0, galho_1.rgba)(34, 36, 38, .15), a: (0, galho_1.rgb)(133, 183, 217) } },
    a: { n: "#1976d2", v: "#6a1b9a", a: "#0d47a1", h: "" },
};
/**full style,light theme */
const light = (tag) => (0, exports.style)(exports.lightTheme, tag);
exports.light = light;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBeUQ7QUFFekQsNENBQWtEO0FBQ2xELDBDQUE2RztBQXVDdEcsTUFBTSxJQUFJLEdBQUcsR0FBVyxFQUFFLENBQUMsQ0FBQztJQUNqQyxDQUFDLElBQUksY0FBTSxFQUFFLENBQUMsRUFBRTtRQUNkLE1BQU0sRUFBRSxLQUFLO1FBQ2IsYUFBYSxFQUFFLFFBQVE7UUFDdkIsTUFBTSxFQUFFO1lBQ04sTUFBTSxFQUFFLE1BQU07U0FDZjtRQUNELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxLQUFLO1NBQ2Q7S0FDRjtDQUNGLENBQUMsQ0FBQTtBQVhXLFFBQUEsSUFBSSxRQVdmO0FBQ0ssTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFZLEVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFJLENBQUMsSUFBSSxDQUFDO0lBQzVELE9BQU87SUFDUCxNQUFNLEVBQUU7UUFDTixLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzVCLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUM5QixTQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7S0FDOUI7SUFDRCxPQUFPLEVBQUU7UUFDUCxZQUFZLEVBQUUsOEJBQTJCLElBQUk7UUFDN0MsR0FBRyxJQUFBLGNBQUcsRUFBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLFVBQVUsRUFBRSxRQUFRO1FBQ3BCLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLFVB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