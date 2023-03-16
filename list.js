import { clearEvent, div, E, g, m, S, wrap } from "galho";
import orray, { extend, range } from "galho/orray.js";
import { call, def, fmt, isF, isN, isS, l, t } from "galho/util.js";
import { $, body, close, doc, icon, logo, menucb, w } from "./galhui.js";
import { ctx, idropdown } from "./hover.js";
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
            t && ctx(e, t);
        })
    });
}
export const kbHTp = (dt, dist, { ctrlKey: ctrl, shiftKey: shift }) => shift ? range.move(dt, "on", dist, range.tp(ctrl, false)) :
    ctrl ? range.movePivot(dt, "on", dist) :
        range.move(dt, "on", dist, 0 /* set */);
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
        insert: v => crudHandler(wrap(i.item(v), "i").badd(div("sd" /* side */)), v, dt, i),
        tag(active, i, p, tag) {
            let s = p.child(i).emit(new CustomEvent("current", { detail: active }));
            if (tag == "on") {
                s.c("crt" /* current */, active);
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
export const tab = (items, removeble, empty) => div(["ta" /* tab */], [
    items.bind(div(["bar" /* menubar */]), {
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
        let sz = 0;
        if (isN(c)) {
            let cs = this.cols;
            for (let j = 0; j < span; j++)
                sz += cs[c + j].size;
        }
        ;
        return e.c("i").css("width", (sz || c.size) + (this.i.fill ? '%' : 'px'));
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
        })).on("click", e => clearEvent(e)), hd = cols.bind(div("hd tr", wrap(i.corner, "sd" /* side */)), {
            insert: (c, j, p) => {
                let s = this.ccss(wrap(i.head(c), "i" /* item */), c);
                if (i.resize)
                    div(["div" /* separator */]).addTo(s).on('mousedown', e => {
                        clearEvent(e);
                        let index = cols.indexOf(c) + 1, 
                        //t = '.' + C.item + ':nth-child(' + (index + 2) + ')',
                        rows = d.childs().child(index);
                        body.css({ cursor: 'col-resize', userSelect: "none" });
                        function move(e) {
                            c.size = (c.size = Math.max($.rem * 3, e.clientX - s.rect().left));
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
            .on("keydown", e => kbHandler(data, e, i) && clearEvent(e));
        data.bind(d, {
            insert: (s, j, p) => {
                let t2 = div("_ tr i", [
                    div("sd" /* side */),
                    cols.map(c => {
                        let v = s[c.key];
                        return this.ccss(wrap(c.fmt ? isS(c.fmt) ? fmt(v, c.fmt) : c.fmt(v, i.p, s) : v).css({ textAlign: c.align }), c);
                    }),
                    // i.options && div(C.options, i.options.map(opt => opt(s, _i)))
                ]);
                p.place(j + 1, crudHandler(i.style?.(t2, s, j) || t2, s, data, i));
            },
            tag(active, i, p) {
                let s = p.child(i + 1).c("crt" /* current */, active).e;
                active && s.scrollIntoView({
                    block: "nearest",
                    inline: "nearest"
                });
            },
            remove(_, i, p) { p.unplace(i + 1); },
            clear(s) { s.childs().slice(1).remove(); },
            groups(v, i, p, g) { p.child(i + 1).c(g, v); }
        });
        i.cols.onupdate(() => {
            this.data.reloadAll();
            ft?.eachS((f, j) => f.replace(foot(i.foot[j])));
        });
        i.resize && d.c("brd" /* bordered */);
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
    } while (e && !e.matches("." + "hd" /* head */));
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
    } while (e && !e.matches("." + "hd" /* head */));
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
                ctx(e, t);
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
        o.head.c("on" /* on */, false);
        f?.(o, false);
    }
    if (n) {
        n.head.c("on" /* on */);
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
        let i = this.i, h = this.head = div("hd" /* head */, div("bd" /* body */, [i.key, i.side && wrap(i.side, "sd" /* side */)]))
            .css("paddingLeft", $.rem * this.level + "px").d(this);
        if (i.dt) {
            let body = i.dt.bind(div()), ico = icon('menuR');
            return this.bind(div("i" /* item */, [
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
            return h.c("i" /* item */).d(this).prepend(icon(i.icon));
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
            insert: (v) => div("i" /* item */, [
                logo(v.icon) || icon(i.defIcon),
                v.txt || v.key,
                i.info && div("sd" /* side */, i.info.fields.map(k => [k, v[k]])
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFNLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBYSxDQUFDLEVBQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUM5RSxPQUFPLEtBQUssRUFBRSxFQUFTLE1BQU0sRUFBSyxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRSxPQUFPLEVBQVEsSUFBSSxFQUFFLEdBQUcsRUFBTyxHQUFHLEVBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFrQixDQUFDLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEcsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQVksS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQVEsSUFBSSxFQUFFLE1BQU0sRUFBbUIsQ0FBQyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzFHLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxXQUFXLENBQUM7QUE2Qi9CLDJCQUEyQjtBQUMzQiwrQkFBK0I7QUFDL0Isc0JBQXNCO0FBQ3RCLDhFQUE4RTtBQUU5RSx5Q0FBeUM7QUFDekMseUNBQXlDO0FBQ3pDLDBDQUEwQztBQUMxQywwQ0FBMEM7QUFDMUMsOENBQThDO0FBQzlDLHdEQUF3RDtBQUN4RCxJQUFJO0FBRUosd0NBQXdDO0FBQ3hDLGdCQUFnQjtBQUNoQixVQUFVO0FBQ1YsbUJBQW1CO0FBQ25CLHVCQUF1QjtBQUN2QixjQUFjO0FBQ2QsYUFBYTtBQUNiLElBQUk7QUFFSixNQUFNLENBQUMsTUFBTSxXQUFXLEdBQWtCO0lBQ3hDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFD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