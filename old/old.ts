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