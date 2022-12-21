import { active, cl, clearEvent, div, E, g, HSElement, One, onfocusout, S, wrap } from "galho";
import { Alias, extend, L, range } from "galho/orray.js";
import { assign, bool, byKey, call, def, Dic, isO, isU, Key, l, str, sub, t, Task } from "galho/util.js";
import { $, MenuItems, FluidRect, FluidAlign, fluid, body, C, cancel, close, close as closeBT, Color, confirm, hc, icon, Icon, menu, menuitem, negative, positive, VAlign, w } from "./galhui.js";
import { anim } from "./util.js";

export interface IModal<K> {
  valid?: (key: K) => Task<unknown>;
  /**close on click out of modal */
  blur?: bool;

  // close?: bool;
  // cls?: str | str[];
  // valid?(key: K): any;
  /**submit button(called when press enter) */
  // submit?: S;
}
interface IBody { cls?: str, close?: bool }
export interface Modal<K> extends Promise<K>, IModal<K> {
  area: S;
  body: S;
  cb: (v: K) => void;
}
//TODO remover valid
export function modal<K = Key>(i: IModal<K> = {}) {
  let resolve: any, p = assign(new Promise<K>(r => resolve = r) as Modal<K>, i);
  p.cb = resolve;
  return p;
}
export function modalBody<K>(md: Modal<K>, bd: any, actions?: S[], i: IBody = {}) {
  md.body = g("form", cl("_ modal panel", i.cls), [
    wrap(bd, "bd"),
    // t(i.close) && closeBT(() => closeModal(md)),
    actions && div("ft", actions.map(a => a.on('click', e => { e.preventDefault(); closeModal(md, a.d()) })))
  ]).p("tabIndex", 0).on('keydown', (e) => {
    if (e.key == "Escape") {
      clearEvent(e);
      closeModal(md);
    }
  });
  return md;
}
export function openModal<K>(md: Modal<K>) {
  if (!md.area) {
    md.area = div(hc(C.modalArea), md.body).addTo(body);
    md.body.focus();
    md.blur && md.area.p("tabIndex", 0).on("focus", () => closeModal(md));
  }
  return md;
}
export function mdOpen(modal: S, blur?: bool) {
  let t = div(hc(C.modalArea), modal).addTo(body);

  blur && t.on("click", function _(e) {
    if (e.target == e.currentTarget)
      t.off("click", _).remove()
  });

  return t;
}
/**define a body and show modal */
export function openBody<K>(md: Modal<K>, bd: any, actions?: S[], i?: IBody) {
  return openModal(modalBody(md, bd, actions, i));
}
export async function closeModal<K>(md: Modal<K>, v?: K) {
  if (md.area && (!md.valid || await md.valid(v))) {
    md.area.remove();
    md.cb(v);
    md.area = null;
  }
}
export function mapButtons<K>(md: Modal<K>) {
  md.body.child(".ft").childs('[type="button"],[type="submit"]')
    .eachS(bt => bt.on("click", e => { e.preventDefault(); closeModal(md, bt.d()) }));
  return md;
}
export function addClose<K>(md: Modal<K>) {
  md.body.add(closeBT(() => closeModal(md)));
  return md;
}

export function fromPanel<K>(panel: One, i: IModal<K> = {}) {
  let md = modal(i);
  md.body = g(panel, "_ modal panel");
  return openModal(mapButtons(md));
}

export const headBody = (i: Icon, title: any, bd: any) => [
  div("hd", [icon(i), title]),
  wrap(bd, "bd"),
];

export function okCancel(body: any, valid?: () => any) {
  return openBody(modal({ valid: valid && (v => !v || valid()) }), body, [confirm().d(true), cancel()], { cls: "xs" });
}
export function yesNo(body: any, valid?: () => any) {
  return openBody(modal({ valid: valid && (v => !v || valid()) }), body, [positive(null, w.yes).d(true), negative(null, w.no)]);
}
export function ok(msg: any) {
  return openBody(modal(), msg, [confirm()]);
}
export function error(msg: any) {
  return openBody(modal(), msg, [confirm()], { cls: Color.error });
}

