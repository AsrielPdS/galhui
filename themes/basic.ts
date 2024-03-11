import chroma, { Color as Cholor } from "chroma-js";
import { Style, Styles } from "galho";
import { bool, int, str } from "galho/util.js";
import { C } from "../galhui.js";
import { StyleCtx, bfg, border, box, rgb, rgba, spc, styleCtx } from "../style.js";
const { mix } = chroma
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
export const col = (inline?: bool): Style => ({
  display: (inline ? "inline-" : "") + "flex",
  flexDirection: "column"
});
export const row = (inline?: bool): Style => ({
  display: (inline ? "inline-" : "") + "flex",
  flexDirection: "row"
});
export const center = (): Style => ({
  position: "absolute",
  left: "50%",
  top: "50%",
  translate: "-50% -50%",
});
export const min = (size: int) => `@media (min-width: ${size}px)`;
export const max = (size: int) => `@media (max-width: ${size}px)`;

interface State {
  /**normal */n: str;
  /**hover  */h?: str
  /**active */a?: str
  txt?: str;
}
interface LinkState extends State {
  /**visited*/v?: str;
}
type ListState = State & {/**odd row*/o: str; current: str };
export interface Pallete {
  hr: str;
  ph: str;
  error: State;
  menu: State;
  disabled: str;
  /**anchor(link) */
  a: LinkState;
  /**border */
  brd?: str;
  modal: { ft: str, hd: str },
  list: ListState,
  bg: str;
  fg: str;
  bt: State,
  accept: State;
  main: State;
  in: { bg: str, fg?: str, border: State };
}
export type Context = StyleCtx<Pallete>;

