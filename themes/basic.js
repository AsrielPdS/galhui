import chroma from "chroma-js";
import { bfg, border, box, rgb, rgba, spc, styleCtx } from "../style.js";
export const col = (inline) => ({
    display: (inline ? "inline-" : "") + "flex",
    flexDirection: "column"
});
export const row = (inline) => ({
    display: (inline ? "inline-" : "") + "flex",
    flexDirection: "row"
});
export const center = () => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    translate: "-50% -50%",
});
export const min = (size) => `@media (min-width: ${size}px)`;
export const max = (size) => `@media (max-width: ${size}px)`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLE1BQTJCLE1BQU0sV0FBVyxDQUFDO0FBSXBELE9BQU8sRUFBWSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxhQUFhLENBQUM7QUF3Qm5GLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQWEsRUFBUyxFQUFFLENBQUMsQ0FBQztJQUM1QyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTTtJQUMzQyxhQUFhLEVBQUUsUUFBUTtDQUN4QixDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFhLEVBQVMsRUFBRSxDQUFDLENBQUM7SUFDNUMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU07SUFDM0MsYUFBYSxFQUFFLEtBQUs7Q0FDckIsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLEdBQVUsRUFBRSxDQUFDLENBQUM7SUFDbEMsUUFBUSxFQUFFLFVBQVU7SUFDcEIsSUFBSSxFQUFFLEtBQUs7SUFDWCxHQUFHLEVBQUUsS0FBSztJQUNWLFNBQVMsRUFBRSxXQUFXO0NBQ3ZCLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsc0JBQXNCLElBQUksS0FBSyxDQUFDO0FBQ2xFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsc0JBQXNCLElBQUksS0FBSyxDQUFDO0FBd0NsRSxNQUFNLENB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SUFBSSxFQUFFLFNBQVM7UUFDZixRQUFRLEVBQUUsU0FBUztRQUNuQixJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7UUFDM0UsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLFNBQVM7WUFDYixFQUFFLEVBQUUsU0FBUztTQUNkO1FBQ0QsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7UUFDMUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0IsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUIsRUFBRSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsZ0JBQWdCLENBQUM7UUFDOUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFO1FBQy9FLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7S0FDdkQsQ0FBQTtBQUNILENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDTCw0QkFBNEI7QUFDNUIsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyJ9