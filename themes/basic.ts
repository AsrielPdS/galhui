import { css, rgb, rgba, S, Style, Styles } from "galho";
import { bool, int, str } from "galho/util.js";
import { C, Color, Size } from "../galhui.js";
import { bfg, border, box, styleCtx, StyleCtx, vmarg } from "../style.js";

export const enum ScreenSize {
  mobileS = 320,
  mobileM = 375,
  mobileL = 425,
  tablet = 768,
  laptop = 1024,
  laptopL = 1440
}
export const enum zIndex {
  xxback = -3,
  xback = -2,
  back = -1,
  normal = 0,
  front = 1,
  modalArea = 3,
  modal = 4,
  ctxMenu = 5,
  tip = 6,
  xfront = 7,
  xxfront = 8
}
export const
  col = (): Style => ({
    display: "flex",
    flexDirection: "column"
  }),
  row = (inline?: bool): Style => ({
    display: inline ? "inline-flex" : "flex",
    flexDirection: "row"
  }),
  center = (): Style => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    translate: "-50% -50%",
  }),
  min = (size: int) => `@media (min-width: ${size}px)`,
  max = (size: int) => `@media (max-width: ${size}px)`;

interface State {
  /**normal */n: str;
  /**hover  */h?: str
  /**active */a?: str
  /**visited*/v?: str;
}
type ListState = State & {/**odd row*/o: str };
export interface Pallete {
  error: str;
  menu: str;
  disabled: str;
  /**anchor(link) */
  a: State;
  /**border */
  brd?: str;
  modal: { ft: str, hd: str },
  list: ListState,
  bg: str;
  fg: str;
  bt: State,
  in: { bg: str, fg?: str, border: State };
}
export type Context = StyleCtx<Pallete>;

