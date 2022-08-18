"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Branch = exports.select = exports.query = exports.tree = void 0;
const galho_1 = require("galho");
const orray_1 = require("orray");
const galhui_js_1 = require("./galhui.js");
const hover_js_1 = require("./hover.js");
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
    return (0, orray_1.default)(i.data, v => v instanceof Branch ? v : new Branch(i, v, 0)).bind(d.prop("tabIndex", 0)).on({
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
            return h.cls("i" /* item */).d(this).prepend((0, galhui_js_1.icon)(i.icon));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXVEO0FBQ3ZELGlDQUF3QztBQUN4QywyQ0FBc0Q7QUFDdEQseUNBQWlDO0FBR2pDLFNBQVMsSUFBSSxDQUFDLEtBQVEsRUFBRSxNQUFTO0lBQy9CLElBQUksQ0FBQyxHQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekIsR0FBRztRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQztRQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCO1lBQzVCLENBQUMsR0FBRyxDQUFDLENBQUMsZ0JBQWdCLENBQUM7UUFFekIsSUFBSSxDQUFDO1lBQ0gsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNILElBQUksTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDO1lBQ3hDLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDWixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxrQkFBUyxDQUFDLEVBQUU7SUFFeEMsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLEtBQVEsRUFBRSxNQUFTO0lBQy9CLElBQUksQ0FBQyxHQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekIsR0FBRztRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLENBQUMsa0JBQWtCLENBQUE7UUFDbkQsSUFBSSxDQUFDO1lBQ0gsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNIO1lBQ0gsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHO1lBQ3pFLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUM7U0FDakQ7S0FDRixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxrQkFBUyxDQUFDLEVBQUU7SUFFeEMsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQVNELFNBQWdCLElBQUksQ0FBQyxDQUFRO0lBRTNCLElBQ0UsQ0FBQyxHQUFHLElBQUEsV0FBRyxFQUFDLFFBQVEsQ0FBQyxFQUNqQixLQUFLLEdBQUcsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBYyxFQUFFLEVBQUU7UUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNSLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFDUCxNQUFNLENBQUMsSUFBQSxTQUFDLEVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDO0lBQ0osT0FBTyxJQUFBLGVBQUssRUFBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3RHLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVaLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRTtnQkFDYixLQUFLLFNBQVM7b0JBQ1osSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxFQUFFO3dCQUNMLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBVSxDQUFDLENBQUM7d0JBQ3pCLE1BQU07cUJBQ1A7O3dCQUFNLE9BQU87Z0JBQ2hCLEtBQUssV0FBVztvQkFDZCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLEVBQUU7d0JBQ0wsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFVLENBQUMsQ0FBQzt3QkFDekIsTUFBTTtxQkFDUDs7d0JBQU0sT0FBTztnQkFDaEIsS0FBSyxXQUFXO29CQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7d0JBQ1osQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQ3JCLE1BQU07cUJBQ1A7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3hCLElBQUksQ0FBQyxFQUFFOzRCQUNMLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBVSxDQUFDLENBQUM7NEJBQ3pCLE1BQU07eUJBQ1A7OzRCQUFNLE9BQU87cUJBQ2Y7Z0JBQ0gsS0FBSyxZQUFZO29CQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTt3QkFDdkIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3BCLE1BQU07cUJBQ1A7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3hCLElBQUksQ0FBQyxFQUFFOzRCQUNMLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBVSxDQUFDLENBQUM7NEJBQ3pCLE1BQU07eUJBQ1A7OzRCQUFNLE9BQU87cUJBQ2Y7Z0JBQ0g7b0JBQ0UsT0FBTzthQUNWO1lBQ0QsSUFBQSxrQkFBVSxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLENBQUM7UUFDRCxLQUFLO1FBQ0wsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLEVBQUU7Z0JBQ0wsSUFBQSxjQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNWLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUNwQjtRQUNILENBQUMsQ0FBQztLQUNILENBQUMsQ0FBQztBQUNMLENBQUM7QUFoRUQsb0JBZ0VDO0FBQ0QsU0FBZ0IsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFTLEVBQUUsSUFBWTtJQUNqRCxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzFCLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSTtRQUNWLElBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRixDQUFDO0FBSkQsc0JBSUM7QUFDRCxTQUFnQixNQUFNLENBQUMsQ0FBUSxFQUFFLENBQVU7SUFDekMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEMsSUFBSSxDQUFDLEVBQUU7UUFDTCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsZ0JBQU8sS0FBSyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ2Y7SUFDRCxJQUFJLENBQUMsRUFBRTtRQUNMLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxlQUFNLENBQUM7UUFDakIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2Q7QUFDSCxDQUFDO0FBVkQsd0JBVUM7QUFtQkQsTUFBYSxNQUFPLFNBQVEsU0FBVTtJQUVwQywwQkFBMEI7SUFDMUIsWUFBbUIsR0FBVSxFQUFFLENBQVUsRUFBUyxLQUFhO1FBQzdELEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQURRLFFBQUcsR0FBSCxHQUFHLENBQU87UUFBcUIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUU3RCxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFBLGVBQUssRUFBa0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlHLENBQUM7SUFDRCxJQUFJLEdBQUcsS0FBSyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUVoQyxHQUFHLENBQUMsSUFBWTtRQUNkLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqQixJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDYixNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Z0JBQ3hCLE1BQU0sRUFBRSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSTtRQUNGLElBQ0UsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQ1YsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBQSxXQUFHLG1CQUFTLElBQUEsV0FBRyxtQkFBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFBLFlBQUksRUFBQyxDQUFDLENBQUMsSUFBSSxrQkFBUyxDQUFDLENBQUMsQ0FBQzthQUM5RSxHQUFHLENBQUMsYUFBYSxFQUFFLGFBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ1IsSUFBSSxJQUFJLEdBQUksQ0FBQyxDQUFDLEVBQWdCLENBQUMsSUFBSSxDQUFDLElBQUEsV0FBRyxHQUFFLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBQSxnQkFBSSxFQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWhFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFBLFdBQUcsa0JBQVM7Z0JBQzNCLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBQSxXQUFHLEVBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBQSxrQkFBVSxFQUFDLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9FLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSTthQUNmLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFO29CQUNWLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ1osR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBQSxnQkFBSSxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7aUJBQ2xDO3FCQUFNO29CQUNMLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDZCxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFBLGdCQUFJLEVBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztpQkFDbEM7Z0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNaOztZQUFNLE9BQU8sQ0FBQyxDQUFDLEdBQUcsZ0JBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUEsZ0JBQUksRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQWtDLEVBQUUsd0JBQXdCLENBQUUsRUFBRSxHQUFHLEtBQUs7UUFDN0UscUZBQXFGO1FBQ3JGLGtFQUFrRTtRQUNsRSxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLElBQUksR0FBWSxFQUFFLEVBQUUsR0FBYSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzQyxJQUFJLEVBQUU7WUFDSixLQUFLLElBQUksSUFBSSxJQUFJLEVBQUUsRUFBRTtnQkFDbkIsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQzthQUN0QztRQUNILDZCQUE2QjtRQUM3QixPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7Q0FDRjtBQXZERCx3QkF1REM7QUFDRCxRQUFRO0FBQ1IsdURBQXVEO0FBQ3ZELDZDQUE2QztBQUM3Qyx1Q0FBdUM7QUFDdkMsS0FBSyJ9