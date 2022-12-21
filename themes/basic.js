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
        borderRadius: 0.2 /* acentBorderRadius */ + "em",
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
            borderRadius: 0.2 /* acentBorderRadius */ + "em",
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
            borderRadius: 0.2 /* acentBorderRadius */ + "em",
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
            "*": { border: "none", flex: "1 auto" },
            ">:not(:last-child)": {
                borderRadius: "0",
                borderRight: `1px solid ${ctx.in.border.n}`,
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
        fontSize: "inherit"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQW9CLE1BQU0sT0FBTyxDQUFDO0FBR3pELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQW1CLE1BQU0sYUFBYSxDQUFDO0FBdUIxRSxNQUFNLENBQUMsTUFDTCxHQUFHLEdBQUcsR0FBVSxFQUFFLENBQUMsQ0FBQztJQUNsQixPQUFPLEVBQUUsTUFBTTtJQUNmLGFBQWEsRUFBRSxRQUFRO0NBQ3hCLENBQUMsRUFDRixHQUFHLEdBQUcsQ0FBQyxNQUFhLEVBQVMsRUFBRSxDQUFDLENBQUM7SUFDL0IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNO0lBQ3hDLGFBQWEsRUFBRSxLQUFLO0NBQ3JCLENBQUMsRUFDRixNQUFNLEdBQUcsR0FBVSxFQUFFLENBQUMsQ0FBQztJQUNyQixRQUFRLEVBQUUsVUFBVTtJQUNwQixJQUFJLEVBQUUsS0FBSztJQUNYLEdBQUcsRUFBRSxLQUFLO0lBQ1YsU0FBUyxFQUFFLFdBQVc7Q0FDdkIsQ0FBQyxFQUNGLEdBQUcsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsc0JBQXNCLElBQUksS0FBSyxFQUNwRCxHQUFHLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixJQUFJLEtBQUssQ0FBQztBQXFDdkQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDLENBQUM7SUFDakMsQ0FBQyxJQUFJLGNBQU0sRUFBRSxDQUFDLEVBQUU7UUFDZCxNQUFNLEVBQUUsT0FBTztRQUNmLGFBQWEsRUFBRSxRQUFRO1FBQ3ZCLE1BQU0sRUFBRTtZQUNOLE1BQU0sRUFBRSxNQUFNO1NBQ2Y7UUFDRCxLQUFLLEVBQUU7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