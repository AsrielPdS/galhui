import { rgb, rgba } from "galho";
import { bfg, border, box, spc, styleCtx } from "../style.js";
import chroma from "chroma-js";
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
        "&.xxl": {
            height: "10em",
        },
        "&.xl": {
            height: "6em",
        },
        "&.l": {
            height: "2em",
        }
    }
});
/**black or white */
function borw(color, v1, v2) {
    return chroma.contrast(color, v1) >= 4.5 ? v1 : v2;
}
function state(v) {
    return {
        background: v.n,
        color: v.txt,
        ":hover": { background: v.h },
        ":visited": { background: v.v },
        ":active": { background: v.a },
    };
}
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
        // ...box([0, .25, 0, 0], [.78, 1.5]),
        margin: "0 .15em",
        padding: ".78em 1.5em",
        whiteSpace: "nowrap",
        height: "initial",
        textAlign: "center",
        ["&." + "full" /* C.full */]: { display: "block", width: "auto" },
        [`.${"icon" /* C.icon */}`]: { marginRight: ".5em", },
        ...state(ctx.bt),
        [`&.${"_a" /* Color.accept */}`]: state(ctx.accept),
        [`&.${"_i" /* Color.main */}`]: state(ctx.main),
        [`&.${"_e" /* Color.error */}`]: state(ctx.error),
        [`&.${"icon" /* C.icon */}>.${"icon" /* C.icon */}:only-child`]: {
            margin: "0 -.6em",
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
export const input = ({ in: { bg, fg, border } }) => ({
    "textarea._.in": {
        height: "6em",
        resize: "vertical",
    },
    "div._.in": { display: "flex", },
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
});
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
export const output = ({ in: { border }, bt, accept: a, error: e }) => ({
    "._.out": {
        fontSize: ".9em",
        borderRadius: 0.2 /* $.acentBordRad */ + "em",
        ...box([.1, .2], [.1, .4]),
        background: bt.n,
        color: bt.txt,
        display: "inline-block",
        ":empty": { display: "none" },
        // [`&.${Color.accept}`]: state(ctx.accept),
        [`&.${"_i" /* Color.main */}`]: { background: a.n, color: a.txt },
        [`&.${"_e" /* Color.error */}`]: { background: e.n, color: e.txt },
        "tr&": {
            display: "table-row",
            td: {
                padding: spc([.4, .8])
            }
        }
    },
    [`._.${"msg" /* C.message */}`]: {
        [`&.${"_e" /* Color.error */}`]: {
            ...bfg("rgb(255, 246, 246)", "rgb(159, 58, 56)" /* $.error */),
        },
        ...box([1, 0], [1, 1.5]),
        ":empty": { height: 0, padding: 0, margin: 0 },
        transition: "all .2s"
    },
    "div._.join": { display: "flex" },
    "._.join": {
        display: "inline-flex",
        flexDirection: "row",
        //para os filhos não removerem bordas do parent
        overflow: "hidden",
        padding: 0,
        "*": {
            // border: "none",
            flex: "1 auto",
            margin: 0,
            borderRadius: 0,
            // paddingLeft: ".5em",
            // paddingRight: ".5em",
            width: "100%"
        },
        ">:not(:last-child)": {
            borderRight: `1px solid ${border.n}`,
        },
        ">:first-child": {
            // paddingLeft: "1.5em",
            borderRadius: `${0.2 /* $.acentBordRad */}em 0 0 ${0.2 /* $.acentBordRad */}em`,
        },
        ">:last-child": {
            // paddingRight: "1.5em",
            borderRadius: `0 ${0.2 /* $.acentBordRad */}em ${0.2 /* $.acentBordRad */}em 0`,
        },
    },
});
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
        ".hd": { fontWeight: "bold" },
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
        textAlign: "start",
        // minWidth: "16em",
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
                        // minWidth: ".5em",
                        width: "1.5em",
                    },
                    //main content
                    ":nth-child(2)": {
                        padding: "3px 0"
                    },
                    //shortcut
                    ":nth-child(3)": {
                        opacity: .7,
                        textAlign: "end",
                        ".bt": {
                            padding: "2px 12px",
                            margin: 0,
                            background: "none",
                            ":hover": { color: "#888" }
                        },
                        "&:not(:empty)": {
                            paddingLeft: "1rem",
                        }
                    },
                    //submenu icon
                    ":nth-child(4)": {
                        minWidth: ".5em",
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
                    color: "#0008",
                    background: "inherit"
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
    "::backdrop,._.blank": {
        position: "fixed",
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
        border: "none",
        padding: 0,
        ...row(),
        // width: "calc(100% - 1em)",
        // height: "calc(100% - 1em)",
        // margin: ".5em",
        // position: "relative",
        textAlign: "start",
        overflow: "hidden",
        background: ctx.bg,
        ["&." + "_e" /* Color.error */]: {
            border: "4px solid #e53935"
        },
        ["." + "cl" /* C.close */]: {
            position: "absolute",
            right: ".4rem",
            top: ".1rem",
            fontSize: "14pt",
        },
        "&.xl,&.l": {},
        "&.xs,&.s": {
            form: {
                ".bd": { minHeight: "4em" },
                ".ft": {
                    height: "unset",
                    padding: 0,
                    background: "none"
                }
            }
        },
        form: {
            width: "100%",
            ...col(),
            padding: ".2em 1em",
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
        },
        "&.no-margin>form": {
            padding: 0,
            ".hd": { margin: 0 },
            ".ft": { margin: 0 },
        },
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
    },
    "body.dialog-on": { overflow: "hidden!important" }
});
export const pcModal = (ctx) => (ctx(button), {
    [min(768 /* ScreenSize.tablet */)]: {
        "._.modal": {
            width: "55%",
            maxWidth: (768 /* ScreenSize.tablet */ - 20) + "px",
            // margin: "3em auto 2em",
            height: "fit-content",
            maxHeight: "calc(100% - 5em)",
            "&.scroll": {},
            /**full screen */
            "&.xl": {
                width: "calc(100% - 3rem)",
                height: "calc(100% - 3rem)",
                // margin: "1.5rem",
                maxWidth: "unset",
                maxHeight: "unset",
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
            form: {
                padding: ".5em 1.7em",
                ".hd": {
                    margin: "-.5em -1.7em 1.2em"
                },
                ".ft": {
                    margin: "1.2em -1.7em -.5em"
                },
            }
        },
    },
    [min(1024 /* ScreenSize.laptop */)]: {
        "._.modal": {}
    }
});
export const slideShow = () => ({
    "._.sshow": {
        position: "relative",
        img: {
            maxWidth: "100%",
            height: "fit-content",
        },
        ".title": {
            position: "absolute",
            bottom: "2.5em",
            fontSize: "1.3em",
            marginLeft: "1em",
            background: "#fff7",
            padding: "2px 12px",
            borderRadius: "10px"
        },
        ".indices": {
            textAlign: "center",
            position: "absolute",
            bottom: "1em",
            width: "100%",
            "*": {
                borderRadius: "50%",
                height: "12px",
                width: "12px",
                display: "inline-block",
                border: "1px solid #000",
                background: "#fff",
                margin: "0 6px",
                ":hover": {
                    background: "#0004"
                },
                ":active,&.on": {
                    background: "#0008"
                }
            }
        },
        ".p,.n": {
            position: "absolute",
            fontSize: "5em",
            color: "#fff",
            textShadow: "#000 0 0 5px",
            top: "30%",
            padding: ".2em .5em",
            ":not(:hover)": { opacity: .3 }
        },
        ".p": { left: 0 },
        ".n": { right: 0 }
    },
    "._.sshow-md": {
        background: "none",
        border: "none",
        [" ." + "cl" /* C.close */]: {
            color: "#fff",
            fontSize: "2em",
            position: "absolute",
            right: 0,
            top: 0
        },
        " img": {
            margin: "auto",
            display: "block",
            width: "90%"
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
            padding: ".1em .3em .1em 0",
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
            ".bd": { flex: 1 },
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
            [`.${"msg" /* C.message */}.${"_e" /* Color.error */}`]: {
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
            },
            "*>.req": {
                lineHeight: 0.8,
                verticalAlign: "middle",
                position: "absolute",
                right: 0,
                // fontWeight: "bold",
                fontSize: "1.3em"
            }
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
            textAlign: "start",
            // ["." + C.side]: {
            //   float: "right"
            // },
            ".bd": {
                width: `calc(100% - 1rem)`,
                // display: "inline-flex",
                margin: 0, padding: 0,
                whiteSpace: "nowrap",
                background: "inherit",
                outline: "none",
                border: "none",
                overflow: "hidden",
                position: "relative",
                ["." + "cl" /* C.close */]: {
                    // marginLeft: "auto"
                    position: "absolute",
                    right: 0,
                    background: "inherit"
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
        outline: "none"
    },
    a: {
        color: "inherit",
        textDecoration: "none"
    },
    hr: {
        borderStyle: "solid",
        borderTop: "none",
        borderLeft: "none",
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
    h1: { fontSize: "1.5em", },
    h2: { fontSize: "1.25em", },
    h3: { fontSize: "1.1em", },
    "h1,h2,h3,h4,h5,h6": { marginBlock: ".5em" },
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
    error: null,
    menu: "",
    disabled: "#999ea0",
    list: { n: "#e0f7fa", o: "" },
    accept: null,
    main: null,
    modal: {
        hd: "",
        ft: "",
    },
    bt: { n: "", h: "", a: "" },
    in: { bg: "", border: { n: "" } },
    a: { n: "#1976d2", v: "#6a1b9a", a: "#0d47a1", h: "" },
};
export const dark = () => style(darkTheme);
export const lightTheme = (() => {
    // let main = , accept = ("#2185d0"), error = chroma("#db2828");
    const state = (c, txt = "#fff") => ({ n: c.css(), h: c.darken(.1).css(), a: c.darken(.4).css(), txt });
    return {
        fg: "#000",
        bg: "#fff",
        menu: "#cfd8dc",
        disabled: "#999ea0",
        list: { n: "#fff", o: "#f6f6f6", h: "#e0f7fa", a: "#03a9f4", v: "#e0f7fa" },
        modal: {
            hd: "#e0f7fa",
            ft: "#e0f7fa",
        },
        brd: rgba(34, 36, 38, .15),
        error: state(chroma("#db2828")),
        accept: state(chroma("#21ba45")),
        main: state(chroma("#2185d0")),
        bt: state(chroma("#e0e1e2"), "rgba(0,0,0,.6)"),
        in: { bg: "#fff", border: { n: rgba(34, 36, 38, .15), a: rgb(133, 183, 217) } },
        a: { n: "#1976d2", v: "#6a1b9a", a: "#0d47a1", h: "" },
    };
})();
/**full style,light theme */
export const light = () => style(lightTheme);
