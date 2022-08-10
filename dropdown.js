"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropdown = exports.Select = exports.setValue = exports.setRoot = exports.keydown = void 0;
const galho_1 = require("galho");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
const selector_js_1 = require("orray/selector.js");
const galhui_js_1 = require("./galhui.js");
const hover_js_1 = require("./hover.js");
const menu_js_1 = require("./menu.js");
function keydown(me, e, options, set) {
    switch (e.key) {
        case "ArrowUp":
            me.set("open", true);
            (0, selector_js_1.move)(options, "on", -1, (0, selector_js_1.tp)(e.shiftKey, e.ctrlKey));
            break;
        case "ArrowDown":
            me.set("open", true);
            (0, selector_js_1.move)(options, "on", 1, (0, selector_js_1.tp)(e.shiftKey, e.ctrlKey));
            break;
        case "Enter":
            if (me.i.open) {
                if ((0, inutil_1.l)(options) == 1) {
                    set(options[0][options.key]);
                }
                else {
                    set(...(0, inutil_1.sub)((0, selector_js_1.list)(options, "on"), options.key));
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
            }
            else
                return;
        default:
            return;
    }
    (0, galho_1.clearEvent)(e);
}
exports.keydown = keydown;
/**create root, add handlers */
function setRoot(me, label, menu, fluid) {
    let i = me.i, root = (0, galho_1.div)(["_", "sel" /* select */], [label.cls("bd"), (0, inutil_1.t)(i.icon) && (0, galhui_js_1.icon)(galhui_js_1.$.i.dd)?.cls("sd" /* side */) /*, me.menu*/])
        .prop("tabIndex", 0)
        .on({
        focus: (e) => {
            if (i.off) {
                if (e.relatedTarget)
                    (0, galho_1.g)(e.relatedTarget).focus();
                else
                    root.blur();
            }
            else
                root.cls("on");
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
    if ((0, inutil_1.t)(i.click))
        root.on('click', (e) => {
            if (i.off) {
                e.stopImmediatePropagation();
            }
            else {
                //if (m(<Element>e.target).is('button'))
                //  _this.set(C.open, false);
                //else
                if (!menu.contains(e.target))
                    me.toggle("open");
            }
        });
    me.on(state => {
        if ("off" in state) {
            if (i.off) {
                me.set("open", false);
                root.blur();
                root.cls("ds" /* disabled */);
                root.prop('tabIndex', -1);
            }
            else {
                root.cls("ds" /* disabled */, false);
                root.prop('tabIndex', (0, inutil_1.t)(i.tab) ? 0 : -1);
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
            }
            else {
                root.cls(["b" /* bottom */, "t" /* top */], false);
                menu.remove();
            }
        }
    });
    return root;
}
exports.setRoot = setRoot;
function calcMenu(root, menu, fluidMenu) {
    fluidMenu ?
        (0, hover_js_1.fluid)(root.rect(), menu) :
        (0, hover_js_1.fixedMenu)(root, menu);
}
function setValue(me, label, options) {
    if (me.value) {
        let option = options.find(me.value);
        label.set([option[me.i.label], (0, inutil_1.t)(me.i.clear) && (0, galhui_js_1.close)(() => me.value = null)]);
        me.set("open", false);
    }
    else
        label.set(me.i.ph);
}
exports.setValue = setValue;
class Select extends galho_1.E {
    constructor(i, options) {
        super(i);
        this.options = (0, orray_1.extend)(options, {
            key: "key",
            parse: (e) => (0, inutil_1.isO)(e) ? e : { key: e }
        });
    }
    get value() { return this.i.value; }
    set value(v) {
        if (this.i.value !== v) {
            this.set("value", v);
            this.emit('input', v);
        }
    }
    get selected() { return (0, inutil_1.byKey)(this.options, this.i.value); }
    view() {
        let { i, options } = this, label = (0, galho_1.g)("span"), items = (0, galho_1.g)("table").on("click", ({ currentTarget: ct, target: t }) => ct != t && (this.set("open", false).value = (0, galho_1.g)(t).closest("tr").d())), menu = (0, galho_1.div)("_ menu", items), root = setRoot(this, label, menu).on("keydown", e => keydown(this, e, options, (v) => this.value = v));
        setValue(this, label, options);
        this.on(e => ("value" in e) && setValue(this, label, options));
        (0, orray_1.bind)(options, items, {
            insert: ({ i, text, key }) => (0, menu_js_1.menuitem)(i, text || key),
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
exports.Select = Select;
function dropdown(label, items) {
    return (0, inutil_1.call)((0, galho_1.div)((0, galhui_js_1.hc)("dd" /* dropdown */), label), e => {
        let mn = items instanceof galho_1.S ? items : null, open;
        e.on("click", () => {
            if (open)
                mn.remove();
            else {
                (mn || (mn = (0, menu_js_1.menu)(items))).addTo(e);
                requestAnimationFrame(function _() {
                    (0, hover_js_1.fluid)(e.rect(), mn);
                    if (galhui_js_1.body.contains(mn))
                        requestAnimationFrame(_);
                });
            }
            open = !open;
        });
    });
}
exports.dropdown = dropdown;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkcm9wZG93bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBaUQ7QUFDakQsbUNBQXFEO0FBQ3JELGlDQUErQztBQUMvQyxtREFBaUc7QUFDakcsMkNBQXdFO0FBQ3hFLHlDQUE4QztBQUM5Qyx1Q0FBMkM7QUF3QjNDLFNBQWdCLE9BQU8sQ0FBeUIsRUFBUSxFQUFFLENBQWdCLEVBQUUsT0FBa0IsRUFBRSxHQUE4QjtJQUM1SCxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUU7UUFDYixLQUFLLFNBQVM7WUFDWixFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyQixJQUFBLGtCQUFhLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFBLGdCQUFhLEVBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN2RSxNQUFNO1FBQ1IsS0FBSyxXQUFXO1lBQ2QsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckIsSUFBQSxrQkFBYSxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUEsZ0JBQWEsRUFBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLE1BQU07UUFDUixLQUFLLE9BQU87WUFDVixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO2dCQUNiLElBQUksSUFBQSxVQUFDLEVBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNuQixHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQVEsQ0FBQyxDQUFDO2lCQUNyQztxQkFBTTtvQkFDTCxHQUFHLENBQUMsR0FBRyxJQUFBLFlBQUcs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