export function popup(div: S, e: () => FluidRect, align: FluidAlign) {
  let
    last = active(),
    ctx = div.p("tabIndex", 0),
    // isOut: bool,
    wheelHandler = (e: Event) => clearEvent(e);
  ctx.queryAll('button').on('click', function () { last.valid ? last.focus() : this.blur() });

  ctx.on({
    focusout: (e: FocusEvent) => ctx.contains(e.relatedTarget as HTMLElement) || (ctx.remove() && body.off("wheel", wheelHandler)),
    keydown(e) {
      if (e.key == "Escape") {
        e.stopPropagation();
        ctx.blur();
      }
    }
  }).addTo(body).focus();
  // .css({
  //   left: opts.clientX + 'px',
  //   top: opts.clientY + 'px'
  // })
  anim(() => (fluid(e(), ctx, align), body.contains(ctx)));
  body.on("wheel", wheelHandler, { passive: false });
}
/**context menu */
export function ctx(e: MouseEvent, data: MenuItems) {
  clearEvent(e);
  popup(div("_ menu", g("table", 0, data)), () => new DOMRect(e.clientX, e.clientY, 0, 0), "ve");
}
export function tip<T extends HSElement>(root: One<T>, div: any, align?: FluidAlign): S<T>
export function tip<T extends HSElement>(root: S<T>, div: S, align: FluidAlign = "v") {
  div = wrap(div, "_ tip");
  return (root = g(<any>root))?.on({
    mouseenter() {
      body.add(div);
      anim(() => body.contains(root) ?
        body.contains(div) && fluid(root.rect(), div as S, align) :
        (div.remove(), false));
    },
    mouseleave() { div.remove() }
  });
}

export interface IRoot<T extends Dic = Dic> {

  /**if should open when clicked 
   * @default true */
  click?: bool;
  /**if should have menu-down icon 
   * @default true */
  icon?: bool;
  open?: bool;
  off?: bool;
  /**gain focus via tab key 
   * @default true
  */
  tab?: bool;
  clear?: bool
  /**placeholder */
  ph?: any;
  item?(v: T): any
  /**label field */
  // label?: Key;
}
export type Root = E<IRoot, { open?: [bool] }> & {
  value: Key;
};


// export function keydown<T extends Object = any>(me: Root, e: KeyboardEvent, options: L<T, any>, set: (...values: Key[]) => any) {

