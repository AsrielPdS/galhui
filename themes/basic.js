import { css, rgb, rgba } from "galho";
import { bfg, border, box, spc, styleCtx } from "../style.js";
export const col = () => ({
    display: "flex",
    flexDirection: "column"
}), row = (inline) => ({
    display: inline ? "inline-flex" : "flex",
    flexDirection: "row"
}), center = () => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    translate: "-50% -50%",
}), min = (size) => `@media (min-width: ${size}px)`, max = (size) => `@media (max-width: ${size}px)`;
export const icon = () => ({
    [`.${"c" /* C.icon */}`]: {
        height: "1.2em",
        verticalAlign: "middle",
        "&.xl": {
            height: "10em",
        },
        "&.l": {
            height: "5em",
        }
    }
});
export const button = (ctx) => ctx(icon) && ({
    //style
    "._.a": {
        color: ctx.a.n,
        ":hover": { color: ctx.a.h },
        ":visited": { color: ctx.a.v },
        ":active": { color: ctx.a.a },
    },
    "._.bt": {
        borderRadius: 0.2 /* c.acentBordRad */ + "em",
        ...box([0, .25, 0, 0], [.78, 1.5]),
        whiteSpace: "nowrap",
        height: "initial",
        background: ctx.bt.n,
        ":hover": { background: ctx.bt.h },
        ":visited": { background: ctx.bt.v },
        ":active": { background: ctx.bt.a },
        ["&." + "full" /* C.full */]: { display: "block", width: "auto" },
        [`.${"c" /* C.icon */}`]: {
            marginRight: ".5em",
        },
        [`&.${"_a" /* Color.accept */}`]: {},
        [`&.${"_e" /* Color.error */}`]: {
            ...bfg(ctx.error, "#fff"),
            ":hover": {
            // background:""
            }
        },
        [`&.${"_i" /* Color.main */}`]: {},
        [`&.${"_s" /* Color.side */}`]: {},
        [`&.${"_w" /* Color.warning */}`]: {},
        [`&.${"c" /* C.icon */}>.${"c" /* C.icon */}`]: {
            marginRight: ".5rem",
            margin: "0 -.6em",
            // ":only-child": {},
        },
        ["&." + "l" /* Size.l */]: {
            height: "5em",
        },
        ["&." + "xl" /* Size.xl */]: {
            // minHeight: "10em",
            // minWidth: "12em",
            borderRadius: "1em",
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            [`.${"c" /* C.icon */}`]: {
                height: "7em",
            }
        }
    },
    ["." + "bs" /* C.buttons */]: {},
});
export function input(ctx) {
    let { bg, fg, border } = ctx.in;
    return {
        "textarea._.in": {
            height: "6em",
            resize: "vertical",
        },
        "._.in": {
            padding: ".6em 1em",
            display: "inline-flex",
            alignItems: "center",
            color: fg,
            background: bg,
            border: `1px solid ${border.n}`,
            borderRadius: 0.2 /* c.acentBordRad */ + "em",
            height: "2.4em",
            outline: "0",
            // "&.min>input:not(:focus)": {
            //   width: 0,
            // },
            ".bt": {
                height: "calc(100%  + 1.2em)",
                marginRight: "-1em",
                lineHeight: .2
            },
            ["." + "c" /* C.icon */]: {},
            ":focus-within": {
                borderColor: border.a,
            },
            input: {
                width: "100%",
                flex: "1 1",
                outline: "none",
                border: "none"
            },
            ["&." + "_e" /* Color.error */]: {
                borderColor: "#f44336",
            }
        }
    };
}
export function loader(ctx) {
    return {
        "._.load": {
            border: "10px solid #f3f3f3",
            borderRadius: "50%",
            borderTop: "10px solid #3498db",
            animation: "spin 1s cubic-bezier(0.46, 0.03, 0.52, 0.96) infinite",
            ...center(),
            width: "60px",
            height: "60px",
            "&.s": {
                width: "10px",
                height: "10px",
                borderWidth: "5px",
            },
            "&.l": {
                width: "120px",
                height: "120px",
                borderWidth: "16px",
            },
        },
        "@keyframes apin": {
            "0%": { transform: "rotate(0deg)", },
            "100%": { transform: "rotate(360deg)", }
        }
    };
}
export function output(ctx) {
    // let { a } = theme;
    return {
        "._.out": {
            borderRadius: 0.2 /* c.acentBordRad */ + "em",
            ...box([0, .3, 0, 0], [.4, .8]),
            background: "#d3e3f3",
            display: "inline-block",
            "tr&": {
                display: "table-row",
                td: {
                    padding: spc([.4, .8])
                }
            }
        },
        [`._.${"ms" /* C.message */}`]: {
            [`&.${"_e" /* Color.error */}`]: {
                ...bfg("rgb(255, 246, 246)", "rgb(159, 58, 56)" /* c.error */),
            },
            ...box([1, 0], [1, 1.5]),
            ":empty": { height: 0, padding: 0, margin: 0 },
            transition: "all .2s"
        },
        "._._.join": {
            ...row(true),
            //para os filhos não removerem bordas do parent
            overflow: "hidden",
            padding: 0,
            "*": {
                // border: "none",
                flex: "1 auto",
                margin: 0,
                borderRadius: 0,
                paddingLeft: ".5em",
                paddingRight: ".5em",
                width: "100%"
            },
            ">:not(:last-child)": {
                borderRight: `1px solid ${ctx.in.border.n}`,
            },
            ">:first-child": {
                paddingLeft: "1.5em",
                borderRadius: `${0.2 /* c.acentBordRad */}em 0 0 ${0.2 /* c.acentBordRad */}em`,
            },
            ">:last-child": {
                paddingRight: "1.5em",
                borderRadius: `0 ${0.2 /* c.acentBordRad */}em ${0.2 /* c.acentBordRad */}em 0`,
            },
        },
    };
}
export const menubar = ({ menu }) => ({
    "._.bar": {
        display: "flex",
        height: 2.4 /* c.menuH */ + "em",
        lineHeight: 2.4 /* c.menuH */ + "em",
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
            minWidth: "2.4em",
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
            border: "none",
            minWidth: 0,
            padding: 0,
            flex: "1"
        },
        hr: {
            height: "100%",
            margin: 0,
            minWidth: 0,
            padding: 0
        },
        "&.main": {
            background: "#9eb6c0",
            height: 2.8 /* c.tabH */ + "em",
            paddingTop: ".3em",
            ".i:active,.i.on": {
                background: menu,
                borderRadius: ".3em .3em 0 0"
            }
        }
    },
});
export const menu = ({ menu, disabled }) => ({
    "._.menu": {
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
            "._.hr": {
                border: "none",
                borderBottom: border("#000"),
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
                [`&.${"div" /* C.separator */}`]: {
                    borderBottom: "solid 1px #000"
                }
            },
            ".i,.dd": {
                cursor: "pointer",
                ":hover": {
                    background: "#acc5cf",
                },
                "&.on": {
                    background: "#acc5cf",
                },
                ["&." + "ds" /* C.disabled */]: {
                    background: disabled,
                },
            },
            [`.${"_e" /* Color.error */}`]: {
                background: "#e53935", color: "#fff",
                ":hover": { background: "#ef5350" },
            }
        },
        // display: "table",  
    },
    ".menu-c": { background: menu },
});
export const tip = ({ menu }) => ({
    "._.tip": {
        position: "fixed",
        background: menu,
        padding: ".7em 1em",
        zIndex: 6 /* zIndex.tip */,
        borderRadius: ".5em",
        boxShadow: "0 0 5px 1px #0004",
        "&.panel>.ft": {
            padding: 0,
            height: "unset",
            background: "inherit"
        }
    }
});
export const menurow = ({ menu }) => ({
    "._.menurow": {
        background: menu,
        lineHeight: 2.4 /* c.menuH */ + "em",
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
    },
});
export const panel = (ctx) => ({
    "._.panel": {
        // display: "flex",
        // flexDirection: "column",
        position: "relative",
        textAlign: "start",
        overflow: "hidden",
        background: ctx.bg,
        ["." + "cl" /* C.close */]: {
            position: "absolute",
            right: ".4rem",
            top: ".1rem",
            fontSize: "14pt",
            // color: "#f44",
        },
        ".hd": {
            margin: 0,
            height: "2.2em",
            fontSize: "inherit",
            padding: ".4em 2em",
            background: "#cfd8dc",
            "&:empty": { display: "none" },
            "&.bar": {
                padding: ".1em 2em",
            }
            // height:"unset"
        },
        ".bd": {
            padding: ".2em 1em",
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
            ".spc": {
                border: "none", margin: "auto"
            },
            hr: {
                border: "none",
                margin: "auto"
            },
            // ".field": {
            //   position: "relative",
            //   label: {
            //     top: "-8px",
            //     border: "1px solid #0000005c",
            //     background: "#fff",
            //     padding: "1px 2px",
            //     borderRadius: "3px",
            //     fontSize: "smaller",
            //     position: "absolute",
            //     zIndex: zIndex.modal, 
            //     left: "5px",
            //   },
            //   ".in": { marginRight: "10px" }
            // }
        },
    },
    [min(1024 /* ScreenSize.laptop */)]: {
        "._.panel": {
            ".bd": {
                padding: ".5em 1.7em",
            }
        }
    },
});
export const modal = (ctx) => ctx(button)(panel) && {
    [`._.${"blank" /* C.modalArea */}`]: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#0004",
        zIndex: 3 /* zIndex.modalArea */,
        overflow: "auto",
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "center",
        // padding: spc(1, "rem"),
    },
    "._.modal": {
        // ...box(0, 0),
        zIndex: 4 /* zIndex.modal */,
        borderRadius: ".4em",
        width: "calc(100% - 1em)",
        height: "calc(100% - 1em)",
        margin: ".5em",
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
    [min(768 /* ScreenSize.tablet */)]: {
        "._.modal": {
            width: "55%",
            maxWidth: (768 /* ScreenSize.tablet */ - 20) + "px",
            margin: "3em auto",
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
                width: "40%"
            },
            "&.xs": {
                width: "31%",
                maxWidth: "360px"
            },
        },
    },
    [min(1024 /* ScreenSize.laptop */)]: {},
    "._.side": {
        ...col(),
        height: "100%",
        width: "85%",
        background: ctx.bg,
        position: "relative",
        ".hd": {
            margin: 0,
            padding: ".8em",
            background: "#cfd8dc",
            borderBottom: "1px solid #0006"
        },
        ".bd": {
            flex: 1,
        }
    }
};
export const index = (ctx) => ({
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
export const listHelper = (_) => ({
    background: _.n,
});
export const listItem = ({ h, a, v }) => ({
    ":hover": {
        background: h,
    },
    "&.on": {
        background: v,
    },
    ["&." + "crt" /* C.current */]: {
        boxShadow: `inset 0 0 1px 2px ${a}`
    }
});
export const list = ({ brd, list: l }) => ({
    "._.list": {
        width: "100%",
        // height: "300px",
        padding: 0,
        margin: 0,
        overflow: "hidden scroll",
        ...listHelper(l),
        counterReset: "l",
        ".i": {
            minHeight: "1.2em",
            ...row(),
            margin: "1px 0 0",
            ...listItem(l),
            borderBottom: "solid 1px #0004",
            counterIncrement: "l",
            ["." + "sd" /* C.side */]: {
                flex: "0 0 2em",
                // display: "inline-block",
                padding: ".4em .2em",
                borderRight: border(brd),
                ":empty::before": { content: 'counter(l)', },
            },
            // ".bd": {
            //   flex: 1,
            //   // display: "inline-block",
            //   padding: ".6em .4em"
            // },
            // ["." + C.options]: {
            //   borderLeft: border(brd),
            // },
        },
        // tfoot: { position: "sticky", bottom: 0, background: "#fff" }
    },
    //   "._.card": {
    //     display: "grid!important",
    //     gridTemplateColumns: "40px",
    //     gridTemplateAreas: `
    // "s m o" 
    // "s e o"`,
    //     ".bd": { gridArea: "m", },
    //     ".sd": { gridArea: "s", marginRight: ".8em" },
    //     ".ed": {
    //       borderSpacing: "0 3px",
    //       gridArea: "e",
    //       tr: { background: "#d3e3f3", td: { padding: ".5em" } },
    //       fontSize: "smaller",
    //     },
    //     paddingBottom: ".6rem"
    //   }
});
export const table = ({ menu, fg, list: l, brd }) => ({
    "._.tb": {
        padding: 0,
        outline: "none",
        position: "relative",
        overflow: "auto scroll",
        ...listHelper(l),
        counterReset: "tb",
        //line
        "*": {
            display: "flex",
            flexDirection: "row",
            height: "2em",
            whiteSpace: "nowrap",
            ".opts": {
                position: "absolute",
                right: 0,
            },
            //cell
            "*": {
                // display: "inline-block",
                padding: `${0.3 /* c.acentVPad */}em ${0.4 /* c.acentHPad */}em`,
                borderRadius: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                margin: 0,
                height: "100%",
                border: "none",
                borderRight: border(brd),
                borderBottom: border(brd),
                flexShrink: 0,
            },
            ["." + "sd" /* C.side */]: {
                flex: "0 0 2em"
            }
        },
        ".i": {
            ...listItem(l),
            counterIncrement: "tb",
            [`.${"sd" /* C.side */}:empty::before`]: {
                content: 'counter(tb)',
            },
        },
        ".hd": {
            height: "2em",
            zIndex: 1 /* zIndex.front */,
            background: menu,
            fontWeight: 500,
            minWidth: "fit-content",
            position: "sticky",
            top: 0,
            //cell
            ".i": {
                position: "relative",
                ["." + "dd" /* C.dropdown */]: {
                    position: "absolute",
                    lineHeight: "2em",
                    right: "4px",
                    top: 0,
                    borderLeft: `solid 1px rgba(34, 36, 38, .15)`,
                    height: "100%"
                },
                ["." + "div" /* C.separator */]: {
                    cursor: "col-resize",
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: "4px",
                    zIndex: 1 /* zIndex.front */,
                    height: "100%",
                },
            },
        },
        ["&." + "brd" /* C.bordered */]: {
            ["." + "hd" /* C.head */]: {
                //cell
                ["." + "i" /* C.item */]: {
                    border: `1px solid ${fg}`
                },
                [">:not(:first-child)"]: {
                    borderLeft: "none"
                },
                ["." + "sd" /* C.side */]: {
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
export function form(ctx) {
    ctx(input);
    return {
        "._.form": {
            position: "relative",
            minHeight: 0,
            overflowY: "auto",
            ":not(.expand)>.sd": { display: "none" },
            "&.expand>._sd": { display: "none" },
            padding: "1rem",
            //outline input 
            "._.oi": {
                margin: `.8rem 0`,
                ".hd": {
                    display: "block",
                    marginBottom: ".6em",
                    overflow: "hidden",
                    whiteSpace: "nowrap"
                },
                ".bd": {
                    // margin: ".5rem .7rem",
                    flex: "1 0",
                    width: "100%",
                },
                ".req": {
                    lineHeight: 0.6,
                    textShadow: "0.5px 0 #fff, -0.5px 0 #fff, 0 0.5px #fff, 0 -0.5px #fff",
                    position: "absolute",
                    right: ".7em"
                },
                "&[edited]>.hd": { fontWeight: "bold" }
            },
            //input inline
            "._.ii": {
                marginBottom: ".6em",
                ".hd": {
                    display: "inline-block",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    width: "40%",
                    margin: 0,
                    textAlign: "end",
                    paddingRight: ".6em"
                },
                "&[edited]>.hd": { fontWeight: "bold" },
                ".bd": {
                    margin: 0,
                    width: "60%",
                },
                ".req": {
                    lineHeight: 0.6,
                    position: "absolute",
                    right: ".7em"
                },
            },
            [`.${"ms" /* C.message */}.${"_e" /* Color.error */}`]: {
                position: "sticky",
                bottom: 0,
            }
        },
        "._.form-g": {
            "*": { width: "100%" }
        },
    };
}
export function tab({ menu }) {
    return {
        "._.tab": {
            ...col(),
            "._.bar": {
                background: menu,
                [`._.${"cl" /* C.close */}`]: {
                    float: "right",
                    opacity: 0,
                    height: 2.4 /* c.menuH */ + "rem",
                    ":hover": {}
                },
                ":hover": {
                    [`._.${"cl" /* C.close */}`]: {
                        opacity: 1
                    },
                }
            },
            ["." + "bd" /* C.body */]: {
                height: `calc(100% - ${2.4 /* c.menuH */}px)`
            }
        }
    };
}
export function mobImgSelector(ctx) {
    ctx(button);
    return {
        "._.img-in": {
            position: "relative",
            display: "flex",
            ".cl": {
                position: "absolute",
                right: ".4rem",
                top: ".1rem",
            },
            img: {
                maxWidth: "100%",
                maxHeight: "100%",
            },
            button: {
                width: "calc(100% - 2em)",
                height: "calc(100% - 2em)",
                border: "7px dashed #656565",
                margin: "1em",
                opacity: .7,
                ":hover": {
                    background: "#1113"
                }
            }
        },
        [`._.${"fileSelector" /* C.fileSelector */}`]: {
            input: { display: "none" }
        },
        "._.imgsel": {
            position: "relative",
            textAlign: "center",
            width: "12em",
            margin: "auto",
            input: {
                display: "none",
            },
            ["." + "bt" /* C.button */]: {
                margin: 0,
                width: "40px",
                height: "40px",
                borderRadius: "20px",
                position: "absolute",
                right: 0,
                bottom: 0
            },
            ["." + "bd" /* C.body */]: {
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
export function accordion() {
    return {
        "._.ac": {
            ["." + "bd" /* C.body */]: {
                display: "none"
            },
            ["." + "hd" /* C.head */]: {
                [`&.${"on" /* C.on */}+.${"bd" /* C.body */}`]: {
                    display: "block"
                },
            },
        }
    };
}
export function dropdown(ctx) {
    ctx(menu);
    return {
        "._.dd": {
            display: "inline-block",
            ["." + "menu" /* C.menu */]: {
                position: "fixed",
                zIndex: 5 /* zIndex.ctxMenu */
            },
            ["." + "c" /* C.icon */]: {
                margin: "0 .4em"
            }
        }
    };
}
export function select(add) {
    add(menu);
    return {
        [`._.${"sel" /* C.select */}`]: {
            minWidth: "10em",
            position: "relative",
            display: "inline-block",
            overflow: "hidden",
            // ["." + C.side]: {
            //   float: "right"
            // },
            ".bd": {
                width: `calc(100% - 1rem)`,
                display: "inline-flex",
                margin: 0, padding: 0,
                whiteSpace: "normal",
                background: "inherit",
                outline: "none",
                border: "none",
                ["." + "cl" /* C.close */]: {
                    marginLeft: "auto"
                }
            },
            ".menu": {
                maxWidth: "unset",
                position: "fixed",
                overflow: "hidden auto",
                zIndex: 5 /* zIndex.ctxMenu */
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
export const stack = ({ brd }) => ({
    "._.stack": {
        // height: "100%",
        display: "flex",
        hr: {
            flex: "0 0",
            border: "none",
        },
        "&.h": {
            hr: { borderLeft: border(brd, 4), },
        },
        "&.v": {
            flexDirection: "column",
            hr: { borderTop: border(brd, 4), },
        },
        "*": { margin: 0, borderRadius: 0 }
    },
});
export const core = (p, tag = css({})) => styleCtx(p)({
    html: {
        // fontSize: consts.rem + "px",
        fontFamily: "Roboto,sans-serif" /* c.ff */,
    },
    body: { margin: 0 },
    button: {
        background: "none",
        color: "inherit",
        border: "none",
        fontSize: "inherit",
        fontFamily: "inherit",
    },
    a: {
        color: "inherit",
        textDecoration: "none"
    },
    hr: {
        borderStyle: "solid",
        // margin: 0,
        // border: "none",
        // borderLeft: "solid #0004 1px",
        // borderTop: "solid #0004 1px",
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
    "._.corner": {
        position: "absolute",
        right: ".4em",
        top: ".1em",
    },
    "._.off": { display: "none!important" },
    "._.row": row(),
    "._.col": col(),
    "._.center": center(),
    "._.ph": { color: "#000A" },
    ["." + "_w" /* Color.warning */]: { background: "#ffc107!important" },
});
export const style = (p) => core(p)(icon)(menu)(button)(dropdown)(select)(input)(panel)(modal)(menubar)(menurow)(table)(tab)(index)(output)(list)(table)(mobImgSelector)(stack)(loader)(form)(tip);
/**full style,dark theme */
export const darkTheme = {
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
export const dark = () => style(darkTheme);
export const lightTheme = {
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
    brd: rgba(34, 36, 38, .15),
    bt: { n: "#73aae0", h: "#1976d2", a: "#1976d2", },
    in: { bg: "#fff", border: { n: rgba(34, 36, 38, .15), a: rgb(133, 183, 217) } },
    a: { n: "#1976d2", v: "#6a1b9a", a: "#0d47a1", h: "" },
};
/**full style,light theme */
export const light = () => style(lightTheme);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQWlCLE1BQU0sT0FBTyxDQUFDO0FBR3RELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFZLE1BQU0sYUFBYSxDQUFDO0FBdUJ4RSxNQUFNLENBQUMsTUFDTCxHQUFHLEdBQUcsR0FBVSxFQUFFLENBQUMsQ0FBQztJQUNsQixPQUFPLEVBQUUsTUFBTTtJQUNmLGFBQWEsRUFBRSxRQUFRO0NBQ3hCLENBQUMsRUFDRixHQUFHLEdBQUcsQ0FBQyxNQUFhLEVBQVMsRUFBRSxDQUFDLENBQUM7SUFDL0IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNO0lBQ3hDLGFBQWEsRUFBRSxLQUFLO0NBQ3JCLENBQUMsRUFDRixNQUFNLEdBQUcsR0FBVSxFQUFFLENBQUMsQ0FBQztJQUNyQixRQUFRLEVBQUUsVUFBVTtJQUNwQixJQUFJLEVBQUUsS0FBSztJQUNYLEdBQUcsRUFBRSxLQUFLO0lBQ1YsU0FBUyxFQUFFLFdBQVc7Q0FDdkIsQ0FBQyxFQUNGLEdBQUcsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsc0JBQXNCLElBQUksS0FBSyxFQUNwRCxHQUFHLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixJQUFJLEtBQUssQ0FBQztBQXFDdkQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDLENBQUM7SUFDakMsQ0FBQyxJQUFJLGdCQUFNLEVBQUUsQ0FBQyxFQUFFO1FBQ2QsTUFBTSxFQUFFLE9BQU87UUFDZixhQUFhLEVBQUUsUUFBUTtRQUN2QixNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsTUFBTTtTQUNmO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLEtBQUs7U0FDZDtLQUNGO0NBQ0YsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBWSxFQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUM1RCxPQUFPO0lBQ1AsTUFBTSxFQUFFO1FBQ04sS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUM1QixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDOUIsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0tBQzlCO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsWUFBWSxFQUFFLDJCQUFpQixJQUFJO1FBQ25DLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbEMsVUFBVSxFQUFFLFFBQVE7UUFDcEIsTUFBTSxFQUFFLFNBQVM7UUFDakIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQixRQUFRLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7UUFDbEMsVUFBVSxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO1FBQ3BDLFNBQVMsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtRQUVuQyxDQUFDLElBQUksc0JBQVMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO1FBRXBELENBQUMsSUFBSSxnQkFBTSxFQUFFLENBQUMsRUFBRTtZQUNkLFdBQVcsRUFBRSxNQUFNO1NBQ3BCO1FBQ0QsQ0FBQyxLQUFLLHVCQUFZLEVBQUUsQ0FBQyxFQUFFLEVBRXRCO1FBQ0QsQ0FBQyxLQUFLLHNCQUFXLEVBQUUsQ0FBQyxFQUFFO1lBQ3BCLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO1lBQ3pCLFFBQVEsRUFBRTtZQUNSLGdCQUFnQjthQUNqQjtTQUNGO1FBQ0QsQ0FBQyxLQUFLLHFCQUFVLEVBQUUsQ0FBQyxFQUFFLEVBRXBCO1FBQ0QsQ0FBQyxLQUFLLHFCQUFVLEVBQUUsQ0FBQyxFQUFFLEVBRXBCO1FBQ0QsQ0FBQyxLQUFLLHdCQUFhLEVBQUUsQ0FBQyxFQUFFLEVBRXZCO1FBQ0QsQ0FBQyxLQUFLLGdCQUFNLEtBQUssZ0JBQU0sRUFBRSxDQUFDLEVBQUU7WUFDMUIsV0FBVyxFQUFFLE9BQU87WUFDcEIsTUFBTSxFQUFFLFNBQVM7WUFDakIscUJBQXFCO1NBQ3RCO1FBQ0QsQ0FBQyxJQUFJLG1CQUFTLENBQUMsRUFBRTtZQUNmLE1BQU0sRUFBRSxLQUFLO1NBQ2Q7UUFDRCxDQUFDLElBQUkscUJBQVUsQ0FBQyxFQUFFO1lBQ2hCLHFCQUFxQjtZQUNyQixvQkFBb0I7WUFDcEIsWUFBWSxFQUFFLEtBQUs7WUFDbkIsT0FBTyxFQUFFLGFBQWE7WUFDdEIsYUFBYSxFQUFFLFFBQVE7WUFDdkIsVUFBVSxFQUFFLFFBQVE7WUFDcEIsY0FBYyxFQUFFLFFBQVE7WUFDeEIsQ0FBQyxJQUFJLGdCQUFNLEVBQUUsQ0FBQyxFQUFFO2dCQUNkLE1BQU0sRUFBRSxLQUFLO2FBQ2Q7U0FDRjtLQUNGO0lBQ0QsQ0FBQyxHQUFHLHVCQUFZLENBQUMsRUFBRSxFQUVsQjtDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBWTtJQUNoQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO0lBQ2hDLE9BQU87UUFDTCxlQUFlLEVBQUU7WUFDZixNQUFNLEVBQUUsS0FBSztZQUNiLE1BQU0sRUFBRSxVQUFVO1NBQ25CO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLFVBQVU7WUFDbkIsT0FBTyxFQUFFLGFBQWE7WUFDdEIsVUFBVSxFQUFFLFFBQVE7WUFDcEIsS0FBSyxFQUFFLEVBQUU7WUFDVCxVQUFVLEVBQUUsRUFBRTtZQUNkLE1BQU0sRUFBRSxhQUFhLE1BQU0sQ0FBQyxDQUFDLEVBQUU7WUFDL0IsWUFBWSxFQUFFLDJCQUFpQixJQUFJO1lBQ25DLE1BQU0sRUFBRSxPQUFPO1lBQ2YsT0FBTyxFQUFFLEdBQUc7WUFDWiwrQkFBK0I7WUFDL0IsY0FBYztZQUNkLEtBQUs7WUFDTCxLQUFLLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLHFCQUFxQjtnQkFDN0IsV0FBVyxFQUFFLE1BQU07Z0JBQ25CLFVBQVUsRUFBRSxFQUFFO2FBQ2Y7WUFDRCxDQUFDLEdBQUcsbUJBQVMsQ0FBQyxFQUFFLEVBRWY7WUFDRCxlQUFlLEVBQUU7Z0JBQ2YsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ3RCO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxNQUFNO2dCQUNiLElBQUksRUFBRSxLQUFLO2dCQUNYLE9BQU8sRUFBRSxNQUFNO2dCQUNmLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7WUFDRCxDQUFDLElBQUkseUJBQWMsQ0FBQyxFQUFFO2dCQUNwQixXQUFXLEVBQUUsU0FBUzthQUN2QjtTQUNGO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFDRCxNQUFNLFVBQVUsTUFBTSxDQUFDLEdBQVk7SUFDakMsT0FBTztRQUNMLFNBQVMsRUFBRTtZQUNULE1BQU0sRUFBRSxvQkFBb0I7WUFDNUIsWUFBWSxFQUFFLEtBQUs7WUFDbkIsU0FBUyxFQUFFLG9CQUFvQjtZQUMvQixTQUFTLEVBQUUsdURBQXVEO1lBQ2xFLEdBQUcsTUFBTSxFQUFFO1lBQ1gsS0FBSyxFQUFFLE1BQU07WUFDYixNQUFNLEVBQUUsTUFBTTtZQUNkLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsTUFBTTtnQkFDYixNQUFNLEVBQUUsTUFBTTtnQkFDZCxXQUFXLEVBQUUsS0FBSzthQUNuQjtZQUNELEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsT0FBTztnQkFDZCxNQUFNLEVBQUUsT0FBTztnQkFDZixXQUFXLEVBQUUsTUFBTTthQUNwQjtTQUNGO1FBQ0QsaUJBQWlCLEVBQUU7WUFDakIsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLGNBQWMsR0FBRztZQUNwQyxNQUFNLEVBQUUsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEdBQUc7U0FDekM7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQUNELE1BQU0sVUFBVSxNQUFNLENBQUMsR0FBWTtJQUNqQyxxQkFBcUI7SUFDckIsT0FBTztRQUNMLFFBQVEsRUFBRTtZQUNSLFlBQVksRUFBRSwyQkFBaUIsSUFBSTtZQUNuQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9CLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLEtBQUssRUFBRTtnQkFDTCxPQUFPLEVBQUUsV0FBVztnQkFDcEIsRUFBRSxFQUFFO29CQUNGLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7aUJBQ3ZCO2FBQ0Y7U0FDRjtRQUNELENBQUMsTUFBTSxvQkFBUyxFQUFFLENBQUMsRUFBRTtZQUNuQixDQUFDLEtBQUssc0JBQVcsRUFBRSxDQUFDLEVBQUU7Z0JBQ3BCLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixtQ0FBVTthQUN0QztZQUNELEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO1lBQzlDLFVBQVUsRUFBRSxTQUFTO1NBQ3RCO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ1osK0NBQStDO1lBQy9DLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLE9BQU8sRUFBRSxDQUFDO1lBQ1YsR0FBRyxFQUFFO2dCQUNILGtCQUFrQjtnQkFDbEIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsWUFBWSxFQUFFLENBQUM7Z0JBQ2YsV0FBVyxFQUFFLE1BQU07Z0JBQ25CLFlBQVksRUFBRSxNQUFNO2dCQUNwQixLQUFLLEVBQUUsTUFBTTthQUNkO1lBQ0Qsb0JBQW9CLEVBQUU7Z0JBQ3BCLFdBQVcsRUFBRSxhQUFhLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTthQUM1QztZQUNELGVBQWUsRUFBRTtnQkFDZixXQUFXLEVBQUUsT0FBTztnQkFDcEIsWUFBWSxFQUFFLEdBQUcsd0JBQWMsVUFBVSx3QkFBYyxJQUFJO2FBQzVEO1lBQ0QsY0FBYyxFQUFFO2dCQUNkLFlBQVksRUFBRSxPQUFPO2dCQUNyQixZQUFZLEVBQUUsS0FBSyx3QkFBYyxNQUFNLHdCQUFjLE1BQU07YUFDNUQ7U0FDRjtLQUNGLENBQUE7QUFDSCxDQUFDO0FBQ0QsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQVcsRUFBVSxFQUFFLENBQUMsQ0FBQztJQUNyRCxRQUFRLEVBQUU7UUFDUixPQUFPLEVBQUUsTUFBTTtRQUNmLE1BQU0sRUFBRSxvQkFBVSxJQUFJO1FBQ3RCLFVBQVUsRUFBRSxvQkFBVSxJQUFJO1FBQzFCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLElBQUksRUFBRSxVQUFVO1FBQ2hCLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFVBQVUsRUFBRSxRQUFRO1FBQ3BCLFFBQVEsRUFBRTtZQUNSLEdBQUcsRUFBRTtnQkFDSCxJQUFJLEVBQUUsQ0FBQzthQUNSO1NBQ0Y7UUFDRCxHQUFHLEVBQUU7WUFDSCxTQUFTLEVBQUUsQ0FBQztZQUNaLFlBQVksRUFBRSxDQUFDO1lBQ2YsTUFBTSxFQUFFLE1BQU07WUFDZCxNQUFNLEVBQUUsUUFBUTtZQUNoQixPQUFPLEVBQUUsUUFBUTtZQUNqQixRQUFRLEVBQUUsT0FBTztZQUNqQixNQUFNLEVBQUUsTUFBTTtZQUNkLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFlBQVksRUFBRSxVQUFVO1lBQ3hCLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtTQUN2QztRQUNELFlBQVksRUFBRTtZQUNaLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLFFBQVEsRUFBRTtnQkFDUixVQUFVLEVBQUUsU0FBUzthQUN0QjtZQUNELGNBQWMsRUFBRTtnQkFDZCxVQUFVLEVBQUUsU0FBUzthQUN0QjtTQUNGO1FBQ0QsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRTtRQUMxQixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsTUFBTTtZQUNkLFFBQVEsRUFBRSxDQUFDO1lBQ1gsT0FBTyxFQUFFLENBQUM7WUFDVixJQUFJLEVBQUUsR0FBRztTQUNWO1FBQ0QsRUFBRSxFQUFFO1lBQ0YsTUFBTSxFQUFFLE1BQU07WUFDZCxNQUFNLEVBQUUsQ0FBQztZQUNULFFBQVEsRUFBRSxDQUFDO1lBQ1gsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELFFBQVEsRUFBRTtZQUNSLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLE1BQU0sRUFBRSxtQkFBUyxJQUFJO1lBQ3JCLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLGlCQUFpQixFQUFFO2dCQUNqQixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsWUFBWSxFQUFFLGVBQWU7YUFDOUI7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFXLEVBQVUsRUFBRSxDQUFDLENBQUM7SUFDNUQsU0FBUyxFQUFFO1FBQ1QsVUFBVSxFQUFFLElBQUk7UUFDaEIsT0FBTyxFQUFFLE1BQU07UUFDZixRQUFRLEVBQUUsT0FBTztRQUNqQixRQUFRLEVBQUUsTUFBTTtRQUNoQixRQUFRLEVBQUUsTUFBTTtRQUNoQixTQUFTLEVBQUUsd0JBQXdCO1FBQ25DLFlBQVksRUFBRSxPQUFPO1FBQ3JCLE9BQU8sRUFBRSxXQUFXO1FBQ3BCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLEtBQUssRUFBRTtZQUNMLEtBQUssRUFBRSxNQUFNO1lBQ2IsY0FBYyxFQUFFLFVBQVU7WUFDMUIsT0FBTyxFQUFFO2dCQUNQLE1BQU0sRUFBRSxNQUFNO2dCQUNkLFlBQVksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDO2FBQzdCO1lBQ0QsRUFBRSxFQUFFO2dCQUNGLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixVQUFVLEVBQUUsU0FBUztnQkFDckIsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLE9BQU8sRUFBRSxTQUFTO2dCQUNsQixrQkFBa0I7Z0JBQ2xCLEVBQUUsRUFBRTtvQkFDRixNQUFNO29CQUNOLGVBQWUsRUFBRTt3QkFDZixLQUFLLEVBQUUsUUFBUTtxQkFDaEI7b0JBQ0QsY0FBYztvQkFDZCxlQUFlLEVBQUU7d0JBQ2YsT0FBTyxFQUFFLE9BQU87cUJBQ2pCO29CQUNELFVBQVU7b0JBQ1YsZUFBZSxFQUFFO3dCQUNmLFdBQVcsRUFBRSxNQUFNO3dCQUNuQixPQUFPLEVBQUUsRUFBRTt3QkFDWCxTQUFTLEVBQUUsS0FBSztxQkFDakI7b0JBQ0QsY0FBYztvQkFDZCxlQUFlLEVBQUU7d0JBQ2YsS0FBSyxFQUFFLE9BQU87cUJBQ2Y7aUJBQ0Y7Z0JBQ0QsQ0FBQyxLQUFLLHVCQUFXLEVBQUUsQ0FBQyxFQUFFO29CQUNwQixZQUFZLEVBQUUsZ0JBQWdCO2lCQUMvQjthQUNGO1lBRUQsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixRQUFRLEVBQUU7b0JBQ1IsVUFBVSxFQUFFLFNBQVM7aUJBQ3RCO2dCQUNELE1BQU0sRUFBRTtvQkFDTixVQUFVLEVBQUUsU0FBUztpQkFDdEI7Z0JBQ0QsQ0FBQyxJQUFJLHdCQUFhLENBQUMsRUFBRTtvQkFDbkIsVUFBVSxFQUFFLFFBQVE7aUJBQ3JCO2FBQ0Y7WUFDRCxDQUFDLElBQUksc0JBQVcsRUFBRSxDQUFDLEVBQUU7Z0JBQ25CLFVBQVUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU07Z0JBQ3BDLFFBQVEsRUFBRSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUU7YUFDcEM7U0FDRjtRQUNELHNCQUFzQjtLQUN2QjtJQUNELFNBQVMsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7Q0FDaEMsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQVcsRUFBVSxFQUFFLENBQUMsQ0FBQztJQUNqRCxRQUFRLEVBQUU7UUFDUixRQUFRLEVBQUUsT0FBTztRQUNqQixVQUFVLEVBQUUsSUFBSTtRQUNoQixPQUFPLEVBQUUsVUFBVTtRQUNuQixNQUFNLG9CQUFZO1FBQ2xCLFlBQVksRUFBRSxNQUFNO1FBQ3BCLFNBQVMsRUFBRSxtQkFBbUI7UUFDOUIsYUFBYSxFQUFFO1lBQ2IsT0FBTyxFQUFFLENBQUM7WUFDVixNQUFNLEVBQUUsT0FBTztZQUNmLFVBQVUsRUFBRSxTQUFTO1NBQ3RCO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLFlBQVksRUFBRTtRQUNaLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFVBQVUsRUFBRSxvQkFBVSxJQUFJO1FBQzFCLElBQUksRUFBRTtZQUNKLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFFBQVEsRUFBRTtnQkFDUixVQUFVLEVBQUUsU0FBUzthQUN0QjtZQUNELGNBQWMsRUFBRTtnQkFDZCxVQUFVLEVBQUUsU0FBUzthQUN0QjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFZLEVBQVUsRUFBRSxDQUFDLENBQUM7SUFDOUMsVUFBVSxFQUFFO1FBQ1YsbUJBQW1CO1FBQ25CLDJCQUEyQjtRQUMzQixRQUFRLEVBQUUsVUFBVTtRQUNwQixTQUFTLEVBQUUsT0FBTztRQUNsQixRQUFRLEVBQUUsUUFBUTtRQUNsQixVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUU7UUFDbEIsQ0FBQyxHQUFHLHFCQUFVLENBQUMsRUFBRTtZQUNmLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLEtBQUssRUFBRSxPQUFPO1lBQ2QsR0FBRyxFQUFFLE9BQU87WUFDWixRQUFRLEVBQUUsTUFBTTtZQUNoQixpQkFBaUI7U0FDbEI7UUFDRCxLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsQ0FBQztZQUNULE1BQU0sRUFBRSxPQUFPO1lBQ2YsUUFBUSxFQUFFLFNBQVM7WUFDbkIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsVUFBVSxFQUFFLFNBQVM7WUFDckIsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtZQUM5QixPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLFVBQVU7YUFDcEI7WUFDRCxpQkFBaUI7U0FDbEI7UUFDRCxLQUFLLEVBQUU7WUFDTCxPQUFPLEVBQUUsVUFBVTtZQUNuQixRQUFRLEVBQUUsTUFBTTtZQUNoQixNQUFNLEVBQUUsb0JBQW9CO1lBQzVCLGNBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxPQUFPLEdBQUc7U0FDekM7UUFDRCxTQUFTLEVBQUU7WUFDVCxNQUFNLEVBQUUsa0JBQWtCO1NBQzNCO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLE9BQU87WUFDZixPQUFPLEVBQUUsTUFBTTtZQUNmLGFBQWEsRUFBRSxhQUFhO1lBQzVCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLE1BQU0sRUFBRTtnQkFDTixNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO2FBQy9CO1lBQ0QsRUFBRSxFQUFFO2dCQUNGLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7WUFDRCxjQUFjO1lBRWQsMEJBQTBCO1lBQzFCLGFBQWE7WUFDYixtQkFBbUI7WUFDbkIscUNBQXFDO1lBQ3JDLDBCQUEwQjtZQUMxQiwwQkFBMEI7WUFDMUIsMkJBQTJCO1lBQzNCLDJCQUEyQjtZQUMzQiw0QkFBNEI7WUFDNUIsNkJBQTZCO1lBQzdCLG1CQUFtQjtZQUNuQixPQUFPO1lBQ1AsbUNBQW1DO1lBQ25DLElBQUk7U0FDTDtLQUNGO0lBQ0QsQ0FBQyxHQUFHLDhCQUFtQixDQUFDLEVBQUU7UUFDeEIsVUFBVSxFQUFFO1lBQ1YsS0FBSyxFQUFFO2dCQUNMLE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQTtBQUNGLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQVksRUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJO0lBQ25FLENBQUMsTUFBTSx5QkFBVyxFQUFFLENBQUMsRUFBRTtRQUNyQixRQUFRLEVBQUUsT0FBTztRQUNqQixHQUFHLEVBQUUsQ0FBQztRQUNOLElBQUksRUFBRSxDQUFDO1FBQ1AsS0FBSyxFQUFFLE1BQU07UUFDYixNQUFNLEVBQUUsTUFBTTtRQUNkLFVBQVUsRUFBRSxPQUFPO1FBQ25CLE1BQU0sMEJBQWtCO1FBQ3hCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLG1CQUFtQjtRQUNuQiwyQkFBMkI7UUFDM0Isd0JBQXdCO1FBQ3hCLDRCQUE0QjtRQUM1QiwwQkFBMEI7S0FDM0I7SUFDRCxVQUFVLEVBQUU7UUFDVixnQkFBZ0I7UUFDaEIsTUFBTSxzQkFBYztRQUNwQixZQUFZLEVBQUUsTUFBTTtRQUNwQixLQUFLLEVBQUUsa0JBQWtCO1FBQ3pCLE1BQU0sRUFBRSxrQkFBa0I7UUFDMUIsTUFBTSxFQUFFLE1BQU07UUFDZCxVQUFVLEVBQUUsRUFBRTtRQUNkLFVBQVUsRUFBRSxFQUFFO1FBQ2QsV0FBVztRQUNYLDRCQUE0QjtRQUM1QixLQUFLO1FBQ0wsV0FBVztRQUNYLEtBQUs7UUFDTCxXQUFXO1FBQ1gsMEJBQTBCO1FBQzFCLElBQUk7S0FDTDtJQUNELENBQUMsR0FBRyw2QkFBbUIsQ0FBQyxFQUFFO1FBQ3hCLFVBQVUsRUFBRTtZQUNWLEtBQUssRUFBRSxLQUFLO1lBQ1osUUFBUSxFQUFFLENBQUMsOEJBQW9CLEVBQUUsQ0FBQyxHQUFHLElBQUk7WUFDekMsTUFBTSxFQUFFLFVBQVU7WUFDbEIsTUFBTSxFQUFFLE9BQU87WUFDZixpQkFBaUI7WUFDakIsTUFBTSxFQUFFO2dCQUNOLEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLE1BQU0sRUFBRSxtQkFBbUI7Z0JBQzNCLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixRQUFRLEVBQUUsT0FBTzthQUNsQjtZQUNELEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsS0FBSztnQkFDWixRQUFRLEVBQUUsUUFBUTthQUNuQjtZQUNELEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsS0FBSzthQUNiO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLEtBQUssRUFBRSxLQUFLO2dCQUNaLFFBQVEsRUFBRSxPQUFPO2FBQ2xCO1NBQ0Y7S0FDRjtJQUNELENBQUMsR0FBRyw4QkFBbUIsQ0FBQyxFQUFFLEVBRXpCO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsR0FBRyxHQUFHLEVBQUU7UUFDUixNQUFNLEVBQUUsTUFBTTtRQUNkLEtBQUssRUFBRSxLQUFLO1FBQ1osVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1FBQ2xCLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxDQUFDO1lBQ1QsT0FBTyxFQUFFLE1BQU07WUFDZixVQUFVLEVBQUUsU0FBUztZQUNyQixZQUFZLEVBQUUsaUJBQWlCO1NBQ2hDO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLENBQUM7U0FDUjtLQUNGO0NBQ0YsQ0FBQztBQUNGLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQVksRUFBVSxFQUFFLENBQUMsQ0FBQztJQUM5QyxVQUFVLEVBQUU7UUFDVixPQUFPLEVBQUUsTUFBTTtRQUNmLGFBQWEsRUFBRSxLQUFLO1FBQ3BCLEtBQUssRUFBRSxFQUFFO1FBQ1QsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLEtBQUs7WUFDZCxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDO1lBQ3BCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUU7U0FDN0I7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQVksRUFBUyxFQUFFLENBQUMsQ0FBQztJQUNsRCxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7Q0FDaEIsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBYSxFQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQzFELFFBQVEsRUFBRTtRQUNSLFVBQVUsRUFBRSxDQUFDO0tBQ2Q7SUFDRCxNQUFNLEVBQUU7UUFDTixVQUFVLEVBQUUsQ0FBQztLQUNkO0lBQ0QsQ0FBQyxJQUFJLHdCQUFZLENBQUMsRUFBRTtRQUNsQixTQUFTLEVBQUUscUJBQXFCLENBQUMsRUFBRTtLQUNwQztDQUNGLENBQUMsQ0FBQTtBQUNGLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQVcsRUFBVSxFQUFFLENBQUMsQ0FBQztJQUMxRCxTQUFTLEVBQUU7UUFDVCxLQUFLLEVBQUUsTUFBTTtRQUNiLG1CQUFtQjtRQUNuQixPQUFPLEVBQUUsQ0FBQztRQUNWLE1BQU0sRUFBRSxDQUFDO1FBQ1QsUUFBUSxFQUFFLGVBQWU7UUFDekIsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLFlBQVksRUFBRSxHQUFHO1FBQ2pCLElBQUksRUFBRTtZQUNKLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLEdBQUcsR0FBRyxFQUFFO1lBQ1IsTUFBTSxFQUFFLFNBQVM7WUFDakIsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2QsWUFBWSxFQUFFLGlCQUFpQjtZQUMvQixnQkFBZ0IsRUFBRSxHQUFHO1lBQ3JCLENBQUMsR0FBRyxvQkFBUyxDQUFDLEVBQUU7Z0JBQ2QsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsMkJBQTJCO2dCQUMzQixPQUFPLEVBQUUsV0FBVztnQkFDcEIsV0FBVyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQ3hCLGdCQUFnQixFQUFFLEVBQUUsT0FBTyxFQUFFLFlBQVksR0FBRzthQUM3QztZQUNELFdBQVc7WUFDWCxhQUFhO1lBQ2IsZ0NBQWdDO1lBQ2hDLHlCQUF5QjtZQUN6QixLQUFLO1lBQ0wsdUJBQXVCO1lBQ3ZCLDZCQUE2QjtZQUM3QixLQUFLO1NBQ047UUFDRCwrREFBK0Q7S0FDaEU7SUFDRCxpQkFBaUI7SUFDakIsaUNBQWlDO0lBQ2pDLG1DQUFtQztJQUNuQywyQkFBMkI7SUFDM0IsV0FBVztJQUNYLFlBQVk7SUFDWixpQ0FBaUM7SUFDakMscURBQXFEO0lBQ3JELGVBQWU7SUFDZixnQ0FBZ0M7SUFDaEMsdUJBQXVCO0lBQ3ZCLGdFQUFnRTtJQUNoRSw2QkFBNkI7SUFDN0IsU0FBUztJQUNULDZCQUE2QjtJQUM3QixNQUFNO0NBQ1AsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFXLEVBQVUsRUFBRSxDQUFDLENBQUM7SUFDckUsT0FBTyxFQUFFO1FBQ1AsT0FBTyxFQUFFLENBQUM7UUFDVixPQUFPLEVBQUUsTUFBTTtRQUNmLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLFFBQVEsRUFBRSxhQUFhO1FBQ3ZCLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNoQixZQUFZLEVBQUUsSUFBSTtRQUVsQixNQUFNO1FBQ04sR0FBRyxFQUFFO1lBQ0gsT0FBTyxFQUFFLE1BQU07WUFDZixhQUFhLEVBQUUsS0FBSztZQUNwQixNQUFNLEVBQUUsS0FBSztZQUNiLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUUsVUFBVTtnQkFDcEIsS0FBSyxFQUFFLENBQUM7YUFDVDtZQUNELE1BQU07WUFDTixHQUFHLEVBQUU7Z0JBQ0gsMkJBQTJCO2dCQUMzQixPQUFPLEVBQUUsR0FBRyxxQkFBVyxNQUFNLHFCQUFXLElBQUk7Z0JBQzVDLFlBQVksRUFBRSxDQUFDO2dCQUNmLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixZQUFZLEVBQUUsVUFBVTtnQkFDeEIsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsV0FBVyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQ3hCLFlBQVksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUN6QixVQUFVLEVBQUUsQ0FBQzthQUNkO1lBQ0QsQ0FBQyxHQUFHLG9CQUFTLENBQUMsRUFBRTtnQkFDZCxJQUFJLEVBQUUsU0FBUzthQUNoQjtTQUNGO1FBQ0QsSUFBSSxFQUFFO1lBQ0osR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2QsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixDQUFDLElBQUksaUJBQU0sZ0JBQWdCLENBQUMsRUFBRTtnQkFDNUIsT0FBTyxFQUFFLGFBQWE7YUFDdkI7U0FDRjtRQUNELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxLQUFLO1lBQ2IsTUFBTSxzQkFBYztZQUNwQixVQUFVLEVBQUUsSUFBSTtZQUNoQixVQUFVLEVBQUUsR0FBRztZQUNmLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLEdBQUcsRUFBRSxDQUFDO1lBQ04sTUFBTTtZQUNOLElBQUksRUFBRTtnQkFDSixRQUFRLEVBQUUsVUFBVTtnQkFDcEIsQ0FBQyxHQUFHLHdCQUFhLENBQUMsRUFBRTtvQkFDbEIsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLFVBQVUsRUFBRSxLQUFLO29CQUNqQixLQUFLLEVBQUUsS0FBSztvQkFDWixHQUFHLEVBQUUsQ0FBQztvQkFDTixVQUFVLEVBQUUsaUNBQWlDO29CQUM3QyxNQUFNLEVBQUUsTUFBTTtpQkFDZjtnQkFDRCxDQUFDLEdBQUcsMEJBQWMsQ0FBQyxFQUFFO29CQUNuQixNQUFNLEVBQUUsWUFBWTtvQkFDcEIsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLEtBQUssRUFBRSxDQUFDO29CQUNSLEdBQUcsRUFBRSxDQUFDO29CQUNOLEtBQUssRUFBRSxLQUFLO29CQUNaLE1BQU0sc0JBQWM7b0JBQ3BCLE1BQU0sRUFBRSxNQUFNO2lCQUNmO2FBQ0Y7U0FDRjtRQUNELENBQUMsSUFBSSx5QkFBYSxDQUFDLEVBQUU7WUFDbkIsQ0FBQyxHQUFHLG9CQUFTLENBQUMsRUFBRTtnQkFDZCxNQUFNO2dCQUNOLENBQUMsR0FBRyxtQkFBUyxDQUFDLEVBQUU7b0JBQ2QsTUFBTSxFQUFFLGFBQWEsRUFBRSxFQUFFO2lCQUMxQjtnQkFDRCxDQUFDLHFCQUFxQixDQUFDLEVBQUU7b0JBQ3ZCLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjtnQkFDRCxDQUFDLEdBQUcsb0JBQVMsQ0FBQyxFQUFFO29CQUNkLFNBQVMsRUFBRSxNQUFNO29CQUNqQixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7YUFDRjtZQUNELG9CQUFvQjtZQUNwQixVQUFVO1lBQ1Ysc0JBQXNCO1lBQ3RCLGFBQWE7WUFDYix3QkFBd0I7WUFDeEIsa0NBQWtDO1lBQ2xDLFNBQVM7WUFDVCxPQUFPO1lBQ1AsS0FBSztTQUNOO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxNQUFNO2dCQUNiLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFO2FBQ2xEO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sVUFBVSxJQUFJLENBQUMsR0FBWTtJQUMvQixHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDWCxPQUFPO1FBQ0wsU0FBUyxFQUFFO1lBQ1QsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLENBQUM7WUFDWixTQUFTLEVBQUUsTUFBTTtZQUNqQixtQkFBbUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7WUFDeEMsZUFBZSxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtZQUNwQyxPQUFPLEVBQUUsTUFBTTtZQUNmLGdCQUFnQjtZQUNoQixPQUFPLEVBQUU7Z0JBQ1AsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLEtBQUssRUFBRTtvQkFDTCxPQUFPLEVBQUUsT0FBTztvQkFDaEIsWUFBWSxFQUFFLE1BQU07b0JBQ3BCLFFBQVEsRUFBRSxRQUFRO29CQUNsQixVQUFVLEVBQUUsUUFBUTtpQkFDckI7Z0JBQ0QsS0FBSyxFQUFFO29CQUNMLHlCQUF5QjtvQkFDekIsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsS0FBSyxFQUFFLE1BQU07aUJBQ2Q7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLFVBQVUsRUFBRSxHQUFHO29CQUNmLFVBQVUsRUFBRSwwREFBMEQ7b0JBQ3RFLFFBQVEsRUFBRSxVQUFVO29CQUNwQixLQUFLLEVBQUUsTUFBTTtpQkFDZDtnQkFDRCxlQUFlLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFO2FBQ3hDO1lBQ0QsY0FBYztZQUNkLE9BQU8sRUFBRTtnQkFDUCxZQUFZLEVBQUUsTUFBTTtnQkFFcEIsS0FBSyxFQUFFO29CQUNMLE9BQU8sRUFBRSxjQUFjO29CQUN2QixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsVUFBVSxFQUFFLFFBQVE7b0JBQ3BCLEtBQUssRUFBRSxLQUFLO29CQUNaLE1BQU0sRUFBRSxDQUFDO29CQUNULFNBQVMsRUFBRSxLQUFLO29CQUNoQixZQUFZLEVBQUUsTUFBTTtpQkFDckI7Z0JBQ0QsZUFBZSxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTtnQkFDdkMsS0FBSyxFQUFFO29CQUNMLE1BQU0sRUFBRSxDQUFDO29CQUNULEtBQUssRUFBRSxLQUFLO2lCQUNiO2dCQUNELE1BQU0sRUFBRTtvQkFDTixVQUFVLEVBQUUsR0FBRztvQkFDZixRQUFRLEVBQUUsVUFBVTtvQkFDcEIsS0FBSyxFQUFFLE1BQU07aUJBQ2Q7YUFDRjtZQUNELENBQUMsSUFBSSxvQkFBUyxJQUFJLHNCQUFXLEVBQUUsQ0FBQyxFQUFFO2dCQUNoQyxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsTUFBTSxFQUFFLENBQUM7YUFDVjtTQUNGO1FBRUQsV0FBVyxFQUFFO1lBQ1gsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtTQUN2QjtLQUVGLENBQUE7QUFDSCxDQUFDO0FBQ0QsTUFBTSxVQUFVLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBVztJQUNuQyxPQUFPO1FBQ0wsUUFBUSxFQUFFO1lBQ1IsR0FBRyxHQUFHLEVBQUU7WUFDUixRQUFRLEVBQUU7Z0JBQ1IsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLENBQUMsTUFBTSxrQkFBTyxFQUFFLENBQUMsRUFBRTtvQkFDakIsS0FBSyxFQUFFLE9BQU87b0JBQ2QsT0FBTyxFQUFFLENBQUM7b0JBQ1YsTUFBTSxFQUFFLG9CQUFVLEtBQUs7b0JBQ3ZCLFFBQVEsRUFBRSxFQUVUO2lCQUNGO2dCQUNELFFBQVEsRUFBRTtvQkFDUixDQUFDLE1BQU0sa0JBQU8sRUFBRSxDQUFDLEVBQUU7d0JBQ2pCLE9BQU8sRUFBRSxDQUFDO3FCQUNYO2lCQUNGO2FBQ0Y7WUFDRCxDQUFDLEdBQUcsb0JBQVMsQ0FBQyxFQUFFO2dCQUNkLE1BQU0sRUFBRSxlQUFlLGlCQUFPLEtBQUs7YUFDcEM7U0FDRjtLQUNGLENBQUE7QUFDSCxDQUFDO0FBQ0QsTUFBTSxVQUFVLGNBQWMsQ0FBQyxHQUFZO0lBQ3pDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNaLE9BQU87UUFDTCxXQUFXLEVBQUU7WUFDWCxRQUFRLEVBQUUsVUFBVTtZQUNwQixPQUFPLEVBQUUsTUFBTTtZQUNmLEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUUsVUFBVTtnQkFDcEIsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsR0FBRyxFQUFFLE9BQU87YUFDYjtZQUNELEdBQUcsRUFBRTtnQkFDSCxRQUFRLEVBQUUsTUFBTTtnQkFDaEIsU0FBUyxFQUFFLE1BQU07YUFDbEI7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLGtCQUFrQjtnQkFDekIsTUFBTSxFQUFFLGtCQUFrQjtnQkFDMUIsTUFBTSxFQUFFLG9CQUFvQjtnQkFDNUIsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLFVBQVUsRUFBRSxPQUFPO2lCQUNwQjthQUNGO1NBQ0Y7UUFFRCxDQUFDLE1BQU0sbUNBQWMsRUFBRSxDQUFDLEVBQUU7WUFDeEIsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtTQUMzQjtRQUNELFdBQVcsRUFBRTtZQUNYLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxRQUFRO1lBQ25CLEtBQUssRUFBRSxNQUFNO1lBQ2IsTUFBTSxFQUFFLE1BQU07WUFDZCxLQUFLLEVBQUU7Z0JBQ0wsT0FBTyxFQUFFLE1BQU07YUFDaEI7WUFDRCxDQUFDLEdBQUcsc0JBQVcsQ0FBQyxFQUFFO2dCQUNoQixNQUFNLEVBQUUsQ0FBQztnQkFDVCxLQUFLLEVBQUUsTUFBTTtnQkFDYixNQUFNLEVBQUUsTUFBTTtnQkFDZCxZQUFZLEVBQUUsTUFBTTtnQkFDcEIsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLEtBQUssRUFBRSxDQUFDO2dCQUNSLE1BQU0sRUFBRSxDQUFDO2FBQ1Y7WUFDRCxDQUFDLEdBQUcsb0JBQVMsQ0FBQyxFQUFFO2dCQUNkLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixVQUFVLEVBQUUsTUFBTTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLE1BQU0sRUFBRSxDQUFDO2dCQUNULFVBQVUsRUFBRSxNQUFNO2dCQUNsQixLQUFLLEVBQUUsTUFBTTtnQkFDYixNQUFNLEVBQUUsTUFBTTtnQkFDZCxLQUFLLEVBQUUsTUFBTTtnQkFDYixZQUFZLEVBQUUsS0FBSztnQkFDbkIsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTthQUN2QjtTQUdGO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFDRCxNQUFNLFVBQVUsU0FBUztJQUN2QixPQUFPO1FBQ0wsT0FBTyxFQUFFO1lBQ1AsQ0FBQyxHQUFHLG9CQUFTLENBQUMsRUFBRTtnQkFDZCxPQUFPLEVBQUUsTUFBTTthQUNoQjtZQUNELENBQUMsR0FBRyxvQkFBUyxDQUFDLEVBQUU7Z0JBQ2QsQ0FBQyxLQUFLLGVBQUksS0FBSyxpQkFBTSxFQUFFLENBQUMsRUFBRTtvQkFDeEIsT0FBTyxFQUFFLE9BQU87aUJBQ2pCO2FBQ0Y7U0FDRjtLQUNGLENBQUE7QUFDSCxDQUFDO0FBQ0QsTUFBTSxVQUFVLFFBQVEsQ0FBQyxHQUFZO0lBQ25DLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNWLE9BQU87UUFDTCxPQUFPLEVBQUU7WUFDUCxPQUFPLEVBQUUsY0FBYztZQUN2QixDQUFDLEdBQUcsc0JBQVMsQ0FBQyxFQUFFO2dCQUNkLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixNQUFNLHdCQUFnQjthQUN2QjtZQUNELENBQUMsR0FBRyxtQkFBUyxDQUFDLEVBQUU7Z0JBQ2QsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtLQUNGLENBQUE7QUFDSCxDQUFDO0FBQ0QsTUFBTSxVQUFVLE1BQU0sQ0FBQyxHQUFZO0lBQ2pDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNWLE9BQU87UUFDTCxDQUFDLE1BQU0sb0JBQVEsRUFBRSxDQUFDLEVBQUU7WUFDbEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsT0FBTyxFQUFFLGNBQWM7WUFDdkIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsb0JBQW9CO1lBQ3BCLG1CQUFtQjtZQUNuQixLQUFLO1lBQ0wsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixNQUFNLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDO2dCQUNyQixVQUFVLEVBQUUsUUFBUTtnQkFDcEIsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLE9BQU8sRUFBRSxNQUFNO2dCQUNmLE1BQU0sRUFBRSxNQUFNO2dCQUNkLENBQUMsR0FBRyxxQkFBVSxDQUFDLEVBQUU7b0JBQ2YsVUFBVSxFQUFFLE1BQU07aUJBQ25CO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixRQUFRLEVBQUUsYUFBYTtnQkFDdkIsTUFBTSx3QkFBZ0I7YUFDdkI7WUFDRCxTQUFTO1lBQ1QsS0FBSyxFQUFFLEVBRU47WUFDRCxZQUFZO1lBQ1osS0FBSyxFQUFFLEVBRU47WUFDRCxLQUFLLEVBQUU7Z0JBQ0wsVUFBVSxFQUFFLE1BQU07Z0JBQ2xCLEtBQUssRUFBRSxTQUFTO2FBQ2pCO1NBQ0Y7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFXLEVBQVUsRUFBRSxDQUFDLENBQUM7SUFDbEQsVUFBVSxFQUFFO1FBQ1Ysa0JBQWtCO1FBQ2xCLE9BQU8sRUFBRSxNQUFNO1FBQ2YsRUFBRSxFQUFFO1lBQ0YsSUFBSSxFQUFFLEtBQUs7WUFDWCxNQUFNLEVBQUUsTUFBTTtTQUNmO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7U0FDcEM7UUFDRCxLQUFLLEVBQUU7WUFDTCxhQUFhLEVBQUUsUUFBUTtZQUN2QixFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRztTQUNuQztRQUNELEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRTtLQUNwQztDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQVUsRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0QsSUFBSSxFQUFFO1FBQ0osK0JBQStCO1FBQy9CLFVBQVUsZ0NBQU07S0FDakI7SUFDRCxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO0lBQ25CLE1BQU0sRUFBRTtRQUNOLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLEtBQUssRUFBRSxTQUFTO1FBQ2hCLE1BQU0sRUFBRSxNQUFNO1FBQ2QsUUFBUSxFQUFFLFNBQVM7UUFDbkIsVUFBVSxFQUFFLFNBQVM7S0FDdEI7SUFDRCxDQUFDLEVBQUU7UUFDRCxLQUFLLEVBQUUsU0FBUztRQUNoQixjQUFjLEVBQUUsTUFBTTtLQUN2QjtJQUNELEVBQUUsRUFBRTtRQUNGLFdBQVcsRUFBRSxPQUFPO1FBQ3BCLGFBQWE7UUFDYixrQkFBa0I7UUFDbEIsaUNBQWlDO1FBQ2pDLGdDQUFnQztLQUNqQztJQUNELEtBQUssRUFBRTtRQUNMLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLEtBQUssRUFBRSxTQUFTO1FBQ2hCLE1BQU0sRUFBRSxNQUFNO0tBQ2Y7SUFDRCxHQUFHLEVBQUU7UUFDSCxTQUFTLEVBQUUsWUFBWTtLQUN4QjtJQUNELEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUU7SUFDekIsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtJQUMxQixFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFO0lBQ3pCLFdBQVcsRUFBRTtRQUNYLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLEtBQUssRUFBRSxNQUFNO1FBQ2IsR0FBRyxFQUFFLE1BQU07S0FDWjtJQUNELFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRTtJQUN2QyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ2YsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUNmLFdBQVcsRUFBRSxNQUFNLEVBQUU7SUFDckIsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtJQUMzQixDQUFDLEdBQUcsMkJBQWdCLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRTtDQUMzRCxDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFVLEVBQUUsRUFBRSxDQUNsQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ1YsSUFBSSxDQUFDLENBQ0wsTUFBTSxDQUFDLENBQ1AsUUFBUSxDQUFDLENBQ1QsTUFBTSxDQUFDLENBQ1AsS0FBSyxDQUFDLENBQ04sS0FBSyxDQUFDLENBQ04sS0FBSyxDQUFDLENBQ04sT0FBTyxDQUFDLENBQ1IsT0FBTyxDQUFDLENBQ1IsS0FBSyxDQUFDLENBQ04sR0FBRyxDQUFDLENBQ0osS0FBSyxDQUFDLENBQ04sTUFBTSxDQUFDLENBQ1AsSUFBSSxDQUFDLENBQ0wsS0FBSyxDQUFDLENBQ04sY0FBYyxDQUFDLENBQ2YsS0FBSyxDQUFDLENBQ04sTUFBTSxDQUFDLENBQ1AsSUFBSSxDQUFDLENBQ0wsR0FBRyxDQUFDLENBQUM7QUFDViwyQkFBMkI7QUFDM0IsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFZO0lBQ2hDLEVBQUUsRUFBRSxTQUFTO0lBQ2IsRUFBRSxFQUFFLE1BQU07SUFDVixLQUFLLEVBQUUsU0FBUztJQUNoQixJQUFJLEVBQUUsRUFBRTtJQUNSLFFBQVEsRUFBRSxTQUFTO0lBQ25CLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUM3QixLQUFLLEVBQUU7UUFDTCxFQUFFLEVBQUUsRUFBRTtRQUNOLEVBQUUsRUFBRSxFQUFFO0tBQ1A7SUFDRCxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUMzQixFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtJQUNqQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3ZELENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRTNDLE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBWTtJQUNqQyxFQUFFLEVBQUUsTUFBTTtJQUNWLEVBQUUsRUFBRSxNQUFNO0lBQ1YsS0FBSyxFQUFFLFNBQVM7SUFDaEIsSUFBSSxFQUFFLFNBQVM7SUFDZixRQUFRLEVBQUUsU0FBUztJQUNuQixJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7SUFDM0UsS0FBSyxFQUFFO1FBQ0wsRUFBRSxFQUFFLFNBQVM7UUFDYixFQUFFLEVBQUUsU0FBUztLQUNkO0lBQ0QsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7SUFDMUIsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEdBQUc7SUFDakQsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFO0lBQy9FLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDdkQsQ0FBQTtBQUNELDRCQUE0QjtBQUM1QixNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDIn0=