export const enum c {
  menuH = 2.4,
  tabH = 2.8,
  error = "rgb(159, 58, 56)",
  ff = "Roboto,sans-serif",
  acentHPad = .4,
  acentVPad = .3,
  acentHMarg = .3,
  acentVMarg = .2,
  acentBordRad = .2
}
export const icon = (): Styles => ({
  [`.${C.icon}`]: {
    height: "1.2em",
    verticalAlign: "middle",
    "&.xl": {
      height: "10em",
    },
    "&.l": {
      height: "5em",
    }
  }
})
export const button = (ctx: Context): Styles => ctx(icon) && ({
  //style
  "._.a": {
    color: ctx.a.n,
    ":hover": { color: ctx.a.h },
    ":visited": { color: ctx.a.v },
    ":active": { color: ctx.a.a },
  },
  "._.bt": {
    borderRadius: c.acentBordRad + "em",
    ...box([0, .25, 0, 0], [.78, 1.5]),
    whiteSpace: "nowrap",
    height: "initial",
    background: ctx.bt.n,
    ":hover": { background: ctx.bt.h },
    ":visited": { background: ctx.bt.v },
    ":active": { background: ctx.bt.a },

    ["&." + C.full]: { display: "block", width: "auto" },

    [`.${C.icon}`]: {
      marginRight: ".5em",
    },
    [`&.${Color.accept}`]: {

    },
    [`&.${Color.error}`]: {
      ...bfg(ctx.error, "#fff"),
      ":hover": {
        // background:""
      }
    },
    [`&.${Color.main}`]: {

    },
    [`&.${Color.side}`]: {

    },
    [`&.${Color.warning}`]: {

    },
    [`&.${C.icon}>.${C.icon}`]: {
      marginRight: ".5rem",
      ":only-child": {
        margin: "0 -.6em",
      },
    },
    ["&." + Size.l]: {
      height: "5em",
    },
    ["&." + Size.xl]: {
      // minHeight: "10em",
      // minWidth: "12em",
      borderRadius: "1em",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      [`.${C.icon}`]: {
        height: "7em",
      }
    }
  },
  ["." + C.buttons]: {

  },
});
export function input(ctx: Context): Styles {
  let { bg, fg, border } = ctx.in;
  return {
    "textarea._.in": {
      height: "6em",
      resize: "vertical",
    },//.css("height", ($.rem * 6) + "px")
    "._.in": {
      padding: ".6em 1em",
      display: "inline-flex",
      alignItems: "center",
      color: fg,
      background: bg,
      border: `1px solid ${border.n}`,
      borderRadius: c.acentBordRad + "em",
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
      ["." + C.icon]: {

      },
      ":focus-within": {
        borderColor: border.a,
      },
      input: {
        width: "100%",
        flex: "1 1",
        outline: "none",
        border: "none"
      },
      ["&." + Color.error]: {
        borderColor: "#f44336",
      }
    }
  }
}
export function output(ctx: Context): Styles {
  // let { a } = theme;
  return {
    "._.tag": {
      borderRadius: c.acentBordRad + "em",
      ...box([0, .3, 0, 0], [.4, .8]),
      background: "#d3e3f3",
      display: "inline-block",
    },
    [`._.${C.message}`]: {
      [`&.${Color.error}`]: {
        ...bfg("rgb(255, 246, 246)", c.error),
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
        borderRadius: `${c.acentBordRad}em 0 0 ${c.acentBordRad}em`,
      },
      ">:last-child": {
        paddingRight: "1.5em",
        borderRadius: `0 ${c.acentBordRad}em ${c.acentBordRad}em 0`,
      },
    },
  }
}
export const menubar = ({ menu }: Context): Styles => ({
  "._.bar": {
    display: "flex",
    height: c.menuH + "em",
    lineHeight: c.menuH + "em",
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
      height: c.tabH + "em",
      paddingTop: ".3em",
      ".i:active,.i.on": {
        background: menu,
        borderRadius: ".3em .3em 0 0"
      }
    }
  },
});
export const menu = ({ menu, disabled }: Context): Styles => ({
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
        [`&.${C.separator}`]: {
          borderBottom: "solid 1px #000"
        }
      },

      ".i,.dd": {
        cursor: "pointer",
        ":hover": {
          background: "#acc5cf",
        },
        ["&." + C.disabled]: {
          background: disabled,
        },
      },
      [`.${Color.error}`]: {
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
    zIndex: zIndex.tip,
    borderRadius: ".5em",
    boxShadow: "0 0 5px 1px #0004",
    "&.panel>.ft": {
      padding: 0,
      height: "unset",
      background: "inherit"
    }
  }
});
export const menurow = ({ menu }: Context) => ({
  "._.menurow": {
    background: menu,
    lineHeight: c.menuH + "em",
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
export const panel = (ctx: Context): Styles => ({
  "._.panel": {
    // display: "flex",
    // flexDirection: "column",
    position: "relative",
    textAlign: "start",
    overflow: "hidden",
    background: ctx.bg,
    ["." + C.close]: {
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
  [min(ScreenSize.laptop)]: {
    "._.panel": {
      ".bd": {
        padding: ".5em 1.7em",
      }
    }
  },
})
export const modal = (ctx: Context): Styles => ctx(button)(panel) && {
  [`._.${C.modalArea}`]: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "#0004",
    zIndex: zIndex.modalArea,
    overflow: "auto",
    // display: "flex",
    // flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
    // padding: spc(1, "rem"),
  },
  "._.modal": {
    // ...box(0, 0),
    zIndex: zIndex.modal,
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
  [min(ScreenSize.tablet)]: {
    "._.modal": {
      width: "55%",
      maxWidth: (ScreenSize.tablet - 20) + "px",
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
  [min(ScreenSize.laptop)]: {

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
};
export const index = (ctx: Context): Styles => ({
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
export const listHelper = (_: ListState): Style => ({
  background: _.n,
});
export const listItem = ({ h, a, v }: ListState): Style => ({
  ":hover": {
    background: h,
  },
  "&.on": {
    background: v,
  },
  ["&." + C.current]: {
    boxShadow: `inset 0 0 1px 2px ${a}`
  }
})
export const list = ({ brd, list: l }: Context): Styles => ({
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
      ["." + C.side]: {
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
export const table = ({ menu, fg, list: l, brd }: Context): Styles => ({
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
        padding: `${c.acentVPad}em ${c.acentHPad}em`,
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
      ["." + C.side]: {
        flex: "0 0 2em"
      }
    },
    ".i": {
      ...listItem(l),
      counterIncrement: "tb",
      [`.${C.side}:empty::before`]: {
        content: 'counter(tb)',
      },
    },
    ".hd": {
      height: "2em",
      zIndex: zIndex.front,
      background: menu,
      fontWeight: 500,
      minWidth: "fit-content",
      position: "sticky",
      top: 0,
      //cell
      ".i": {
        position: "relative",
        ["." + C.dropdown]: {
          position: "absolute",
          lineHeight: "2em",
          right: "4px",
          top: 0,
          borderLeft: `solid 1px rgba(34, 36, 38, .15)`,
          height: "100%"
        },
        ["." + C.separator]: {
          cursor: "col-resize",
          position: "absolute",
          right: 0,
          top: 0,
          width: "4px",
          zIndex: zIndex.front,
          height: "100%",
        },
      },
    },
    ["&." + C.bordered]: {
      ["." + C.head]: {
        //cell
        ["." + C.item]: {
          border: `1px solid ${fg}`
        },
        [">:not(:first-child)"]: {
          borderLeft: "none"
        },
        ["." + C.side]: {
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

export function form(ctx: Context): Styles {
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
      [`.${C.message}.${Color.error}`]: {
        position: "sticky",
        bottom: 0,
      }
    },

    "._.form-g": {
      "*": { width: "100%" }
    },

  }
}
export function tab({ menu }: Context): Styles {
  return {
    "._.tab": {
      ...col(),
      "._.bar": {
        background: menu,
        [`._.${C.close}`]: {
          float: "right",
          opacity: 0,
          height: c.menuH + "rem",
          ":hover": {

          }
        },
        ":hover": {
          [`._.${C.close}`]: {
            opacity: 1
          },
        }
      },
      ["." + C.body]: {
        height: `calc(100% - ${c.menuH}px)`
      }
    }
  }
}
export function mobImgSelector(ctx: Context): Styles {
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

    [`._.${C.fileSelector}`]: {
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
      ["." + C.button]: {
        margin: 0,
        width: "40px",
        height: "40px",
        borderRadius: "20px",
        position: "absolute",
        right: 0,
        bottom: 0
      },
      ["." + C.body]: {
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
  }
}
export function accordion(): Styles {
  return {
    "._.ac": {
      ["." + C.body]: {
        display: "none"
      },
      ["." + C.head]: {
        [`&.${C.on}+.${C.body}`]: {
          display: "block"
        },
      },
    }
  }
}
export function dropdown(ctx: Context): Styles {
  ctx(menu);
  return {
    "._.dd": {
      ["." + C.menu]: {
        position: "fixed",
        zIndex: zIndex.ctxMenu
      },
      ["." + C.icon]: {
        padding: "0 .4em"
      }
    }
  }
}
export function select(add: Context): Styles {
  add(menu);
  return {
    [`._.${C.select}`]: {
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
        ["." + C.close]: {
          marginLeft: "auto"
        }
      },
      ".menu": {
        maxWidth: "unset",
        position: "fixed",
        overflow: "hidden auto",
        zIndex: zIndex.ctxMenu
      },
      /**top */
      "&.t": {

      },
      /**bottom */
      "&.b": {

      },
      input: {
        background: "none",
        color: "inherit"
      }
    }
  }
}

export const stack = ({ brd }: Context): Styles => ({
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
export const core = (p: Pallete, tag = css({})) => styleCtx(p)({
  html: {
    // fontSize: consts.rem + "px",
    fontFamily: c.ff,
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
  ["." + Color.warning]: { background: "#ffc107!important" },
});
export const style = (p: Pallete) =>
  core(p)(icon)
    (menu)
    (button)
    (dropdown)
    (select)
    (input)
    (panel)
    (modal)
    (menubar)
    (menurow)
    (table)
    (tab)
    (index)
    (output)
    (list)
    (table)
    (mobImgSelector)
    (stack)
    (form);
/**full style,dark theme */
export const darkTheme: Pallete = {
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

export const lightTheme: Pallete = {
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
}
/**full style,light theme */
export const light = () => style(lightTheme);