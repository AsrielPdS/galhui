"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tab = exports.list = exports.kbHandler = exports.kbHTp = exports.crudHandler = exports.defRenderer = void 0;
const galho_1 = require("galho");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
const selector_1 = require("orray/selector");
const galhui_1 = require("./galhui");
const hover_1 = require("./hover");
exports.defRenderer = {
    null: () => (0, galho_1.div)(0, galhui_1.$.null),
    invalidIcon: () => (0, galhui_1.icon)('image-broken'),
    checkboxFmt: "icon",
    html: true,
    interactive: true,
    format: true,
    dateFmt: "d",
    timeFmt: "t",
    numberFmt: "0,0.00"
};
function crudHandler(p, dt, cls, i) {
    let focus = ({ currentTarget: ct, target: t, ctrlKey: ctrl, shiftKey: shift }) => {
        if (ct == t)
            (0, selector_1.clear)(dt, "on");
        else
            (0, selector_1.add)(dt, "on", (0, galho_1.g)(t).closest('.' + cls).d(), (0, selector_1.tp)(ctrl, shift));
    };
    return p.on({
        click: focus,
        dblclick: i.open && (() => i.open(...(0, selector_1.list)(dt, "on"))),
        contextmenu: i.menu && ((e) => {
            focus(e);
            let t = i.menu(...(0, selector_1.list)(dt, "on"));
            if (t)
                (0, hover_1.ctx)(e, t);
        })
    });
}
exports.crudHandler = crudHandler;
const kbHTp = (dt, dist, { ctrlKey: ctrl, shiftKey: shift }) => shift ? (0, selector_1.move)(dt, "on", dist, (0, selector_1.tp)(ctrl, false)) :
    ctrl ? (0, selector_1.movePivot)(dt, "on", dist) :
        (0, selector_1.move)(dt, "on", dist, 0 /* set */);
exports.kbHTp = kbHTp;
function kbHandler(dt, e, i) {
    switch (e.key) {
        case "Delete":
            let t = (0, selector_1.list)(dt, "on");
            if (t.length && i.remove) {
                (async () => {
                    if ((await i.remove(...t)) !== false)
                        for (let i of t)
                            (0, orray_1.remove)(dt, i);
                })();
            }
            else
                return;
            break;
        case "Home":
            (0, exports.kbHTp)(dt, -(0, selector_1.pivot)(dt, "on"), e);
            break;
        case "End":
            (0, exports.kbHTp)(dt, dt.length - (0, selector_1.pivot)(dt, "on"), e);
            break;
        case "PageDown":
            (0, exports.kbHTp)(dt, 10, e);
            break;
        case "PageUp":
            (0, exports.kbHTp)(dt, -10, e);
            break;
        case "Enter":
            if (i.open) {
                i.open(...(0, selector_1.list)(dt, "on"));
                break;
            }
            else
                return;
        default:
            return;
    }
    return true;
}
exports.kbHandler = kbHandler;
function list(i, data) {
    let dt = (0, orray_1.extend)(data, {
        g: i.single ? null : ["on"],
        clear: true, key: i.key
    }), 
    // opts = i.options,
    e = (0, inutil_1.t)(i.enumarate);
    return (0, galho_1.g)("table", "_ list", [
        i.head,
        (0, orray_1.bind)(dt, crudHandler((0, galho_1.g)("tbody"), dt, "i", i), {
            insert(value, index) {
                let item = (0, galho_1.g)("tr", "i", [
                    (0, galho_1.g)("td", "sd" /* side */, e ? index + 1 : ' ').css('flexBasis', `${galhui_1.$.rem * 2.5}px`),
                    ...(0, inutil_1.arr)(i.item(value)),
                    // wrap().cls([C.body])
                    // opts && div([C.extra], opts.map((fn) => fn && fn(value, index)))
                    //   .on('dblclick', (e) => { e.stopPropagation(); })
                ]).d(value);
                return item;
            },
            tag(s, active) {
                s.cls("crt" /* current */, active).e.scrollIntoView({
                    block: "nearest",
                    inline: "nearest"
                });
                if (i.single)
                    s.cls("on", active);
            },
            groups(s, on, _, key) { s.cls(key, on); }
        }),
        i.foot && (0, galho_1.g)("tfoot", 0, i.foot)
    ]);
}
exports.list = list;
const tab = (items, removeble, empty) => (0, galho_1.div)(["ta" /* tab */], [
    (0, orray_1.bind)(items, (0, galho_1.div)(["bar" /* menubar */]), {
        tag: (v, a) => v.cls("on" /* on */, a),
        insert: value => (0, galho_1.div)("i" /* item */, [
            (0, galhui_1.icon)(value.icon),
            value.text,
            removeble && (0, galhui_1.close)(e => { (0, galho_1.clearEvent)(e); (0, orray_1.remove)(items, value); })
        ]).on('click', () => (0, orray_1.setTag)(items, "on", value))
    }),
    (0, inutil_1.call)((0, galho_1.div)("bd" /* body */), bd => {
        let cb = (v) => {
            bd.attr("id", false).uncls();
            if (v) {
                bd.set((0, inutil_1.isF)(v.body) ? (v.body = v.body(v)) : v.body);
                v.focus?.(bd, true);
            }
            else
                bd.set(empty?.());
        };
        (0, orray_1.ontag)(items, "on" /* on */, cb);
        cb((0, orray_1.getTag)(items, "on" /* on */)?.value);
    }),
]);
exports.tab = tab;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXlEO0FBQ3pELG1DQUEyQztBQUMzQyxpQ0FBdUU7QUFDdkUsNkNBQWlNO0FBQ2pNLHFDQUEwRDtBQUMxRCxtQ0FBOEI7QUFpRGpCLFFBQUEsV0FBVyxHQUFrQjtJQUN4QyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxXQUFHLEVBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxJQUFJLENBQUM7SUFDMUIsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUEsYUFBSSxFQUFDLGNBQWMsQ0FBQztJQUN2QyxXQUFXLEVBQUUsTUFBTTtJQUNuQixJQUFJLEVBQUUsSUFBSTtJQUNWLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLE1BQU0sRUFBRSxJQUFJO0lBQ1osT0FBTyxFQUFFLEdBQUc7SUFDWixPQUFPLEVBQUUsR0FBRztJQUNaLFNBQVMsRUFBRSxRQUFRO0NBQ3BCLENBQUE7QUFJRCxTQUFnQixXQUFXLENBQUksQ0FBSSxFQUFFLEVBQVEsRUFBRSxHQUFRLEVBQUUsQ0FBVztJQUNsRSxJQUNFLEtBQUssR0FBRyxDQUFDLEVBQUUsYUFBYSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBYyxFQUFFLEVBQUU7UUFDdkYsSUFBSSxFQUFFLElBQUksQ0FBQztZQUNULElBQUEsZ0JBQWMsRUFBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7O1lBQ3RCLElBQUEsY0FBWSxFQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBQSxTQUFDLEVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFBLGFBQWEsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNo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