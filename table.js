"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const galho_1 = require("galho");
const m_1 = require("galho/m");
const s_1 = require("galho/s");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
const galhui_1 = require("./galhui");
const list_1 = require("./list");
const menu_1 = require("./menu");
const wait_1 = require("./wait");
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
class Table extends galho_1.E {
    // get data() { return this.i.data as L<T>; }
    get footData() { return this.i.footData; }
    get columns() { return this.i.columns; }
    data;
    constructor(i, data) {
        // i.data = data as L;
        super(i);
        this.data = (0, orray_1.extend)(data, {
            g: i.single ? null : ["on"],
            key: i.key,
            clear: true
        });
        if (i.foot)
            i.footData = (0, orray_1.extend)(i.footData, {
                key: i.key,
                clear: true
            });
        let delayIndex;
        i.columns = (0, orray_1.create)(i.columns, { g: i.sort && ["sort"] }).onupdate(() => {
            delayIndex = (0, inutil_1.delay)(delayIndex, () => {
                (0, orray_1.reloadAll)(this.data);
                i.foot && (0, orray_1.reloadAll)(i.footData);
            });
        });
        if (!i.head)
            i.head = (c) => c.text;
    }
    head;
    body;
    foot;
    view() {
        let i = this.i, cols = i.columns, all = i.allColumns, opts = i.options && (0, inutil_1.valid)(i.options), data = this.data, insert = (value, j, e, foot) => {
            let r, side = (0, galho_1.div)("i" /* item */, e ? j + 1 : ' ').cls("sd" /* side */);
            (async () => {
                for (var t = Array(), k = 0; k < cols.length; k++) {
                    let c = cols[k], v = value[c.key];
                    if (c.fmt)
                        v = await c.fmt({ v, p: i.p }, c.opts);
                    t[k] = (0, galho_1.wrap)(v, "i").css({ textAlign: c.align, width: c.size + 'px' });
                }
                let t2 = (0, galho_1.div)((0, galhui_1.hc)("tb" /* table */, "i" /* item */), [
                    side, t,
                    opts && opts.map((opt) => (!foot || opt.foot) && (0, galho_1.wrap)((foot ? opt.foot : opt.item)(value, j), 'td').on('dblclick', (e) => { e.stopPropagation(); }))
                ]).d(value);
                i.style && i.style(t2, value, j);
                r ? r.replace(t2) : r = t2;
            })();
            return r ||= (0, wait_1.wait)().add(side);
        }, headerOptions = all && (0, galhui_1.dropdown)(null, all.map(c => (0, menu_1.cb)(cols.includes(c), c.text, (v) => {
            if (v) {
                cols.push(c);
                (0, orray_1.sort)(cols, (a, b) => all.indexOf(a) - all.indexOf(b));
            }
            else
                (0, orray_1.remove)(cols, c);
        }))).on("click", e => e.stopPropagation()), bd = (0, orray_1.bind)(data, (0, list_1.crudHandler)((0, galho_1.div)("bd"), data, "tb-i", i), {
            insert: (value, index) => insert(value, index, (0, inutil_1.t)(i.enumarate)),
            tag(s, active) {
                s.cls("crt" /* current */, active).e.scrollIntoView({
                    block: "nearest",
                    inline: "nearest"
                });
            },
            groups: { on: (s, active) => s.cls("on", active) }
        });
        return (0, inutil_1.call)((0, galho_1.div)((0, galhui_1.hc)("tb" /* table */)), s => {
            s
                .prop('tabIndex', 0)
                .add([
                (0, orray_1.bind)(cols, this.head = (0, galho_1.div)(["hd" /* head */], [
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
                                rows = this.body.childs().child(index);
                                this.foot && rows.push(...this.foot.childs().child(index));
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
                }),
                this.body = bd,
                this.foot = i.foot && (0, orray_1.bind)(i.footData, (0, galho_1.g)('tfoot'), {
                    insert(value, index) {
                        return insert(value, index, false, true);
                    }
                })
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
    _rData(p) {
        let cols = this.i.columns, r = Array(cols.length);
        (0, m_1.each)(p.childs(), (s, i) => {
            let t = r[i] = {}, cells = s.childs();
            for (let j = 0; j < cols.length; j++)
                t[cols[j].key] = (0, galho_1.g)(cells[j + 1]).text();
        });
        return r;
    }
    renderedData() {
        return this._rData(this.body);
    }
    renderedFoot() {
        return this._rData(this.foot);
    }
}
exports.default = Table;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUE0RDtBQUM1RCwrQkFBeUM7QUFDekMsK0JBQStCO0FBQy9CLG1DQUErQztBQUMvQyxpQ0FBeUY7QUFDekYscUNBQStEO0FBQy9ELGlDQUFxRztBQUNyRyxpQ0FBNEI7QUFDNUIsaUNBQThCO0FBTzlCLFNBQVMsVUFBVSxDQUFDLEtBQXVCLEVBQUUsS0FBZTtJQUMxRCxJQUNFLElBQUksR0FBRyxDQUFDLEVBQ1IsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQ2hCLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDYixLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRTtRQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2YsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7WUFDckIsQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUNKLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDZCxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLElBQUksQ0FBQyxDQUFDO0tBQ1g7SUFDRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM1QyxJQUFJLEtBQUs7UUFDUCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN4QixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFD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