"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Branch = exports.select = exports.query = exports.tree = void 0;
const galho_1 = require("galho");
const orray_1 = require("orray");
const galhui_1 = require("./galhui");
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
    return (0, orray_1.bind)((0, orray_1.default)(i.data, v => v instanceof Branch ? v : new Branch(i, v, 0)), d.prop("tabIndex", 0)).on({
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
                (0, galhui_1.ctx)(e, t);
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
        o.head.cls("on" /* on */, false);
        f?.(o, false);
    }
    if (n) {
        n.head.cls("on" /* on */);
        f?.(n, true);
    }
}
exports.select = select;
class Branch extends galho_1.E {
    ctx;
    level;
    uuid;
    // dt: L<Branch, IBranch>;
    constructor(ctx, i, level) {
        super(i);
        this.ctx = ctx;
        this.level = level;
        i.dt && (i.dt = (0, orray_1.default)(i.dt, v => v instanceof Branch ? v : new Branch(ctx, v, level + 1)));
    }
    get key() { return this.i.key; }
    get(path) {
        var t1 = path.split('/', 2);
        let result = (0, orray_1.get)(this.i.dt, t1[0]);
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
        let i = this.i, h = this.head = (0, galho_1.div)("hd" /* head */, (0, galho_1.div)("bd" /* body */, [i.key, i.side && (0, galho_1.wrap)(i.side, "sd" /* side */)]))
            .css("paddingLeft", galhui_1.$.rem * this.level + "px").d(this);
        if (i.dt) {
            let body = (0, orray_1.bind)(i.dt, (0, galho_1.div)()), ico = (0, galhui_1.icon)('menuR');
            return this.bind((0, galho_1.div)("i" /* item */, [
                h.prepend((0, galho_1.div)(0, ico).on('click', e => { this.toggle("open"); (0, galho_1.clearEvent)(e); })),
                i.open && body
            ]).d(this), (t) => {
                if (i.open) {
                    t.add(body);
                    ico.replace(ico = (0, galhui_1.icon)('menuD'));
                }
                else {
                    body.remove();
                    ico.replace(ico = (0, galhui_1.icon)('menuR'));
                }
                this.ctx.toggle?.(this, i.open);
            }, 'open');
        }
        else
            return h.cls("i" /* item */).d(this).prepend((0, galhui_1.icon)(i.icon));
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
        // this.div.cls(C.off, !any);
        return ok;
    }
}
exports.Branch = Branch;
// .on({
//   contextmenu: tp.ctx && ((e) => ctx(e, tp.ctx(i))),
//   dblclick: tp.open && (() => tp.open(i)),
//   click: () => this.ctx.focus(this),
// })
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXVEO0FBQ3ZELGlDQUFtRDtBQUNuRCxxQ0FBd0Q7QUFHeEQsU0FBUyxJQUFJLENBQUMsS0FBUSxFQUFFLE1BQVM7SUFDL0IsSUFBSSxDQUFDLEdBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN6QixHQUFHO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLHNCQUFzQixDQUFDO1FBQ2pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0I7WUFDNUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUV6QixJQUFJLENBQUM7WUFDSCxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ0gsSUFBSSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDeEMsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUNaLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLGtCQUFTLENBQUMsRUFBRTtJQUV4QyxPQUFPLENBQUMsSUFBSSxJQUFJLFNBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixDQUFDO0FBQ0QsU0FBUyxJQUFJLENBQUMsS0FBUSxFQUFFLE1BQVM7SUFDL0IsSUFBSSxDQUFDLEdBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN6QixHQUFHO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQTtRQUNuRCxJQUFJLENBQUM7WUFDSCxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ0g7WUFDSCxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGtCQUFr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