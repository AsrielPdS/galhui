import { active, cl, clearEvent, div, E, g, S, wrap } from "galho";
import { extend, range } from "galho/orray.js";
import { assign, byKey, call, isO, l, sub, t } from "galho/util.js";
import { $, fluid, body, cancel, close, close as closeBT, confirm, hc, icon, menu, menuitem, negative, positive, w } from "./galhui.js";
import { anim } from "./util.js";
//TODO remover valid
export function modal(i = {}) {
    let resolve, p = assign(new Promise(r => resolve = r), i);
    p.cb = resolve;
    return p;
}
export function modalBody(md, bd, actions, i = {}) {
    md.body = g("form", cl("_ modal panel", i.cls), [
        wrap(bd, "bd"),
        // t(i.close) && closeBT(() => closeModal(md)),
        actions && div("ft", actions.map(a => a.on('click', e => { e.preventDefault(); closeModal(md, a.d()); })))
    ]).p("tabIndex", 0).on('keydown', (e) => {
        if (e.key == "Escape") {
            clearEvent(e);
            closeModal(md);
        }
    });
    return md;
}
export function openModal(md) {
    if (!md.area) {
        md.area = div(hc("mda" /* modalArea */), md.body).addTo(body);
        md.body.focus();
        md.blur && md.area.p("tabIndex", 0).on("focus", () => closeModal(md));
    }
    return md;
}
export function mdOpen(modal, blur) {
    let t = div(hc("mda" /* modalArea */), modal).addTo(body);
    blur && t.on("click", function _(e) {
        if (e.target == e.currentTarget)
            t.off("click", _).remove();
    });
    return t;
}
/**define a body and show modal */
export function openBody(md, bd, actions, i) {
    return openModal(modalBody(md, bd, actions, i));
}
export async function closeModal(md, v) {
    if (md.area && (!md.valid || await md.valid(v))) {
        md.area.remove();
        md.cb(v);
        md.area = null;
    }
}
export function mapButtons(md) {
    md.body.child(".ft").childs('[type="button"],[type="submit"]')
        .eachS(bt => bt.on("click", e => { e.preventDefault(); closeModal(md, bt.d()); }));
    return md;
}
export function addClose(md) {
    md.body.add(closeBT(() => closeModal(md)));
    return md;
}
export function fromPanel(panel, i = {}) {
    let md = modal(i);
    md.body = g(panel, "_ modal panel");
    return openModal(mapButtons(md));
}
export const headBody = (i, title, bd) => [
    div("hd", [icon(i), title]),
    wrap(bd, "bd"),
];
export function okCancel(body, valid) {
    return openBody(modal({ valid: valid && (v => !v || valid()) }), body, [confirm().d(true), cancel()], { cls: "xs" });
}
export function yesNo(body, valid) {
    return openBody(modal({ valid: valid && (v => !v || valid()) }), body, [positive(null, w.yes).d(true), negative(null, w.no)]);
}
export function ok(msg) {
    return openBody(modal(), msg, [confirm()]);
}
export function error(msg) {
    return openBody(modal(), msg, [confirm()], { cls: "_e" /* error */ });
}
export function popup(div, e, align) {
    let last = active(), ctx = div.p("tabIndex", 0), 
    // isOut: bool,
    wheelHandler = (e) => clearEvent(e);
    ctx.queryAll('button').on('click', function () { last.valid ? last.focus() : this.blur(); });
    ctx.on({
        focusout: (e) => ctx.contains(e.relatedTarget) || (ctx.remove() && body.off("wheel", wheelHandler)),
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
export function ctx(e, data) {
    clearEvent(e);
    popup(div("_ menu", g("table", 0, data)), () => new DOMRect(e.clientX, e.clientY, 0, 0), "ve");
}
export function tip(root, div, align = "v") {
    div = wrap(div, "_ tip");
    return root?.on({
        mouseenter() {
            body.add(div);
            anim(() => body.contains(root) ?
                body.contains(div) && fluid(root.rect(), div, align) :
                (div.remove(), false));
        },
        mouseleave() { div.remove(); }
    });
}
// export function keydown<T extends Object = any>(me: Root, e: KeyboardEvent, options: L<T, any>, set: (...values: Key[]) => any) {
// }
/**create root, add handlers */
export function setRoot(me, options, label, menu) {
    let i = me.i, root = div(["_", "sel" /* select */], [label.c("bd"), t(i.icon) && icon($.i.dd)?.c("sd" /* side */) /*, me.menu*/])
        .p("tabIndex", 0)
        .on({
        focus(e) {
            if (i.off) {
                if (e.relatedTarget)
                    g(e.relatedTarget).focus();
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
                    range.move(options, "on", -1, range.tp(e.shiftKey, e.ctrlKey));
                    break;
                case "ArrowDown":
                    me.set("open", true);
                    range.move(options, "on", 1, range.tp(e.shiftKey, e.ctrlKey));
                    break;
                case "Enter":
                    if (me.i.open)
                        me.value = l(options) == 1 ?
                            options[0][options.key] :
                            sub(range.list(options, "on"), options.key)[0];
                    else {
                        let frm = g(me).closest("form");
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
            clearEvent(e);
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
    if (t(i.click))
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
                    return body.contains(menu) && (menu.css("minWidth", r.width + "px"), fluid(r, menu, "ve"));
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
export async function setValue(me, label) {
    let v = me.value;
    if (v == null)
        label.c("_ ph").set(me.i.ph);
    else {
        let o = await me.option(v);
        label.c("ph", false).set([o[me.i.label], t(me.i.clear) && close(() => me.value = null)]);
        me.set("open", false);
    }
}
export class Select extends E {
    options;
    get selected() { return byKey(this.options, this.i.value); }
    constructor(i, options) {
        super(i);
        this.options = extend(options, {
            key: "key",
            parse: (e) => isO(e) ? e : { key: e }
        });
    }
    get value() { return this.i.value; }
    set value(v) { this.i.value === v || this.set("value", v).emit('input', v); }
    view() {
        let { i, options } = this, label = g("span"), items = g("table").on("click", ({ currentTarget: ct, target: t }) => ct != t && (this.set("open", false).value = g(t).closest("tr").d())), menu = div("_ menu", items), root = setRoot(this, options, label, menu);
        setValue(this, label);
        this.on(e => ("value" in e) && setValue(this, label));
        options.bind(items, {
            insert: ({ i, text, key }) => menuitem(i, text || key),
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
    option(k) {
        return this.options.find(k);
    }
}
export const dropdown = (label, items, align = "ve") => call(div("_ dd", label), e => {
    let mn = items instanceof S ? items : null;
    e.on("click", () => {
        if (mn?.parent()) {
            mn.remove();
            e.c("on", false);
        }
        else {
            (mn ||= menu(items)).c("menu" /* menu */).addTo(e.c("on"));
            anim(() => body.contains(mn) && fluid(e.rect(), mn, align));
        }
    });
});
export const idropdown = (label, items, align) => dropdown([label, icon($.i.dd)], items, align);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG92ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQThCLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDL0YsT0FBTyxFQUFTLE1BQU0sRUFBSyxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsTUFBTSxFQUFRLEtBQUssRUFBRSxJQUFJLEVBQU8sR0FBRyxFQUFZLENBQUMsRUFBTyxHQUFHLEVBQUUsQ0FBQyxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxDQUFDLEVBQW9DLEtBQUssRUFBRSxJQUFJLEVBQUssTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLElBQUksT0FBTyxFQUFTLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFRLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBVSxDQUFDLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDbE0sT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQztBQW1CakMsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSxLQUFLLENBQVUsSUFBZSxFQUFFO0lBQzlDLElBQUksT0FBWSxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFDZixPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFDRCxNQUFNLFVBQVUsU0FBUyxDQUFJLEVBQVksRUFBRSxFQUFPLEVBQUUsT0FBYSxFQUFFLElBQVcsRUFBRTtJQUM5RSxFQUFFLENBQUMsSUFBSSxH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