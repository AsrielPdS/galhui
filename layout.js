import { div, E, g, wrap } from "galho";
import { orray } from "galho/orray.js";
import { call, extend, isA, isU, l, t } from "galho/util.js";
import { $, body, close, doc, icon } from "./galhui.js";
export function defineSize(items, apply) {
    let size = 0, l = items.length, sizes = [];
    for (let i of items) {
        let s = i.sz;
        if ((s || (s = 0)) > 95)
            s = 95;
        else if (s === 0)
            s = 100 / l;
        sizes.push(s);
        size += s;
    }
    let result = sizes.map(s => s * 100 / size);
    if (apply)
        for (let i = 0; i < l; i++)
            items[i].sz = result[i];
    return result;
}
export class Ctx extends E {
    root;
    constructor(i, root) {
        super(i);
        this.root = this.item(root);
        i.left && (i.left = orray(i.left));
        i.right && (i.right = orray(i.right));
        i.bottom && (i.bottom = orray(i.bottom));
    }
    ignoreChange;
    view() {
        let { left, right, bottom } = this.i;
        return div("_ galy", [
            left && div("l"),
            this.root,
            right && div("r"),
            bottom && div("b"),
        ]);
    }
    change() {
        if (!this.ignoreChange) {
            if (t(this.i.compress)) {
                this.ignoreChange = true;
                this.root.compress();
                this.ignoreChange = false;
            }
            this.emit("change");
        }
    }
    prots(key) {
        let t = this.i.boxes[key];
        if (!t)
            throw `protyupe "${key}" not found`;
        return t;
    }
    item(item) {
        switch (item.tp) {
            case "s" /* Type.stack */:
                return new Stack(this, item);
            case "t" /* Type.tab */:
                return new Tab(this, item);
            case "i" /* Type.box */:
                return new Box(this, item.base ? extend(item, this.prots(item.base)) : item);
        }
    }
}
class Stack {
    ctx;
    i;
    constructor(ctx, i) {
        this.ctx = ctx;
        this.i = i;
        i.$ = this;
    }
    render() {
        let { list, o } = this.i, ctx = this.ctx;
        return orray(list, v => isA(v) ? v : [100 / l(list), v]).bind(div(["_", "stack", o]), {
            insert([sz, item], index, s) {
                s.place(index && index * 2 - 1, [
                    //dupla negação para não inserir 0
                    !!index && divisor("h", (l, r) => {
                        this[index - 1][0] = l;
                        this[index][0] = r;
                        ctx.change();
                    }),
                    g(ctx.item(item)).css(o == "h" ? "width" : "height", `${sz}%`)
                ]);
            },
            remove: (_, index, parent) => {
                if (index)
                    parent.childs(index * 2 - 1, index * 2 + 1).remove();
                else
                    parent.childs(0, 2).remove();
            }
        });
    }
    compress() {
        let { list, persist: p } = this.i, _l = l(list);
        if (!_l) {
            if (!p)
                return null;
        }
        else if (_l == 1)
            return list[0][1];
        else
            for (let i = 0; i < _l; i++) {
                let t0 = list[i], t = t0[1].$.compress();
                switch (t) {
                    case null:
                        //TODO: remove from context
                        list.removeAt(i--);
                        break;
                    case undefined:
                        break;
                    default:
                        throw "not implemented";
                    // replace(t0, [t0[0], <iitems>t]);
                }
            }
    }
}
class Tab {
    i;
    constructor(ctx, i) {
        this.i = i;
        i.$ = this;
    }
    render() {
        let i = this.i, list = i.list;
        return div("_ tab", [
            list.bind(div("hd" /* C.head */), {
                tag: (v, i, p) => p.child(i).c("on", v),
                insert: box => box.$.head().c("i" /* C.item */)
                    .add(close(e => { e.stopPropagation(); list.remove(box); }))
                    .on('click', () => list.tag("on", box))
            }),
            call(div("bd" /* C.body */), b => {
                let cb = (v) => {
                    b.attr("id", false).c("bd" /* C.body */);
                    if (v) {
                        b.set(v.$.render(true));
                        //v.$.focus?.(b);
                    }
                    else
                        b.set(i.empty?.());
                };
                list.ontag("on", cb);
                cb(list.tags?.on.v);
            }),
        ]);
    }
    compress() {
        let { list, persist: p } = this.i;
        if (!list) {
            if (!p)
                return null;
        }
        else if (l(list) == 1)
            if (l[0].selfContain)
                return l[0];
    }
}
class Box {
    i;
    constructor(ctx, i) {
        this.i = i;
        if (i.def && isU(i.dt))
            i.dt = i.def();
        i.$ = this;
    }
    render(headerless) {
        let bd = wrap(this.i.render());
        return headerless ? bd.c("i" /* C.item */) : div("_ tab", [
            this.head().c("_ bar"),
            div("bd" /* C.body */, bd)
        ]);
    }
    head() {
        let i = this.i;
        return div(0, [
            icon(i.icon),
            i.title,
            close(() => { })
        ]);
    }
    compress() { }
}
/**box interface */
export const ibox = (base) => ({ tp: "i" /* Type.box */, base });
/**row interface */
export const irow = (...list) => ({ tp: "s" /* Type.stack */, o: "h", list });
/**col interface */
export const icol = (...list) => ({ tp: "s" /* Type.stack */, o: "v", list });
/**tab interface */
export const itab = (...list) => ({ tp: "t" /* Type.tab */, list });
export function divisor(o, endcallback) {
    let hr = g('hr', "l-d" /* LC.divisor */);
    return hr.on('mousedown', function () {
        let parent = hr.parent, parentRect = parent.rect, prev = hr.prev, next = hr.next, l, r, div = $.lyDivW / 2, clamp = (value, min, max) => value < min ? min : value > max ? max : value, trigger = () => {
            let e = new Event("resize", { bubbles: true });
            prev.emit(e);
            next.emit(e);
        };
        function moveEventX(e) {
            let p = parentRect.width * 0.05;
            l = clamp(e.clientX - parentRect.left, p, parentRect.left - p);
            prev.css('width', `calc(${(l = l / parentRect.width * 100)}% - ${div}px)`);
            next.css('width', `calc(${(r = 100 - l)}% - ${div}px)`);
            trigger();
        }
        function moveEventY(e) {
            let p = parentRect.height * 0.05;
            l = clamp(e.clientX - parentRect.top, p, parentRect.top - p);
            prev.css('height', `calc(${(l = l / parentRect.height * 100)}% - ${div}px)`);
            next.css('height', `calc(${(r = 100 - l)}% - ${div}px)`);
            trigger();
        }
        body.css({ cursor: 'col-resize', userSelect: "none" });
        let t = o == "h" ? moveEventX : moveEventY;
        doc
            .on('mousemove', t)
            .one('mouseup', () => {
            body.uncss(["cursor", "userSelect"]);
            doc.off('mousemove', t);
            endcallback?.(l, r);
        });
    });
}
export const stack = (o, list) => div(["_", "stack", o], list.map((v, i) => {
    let [sz, item] = isA(v) ? v : [100 / l(list), v];
    return [
        !!i && divisor("h"),
        g(item).css(o == "h" ? "width" : "height", `${sz}%`)
    ];
}));
export const row = (...list) => stack("h", list);
export const col = (...list) => stack("v", list);
