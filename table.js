"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editing = void 0;
const galho_1 = require("galho");
const s_1 = require("galho/s");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
const dropdown_1 = require("./dropdown");
const galhui_1 = require("./galhui");
const list_1 = require("./list");
const menu_1 = require("./menu");
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
    // get data() { return this.i.data as L<T>; }
    // get footData() { return this.i.foot as L<T>; }
    get columns() { return this.i.columns; }
    data;
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
    view() {
        let i = this.i, cols = i.columns, all = i.allColumns, req = i.reqColumns, opts = i.options && (0, inutil_1.valid)(i.options), data = this.data, headerOptions = all && (0, dropdown_1.dropdown)(null, all.map(c => {
            return (0, menu_1.menucb)(cols.includes(c), c.text, checked => {
                if (checked) {
                    cols.push(c);
                    (0, orray_1.sort)(cols, (a, b) => all.indexOf(a) - all.indexOf(b));
                }
                else
                    (0, orray_1.remove)(cols, c);
            }, c.key, req && (req.includes(c.key)));
        })), bd = (0, orray_1.bind)(data, (0, list_1.crudHandler)((0, galho_1.div)("bd"), data, "tb-i", i), {
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
                                galhui_1.body.css({ cursor: 'col-resize', userSelect: "none" });
                                function move(e) {
                                    c.size = (c.size = Math.max(galhui_1.$.rem * 3, e.clientX - (0, s_1.rect)(s).left));
                                    rows.css({ width: c.size + 'px' });
                                }
                                galhui_1.doc
                                    .on('mousemove', move)
                                    .on('mouseup', () => {
                                    galhui_1.doc.off('mousemove', move);
                                    galhui_1.body.uncss(["cursor", "userSelect"]);
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
                                s.add((0, galhui_1.icon)("sort-" + (v.desc ? 'desc' : 'asc')).cls("sort"));
                            i.sort.call(v, active);
                        }
                    },
                    remove(_, _i, p) { p.unplace(_i + 1); },
                    clear(p) { p.childs(1).remove(); }
                }), bd, ft
            ])
                .on({
                keydown(e) {
                    if (!(0, list_1.kbHandler)(data, e, i))
                        switch (e.key) {
                            case "ArrowUp":
                                (0, list_1.kbHTp)(data, -1, e);
                                break;
                            case "ArrowDown":
                                (0, list_1.kbHTp)(data, 1, e);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBbUU7QUFFbkUsK0JBQStCO0FBQy9CLG1DQUFrRDtBQUNsRCxpQ0FBaUc7QUFDakcseUNBQXNDO0FBQ3RDLHFDQUFxRDtBQUNyRCxpQ0FBcUc7QUFDckcsaUNBQWdDO0FBUWhDLFNBQVMsVUFBVSxDQUFDLEtBQXVCLEVBQUUsS0FBZTtJQUMxRCxJQUNFLElBQUksR0FBRyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQ2hCLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDYixLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRTtRQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2YsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7WUFDckIsQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUNKLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDZCxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLElBQUksQ0FBQyxDQUFDO0tBQ1g7SUFDRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM1QyxJQUFJLEtBQUs7UUFDUCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN4QixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBQ1ksUUFBQSxP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