export const enum opts {
  menuH = 2.4,
  tabH = 2.8,
  ff = "Roboto,sans-serif",
  acentHPad = .4,
  acentVPad = .3,
  acentHMarg = .3,
  acentVMarg = .2,
  acentBordRad = .2
}
export const icon = (): Styles => ({
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
// /**black or white */
// function borw(color: str, v1: str, v2: str) {
//   return chroma.contrast(color, v1) >= 4.5 ? v1 : v2;
// }
function state(v: LinkState): Style {
  return {
    background: v.n,
    color: v.txt,
    ":hover": { background: v.h },
    ":visited": { background: v.v },
    ":active": { background: v.a },
  }
}
export const button = (ctx: Context): Styles => (ctx(icon), {
  //style
  "._.link": {
    color: ctx.a.n,
    textDecoration: "underline",
    ":hover": { color: ctx.a.h },
    ":visited": { color: ctx.a.v },
    ":active": { color: ctx.a.a },
  },
  "._.bt": {
    borderRadius: opts.acentBordRad + "em",
    // ...box([0, .25, 0, 0], [.78, 1.5]),
    margin: "0 .15em",
    padding: ".78em 1.5em",
    whiteSpace: "nowrap",
    height: "initial",
    textAlign: "center",
    ["&." + C.full]: { display: "block", width: "auto" },
    ".icon": { marginRight: ".5em", },
    ...state(ctx.bt),
    "&.accept": state(ctx.accept),
    "&.main": state(ctx.main),
    "&.error": state(ctx.error),
    "&.icon>.icon:only-child": {
      margin: "0 -.6em",
    },
    "&.l": {
      height: "5em",
    },
    "&.xl": {
      // minHeight: "10em",
      // minWidth: "12em",
      borderRadius: "1em",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      ".icon": {
        height: "7em",
      }
    }
  },
  ["." + C.buttons]: {

  },
});
export const input = ({ in: { bg, fg, border }, error, fg: _fg }: Context): Styles => ({
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
    borderRadius: opts.acentBordRad + "em",
    height: "2.4em",
    outline: 0,
    fontSize: "inherit",
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
    ["." + "icon"]: {

    },
    ":focus-within": {
      borderColor: border.a,
    },
    input: {
      width: "100%",
      flex: "1 1",
      outline: "none",
      border: "none",
      background: "inherit",
      color: "inherit"
    },
    "&.error": {
      borderColor: "#f44336",
      color: fg || _fg,
      background: mix(bg, error.n, .2).hex(),
    }
  }
})
export function loader(): Styles {
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
  }
}
export const output = ({ in: { border }, bt, accept: a, error: e }: Context): Styles => ({
  "._.out": {
    // fontSize: ".9em",
    borderRadius: opts.acentBordRad + "em",
    ...box([.1, .2], [.1, .4]),
    background: bt.n,
    // color: bt.txt,
    display: "inline-block",
    ":empty": { display: "none" },
    // [`&.accept`]: state(ctx.accept),
    [`&.main`]: { background: a.n, color: a.txt },
    [`&.error`]: { background: e.n, color: e.txt },
    "tr&": {
      display: "table-row",
      td: {
        padding: spc([.4, .8])
      }
    }
  },
  "._.error": bfg(e.n, e.txt),
  "._.accept": bfg(a.n, a.txt),
  "._.msg": {
    ...box([1, 0], [1, 1.5]),
    ":empty": { height: 0, padding: 0, margin: 0 },
    borderRadius: ".4em",
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
      borderRadius: `${opts.acentBordRad}em 0 0 ${opts.acentBordRad}em`,
    },
    ">:last-child": {
      // paddingRight: "1.5em",
      borderRadius: `0 ${opts.acentBordRad}em ${opts.acentBordRad}em 0`,
    },
  },
});
export function notify(): Styles {
  return {
    "._.notify": {
      position: "fixed",
      bottom: "2em",
      left: "2em",
    }
  };
}
export const menubar = ({ menu, disabled }: Context): Styles => ({
  "._.bar": {
    display: "flex",
    height: opts.menuH + "em",
    lineHeight: opts.menuH + "em",
    // padding: "0 2vw",
    flex: "0 0 auto",
    background: menu.n,
    whiteSpace: "nowrap",
    "&.fill": {
      "*": {
        flex: 1
      }
    },
    ">:first-child": { marginLeft: "1.2em" },
    ">:last-child": { marginRight: "1.2em" },
  },
  "._.bar>.container": row(),
  "._.bar,._.bar>.container": {
    "&.main": {
      background: menu.a,
      height: opts.tabH + "em",
      paddingTop: ".3em",
      ".i:active,.i.on": {
        background: menu.n,
        borderRadius: ".3em .3em 0 0"
      }
    },
    ".hd,.i": {
      marginTop: 0,
      marginBottom: 0,
      // border: "none",
      margin: "0 .1em",
      padding: "0 .6em",
      minWidth: "2.4em",
      height: "100%",
      overflow: "hidden",
      // textOverflow: "ellipsis",
      img: { width: "16px", height: "16px" },
    },
    ".i": {
      background: "inherit",
      ":disabled": {
        color: disabled,
      },
      ":hover": {
        background: menu.h,
      },
      ":active,&.on": {
        background: menu.a,
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
      height: "70%",
      margin: "auto",
      // minWidth: 0,
      // padding: 0
    },
  }
});
export const menu = ({ menu }: Context): Styles => ({
  "._.menu": {
    background: menu.n,
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
        [`&.${C.separator}`]: {
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
        ["&." + C.disabled]: {
          color: "#0008",
          background: "inherit"
        },
      },
      [`.error`]: {
        background: "#e53935", color: "#fff",
        ":hover": { background: "#ef5350" },
      }
    },
    // display: "table",  
  },
  ".menu-c": { background: menu.n },
});
export const tip = ({ menu }: Context): Styles => ({
  "._.tip": {
    position: "fixed",
    background: menu.n,
    padding: ".7em 1em",
    zIndex: zIndex.tip,
    borderRadius: ".5em",
    boxShadow: "0 0 5px 1px #0004",
    "&.modal>.ft": {
      padding: 0,
      height: "unset",
      background: "inherit"
    }
  }
});
export const menurow = ({ menu }: Context) => ({
  "._.menurow": {
    background: menu.n,
    lineHeight: opts.menuH + "em",
    ".i": {
      padding: "0 2vw",
      display: "block",
      ":hover": {
        background: "#b3c2c9",
      },
      ":active,&.on": {
        background: menu.a,
      }
    }
  },
});
export function modal(ctx: Context): Styles {
  let { modal, bg } = ctx;
  return (ctx(button), {
    "::backdrop,._.blank": {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "#000000d9",
      zIndex: zIndex.modalArea,
      overflow: "auto",
    },
    "._.modal": {
      zIndex: zIndex.modal,
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
      background: bg,
      "&.error": {
        border: border(ctx.error.n, 3),
        color: ctx.fg
      },
      ["." + C.close]: {
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
          background: modal.hd,
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
        "&.tab": {
          padding: 0,
          ".hd": { margin: 0 },
          ".ft": { margin: 0 },
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
          background: modal.ft,
          ".spc": {
            border: "none", margin: "auto"
          },
          hr: {
            border: "none",
            margin: "auto"
          },
        },
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
  })
}
export const pcModal = (ctx: Context): Styles => (ctx(button), {
  [min(ScreenSize.tablet)]: {
    "._.modal": {
      width: "64%",
      maxWidth: (ScreenSize.tablet - 20) + "px",
      // margin: "3em auto 2em",
      height: "fit-content",
      maxHeight: "calc(100% - 5em)",
      "&.scroll": {

      },
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
  [min(ScreenSize.laptop)]: {
    "._.modal": {
      width: "55%",
    }
  }
});
export const slideShow = (): Styles => ({
  "._.sshow": {
    position: "relative",
    ".bd": {
      display: "flex",
      overflow: "hidden",
      // position: "relative",
      img: {
        maxWidth: "100%",
        height: "fit-content",
        margin: "auto",
        display: "block",
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
    },

    ".p,.n": {
      zIndex: zIndex.front,
      position: "absolute",
      fontSize: "5em",
      color: "#fff",
      textShadow: "#000 0 0 5px",
      top: "50%",
      translate: "0 -50%",
      padding: ".2em .5em",
      ":not(:hover)": { opacity: .3 }
    },
    ".p": { left: 0 },
    ".n": { right: 0 },
    ".title:empty": { display: "none" }
  },
  "._.sshow-md": {
    background: "none",
    border: "none",
    [" ." + C.close]: {
      color: "#fff",
      fontSize: "2em",
      position: "absolute",
      right: 0,
      top: 0
    },
  },
  "@media(orientation:landscape)": {
    "._.sshow": {
      ".title": {
        position: "absolute",
        bottom: "2.5em",
        fontSize: "1.3em",
        marginLeft: "1em",
        background: "#fff7",
        padding: "2px 12px",
        borderRadius: "10px"
      }
    },
    "._.sshow-md": {
      " img": {
        margin: "auto",
        display: "block",
        width: "90%"
      }
    },
  },
  "@media(orientation:portrait)": {
    "._.sshow": {
      ".title": {
        background: "#fff",
      }
    },
    "._.sshow-md": {
      [" ." + C.close]: {
        position: "fixed",
      }
    },
  }
})

/**@deprecated */
export const index = (): Styles => ({
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
export const listItem = ({ h, a, o, current }: ListState): Style => ({
  "&:nth-child(odd)": {
    background: o,
  },
  ":hover": {
    color: h,
  },
  "&.on": {
    background: a,
  },
  ["&." + C.current]: {
    boxShadow: `inset 0 0 1px 2px ${current}`
  },
});
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
      padding: ".1em .3em .1em 0",
      ...listItem(l),
      borderBottom: "solid 1px #0004",
      counterIncrement: "l",
      ["." + C.side]: {
        flex: "0 0 2em",
        // display: "inline-block",
        padding: ".4em .2em",
        borderRight: border(brd),
        ":empty::before": { content: "counter(l)", },
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
export const table = ({ menu, fg, list: l, brd }: Context): Styles => ({
  "._.tb": {
    padding: 0,
    outline: "none",
    position: "relative",
    overflow: "auto",
    // overflow: "auto",
    ...listHelper(l),
    counterReset: "tb",

    //line

    ".i": {
      ...listItem(l),
      counterIncrement: "tb",
      [`.${C.side}:empty::before`]: {
        content: "counter(tb)",
      },
    },
    ".hd": {
      height: "2em",
      zIndex: zIndex.front,
      background: menu.n,
      fontWeight: 500,
      minWidth: "fit-content",
      position: "sticky",
      top: 0,
      //cell
      ".i": {
        position: "relative",
        ".dd": {
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
      ["." + "hd"]: {
        //cell
        ["." + "i"]: {
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
      // ["." + "bd"]: {
      //   //row
      //   ["." + "i"]: {
      //     //cell
      //     ["." + "i"]: {
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
      padding: `${opts.acentVPad}em ${opts.acentHPad}em`,
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
    ["." + C.side]: {
      flex: "0 0 2em"
    }
  },
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
      [`.${C.message}.error`]: {
        position: "sticky",
        bottom: 0,
      },
    },
    "._.formg": {
      minWidth: 0,
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
      },
      "&.row": {
        display: "flex",
        justifyContent: "space-evenly",

      }
    },
    "._.form,._.formg": {
      "&.grid": {
        display: "grid",
        gridGap: "0 1em",
        gridTemplateColumns: "repeat(auto-fill, minmax(20em, 1fr))",
        ".oi": {
          margin: 0,
        }
      },
      //outline input 
      ".oi": {
        position: "relative",
        margin: `.8em 0`,
        ".hd": {
          display: "block",
          margin: ".4em 0 .2em",
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
      "*>.req": {
        lineHeight: 0.8,
        verticalAlign: "middle",
        position: "absolute",
        right: 0,
        // fontWeight: "bold",
        fontSize: "1.3em"
      }
    },
  }
}
export function pcForm(): Styles {
  return {
    "._.form,._.formg": {
      //input inline
      ".ii": {
        margin: ".2em 0 .4em",

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
    }
  }
}
export function tab(): Styles {
  return {
    "._.tab": {
      ...col(),
      "._.bar": {
        // background: menu.n,
        [`._.${C.close}`]: {
          float: "right",
          opacity: 0,
          height: opts.menuH + "rem",
          ":hover": {

          }
        },
        ":hover": {
          [`._.${C.close}`]: {
            opacity: 1
          },
        }
      },
      ["." + "bd"]: {
        height: `calc(100% - ${opts.menuH}px)`
      }
    }
  }
}
export function accordion(): Styles {
  return {
    "._.ac": {
      ["." + "bd"]: {
        display: "none"
      },
      ["." + "hd"]: {
        [`&.${C.on}+.bd`]: {
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
      display: "inline-block",
      ".menu": {
        position: "fixed",
        zIndex: zIndex.ctxMenu
      },
      ["." + "icon"]: {
        margin: "0 .4em"
      }
    }
  }
}
export function pcSelect(add: Context): Styles {
  add(menu);
  return {
    [`._.${C.select}`]: {
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
        ["." + C.close]: {
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
export function container(): Styles {
  return {
    "._.container": {
      padding: "0 .75em"
    },
    [min(ScreenSize.tablet)]: {
      "._.container": {
        padding: "0 2rem",
        maxWidth: "768px",
        width: "768px",
        marginLeft: "auto!important",
        marginRight: "auto!important"
      },
    },
    [min(ScreenSize.laptop)]: {
      "._.container": {
        padding: "0 6rem",
        maxWidth: "1024px",
        width: "1024px",
      },
    },
    [min(ScreenSize.laptopL)]: {
      "._.container": {
        maxWidth: "1280px",
        width: "1280px",
      },
    },
  }
}
export const stack = ({ brd }: Context): Styles => ({
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
export const core = (p: Pallete) => styleCtx(p, ">")({
  html: {
    fontSize: "16px",
    fontFamily: opts.ff,
  },
  body: { margin: 0, background: p.bg, color: p.fg },
  dialog: { color: p.fg },
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
    borderColor: p.hr,
    // margin: 0,
    // border: "none",
    // borderLeft: "solid #0004 1px",
    // borderTop: "solid #0004 1px",
  },
  input: {
    // background: "inherit",
    // color: "inherit",
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
  "._.ph": { color: p.ph },
  ["." + "warn"]: { background: "#ffc107!important" },
});

export const mobileStyle = (p: Pallete) =>
  core(p)(icon)
    (menu)(button)
    (dropdown)
    (input)(menubar)
    (menurow)(tab)
    (index)(output)
    (list)(table)
    (stack)(loader)
    (form)(modal)(tip);
export const pcStyle = (p: Pallete) =>
  core(p)(icon)
    (menu)(button)
    (dropdown)(pcSelect)
    (input)(menubar)
    (menurow)(tab)
    (index)(output)
    (list)(table)
    (stack)(loader)
    (form)(pcForm)(modal)
    (pcModal)(tip);
export const style = (p: Pallete) =>
  core(p)(icon)
    (menu)(button)
    (dropdown)(pcSelect)
    (input)(menubar)
    (menurow)(tab)
    (index)(output)
    (list)(table)
    (stack)(loader)
    (form)(modal)
    (pcModal)(tip)
    (slideShow)(notify)
    (container)(pcForm);


// let main = , accept = ("#2185d0"), error = chroma("#db2828");
export function darkTheme(): Pallete {
  const cstate = (c: str | Cholor, txt?: str): State => ({ n: (c = chroma(c)).hex(), h: c.brighten(.1).hex(), a: c.brighten(.4).hex(), txt });
  return {
    hr: "#fff8",
    ph: "#fff8",
    bg: "#202020",
    fg: "#fff",
    menu: cstate("#444"),
    disabled: "#999ea0",
    list: { n: "#222", o: "#333", h: "#4a9ec4", a: "#33596a", current: "#03a9f4" },
    modal: {
      hd: "#333",
      ft: "#444",
    },
    brd: rgba(34, 36, 38, .15),
    error: cstate("#801e1e"),
    accept: cstate("#126325"),
    main: cstate("#2185d0"),
    bt: cstate("#3c3c3c", "#fffB"),
    in: { bg: "#1a1919", fg: "#fff", border: { n: rgba(34, 36, 38, .15), a: rgb(133, 183, 217) } },
    a: { n: "#1976d2", v: "#6a1b9a", a: "#0d47a1", h: "" },
  }
}

export function lightTheme(): Pallete {
  const cstate = (c: str | Cholor, txt = "#fff"): State => ({ n: (c = chroma(c)).hex(), h: c.darken(.1).hex(), a: c.darken(.4).hex(), txt });
  return {
    hr: "#0008",
    ph: "#000A",
    fg: "#000",
    bg: "#fff",
    menu: cstate("#cfd8dc"),//{ n: "#cfd8dc", a: "#9eb6c0" },
    disabled: "#999ea0",
    list: { n: "#fff", o: "#f6f6f6", h: "#3b777f", a: "#afddf1", current: "#03a9f4" },
    modal: {
      hd: "#e0f7fa",
      ft: "#e0f7fa",
    },
    brd: rgba(34, 36, 38, .15),
    error: cstate("#f55656"),
    accept: cstate("#21ba45"),
    main: cstate("#2185d0"),
    bt: cstate("#e0e1e2", "rgba(0,0,0,.6)"),
    in: { bg: "#fff", border: { n: rgba(34, 36, 38, .15), a: rgb(133, 183, 217) } },
    a: { n: "#1976d2", v: "#6a1b9a", a: "#0d47a1", h: "" },
  }
}