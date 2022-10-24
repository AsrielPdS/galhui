"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idropdown = exports.dropdown = exports.Select = exports.setValue = exports.setRoot = exports.tip = exports.ctx = exports.popup = exports.error = exports.ok = exports.yesNo = exports.okCancel = exports.headBody = exports.fromPanel = exports.addClose = exports.mapButtons = exports.closeModal = exports.openBody = exports.mdOpen = exports.openModal = exports.modalBody = exports.modal = void 0;
const galho_1 = require("galho");
const orray_js_1 = require("galho/orray.js");
const util_js_1 = require("galho/util.js");
const galhui_js_1 = require("./galhui.js");
const util_js_2 = require("./util.js");
//TODO remover valid
function modal(i = {}) {
    let resolve, p = (0, util_js_1.assign)(new Promise(r => resolve = r), i);
    p.cb = resolve;
    return p;
}
exports.modal = modal;
function modalBody(md, bd, actions, i = {}) {
    md.body = (0, galho_1.g)("form", (0, galho_1.cl)("_ modal panel", i.cls), [
        (0, galho_1.wrap)(bd, "bd"),
        // t(i.close) && closeBT(() => closeModal(md)),
        actions && (0, galho_1.div)("ft", actions.map(a => a.on('click', e => { e.preventDefault(); closeModal(md, a.d()); })))
    ]).p("tabIndex", 0).on('keydown', (e) => {
        if (e.key == "Escape") {
            (0, galho_1.clearEvent)(e);
            closeModal(md);
        }
    });
    return md;
}
exports.modalBody = modalBody;
function openModal(md) {
    if (!md.area) {
        md.area = (0, galho_1.div)((0, galhui_js_1.hc)("mda" /* modalArea */), md.body).addTo(galhui_js_1.body);
        md.body.focus();
        md.blur && md.area.p("tabIndex", 0).on("focus", () => closeModal(md));
    }
    return md;
}
exports.openModal = openModal;
function mdOpen(modal, blur) {
    let t = (0, galho_1.div)((0, galhui_js_1.hc)("mda" /* modalArea */), modal).addTo(galhui_js_1.body);
    blur && (0, galho_1.onfocusout)(modal, () => t.remove());
    return t;
}
exports.mdOpen = mdOpen;
/**define a body and show modal */
function openBody(md, bd, actions, i) {
    return openModal(modalBody(md, bd, actions, i));
}
exports.openBody = openBody;
async function closeModal(md, v) {
    if (md.area && (!md.valid || await md.valid(v))) {
        md.area.remove();
        md.cb(v);
        md.area = null;
    }
}
exports.closeModal = closeModal;
function mapButtons(md) {
    md.body.child(".ft").childs('[type="button"],[type="submit"]')
        .eachS(bt => bt.on("click", e => { e.preventDefault(); closeModal(md, bt.d()); }));
    return md;
}
exports.mapButtons = mapButtons;
function addClose(md) {
    md.body.add((0, galhui_js_1.close)(() => closeModal(md)));
    return md;
}
exports.addClose = addClose;
function fromPanel(panel, i = {}) {
    let md = modal(i);
    md.body = (0, galho_1.g)(panel, "_ modal panel");
    return openModal(mapButtons(md));
}
exports.fromPanel = fromPanel;
const headBody = (i, title, bd) => [
    (0, galho_1.div)("hd", [(0, galhui_js_1.icon)(i), title]),
    (0, galho_1.wrap)(bd, "bd"),
];
exports.headBody = headBody;
function okCancel(body, valid) {
    return openBody(modal({ valid: valid && (v => !v || valid()) }), body, [(0, galhui_js_1.confirm)().d(true), (0, galhui_js_1.cancel)()], { cls: "xs" });
}
exports.okCancel = okCancel;
function yesNo(body, valid) {
    return openBody(modal({ valid: valid && (v => !v || valid()) }), body, [(0, galhui_js_1.positive)(null, galhui_js_1.w.yes).d(true), (0, galhui_js_1.negative)(null, galhui_js_1.w.no)]);
}
exports.yesNo = yesNo;
function ok(msg) {
    return openBody(modal(), msg, [(0, galhui_js_1.confirm)()]);
}
exports.ok = ok;
function error(msg) {
    return openBody(modal(), msg, [(0, galhui_js_1.confirm)()], { cls: "_e" /* error */ });
}
exports.error = error;
function popup(div, e, align) {
    let last = (0, galho_1.active)(), ctx = div.p("tabIndex", 0), 
    // isOut: bool,
    wheelHandler = (e) => (0, galho_1.clearEvent)(e);
    ctx.queryAll('button').on('click', function () { last.valid ? last.focus() : this.blur(); });
    ctx.on({
        focusout: (e) => ctx.contains(e.relatedTarget) || (ctx.remove() && galhui_js_1.body.off("wheel", wheelHandler)),
        keydown(e) {
            if (e.key == "Escape") {
                e.stopPropagation();
                ctx.blur();
            }
        }
    }).addTo(galhui_js_1.body).focus();
    // .css({
    //   left: opts.clientX + 'px',
    //   top: opts.clientY + 'px'
    // })
    (0, util_js_2.anim)(() => ((0, galhui_js_1.fluid)(e(), ctx, align), galhui_js_1.body.contains(ctx)));
    galhui_js_1.body.on("wheel", wheelHandler, { passive: false });
}
exports.popup = popup;
/**context menu */
function ctx(e, data) {
    (0, galho_1.clearEvent)(e);
    popup((0, galho_1.div)("_ menu", (0, galho_1.g)("table", 0, data)), () => new DOMRect(e.clientX, e.clientY, 0, 0), "ve");
}
exports.ctx = ctx;
function tip(root, div, align = "v") {
    div = (0, galho_1.wrap)(div, "_ tip");
    return root?.on({
        mouseenter() {
            galhui_js_1.body.add(div);
            (0, util_js_2.anim)(() => galhui_js_1.body.contains(root) ?
                galhui_js_1.body.contains(div) && (0, galhui_js_1.fluid)(root.rect(), div, align) :
                (div.remove(), false));
        },
        mouseleave() { div.remove(); }
    });
}
exports.tip = tip;
// export function keydown<T extends Object = any>(me: Root, e: KeyboardEvent, options: L<T, any>, set: (...values: Key[]) => any) {
// }
/**create root, add handlers */
function setRoot(me, options, label, menu) {
    let i = me.i, root = (0, galho_1.div)(["_", "sel" /* select */], [label.c("bd"), (0, util_js_1.t)(i.icon) && (0, galhui_js_1.icon)(galhui_js_1.$.i.dd)?.c("sd" /* side */) /*, me.menu*/])
        .p("tabIndex", 0)
        .on({
        focus(e) {
            if (i.off) {
                if (e.relatedTarget)
                    (0, galho_1.g)(e.relatedTarget).focus();
                else
                    root.blur();
            }
            else
                root.c("on");
        },
        keydown(e) {
            switch (e.key) {
                case "ArrowUp":
                    me.set("open", true);
                    orray_js_1.range.move(options, "on", -1, orray_js_1.range.tp(e.shiftKey, e.ctrlKey));
                    break;
                case "ArrowDown":
                    me.set("open", true);
                    orray_js_1.range.move(options, "on", 1, orray_js_1.range.tp(e.shiftKey, e.ctrlKey));
                    break;
                case "Enter":
                    if (me.i.open)
                        me.value = (0, util_js_1.l)(options) == 1 ?
                            options[0][options.key] :
                            (0, util_js_1.sub)(orray_js_1.range.list(options, "on"), options.key)[0];
                    else {
                        let frm = (0, galho_1.g)(me).closest("form");
                        if (frm)
                            frm?.e.requestSubmit();
                        else
                            return;
                    }
                    break;
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
        },
        focusout: null && ((e) => {
            //se o novo item que ganhou o foco n�o estiver dentro do item actual fecha o menu
            // if (!i.off && !root.contains(e.relatedTarget as Element)) {
            //   root.c("on", false);
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
    if ((0, util_js_1.t)(i.click))
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
                root.c("ds" /* disabled */);
                root.p('tabIndex', -1);
            }
            else {
                root.c("ds" /* disabled */, false);
                root.p('tabIndex', (0, util_js_1.t)(i.tab) ? 0 : -1);
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
                (0, util_js_2.anim)(() => {
                    let r = root.rect();
                    return galhui_js_1.body.contains(menu) && (menu.css("minWidth", r.width + "px"), (0, galhui_js_1.fluid)(r, menu, "ve"));
                });
            }
            else {
                root.c(["b" /* bottom */, "t" /* top */], false);
                menu.remove();
            }
        }
    });
    return root;
}
exports.setRoot = setRoot;
async function setValue(me, label) {
    let v = me.value;
    if (v == null)
        label.c("_ ph").set(me.i.ph);
    else {
        let o = await me.option(v);
        label.c("ph", false).set([o[me.i.label], (0, util_js_1.t)(me.i.clear) && (0, galhui_js_1.close)(() => me.value = null)]);
        me.set("open", false);
    }
}
exports.setValue = setValue;
class Select extends galho_1.E {
    constructor(i, options) {
        super(i);
        this.options = (0, orray_js_1.extend)(options, {
            key: "key",
            parse: (e) => (0, util_js_1.isO)(e) ? e : { key: e }
        });
    }
    get selected() { return (0, util_js_1.byKey)(this.options, this.i.value); }
    get value() { return this.i.value; }
    set value(v) { this.i.value === v || this.set("value", v).emit('input', v); }
    view() {
        let { i, options } = this, label = (0, galho_1.g)("span"), items = (0, galho_1.g)("table").on("click", ({ currentTarget: ct, target: t }) => ct != t && (this.set("open", false).value = (0, galho_1.g)(t).closest("tr").d())), menu = (0, galho_1.div)("_ menu", items), root = setRoot(this, options, label, menu);
        setValue(this, label);
        this.on(e => ("value" in e) && setValue(this, label));
        options.bind(items, {
            insert: ({ i, text, key }) => (0, galhui_js_1.menuitem)(i, text || key),
            tag(s, active, tag) {
                s.c(tag, active);
                if (active) {
                    menu.e.scroll({ top: s.p('offsetTop') - menu.p('clientHeight') / 2 + s.p('clientHeight') / 2 });
                }
            }
        });
        return root;
    }
    option(k) {
        return this.options.find(k);
    }
}
exports.Select = Select;
const dropdown = (label, items, align = "ve") => (0, util_js_1.call)((0, galho_1.div)("_ dd", label), e => {
    let mn = items instanceof galho_1.S ? items : null;
    e.on("click", () => {
        if (mn?.parent()) {
            mn.remove();
            e.c("on", false);
        }
        else {
            (mn || (mn = (0, galhui_js_1.menu)(items))).c("menu" /* menu */).addTo(e.c("on"));
            (0, util_js_2.anim)(() => galhui_js_1.body.contains(mn) && (0, galhui_js_1.fluid)(e.rect(), mn, align));
        }
    });
});
exports.dropdown = dropdown;
const idropdown = (label, items, align) => (0, exports.dropdown)([label, (0, galhui_js_1.icon)(galhui_js_1.$.i.dd)], items, align);
exports.idropdown = idropdown;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG92ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBK0Y7QUFDL0YsNkNBQXlEO0FBQ3pELDJDQUFvRztBQUNwRywyQ0FBa007QUFDbE0sdUNBQWlDO0FBbUJqQyxvQkFBb0I7QUFDcEIsU0FBZ0IsS0FBSyxDQUFVLElBQWUsRUFBRTtJQUM5QyxJQUFJLE9BQVksRUFBRSxDQUFDLEdBQUcsSUFBQSxnQkFBTSxFQUFDLElBQUksT0FBTyxDQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUMsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBQ2YsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBSkQsc0JBSUM7QUFDRCxTQUFnQixTQUFTLENBQUksRUFBWSxFQUFFLEVBQU8sRUFBRSxPQUFhLEVBQUUsSUFBVyxFQUFFO0lBQzlFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsSUFBQSxTQUFDLEVBQUMsTUFBTSxFQUFFLElBQUEsVUFBRSxFQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDOUMsSUFBQSxZQUFJLEVBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztRQUNkLCtDQUErQztRQUMvQyxPQUFPLElBQUksSUFBQSxXQUFHLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FB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