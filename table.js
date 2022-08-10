"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editing = void 0;
const galho_1 = require("galho");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
const dropdown_js_1 = require("./dropdown.js");
const galhui_js_1 = require("./galhui.js");
const list_js_1 = require("./list.js");
const menu_js_1 = require("./menu.js");
function defineSize(items, apply) {
    let size = 0, l = items.length, sizes = [];
    for (let i of items) {
        let s = i.size;
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
            items[i].size = result[i];
    return result;
}
exports.editing = Symbol();
class Table extends galho_1.E {
    // foot: Foot[];
    constructor(i, data) {
        // i.data = data as L;
        super(i);
        this.data = (0, orray_1.extend)(data, {
            g: i.single ? null : ["on"],
            key: i.key,
            clear: true
        });
        // this.foot = foot && extend<T>(foot, {
        //   key: i.key,
        //   clear: true
        // });
        let delayIndex;
        i.columns = (0, orray_1.create)(i.columns, { g: i.sort && ["sort"] })
            .onupdate(() => delayIndex = (0, inutil_1.delay)(delayIndex, () => {
            (0, orray_1.reloadAll)(this.data);
            i.foot && (0, orray_1.reloadAll)(i.foot);
        }));
        if (!i.head)
            i.head = (c) => c.text;
    }
    // get data() { return this.i.data as L<T>; }
    // get footData() { return this.i.foot as L<T>; }
    get columns() { return this.i.columns; }
    view() {
        let i = this.i, cols = i.columns, all = i.allColumns, req = i.reqColumns, opts = i.options && (0, inutil_1.valid)(i.options), data = this.data, headerOptions = all && (0, dropdown_js_1.dropdown)(null, all.map(c => {
            return (0, menu_js_1.menucb)(cols.includes(c), c.text, checked => {
                if (checked) {
                    cols.push(c);
                    (0, orray_1.sort)(cols, (a, b) => all.indexOf(a) - all.indexOf(b));
                }
                else
                    (0, orray_1.remove)(cols, c);
            }, c.key, req && (req.includes(c.key)));
        })), bd = (0, orray_1.bind)(data, (0, list_js_1.crudHandler)((0, galho_1.div)("bd"), data, "tb-i", i), {
            insert(v, _i) {
                let t2 = (0, galho_1.div)("_ ft tb-i", [
                    (0, galho_1.div)("sd" /* side */, (0, inutil_1.t)(i.enum) ? _i + 1 : ' '),
                    cols.map(c => (0, galho_1.wrap)(c.fmt ? c.fmt({ v: v[c.key], p: i.p }, c.opts) : v[c.key]).css({ textAlign: c.align, width: c.size + 'px' })),
                    opts && opts.map((opt) => (0, galho_1.wrap)(opt.item(v, _i), "opt"))
                ]).d(v);
                i.style?.(t2, v, _i);
                return t2;
            },
            tag(s, active) {
                s.cls("crt" /* current */, active).e.scrollIntoView({
                    block: "nearest",
                    inline: "nearest"
                });
            },
            groups: { on: (s, active) => s.cls("on", active) }
        }), ft = i.foot && new galho_1.M(...i.foot?.map(value => (0, galho_1.g)(value(cols), "_ ft tb-i")));
        return (0, inutil_1.call)((0, galho_1.div)((0, galho_1.cl)("_", "tb", i.fill && "fill")), s => {
            s
                .prop('tabIndex', 0)
                .add([
                (0, orray_1.bind)(cols, (0, galho_1.div)("hd tb-i", [
                    (0, galho_1.wrap)(i.corner).cls(["sd" /* side */, "i" /* item */]),
                    opts && opts.map((opt) => (0, galho_1.div)(null, opt.head))
                ]), {
                    insert: (c, _i, p) => {
                        let s = (0, galho_1.wrap)(i.head(c), "i" /* item */).css({ textAlign: c.align, width: c.size + 'px' });
                        if (i.resize)
                            (0, galho_1.div)(["div" /* separator */]).addTo(s).on('mousedown', e => {
                                (0, galho_1.clearEvent)(e);
                                let index = cols.indexOf(c) + 1, 
                                //t = '.' + C.item + ':nth-child(' + (index + 2) + ')',
                                rows = bd.childs().child(index);
                                ft && rows.push(...ft.child(index));
                                rows.push(s.e);
                                galhui_js_1.body.css({ cursor: 'col-resize', userSelect: "none" });
                                function move(e) {
                                    c.size = (c.size = Math.max(galhui_js_1.$.rem * 3, e.clientX - s.rect().left));
                                    rows.css({ width: c.size + 'px' });
                                }
                                galhui_js_1.doc
                                    .on('mousemove', move)
                                    .on('mouseup', () => {
                                    galhui_js_1.doc.off('mousemove', move);
                                    galhui_js_1.body.uncss(["cursor", "userSelect"]);
                                }, { once: true });
                            });
                        i.sort && s.on("click", e => {
                            let sort = cols.g["sort"];
                            if (e.altKey)
                                sort.remove(c);
                            else {
                                // if (!md.sort.multiple && !e.ctrlKey)
                                //   g_clear(sort);
                                if (sort.includes(c))
                                    if (c.desc) {
                                        sort.remove(c);
                                        delete c.desc;
                                    }
                                    else {
                                        c.desc = true;
                                        sort.reload(c);
                                    }
                                else
                                    sort.push(c);
                            }
                        });
                        headerOptions && s.on({
                            mouseenter() {
                                s.add(headerOptions);
                            },
                            mouseleave() {
                                headerOptions.remove();
                            }
                        });
                        p.place(_i + 1, s);
                    },
                    tag(s, active, tag) { s.cls(tag, active); },
                    groups: {
                        sort(s, active, v, _, _i, p) {
                            s = p.child(_i + 1);
                            s.child(".sort").try(e => e.remove());
                            if (active)
                                s.add((0, galhui_js_1.icon)("sort-" + (v.desc ? 'desc' : 'asc')).cls("sort"));
                            i.sort.call(v, active);
                        }
                    },
                    remove(_, _i, p) { p.unplace(_i + 1); },
                    clear(p) { p.childs(1).remove(); }
                }), bd, ft
            ])
                .on({
                keydown(e) {
                    if (!(0, list_js_1.kbHandler)(data, e, i))
                        switch (e.key) {
                            case "ArrowUp":
                                (0, list_js_1.kbHTp)(data, -1, e);
                                break;
                            case "ArrowDown":
                                (0, list_js_1.kbHTp)(data, 1, e);
                                break;
                            default:
                                return;
                        }
                    (0, galho_1.clearEvent)(e);
                },
                scroll(e) {
                    let l = this.scrollLeft;
                    bd.prop("scrollLeft", l).css("left", l + "px");
                }
            });
            i.resize && s.cls("brd" /* bordered */);
        });
    }
    /**rendered data */
    rData() {
        return _rData((0, galho_1.g)(this).child('.bd'), this.columns);
    }
}
exports.default = Table;
/**rendered data */
function _rData(p, cols) {
    let r = [];
    p.childs().do((s, i) => {
        let t = r[i] = {}, cells = s.childs();
        for (let j = 0; j < (0, inutil_1.l)(cols); j++)
            t[cols[j].key] = (0, galho_1.g)(cells[j + 1]).text();
    });
    return r;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBbUU7QUFDbkUsbUNBQWtEO0FBQ2xELGlDQUF5RjtBQUN6RiwrQ0FBeUM7QUFDekMsMkNBQW9EO0FBQ3BELHVDQUF3RztBQUN4Ryx1Q0FBbUM7QUFPbkMsU0FBUyxVQUFVLENBQUMsS0FBdUIsRUFBRSxLQUFlO0lBQzFELElBQ0UsSUFBSSxHQUFHLENBQUMsRUFDUixDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFDaEIsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNiLEtBQUssSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFO1FBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDZixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRTtZQUNyQixDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQ0osSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNkLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksSUFBSSxDQUFDLENBQUM7S0FDWDtJQUNELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzVDLElBQUksS0FBSztRQUNQLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3hCLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlCLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFDWSxRQUFBLE9BQU8sR0FBRyxNQUFN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