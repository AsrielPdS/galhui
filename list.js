"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = exports.Branch = exports.select = exports.query = exports.tree = exports.editing = exports.tab = exports.list = exports.kbHandler = exports.kbHTp = exports.crudHandler = exports.defRenderer = void 0;
const galho_1 = require("galho");
const orray_js_1 = require("galho/orray.js");
const util_js_1 = require("galho/util.js");
const galhui_js_1 = require("./galhui.js");
const hover_js_1 = require("./hover.js");
const util_js_2 = require("./util.js");
exports.defRenderer = {
    null: () => (0, galho_1.div)(0, (0, galhui_js_1.icon)(galhui_js_1.$.i.null)),
    invalidIcon: () => (0, galhui_js_1.icon)('image-broken'),
    checkboxFmt: "icon",
    html: true,
    interactive: true,
    format: true
};
function crudHandler(e, dt, i) {
    let click = (ev) => orray_js_1.range.add(dt, "on", e.d(), orray_js_1.range.tp(ev.ctrlKey, ev.shiftKey));
    return e.on({
        click,
        dblclick: i.open && (() => i.open(...orray_js_1.range.list(dt, "on"))),
        contextmenu: i.menu && (e => {
            click(e);
            let t = i.menu(...orray_js_1.range.list(dt, "on"));
            t && (0, hover_js_1.ctx)(e, t);
        })
    });
}
exports.crudHandler = crudHandler;
const kbHTp = (dt, dist, { ctrlKey: ctrl, shiftKey: shift }) => shift ? orray_js_1.range.move(dt, "on", dist, orray_js_1.range.tp(ctrl, false)) :
    ctrl ? orray_js_1.range.movePivot(dt, "on", dist) :
        orray_js_1.range.move(dt, "on", dist, 0 /* set */);
