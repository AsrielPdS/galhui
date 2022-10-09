import type { S } from "galho";
import { css, rgb, rgba, Style, Styles } from "galho/css.js";
import { str } from "galho/util.js";
import { C, cc, Color, Size } from "../galhui.js";
import { bfg, border, box, max, min, col, rem, row, ScreenSize, styleCtx, StyleCtx, vmarg, zIndex } from "../style.js";

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


export const enum consts {
  menuH = 2,
  error = "rgb(159, 58, 56)",
  ff = "Roboto,sans-serif",
  rem = 14,

  acentHPad = .4,
  acentVPad = .3,
  acentHMarg = .3,
  acentVMarg = .2,
  acentBorderRadius = .2
}
export const icon = (): Styles => ({
  [`.${C.icon}`]: {
    height: "1em",
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
    borderRadius: consts.acentBorderRadius + "em",
    ...box([0, .25, 0, 0], [.78, 1.5]),
    whiteSpace: "nowrap",
    height: "initial",
    background: ctx.bt.n,
    ":hover": { background: ctx.bt.h },
    ":visited": { background: ctx.bt.v },
    ":active": { background: ctx.bt.a },

    ["&." + C.full]: { display: "block", width: "auto" },

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
      minHeight: "10em",
      minWidth: "12em",
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
      display: "inline-flex!important",
      alignItems: "center",
      color: fg,
      background: bg,
      border: `1px solid ${border.n}`,
      borderRadius: consts.acentBorderRadius + "em",
      height: "2.4em",
      outline: "0",
      ".bt": {
        margin: 0,
        // height: "1em",
        ...vmarg("-.6em")
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
export const menubar = ({ menu }: Context): Styles => ({
  "._.bar": {
    display: "flex",
    height: consts.menuH + "em",
    lineHeight: consts.menuH + "em",
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
      minWidth: "2em",
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
      height: "2.4em",
      paddingTop: ".3em",
      ".i:active,.i.on": {
        background: menu,
        borderRadius: ".3em .3em 0 0"
      }
    }
  },
});
export const menu = ({ menu, disabled }: Context): Styles => ({
  [cc(C.menu)]: {
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
      [cc(C.separator)]: {
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

      [`.${C.item},.${C.dropdown}`]: {
        ":hover": {
          background: "#acc5cf",
        },
        ["&." + C.disabled]: {
          background: disabled,
        },
        // ":active": {
        //   background:"",
        // },

      },
    },
    // display: "table",  
  },
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
    lineHeight: consts.menuH + "em",
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
  }
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
    // ["." + C.close]: {
    //   position: "absolute",
    //   right: 0,
    //   top: 0,
    //   background: "#fff",
    //   color: "#f44",
    //   borderRadius: ".7em",
    //   width: "1.3em",
    //   height:"1.3em",
    // },
    ".hd": {
      margin: 0,
      height: "2.2em",
      fontSize: "inherit",
      padding: ".4em .7em",
      background: "#cfd8dc",
      "&:empty": { display: "none" },
      // height:"unset"
    },
    ".bd": {
      ...box(0, [.5, .8]),
      padding: ".5em 1.7em",
      overflow: "auto",
      height: "calc(100% - 3em)",
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
      }
    },
  },
})
export const modal = (ctx: Context): Styles => ctx(button)(panel) && {
  [cc(C.modalArea)]: {
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
    borderRadius: ".6em",
    width: "calc(100% - 1.4em)",
    height: "calc(100% - 1.4em)",
    margin: ".7em",
    "&.xl,&.l": {

    },
    "&.xs,&.s": {

    },
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
    [cc(C.modal)]: {
      width: "75%",
      maxWidth: (ScreenSize.tablet - 20) + "px",
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
        width: "55%"
      },
      "&.xs": {
        width: "35.2%",
        maxWidth: "360px"
      },
    },
  },
  [min(ScreenSize.laptop)]: {

  },
  // [max(ScreenSize.tablet)]: {
  //   "._.modal": {
  //     width: "95%",
  //     minWidth: 0
  //   }
  // }
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
    outline: `1px solid ${a}`,
  }
})
export const list = ({ brd, list: l }: Context): Styles => ({
  "._.list": {
    width: "100%",
    height: "300px",
    padding: 0,
    margin: 0,
    overflow: "hidden scroll",
    ...listHelper(l),
    ".i": {
      minHeight: "1.2em",
      ...row(),
      margin: "1px 0 0",
      ...listItem(l),
      borderBottom: "solid 1px #0004",
      ["." + C.side]: {
        flex: "0 0 2em",
        display: "inline-block",
        padding: ".4em .2em",
        borderRight: border(brd),
      },
      ".bd": {
        display: "inline-block",
        padding: ".6em .4em"
      }
    },
    tfoot: { position: "sticky", bottom: 0, background: "#fff" }
  },
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
      display: "inline-flex",
      flexDirection: "row",
      height: "2rem",
      whiteSpace: "nowrap",
      ".opts": {
        position: "absolute",
        right: 0,
      },
      //cell
      "*": {
        display: "inline-block",
        padding: `${consts.acentVPad}em ${consts.acentHPad}em`,
        borderRadius: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        margin: 0,
        height: "2rem",
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
      height: `${consts.menuH}em`,
      zIndex: zIndex.front,
      background: menu,
      fontWeight: 500,
      minWidth: "100%",
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
export function tab({ menu }: Context): Styles {
  return {
    [cc(C.tab)]: {
      [cc(C.menubar)]: {
        background: menu,
        [cc(C.close)]: {
          float: "right",
          opacity: 0,
          height: rem(consts.menuH),
          ":hover": {

          }
        },
        ":hover": {
          [cc(C.close)]: {
            opacity: 1
          },
        }
      },
      ["." + C.body]: {
        height: `calc(100% - ${consts.menuH}px)`
      }
    }
  }
}
export function output(ctx: Context): Styles {
  // let { a } = theme;
  return {
    [cc(C.label)]: {
      // ...block(a),
      //display: "flex",
      //input: {
      //  width: "100%"
      //},
    },
    [cc(C.message)]: {
      [`&.${Color.error}`]: {
        ...bfg("rgb(255, 246, 246)", consts.error),
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
  }
}
export function mobImgSelector(ctx: Context): Styles {
  ctx(button);
  return {
    [cc(C.mobile, "imgsel")]: {
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
    [cc(C.accordion)]: {
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
    [cc(C.dropdown)]: {
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
    [cc(C.select)]: {
      minWidth: "10em",
      position: "relative",
      display: "inline-block",
      overflow: "hidden",
      // ["." + C.side]: {
      //   float: "right"
      // },
      ".bd": {
        width: `calc(100% - ${consts.rem}px)`,
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
export const core = (p: Pallete, tag = css({})) => styleCtx(p, css({
  html: {
    fontSize: consts.rem + "px",
    fontFamily: consts.ff,
  },
  body: { margin: 0 },
  button: {
    background: "none",
    color: "inherit",
    border: "none"
  },
  a: {
    color: "inherit",
    textDecoration: "none"
  },
  hr: {
    margin: 0,
    border: "none",
    borderLeft: "solid #0004 1px",
    borderTop: "solid #0004 1px",
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
  "._.off": { display: "none!important" },
  "._.row": { display: "flex", flexDirection: "row" },
  "._.col": { display: "flex", flexDirection: "column", ".fill": { flex: 1 } },
  "._.ph": { color: "#000A" },
  ["." + Color.warning]: { background: "#ffc107!important" },
}, tag));
export const style = (p: Pallete, tag?: S<HTMLStyleElement>) =>
  core(p, tag)(icon)
    (button)
    (dropdown)
    (select)
    (input)
    (panel)
    (modal)
    (menu)
    (menubar)
    (menurow)
    (table)
    (tab)
    (index)
    (output)
    (list)
    (table)
    (mobImgSelector)
    (stack);
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
export const dark = (tag?: S<HTMLStyleElement>) => style(darkTheme, tag);

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
export const light = (tag?: S<HTMLStyleElement>) => style(lightTheme, tag);