// }
/**create root, add handlers */
export function setRoot(me: Root, options: L, label: S, menu: S) {
  let
    i = me.i,
    root = onfocusout(div(["_", C.select], [label.c("bd"), t(i.icon) && icon($.i.dd)?.c(C.side)/*, me.menu*/]), () => me.set("open", false))
      .p("tabIndex", 0)
      .on({
        focus(e) {
          if (i.off) {
            if (e.relatedTarget)
              g(e.relatedTarget as Element).focus();
            else root.blur();
          } else root.c("on");
        },
        keydown(e) {
          switch (e.key) {
            case "ArrowUp":
              me.set("open", true);
              range.move(options, "on", -1, range.tp(e.shiftKey, e.ctrlKey));
              break;
            case "ArrowDown":
              me.set("open", true);
              range.move(options, "on", 1, range.tp(e.shiftKey, e.ctrlKey));
              break;
            case "Enter":
              if (me.i.open)
                me.value = l(options) == 1 ?
                  options[0][options.key] as any :
                  sub(range.list(options, "on"), options.key as any)[0];
              else {
                let frm = g(me).closest("form");
                if (frm) frm?.e.requestSubmit();
                else return;
              }
              break;
            case "Escape":
              if (me.i.open) {
                me.set("open", false);
                break;
              } else return;

            default:
              return;
          }
          clearEvent(e);
        }
      });
  if (t(i.click))
    root.on('click', (e) => {
      if (i.off) {
        e.stopImmediatePropagation();
      } else {
        //if (m(<Element>e.target).is('button'))
        //  _this.set(C.open, false);
        //else
        if (!menu.contains(e.target as HTMLElement))
          me.toggle("open");
      }
    });
  me.on(state => {
    if ("off" in state) {
      if (i.off) {
        me.set("open", false);
        root.blur();
        root.c(C.disabled);
        root.p('tabIndex', -1);
      } else {
        root.c(C.disabled, false);
        root.p('tabIndex', t(i.tab) ? 0 : -1);
      }
    }
    if ("open" in state) {
      if (i.open && i.off) {
        me.set("open", false);
        return;
      }
      me.emit('open', i.open);
      root.c("on", i.open);

      if (i.open) {
        menu.addTo(root);
        anim(() => {
          let r = root.rect();
          return body.contains(menu) && (menu.css("minWidth", r.width + "px"), fluid(r, menu, "ve"))
        });
      } else {
        root.c([VAlign.bottom, VAlign.top], false);
        menu.remove();
      }
    }
  });

  return root;
}
export async function setValue<K extends Key = any>(me: Root & { option(k: K): Task<Dic> }, label: S) {
  let v = me.value;
  if (v == null) label.c("_ ph").set(me.i.ph);
  else {
    let o = await me.option(v as K);
    label.c("ph", false).set([me.i.item(o), t(me.i.clear) && close(() => me.value = null)]);
    me.set("open", false);
  }

}
interface SelectItem<K> {
  key: K;
  text?: str;
  i?: Icon;
}
export interface iSelect<K extends Key = str> extends IRoot {
  value?: K;
  ph?: str;
  /**menu width will change acord to content */
  fluid?: boolean;
}
export class Select<K extends Key = str> extends E<iSelect<K>, { input: [K]; open: [bool] }> {
  options: L<SelectItem<K>, K>;
  get selected() { return byKey(this.options, this.i.value); }
  constructor(i: iSelect<K>, options?: Alias<SelectItem<K>, K>) {
    super(i);
    i.item ||= v => def(v.text, v.key);
    this.options = extend<SelectItem<K>, K>(options, {
      key: "key",
      parse: (e) => isO(e) ? e : { key: e }
    });
  }
  get value() { return this.i.value; }
  set value(v) { this.i.value === v || this.set("value", v).emit('input', v) }

  view() {
    let
      { i, options } = this,
      label = g("span"),
      items = g("table").on("click", ({ currentTarget: ct, target: t }) =>
        ct != t && (this.set("open", false).value = g(t as Element).closest("tr").d())),
      menu = div("_ menu", items),
      root = setRoot(this, options, label, menu);
    setValue(this, label);
    this.on(e => ("value" in e) && setValue(this, label));

    options.bind(items, {
      insert: v => menuitem(v.i, i.item(v)),
      tag(active, i, p, tag) {
        let s = p.child(i);
        s.c(tag, active);

        if (active) {
          menu.e.scroll({ top: s.p('offsetTop') - menu.p('clientHeight') / 2 + s.p('clientHeight') / 2 });
        }
      }
    });

    return root;
  }
  option(k: K) {
    return this.options.find(k);
  }
}

export const dropdown = (label: any, items: any, align: FluidAlign = "ve") =>
  call(div("_ dd", label), e => {
    let mn = items instanceof S ? items : null;
    e.on("click", () => {
      if (mn?.parent()) {
        mn.remove();
        e.c("on", false);
      } else {
        (mn ||= menu(items)).c(C.menu).addTo(e.c("on"));
        anim(() => body.contains(mn) && fluid(e.rect(), mn, align));
      }
    });
  });
export const idropdown = (label: any, items: any, align?: FluidAlign) =>
  dropdown([label, icon($.i.dd)], items, align)
// export interface IOpenSelect<T extends Object = Dic, K extends Key = Key> extends ISelect<T, K> {
//   input?: 'text' | 'number';
//   valid?: (value: string) => boolean;
// }
// export function openSelect<T extends Object = Dic, K extends Key = Key>(input: (this: Select<T, K>, value) => any, options: (T | K)[], i: IOpenSelect<T, K> = {}) {
//   let ip = i.labelE = g('input', { type: i.input }).on('input', function () {
//     input.call(select, this.value);
//   });
//   i.label = (value) => {
//     ip.p('value', <any>value);
//   }
//   let select = new Select<T, K>(i, options);
//   return select;
// }