exports.kbHTp = kbHTp;
function kbHandler(dt, e, i, noArrows) {
    switch (e.key) {
        case "Delete":
            let t0 = orray_js_1.range.list(dt, "on");
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
            (0, exports.kbHTp)(dt, -orray_js_1.range.pivot(dt, "on"), e);
            break;
        case "End":
            (0, exports.kbHTp)(dt, dt.length - orray_js_1.range.pivot(dt, "on"), e);
            break;
        case "PageDown":
            (0, exports.kbHTp)(dt, 10, e);
            break;
        case "PageUp":
            (0, exports.kbHTp)(dt, -10, e);
            break;
        case "Enter":
            if (i.open) {
                i.open(...orray_js_1.range.list(dt, "on"));
                break;
            }
            else
                return;
        case "ArrowUp":
            if (noArrows)
                return;
            (0, exports.kbHTp)(dt, -1, e);
            break;
        case "ArrowDown":
            if (noArrows)
                return;
            (0, exports.kbHTp)(dt, 1, e);
            break;
        default:
            return;
    }
    return true;
}
exports.kbHandler = kbHandler;
function list(i, data) {
    let dt = (0, orray_js_1.extend)(data, {
        g: i.single ? null : ["on"],
        clear: true, key: i.key
    }), e = (0, util_js_1.t)(i.enum), r = dt.bind((0, galho_1.g)("ol", "_ list"), {
        insert: v => crudHandler((0, galho_1.wrap)(i.item(v), "i").d(v), dt, i),
        tag(s, active, tag) {
            tag == "on" && s.c("crt" /* current */, active).e.scrollIntoView({
                block: "nearest",
                inline: "nearest"
            });
            s.c(tag, active);
        },
        groups(s, on, _, key) { s.c(key, on); }
    });
    return (0, util_js_1.t)(i.kd) ? r.props({
        tabIndex: 0, onkeydown(e) { kbHandler(data, e, i) && (0, galho_1.clearEvent)(e); }
    }) : r;
}
exports.list = list;
const tab = (items, removeble, empty) => (0, galho_1.div)(["ta" /* tab */], [
    items.bind((0, galho_1.div)(["bar" /* menubar */]), {
        tag: (v, a) => v.c("on", a),
        insert: value => (0, galho_1.div)("i", [
            (0, galhui_js_1.icon)(value.icon),
            value.text,
            removeble && (0, galhui_js_1.close)(e => { (0, galho_1.clearEvent)(e); items.remove(value); })
        ]).on('click', () => items.tag("on", value))
    }),
    (0, util_js_1.call)((0, galho_1.div)("bd"), bd => {
        let cb = (v) => {
            bd.attr("id", false);
            if (v) {
                bd.set((0, util_js_1.isF)(v.body) ? (v.body = v.body(v)) : v.body);
                v.focus?.(bd, true);
            }
            else
                bd.set(empty?.());
        };
        items.ontag("on", cb);
        cb(items.tags?.on.v);
    }),
]);
exports.tab = tab;
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
exports.editing = Symbol();
class Table extends galho_1.E {
    // foot: Foot[];
    constructor(i, data) {
        // i.data = data as L;
        super(i);
        this.data = (0, orray_js_1.extend)(data, {
            g: i.single ? null : ["on"],
            key: i.key,
            clear: true
        });
        // this.foot = foot && extend<T>(foot, {
        //   key: i.key,
        //   clear: true
        // });
        i.head || (i.head = c => (0, util_js_1.def)((0, util_js_1.def)(c.text, galhui_js_1.w[c.key]), (0, util_js_2.up)(c.key)));
    }
    // get data() { return this.i.data as L<T>; }
    // get footData() { return this.i.foot as L<T>; }
    get cols() { return this.i.cols; }
    ccss(e, c, span = 1) {
        let sz = 0;
        if ((0, util_js_1.isN)(c)) {
            let cs = this.cols;
            for (let j = 0; j < span; j++)
                sz += cs[c + j].size;
        }
        ;
        return e.c("i").css("width", (sz || c.size) + (this.i.fill ? '%' : 'px'));
    }
    view() {
        let i = this.i, cols = i.cols, all = i.allColumns, req = i.reqColumns, data = this.data, hdOptsLeave, hdOpts = all && (0, hover_js_1.idropdown)(null, all.map(c => {
            return (0, galhui_js_1.menucb)(cols.includes(c), (0, util_js_1.def)((0, util_js_1.def)(c.text, galhui_js_1.w[c.key]), (0, util_js_2.up)(c.key)), checked => {
                if (checked) {
                    cols.push(c);
                    cols.sort((a, b) => all.indexOf(a) - all.indexOf(b));
                }
                else
                    cols.remove(c);
            }, c.key, req && (req.includes(c.key)));
        })).on("click", e => (0, galho_1.clearEvent)(e)), hd = cols.bind((0, galho_1.div)("hd tr", (0, galho_1.wrap)(i.corner, "sd" /* side */)), {
            insert: (c, j, p) => {
                let s = this.ccss((0, galho_1.wrap)(i.head(c), "i" /* item */), c);
                if (i.resize)
                    (0, galho_1.div)(["div" /* separator */]).addTo(s).on('mousedown', e => {
                        (0, galho_1.clearEvent)(e);
                        let index = cols.indexOf(c) + 1, 
                        //t = '.' + C.item + ':nth-child(' + (index + 2) + ')',
                        rows = d.childs().child(index);
                        galhui_js_1.body.css({ cursor: 'col-resize', userSelect: "none" });
                        function move(e) {
                            c.size = (c.size = Math.max(galhui_js_1.$.rem * 3, e.clientX - s.rect().left));
                            rows.css({ width: c.size + 'px' });
                        }
                        galhui_js_1.doc.on('mousemove', move).one('mouseup', () => {
                            galhui_js_1.doc.off('mousemove', move);
                            galhui_js_1.body.uncss(["cursor", "userSelect"]);
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
            tag(s, active, tag, v, j, p) {
                switch (tag) {
                    case "sort":
                        (s = p.child(j + 1)).child(".sort")?.remove();
                        if (active)
                            s.add((0, galhui_js_1.icon)(galhui_js_1.$.i[v.desc ? 'desc' : 'asc']).c("sort"));
                        i.sort.call(v, active);
                        break;
                    default:
                        s.c(tag, active);
                }
            },
            remove(_, _i, p) { p.unplace(_i + 1); },
            clear(p) { p.childs(1).remove(); }
        }), foot = (v) => (0, galho_1.g)(v(this), "_ ft tr"), ft = i.foot && (0, galho_1.m)(...i.foot?.map(foot)), d = (0, galho_1.div)("_ tb" + (i.fill ? " fill" : ""), [hd, ft])
            .p('tabIndex', 0)
            .on("keydown", (e) => kbHandler(data, e, i) && (0, galho_1.clearEvent)(e));
        data.bind(d, {
            insert: (s, j, p) => {
                let t2 = (0, galho_1.div)("_ tr i", [
                    (0, galho_1.div)("sd" /* side */),
                    cols.map(c => {
                        let v = s[c.key];
                        return this.ccss((0, galho_1.wrap)(c.fmt ? (0, util_js_1.isS)(c.fmt) ? (0, util_js_1.fmt)(v, c.fmt) : c.fmt({ v, p: i.p, s }) : v).css({ textAlign: c.align }), c);
                    }),
                    // i.options && div(C.options, i.options.map(opt => opt(s, _i)))
                ]).d(s);
                i.style?.(t2, s, j);
                p.place(j + 1, crudHandler(t2, data, i));
            },
            tag(s, active) {
                s.c("crt" /* current */, active).e.scrollIntoView({
                    block: "nearest",
                    inline: "nearest"
                });
            },
            remove(_, i, p) { p.unplace(i + 1); },
            clear(s) { s.childs(".i").remove(); },
            groups: { on: (s, active) => s.c("on", active) }
        });
        i.cols.onupdate(() => {
            this.data.reloadAll();
            ft?.eachS((f, j) => f.replace(foot(i.foot[j])));
        });
        i.resize && d.c("brd" /* bordered */);
        return d;
    }
}
exports.default = Table;
/**rendered data */
function _rData(p, cols) {
    let r = [];
    p.childs().do((s, i) => {
        let t = r[i] = {}, cells = s.childs();
        for (let j = 0; j < (0, util_js_1.l)(cols); j++)
            t[cols[j].key] = (0, galho_1.g)(cells[j + 1]).text();
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
    return e && new galho_1.S(e);
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
    return e && new galho_1.S(e);
}
function tree(i) {
    let d = (0, galho_1.div)("_ tree"), click = ({ currentTarget: c, target: t }) => {
        if (c == t)
            select(i);
        else
            select((0, galho_1.g)(t).closest(".i").d());
    };
    return (0, orray_js_1.default)(i.data, v => v instanceof Branch ? v : new Branch(i, v, 0)).bind(d.p("tabIndex", 0)).on({
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
            (0, galho_1.clearEvent)(e);
        },
        click,
        dblclick: i.open && (() => i.open(i.s)),
        contextmenu: i.menu && ((e) => {
            click(e);
            let t = i.menu(i.s);
            if (t) {
                (0, hover_js_1.ctx)(e, t);
                e.preventDefault();
            }
        })
    });
}
exports.tree = tree;
function query({ data }, text) {
    text = text.toLowerCase();
    for (let item of data)
        item.filter((e) => (e.key + '').toLowerCase().indexOf(text) != -1);
}
exports.query = query;
function select(i, e) {
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
exports.select = select;
class Branch extends galho_1.E {
    // dt: L<Branch, IBranch>;
    constructor(ctx, i, level) {
        super(i);
        this.ctx = ctx;
        this.level = level;
        i.dt && (i.dt = (0, orray_js_1.default)(i.dt, v => v instanceof Branch ? v : new Branch(ctx, v, level + 1)));
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
    view() {
        let i = this.i, h = this.head = (0, galho_1.div)("hd" /* head */, (0, galho_1.div)("bd" /* body */, [i.key, i.side && (0, galho_1.wrap)(i.side, "sd" /* side */)]))
            .css("paddingLeft", galhui_js_1.$.rem * this.level + "px").d(this);
        if (i.dt) {
            let body = i.dt.bind((0, galho_1.div)()), ico = (0, galhui_js_1.icon)('menuR');
            return this.bind((0, galho_1.div)("i" /* item */, [
                h.prepend((0, galho_1.div)(0, ico).on('click', e => { this.toggle("open"); (0, galho_1.clearEvent)(e); })),
                i.open && body
            ]).d(this), (t) => {
                if (i.open) {
                    t.add(body);
                    ico.replace(ico = (0, galhui_js_1.icon)('menuD'));
                }
                else {
                    body.remove();
                    ico.replace(ico = (0, galhui_js_1.icon)('menuR'));
                }
                this.ctx.toggle?.(this, i.open);
            }, 'open');
        }
        else
            return h.c("i" /* item */).d(this).prepend((0, galhui_js_1.icon)(i.icon));
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
exports.Branch = Branch;
class Grid extends galho_1.E {
    constructor() {
        super(...arguments);
        this.perLine = 1;
        this.margin = 0;
    }
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
        let i = this.i, dt = i.dt, d = (0, galho_1.div)().attr("resize", true);
        setTimeout(() => this.resize());
        return dt.bind(this.bind(d, () => d.c((0, galho_1.cl)("_", i.sz, "grid")), "sz"), {
            insert: (v) => (0, galho_1.div)("i" /* item */, [
                (0, galhui_js_1.logo)(v.icon) || (0, galhui_js_1.icon)(i.defIcon),
                v.txt || v.key,
                i.info && (0, galho_1.div)("sd" /* side */, i.info.fields.map(k => [k, v[k]])
                    .filter(v => v[1] != null).slice(0, i.info.max)
                    .map(([k, v]) => (0, galho_1.div)(0, [i.info.showKey && k, v])))
            ]).d(v).css({
                marginLeft: this.margin + "px",
                marginRight: this.margin + "px",
            }),
            groups: (e, v, _, k) => e.c(k, v),
        }).on({
            keydown: (e) => {
                if (!kbHandler(dt, e, i))
                    switch (e.key) {
                        case "ArrowLeft":
                            (0, exports.kbHTp)(dt, -1, e);
                            break;
                        case "ArrowRight":
                            (0, exports.kbHTp)(dt, 1, e);
                            break;
                        case "ArrowDown":
                            (0, exports.kbHTp)(dt, this.perLine, e);
                            break;
                        case "ArrowUp":
                            (0, exports.kbHTp)(dt, -this.perLine, e);
                            break;
                        default:
                            return;
                    }
                (0, galho_1.clearEvent)(e);
            },
            resize: () => this.resize()
        });
    }
}
exports.Grid = Grid;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQW1FO0FBQ25FLDZDQUFnRTtBQUNoRSwyQ0FBeUY7QUFDekYsMkNBQTBHO0FBQzFHLHlDQUE0QztBQUM1Qyx1Q0FBK0I7QUFrRGxCLFFBQUEsV0FBVyxHQUFrQjtJQUN4QyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxXQUFHLEVBQUMsQ0FBQyxFQUFFLElBQUEsZ0JBQUksRUFBQyxhQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLGdCQUFJLEVBQUMsY0FBYyxDQUFDO0lBQ3ZDLFdBQVcsRUFBRSxNQUFNO0lBQ25CLElBQUksRUFBRSxJQUFJO0lBQ1YsV0FBVyxFQUFFLElBQUk7SUFDakIsTUFBTSxFQUFFLElBQUk7Q0FDYixDQUFBO0FBRUQsU0FBZ0IsV0FBVyxDQUFJLENBQUksRUFBRSxFQUFRLEVBQUUsQ0FBVztJQUN4RCxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQWMsRUFBRSxFQUFFLENBQUMsZ0JBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsZ0JBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUM5RixPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDVixLQUFLO1FBQ0wsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsZ0JBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0QsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENB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