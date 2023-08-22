import { clearEvent, div, E, g, m, S, wrap } from "galho";
import orray, { extend, range } from "galho/orray.js";
import { call, def, isF, isN, l, t } from "galho/util.js";
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
export function list(data, i) {
    let dt = extend(data, {
        g: i.single ? null : ["on"],
        clear: true, key: i.key
    }), e = t(i.enum), r = dt.bind(g(i.tag || (e ? "ol" : "ul"), "_ list"), {
        insert: v => crudHandler(wrap(i.item(v), "i").badd(e && div("sd" /* C.side */)), v, dt, i),
        reload(v, j, p) { p.child(j).set(Array.from(wrap(i.item(v), "i").badd(div("sd" /* C.side */)).e.childNodes)); },
        tag(active, i, p, tag) {
            let s = p.child(i); //.emit(new CustomEvent("current", { detail: active }));
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
function defineSize(items, max = 100) {
    let total = 0, l = items.length, sizes = [];
    for (let i of items) {
        let s = i.size || 1 / l;
        sizes.push(s);
        total += s;
    }
    for (let i = 0; i < l; i++)
        items[i].size = (sizes[i] / total) * max;
}
export const editing = Symbol();
export class Table extends E {
    // get data() { return this.i.data as L<T>; }
    // get footData() { return this.i.foot as L<T>; }
    get cols() { return this.i.cols; }
    data;
    form;
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
            let cs = this.cols, i = c, j = 0;
            c = cs[c];
            for (; j < span; j++)
                sz += cs[i + j].size;
        }
        else
            sz = c.size;
        return e.c("i").css({
            width: sz + 'px',
            textAlign: c.align
        });
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
        })).on("click", e => clearEvent(e));
        let hd = cols.bind(div("hd _ tr", wrap(i.corner, "sd" /* C.side */)), {
            insert: (c, j, p) => {
                let s = this.ccss(wrap(i.head(c), "i"), c).uncss(["textAlign"]);
                if (i.resize)
                    div(["div" /* C.separator */]).addTo(s).on('mousedown', e => {
                        clearEvent(e);
                        let newJ = cols.indexOf(c) + 1;
                        if (!i.fill || newJ < l(cols)) {
                            let rows = d.childs().child(newJ);
                            let next = i.fill && rows.next();
                            let s2 = next?.e?.(0), r = s2?.rect?.right;
                            body.css({ cursor: 'col-resize', userSelect: "none" });
                            function move(e) {
                                c.size = (c.size = Math.max($.rem * 2, e.clientX - s.rect.left));
                                rows.css({ width: c.size + 'px' });
                                if (next) {
                                    let sz = cols[newJ].size = Math.max($.rem * 2, r - e.clientX);
                                    next.css({ width: sz + 'px' });
                                }
                            }
                            doc.on('mousemove', move).one('mouseup', () => {
                                doc.off('mousemove', move);
                                body.uncss(["cursor", "userSelect"]);
                            });
                        }
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
        });
        let foot = (v) => g(v(this), "_ ft tr"), ft = i.foot && m(...i.foot.map(foot)), d = div("_ tb", [hd, ft])
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
        let content = (v) => [
            div("sd" /* C.side */),
            cols.map(c => this.ccss(wrap(c.fmt ? c.fmt(v[c.key], i.p, v) : v[c.key]), c)),
            // i.options && div(C.options, i.options.map(opt => opt(s, _i)))
        ];
        data.bind(d, {
            insert: (v, j) => {
                let t2 = div("_ tr i", content(v));
                d.place(j + 1, crudHandler(i.style?.(t2, v, j) || t2, v, data, i));
            },
            reload(v, j) { d.child(j + 1).set(content(v)); },
            tag: (active, i, p) => {
                let s = p.child(i + 1).c("crt" /* C.current */, active).e;
                active && s.scrollIntoView({
                    block: "nearest",
                    inline: "nearest"
                });
            },
            remove(_, i, p) { p.unplace(i + 1); },
            clear(s) { s.childs().slice(1).remove(); },
            groups(v, i, p, g) { p.child(i + 1).c(g, v); }
        });
        cols.on(() => {
            this.data.reloadAll();
            ft?.eachS((f, j) => f.replace(foot(i.foot[j])));
        });
        i.resize && d.c("brd" /* C.bordered */);
        return d;
    }
    fillArea(sideSize = 2 * $.rem) {
        let c = this.i.cols, s = g(this), tr = s.childs();
        defineSize(c, s.e.clientWidth - sideSize);
        for (let i = 0; i < l(c); i++) {
            tr.child(i + 1).css({ width: c[i].size + "px" });
        }
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