// export interface ISelectBase<T extends Object, K> extends IRoot {
//   menuE?: S;
//   labelE?: S;

//   /**element in menu or menu itself where items will be added */
//   items?: S<HTMLTableElement>;
//   labelParent?: S;
//   menu?: (this: this, value: T) => One;
//   /**called when value change */
//   setMenu?: (this: this, value: K) => void;
//   /**elemento dentro da label onde a label vai ser renderizada */
//   //labelItem?: S;

//   //label: S | ((key: K) => void);

// }
// export abstract class SelectBase<M extends ISelectBase<T, K> = ISelectBase<any, any>, T extends Object = any, K = Key, E extends SelectEvents = SelectEvents> extends E<M, E>  {
//   menu: S;
//   label: S;

//   options: L<T, K>;
//   abstract setValue(...value: K[]): void;

//   constructor(i: M, options?: Alias<T, K>) {
//     super(i);
//     this.options = extend<T, K>(options, {
//       key: "key",
//       parse: (e) => isO(e) ? e : { key: e } as any
//     });
//   }


//   view(): S {
//     let
//       i = this.i,
//       lb = g(i.labelE || 'div').c(C.body);

//     this.label = i.labelParent || lb // model.labelItem || label;

//     this.menu = (i.menuE || div(0, i.items = g("table"))).c("_ menu");

//     //if (model.menuItems && model.menuItems != this.menu) {
//     //  this.menu.setClass(Cls.fill);
//     //  model.menuItems.setClass(Cls.full);
//     //}

//     i.open = false;


//     //if (!md.menuRender)
//     //  md.menuRender = value => div( null, value[md.key]);

//     return root(this, i, this.options);
//   }

//   protected insertItem(value: T) {
//     var model = this.i;

//     return g(model.menu(value))
//       //.setClass(Cls.option)
//       .on('click', (e) => {
//         e.stopPropagation();
//         let k = value[model.key];
//         this.setValue(k);
//       });
//   }
// }
// export interface IMultselect<T extends Object = any, K extends str | num = str> extends ISelectBase<T, K> {
//   value?: L<K>;
//   empty?: (empty: boolean, container?: S) => void;
//   label?: (this: L<K>, value: K, index?: number, container?: S) => void | One;// Child | Promise;
// }
// export class Multselect<T extends Object = { key: str }, K extends str | num = str> extends SelectBase<IMultselect<T, K>, T, K, { add: K[], remove: K[]; input: K[] } & SelectEvents> {
//   constructor(i: IMultselect<T, K>, options?: Array<T | K>) {
//     super(i, options);
//     this.options.addGroup("on");
//     i.value = orray(i.value, {
//       parse(item) {
//         if (this.indexOf(item) == -1)
//           return item;
//       }
//     });
//     //.bindToE(this, "value");
//   }
//   get value() { return this.i.value; }
//   view() {
//     let
//       i = this.i,
//       values = i.value,
//       options = this.options,
//       div = super.view(),
//       mItems = i.items,
//       menu = i.items || this.menu;

//     this.label.css('flexWrap', 'wrap');
//     bind(options, menu, {
//       insert: this.insertItem.bind(this),
//       tag(s, active, tag) {
//         s.c(tag, active);

//         if (active) {
//           vScroll(menu, s.e.offsetTop - menu.p('clientHeight') / 2 + s.p('clientHeight') / 2);
//         }
//       },
//       groups: {
//         ["on"](e, active) { e.c(C.on, active); }
//       }
//     });
//     bind(values, menu, {
//       insert(key) {
//         let index = itemIndex(options, key);
//         if (index != -1)
//           mItems
//             .child(index)
//             .c(C.main);
//       },
//       remove(key) {
//         let index = itemIndex(options, key);
//         if (index != -1)
//           mItems
//             .child(index)
//             .c(C.main, false);
//       }
//     });
//     bind(values, this.label, {
//       insert: i.label,
//       empty: i.empty
//     });

