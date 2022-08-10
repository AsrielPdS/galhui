"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accordion = exports.hidden = exports.Output = exports.tip = exports.errorMessage = exports.message = exports.keyVal = exports.output = exports.label = exports.Pagging = exports.lever = exports.search = exports.checkbox = exports.textarea = exports.input = void 0;
const galho_1 = require("galho");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
const dropdown_js_1 = require("./dropdown.js");
const galhui_js_1 = require("./galhui.js");
const menu_js_1 = require("./menu.js");
const input = (type, name, ph, input) => (0, galho_1.g)("input", { type, name, placeholder: ph }).cls((0, galhui_js_1.hc)("in" /* input */)).on("input", input);
exports.input = input;
const textarea = (name, ph, input) => (0, galho_1.g)("textarea", { name, placeholder: ph }).cls((0, galhui_js_1.hc)("in" /* input */)).on("input", input && (function () { input(this.value); }));
exports.textarea = textarea;
const checkbox = (label, input) => (0, galho_1.g)("label", (0, galhui_js_1.hc)("cb" /* checkbox */), [(0, galho_1.g)("input", { type: "checkbox" }).on("input", input && (function () { input(this.checked); })), label]);
exports.checkbox = checkbox;
function search(input) {
    let t = (0, galho_1.g)("input", { type: "search", placeholder: galhui_js_1.w.search }), i = (0, galhui_js_1.icon)(galhui_js_1.$.i.search);
    input && (0, galho_1.delay)(t, "input", galhui_js_1.$.delay, () => input(t.e.value));
    return (i ? (0, galho_1.div)(0, [t, i]) : t).cls((0, galhui_js_1.hc)("in" /* input */));
}
exports.search = search;
const lever = (name) => (0, galho_1.g)("input", { type: "checkbox", name }).cls("lv" /* lever */);
exports.lever = lever;
class Pagging extends galho_1.E {
    view() {
        let i = this.i, pags, count = (0, galho_1.g)('span'), total;
        if (i.setlimit) {
            var limits = new dropdown_js_1.Select({
                value: i.limit,
                fluid: true,
                clear: false,
            }, [
                i.minLimit,
                i.minLimit * 2,
                i.minLimit * 4,
                i.minLimit * 10,
                i.minLimit * 20,
                { key: 0, text: 'Mostrar todos' }
            ]);
            (0, galho_1.g)(limits).cls("in");
        }
        return this.bind((0, galho_1.div)("_ bar pag", [
            i.extreme && (0, menu_js_1.mbitem)(galhui_js_1.$.i.first, null, () => this.set('pag', 1)),
            (0, menu_js_1.mbitem)(galhui_js_1.$.i.prev, null, () => this.set('pag', i.pag - 1)),
            (0, exports.output)(),
            (0, menu_js_1.mbitem)(galhui_js_1.$.i.next, null, () => this.set('pag', i.pag + 1)),
            i.extreme && (0, menu_js_1.mbitem)(galhui_js_1.$.i.last, count, () => this.set('pag', pags)),
            limits && [
                (0, galho_1.g)("hr"),
                limits.on('input', (value) => { this.set('limit', value); })
            ],
            i.viewtotal && [(0, galho_1.g)("hr"), total = (0, exports.output)()]
        ]), (s) => {
            if (i.viewtotal)
                total.set(`${Math.min(i.total - i.limit * (i.pag - 1), i.limit || i.total) || 0} / ${i.total || 0}`);
            pags = i.limit ? Math.ceil((i.total || 0) / i.limit) : 1;
            s.cls("off" /* off */, !!(pags < 2 && i.hideOnSingle));
            let t = i.extreme ? 0 : 1;
            s.child(2 - t).set(i.pag);
            s.childs(0, 2 - t).prop('disabled', i.pag == 1);
            s.childs(3 - t, 5 - t * 2).prop('disabled', i.pag == pags);
            count.set(pags);
        });
    }
    get pags() {
        let { limit: l, total: t } = this.i;
        return l ? Math.ceil((t || 0) / l) : 1;
    }
}
exports.Pagging = Pagging;
//#endregion
//#region output
const label = (content) => (0, galho_1.g)("label", (0, galhui_js_1.hc)("lb" /* label */), content);
exports.label = label;
const output = (...content) => (0, galho_1.g)("span", (0, galhui_js_1.hc)("lb" /* label */), content);
exports.output = output;
const keyVal = (key, val) => (0, galho_1.g)("span", (0, galhui_js_1.hc)("in" /* input */), [key + ": ", val]);
exports.keyVal = keyVal;
const message = (c, data) => (0, galho_1.div)((0, galhui_js_1.hc)("ms" /* message */), data).cls(c);
exports.message = message;
const errorMessage = (data) => (0, exports.message)(data).cls("_e" /* error */);
exports.errorMessage = errorMessage;
const tip = (e, value) => e.prop("title", value);
exports.tip = tip;
class Output extends galho_1.E {
    constructor(text, value, fmt) {
        super((0, inutil_1.isS)(text) ? { text, value, fmt } : text);
    }
    key() { return this.i.key; }
    value(value) {
        if ((0, inutil_1.isU)(value))
            return this.i.value;
        else
            this.set('value', value);
        return this;
    }
    view() {
        let i = this.i;
        return this.bind((0, galho_1.div)(), (s) => {
            s
                .uncls().cls((0, galho_1.cl)("in" /* input */, i.color))
                .set([
                i.text, ': ',
                galhui_js_1.$.fmt(i.value, i.fmt, i.def && { def: i.def })
            ]);
        });
    }
}
exports.Output = Output;
const hidden = (head, body, open) => (0, galho_1.div)(["_", "ac" /* accordion */], [
    head = (0, galho_1.div)("hd" /* head */, [
        (0, galhui_js_1.icon)("menuR"),
        head
    ]).cls("on" /* on */, !!open).on("click", () => head.tcls("on" /* on */)),
    (0, galho_1.wrap)(body, "bd" /* body */)
]);
exports.hidden = hidden;
function accordion(items, i = {}) {
    return (0, orray_1.bind)((0, orray_1.orray)(items), (0, galho_1.div)("_ accordion"), ([hd, bd], j, p) => {
        p.place(j * 2, [
            hd = (0, galho_1.div)("hd" /* head */, [
                (0, inutil_1.t)(i.icon) && (0, galhui_js_1.icon)("menuR"),
                hd
            ]).cls("on" /* on */, i.def == j).on("click", () => {
                if (hd.is('.' + "on" /* on */))
                    hd.cls("on" /* on */, false);
                else {
                    (0, inutil_1.t)(i.single) && p.childs("." + "hd" /* head */).cls("on" /* on */, false);
                    hd.cls("on" /* on */);
                }
            }),
            (0, galho_1.wrap)(bd, "bd" /* body */)
        ]);
    });
}
exports.accordion = accordion;
//#endregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBc0Q7QUFDdEQsbUNBQXFDO0FBQ3JDLGlDQUFvQztBQUNwQywrQ0FBdUM7QUFDdkMsMkNBQWdFO0FBQ2hFLHVDQUE2QztBQU10QyxNQUFNLEtBQUssR0FBRyxDQUFDLElBQWEsRUFBRSxJQUFTLEVBQUUsRUFBUSxFQUFFLEtBQXlCLEVBQUUsRUFBRSxDQUNyRixJQUFBLFNBQUMsRUFBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGNBQUUsbUJBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFEckUsUUFBQSxLQUFLLFNBQ2dFO0FBRTNFLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBUyxFQUFFLEVBQU8sRUFBRSxLQUEyQixFQUFFLEVBQUUsQ0FDMUUsSUFBQSxTQUFDLEVBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGNBQUUsbUJBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsY0FBYyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUR6RyxRQUFBLFFBQVEsWUFDaUc7QUFFL0csTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFVLEVBQUUsS0FBK0IsRUFBRSxFQUFFLENBQ3RFLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFBLGNBQUUsc0JBQVksRUFBRSxDQUFDLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsY0FBYyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBRHZILFFBQUEsUUFBUSxZQUMrRztBQUVwSSxTQUFnQixNQUFNLENBQUMsS0FBMkI7SUFDaEQsSUFBSSxDQUFDLEdBQUcsSUFBQSxTQUFDLEVBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsYUFBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUEsZ0JBQUksRUFBQyxhQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BGLEtBQUssSUFBSSxJQUFBLGFBQUssRUFBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLGFBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM1RCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFBLFdBQUcsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUEsY0FBRSxtQkFBUyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUpELHdCQUlDO0FBQ00sTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLGtCQUFTLENBQUM7QUFBM0UsUUFBQSxLQUFLLFNBQXNFO0FBYXhGLE1BQWEsT0FBUSxTQUFRLFNBQVc7SUFDdEMsSUFBSTtRQUNGLElBQ0UsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQ1YsSUFBWSxFQUNaLEtBQUssR0FBRyxJQUFBLFNBQUMsRUFBQyxNQUFNLENBQUMsRUFDakIsS0FBUSxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ2QsSUFBSSxNQUFNLEdBQUcsSUFBSSxvQkFBTSxDQUFTO2dCQUM5QixLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUs7Z0JBQ2QsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsS0FBSyxFQUFFLEtBQUs7YUFDYixFQUFFO2dCQUNELENBQUMsQ0FBQyxRQUFRO2dCQUNWLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQztnQkFDZCxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLFFBQVEsR0FBRyxFQUFFO2dCQUNmLENBQUMsQ0FBQyxRQUFRLEdBQUcsRUFBRTtnQkFDZixFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRTthQUNsQyxDQUFDLENBQUM7WUFDSCxJQUFBLFNBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckI7UUFFRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBQSxXQUFHLEVBQUMsV0FBVyxFQUFFO1lBQ2hDLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBQSxnQkFBTSxFQUFDLGFBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFBLGdCQUFNLEVBQUMsYUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBQSxjQUFNLEdBQUU7WUFDUixJQUFBLGdCQUFNLEVBQUMsYUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFBLGdCQUFNLEVBQUMsYUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sSUFBSTtnQkFDUixJQUFBLFNBQUMsRUFBQyxJQUFJLENBQUM7Z0JBQ1AsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzdEO1lBQ0QsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUEsU0FBQyxFQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFBLGNBQU0sR0FBRSxDQUFDO1NBQzNDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ1IsSUFBSSxDQUFDLENBQUMsU0FBUztnQkFDYixLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDdEcsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELENBQUMsQ0FBQyxHQUFHLGtCQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFFN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDekIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUUxQixDQUFDLENBQUMsTUFBTSxDQUFvQixDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuRSxDQUFDLENBQUMsTUFBTSxDQUFvQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDO1lBRTlFLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0NBQ0Y7QUF0REQsMEJBc0RDO0FBQ0QsWUFBWTtBQUVaLGdCQUFnQjtBQUVULE1BQU0sS0FBSyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxJQUFBLFNBQUMsRUFBQyxPQUFPLEVBQUUsSUFBQSxjQUFFLG1CQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFBdEQsUUFBQSxLQUFLLFNBQWlEO0FBQzVELE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLElBQUEsU0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFBLGNBQUUsbUJBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUF6RCxRQUFBLE1BQU0sVUFBbUQ7QUFDL0QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFBLFNBQUMsRUFBQyxNQUFNLEVBQUUsSUFBQSxjQUFFLG1CQUFTLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFBakUsUUFBQSxNQUFNLFVBQTJEO0FBRXZFLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBUyxFQUFFLElBQUssRUFBRSxFQUFFLENBQUMsSUFBQSxXQUFHLEVBQUMsSUFBQSxjQUFFLHFCQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQWhFLFFBQUEsT0FBTyxXQUF5RDtBQUN0RSxNQUFNLFlBQVksR0FBRyxDQUFDLElBQUssRUFBRSxFQUFFLENBQUMsSUFBQSxlQUFPLEVBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxrQkFBYSxDQUFDO0FBQXpELFFBQUEsWUFBWSxnQkFBNkM7QUFDL0QsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUE5QyxRQUFBLEdBQUcsT0FBMkM7QUFZM0QsTUFBYSxNQUFvQixTQUFRLFNBQWE7SUFHcEQsWUFBWSxJQUF5QixFQUFFLEtBQVMsRUFBRSxHQUFZO1FBQzVELEtBQUssQ0FBQyxJQUFBLFlBQUcsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0QsR0FBRyxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRzVCLEtBQUssQ0FBQyxLQUFTO1FBQ2IsSUFBSSxJQUFBLFlBQUcsRUFBQyxLQUFLLENBQUM7WUFDWixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDOztZQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM3QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNmLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFBLFdBQUcsR0FBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsQ0FBQztpQkFDRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBQSxVQUFFLG9CQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDakMsR0FBRyxDQUFDO2dCQUNILENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSTtnQkFDWixhQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUMvQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTFCRCx3QkEwQkM7QUFVTSxNQUFNLE1BQU0sR0FBRyxDQUFDLElBQVMsRUFBRSxJQUFTLEVBQUUsSUFBVyxFQUFFLEVBQUUsQ0FBQyxJQUFBLFdBQUcsRUFBQyxDQUFDLEdBQUcsdUJBQWMsRUFBRTtJQUNuRixJQUFJLEdBQUcsSUFBQSxXQUFHLG1CQUFTO1FBQ2pCLElBQUEsZ0JBQUksRUFBQyxPQUFPLENBQUM7UUFDYixJQUFJO0tBQ0wsQ0FBQyxDQUFDLEdBQUcsZ0JBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUssSUFBSyxDQUFDLElBQUksZUFBTSxDQUFDO0lBQzVELElBQUEsWUFBSSxFQUFDLElBQUksa0JBQVM7Q0FDbkIsQ0FBQyxDQUFDO0FBTlUsUUFBQSxNQUFNLFVBTWhCO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLEtBQXNCLEVBQUUsSUFBZ0IsRUFBRTtJQUNsRSxPQUFPLElBQUEsWUFBSSxFQUFDLElBQUEsYUFBSyxFQUFDLEtBQUssQ0FBQyxFQUFFLElBQUEsV0FBRyxFQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9ELENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNiLEVBQUUsR0FBRyxJQUFBLFdBQUcsbUJBQVM7Z0JBQ2YsSUFBQSxVQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUEsZ0JBQUksRUFBQyxPQUFPLENBQUM7Z0JBQzFCLEVBQUU7YUFDSCxDQUFDLENBQUMsR0FBRyxnQkFBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO2dCQUN4QyxJQUFLLEVBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxnQkFBTyxDQUFDO29CQUN0QixFQUFHLENBQUMsR0FBRyxnQkFBTyxLQUFLLENBQUMsQ0FBQztxQkFDdEI7b0JBQ0gsSUFBQSxVQUFDLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxrQkFBUyxDQUFDLENBQUMsR0FBRyxnQkFBTyxLQUFLLENBQUMsQ0FBQztvQkFDbkQsRUFBRyxDQUFDLEdBQUcsZUFBTSxDQUFDO2lCQUNuQjtZQUNILENBQUMsQ0FBQztZQUNGLElBQUEsWUFBSSxFQUFDLEVBQUUsa0JBQVM7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBakJELDhCQWlCQztBQUNELFlBQVkifQ==