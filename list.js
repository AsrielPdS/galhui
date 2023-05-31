import { clearEvent, div, E, g, m, S, wrap } from "galho";
import orray, { extend, range } from "galho/orray.js";
import { call, def, fmt, isF, isN, isS, l, t } from "galho/util.js";
import { $, body, close, doc, icon, logo, menucb, w } from "./galhui.js";
import { ctxmenu, idropdown } from "./io.js";
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
        let sz = 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFNLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBYSxDQUFDLEVBQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUM5RSxPQUFPLEtBQUssRUFBRSxFQUFTLE1BQU0sRUFBSyxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRSxPQUFPLEVBQVEsSUFBSSxFQUFFLEdBQUcsRUFBTyxHQUFHLEVBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFrQixDQUFDLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEcsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQVksS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQVEsSUFBSSxFQUFFLE1BQU0sRUFBbUIsQ0FBQyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzFHLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzdDLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxXQUFXLENBQUM7QUE2Qi9CLDJCQUEyQjtBQUMzQiwrQkFBK0I7QUFDL0Isc0JBQXNCO0FBQ3RCLDhFQUE4RTtBQUU5RSx5Q0FBeUM7QUFDekMseUNBQXlDO0FBQ3pDLDBDQUEwQztBQUMxQywwQ0FBMEM7QUFDMUMsOENBQThDO0FBQzlDLHdEQUF3RDtBQUN4RCxJQUFJO0FBRUosd0NBQXdDO0FBQ3hDLGdCQUFnQjtBQUNoQixVQUFVO0FBQ1YsbUJBQW1CO0FBQ25CLHVCQUF1QjtBQUN2QixjQUFjO0FBQ2QsYUFBYTtBQUNiLElBQUk7QUFFSixNQUFNLENBQUMsTUFBTSxXQUFXLEdBQWtCO0lBQ3hDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFD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