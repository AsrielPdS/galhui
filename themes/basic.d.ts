import { S } from "galho";
import css = require("galho/css");
import { StyleCtx } from "../style";
interface State {
    /**normal */ n: str;
    /**hover  */ h?: str;
    /**active */ a?: str;
    /**visited*/ v?: str;
}
declare type ListState = State & {
    o: str;
};
export interface Pallete {
    error: str;
    menu: str;
    /**anchor(link) */
    a: State;
    /**border */
    brd?: str;
    modal: {
        ft: str;
        hd: str;
    };
    list: ListState;
    bg: str;
    fg: str;
    bt: State;
    in: {
        bg: str;
        fg?: str;
        border: State;
    };
}
export declare type Context = StyleCtx<Pallete>;
export declare const enum consts {
    menuH = 2,
    error = "rgb(159, 58, 56)",
    ff = "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
    rem = 14,
    acentHPad = 0.4,
    acentVPad = 0.3,
    acentHMarg = 0.3,
    acentVMarg = 0.2,
    acentBorderRadius = 0.2
}
export declare function icon(): css.Styles;
export declare const button: (ctx: Context) => css.Styles;
export declare function input(ctx: Context): css.Styles;
export declare const menubar: ({ menu }: Context) => css.Styles;
export declare function menu({ menu }: Context): css.Styles;
export declare function panel(ctx: Context): css.Styles;
export declare const modal: (ctx: Context) => css.Styles;
export declare function listHelper(_: ListState): css.Style;
export declare function listItem({ o, n, h, a, v }: ListState): css.Style;
export declare function list({ brd, list: l }: Context): css.Styles;
export declare const table: ({ menu, fg, list: l, brd }: Context) => css.Styles;
export declare function tab({ menu }: Context): css.Styles;
export declare function output(): css.Styles;
export declare function mobImgSelector(ctx: Context): css.Styles;
export declare function accordion(): css.Styles;
export declare function dropdown(ctx: Context): css.Styles;
export declare function select(add: Context): css.Styles;
export declare const core: (p: Pallete, tag?: S<HTMLStyleElement>) => import("../style").StyleFnAdd<Pallete>;
export declare const style: (p: Pallete, tag?: S<HTMLStyleElement>) => import("../style").StyleFnAdd<Pallete>;
/**full style,dark theme */
export declare const darkTheme: Pallete;
export declare const dark: (tag?: S<HTMLStyleElement>) => import("../style").StyleFnAdd<Pallete>;
export declare const rgba: (r: float, g: float, b: float, a: float) => string;
export declare const rgb: (r: float, g: float, b: float) => string;
export declare const lightTheme: Pallete;
/**full style,light theme */
export declare const light: (tag?: S<HTMLStyleElement>) => import("../style").StyleFnAdd<Pallete>;
export {};
