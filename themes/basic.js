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
    [`.${"c" /* icon */}`]: {
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
        borderRadius: 0.2 /* acentBordRad */ + "em",
        ...box([0, .25, 0, 0], [.78, 1.5]),
        whiteSpace: "nowrap",
        height: "initial",
        background: ctx.bt.n,
        ":hover": { background: ctx.bt.h },
        ":visited": { background: ctx.bt.v },
        ":active": { background: ctx.bt.a },
        ["&." + "full" /* full */]: { display: "block", width: "auto" },
        [`.${"c" /* icon */}`]: {
            marginRight: ".5em",
        },
        [`&.${"_a" /* accept */}`]: {},
        [`&.${"_e" /* error */}`]: {
            ...bfg(ctx.error, "#fff"),
            ":hover": {
            // background:""
            }
        },
        [`&.${"_i" /* main */}`]: {},
        [`&.${"_s" /* side */}`]: {},
        [`&.${"_w" /* warning */}`]: {},
        [`&.${"c" /* icon */}>.${"c" /* icon */}`]: {
            marginRight: ".5rem",
            margin: "0 -.6em",
            // ":only-child": {},
        },
        ["&." + "l" /* l */]: {
            height: "5em",
        },
        ["&." + "xl" /* xl */]: {
            // minHeight: "10em",
            // minWidth: "12em",
            borderRadius: "1em",
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
            borderRadius: 0.2 /* acentBordRad */ + "em",
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
export function output(ctx) {
    // let { a } = theme;
    return {
        "._.out": {
            borderRadius: 0.2 /* acentBordRad */ + "em",
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
        [`._.${"ms" /* message */}`]: {
            [`&.${"_e" /* error */}`]: {
                ...bfg("rgb(255, 246, 246)", "rgb(159, 58, 56)" /* error */),
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
                borderRadius: `${0.2 /* acentBordRad */}em 0 0 ${0.2 /* acentBordRad */}em`,
            },
            ">:last-child": {
                paddingRight: "1.5em",
                borderRadius: `0 ${0.2 /* acentBordRad */}em ${0.2 /* acentBordRad */}em 0`,
            },
        },
    };
}
export const menubar = ({ menu }) => ({
    "._.bar": {
        display: "flex",
        height: 2.4 /* menuH */ + "em",
        lineHeight: 2.4 /* menuH */ + "em",
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
            margin: "0 auto"
        },
        hr: {
            height: "100%",
            margin: 0,
            minWidth: 0,
            padding: 0
        },
        "&.main": {
            background: "#9eb6c0",
            height: 2.8 /* tabH */ + "em",
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
                [`&.${"div" /* separator */}`]: {
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
                ["&." + "ds" /* disabled */]: {
                    background: disabled,
                },
            },
            [`.${"_e" /* error */}`]: {
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
export const menurow = ({ menu }) => ({
    "._.menurow": {
        background: menu,
        lineHeight: 2.4 /* menuH */ + "em",
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
        ["." + "cl" /* close */]: {
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
    [min(1024 /* laptop */)]: {
        "._.panel": {
            ".bd": {
                padding: ".5em 1.7em",
            }
        }
    },
});
export const modal = (ctx) => ctx(button)(panel) && {
    [`._.${"mda" /* modalArea */}`]: {
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
    [min(768 /* tablet */)]: {
        "._.modal": {
            width: "55%",
            maxWidth: (768 /* tablet */ - 20) + "px",
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
    [min(1024 /* laptop */)]: {},
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
    ["&." + "crt" /* current */]: {
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
            ["." + "sd" /* side */]: {
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
        tfoot: { position: "sticky", bottom: 0, background: "#fff" }
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
                padding: `${0.3 /* acentVPad */}em ${0.4 /* acentHPad */}em`,
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
            ["." + "sd" /* side */]: {
                flex: "0 0 2em"
            }
        },
        ".i": {
            ...listItem(l),
            counterIncrement: "tb",
            [`.${"sd" /* side */}:empty::before`]: {
                content: 'counter(tb)',
            },
        },
        ".hd": {
            height: "2em",
            zIndex: 1 /* front */,
            background: menu,
            fontWeight: 500,
            minWidth: "fit-content",
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
            [`.${"ms" /* message */}.${"_e" /* error */}`]: {
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
                [`._.${"cl" /* close */}`]: {
                    float: "right",
                    opacity: 0,
                    height: 2.4 /* menuH */ + "rem",
                    ":hover": {}
                },
                ":hover": {
                    [`._.${"cl" /* close */}`]: {
                        opacity: 1
                    },
                }
            },
            ["." + "bd" /* body */]: {
                height: `calc(100% - ${2.4 /* menuH */}px)`
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
        [`._.${"fileSelector" /* fileSelector */}`]: {
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
export function accordion() {
    return {
        "._.ac": {
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
export function dropdown(ctx) {
    ctx(menu);
    return {
        "._.dd": {
            display: "inline-block",
            ["." + "menu" /* menu */]: {
                position: "fixed",
                zIndex: 5 /* ctxMenu */
            },
            ["." + "c" /* icon */]: {
                margin: "0 .4em"
            }
        }
    };
}
export function select(add) {
    add(menu);
    return {
        [`._.${"sel" /* select */}`]: {
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
export const stack = ({ brd }) => ({
    "._.stack": {
        height: "100%",
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
        fontFamily: "Roboto,sans-serif" /* ff */,
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
    ["." + "_w" /* warning */]: { background: "#ffc107!important" },
});
export const style = (p) => core(p)(icon)(menu)(button)(dropdown)(select)(input)(panel)(modal)(menubar)(menurow)(table)(tab)(index)(output)(list)(table)(mobImgSelector)(stack)(form)(tip);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQWlCLE1BQU0sT0FBTyxDQUFDO0FBR3RELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFZLE1BQU0sYUFBYSxDQUFDO0FBdUJ4RSxNQUFNLENBQUMsTUFDTCxHQUFHLEdBQUcsR0FBVSxFQUFFLENBQUMsQ0FBQztJQUNsQixPQUFPLEVBQUUsTUFBTTtJQUNmLGFBQWEsRUFBRSxRQUFRO0NBQ3hCLENBQUMsRUFDRixHQUFHLEdBQUcsQ0FBQyxNQUFhLEVBQVMsRUFBRSxDQUFDLENBQUM7SUFDL0IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNO0lBQ3hDLGFBQWEsRUFBRSxLQUFLO0NBQ3JCLENBQUMsRUFDRixNQUFNLEdBQUcsR0FBVSxFQUFFLENBQUMsQ0FBQztJQUNyQixRQUFRLEVBQUUsVUFBVTtJQUNwQixJQUFJLEVBQUUsS0FBSztJQUNYLEdBQUcsRUFBRSxLQUFLO0lBQ1YsU0FBUyxFQUFFLFdBQVc7Q0FDdkIsQ0FBQyxFQUNGLEdBQUcsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsc0JBQXNCLElBQUksS0FBSyxFQUNwRCxHQUFHLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixJQUFJLEtBQUssQ0FBQztBQXFDdkQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDLENBQUM7SUFDakMsQ0FBQyxJQUFJLGNBQU0sRUFBRSxDQUFDLEVBQUU7UUFDZCxNQUFNLEVBQUUsT0FBTztRQUNmLGFBQWEsRUFBRSxRQUFRO1FBQ3ZCLE1BQU0sRUFBRTtZQUNOLE1BQU0sRUFBRSxNQUFNO1NBQ2Y7UUFDRCxL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Q25CLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtJQUMzRSxLQUFLLEVBQUU7UUFDTCxFQUFFLEVBQUUsU0FBUztRQUNiLEVBQUUsRUFBRSxTQUFTO0tBQ2Q7SUFDRCxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQztJQUMxQixFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsR0FBRztJQUNqRCxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUU7SUFDL0UsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtDQUN2RCxDQUFBO0FBQ0QsNEJBQTRCO0FBQzVCLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMifQ==