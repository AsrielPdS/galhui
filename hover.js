import { active, cl, clearEvent, div, E, g, onfocusout, S, wrap } from "galho";
import { extend, range } from "galho/orray.js";
import { assign, byKey, call, def, isO, l, sub, t } from "galho/util.js";
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
    return (root = g(root))?.on({
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
    let i = me.i, root = onfocusout(div(["_", "sel" /* select */], [label.c("bd"), t(i.icon) && icon($.i.dd)?.c("sd" /* side */) /*, me.menu*/]), () => me.set("open", false))
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
        label.c("ph", false).set([me.i.item(o), t(me.i.clear) && close(() => me.value = null)]);
        me.set("open", false);
    }
}
export class Select extends E {
    options;
    get selected() { return byKey(this.options, this.i.value); }
    constructor(i, options) {
        super(i);
        i.item ||= v => def(v.text, v.key);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG92ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQWtCLFVBQVUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQy9GLE9BQU8sRUFBUyxNQUFNLEVBQUssS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekQsT0FBTyxFQUFFLE1BQU0sRUFBUSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBTyxHQUFHLEVBQVksQ0FBQyxFQUFPLEdBQUcsRUFBRSxDQUFDLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFDekcsT0FBTyxFQUFFLENBQUMsRUFBb0MsS0FBSyxFQUFFLElBQUksRUFBSyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssSUFBSSxPQUFPLEVBQVMsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQVEsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFVLENBQUMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNsTSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBbUJqQyxvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLEtBQUssQ0FBVSxJQUFlLEVBQUU7SUFDOUMsSUFBSSxPQUFZLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBSSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5RSxDQUFDLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUNmLE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUNELE1BQU0sVUFBVSxTQUFTLENBQUksRUFBWSxFQUFFLEVBQU8sRUFBRSxPQUFhLEVBQUUsSUFBVyxFQUFFO0lB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