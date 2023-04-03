import { active, cl, clearEvent, div, E, g, onfocusout, S, wrap } from "galho";
import { extend, range } from "galho/orray.js";
import { assign, byKey, call, def, isO, isP, l, sub, t } from "galho/util.js";
import { $, fluid, body, cancel, close, close as closeBT, confirm, hc, icon, menu, menuitem, negative, positive, w, wait } from "./galhui.js";
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
    ctx.queryAll('button').on('click', function () { last ? last.focus() : this.blur(); });
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
export function tip(root, tip, align = "v") {
    if (isP(tip)) {
        let t = tip;
        tip = div("_ tip", wait);
        t.then(v => { tip = wrap(v, "_ tip"); });
    }
    else
        tip = wrap(tip, "_ tip");
    return (root = g(root))?.on({
        mouseenter() {
            body.add(tip);
            anim(() => body.contains(root) ?
                tip.parent && fluid(root.rect, tip, align) :
                (tip.remove(), false));
        },
        mouseleave() { tip.remove(); }
    });
}
// export function keydown<T extends Object = any>(me: Root, e: KeyboardEvent, options: L<T, any>, set: (...values: Key[]) => any) {
// }
/**create root, add handlers */
export function setRoot(me, options, label, menu) {
    let i = me.i, root = onfocusout(div(`_ in ${"sel" /* select */}`, [label.c("bd"), t(i.icon) && icon($.i.dd)?.c("sd" /* side */) /*, me.menu*/]), () => me.set("open", false))
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
                    if (me.i.open) {
                        me.value = l(options) == 1 ?
                            options[0][options.key] :
                            sub(range.list(options, "on"), options.key)[0];
                        me.set("open", false);
                    }
                    else
                        return;
                    // else {
                    //   let frm = g(me).closest("form");
                    //   if (frm) frm?.e.requestSubmit();
                    //   else return;
                    // }
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
        }
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
                    let r = root.rect;
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
    if (label.e.tagName == "INPUT") {
        label.p("value", me.value == null ? "" : me.value);
    }
    else {
        if (v == null)
            label.c("_ ph").set(me.i.ph);
        else {
            let o = await me.option(v);
            label.c("ph", false).set([me.i.item(o), t(me.i.clear) && close(() => me.value = null)]);
            me.set("open", false);
        }
    }
}
export class Select extends E {
    options;
    get selected() { return byKey(this.options, this.i.value); }
    constructor(i, options) {
        super(i);
        i.item ||= (v) => def(v[1], v[i.key]);
        this.options = extend(options, {
            key: i.key ||= 0,
            parse: (e) => isO(e) ? e : { [i.key]: e }
        });
    }
    get value() { return this.i.value; }
    set value(v) { this.i.value === v || this.set("value", v).emit('input', v); }
    view() {
        let { i, options } = this, label = g("span"), items = g("table").on("click", ({ currentTarget: ct, target: t }) => ct != t && (this.set("open", false).value = g(t).closest("tr").d())), menu = div("_ menu", items), root = setRoot(this, options, label, menu);
        setValue(this, label);
        this.on(e => ("value" in e) && setValue(this, label));
        options.bind(items, {
            insert: v => menuitem(v.i, i.item(v)).d(v[i.key]),
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
        if (mn?.parent) {
            mn.remove();
            e.c("on", false);
        }
        else {
            (mn ||= menu(items)).c("menu" /* menu */).addTo(e.c("on"));
            anim(() => body.contains(mn) && fluid(e.rect, mn, align));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG92ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQWtCLFVBQVUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQy9GLE9BQU8sRUFBUyxNQUFNLEVBQUssS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekQsT0FBTyxFQUFFLE1BQU0sRUFBUSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBTyxHQUFHLEVBQUUsR0FBRyxFQUFZLENBQUMsRUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBQ3BILE9BQU8sRUFBRSxDQUFDLEVBQW9DLEtBQUssRUFBRSxJQUFJLEVBQUssTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLElBQUksT0FBTyxFQUFTLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFRLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hNLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFtQmpDLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsS0FBSyxDQUFVLElBQWUsRUFBRTtJQUM5QyxJQUFJLE9BQVksRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUMsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBQ2YsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBQ0QsTUFBTSxVQUFVLFNBQVMsQ0FBSSxFQUFZLEVBQUUsRUFBTyxFQUFFLE9B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