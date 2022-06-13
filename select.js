"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = exports.setValue = exports.setRoot = exports.keydown = void 0;
const galho_1 = require("galho");
const s_1 = require("galho/s");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
const selector_1 = require("orray/selector");
const galhui_1 = require("./galhui");
const menu_1 = require("./menu");
function keydown(me, e, options, set) {
    switch (e.key) {
        case "ArrowUp":
            me.set("open", true);
            (0, selector_1.move)(options, "on", -1, (0, selector_1.tp)(e.shiftKey, e.ctrlKey));
            break;
        case "ArrowDown":
            me.set("open", true);
            (0, selector_1.move)(options, "on", 1, (0, selector_1.tp)(e.shiftKey, e.ctrlKey));
            break;
        case "Enter":
            if (me.i.open) {
                if ((0, inutil_1.l)(options) == 1) {
                    set(options[0][options.key]);
                }
                else {
                    set(...(0, inutil_1.sub)((0, selector_1.list)(options, "on"), options.key));
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
    let i = me.i, root = (0, galho_1.div)(["_", "sel" /* select */], [label.cls("bd"), (0, inutil_1.t)(i.icon) && (0, galhui_1.icon)(galhui_1.$.i.dd).cls("sd" /* side */) /*, me.menu*/])
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
                if (!(0, s_1.contains)(menu, e.target))
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
                // calcMenu(root, menu, fluid);
                requestAnimationFrame(function _() {
                    calcMenu(root, menu, fluid);
                    if (galhui_1.body.contains(root))
                        requestAnimationFrame(_);
                });
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
    (fluidMenu ? galhui_1.fluid : galhui_1.fixed)(root, menu);
}
function setValue(me, { root, options, menu, label, fluid }) {
    if (me.value) {
        let option = options.find(me.value);
        label.set([option.text || option.key, (0, inutil_1.t)(me.i.clear) && (0, galhui_1.close)(() => me.value = null)]);
        me.set("open", false);
    }
    else {
        label.set();
        me.i.open && calcMenu(root, menu, fluid);
    }
}
exports.setValue = setValue;
class Select extends galho_1.E {
    options;
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
        setValue(this, { options, label });
        this.on(e => ("value" in e) && setValue(this, { root, options, label, menu, fluid: i.fluid }));
        (0, orray_1.bind)(options, items, {
            insert: ({ i, text, key }) => (0, menu_1.i)(i, text || key),
            tag(s, active, tag) {
                s.cls(tag, active);
                if (active) {
                    (0, s_1.vScroll)(menu, s.prop('offsetTop') - menu.prop('clientHeight') / 2 + s.prop('clientHeight') / 2);
                }
            }
        });
        return root;
    }
}
exports.Select = Select;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VsZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFpRDtBQUNqRCwrQkFBNEM7QUFDNUMsbUNBQStDO0FBQy9DLGlDQUErQztBQUMvQyw2Q0FBOEY7QUFDOUYscUNBQStFO0FBQy9FLGlDQUF1QztBQXFCdkMsU0FBZ0IsT0FBTyxDQUF5QixFQUFRLEVBQUUsQ0FBZ0IsRUFBRSxPQUFrQixFQUFFLEdBQThCO0lBQzVILFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRTtRQUNiLEtBQUssU0FBUztZQUNaLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3JCLElBQUEsZUFBYSxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBQSxhQUFhLEVBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN2RSxNQUFNO1FBQ1IsS0FBSyxXQUFXO1lBQ2QsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckIsSUFBQSxlQUFhLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBQSxhQUFhLEVBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN0RSxNQUFNO1FBQ1IsS0FBSyxPQUFPO1lBQ1YsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDYixJQUFJLElBQUEsVUFBQyxFQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDbkIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFRLENBQUMsQ0FBQztpQkFDckM7cUJBQU07b0JBQ0wsR0FBRyxDQUFDLEdBQUcsSUFBQSxZQUFHLEVBQUMsSUFB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