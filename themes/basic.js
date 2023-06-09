import { rgb, rgba } from "galho";
import { bfg, border, box, spc, styleCtx } from "../style.js";
export const col = (inline) => ({
    display: (inline ? "inline-" : "") + "flex",
    flexDirection: "column"
}), row = (inline) => ({
    display: (inline ? "inline-" : "") + "flex",
    flexDirection: "row"
}), center = () => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    translate: "-50% -50%",
}), min = (size) => `@media (min-width: ${size}px)`, max = (size) => `@media (max-width: ${size}px)`;
export const icon = () => ({
    ".icon": {
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
        [`.${"icon" /* C.icon */}`]: {
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
        [`&.${"icon" /* C.icon */}>.${"icon" /* C.icon */}`]: {
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
            [`.${"icon" /* C.icon */}`]: {
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
            ["." + "icon" /* C.icon */]: {},
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
export const pcModal = (ctx) => (ctx(button), {
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
                maxHeight: "unset",
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
    }
});
/**@deprecated */
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
        // overflow: "auto scroll",
        overflow: "auto",
        ...listHelper(l),
        counterReset: "tb",
        //line
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
            // overflow: "auto",
            ".tr": {
                width: "100%",
                ".i": { flexGrow: 1, flexShrink: 1, minWidth: 0 },
            }
        }
    },
    "._.tr": {
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
            minWidth: 0
        },
        ["." + "sd" /* C.side */]: {
            flex: "0 0 2em"
        }
    },
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
            // margin: "6px -6px 6px 0",
            paddingRight: "6px",
            paddingBottom: "1px",
            border: border("#0005", 3),
            legend: {
                fontWeight: "bold"
                // padding: ".4em 2em",
                // background: "#cfd8dc",
                // margin: "0 -6px 10px 0",
                // borderRadius: "4px"
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
            ["." + "icon" /* C.icon */]: {
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
export const core = (p) => styleCtx(p, ">")({
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
    "span._.col": col(true),
    "._.center": center(),
    "._.ph": { color: "#000A" },
    ["." + "_w" /* Color.warning */]: { background: "#ffc107!important" },
});
export const style = (p) => core(p)(icon)(menu)(button)(dropdown)(select)(input)(menubar)(menurow)(tab)(index)(output)(list)(table)(mobImgSelector)(stack)(loader)(form)(modal)(pcModal)(tip);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBaUIsTUFBTSxPQUFPLENBQUM7QUFHakQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQVksTUFBTSxhQUFhLENBQUM7QUF1QnhFLE1BQU0sQ0FBQyxNQUNMLEdBQUcsR0FBRyxDQUFDLE1BQWEsRUFBUyxFQUFFLENBQUMsQ0FBQztJQUMvQixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTTtJQUMzQyxhQUFhLEVBQUUsUUFBUTtDQUN4QixDQUFDLEVBQ0YsR0FBRyxHQUFHLENBQUMsTUFBYSxFQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNO0lBQzNDLGFBQWEsRUFBRSxLQUFLO0NBQ3JCLENBQUMsRUFDRixNQUFNLEdBQUcsR0FBVSxFQUFFLENBQUMsQ0FBQztJQUNyQixRQUFRLEVBQUUsVUFBVTtJQUNwQixJQUFJLEVBQUUsS0FBSztJQUNYLEdBQUcsRUFBRSxLQUFLO0lBQ1YsU0FBUyxFQUFFLFdBQVc7Q0FDdkIsQ0FBQyxFQUNGLEdBQUcsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsc0JBQXNCLElBQUksS0FBSyxFQUNwRCxHQUFHLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixJQUFJLEtBQUssQ0FBQztBQXFDdkQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDLENBQUM7SUFDakMsT0FBTyxFQUFFO1FBQ1AsTUFBTSxFQUFFLE9BQU87UUFDZixh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RUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO0lBQzFCLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxHQUFHO0lBQ2pELEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRTtJQUMvRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3ZELENBQUE7QUFDRCw0QkFBNEI7QUFDNUIsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyJ9