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
        options.bind(items, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkcm9wZG93bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBaUQ7QUFDakQsbUNBQXFEO0FBQ3JELGlDQUEwQztBQUMxQyxtREFBaUc7QUFDakcsMkNBQXdFO0FBQ3hFLHlDQUE4QztBQUM5Qyx1Q0FBMkM7QUF3QjNDLFNBQWdCLE9BQU8sQ0FBeUIsRUFBUSxFQUFFLENBQWdCLEVBQUUsT0FBa0IsRUFBRSxHQUE4QjtJQUM1SCxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUU7UUFDYixLQUFLLFNBQVM7WUFDWixFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyQixJQUFBLGtCQUFhLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFBLGdCQUFhLEVBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN2RSxNQUFNO1FBQ1IsS0FBSyxXQUFXO1lBQ2QsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckIsSUFBQSxrQkFBYSxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUEsZ0JBQWEsRUFBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLE1BQU07UUFDUixLQUFLLE9BQU87WUFDVixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO2dCQUNiLElBQUksSUFBQSxVQUFDLEVBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNuQixHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQVEsQ0FBQyxDQUFDO2lCQUNyQztxQkFBTTtvQkFDTCxHQUFHLENBQUMsR0FBRyxJQUFBLFlBQUcs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