import { css, rgb, rgba } from "galho";
import { bfg, border, box, styleCtx } from "../style.js";
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
            ":only-child": {
                margin: "0 -.6em",
            },
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
        "._.tag": {
            borderRadius: 0.2 /* acentBordRad */ + "em",
            ...box([0, .3, 0, 0], [.4, .8]),
            background: "#d3e3f3",
            display: "inline-block",
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
const panelHelper = () => ({});
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
    "._.card": {
        display: "grid!important",
        gridTemplateColumns: "40px",
        gridTemplateAreas: `
"s m o" 
"s e o"`,
        ".bd": { gridArea: "m", },
        ".sd": { gridArea: "s", marginRight: ".8em" },
        ".ed": {
            borderSpacing: "0 3px",
            gridArea: "e",
            tr: { background: "#d3e3f3", td: { padding: ".5em" } },
            fontSize: "smaller",
        },
        paddingBottom: ".6rem"
    }
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
            //input outline
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
export const style = (p) => core(p)(icon)(menu)(button)(dropdown)(select)(input)(panel)(modal)(menubar)(menurow)(table)(tab)(index)(output)(list)(table)(mobImgSelector)(stack)(form);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQW9CLE1BQU0sT0FBTyxDQUFDO0FBR3pELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQW1CLE1BQU0sYUFBYSxDQUFDO0FBdUIxRSxNQUFNLENBQUMsTUFDTCxHQUFHLEdBQUcsR0FBVSxFQUFFLENBQUMsQ0FBQztJQUNsQixPQUFPLEVBQUUsTUFBTTtJQUNmLGFBQWEsRUFBRSxRQUFRO0NBQ3hCLENBQUMsRUFDRixHQUFHLEdBQUcsQ0FBQyxNQUFhLEVBQVMsRUFBRSxDQUFDLENBQUM7SUFDL0IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNO0lBQ3hDLGFBQWEsRUFBRSxLQUFLO0NBQ3JCLENBQUMsRUFDRixNQUFNLEdBQUcsR0FBVSxFQUFFLENBQUMsQ0FBQztJQUNyQixRQUFRLEVBQUUsVUFBVTtJQUNwQixJQUFJLEVBQUUsS0FBSztJQUNYLEdBQUcsRUFBRSxLQUFLO0lBQ1YsU0FBUyxFQUFFLFdBQVc7Q0FDdkIsQ0FBQyxFQUNGLEdBQUcsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsc0JBQXNCLElBQUksS0FBSyxFQUNwRCxHQUFHLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixJQUFJLEtBQUssQ0FBQztBQXFDdkQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDLENBQUM7SUFDakMsQ0FBQyxJQUFJLGNBQU0sRUFBRSxDQUFDLEVBQUU7UUFDZCxNQUFNLEVBQUUsT0FBTztRQUNmLGFBQWEsRUFBRSxRQUFRO1FBQ3ZCLE1BQU0sRUFBRTtZQUNOLE1BQU0sRUFBRSxNQUFNO1NBQ2Y7UUFDRCxLQUFLLEVBQUU7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QUFFO0lBQzNFLEtBQUssRUFBRTtRQUNMLEVBQUUsRUFBRSxTQUFTO1FBQ2IsRUFBRSxFQUFFLFNBQVM7S0FDZDtJQUNELEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO0lBQzFCLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxHQUFHO0lBQ2pELEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRTtJQUMvRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0NBQ3ZELENBQUE7QUFDRCw0QkFBNEI7QUFDNUIsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyJ9