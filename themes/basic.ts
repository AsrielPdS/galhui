import { S } from "galho";
import { css, Style, Styles } from "galho/css.js";
import { C, Color, cc, HAlign, Size, VAlign } from "../galhui.js";
import { bfg, block, border, box, max, min, rem, ScreenSize, spc, styleCtx, StyleCtx, vmarg, vpad, zIndex } from "../style.js";

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
  ff = "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
  rem = 14,

  acentHPad = .4,
  acentVPad = .3,
  acentHMarg = .3,
  acentVMarg = .2,
  acentBorderRadius = .2
}
export function icon(): Styles {
  return {
    [`.${C.icon}`]: {
      height: "1em",
      verticalAlign: "middle",
      ["&." + Size.xl]: {
        height: "10em",
      },
      ["&." + Size.l]: {
        height: "5em",
      }
    }
  }
}
export const button = (ctx: Context): Styles => ctx(icon) && ({
  //style
  ["." + C.link]: {
    color: ctx.a.n,
    ":hover": { color: ctx.a.h },
    ":visited": { color: ctx.a.v },
    ":active": { color: ctx.a.a },
  },
  [cc(C.button)]: {
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
  [cc(C.close)]: {
    // color: s.error,
    background: "none",
    // position: "absolute",
    // right: ".5em",
    // top: ".5em",
    opacity: 0.8,
    ":hover": {
      opacity: 1,
    },
  },
  ["." + C.buttons]: {

  },
});
export function input(ctx: Context): Styles {
  let { bg, fg, border } = ctx.in;
  return {
    "._.in": {
      padding: ".6em 1em",
      display: "inline-flex",
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
      ":focus": {
        borderColor: border.a,
      },
      input: {
        width: "100%",
        flex: "1 1",
        outline: "none",
        border: "none"
      },
    }
  }
}
export const menubar = ({ menu }: Context): Styles => ({
  [cc(C.menubar)]: {
    display: "flex",
    height: consts.menuH + "em",
    lineHeight: consts.menuH + "em",
    padding: "0 2vw",
    flex: "0 0 auto",
    background: menu,
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
      padding: "0 .3em",
      minWidth: "2em",
      height: "100%"
    },
    [cc(C.input)]: {
      // background: ,
    },
    [`.i,.in,${cc(C.dropdown)}`]: {
      ":hover": {
        background: "#b3c2c9",
      },
      ":active,&.on": {
        background: "#9eb6c0",
      }
      // ...state(mn.i)
    },
    ".in": {

    },
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
export function panel(ctx: Context): Styles {
  return {
    "._.panel": {
      display: "flex",
      position: "relative",
      textAlign: "start",
      overflow: "hidden",
      flexDirection: "column",
      background: ctx.bg,
      ".hd": {
        padding: ".1em .7em",
        background: ctx.modal.hd,
        "&:empty": { display: "none" },
        // height:"unset"
      },
      ".bd": {
        ...box(0, [.5, .8]),
        padding: ".5em 1.7em",
        overflow: "auto",
        flex: "1 1 auto",
        ":first-child": { paddingTop: "1.2em", },
      },
      ".ft": {
        display: "flex",
        padding: ".7em 1em",
        background: ctx.modal.ft,
        flexDirection: "row-reverse",
      },
    },
  }
}
export const modal = (ctx: Context): Styles =>
(ctx(button)(panel) && {
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
    ...box(0, 0),
    zIndex: zIndex.modal,
    borderRadius: rem(.3),
    outline: "none",
    "&.xl": {
      width: "calc(100% - 1rem)",
      height: "calc(100% - 1rem)",
      margin: ".5rem"
    },

    ".hd": {
      padding: "1.2em 1.7em",
    },
    ".bd": {

    },
    ".ft": {
      padding: "1em 1.7em",
    },
    ["." + C.close]: {
      position: "absolute",
      right: 0,
      top: 0,
    }
  },
  [min(ScreenSize.laptop)]: {

  },
  [min(ScreenSize.tablet)]: {
    [cc(C.modal)]: {
      width: "75%",
      maxWidth: (ScreenSize.tablet - 20) + "px",
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
  [max(ScreenSize.tablet)]: {
    "._.modal": {
      width: "95%",
      minWidth: 0
    }
  }
});
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
export function listHelper(_: ListState): Style {
  return {
    overflow: "hidden scroll",
  }
}
export function listItem({ o, n, h, a, v }: ListState): Style {
  return {
    minHeight: "1.2em",
    background: n,
    ":nth-child(odd)": {
      background: o,
    },
    ":hover": {
      background: h,
    },
    "&.on": {
      background: v,
    },
    ["&." + C.current]: {
      outline: `1px solid ${a}`,
    }
  }
}

export function list({ brd, list: l }: Context): Styles {
  return {
    "._._.list": {
      width: "100%",
      height: "300px",
      tbody: {
        padding: 0,
        ...listHelper(l),
        ".i": {
          margin: "1px 0 0",
          ...listItem(l),
          ["." + C.side]: {
            width: "2em",
            borderRight: border(brd),
          },
          ["." + C.extra]: {

          }
        }
      },
      tfoot: { position: "sticky", bottom: 0, background: "#fff" }
    },
  };
}
export const table = ({ menu, fg, list: l, brd }: Context): Styles => ({
  [cc(C.table)]: {
    padding: 0,
    display: "flex",
    flexDirection: "column",
    outline: "none",
    overflow: "auto hidden",

    ".bd": {
      position: "relative",
      minWidth: "100%",
      height: `calc(100% - ${consts.menuH}em)`,
      ...listHelper(l)
    },

    //line
    " .tb-i": {
      display: "flex",
      flexDirection: "row",
      width: "fit-content",
      minHeight: "1.2em",
      whiteSpace: "nowrap",
      // paddingLeft: "2em",
      ...listItem(l),
      ["." + C.side]: {
        // position: "absolute",
        left: 0,
        background: "inherit",
        width: "2em",
        borderRight: border(brd),
      },
      //cell
      "*": {
        padding: `${consts.acentVPad}em ${consts.acentHPad}em`,
        borderRadius: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        margin: 0,
        border: "none",
        borderRight: border(brd),
        borderBottom: border(brd),
      }
    },
    ".hd": {
      display: "flex",
      flexShrink: 0,
      flexGrow: 0,
      backgroundColor: menu,
      height: consts.menuH + "em",
      overflowY: "scroll",
      //cell
      ".i": {
        background: "inherit",
        padding: `${consts.acentVPad}em .3em`,
        position: "relative",
        flexShrink: 0,
        ["." + C.dropdown]: {
          position: "absolute",
          lineHeight: "2em",
          right: 0,
          top: 0,
          borderLeft: `solid 1px rgba(34, 36, 38, .15)`,
          height: "100%"
        },
        ["." + C.separator]: {
          cursor: "col-resize",
          position: "absolute",
          right: "-4px",
          top: 0,
          width: "4px",
          zIndex: zIndex.front,
          height: "100%",
        },
      },
      ["." + C.side]: {
        // position: "absolute",
        width: "2em",
      },
    },
    ".ft": {
      overflowY: "scroll",
      flexShrink: 0,
      flexGrow: 0,
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
      " .tb-i": {
        width: "unset",
        ">:not(.sd)": { flexGrow: 1, flexShrink: 1 },
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
export function output(): Styles {
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
      ":empty": { display: "none" }
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

export const core = (p: Pallete, tag = css({})) => styleCtx(p, css({
  html: {
    fontSize: consts.rem + "px",
    fontFamily: consts.ff,
  },
  body: {
    background: p.bg,
    color: p.fg,
    margin: 0
  },
  button: {
    background: "none",
    color: "inherit",
    border: "none"
  },
  a: {
    color: "inherit",
    textDecoration: "none"
  },
  hr: { margin: 0, },
  input: {
    background: "inherit",
    color: "inherit",
    border: "none"
  },
  "*": {
    boxSizing: "border-box",
  },
  "._.off": { display: "none!important" },
  "._.row": { display: "flex", flexDirection: "row" },
  "._.col": { display: "flex", flexDirection: "column", ".fill": { flex: 1 } },
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
    (mobImgSelector);
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

export const rgba = (r: float, g: float, b: float, a: float) => `rgba(${r},${g},${b},${a})`;
export const rgb = (r: float, g: float, b: float) => `rgb(${r},${g},${b})`;

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
  bt: { n: "#1976d2", h: "#1976d2", a: "#1976d2" },
  in: { bg: "", border: { n: rgba(34, 36, 38, .15), a: rgb(133, 183, 217) } },
  a: { n: "#1976d2", v: "#6a1b9a", a: "#0d47a1", h: "" },
}
/**full style,light theme */
export const light = (tag?: S<HTMLStyleElement>) => style(lightTheme, tag);