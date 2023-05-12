import { clearEvent, div, E, g, m, S, wrap } from "galho";
import orray, { extend, range } from "galho/orray.js";
import { call, def, fmt, isF, isN, isS, l, t } from "galho/util.js";
import { $, body, close, doc, icon, logo, menucb, w } from "./galhui.js";
import { ctxmenu, idropdown } from "./hover.js";
import { up } from "./util.js";
// export class OutputCtx {
//   /**key of current field */
//   /**record/item */
//   constructor(public k: string, public r: Dic, public p: FieldPlatform) { }
//   get val() { return this.r[this.k]; }
//   get null() { return this.p.null(); }
//   get valid() { return isV(this.val); }
//   // get html() { return this.p.html; }
//   // get format() { return this.p.format; }
//   // get interactive() { return this.p.interactive; }
// }
// export interface OutputCtx<T = any> {
//   /**value */
//   v: T;
//   /**platform */
//   p?: FieldPlatform;
//   /**src */
//   s?: Dic;
// }
export const defRenderer = {
    null: () => div(0, icon($.i.null)),
    invalidIcon: () => icon('image-broken'),
    checkboxFmt: "icon",
    wrap,
    html: true,
    interactive: true,
    format: true
};
export function crudHandler(e, v, dt, i) {
    let click = (ev) => range.add(dt, "on", v, range.tp(ev.ctrlKey, ev.shiftKey));
    return e.on({
        click,
        dblclick: i.open && (() => i.open(...range.list(dt, "on"))),
        contextmenu: i.menu && (e => {
            click(e);
            let t = i.menu(range.list(dt, "on"));
            t && ctxmenu(e, t);
        })
    });
}
export const kbHTp = (dt, dist, { ctrlKey: ctrl, shiftKey: shift }) => shift ? range.move(dt, "on", dist, range.tp(ctrl, false)) :
    ctrl ? range.movePivot(dt, "on", dist) :
        range.move(dt, "on", dist, 0 /* range.Tp.set */);
