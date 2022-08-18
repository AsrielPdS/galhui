"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tip = exports.ctx = exports.popup = exports.fixed = exports.fixedMenu = exports.fluid = exports.error = exports.ok = exports.yesNo = exports.okCancel = exports.headBody = exports.fromPanel = exports.addClose = exports.mapButtons = exports.closeModal = exports.openBody = exports.openModal = exports.modalBody = exports.modal = void 0;
const galho_1 = require("galho");
const inutil_1 = require("inutil");
const galhui_js_1 = require("./galhui.js");
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
        (0, inutil_1.t)(i.close) && (0, galhui_js_1.close)(() => closeModal(md)),
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
        md.area = (0, galho_1.div)((0, galhui_js_1.hc)("mda" /* modalArea */), md.body).addTo(galhui_js_1.body);
        md.blur && md.area.prop("tabIndex", 0).on("focus", () => closeModal(md));
    }
    return md;
}
exports.openModal = openModal;
/**define a body and show modal */
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
    md.body.child(".ft").childs('[type="button"],[type="submit"]')
        .eachS(bt => bt.on("click", e => { e.preventDefault(); closeModal(md, bt.d()); }));
    return md;
}
exports.mapButtons = mapButtons;
function addClose(md) {
    md.body.add((0, galhui_js_1.close)(() => closeModal(md)));
    return md;
}
exports.addClose = addClose;
function fromPanel(panel, i = {}) {
    let md = modal(i);
    md.body = (0, galho_1.g)(panel, "_ modal panel");
    return openModal(mapButtons(addClose(md)));
}
exports.fromPanel = fromPanel;
const headBody = (i, title, bd) => [
    (0, galho_1.div)("hd", [(0, galhui_js_1.icon)(i), title]),
    (0, galho_1.wrap)(bd, "bd"),
];
exports.headBody = headBody;
function okCancel(body, valid) {
    return openBody(modal({ valid: valid && (v => !v || valid()) }), body, [(0, galhui_js_1.confirm)().d(true), (0, galhui_js_1.cancel)()]);
}
exports.okCancel = okCancel;
function yesNo(body, valid) {
    return openBody(modal({ valid: valid && (v => !v || valid()) }), body, [(0, galhui_js_1.positive)(null, galhui_js_1.w.yes).d(true), (0, galhui_js_1.negative)(null, galhui_js_1.w.no)]);
}
exports.yesNo = yesNo;
function ok(msg) {
    return openBody(modal(), msg, [(0, galhui_js_1.confirm)()]);
}
exports.ok = ok;
function error(msg) {
    return openBody(modal(), msg, [(0, galhui_js_1.confirm)()], { cls: "_e" /* error */ });
}
exports.error = error;
/**dropdown with width>=base.width  */
function fluid({ left: l, right: r, bottom: b, top: t, width: w, height: h }, menu, vAlign, hAlign, sub) {
    let wh = window.innerHeight, ww = window.innerWidth;
    if (!vAlign)
        vAlign = (t + h / 2) > (wh / 2) ? "t" /* top */ : "b" /* bottom */;
    if (!hAlign)
        hAlign = (l + w / 2) > (ww / 2) ? "l" /* left */ : "r" /* right */;
    menu.css('minWidth', w + 'px');
    if (vAlign == "t" /* top */) {
        menu
            .uncss(['top'])
            .css({
            bottom: (wh - (sub ? b : t)) + 'px',
            maxHeight: (sub ? b : t) + 'px'
        })
            .cls("b" /* bottom */, false);
    }
    else {
        menu
            .uncss(['bottom'])
            .css({
            top: (sub ? t : b) + 'px',
            maxHeight: (wh - (sub ? t : b)) + 'px'
        })
            .cls("t" /* top */, false);
    }
    if (hAlign == "l" /* left */) {
        menu
            .uncss(['left'])
            .css('right', (ww - (sub ? l : r)) + 'px')
            .cls("r" /* right */, false);
    }
    else {
        menu
            .uncss(['right'])
            .css('left', (sub ? r : l) + 'px')
            .cls("l" /* left */, false);
    }
    menu.cls([vAlign, hAlign]);
}
exports.fluid = fluid;
/**dropdown with width=base.width  */
function fixedMenu(base, menu, align) {
    base.cls(["t" /* top */, "b" /* bottom */], false).cls(fixed(base.rect(), menu, align));
}
exports.fixedMenu = fixedMenu;
function fixed({ left: l, bottom: b, top: t, width: w }, menu, align) {
    let wh = window.innerHeight;
    menu.css('width', w + 'px');
    if (wh / 2 - t > 0) {
        menu.css({
            left: l + 'px',
            top: b + 'px',
            maxHeight: (wh - b) + 'px'
        }).uncss(['bottom']);
        return "b" /* bottom */;
    }
    menu.css({
        left: l + 'px',
        bottom: (wh - t) + 'px',
        maxHeight: t + 'px'
    }).uncss(['top']);
    return "t" /* top */;
}
exports.fixed = fixed;
function popup(div, e) {
    let last = (0, galho_1.active)(), ctx = div.prop("tabIndex", 0), 
    // isOut: bool,
    wheelHandler = (e) => (0, galho_1.clearEvent)(e);
    ctx.queryAll('button').on('click', function () { last.valid ? last.focus() : this.blur(); });
    ctx.on({
        focusout: (e) => ctx.contains(e.relatedTarget) || (ctx.remove() && galhui_js_1.body.off("wheel", wheelHandler)),
        keydown(e) {
            if (e.key == "Escape") {
                e.stopPropagation();
                ctx.blur();
            }
        }
    }).addTo(galhui_js_1.body).focus();
    // .css({
    //   left: opts.clientX + 'px',
    //   top: opts.clientY + 'px'
    // })
    requestAnimationFrame(function _() {
        fluid(e(), ctx);
        if (galhui_js_1.body.contains(ctx))
            requestAnimationFrame(_);
    });
    galhui_js_1.body.on("wheel", wheelHandler, { passive: false });
}
exports.popup = popup;
/**context menu */
function ctx(e, data) {
    (0, galho_1.clearEvent)(e);
    popup((0, galho_1.div)("_ menu", (0, galho_1.g)("table", 0, data)), () => new DOMRect(e.clientX, e.clientY, 0, 0));
}
exports.ctx = ctx;
function tip(root, div, vAlign, hAlign) {
    div = (0, galho_1.wrap)(div).cls("_ tip");
    return root?.on({
        mouseenter() {
            galhui_js_1.body.add(div);
            requestAnimationFrame(function _() {
                fluid(root.rect(), div, vAlign, hAlign);
                if (galhui_js_1.body.contains(div))
                    requestAnimationFrame(_);
            });
        },
        mouseleave() { div.remove(); }
    });
}
exports.tip = tip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG92ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBZ0Y7QUFDaEYsbUNBQStCO0FBQy9CLDJDQUF1STtBQW9Cdkksb0JBQW9CO0FBQ3BCLFNBQWdCLEtBQUssQ0FBVSxJQUFlLEVBQUU7SUFDOUMsSUFBSSxPQUFZLEVBQUUsQ0FBQyxHQUFHLElBQUEsV0FBRSxFQUFDLElBQUksT0FBTyxDQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBQ2YsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBSkQsc0JBSUM7QUFDRCxTQUFnQixTQUFTLENBQUksRUFBWSxFQUFFLEVBQU8sRUFBRSxPQUFhLEVBQUUsSUFBVyxFQUFFO0lBQzlFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsSUFBQSxTQUFDLEVBQUMsTUFBTSxFQUFFLElBQUEsVUFBRSxFQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDOUMsSUFBQSxZQUFJLEVBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztRQUNkLElBQUEsVUFBQyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFBLGlCQUFPLEVBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLE9BQU8sSUFBSSxJQUFBLFdBQUcsbUJBQVMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyxD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