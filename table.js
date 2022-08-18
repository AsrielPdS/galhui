"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editing = void 0;
const galho_1 = require("galho");
const orray_1 = require("orray");
const array_js_1 = require("./array.js");
const dropdown_js_1 = require("./dropdown.js");
const galhui_js_1 = require("./galhui.js");
const list_js_1 = require("./list.js");
const menu_js_1 = require("./menu.js");
const util_js_1 = require("./util.js");
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
        i.columns = (0, orray_1.orray)(i.columns, { g: i.sort && ["sort"] })
            .onupdate(() => delayIndex = (0, util_js_1.delay)(delayIndex, () => {
            this.data.reloadAll();
            i.foot && i.foot.reloadAll();
        }));
        if (!i.head)
            i.head = (c) => c.text;
    }
    // get data() { return this.i.data as L<T>; }
    // get footData() { return this.i.foot as L<T>; }
    get columns() { return this.i.columns; }
    view() {
        let i = this.i, cols = i.columns, all = i.allColumns, req = i.reqColumns, opts = i.options && (0, array_js_1.valid)(i.options).map(o => (0, util_js_1.isF)(o) ? { item: o } : o), data = this.data, headerOptions = all && (0, dropdown_js_1.dropdown)(null, all.map(c => {
            return (0, menu_js_1.menucb)(cols.includes(c), c.text, checked => {
                if (checked) {
                    cols.push(c);
                    cols.sort((a, b) => all.indexOf(a) - all.indexOf(b));
                }
                else
                    cols.remove(c);
            }, c.key, req && (req.includes(c.key)));
        })), bd = data.bind((0, list_js_1.crudHandler)((0, galho_1.div)("bd"), data, "tb-i", i), {
            insert(v, _i) {
                let t2 = (0, galho_1.div)("_ ft tb-i", [
                    (0, galho_1.div)("sd" /* side */, (0, util_js_1.t)(i.enum) ? _i + 1 : ' '),
                    cols.map(c => (0, galho_1.wrap)(c.fmt ? c.fmt({ v: v[c.key], p: i.p }, c.opts) : v[c.key]).css({ textAlign: c.align, width: c.size + 'px' })),
                    opts && opts.map(opt => (0, galho_1.wrap)(opt.item(v, _i), "opt"))
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
        return (0, util_js_1.call)((0, galho_1.div)((0, galho_1.cl)("_", "tb", i.fill && "fill")), s => {
            s
                .prop('tabIndex', 0)
                .add([
                cols.bind((0, galho_1.div)("hd tb-i", [
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
        for (let j = 0; j < (0, array_js_1.l)(cols); j++)
            t[cols[j].key] = (0, galho_1.g)(cells[j + 1]).text();
    });
    return r;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBbUU7QUFDbkUsaUNBQWdEO0FBQ2hELHlDQUFzQztBQUV0QywrQ0FBeUM7QUFDekMsMkNBQW9EO0FBQ3BELHVDQUF3RztBQUN4Ryx1Q0FBbUM7QUFDbkMsdUNBQWdFO0FBT2hFLFNBQVMsVUFBVSxDQUFDLEtBQXVCLEVBQUUsS0FBZTtJQUMxRCxJQUNFLElBQUksR0FBRyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQ2hCLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDYixLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRTtRQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2YsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7WUFDckIsQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUNKLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDZCxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLElBQUksQ0FBQyxDQUFDO0tBQ1g7SUFDRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM1QyxJQUFJLEtBQUs7UUFDUCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN4QixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBQ1ksUUFBQSxP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