/**@returns true if event was already handled */
export function kbHandler(dt, e, i, noArrows) {
    switch (e.key) {
        case "Delete":
            let t0 = range.list(dt, "on");
            if (t0.length && i.remove) {
                (async () => {
                    if ((await i.remove(t0)) !== false)
                        for (let i of t0)
                            dt.remove(i);
                })();
            }
            else
                return;
            break;
        case "Home":
            kbHTp(dt, -range.pivot(dt, "on"), e);
            break;
        case "End":
            kbHTp(dt, dt.length - range.pivot(dt, "on"), e);
            break;
        case "PageDown":
            kbHTp(dt, 10, e);
            break;
        case "PageUp":
            kbHTp(dt, -10, e);
            break;
        case "Enter":
            if (i.open) {
                i.open(...range.list(dt, "on"));
                break;
            }
            else
                return;
        case "ArrowUp":
            if (noArrows)
                return;
            kbHTp(dt, -1, e);
            break;
        case "ArrowDown":
            if (noArrows)
                return;
            kbHTp(dt, 1, e);
            break;
        default:
            return;
    }
    return true;
}
export function list(i, data) {
    let dt = extend(data, {
        g: i.single ? null : ["on"],
        clear: true, key: i.key
    }), r = dt.bind(g(t(i.enum) ? "ol" : "ul", "_ list"), {
        insert: v => crudHandler(wrap(i.item(v), "i").badd(div("sd" /* C.side */)), v, dt, i),
        tag(active, i, p, tag) {
            let s = p.child(i).emit(new CustomEvent("current", { detail: active }));
            if (tag == "on") {
                s.c("crt" /* C.current */, active);
                active && s.e.scrollIntoView({
                    block: "nearest", inline: "nearest"
                });
            }
            p.child(i).c(tag, active);
        },
        groups(v, i, p, g) { p.child(i).c(g, v); }
    }).on("click", e => e.target == e.currentTarget && range.clear(data, "on"));
    return t(i.kd) ? r.p("tabIndex", 0).on("keydown", e => kbHandler(data, e, i) && clearEvent(e)) : r;
}
export const tab = (items, removeble, empty) => div(["ta" /* C.tab */], [
    items.bind(div(["bar" /* C.menubar */]), {
        tag(v, i, p) { p.child(i).c("on", v); },
        insert: value => div("i", [
            icon(value.icon),
            value.text,
            removeble && close(e => { clearEvent(e); items.remove(value); })
        ]).on('click', () => items.tag("on", value))
    }),
    call(div("bd"), bd => {
        let cb = (v) => {
            bd.attr("id", false);
            if (v) {
                bd.set(isF(v.body) ? (v.body = v.body(v)) : v.body);
                v.focus?.(bd, true);
            }
            else
                bd.set(empty?.());
        };
        items.ontag("on", cb);
        cb(items.tags?.on.v);
    }),
]);
function defineSize(items) {
    let size = 0, l = items.length, sizes = [];
    for (let i of items) {
        let s = i.size || 1 / l;
        sizes.push(s);
        size += s;
    }
    for (let i = 0; i < l; i++)
        items[i].size = (sizes[i] / size) * 100;
}
export const editing = Symbol();
export class Table extends E {
    // get data() { return this.i.data as L<T>; }
    // get footData() { return this.i.foot as L<T>; }
    get cols() { return this.i.cols; }
    data;
    // foot: Foot[];
    constructor(i, data) {
        // i.data = data as L;
        super(i);
        this.data = extend(data, {
            g: i.single ? null : ["on"],
            key: i.key,
            clear: true
        });
        // this.foot = foot && extend<T>(foot, {
        //   key: i.key,
        //   clear: true
        // });
        i.head ||= c => def(def(c.text, w[c.key]), up(c.key));
    }
    ccss(e, c, span = 1) {
        let sz;
        if (isN(c))
            for (let cs = this.cols, j = 0; j < span; j++)
                sz += cs[c + j].size;
        else
            sz = c.size;
        return e.c("i").css("width", sz + (this.i.fill ? '%' : 'px'));
    }
    editing;
    edit() {
    }
    view() {
        let i = this.i, cols = i.cols, all = i.allColumns, req = i.reqColumns, data = this.data, hdOptsLeave, hdOpts = all && idropdown(null, all.map(c => {
            return menucb(cols.includes(c), def(def(c.text, w[c.key]), up(c.key)), checked => {
                if (checked) {
                    cols.push(c);
                    cols.sort((a, b) => all.indexOf(a) - all.indexOf(b));
                }
                else
                    cols.remove(c);
            }, c.key, req && (req.includes(c.key)));
        })).on("click", e => clearEvent(e)), hd = cols.bind(div("hd tr", wrap(i.corner, "sd" /* C.side */)), {
            insert: (c, j, p) => {
                let s = this.ccss(wrap(i.head(c), "i" /* C.item */), c);
                if (i.resize)
                    div(["div" /* C.separator */]).addTo(s).on('mousedown', e => {
                        clearEvent(e);
                        let index = cols.indexOf(c) + 1, 
                        //t = '.' + C.item + ':nth-child(' + (index + 2) + ')',
                        rows = d.childs().child(index);
                        body.css({ cursor: 'col-resize', userSelect: "none" });
                        function move(e) {
                            c.size = (c.size = Math.max($.rem * 3, e.clientX - s.rect.left));
                            rows.css({ width: c.size + 'px' });
                        }
                        doc.on('mousemove', move).one('mouseup', () => {
                            doc.off('mousemove', move);
                            body.uncss(["cursor", "userSelect"]);
                        });
                    });
                i.sort && s.on("click", () => {
                    if (cols.tag("sort") == c)
                        if (c.desc) {
                            c.desc = false;
                            cols.tag("sort", null);
                        }
                        else {
                            c.desc = true;
                            cols.retag("sort");
                        }
                    else {
                        c.desc = false;
                        cols.tag("sort", c);
                    }
                });
                hdOpts && s.on({
                    mouseenter() { clearTimeout(hdOptsLeave); s.add(hdOpts); },
                    mouseleave() { hdOptsLeave = setTimeout(() => hdOpts.remove().child(".menu")?.remove(), 300); }
                });
                p.place(j + 1, s);
            },
            tag(active, j, p, tag, v) {
                let s = p.child(j + 1);
                switch (tag) {
                    case "sort":
                        s.child(".sort")?.remove();
                        if (active)
                            s.add(icon($.i[v.desc ? 'desc' : 'asc']).c("sort"));
                        i.sort.call(v, active);
                        break;
                    default:
                        s.c(tag, active);
                }
            },
            remove(_, _i, p) { p.unplace(_i + 1); },
            clear(p) { p.childs(1).remove(); }
        }), foot = (v) => g(v(this), "_ ft tr"), ft = i.foot && m(...i.foot?.map(foot)), d = div("_ tb" + (i.fill ? " fill" : ""), [hd, ft])
            .on("click", e => e.target == e.currentTarget && range.clear(data, "on"))
            .p('tabIndex', 0)
            .on("keydown", e => {
            // switch (e.key) {
            //   case "Space":
            //     if (i.editable && !this.editing)
            //       this.edit();
            // }
            kbHandler(data, e, i) && clearEvent(e);
        });
        data.bind(d, {
            insert: (s, j, p) => {
                let t2 = div("_ tr i", [
                    div("sd" /* C.side */),
                    cols.map(c => {
                        let v = s[c.key];
                        return this.ccss(wrap(c.fmt ? isS(c.fmt) ? v == null ? null : fmt(v, c.fmt) : c.fmt(v, i.p, s) : v).css({ textAlign: c.align }), c);
                    }),
                    // i.options && div(C.options, i.options.map(opt => opt(s, _i)))
                ]);
                p.place(j + 1, crudHandler(i.style?.(t2, s, j) || t2, s, data, i));
            },
            tag: (active, i, p) => {
                let s = p.child(i + 1).c("crt" /* C.current */, active).e;
                active && s.scrollIntoView({
                    block: "nearest",
                    inline: "nearest"
                });
                if (this.editing) {
                }
            },
            remove(_, i, p) { p.unplace(i + 1); },
            clear(s) { s.childs().slice(1).remove(); },
            groups(v, i, p, g) { p.child(i + 1).c(g, v); }
        });
        i.cols.onupdate(() => {
            this.data.reloadAll();
            ft?.eachS((f, j) => f.replace(foot(i.foot[j])));
        });
        i.resize && d.c("brd" /* C.bordered */);
        return d;
    }
}
/**rendered data */
function _rData(p, cols) {
    let r = [];
    p.childs().do((s, i) => {
        let t = r[i] = {}, cells = s.childs();
        for (let j = 0; j < l(cols); j++)
            t[cols[j].key] = g(cells[j + 1]).text();
    });
    return r;
}
function prev(start, parent) {
    let e = start.e;
    do {
        let p = e.previousElementSibling;
        while (p && p.lastElementChild)
            p = p.lastElementChild;
        if (p)
            e = p;
        else if (parent.e == (e = e.parentElement))
            e = null;
    } while (e && !e.matches("." + "hd" /* C.head */));
    return e && new S(e);
}
function next(start, parent) {
    let e = start.e;
    do {
        let n = e.firstElementChild || e.nextElementSibling;
        if (n)
            e = n;
        else {
            while (!(parent.e == (e = e.parentElement)) && !e.nextElementSibling) { }
            e = parent.e == e ? null : e.nextElementSibling;
        }
    } while (e && !e.matches("." + "hd" /* C.head */));
    return e && new S(e);
}
export function tree(i) {
    let d = div("_ tree"), click = ({ currentTarget: c, target: t }) => {
        if (c == t)
            select(i);
        else
            select(g(t).closest(".i").d());
    };
    return orray(i.data, v => v instanceof Branch ? v : new Branch(i, v, 0)).bind(d.p("tabIndex", 0)).on({
        keydown: (e) => {
            let f = i.s;
            switch (e.key) {
                case "ArrowUp":
                    let p = prev(f.head, d);
                    if (p) {
                        select(i, p.d());
                        break;
                    }
                    else
                        return;
                case "ArrowDown":
                    let n = next(f.head, d);
                    if (n) {
                        select(i, n.d());
                        break;
                    }
                    else
                        return;
                case "ArrowLeft":
                    if (f.i.open) {
                        f.set("open", false);
                        break;
                    }
                    else {
                        let p = prev(f.head, d);
                        if (p) {
                            select(i, p.d());
                            break;
                        }
                        else
                            return;
                    }
                case "ArrowRight":
                    if (f.i.dt && !f.i.open) {
                        f.set("open", true);
                        break;
                    }
                    else {
                        let n = next(f.head, d);
                        if (n) {
                            select(i, n.d());
                            break;
                        }
                        else
                            return;
                    }
                default:
                    return;
            }
            clearEvent(e);
        },
        click,
        dblclick: i.open && (() => i.open(i.s)),
        contextmenu: i.menu && ((e) => {
            click(e);
            let t = i.menu([i.s]);
            if (t) {
                ctxmenu(e, t);
                e.preventDefault();
            }
        })
    });
}
export function query({ data }, text) {
    text = text.toLowerCase();
    for (let item of data)
        item.filter((e) => (e.key + '').toLowerCase().indexOf(text) != -1);
}
export function select(i, e) {
    let f = i.focus, o = i.s, n = i.s = e;
    if (o) {
        o.head.c("on" /* C.on */, false);
        f?.(o, false);
    }
    if (n) {
        n.head.c("on" /* C.on */);
        f?.(n, true);
    }
}
export class Branch extends E {
    ctx;
    level;
    uuid;
    // dt: L<Branch, IBranch>;
    constructor(ctx, i, level) {
        super(i);
        this.ctx = ctx;
        this.level = level;
        i.dt && (i.dt = orray(i.dt, v => v instanceof Branch ? v : new Branch(ctx, v, level + 1)));
    }
    get key() { return this.i.key; }
    get(path) {
        var t1 = path.split('/', 2);
        let result = this.i.dt.find(t1[0]);
        if (t1.length > 1) {
            if (result.i.dt)
                result = result.get(t1[1]);
            else
                throw "";
        }
        return result;
    }
    head;
    view() {
        let i = this.i, h = this.head = div("hd" /* C.head */, div("bd" /* C.body */, [i.key, i.side && wrap(i.side, "sd" /* C.side */)]))
            .css("paddingLeft", $.rem * this.level + "px").d(this);
        if (i.dt) {
            let body = i.dt.bind(div()), ico = icon('menuR');
            return this.bind(div("i" /* C.item */, [
                h.prepend(div(0, ico).on('click', e => { this.toggle("open"); clearEvent(e); })),
                i.open && body
            ]).d(this), (t) => {
                if (i.open) {
                    t.add(body);
                    ico.replace(ico = icon('menuD'));
                }
                else {
                    body.remove();
                    ico.replace(ico = icon('menuR'));
                }
                this.ctx.toggle?.(this, i.open);
            }, 'open');
        }
        else
            return h.c("i" /* C.item */).d(this).prepend(icon(i.icon));
    }
    filter(filter, /*sub: boolean = true,*/ ok = false) {
        //obs: ok � para que se o parent passar no filtro todos os filhos devem passar tambem
        //obs: any � para se algum dos filhos dele passar ele tambem passa
        ok || (ok = filter(this.i));
        let any, dt = this.i.dt;
        if (dt)
            for (let item of dt) {
                any = item.filter(filter, ok) || any;
            }
        // this.div.c(C.off, !any);
        return ok;
    }
}
export class Grid extends E {
    perLine = 1;
    margin = 0;
    get dt() { return this.i.dt; }
    resize() {
        // let
        //   d = g(this),
        //   w = d.rect().width,
        //   mrg = hs(theme.a.mrg),
        //   itemW = hs(theme.grid.sz) + mrg * 2,
        //   spc = w % itemW,
        //   pl = this.perLine = ((w - spc) / itemW),
        //   m = this.margin = (spc / 2) / pl + mrg;
        // d.childs().css({
        //   marginLeft: m + "px",
        //   marginRight: m + "px",
        // })
    }
    view() {
        let i = this.i, dt = i.dt, d = div().attr("resize", true);
        setTimeout(() => this.resize());
        return dt.bind(this.bind(d, () => d.c(["_", i.sz, "grid"]), "sz"), {
            insert: (v) => div("i" /* C.item */, [
                logo(v.icon) || icon(i.defIcon),
                v.txt || v.key,
                i.info && div("sd" /* C.side */, i.info.fields.map(k => [k, v[k]])
                    .filter(v => v[1] != null).slice(0, i.info.max)
                    .map(([k, v]) => div(0, [i.info.showKey && k, v])))
            ]).d(v).css({
                marginLeft: this.margin + "px",
                marginRight: this.margin + "px",
            }),
            groups(v, i, p, g) { p.child(i).c(g, v); }
        }).on({
            keydown: (e) => {
                if (!kbHandler(dt, e, i))
                    switch (e.key) {
                        case "ArrowLeft":
                            kbHTp(dt, -1, e);
                            break;
                        case "ArrowRight":
                            kbHTp(dt, 1, e);
                            break;
                        case "ArrowDown":
                            kbHTp(dt, this.perLine, e);
                            break;
                        case "ArrowUp":
                            kbHTp(dt, -this.perLine, e);
                            break;
                        default:
                            return;
                    }
                clearEvent(e);
            },
            resize: () => this.resize()
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFNLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBYSxDQUFDLEVBQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUM5RSxPQUFPLEtBQUssRUFBRSxFQUFTLE1BQU0sRUFBSyxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRSxPQUFPLEVBQVEsSUFBSSxFQUFFLEdBQUcsRUFBTyxHQUFHLEVBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFrQixDQUFDLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEcsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQVksS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQVEsSUFBSSxFQUFFLE1BQU0sRUFBbUIsQ0FBQyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzFHLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ2hELE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxXQUFXLENBQUM7QUE2Qi9CLDJCQUEyQjtBQUMzQiwrQkFBK0I7QUFDL0Isc0JBQXNCO0FBQ3RCLDhFQUE4RTtBQUU5RSx5Q0FBeUM7QUFDekMseUNBQXlDO0FBQ3pDLDBDQUEwQztBQUMxQywwQ0FBMEM7QUFDMUMsOENBQThDO0FBQzlDLHdEQUF3RDtBQUN4RCxJQUFJO0FBRUosd0NBQXdDO0FBQ3hDLGdCQUFnQjtBQUNoQixVQUFVO0FBQ1YsbUJBQW1CO0FBQ25CLHVCQUF1QjtBQUN2QixjQUFjO0FBQ2QsYUFBYTtBQUNiLElBQUk7QUFFSixNQUFNLENBQUMsTUFBTSxXQUFXLEdBQWtCO0lBQ3hDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFD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