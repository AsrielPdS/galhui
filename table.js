"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const galho_1 = require("galho");
const m_1 = require("galho/m");
const s_1 = require("galho/s");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
const dropdown_1 = require("./dropdown");
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
        }, headerOptions = all && (0, dropdown_1.dropdown)(null, all.map(c => (0, menu_1.menucb)(cols.includes(c), c.text, (v) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUE0RDtBQUM1RCwrQkFBeUM7QUFDekMsK0JBQStCO0FBQy9CLG1DQUErQztBQUMvQyxpQ0FBeUY7QUFDekYseUNBQXNDO0FBQ3RDLHFDQUFxRDtBQUNyRCxpQ0FBcUc7QUFDckcsaUNBQWdDO0FBQ2hDLGlDQUE4QjtBQU85QixTQUFTLFVBQVUsQ0FBQyxLQUF1QixFQUFFLEtBQWU7SUFDMUQsSUFDRSxJQUFJLEdBQUcsQ0FBQyxFQUNSLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUNoQixLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2IsS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUU7UUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNmLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFO1lBQ3JCLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDSixJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2QsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxJQUFJLENBQUMsQ0FBQztLQUNYO0lBQ0QsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDNUMsSUFBSSxLQUFLO1FBQ1AsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDeEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUIsT0FBTyxNQUFNLENB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