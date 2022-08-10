import { clearEvent, div, E, g, S } from "galho";
import { byKey, call, isO, l, sub, t } from "inutil";
import { Alias, bind, extend, L } from "orray";
import { list as selected, move as moveSelection, tp as selectionType } from "orray/selector.js";
import { $, body, C, close, hc, icon, Icon, VAlign } from "./galhui.js";
import { fixedMenu, fluid } from "./hover.js";
import { menu, menuitem } from "./menu.js";
export interface IRoot {

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
  /**label field */
  label?: str;
}
export type Root = E<IRoot, { open: bool }>;


export function keydown<T extends Object = any>(me: Root, e: KeyboardEvent, options: L<T, any>, set: (...values: Key[]) => any) {
  switch (e.key) {
    case "ArrowUp":
      me.set("open", true);
      moveSelection(options, "on", -1, selectionType(e.shiftKey, e.ctrlKey));
      break;
    case "ArrowDown":
      me.set("open", true);
      moveSelection(options, "on", 1, selectionType(e.shiftKey, e.ctrlKey));
      break;
    case "Enter":
      if (me.i.open) {
        if (l(options) == 1) {
          set(options[0][options.key] as any);
        } else {
          set(...sub(selected(options, "on"), options.key as any));
          break;
        }
      }
      // quando estiver fechado nao abri para permitir
      // usar o enter para submeter o formulario (me.set(C.open, true))
      return;

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
/**create root, add handlers */
export function setRoot(me: Root, label: S, menu: S, fluid?: bool) {
  let
    i = me.i,
    root = div(["_", C.select], [label.cls("bd"), t(i.icon) && icon($.i.dd)?.cls(C.side)/*, me.menu*/])
      .prop("tabIndex", 0)
      .on({
        focus: (e) => {
          if (i.off) {
            if (e.relatedTarget)
              g(e.relatedTarget as Element).focus();
            else root.blur();
          } else root.cls("on");
        },
        focusout: false || ((e) => {
          //se o novo item que ganhou o foco n�o estiver dentro do item actual fecha o menu
          // if (!i.off && !root.contains(e.relatedTarget as Element)) {
          //   root.cls("on", false);
          //   me.set("open", false);
          // }

          ////so faz esta checagem se estiver activo(n�o desactivo)
          //if (!model.off) {
          //  //se o novo item que ganhou o foco n�o estiver dentro do item actual fecha o menu
          //  let child = m(<Element>e.relatedTarget);
          //  root.setClass(Cls.selected, false);

          //  if (!child.valid)
          //    _this.set(C.open, false);
          //  else if (root.contains(child)) {
          //    if (child.isCls(Cls.item) && !child.isCls(Cls.dropdown))
          //      _this.set(C.open, false);

          //  } else _this.set(C.open, false);

          //}
        })
      });

  if (t(i.click))
    root.on('click', (e) => {
      if (i.off) {
        e.stopImmediatePropagation();
      } else {
        //if (m(<Element>e.target).is('button'))
        //  _this.set(C.open, false);
        //else
        if (!menu.contains(e.target as Element))
          me.toggle("open");
      }
    });
  me.on(state => {
    if ("off" in state) {
      if (i.off) {
        me.set("open", false);
        root.blur();
        root.cls(C.disabled);
        root.prop('tabIndex', -1);
      } else {
        root.cls(C.disabled, false);
        root.prop('tabIndex', t(i.tab) ? 0 : -1);
      }
    }
    if ("open" in state) {
      me.emit('open', i.open);
      root.cls("on", i.open);

      if (i.open) {
        if (i.off) {
          me.set("open", false);
          return;
        }
        menu.addTo(root);
        calcMenu(root, menu, fluid);
        // requestAnimationFrame(function _() {
        //   calcMenu(root, menu, fluid);
        //   if (body.contains(menu))
        //     requestAnimationFrame(_);
        // });
      } else {
        root.cls([VAlign.bottom, VAlign.top], false);
        menu.remove();
      }
    }
  });

  return root;
}
function calcMenu(root: S, menu: S, fluidMenu?: bool) {
  fluidMenu ?
    fluid(root.rect(), menu) :
    fixedMenu(root, menu);
}
export function setValue<K extends Key = any>(me: Root & { value: K }, label: S, options: L) {
  if (me.value) {
    let option = options.find(me.value);
    label.set([option[me.i.label], t(me.i.clear) && close(() => me.value = null)]);
    me.set("open", false);
  } else label.set(me.i.ph);

}
interface SelectItem<K> {
  key: K;
  text?: str;
  i?: Icon;
}
export interface ISelect<K extends Key = str> extends IRoot {
  value?: K;
  ph?: str;
  /**menu width will change acord to content */
  fluid?: boolean;
}
export class Select<K extends Key = str> extends E<ISelect<K>, { input: K; open: bool }> {
  options: L<SelectItem<K>, K>;
  constructor(i: ISelect<K>, options?: Alias<SelectItem<K>, K>) {
    super(i);
    this.options = extend<SelectItem<K>, K>(options, {
      key: "key",
      parse: (e) => isO(e) ? e : { key: e }
    });
  }
  get value() { return this.i.value }
  set value(v) {
    if (this.i.value !== v) {
      this.set("value", v);
      this.emit('input', v);
    }
  }

  get selected() { return byKey(this.options, this.i.value); }
  view() {
    let
      { i, options } = this,
      label = g("span"),
      items = g("table").on("click", ({ currentTarget: ct, target: t }) =>
        ct != t && (this.set("open", false).value = g(t as Element).closest("tr").d())),
      menu = div("_ menu", items),
      root = setRoot(this, label, menu).on("keydown", e => keydown(this, e, options, (v: K) => this.value = v));
    setValue(this, label, options);
    this.on(e => ("value" in e) && setValue(this, label, options));

    bind(options, items, {
      insert: ({ i, text, key }) => menuitem(i, text || key),
      tag(s, active, tag) {
        s.cls(tag, active);

        if (active) {
          menu.e.scroll({ top: s.prop('offsetTop') - menu.prop('clientHeight') / 2 + s.prop('clientHeight') / 2 });
        }
      }
    });

    return root;
  }

}

export function dropdown(label: any, items: any) {
  return call(div(hc(C.dropdown), label), e => {
    let mn = items instanceof S ? items : null, open: bool;
    e.on("click", () => {
      if (open)
        mn.remove();
      else {
        (mn ||= menu(items)).addTo(e);
        requestAnimationFrame(function _() {
          fluid(e.rect(), mn)
          if (body.contains(mn))
            requestAnimationFrame(_);
        });
      }
      open = !open;
    });
  })
}
// export interface IOpenSelect<T extends Object = Dic, K extends Key = Key> extends ISelect<T, K> {
//   input?: 'text' | 'number';
//   valid?: (value: string) => boolean;
// }
// export function openSelect<T extends Object = Dic, K extends Key = Key>(input: (this: Select<T, K>, value) => any, options: (T | K)[], i: IOpenSelect<T, K> = {}) {
//   let ip = i.labelE = g('input', { type: i.input }).on('input', function () {
//     input.call(select, this.value);
//   });
//   i.label = (value) => {
//     ip.prop('value', <any>value);
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
//       lb = g(i.labelE || 'div').cls(C.body);

//     this.label = i.labelParent || lb // model.labelItem || label;

//     this.menu = (i.menuE || div(0, i.items = g("table"))).cls("_ menu");

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
//         s.cls(tag, active);

//         if (active) {
//           vScroll(menu, s.e.offsetTop - menu.prop('clientHeight') / 2 + s.prop('clientHeight') / 2);
//         }
//       },
//       groups: {
//         ["on"](e, active) { e.cls(C.on, active); }
//       }
//     });
//     bind(values, menu, {
//       insert(key) {
//         let index = itemIndex(options, key);
//         if (index != -1)
//           mItems
//             .child(index)
//             .cls(C.main);
//       },
//       remove(key) {
//         let index = itemIndex(options, key);
//         if (index != -1)
//           mItems
//             .child(index)
//             .cls(C.main, false);
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
//     select = new Multselect<T, K>(ex(i, {
//       label(value) {
//         i.labelE.prop('value', value);
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
//   g(select).cls(C.input)
//   return select;
// }