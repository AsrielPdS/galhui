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
export const button = (ctx) => (ctx(icon), {
    //style
    "._.a": {
        color: ctx.a.n,
        ":hover": { color: ctx.a.h },
        ":visited": { color: ctx.a.v },
        ":active": { color: ctx.a.a },
    },
    "._.bt": {
        borderRadius: 0.2 /* $.acentBordRad */ + "em",
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
export function input({ in: { bg, fg, border } }) {
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
            borderRadius: 0.2 /* $.acentBordRad */ + "em",
            height: "2.4em",
            outline: "0",
            // "&.min>input:not(:focus)": {
            //   width: 0,
            // },
            "input&": {
                display: "inline-block",
            },
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
export function loader() {
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
        "@keyframes spin": {
            "0%": { transform: "rotate(0deg)", },
            "100%": { transform: "rotate(360deg)", }
        }
    };
}
export function output({ in: { border } }) {
    return {
        "._.out": {
            borderRadius: 0.2 /* $.acentBordRad */ + "em",
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
                ...bfg("rgb(255, 246, 246)", "rgb(159, 58, 56)" /* $.error */),
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
                borderRight: `1px solid ${border.n}`,
            },
            ">:first-child": {
                paddingLeft: "1.5em",
                borderRadius: `${0.2 /* $.acentBordRad */}em 0 0 ${0.2 /* $.acentBordRad */}em`,
            },
            ">:last-child": {
                paddingRight: "1.5em",
                borderRadius: `0 ${0.2 /* $.acentBordRad */}em ${0.2 /* $.acentBordRad */}em 0`,
            },
        },
    };
}
export const menubar = ({ menu }) => ({
    "._.bar": {
        display: "flex",
        height: 2.4 /* $.menuH */ + "em",
        lineHeight: 2.4 /* $.menuH */ + "em",
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
            height: 2.8 /* $.tabH */ + "em",
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
        "&.modal>.ft": {
            padding: 0,
            height: "unset",
            background: "inherit"
        }
    }
});
export const menurow = ({ menu }) => ({
    "._.menurow": {
        background: menu,
        lineHeight: 2.4 /* $.menuH */ + "em",
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
export const modal = (ctx) => (ctx(button), {
    "._.blank": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#000000d9",
        zIndex: 3 /* zIndex.modalArea */,
        overflow: "auto",
    },
    "._.modal": {
        zIndex: 4 /* zIndex.modal */,
        borderRadius: ".4em",
        width: "calc(100% - 1em)",
        height: "calc(100% - 1em)",
        margin: ".5em",
        position: "relative",
        textAlign: "start",
        overflow: "hidden",
        background: ctx.bg,
        padding: ".2em 1em",
        ...col(),
        ["&." + "_e" /* Color.error */]: {
            border: "4px solid #e53935"
        },
        ["." + "cl" /* C.close */]: {
            position: "absolute",
            right: ".4rem",
            top: ".1rem",
            fontSize: "14pt",
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
        },
        ".bd": {
            flex: 1,
            height: "0",
            overflow: "hidden auto",
            padding: 0,
        },
        // ".bd": {
        //   padding: ".2em 1em",
        //   overflow: "auto",
        //   height: "calc(100% - 3.8em)",
        //   ":first-child": { paddingTop: "1.2em", },
        // },
        // ".hd+.bd": {
        //   height: "calc(100% - 6em)",
        // },
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
        },
        "&.xl,&.l": {},
        "&.xs,&.s": {}
    },
    [min(768 /* ScreenSize.tablet */)]: {
        "._.modal": {
            width: "55%",
            maxWidth: (768 /* ScreenSize.tablet */ - 20) + "px",
            margin: "3em auto 2em",
            height: "unset",
            maxHeight: "calc(100% - 5em)",
            "&.scroll": {},
            /**full screen */
            "&.xl": {
                width: "calc(100% - 3rem)",
                height: "calc(100% - 3rem)",
                margin: "1.5rem",
                maxWidth: "unset",
                ...col()
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
    [min(1024 /* ScreenSize.laptop */)]: {
        "._.modal": {
            padding: ".5em 1.7em",
            ".hd": {
                margin: "-.5em -1.7em 1.2em"
            },
            ".ft": {
                margin: "1.2em -1.7em -.5em"
            },
        }
    },
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
});
export const index = () => ({
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
                padding: `${0.3 /* $.acentVPad */}em ${0.4 /* $.acentHPad */}em`,
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
            overflow: "auto",
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
            [`.${"ms" /* C.message */}.${"_e" /* Color.error */}`]: {
                position: "sticky",
                bottom: 0,
            },
        },
        "._.formg": {
            background: "#aaaaaa36",
            borderRadius: "4px",
            margin: "6px -6px 6px 0",
            paddingRight: "6px",
            paddingBottom: "1px",
            ".hd": {
                padding: ".4em 2em",
                background: "#cfd8dc",
                margin: "0 -6px 10px 0",
                borderRadius: "4px"
            }
        },
        "._.form,._.formg": {
            //outline input 
            ".oi": {
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
            ".ii": {
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
                    lineHeight: 3,
                    verticalAlign: "middle",
                    position: "absolute",
                    right: ".7em"
                },
            },
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
                    height: 2.4 /* $.menuH */ + "rem",
                    ":hover": {}
                },
                ":hover": {
                    [`._.${"cl" /* C.close */}`]: {
                        opacity: 1
                    },
                }
            },
            ["." + "bd" /* C.body */]: {
                height: `calc(100% - ${2.4 /* $.menuH */}px)`
            }
        }
    };
}
export function mobImgSelector(ctx) {
    ctx(button);
    return {
        "._.img-in": {
            position: "relative",
            display: "inline-block",
            ".cl": {
                position: "absolute",
                right: ".4rem",
                top: ".1rem",
            },
            img: {
                maxWidth: "100%",
                maxHeight: "100%",
                margin: "auto",
                display: "block",
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
        fontFamily: "Roboto,sans-serif" /* $.ff */,
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
export const style = (p) => core(p)(icon)(menu)(button)(dropdown)(select)(input)(menubar)(menurow)(table)(tab)(index)(output)(list)(table)(mobImgSelector)(stack)(loader)(form)(modal)(tip);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQWlCLE1BQU0sT0FBTyxDQUFDO0FBR3RELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFZLE1BQU0sYUFBYSxDQUFDO0FBdUJ4RSxNQUFNLENBQUMsTUFDTCxHQUFHLEdBQUcsR0FBVSxFQUFFLENBQUMsQ0FBQztJQUNsQixPQUFPLEVBQUUsTUFBTTtJQUNmLGFBQWEsRUFBRSxRQUFRO0NBQ3hCLENBQUMsRUFDRixHQUFHLEdBQUcsQ0FBQyxNQUFhLEVBQVMsRUFBRSxDQUFDLENBQUM7SUFDL0IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNO0lBQ3hDLGFBQWEsRUFBRSxLQUFLO0NBQ3JCLENBQUMsRUFDRixNQUFNLEdBQUcsR0FBVSxFQUFFLENBQUMsQ0FBQztJQUNyQixRQUFRLEVBQUUsVUFBVTtJQUNwQixJQUFJLEVBQUUsS0FBSztJQUNYLEdBQUcsRUFBRSxLQUFLO0lBQ1YsU0FBUyxFQUFFLFdBQVc7Q0FDdkIsQ0FBQyxFQUNGLEdBQUcsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsc0JBQXNCLElBQUksS0FBSyxFQUNwRCxHQUFHLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixJQUFJLEtBQUssQ0FBQztBQXFDdkQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDLENBQUM7SUFDakMsQ0FBQyxJQUFJLGdCQUFNLEVBQUUsQ0FBQyxFQUFFO1FBQ2QsTUFBTSxFQUFFLE9BQU87UUFDZixhQUFhLEVBQUUsUUFBUTtRQUN2QixNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsTUFBTTtTQUNmO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLEtBQUs7U0FDZDtLQUNGO0NBQ0YsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBWSxFQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUMxRCxPQUFPO0lBQ1AsTUFBTSxFQUFFO1FBQ04sS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUM1QixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDOUIsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0tBQzlCO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsWUFBWSxFQUFFLDJCQUFpQixJQUFJO1FBQ25DLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbEMsVUFBVSxFQUFFLFFBQVE7UUFDcEIsTUFBTSxFQUFFLFNBQVM7UUFDakIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQixRQUFRLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7UUFDbEMsVUFBVSxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO1FBQ3BDLFNBQVMsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtRQUVuQyxDQUFDLElBQUksc0JBQVMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO1FBRXBELENBQUMsSUFBSSxnQkFBTSxFQUFFLENBQUMsRUFBRTtZQUNkLFdBQVcsRUFBRSxNQUFNO1NBQ3BCO1FBQ0QsQ0FBQyxLQUFLLHVCQUFZLEVBQUUsQ0FBQyxFQUFFLEVBRXRCO1FBQ0QsQ0FBQyxLQUFLLHNCQUFXLEVBQUUsQ0FBQyxFQUFFO1lBQ3BCLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO1lBQ3pCLFFBQVEsRUFBRTtZQUNSLGdCQUFnQjthQUNqQjtTQUNGO1FBQ0QsQ0FBQyxLQUFLLHFCQUFVLEVBQUUsQ0FBQyxFQUFFLEVBRXBCO1FBQ0QsQ0FBQyxLQUFLLHFCQUFVLEVBQUUsQ0FBQyxFQUFFLEVBRXBCO1FBQ0QsQ0FBQyxLQUFLLHdCQUFhLEVBQUUsQ0FBQyxFQUFFLEVBRXZCO1FBQ0QsQ0FBQyxLQUFLLGdCQUFNLEtBQUssZ0JBQU0sRUFBRSxDQUFDLEVBQUU7WUFDMUIsV0FBVyxFQUFFLE9BQU87WUFDcEIsTUFBTSxFQUFFLFNBQVM7WUFDakIscUJBQXFCO1NBQ3RCO1FBQ0QsQ0FBQyxJQUFJLG1CQUFTLENBQUMsRUFBRTtZQUNmLE1BQU0sRUFBRSxLQUFLO1NBQ2Q7UUFDRCxDQUFDLElBQUkscUJBQVUsQ0FBQyxFQUFFO1lBQ2hCLHFCQUFxQjtZQUNyQixvQkFBb0I7WUFDcEIsWUFBWSxFQUFFLEtBQUs7WUFDbkIsT0FBTyxFQUFFLGFBQWE7WUFDdEIsYUFBYSxFQUFFLFFBQVE7WUFDdkIsVUFBVSxFQUFFLFFBQVE7WUFDcEIsY0FBYyxFQUFFLFFBQVE7WUFDeEIsQ0FBQyxJQUFJLGdCQUFNLEVBQUUsQ0FBQyxFQUFFO2dCQUNkLE1BQU0sRUFBRSxLQUFLO2FBQ2Q7U0FDRjtLQUNGO0lBQ0QsQ0FBQyxHQUFHLHVCQUFZLENBQUMsRUFBRSxFQUVsQjtDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFXO0lBQ3ZELE9BQU87UUFDTCxlQUFlLEVBQUU7WUFDZixNQUFNLEVBQUUsS0FBSztZQUNiLE1BQU0sRUFBRSxVQUFVO1NBQ25CO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLFVBQVU7WUFDbkIsT0FBTyxFQUFFLGFBQWE7WUFDdEIsVUFBVSxFQUFFLFFBQVE7WUFDcEIsS0FBSyxFQUFFLEVBQUU7WUFDVCxVQUFVLEVBQUUsRUFBRTtZQUNkLE1BQU0sRUFBRSxhQUFhLE1BQU0sQ0FBQyxDQUFDLEVBQUU7WUFDL0IsWUFBWSxFQUFFLDJCQUFpQixJQUFJO1lBQ25DLE1BQU0sRUFBRSxPQUFPO1lBQ2YsT0FBTyxFQUFFLEdBQUc7WUFDWiwrQkFBK0I7WUFDL0IsY0FBYztZQUNkLEtBQUs7WUFDTCxRQUFRLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLGNBQWM7YUFDeEI7WUFDRCxLQUFLLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLHFCQUFxQjtnQkFDN0IsV0FBVyxFQUFFLE1BQU07Z0JBQ25CLFVBQVUsRUFBRSxFQUFFO2FBQ2Y7WUFDRCxDQUFDLEdBQUcsbUJBQVMsQ0FBQyxFQUFFLEVBRWY7WUFDRCxlQUFlLEVBQUU7Z0JBQ2YsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ3RCO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxNQUFNO2dCQUNiLElBQUksRUFBRSxLQUFLO2dCQUNYLE9BQU8sRUFBRSxNQUFNO2dCQUNmLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7WUFDRCxDQUFDLElBQUkseUJBQWMsQ0FBQyxFQUFFO2dCQUNwQixXQUFXLEVBQUUsU0FBUzthQUN2QjtTQUNGO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFDRCxNQUFNLFVBQVUsTUFBTTtJQUNwQixPQUFPO1FBQ0wsU0FBUyxFQUFFO1lBQ1QsTUFBTSxFQUFFLG9CQUFvQjtZQUM1QixZQUFZLEVBQUUsS0FBSztZQUNuQixTQUFTLEVBQUUsb0JBQW9CO1lBQy9CLFNBQVMsRUFBRSx1REFBdUQ7WUFDbEUsR0FBRyxNQUFNLEVBQUU7WUFDWCxLQUFLLEVBQUUsTUFBTTtZQUNiLE1BQU0sRUFBRSxNQUFNO1lBQ2QsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxNQUFNO2dCQUNiLE1BQU0sRUFBRSxNQUFNO2dCQUNkLFdBQVcsRUFBRSxLQUFLO2FBQ25CO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxPQUFPO2dCQUNkLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFdBQVcsRUFBRSxNQUFNO2FBQ3BCO1NBQ0Y7UUFDRCxpQkFBaUIsRUFBRTtZQUNqQixJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsY0FBYyxHQUFHO1lBQ3BDLE1BQU0sRUFBRSxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsR0FBRztTQUN6QztLQUNGLENBQUE7QUFDSCxDQUFDO0FBQ0QsTUFBTSxVQUFVLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFXO0lBQ2hELE9BQU87UUFDTCxRQUFRLEVBQUU7WUFDUixZQUFZLEVBQUUsMkJBQWlCLElBQUk7WUFDbkMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMvQixVQUFVLEVBQUUsU0FBUztZQUNyQixPQUFPLEVBQUUsY0FBYztZQUN2QixLQUFLLEVBQUU7Z0JBQ0wsT0FBTyxFQUFFLFdBQVc7Z0JBQ3BCLEVBQUUsRUFBRTtvQkFDRixPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUN2QjthQUNGO1NBQ0Y7UUFDRCxDQUFDLE1BQU0sb0JBQVMsRUFBRSxDQUFDLEVBQUU7WUFDbkIsQ0FBQyxLQUFLLHNCQUFXLEVBQUUsQ0FBQyxFQUFFO2dCQUNwQixHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsbUNBQVU7YUFDdEM7WUFDRCxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN4QixRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtZQUM5QyxVQUFVLEVBQUUsU0FBUztTQUN0QjtRQUNELFdBQVcsRUFBRTtZQUNYLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNaLCtDQUErQztZQUMvQyxRQUFRLEVBQUUsUUFBUTtZQUNsQixPQUFPLEVBQUUsQ0FBQztZQUNWLEdBQUcsRUFBRTtnQkFDSCxrQkFBa0I7Z0JBQ2xCLElBQUksRUFBRSxRQUFRO2dCQUNkLE1BQU0sRUFBRSxDQUFDO2dCQUNULFlBQVksRUFBRSxDQUFDO2dCQUNmLFdBQVcsRUFBRSxNQUFNO2dCQUNuQixZQUFZLEVBQUUsTUFBTTtnQkFDcEIsS0FBSyxFQUFFLE1BQU07YUFDZDtZQUNELG9CQUFvQixFQUFFO2dCQUNwQixXQUFXLEVBQUUsYUFBYSxNQUFNLENBQUMsQ0FBQyxFQUFFO2FBQ3JDO1lBQ0QsZUFBZSxFQUFFO2dCQUNmLFdBQVcsRUFBRSxPQUFPO2dCQUNwQixZQUFZLEVBQUUsR0FBRyx3QkFBYyxVQUFVLHdCQUFjLElBQUk7YUFDNUQ7WUFDRCxjQUFjLEVBQUU7Z0JBQ2QsWUFBWSxFQUFFLE9BQU87Z0JBQ3JCLFlBQVksRUFBRSxLQUFLLHdCQUFjLE1BQU0sd0JBQWMsTUFBTTthQUM1RDtTQUNGO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFDRCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBVyxFQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELFFBQVEsRUFBRTtRQUNSLE9BQU8sRUFBRSxNQUFNO1FBQ2YsTUFBTSxFQUFFLG9CQUFVLElBQUk7UUFDdEIsVUFBVSxFQUFFLG9CQUFVLElBQUk7UUFDMUIsT0FBTyxFQUFFLE9BQU87UUFDaEIsSUFBSSxFQUFFLFVBQVU7UUFDaEIsVUFBVSxFQUFFLElBQUk7UUFDaEIsVUFBVSxFQUFFLFFBQVE7UUFDcEIsUUFBUSxFQUFFO1lBQ1IsR0FBRyxFQUFFO2dCQUNILElBQUksRUFBRSxDQUFDO2FBQ1I7U0FDRjtRQUNELEdBQUcsRUFBRTtZQUNILFNBQVMsRUFBRSxDQUFDO1lBQ1osWUFBWSxFQUFFLENBQUM7WUFDZixNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsUUFBUSxFQUFFLFFBQVE7WUFDbEIsWUFBWSxFQUFFLFVBQVU7WUFDeEIsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO1NBQ3ZDO1FBQ0QsWUFBWSxFQUFFO1lBQ1osVUFBVSxFQUFFLFNBQVM7WUFDckIsUUFBUSxFQUFFO2dCQUNSLFVBQVUsRUFBRSxTQUFTO2FBQ3RCO1lBQ0QsY0FBYyxFQUFFO2dCQUNkLFVBQVUsRUFBRSxTQUFTO2FBQ3RCO1NBQ0Y7UUFDRCxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFO1FBQzFCLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRSxNQUFNO1lBQ2QsUUFBUSxFQUFFLENBQUM7WUFDWCxPQUFPLEVBQUUsQ0FBQztZQUNWLElBQUksRUFBRSxHQUFHO1NBQ1Y7UUFDRCxFQUFFLEVBQUU7WUFDRixNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxDQUFDO1lBQ1QsUUFBUSxFQUFFLENBQUM7WUFDWCxPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsVUFBVSxFQUFFLFNBQVM7WUFDckIsTUFBTSxFQUFFLG1CQUFTLElBQUk7WUFDckIsVUFBVSxFQUFFLE1BQU07WUFDbEIsaUJBQWlCLEVBQUU7Z0JBQ2pCLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixZQUFZLEVBQUUsZUFBZTthQUM5QjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQVcsRUFBVSxFQUFFLENBQUMsQ0FBQztJQUM1RCxTQUFTLEVBQUU7UUFDVCxVQUFVLEVBQUUsSUFBSTtRQUNoQixPQUFPLEVBQUUsTUFBTTtRQUNmLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFNBQVMsRUFBRSx3QkFBd0I7UUFDbkMsWUFBWSxFQUFFLE9BQU87UUFDckIsT0FBTyxFQUFFLFdBQVc7UUFDcEIsUUFBUSxFQUFFLE1BQU07UUFDaEIsS0FBSyxFQUFFO1lBQ0wsS0FBSyxFQUFFLE1BQU07WUFDYixjQUFjLEVBQUUsVUFBVTtZQUMxQixPQUFPLEVBQUU7Z0JBQ1AsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsWUFBWSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDN0I7WUFDRCxFQUFFLEVBQUU7Z0JBQ0YsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLFVBQVUsRUFBRSxTQUFTO2dCQUNyQixVQUFVLEVBQUUsU0FBUztnQkFDckIsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLGtCQUFrQjtnQkFDbEIsRUFBRSxFQUFFO29CQUNGLE1BQU07b0JBQ04sZUFBZSxFQUFFO3dCQUNmLEtBQUssRUFBRSxRQUFRO3FCQUNoQjtvQkFDRCxjQUFjO29CQUNkLGVBQWUsRUFBRTt3QkFDZixPQUFPLEVBQUUsT0FBTztxQkFDakI7b0JBQ0QsVUFBVTtvQkFDVixlQUFlLEVBQUU7d0JBQ2YsV0FBVyxFQUFFLE1BQU07d0JBQ25CLE9BQU8sRUFBRSxFQUFFO3dCQUNYLFNBQVMsRUFBRSxLQUFLO3FCQUNqQjtvQkFDRCxjQUFjO29CQUNkLGVBQWUsRUFBRTt3QkFDZixLQUFLLEVBQUUsT0FBTztxQkFDZjtpQkFDRjtnQkFDRCxDQUFDLEtBQUssdUJBQVcsRUFBRSxDQUFDLEVBQUU7b0JBQ3BCLFlBQVksRUFBRSxnQkFBZ0I7aUJBQy9CO2FBQ0Y7WUFFRCxRQUFRLEVBQUU7Z0JBQ1IsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLFFBQVEsRUFBRTtvQkFDUixVQUFVLEVBQUUsU0FBUztpQkFDdEI7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLFVBQVUsRUFBRSxTQUFTO2lCQUN0QjtnQkFDRCxDQUFDLElBQUksd0JBQWEsQ0FBQyxFQUFFO29CQUNuQixVQUFVLEVBQUUsUUFBUTtpQkFDckI7YUFDRjtZQUNELENBQUMsSUFBSSxzQkFBVyxFQUFFLENBQUMsRUFBRTtnQkFDbkIsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTTtnQkFDcEMsUUFBUSxFQUFFLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRTthQUNwQztTQUNGO1FBQ0Qsc0JBQXNCO0tBQ3ZCO0lBQ0QsU0FBUyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRTtDQUNoQyxDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBVyxFQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELFFBQVEsRUFBRTtRQUNSLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLE9BQU8sRUFBRSxVQUFVO1FBQ25CLE1BQU0sb0JBQVk7UUFDbEIsWUFBWSxFQUFFLE1BQU07UUFDcEIsU0FBUyxFQUFFLG1CQUFtQjtRQUM5QixhQUFhLEVBQUU7WUFDYixPQUFPLEVBQUUsQ0FBQztZQUNWLE1BQU0sRUFBRSxPQUFPO1lBQ2YsVUFBVSxFQUFFLFNBQVM7U0FDdEI7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0MsWUFBWSxFQUFFO1FBQ1osVUFBVSxFQUFFLElBQUk7UUFDaEIsVUFBVSxFQUFFLG9CQUFVLElBQUk7UUFDMUIsSUFBSSxFQUFFO1lBQ0osT0FBTyxFQUFFLE9BQU87WUFDaEIsT0FBTyxFQUFFLE9BQU87WUFDaEIsUUFBUSxFQUFFO2dCQUNSLFVBQVUsRUFBRSxTQUFTO2FBQ3RCO1lBQ0QsY0FBYyxFQUFFO2dCQUNkLFVBQVUsRUFBRSxTQUFTO2FBQ3RCO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQVksRUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7SUFDM0QsVUFBVSxFQUFFO1FBQ1YsUUFBUSxFQUFFLFVBQVU7UUFDcEIsR0FBRyxFQUFFLENBQUM7UUFDTixJQUFJLEVBQUUsQ0FBQztRQUNQLEtBQUssRUFBRSxNQUFNO1FBQ2IsTUFBTSxFQUFFLE1BQU07UUFDZCxVQUFVLEVBQUUsV0FBVztRQUN2QixNQUFNLDBCQUFrQjtRQUN4QixRQUFRLEVBQUUsTUFBTTtLQUNqQjtJQUNELFVBQVUsRUFBRTtRQUNWLE1BQU0sc0JBQWM7UUFDcEIsWUFBWSxFQUFFLE1BQU07UUFDcEIsS0FBSyxFQUFFLGtCQUFrQjtRQUN6QixNQUFNLEVBQUUsa0JBQWtCO1FBQzFCLE1BQU0sRUFBRSxNQUFNO1FBQ2QsUUFBUSxFQUFFLFVBQVU7UUFDcEIsU0FBUyxFQUFFLE9BQU87UUFDbEIsUUFBUSxFQUFFLFFBQVE7UUFDbEIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1FBQ2xCLE9BQU8sRUFBRSxVQUFVO1FBQ25CLEdBQUcsR0FBRyxFQUFFO1FBQ1IsQ0FBQyxJQUFJLHlCQUFjLENBQUMsRUFBRTtZQUNwQixNQUFNLEVBQUUsbUJBQW1CO1NBQzVCO1FBQ0QsQ0FBQyxHQUFHLHFCQUFVLENBQUMsRUFBRTtZQUNmLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLEtBQUssRUFBRSxPQUFPO1lBQ2QsR0FBRyxFQUFFLE9BQU87WUFDWixRQUFRLEVBQUUsTUFBTTtTQUNqQjtRQUNELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxDQUFDO1lBQ1QsTUFBTSxFQUFFLE9BQU87WUFDZixRQUFRLEVBQUUsU0FBUztZQUNuQixPQUFPLEVBQUUsVUFBVTtZQUNuQixVQUFVLEVBQUUsU0FBUztZQUNyQixTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFO1lBQzlCLE9BQU8sRUFBRTtnQkFDUCxPQUFPLEVBQUUsVUFBVTthQUNwQjtTQUNGO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLENBQUM7WUFDUCxNQUFNLEVBQUUsR0FBRztZQUNYLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxXQUFXO1FBQ1gseUJBQXlCO1FBQ3pCLHNCQUFzQjtRQUN0QixrQ0FBa0M7UUFDbEMsOENBQThDO1FBQzlDLEtBQUs7UUFDTCxlQUFlO1FBQ2YsZ0NBQWdDO1FBQ2hDLEtBQUs7UUFDTCxLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsT0FBTztZQUNmLE9BQU8sRUFBRSxNQUFNO1lBQ2YsYUFBYSxFQUFFLGFBQWE7WUFDNUIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsVUFBVSxFQUFFLFNBQVM7WUFDckIsTUFBTSxFQUFFO2dCQUNOLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU07YUFDL0I7WUFDRCxFQUFFLEVBQUU7Z0JBQ0YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLE1BQU07YUFDZjtTQUNGO1FBQ0QsVUFBVSxFQUFFLEVBQUU7UUFDZCxVQUFVLEVBQUUsRUFBRTtLQUNmO0lBQ0QsQ0FBQyxHQUFHLDZCQUFtQixDQUFDLEVBQUU7UUFDeEIsVUFBVSxFQUFFO1lBQ1YsS0FBSyxFQUFFLEtBQUs7WUFDWixRQUFRLEVBQUUsQ0FBQyw4QkFBb0IsRUFBRSxDQUFDLEdBQUcsSUFBSTtZQUN6QyxNQUFNLEVBQUUsY0FBYztZQUN0QixNQUFNLEVBQUUsT0FBTztZQUNmLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsVUFBVSxFQUFFLEVBRVg7WUFDRCxpQkFBaUI7WUFDakIsTUFBTSxFQUFFO2dCQUNOLEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLE1BQU0sRUFBRSxtQkFBbUI7Z0JBQzNCLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixRQUFRLEVBQUUsT0FBTztnQkFDakIsR0FBRyxHQUFHLEVBQUU7YUFDVDtZQUNELEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsS0FBSztnQkFDWixRQUFRLEVBQUUsUUFBUTthQUNuQjtZQUNELEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsS0FBSzthQUNiO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLEtBQUssRUFBRSxLQUFLO2dCQUNaLFFBQVEsRUFBRSxPQUFPO2FBQ2xCO1NBQ0Y7S0FDRjtJQUNELENBQUMsR0FBRyw4QkFBbUIsQ0FBQyxFQUFFO1FBQ3hCLFVBQVUsRUFBRTtZQUNWLE9BQU8sRUFBRSxZQUFZO1lBQ3JCLEtBQUssRUFBRTtnQkFDTCxNQUFNLEVBQUUsb0JBQW9CO2FBQzdCO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLE1BQU0sRUFBRSxvQkFBb0I7YUFDN0I7U0FDRjtLQUNGO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsR0FBRyxHQUFHLEVBQUU7UUFDUixNQUFNLEVBQUUsTUFBTTtRQUNkLEtBQUssRUFBRSxLQUFLO1FBQ1osVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1FBQ2xCLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxDQUFDO1lBQ1QsT0FBTyxFQUFFLE1BQU07WUFDZixVQUFVLEVBQUUsU0FBUztZQUNyQixZQUFZLEVBQUUsaUJBQWlCO1NBQ2hDO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLENBQUM7U0FDUjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEdBQVcsRUFBRSxDQUFDLENBQUM7SUFDbEMsVUFBVSxFQUFFO1FBQ1YsT0FBTyxFQUFFLE1BQU07UUFDZixhQUFhLEVBQUUsS0FBSztRQUNwQixLQUFLLEVBQUUsRUFBRTtRQUNULEtBQUssRUFBRTtZQUNMLE9BQU8sRUFBRSxLQUFLO1lBQ2QsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQztZQUNwQixRQUFRLEVBQUUsTUFBTTtZQUNoQixLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFO1NBQzdCO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFZLEVBQVMsRUFBRSxDQUFDLENBQUM7SUFDbEQsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0NBQ2hCLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQWEsRUFBUyxFQUFFLENBQUMsQ0FBQztJQUMxRCxRQUFRLEVBQUU7UUFDUixVQUFVLEVBQUUsQ0FBQztLQUNkO0lBQ0QsTUFBTSxFQUFFO1FBQ04sVUFBVSxFQUFFLENBQUM7S0FDZDtJQUNELENBQUMsSUFBSSx3QkFBWSxDQUFDLEVBQUU7UUFDbEIsU0FBUyxFQUFFLHFCQUFxQixDQUFDLEVBQUU7S0FDcEM7Q0FDRixDQUFDLENBQUE7QUFDRixNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFXLEVBQVUsRUFBRSxDQUFDLENBQUM7SUFDMUQsU0FBUyxFQUFFO1FBQ1QsS0FBSyxFQUFFLE1BQU07UUFDYixtQkFBbUI7UUFDbkIsT0FBTyxFQUFFLENBQUM7UUFDVixNQUFNLEVBQUUsQ0FBQztRQUNULFFBQVEsRUFBRSxlQUFlO1FBQ3pCLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNoQixZQUFZLEVBQUUsR0FBRztRQUNqQixJQUFJLEVBQUU7WUFDSixTQUFTLEVBQUUsT0FBTztZQUNsQixHQUFHLEdBQUcsRUFBRTtZQUNSLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNkLFlBQVksRUFBRSxpQkFBaUI7WUFDL0IsZ0JBQWdCLEVBQUUsR0FBRztZQUNyQixDQUFDLEdBQUcsb0JBQVMsQ0FBQyxFQUFFO2dCQUNkLElBQUksRUFBRSxTQUFTO2dCQUNmLDJCQUEyQjtnQkFDM0IsT0FBTyxFQUFFLFdBQVc7Z0JBQ3BCLFdBQVcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUN4QixnQkFBZ0IsRUFBRSxFQUFFLE9BQU8sRUFBRSxZQUFZLEdBQUc7YUFDN0M7WUFDRCxXQUFXO1lBQ1gsYUFBYTtZQUNiLGdDQUFnQztZQUNoQyx5QkFBeUI7WUFDekIsS0FBSztZQUNMLHVCQUF1QjtZQUN2Qiw2QkFBNkI7WUFDN0IsS0FBSztTQUNOO1FBQ0QsK0RBQStEO0tBQ2hFO0lBQ0QsaUJBQWlCO0lBQ2pCLGlDQUFpQztJQUNqQyxtQ0FBbUM7SUFDbkMsMkJBQTJCO0lBQzNCLFdBQVc7SUFDWCxZQUFZO0lBQ1osaUNBQWlDO0lBQ2pDLHFEQUFxRDtJQUNyRCxlQUFlO0lBQ2YsZ0NBQWdDO0lBQ2hDLHVCQUF1QjtJQUN2QixnRUFBZ0U7SUFDaEUsNkJBQTZCO0lBQzdCLFNBQVM7SUFDVCw2QkFBNkI7SUFDN0IsTUFBTTtDQUNQLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBVyxFQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3JFLE9BQU8sRUFBRTtRQUNQLE9BQU8sRUFBRSxDQUFDO1FBQ1YsT0FBTyxFQUFFLE1BQU07UUFDZixRQUFRLEVBQUUsVUFBVTtRQUNwQixRQUFRLEVBQUUsYUFBYTtRQUN2QixHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDaEIsWUFBWSxFQUFFLElBQUk7UUFFbEIsTUFBTTtRQUNOLEdBQUcsRUFBRTtZQUNILE9BQU8sRUFBRSxNQUFNO1lBQ2YsYUFBYSxFQUFFLEtBQUs7WUFDcEIsTUFBTSxFQUFFLEtBQUs7WUFDYixVQUFVLEVBQUUsUUFBUTtZQUNwQixPQUFPLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLEtBQUssRUFBRSxDQUFDO2FBQ1Q7WUFDRCxNQUFNO1lBQ04sR0FBRyxFQUFFO2dCQUNILDJCQUEyQjtnQkFDM0IsT0FBTyxFQUFFLEdBQUcscUJBQVcsTUFBTSxxQkFBVyxJQUFJO2dCQUM1QyxZQUFZLEVBQUUsQ0FBQztnQkFDZixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsWUFBWSxFQUFFLFVBQVU7Z0JBQ3hCLE1BQU0sRUFBRSxDQUFDO2dCQUNULE1BQU0sRUFBRSxNQUFNO2dCQUNkLE1BQU0sRUFBRSxNQUFNO2dCQUNkLFdBQVcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUN4QixZQUFZLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDekIsVUFBVSxFQUFFLENBQUM7YUFDZDtZQUNELENBQUMsR0FBRyxvQkFBUyxDQUFDLEVBQUU7Z0JBQ2QsSUFBSSxFQUFFLFNBQVM7YUFDaEI7U0FDRjtRQUNELElBQUksRUFBRTtZQUNKLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNkLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsQ0FBQyxJQUFJLGlCQUFNLGdCQUFnQixDQUFDLEVBQUU7Z0JBQzVCLE9BQU8sRUFBRSxhQUFhO2FBQ3ZCO1NBQ0Y7UUFDRCxLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsS0FBSztZQUNiLE1BQU0sc0JBQWM7WUFDcEIsVUFBVSxFQUFFLElBQUk7WUFDaEIsVUFBVSxFQUFFLEdBQUc7WUFDZixRQUFRLEVBQUUsYUFBYTtZQUN2QixRQUFRLEVBQUUsUUFBUTtZQUNsQixHQUFHLEVBQUUsQ0FBQztZQUNOLE1BQU07WUFDTixJQUFJLEVBQUU7Z0JBQ0osUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLENBQUMsR0FBRyx3QkFBYSxDQUFDLEVBQUU7b0JBQ2xCLFFBQVEsRUFBRSxVQUFVO29CQUNwQixVQUFVLEVBQUUsS0FBSztvQkFDakIsS0FBSyxFQUFFLEtBQUs7b0JBQ1osR0FBRyxFQUFFLENBQUM7b0JBQ04sVUFBVSxFQUFFLGlDQUFpQztvQkFDN0MsTUFBTSxFQUFFLE1BQU07aUJBQ2Y7Z0JBQ0QsQ0FBQyxHQUFHLDBCQUFjLENBQUMsRUFBRTtvQkFDbkIsTUFBTSxFQUFFLFlBQVk7b0JBQ3BCLFFBQVEsRUFBRSxVQUFVO29CQUNwQixLQUFLLEVBQUUsQ0FBQztvQkFDUixHQUFHLEVBQUUsQ0FBQztvQkFDTixLQUFLLEVBQUUsS0FBSztvQkFDWixNQUFNLHNCQUFjO29CQUNwQixNQUFNLEVBQUUsTUFBTTtpQkFDZjthQUNGO1NBQ0Y7UUFDRCxDQUFDLElBQUkseUJBQWEsQ0FBQyxFQUFFO1lBQ25CLENBQUMsR0FBRyxvQkFBUyxDQUFDLEVBQUU7Z0JBQ2QsTUFBTTtnQkFDTixDQUFDLEdBQUcsbUJBQVMsQ0FBQyxFQUFFO29CQUNkLE1BQU0sRUFBRSxhQUFhLEVBQUUsRUFBRTtpQkFDMUI7Z0JBQ0QsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO29CQUN2QixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Z0JBQ0QsQ0FBQyxHQUFHLG9CQUFTLENBQUMsRUFBRTtvQkFDZCxTQUFTLEVBQUUsTUFBTTtvQkFDakIsVUFBVSxFQUFFLE1BQU07aUJBQ25CO2FBQ0Y7WUFDRCxvQkFBb0I7WUFDcEIsVUFBVTtZQUNWLHNCQUFzQjtZQUN0QixhQUFhO1lBQ2Isd0JBQXdCO1lBQ3hCLGtDQUFrQztZQUNsQyxTQUFTO1lBQ1QsT0FBTztZQUNQLEtBQUs7U0FDTjtRQUNELFFBQVEsRUFBRTtZQUNSLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsTUFBTTtnQkFDYixJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRTthQUNsRDtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUFDLEdBQVk7SUFDL0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ1gsT0FBTztRQUNMLFNBQVMsRUFBRTtZQUNULFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxDQUFDO1lBQ1osU0FBUyxFQUFFLE1BQU07WUFDakIsbUJBQW1CLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFO1lBQ3hDLGVBQWUsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7WUFDcEMsT0FBTyxFQUFFLE1BQU07WUFDZixDQUFDLElBQUksb0JBQVMsSUFBSSxzQkFBVyxFQUFFLENBQUMsRUFBRTtnQkFDaEMsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLE1BQU0sRUFBRSxDQUFDO2FBQ1Y7U0FDRjtRQUNELFVBQVUsRUFBRTtZQUNWLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLFlBQVksRUFBRSxLQUFLO1lBQ25CLE1BQU0sRUFBRSxnQkFBZ0I7WUFDeEIsWUFBWSxFQUFFLEtBQUs7WUFDbkIsYUFBYSxFQUFFLEtBQUs7WUFDcEIsS0FBSyxFQUFFO2dCQUNMLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixVQUFVLEVBQUUsU0FBUztnQkFDckIsTUFBTSxFQUFFLGVBQWU7Z0JBQ3ZCLFlBQVksRUFBRSxLQUFLO2FBQ3BCO1NBQ0Y7UUFDRCxrQkFBa0IsRUFBRTtZQUNsQixnQkFBZ0I7WUFDaEIsS0FBSyxFQUFFO2dCQUNMLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixLQUFLLEVBQUU7b0JBQ0wsT0FBTyxFQUFFLE9BQU87b0JBQ2hCLFlBQVksRUFBRSxNQUFNO29CQUNwQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsVUFBVSxFQUFFLFFBQVE7aUJBQ3JCO2dCQUNELEtBQUssRUFBRTtvQkFDTCx5QkFBeUI7b0JBQ3pCLElBQUksRUFBRSxLQUFLO29CQUNYLEtBQUssRUFBRSxNQUFNO2lCQUNkO2dCQUNELE1BQU0sRUFBRTtvQkFDTixVQUFVLEVBQUUsR0FBRztvQkFDZixVQUFVLEVBQUUsMERBQTBEO29CQUN0RSxRQUFRLEVBQUUsVUFBVTtvQkFDcEIsS0FBSyxFQUFFLE1BQU07aUJBQ2Q7Z0JBQ0QsZUFBZSxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTthQUN4QztZQUNELGNBQWM7WUFDZCxLQUFLLEVBQUU7Z0JBQ0wsWUFBWSxFQUFFLE1BQU07Z0JBRXBCLEtBQUssRUFBRTtvQkFDTCxPQUFPLEVBQUUsY0FBYztvQkFDdkIsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFVBQVUsRUFBRSxRQUFRO29CQUNwQixLQUFLLEVBQUUsS0FBSztvQkFDWixNQUFNLEVBQUUsQ0FBQztvQkFDVCxTQUFTLEVBQUUsS0FBSztvQkFDaEIsWUFBWSxFQUFFLE1BQU07aUJBQ3JCO2dCQUNELGVBQWUsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7Z0JBQ3ZDLEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsQ0FBQztvQkFDVCxLQUFLLEVBQUUsS0FBSztpQkFDYjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sVUFBVSxFQUFFLENBQUM7b0JBQ2IsYUFBYSxFQUFFLFFBQVE7b0JBQ3ZCLFFBQVEsRUFBRSxVQUFVO29CQUNwQixLQUFLLEVBQUUsTUFBTTtpQkFDZDthQUNGO1NBQ0Y7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQUNELE1BQU0sVUFBVSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQVc7SUFDbkMsT0FBTztRQUNMLFFBQVEsRUFBRTtZQUNSLEdBQUcsR0FBRyxFQUFFO1lBQ1IsUUFBUSxFQUFFO2dCQUNSLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixDQUFDLE1BQU0sa0JBQU8sRUFBRSxDQUFDLEVBQUU7b0JBQ2pCLEtBQUssRUFBRSxPQUFPO29CQUNkLE9BQU8sRUFBRSxDQUFDO29CQUNWLE1BQU0sRUFBRSxvQkFBVSxLQUFLO29CQUN2QixRQUFRLEVBQUUsRUFFVDtpQkFDRjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxNQUFNLGtCQUFPLEVBQUUsQ0FBQyxFQUFFO3dCQUNqQixPQUFPLEVBQUUsQ0FBQztxQkFDWDtpQkFDRjthQUNGO1lBQ0QsQ0FBQyxHQUFHLG9CQUFTLENBQUMsRUFBRTtnQkFDZCxNQUFNLEVBQUUsZUFBZSxpQkFBTyxLQUFLO2FBQ3BDO1NBQ0Y7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQUNELE1BQU0sVUFBVSxjQUFjLENBQUMsR0FBWTtJQUN6QyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDWixPQUFPO1FBQ0wsV0FBVyxFQUFFO1lBQ1gsUUFBUSxFQUFFLFVBQVU7WUFDcEIsT0FBTyxFQUFFLGNBQWM7WUFDdkIsS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixLQUFLLEVBQUUsT0FBTztnQkFDZCxHQUFHLEVBQUUsT0FBTzthQUNiO1lBQ0QsR0FBRyxFQUFFO2dCQUNILFFBQVEsRUFBRSxNQUFNO2dCQUNoQixTQUFTLEVBQUUsTUFBTTtnQkFDakIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsT0FBTyxFQUFFLE9BQU87YUFDakI7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLGtCQUFrQjtnQkFDekIsTUFBTSxFQUFFLGtCQUFrQjtnQkFDMUIsTUFBTSxFQUFFLG9CQUFvQjtnQkFDNUIsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLFVBQVUsRUFBRSxPQUFPO2lCQUNwQjthQUNGO1NBQ0Y7UUFFRCxDQUFDLE1BQU0sbUNBQWMsRUFBRSxDQUFDLEVBQUU7WUFDeEIsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtTQUMzQjtRQUNELFdBQVcsRUFBRTtZQUNYLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxRQUFRO1lBQ25CLEtBQUssRUFBRSxNQUFNO1lBQ2IsTUFBTSxFQUFFLE1BQU07WUFDZCxLQUFLLEVBQUU7Z0JBQ0wsT0FBTyxFQUFFLE1BQU07YUFDaEI7WUFDRCxDQUFDLEdBQUcsc0JBQVcsQ0FBQyxFQUFFO2dCQUNoQixNQUFNLEVBQUUsQ0FBQztnQkFDVCxLQUFLLEVBQUUsTUFBTTtnQkFDYixNQUFNLEVBQUUsTUFBTTtnQkFDZCxZQUFZLEVBQUUsTUFBTTtnQkFDcEIsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLEtBQUssRUFBRSxDQUFDO2dCQUNSLE1BQU0sRUFBRSxDQUFDO2FBQ1Y7WUFDRCxDQUFDLEdBQUcsb0JBQVMsQ0FBQyxFQUFFO2dCQUNkLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixVQUFVLEVBQUUsTUFBTTtnQkFDbEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLE1BQU0sRUFBRSxDQUFDO2dCQUNULFVBQVUsRUFBRSxNQUFNO2dCQUNsQixLQUFLLEVBQUUsTUFBTTtnQkFDYixNQUFNLEVBQUUsTUFBTTtnQkFDZCxLQUFLLEVBQUUsTUFBTTtnQkFDYixZQUFZLEVBQUUsS0FBSztnQkFDbkIsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTthQUN2QjtTQUdGO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFDRCxNQUFNLFVBQVUsU0FBUztJQUN2QixPQUFPO1FBQ0wsT0FBTyxFQUFFO1lBQ1AsQ0FBQyxHQUFHLG9CQUFTLENBQUMsRUFBRTtnQkFDZCxPQUFPLEVBQUUsTUFBTTthQUNoQjtZQUNELENBQUMsR0FBRyxvQkFBUyxDQUFDLEVBQUU7Z0JBQ2QsQ0FBQyxLQUFLLGVBQUksS0FBSyxpQkFBTSxFQUFFLENBQUMsRUFBRTtvQkFDeEIsT0FBTyxFQUFFLE9BQU87aUJBQ2pCO2FBQ0Y7U0FDRjtLQUNGLENBQUE7QUFDSCxDQUFDO0FBQ0QsTUFBTSxVQUFVLFFBQVEsQ0FBQyxHQUFZO0lBQ25DLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNWLE9BQU87UUFDTCxPQUFPLEVBQUU7WUFDUCxPQUFPLEVBQUUsY0FBYztZQUN2QixDQUFDLEdBQUcsc0JBQVMsQ0FBQyxFQUFFO2dCQUNkLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixNQUFNLHdCQUFnQjthQUN2QjtZQUNELENBQUMsR0FBRyxtQkFBUyxDQUFDLEVBQUU7Z0JBQ2QsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtLQUNGLENBQUE7QUFDSCxDQUFDO0FBQ0QsTUFBTSxVQUFVLE1BQU0sQ0FBQyxHQUFZO0lBQ2pDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNWLE9BQU87UUFDTCxDQUFDLE1BQU0sb0JBQVEsRUFBRSxDQUFDLEVBQUU7WUFDbEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsT0FBTyxFQUFFLGNBQWM7WUFDdkIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsb0JBQW9CO1lBQ3BCLG1CQUFtQjtZQUNuQixLQUFLO1lBQ0wsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixNQUFNLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDO2dCQUNyQixVQUFVLEVBQUUsUUFBUTtnQkFDcEIsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLE9BQU8sRUFBRSxNQUFNO2dCQUNmLE1BQU0sRUFBRSxNQUFNO2dCQUNkLENBQUMsR0FBRyxxQkFBVSxDQUFDLEVBQUU7b0JBQ2YsVUFBVSxFQUFFLE1BQU07aUJBQ25CO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixRQUFRLEVBQUUsYUFBYTtnQkFDdkIsTUFBTSx3QkFBZ0I7YUFDdkI7WUFDRCxTQUFTO1lBQ1QsS0FBSyxFQUFFLEVBRU47WUFDRCxZQUFZO1lBQ1osS0FBSyxFQUFFLEVBRU47WUFDRCxLQUFLLEVBQUU7Z0JBQ0wsVUFBVSxFQUFFLE1BQU07Z0JBQ2xCLEtBQUssRUFBRSxTQUFTO2FBQ2pCO1NBQ0Y7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFXLEVBQVUsRUFBRSxDQUFDLENBQUM7SUFDbEQsVUFBVSxFQUFFO1FBQ1Ysa0JBQWtCO1FBQ2xCLE9BQU8sRUFBRSxNQUFNO1FBQ2YsRUFBRSxFQUFFO1lBQ0YsSUFBSSxFQUFFLEtBQUs7WUFDWCxNQUFNLEVBQUUsTUFBTTtTQUNmO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7U0FDcEM7UUFDRCxLQUFLLEVBQUU7WUFDTCxhQUFhLEVBQUUsUUFBUTtZQUN2QixFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRztTQUNuQztRQUNELEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRTtLQUNwQztDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQVUsRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0QsSUFBSSxFQUFFO1FBQ0osK0JBQStCO1FBQy9CLFVBQVUsZ0NBQU07S0FDakI7SUFDRCxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO0lBQ25CLE1BQU0sRUFBRTtRQUNOLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLEtBQUssRUFBRSxTQUFTO1FBQ2hCLE1BQU0sRUFBRSxNQUFNO1FBQ2QsUUFBUSxFQUFFLFNBQVM7UUFDbkIsVUFBVSxFQUFFLFNBQVM7S0FDdEI7SUFDRCxDQUFDLEVBQUU7UUFDRCxLQUFLLEVBQUUsU0FBUztRQUNoQixjQUFjLEVBQUUsTUFBTTtLQUN2QjtJQUNELEVBQUUsRUFBRTtRQUNGLFdBQVcsRUFBRSxPQUFPO1FBQ3BCLGFBQWE7UUFDYixrQkFBa0I7UUFDbEIsaUNBQWlDO1FBQ2pDLGdDQUFnQztLQUNqQztJQUNELEtBQUssRUFBRTtRQUNMLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLEtBQUssRUFBRSxTQUFTO1FBQ2hCLE1BQU0sRUFBRSxNQUFNO0tBQ2Y7SUFDRCxHQUFHLEVBQUU7UUFDSCxTQUFTLEVBQUUsWUFBWTtLQUN4QjtJQUNELEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUU7SUFDekIsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtJQUMxQixFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFO0lBQ3pCLFdBQVcsRUFBRTtRQUNYLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLEtBQUssRUFBRSxNQUFNO1FBQ2IsR0FBRyxFQUFFLE1BQU07S0FDWjtJQUNELFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRTtJQUN2QyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ2YsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUNmLFdBQVcsRUFBRSxNQUFNLEVBQUU7SUFDckIsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtJQUMzQixDQUFDLEdBQUcsMkJBQWdCLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRTtDQUMzRCxDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFVLEVBQUUsRUFBRSxDQUNsQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ1YsSUFBSSxDQUFDLENBQ0wsTUFBTSxDQUFDLENBQ1AsUUFBUSxDQUFDLENBQ1QsTUFBTSxDQUFDLENBQ1AsS0FBSyxDQUFDLENBQ04sT0FBTyxDQUFDLENBQ1IsT0FBTyxDQUFDLENBQ1IsS0FBSyxDQUFDLENBQ04sR0FBRyxDQUFDLENBQ0osS0FBSyxDQUFDLENBQ04sTUFBTSxDQUFDLENBQ1AsSUFBSSxDQUFDLENBQ0wsS0FBSyxDQUFDLENBQ04sY0FBYyxDQUFDLENBQ2YsS0FBSyxDQUFDLENBQ04sTUFBTSxDQUFDLENBQ1AsSUFBSSxDQUFDLENBQ0wsS0FBSyxDQUFDLENBQ04sR0FBRyxDQUFDLENBQUM7QUFDViwyQkFBMkI7QUFDM0IsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFZO0lBQ2hDLEVBQUUsRUFBRSxTQUFTO0lBQ2IsRUFBRSxFQUFFLE1BQU07SUFDVixLQUFLLEVBQUUsU0FBUztJQUNoQixJQUFJLEVBQUUsRUFBRTtJQUNSLFFBQVEsRUFBRSxTQUFTO0lBQ25CLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUM3QixLQUFLLEVBQUU7UUFDTCxFQUFFLEVBQUUsRUFBRTtRQUNOLEVBQUUsRUFBRSxFQUFFO0tBQ1A7SUFDRCxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUMzQixFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtJQUNqQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3ZELENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRTNDLE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBWTtJQUNqQyxFQUFFLEVBQUUsTUFBTTtJQUNWLEVBQUUsRUFBRSxNQUFNO0lBQ1YsS0FBSyxFQUFFLFNBQVM7SUFDaEIsSUFBSSxFQUFFLFNBQVM7SUFDZixRQUFRLEVBQUUsU0FBUztJQUNuQixJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7SUFDM0UsS0FBSyxFQUFFO1FBQ0wsRUFBRSxFQUFFLFNBQVM7UUFDYixFQUFFLEVBQUUsU0FBUztLQUNkO0lBQ0QsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7SUFDMUIsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEdBQUc7SUFDakQsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFO0lBQy9FLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDdkQsQ0FBQTtBQUNELDRCQUE0QjtBQUM1QixNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDIn0=