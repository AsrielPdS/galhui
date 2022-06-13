"use strict";
//import { g, svg, S, E, cls, wrap, ANYElement, One, get, Render, css } from "galho";
//import { isU, isN, isP, isO, t, isS, isF, clamp, isA, up, delay, efe, has, lazy, lazy2, notF, extend } from "inutil";
//import o = require("orray");
//namespace ui {
//  // #region utilities
//  export const icon = (dt: Icon) => setts.i(dt);
//  // #endregion
//  // #region components
//  export interface ICheckBt extends IAcent {
//    on?: boolean;
//  }
//  export class CheckBt extends E<ICheckBt, { input: boolean }>{
//    view() {
//      return acent(this.i).on("click", () => {
//        this.toggle("on");
//        this.emit("input", this.i.on);
//      });
//    }
//  }
//  function acent(i: IAcent) {
//    let ic = icon(i.icon);
//    return g(i.tag || "div", cls(i.cl, i.style, i.color, i.full && C.full), i.side ? [
//      ic,
//      g('span', [C.body], i.text),
//      wrap(i.side, C.side, 'span')
//    ] : [ic, i.text])
//      .prop('title', i.tip || '')
//  }
//  //---------------------buttons------------------
//  export interface IBt extends IAcent {
//    type?: 'submit' | 'reset' | 'button';
//  }
//  export function bt(md: IBt, action?: click): button;
//  export function bt(icon: str, text?: any, action?: click): button;
//  export function bt(arg1: IBt | str, arg2?: any, arg3?: click) {
//    if (isS(arg1)) {
//      arg1 = { text: arg2, icon: arg1 };
//      arg2 = arg3;
//    }
//    arg1.cl = cls(arg1.cl).tryAdd(C.bt);
//    arg1.tag = 'button';
//    return acent(arg1).on("click", <click>arg2);
//  }
//  export const btClose = (action?: click) => bt({
//    cl: C.close,
//    icon: 'close'
//  }, action);
//  export const btCancel = (action?: click) => bt({
//    icon: 'close',
//    color: Color.error,
//    text: setts.gl.cancel
//  }, action).d(false)
//  export const btConfirm = (action?: click) => bt({
//    icon: 'check',
//    type: 'submit',
//    color: Color.accept,
//    key: 1,
//    text: setts.gl.confirm
//  }, action);
//  export function tag(model: IAcent | string) {
//    if (isS(model) || model instanceof S)
//      model = { text: model };
//    model.cl = cls(model.cl).tryAdd(C.tag);
//    return acent(model);
//  }
//  //---------------------modal------------------
//  //---------------------layout components------------------
//  type MItem = One | [size: number, dt: One];
//  const stackI = (a: MItem, v?: bool) => isA(a) ? g(a[1]).css(v = <any>(v ? "height" : 'width'), a[0] + '%') : g(a).css(<any>v, '50%');
//  export const row = (a: MItem, b: MItem, change?: (a: number, b: number) => any) => div([C.stack, Ori.h], [
//    stackI(a), divisor(Ori.h, change), stackI(b),
//  ]);
//  export const col = (a: MItem, b: MItem, change?: (a: number, b: number) => any) => div([C.stack, Ori.v], [
//    stackI(a, true), divisor(Ori.v, change), stackI(b, true)
//  ]);
//  export interface TabItem extends IAcent {
//    tp?: string;
//    focus?: (body: S) => any,
//    body
//  }
//  export const tab = (items: o.L<TabItem>, remove: boolean, empty?: () => One) => div([C.tab], [
//    items.bind(div([C.menubar]), {
//      tag: (v, a) => v.cls(C.on, a),
//      insert: value => div(C.item, [
//        ui.icon(value.icon),
//        value.text,
//        remove && btClose(e => { e.stopPropagation(); items.remove(value); })
//      ]).on('click', () => items.setTag(C.on, value))
//    }),
//    div().do(b => {
//      let cb = (v: TabItem) => {
//        b.attr("id", false).clearCls().cls(C.body);
//        if (v) {
//          b.set(isF(v.body) ? (v.body = v.body(v)) : v.body);
//          v.focus?.(b);
//        } else b.set(empty?.());
//      };
//      items.ontag(C.on, cb);
//      cb(items.getTag(C.on)?.value);
//    }),
//  ]);
//  // #endregion
//  // #region modules
//  export module menu {
//    /**separator */
//    export const sep = () => g("tr", C.divisor);
//    /**item type */
//    export const enum T {
//      item,
//      menu,
//      header,
//      sub,
//      join,
//      img,
//      divisor,
//      right,
//      check,
//      radio
//    }
//    export function item(item: BaseMenuItem, sub?: boolean, sided?: boolean) {
//      switch (item.tp) {
//        case T.item:
//        case undefined:
//          return bt(item, item.action).cls(C.item);
//        case T.divisor:
//          return g('hr');
//        case T.sub:
//          if (sub) {
//            if (item.hover == null)
//              item.hover = true;
//            item.sub = true;
//          }
//          return new Dropdown(item).render().cls(C.item);
//        case T.menu:
//          return menu(item.child, item.class);
//        case T.check:
//          return g('label', [C.checkbox, C.item], [
//            g('input', { type: 'checkbox', checked: !!item.checked, oninput: item.oninput, name: item.name }),
//            item.text
//          ]);
//        case T.radio:
//          return g('label', [C.checkbox, C.item], [
//            g('input', { type: 'radio', name: item.name, checked: !!item.checked, value: item.key as string, oninput: item.oninput }),
//            item.text
//          ]);
//        case T.header: {
//          let t = g('h' + (item.level || 4) as any, [C.item, C.head], [
//            icon(item.icon),
//            item.text
//          ]);
//          if (item.cls)
//            t.cls(item.cls);
//          return t;
//        }
//        case T.right:
//          return g('hr', HAlign.right);
//        case T.img:
//          return g('img', { src: item.src }).cls(C.item);
//      }
//    }
//    export function helper(child: Item[], sub?: boolean, sided?: boolean): any {
//      var result: any[] = [];
//      if (child)
//        for (let i = 0; i < child.length; i++) {
//          let t = child[i];
//          if (!t) continue;
//          if (S.is(t))
//            result.push(t);
//          else if ('render' in t && isF(t.render))
//            result.push(t.render());
//          else if (t instanceof Array)
//            result.push(helper(t, sub, sided));
//          else result.push(item(t as BaseMenuItem, sub, sided));
//        }
//      return result;
//    }
//  }
//  export module form {
//    export function valid(e: HTMLFormElement) {
//      for (let c = 0; c < e.length; c++) {
//        let i = e[c] as HTMLInputElement;
//        if (!i.validity.valid)
//          return false;
//      }
//      return true;
//    }
//    export function data(e: HTMLFormElement) {
//      var r: Dic<Primitive | Date> = {};
//      for (let c = 0; c < e.length; c++) {
//        let i = e[c] as HTMLInputElement;
//        if (i.name)
//          switch (i.type) {
//            case 'radio':
//              if (i.checked)
//                r[i.name] = i.value;
//              break;
//            case 'checkbox':
//              r[i.name] = i.checked;
//              break;
//            case 'date':
//            case 'time':
//            case 'week':
//              r[i.name] = i.valueAsDate;
//              break;
//            case 'number':
//            case 'range':
//              r[i.name] = i.valueAsNumber;
//              break;
//            case 'submit':
//              break;
//            default:
//              r[i.name] = i.value;
//              break;
//          }
//      }
//      return r;
//    }
//  }
//  export module ly {
//  }
//  // #endregion
//  export const enum C {
//    on = "on",
//    menu = 'menubox',
//    item = "i",
//    close = "cl",
//    layout = 'ly',
//    layoutItem = 'lyItem',
//    stack = 'layout-stack',
//    invert = "invert",
//    report = "report",
//    box = "box",
//    empty = "empty",
//    maximized = "maximized",
//    gallery = "gallery",
//    treeBox = "tree-box",
//    // #region table
//    formula = "formula",
//    table = "table",
//    record = "r",
//    recordGroup = "record-group",
//    tableItemGroup = "table-item-group",
//    // #endregion
//    // #region propertyPanel
//    propertyPanel = "property-panel",
//    formItem = "property-panel-item",
//    propertyPanelItemGroup = "property-panel-item-group",
//    // #endregion
//    // #region elements
//    panel = 'p',
//    bt = 'bt',
//    dropdown = 'd',
//    row = 'row',
//    column = 'column',
//    props = 'property-panel',
//    context = "context",
//    menubar = 'menubar',
//    book = '',
//    label = 'label',
//    //layoutComponent = "layout-component",
//    form = "form",
//    divisor = "divisor",
//    tab = "tab",
//    // #endregion
//    // #region partes de elementos
//    head = 'head',
//    body = 'body',
//    foot = 'foot',
//    itemA = 'item-a',
//    itemB = 'item-b',
//    itemC = 'item-c',
//    itemD = 'item-d',
//    itemE = 'item-e',
//    itemF = 'item-f',
//    // #endregion
//    corner = 'corner',
//    absolute = "absolute",
//    off = "off",
//    grid = "grid",
//    selected = "selected",
//    items = "items",
//    options = "options",
//    tag = "tg",
//    card = "card",
//    heading = "heading",
//    tiles = "tiles",
//    tile = "tile",
//    select = "select",
//    input = "in",
//    color = "color",
//    colorPicker = "colorPicker",
//    transform = "-transform",
//    bookMedia = "media",
//    join = "join",
//    modal = "md",
//    modalArea = "md-area",
//    load = "load",
//    loading = "loading",
//    centered = "centered",
//    panels = "panels",
//    //on = "on",
//    crud = "crud",
//    accordion = "accordion",
//    accordions = "accordions",
//    vertical = "vertical",
//    checkbox = "checkbox",
//    switch = "switch",
//    cem = "cem",
//    list = "list",
//    step = "step",
//    more = "more",
//    inlineForm = "inline-form",
//    full = "full",
//    fill = "fill",
//    hideBox = "hidebox",
//    maskedInput = "maskedInput",
//    group = "group",
//    splitForm = "splitForm",
//    explorer = "explorer",
//    tree = "tree",
//    branch = "branch",
//    resizer = "resizer",
//    scrollbar = "scrollbar",
//    disabled = "dsb",
//    placer = "placer",
//    popup = "popup",
//    geolocation = "geolocation",
//    wrap = "wrap",
//    fileSelector = "file-selector",
//    inline = "inline",
//    outline = "outline",
//    side = "side",
//    hidden = "hidden",
//    postbar = "post-bar",
//    link = "lk",
//    block = "block",
//    expression = "expression",
//    html = "html",
//    rowForm = "row-form",
//    pagging = "pagging",
//    main = "main",
//    calc = "calc",
//    pair = "pair",
//    option = "option",
//    placeholder = "placeholder",
//    icon = "icon",
//    watermark = "wm",
//    noPrint = "no-print",
//    key = "key",
//    alert = "al",
//    alerting = "alerting",
//    bulkForm = "bulkForm",
//    arrow = "arrow"
//  }
//  type Info = {
//    h?: string,
//    b: string;
//  } | string;
//  type Pair2<V = any, K = str> = { key: K, val?: V };
//  interface Tag<T extends Key = str> {
//    key?: T;
//    icon?: Icon;
//    color?: Color;
//    text?: any;
//  }
//  /** */
//  type IconType = "font" | "svg" | "img";
//  /** */
//  const enum Size {
//    xLarge = "x-large",
//    large = "large",
//    bigger = "bigger",
//    normal = "normal",
//    smaller = "smaller",
//    small = "small",
//    xSmall = "x-small",
//    full = "full"
//  }
//  //TODO trocar nome de color para state ou outra coisa
//  export const enum Color {
//    error = "error",
//    /**desabled */
//    gray = "gray",
//    important = "important",
//    normal = "normal",
//    warning = "warning",
//    accept = "ok"
//  }
//  /** */
//  interface FontIcon {
//    dt: string;
//    tp?: "font";
//    /**color */
//    c?: Color;
//    /**size */
//    s?: Size;
//  }
//  interface SvgIcon {
//    dt: string;
//    tp: "svg";
//    /**color */
//    c?: Color;
//    /**size */
//    s?: [number, number] | number;
//  }
//  interface ImageIcon {
//    dt: string;
//    tp: "img";
//    /**size */
//    s?: number;
//  }
//  export const enum IconSz {
//    xLarge = "xl",
//    large = "l",
//    normal = "n",
//    small = "s"
//  }
//  export type Icon = { d: str, s?: IconSz, c?: str | Color } | str;
//  const enum Style {
//    basic = "basic",
//    normal = "normal"
//  }
//  type TAlign = "center" | "justify" | "left" | "right" | "start" | "end";
//  //********************************* utilities ***********************
//  interface Settings {
//    /**root font size */
//    rem?: int;
//    /**globalization */
//    gl?: Dic<any>;
//    /**classes */
//    c?: Partial<{
//      tag: str;
//      bt: str;
//      tab: str;
//      stack: str;
//      /**item */
//      i: str
//    }>
//    /** icon */
//    i?(icon: Icon): S<ANYElement>;
//  }
//  export const setts: Settings = {};
//  //#endregion
//  type Action<T = any, E = MouseEvent, R = any> = any;
//  interface AcentEvents {
//    click: MouseEvent;
//  }
//  interface IAcent extends Tag<Key> {
//    tag?: keyof HTMLElementTagNameMap;
//    /**forma de mostrar o contiudo */
//    style?: Style,
//    /**cor do element */
//    color?: Color;
//    size?: Size;
//    text?: any;
//    /**class list */
//    cl?: string | string[];
//    icon?: Icon,
//    popup?: any,
//    data?: unknown;
//    confirm?: boolean;
//    full?: boolean;
//    disabled?: boolean;
//    tooltip?: string;
//    div?: boolean;
//    tip?: string;
//    side?: any;
//  }
//  class Acent<M extends IAcent = IAcent, E extends AcentEvents = AcentEvents> extends E<M, E> {
//    //constructor()cls: string | string[],
//    view() {
//      let md = this.i;
//      return this.bind(g(md.tag || 'span'), function (s) {
//        let i = icon(md.icon);
//        s
//          //.prop('type', md.type || 'button')
//          .prop('title', md.tip || '')
//          .clearCls()
//          .cls(cls(md.cl, md.style, md.color, md.full && C.full))
//          .set(md.side ? [
//            i,
//            g('span', [C.body], md.text),
//            wrap(md.side, C.side, 'span')
//          ] : [i, md.text])
//          .prop('disabled', md.disabled);
//      }).on('click', (e) => { this.emit('click', e); });
//    }
//    click(e?: MouseEvent) { this.emit('click', e) }
//  }
//  /**button */
//  type click = (this: HTMLButtonElement, e: MouseEvent) => any;
//  type button = S<HTMLButtonElement>;
//  /**button */
//  export const enum CheckboxState {
//    off = 0,
//    on = 1,
//    indeterminate = 2
//  }
//  export interface ICheckbox {
//    name?: string;
//    //checkedIcon?: Icon;
//    //uncheckedIcon?: Icon;
//    checked?: boolean;
//    text?: string;
//  }
//  export class CheckBox extends E<ICheckbox, { input: never; }>{
//    view() {
//      let
//        model = this.i,
//        _this = this;
//      return g('label', [C.checkbox, C.item], [
//        this.bind(g('input', {
//          type: 'checkbox',
//          name: model.name
//        }).on('input', function () {
//          _this
//            .update('checked', this.checked)
//            .emit('input');
//        }), (s) => {
//          s.prop('checked', model.checked);
//        }, 'checked'),
//        model.text
//      ]);
//    }
//  }
//  export interface PopupSetupOptions {
//    /**if true when this element or sub-elements is active popup will show */
//    blur?: boolean;
//    click?: boolean;
//    hover?: {
//      /**time in  milesecund to show popup after mouse in */
//      show?: number;
//      /**time in  milesecund to hide popup after mouse out*/
//      hide?: number;
//    };
//  }
//  export interface Popper {
//    // This is the main state object containing all of the information about the
//    // popper.
//    state,
//    // Synchronously updates the popper instance. Use this for low-frequency
//    // updates.
//    forceUpdate();
//    // Asynchronously updates the popper instance, and returns a promise. Use this
//    // for high-frequency updates.
//    update();
//    // Updates the options of the instance.
//    setOptions(options);
//    // Cleans up the instance.
//    destroy();
//  }
//  export interface ipopup {
//    v?: VAlign;
//    h?: HAlign;
//    o?: Ori;
//    tp?: PpTp
//    arrow?: bool;
//  }
//  /**Popup type */
//  export const enum PpTp { none = 0, click = 1, hover = 2, focus = 4 }
//  export async function popup(target: S, tip: any, opts: ipopup = {}) {
//    let pop: Popper, h: str, v: str,
//      popper = R("https://unpkg.com/@popperjs/core@2"),
//      /**open */
//      o = async () => pop = (await popper).createPopper(target.e, (tip = wrap(tip = lazy(tip), C.popup)
//        .add(t(opts.arrow) && div(C.arrow).attr("data-popper-arrow", true)))
//        .addTo(body).e, {
//        placement: (h ? v ? `${v}-${h}` : h : v ? v : "auto") as any,
//        modifiers: [
//          // { name: 'preventOverflow'},
//          // { name: 'flip'},
//          {
//            name: 'offset',
//            options: {
//              offset: [0, t(opts.arrow) ? 8 : 3],
//            },
//          },
//        ],
//      }),
//      /**close*/
//      c = () => {
//        pop?.destroy();
//        pop = null;
//        if (tip instanceof S)
//          tip.remove();
//      }
//    switch (opts.h) {
//      case HAlign.left: h = "start"; break;
//      case HAlign.right: h = "end"; break;
//    }
//    switch (opts.v) {
//      case VAlign.top: v = "top"; break;
//      case VAlign.bottom: v = "bottom"; break;
//    }
//    if (opts.tp) {
//      let hdl = [], add = <T>(v: T) => <T>(hdl.push(v) && v);
//      if (efe(opts.tp, PpTp.click))
//        target.on('click', add(() => pop ? c() : o()));
//      if (efe(opts.tp, PpTp.hover)) {
//        let t: number;
//        target.on({
//          mouseenter: add(() => t = delay(t, o)),
//          mouseleave: add(() => t = delay(t, c))
//        });
//      }
//      if (efe(opts.tp, PpTp.focus))
//        target.focusin(o).focusout(c);
//      return () => {
//        //TODO remove focusin focusout
//        hdl.forEach(v => target.off(["click", "mouseenter", "mouseleave"], v));
//        c();
//      }
//    } else {
//      await o();
//      return c;
//    }
//  }
//  export function panel(head: any, body?: any, foot?: any, tag?: keyof HTMLElementTagNameMap) {
//    return g(tag || "div", [C.panel], [
//      head && wrap(head, C.head),
//      wrap(body, C.body),
//      foot && wrap(foot, C.foot)
//    ]);
//  }
//  export interface IDropdown {
//    div?: S;
//    icon?: Icon;
//    text?: any,
//    cls?: string,
//    //tag?: keyof HTMLElementTagNameMap;
//    hover?: boolean;
//    menu?: One | (() => One);
//    open?: boolean;
//    sided?: boolean;
//    verticalAlign?: VAlign,
//    horizontalAlign?: HAlign,
//    focus?: boolean;
//    size?: Size;
//    sub?: boolean;
//    child?: menu.Item[] | (() => menu.Item[]);
//  }
//  export class Dropdown extends E<IDropdown> {
//    constructor(model: IDropdown, c?: menu.Item[] | (() => menu.Item[])) {
//      model.open = false;
//      super(model);
//      if (c)
//        model.child = c;
//    }
//    menu: S;
//    static
//    view() {
//      let
//        i = this.i,
//        mn = this.menu,
//        p = i.div || div(cls(C.dropdown, i.cls), [icon(i.icon), i.text, i.sub && ui.icon('menu-right').cls(C.side)]);
//      if (i.focus !== false)
//        //TODO: VER ISTO
//        p.on('cl', () => { this.update('open', false); }).prop('tabIndex', 0);
//      this.bind(p, (s) => {
//        s.cls(C.on, i.open);
//        if (i.open) {
//          if (!mn) {
//            this.menu = mn = i.menu = wrap(i.menu, cls(C.menu, i.size));
//            if (i.child)
//              mn.set(menu.helper(lazy2(i, 'child'), true, i.sided));
//            mn.on('click', (e) => e.stopPropagation());
//          }
//          s.add(mn);
//          Dropdown.place(s, mn, i.sub, i.verticalAlign, i.horizontalAlign)
//        } else mn && mn.remove();
//      }, 'open', true);
//      if (i.hover) {
//        let id;
//        p.on({
//          mouseenter: () => {
//            clearTimeout(id);
//            id = setTimeout(() => this.update('open', true), 500);
//          },
//          mouseleave: () => {
//            clearTimeout(id);
//            id = setTimeout(() => this.update('open', false), 500);
//          }
//        });
//      }
//      p.on({
//        click: () => {
//          this.update('open', !i.open);
//        },
//        focusout: (e) => {
//          if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Element))
//            this.update('open', false);
//        },
//        keydown: (e) => {
//          switch (e.key) {
//            case Keys.Enter:
//              this.update('open', true);
//              break;
//            case Keys.Escape:
//              this.update('open', false);
//              break;
//            default:
//              return;
//          }
//          e.stopPropagation();
//        }
//      });
//      return p;
//    }
//    static from(div: S, model: IDropdown = {}) {
//      div.child('.' + C.menu).try(mn => { model.menu = mn; mn.remove() });
//      model.div = div.cls(C.dropdown);
//      let dd = new Dropdown(model);
//      g(dd);
//      return dd;
//    }
//  }
//  export module pop {
//  }
//  export interface IDropdownItem {
//    icon: string;
//    text: string;
//    action: (e) => any;
//  }
//  type MenuStyle = 'fluid';
//  //extends E < IMenubar, menu.Item[] > 
//  const context = 'oncontextmenu' in body.e;
//  const div = (props?: 0 | string[] | string | Partial<HTMLDivElement>, child?: any) => g("div", props, child);
//  export function hidebox(child: S) {
//    var hide = div(C.hideBox, child.on({
//      focus() {
//        hide.cls(C.on);
//      },
//      blur() {
//        hide.cls(C.on, false);
//      }
//    }));
//    return hide;
//  }
//  //-----------------------------------------------------------
//  //--------------------file selector--------------------------
//  //-----------------------------------------------------------
//  export const icons = ['alert-circle', 'check-circle', 'close-circle', 'new-box', 'cancel', 'connection', 'lock', 'cards-heart', 'cash', 'account', 'magnify', 'eye'];
//  const divisorSize = 6;
//  export const hover = (s: S, a, b) => s.css({
//    position: "absolute"
//  });
//  const modules: Dic = {};
//  export function R(module: str) {
//    if (module in modules)
//      return modules[module];
//    return new Promise((rs, rj) => {
//      let xhr = new XMLHttpRequest();
//      xhr.onload = () => {
//        if (xhr.status == 200) {
//          let exports = {}, dt = { exports };
//          eval(`((exports,module)=>{${xhr.responseText}\n})//# sourceURL=${location.origin + module}`)(exports, dt);
//          rs(modules[module] = dt.exports);
//        } else rj();
//      };
//      xhr.open("GET", module);
//      xhr.send();
//    });
//  }
//}
//export = ui;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2xkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib2xkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxRkFBcUY7QUFDckYsdUhBQXVIO0FBQ3ZILDhCQUE4QjtBQUc5QixnQkFBZ0I7QUFDaEIsd0JBQXdCO0FBQ3hCLGtEQUFrRDtBQUNsRCxpQkFBaUI7QUFFakIseUJBQXlCO0FBQ3pCLDhDQUE4QztBQUM5QyxtQkFBbUI7QUFDbkIsS0FBSztBQUNMLGlFQUFpRTtBQUNqRSxjQUFjO0FBQ2QsZ0RBQWdEO0FBQ2hELDRCQUE0QjtBQUM1Qix3Q0FBd0M7QUFDeEMsV0FBVztBQUNYLE9BQU87QUFDUCxLQUFLO0FBQ0wsK0JBQStCO0FBQy9CLDRCQUE0QjtBQUM1Qix3RkFBd0Y7QUFDeEYsV0FBVztBQUNYLG9DQUFvQztBQUNwQyxvQ0FBb0M7QUFDcEMsdUJBQXVCO0FBQ3ZCLG1DQUFtQztBQUNuQyxLQUFLO0FBQ0wsb0RBQW9EO0FBQ3BELHlDQUF5QztBQUN6QywyQ0FBMkM7QUFDM0MsS0FBSztBQUNMLHdEQUF3RDtBQUN4RCxzRUFBc0U7QUFDdEUsbUVBQW1FO0FBQ25FLHNCQUFzQjtBQUN0QiwwQ0FBMEM7QUFDMUMsb0JBQW9CO0FBQ3BCLE9BQU87QUFDUCwwQ0FBMEM7QUFDMUMsMEJBQTBCO0FBQzFCLGtEQUFrRDtBQUNsRCxLQUFLO0FBQ0wsbURBQW1EO0FBQ25ELGtCQUFrQjtBQUNsQixtQkFBbUI7QUFDbkIsZUFBZTtBQUVmLG9EQUFvRDtBQUNwRCxvQkFBb0I7QUFDcEIseUJBQXlCO0FBQ3pCLDJCQUEyQjtBQUMzQix1QkFBdUI7QUFDdkIscURBQXFEO0FBQ3JELG9CQUFvQjtBQUNwQixxQkFBcUI7QUFDckIsMEJBQTBCO0FBQzFCLGFBQWE7QUFDYiw0QkFBNEI7QUFDNUIsZUFBZTtBQUdmLGlEQUFpRDtBQUNqRCwyQ0FBMkM7QUFDM0MsZ0NBQWdDO0FBRWhDLDZDQUE2QztBQUM3QywwQkFBMEI7QUFDMUIsS0FBSztBQUVMLGtE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