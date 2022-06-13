"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.ok = exports.yesNo = exports.okCancel = exports.headBody = exports.fromPanel = exports.addClose = exports.mapButtons = exports.closeModal = exports.openBody = exports.openModal = exports.modalBody = exports.modal = void 0;
const galho_1 = require("galho");
const m_1 = require("galho/m");
const s_1 = require("galho/s");
const inutil_1 = require("inutil");
const galhui_1 = require("./galhui");
function _modal(bd, actions, i = {}) {
    return new Promise(res => {
        let last = document.activeElement, _close = function () {
            let dt = this && (0, galho_1.g)(this).d();
            if (!i.valid || i.valid(dt)) {
                area.remove();
                res(dt);
                last?.focus();
            }
        }, area = (0, galho_1.div)((0, galhui_1.hc)("mda" /* modalArea */), bd = (0, galho_1.div)((0, galho_1.cl)("_ modal panel", i.cls), [
            (0, inutil_1.t)(i.close) && (0, galhui_1.close)(_close),
            (0, galho_1.wrap)(bd, "bd"),
            actions && (0, galho_1.div)("ft" /* foot */, actions.map(a => a.on('click', _close)))
        ]).d(_close).prop("tabIndex", 0).on('keydown', (e) => {
            switch (e.key) {
                case "Escape":
                    _close();
                    break;
                case "Enter":
                    actions?.[0]?.click();
                    break;
                default: return;
            }
            (0, galho_1.clearEvent)(e);
        })).addTo(galhui_1.body);
        (0, inutil_1.t)(i.blur) && (0, s_1.focusout)(bd, _close);
        bd.focus();
    });
}
//TODO remover valid
function modal(i = {}) {
    let resolve, p = (0, inutil_1.ex)(new Promise(r => resolve = r), i);
    p.cb = resolve;
    return p;
}
exports.modal = modal;
function modalBody(md, bd, actions, i = {}) {
    md.body = (0, galho_1.g)("form", (0, galho_1.cl)("_ modal panel", i.cls), [
        (0, galho_1.wrap)(bd, "bd"),
        (0, inutil_1.t)(i.close) && (0, galhui_1.close)(() => closeModal(md)),
        actions && (0, galho_1.div)("ft" /* foot */, actions.map(a => a.on('click', e => { e.preventDefault(); closeModal(md, a.d()); })))
    ]).on('keydown', (e) => {
        if (e.key == "Escape") {
            (0, galho_1.clearEvent)(e);
            closeModal(md);
        }
    });
    return md;
}
exports.modalBody = modalBody;
function openModal(md) {
    if (!md.area) {
        md.area = (0, galho_1.div)((0, galhui_1.hc)("mda" /* modalArea */), md.body).addTo(galhui_1.body);
        md.blur && md.area.prop("tabIndex", 0).on("focus", () => closeModal(md));
    }
    return md;
}
exports.openModal = openModal;
function openBody(md, bd, actions, i) {
    return openModal(modalBody(md, bd, actions, i));
}
exports.openBody = openBody;
async function closeModal(md, v) {
    if (md.area && (!md.valid || await md.valid(v))) {
        md.area.remove();
        md.cb(v);
        md.area = null;
    }
}
exports.closeModal = closeModal;
function mapButtons(md) {
    (0, m_1.each)(md.body.child(".ft").childs('[type="button"],[type="submit"]'), bt => bt.on("click", e => { e.preventDefault(); closeModal(md, bt.d()); }));
    return md;
}
exports.mapButtons = mapButtons;
function addClose(md) {
    md.body.add((0, galhui_1.close)(() => closeModal(md)));
    return md;
}
exports.addClose = addClose;
function fromPanel(panel, i = {}) {
    let md = modal(i);
    md.body = (0, galho_1.g)(panel, "_ modal panel");
    return openModal(mapButtons(addClose(md)));
}
exports.fromPanel = fromPanel;
// export class Modal<K = Key>{
//   constructor(public i: IModal<K> = {}) { }
//   area: S;
//   cb?: (value: K) => K
//   then(cb?: (value: K) => K) { md.cb = cb; }
// }
const headBody = (i, title, bd) => [
    (0, galho_1.div)("hd", [(0, galhui_1.icon)(i), title]),
    (0, galho_1.wrap)(bd, "bd"),
];
exports.headBody = headBody;
function okCancel(body, valid) {
    return openBody(modal({ valid: valid && (v => !v || valid()) }), body, [(0, galhui_1.confirm)().d(true), (0, galhui_1.cancel)()]);
}
exports.okCancel = okCancel;
function yesNo(body, valid) {
    return openBody(modal({ valid: valid && (v => !v || valid()) }), body, [(0, galhui_1.positive)(null, galhui_1.w.yes).d(true), (0, galhui_1.negative)(null, galhui_1.w.no)]);
}
exports.yesNo = yesNo;
function ok(msg) {
    return openBody(modal(), msg, [(0, galhui_1.confirm)()]);
}
exports.ok = ok;
function error(msg) {
    return openBody(modal(), msg, [(0, galhui_1.confirm)()], { cls: "_e" /* error */ });
}
exports.error = error;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtb2RhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBNkQ7QUFDN0QsK0JBQStCO0FBQy9CLCtCQUFtQztBQUNuQyxtQ0FBK0I7QUFDL0IscUNBQW9IO0FBYXBILFNBQVMsTUFBTSxDQUFDLEVBQU8sRUFBRSxPQUFhLEVBQUUsSUFBUyxFQUFFO0lBQ2pELE9BQU8sSUFBSSxPQUFPLENBQU0sR0FBRyxDQUFDLEVBQUU7UUFDNUIsSUFDRSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQTRCLEVBQzVDLE1BQU0sR0FBRztZQUNQLElBQUksRUFBRSxHQUFHLElBQUksSUFBSSxJQUFBLFNBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUMzQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2QsR0FBRyxDQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUNiLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQzthQUNmO1FBQ0gsQ0FBQyxFQUNELElBQUksR0FBRyxJQUFBLFdBQUcsRUFBQyxJQUFBLFdBQUUsd0JBQWEsRUFBRSxFQUFFLEdBQUcsSUFBQSxXQUFHLEVBQUMsSUFBQSxVQUFFLEVBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUMvRCxJQUFBLFVBQUMsRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBQSxjQUFPLEVBQUMsTUFBTSxDQUFDO1lBQzdCLElBQUEsWUFBSSxFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUM7WUFDZCxPQUFPLElBQUksSUFBQSxXQUFHLG1CQUFTLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxN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