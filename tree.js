"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Branch = exports.select = exports.query = exports.tree = void 0;
const galho_1 = require("galho");
const orray_1 = require("orray");
const galhui_1 = require("./galhui");
const hover_1 = require("./hover");
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
                (0, hover_1.ctx)(e, t);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXVEO0FBQ3ZELGlDQUFtRDtBQUNuRCxxQ0FBbUQ7QUFDbkQsbUNBQThCO0FBRzlCLFNBQVMsSUFBSSxDQUFDLEtBQVEsRUFBRSxNQUFTO0lBQy9CLElBQUksQ0FBQyxHQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekIsR0FBRztRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQztRQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCO1lBQzVCLENBQUMsR0FBRyxDQUFDLENBQUMsZ0JBQWdCLENBQUM7UUFFekIsSUFBSSxDQUFDO1lBQ0gsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNILElBQUksTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDO1lBQ3hDLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDWixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxrQkFBUyxDQUFDLEVBQUU7SUFFeEMsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLEtBQVEsRUFBRSxNQUFTO0lBQy9CLElBQUksQ0FBQyxHQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekIsR0FBRztRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLENBQUMsa0JBQWtCLENBQUE7UUFDbkQsSUFBSSxDQUFDO1lBQ0gsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNIO1lBQ0gsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLENB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