//     return root(this, i).on("keydown", e => {
//       switch (e.key) {
//         case "Delete": {
//           let target = g(e.target as HTMLElement);
//           if (is(target, 'input') || is(target, 'textarea') || !this.delete())
//             return;
//           else break;
//         }
//         case "Backspace": {
//           let target = g(e.target as HTMLElement);
//           if (is(target, 'input') || is(target, 'textarea') || !this.backspace())
//             return;
//           else break;
//         }
//       }
//       keydown(e, this.options);
//     });
//   }

//   delete() {
//     let vl = this.i.value;
//     if (!vl.length)
//       return false;

//     this.removeValue(vl[0]);
//     return true;
//   }
//   backspace() {
//     let vl = this.i.value;

//     if (!vl.length)
//       return false;

//     this.removeValue(z(vl));
//     return true;
//   }

//   setValue(...values: K[]) {
//     let md = this.i;

//     //let list = this.model.value;
//     if (values.length) {
//       //let l = list.length;
//       let inserted: K[] = [];

//       for (let value of values) {
//         if (md.value.indexOf(value) == -1) {
//           inserted.push(value);
//         }
//       }


//       //md.value.push(...values);

//       if (inserted.length > 0) {
//         md.value.push(...inserted);

//         this.emit('add', inserted);
//         this.emit('input', md.value.slice());

//         if (md.open && this.$)
//           this.setMenu(this.$)
//       }
//     }
//   }

//   removeValue(...values: K[]) {
//     let
//       md = this.i,
//       removed: K[] = [];

//     for (let value of values) {
//       let i = md.value.indexOf(value);
//       if (i != -1) {
//         md.value.removeAt(i);
//         removed.push(value);
//       }
//     }

//     if (removed.length > 0) {
//       this.emit('remove', removed);
//       this.emit('input', md.value.slice());

//       if (md.open && this.$)
//         this.setMenu(this.$)
//     }
//   }

//   //setLabel(value: T) {
//   //  var model = this.model;
//   //  return model.menuRender(<T>value)
//   //    .setClass(Cls.option)
//   //    .on('click', (e) => {
//   //      e.stopPropagation();
//   //      let k = value[model.key];
//   //      this.set('value', k);
//   //      model.child.setTag(focusKey, k);
//   //    })
//   //}

// }



// export interface IOpenMultselect<T extends Object = Dic, K extends Key = Key> extends IMultselect<T, K> {
//   input?: 'text' | 'number';
//   valid?: (value: string) => boolean;
//   /**place holder */
//   ph?: str;
// }
// export function openMultselect<T extends Object = Dic, K extends Key = Key>(i: IOpenMultselect<T, K>, allOptions: T[]) {
//   let
//     select = new Multselect<T, K>(assign(i, {
//       label(value) {
//         i.labelE.p('value', value);
//       },
//       labelE: g('input', { type: i.input, placeholder: i.ph }).on({
//         input() {
//           let arg: Arg<str> = { v: this.value };
//           select.emit("type" as any, arg);
//           if (!arg.p) {
//             allOptions ||= opts.slice();
//             let parts = valid(arg.v.split(/\s+/g)).map(q => new RegExp(q, "gu"));
//             opts.set(allOptions.filter(o => parts.every(p => p.test(o[i.key]))));
//           }
//           if (l(opts) == 1)
//             addSelection(opts, "on", opts[0], SelectionTp.set);
//         },
//         keydown(e) {
//           if (e.key == "Enter" && !opts.tags["on"]) {
//             clearEvent(e);
//             let arg: Arg<str> = { v: this.value };
//             if (i.valid ? i.valid(arg.v) : false) {
//               select.emit("submit" as any, arg)
//               if (!arg.p) {
//                 opts.push({ [i.key]: arg.v } as any);
//                 select.setValue(arg.v as K);
//               }
//             }
//           }
//         }
//       })
//     }), allOptions),
//     opts = select.options;
//   g(select).c(C.input)
//   return select;
// }