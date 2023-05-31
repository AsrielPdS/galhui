import { cl, div, g, isE, S, svg, toSVG } from "galho";
import { call, isA, isN, isP, isS } from "galho/util.js";
import { uuid } from "./util.js";
/**settings */
export const $ = {
    // c: "_",
    delay: 500,
    rem: 14
};
/**words */
export const w = {};
export function word(key) { return key; }
export function sentence(format) {
    const exp = /\{\w+\}/;
    format.replace(exp, (v) => w[v.slice(1, v.length - 1)]);
}
export const body = new S(document.body);
export const doc = new S(document);
/**css class */
export const cc = (...cls) => `._.${cls.join('-')}`;
/**html class */
export const hc = (...cls) => ['_', cls.join('-')];
export function icon(d, s) {
    if (d) {
        if (isS(d))
            d = { d };
        else if (isE(d))
            return d.c(cl("c" /* C.icon */, s));
        return svg('svg', {
            fill: d.c || "currentColor",
            viewBox: $.is || "0 0 24 24",
        }, svg('path', { d: d.d })).c(cl("c" /* C.icon */, s));
    }
}
export const label = (v, cls) => v && ((isS(v) ? div(0, v) : isA(v) ? div(0, [icon(v[0]), v[1]]) : g(v)))?.c(cls);
export const bt = (text, click, type = "button") => g("button", "_ bt", text).p("type", type).on("click", click);
export const link = (text, href) => g("a", ["_", "lk" /* C.link */], text).p("href", href);
/** button with icon */
export const ibt = (i, text, click, type = "button") => g("button", "_ bt", [icon(i), text])
    .p("type", type)
    .c("c" /* C.icon */, !text).on("click", click);
/** @deprecated */
export const ibutton = ibt;
export const positive = (i, text, click, type) => ibt(i, text, click, type).c("_a" /* Color.accept */);
export const negative = (i, text, click, type) => ibt(i, text, click, type).c("_e" /* Color.error */);
/** link with icon */
export const ilink = (i, text, href) => g("a", "lk" /* C.link */, [icon(i), text]).p("href", href);
/**close button */
export const close = (click) => div(hc("cl" /* C.close */), icon($.i.close)).on("click", click);
/**cancel button */
export const cancel = (click) => negative($.i.cancel, w.cancel, click);
/**confirm button */
export const confirm = (click) => positive(null, w.confirm, click, "submit");
export const buttons = (...buttons) => div("bs" /* C.buttons */, buttons);
export const img = (src, cls) => g("img", cls).p("src", src);
export const a = (href, content, cls) => g("a", cls, content).p("href", href);
export const hr = (cls) => g("hr", cls);
export function logo(v) {
    if (v)
        if (isS(v)) {
            switch (v[0]) {
                case ".":
                case "/":
                    return img(v).c("c" /* C.icon */);
                case "<":
                    return toSVG(v).c("c" /* C.icon */);
            }
        }
        else
            return icon(v);
}
export function fluid({ x, y, right: r, bottom: b }, menu, [o, side, main]) {
    /*m:main,s:side */
    let { innerHeight: wh, innerWidth: ww } = window, { width: mw, height: mh } = menu.rect, h = o == "h", e = $.rem * .4, [ws, wm, ms, mm, s0, m0, s1, m1] = h ? [wh, ww, mh, mw, y, x, b, r] : [ww, wh, mw, mh, x, y, r, b];
    main ||= (m0 + (m1 - m0) / 2) > (wm / 2) ? "s" : "e";
    menu
        .css({
        ["max" + (h ? "Width" : "Height")]: (main == "e" ? wm - m1 : m0) - e * 2 + "px",
        [h ? "left" : "top"]: (main == "e" ? m1 + e : Math.max(0, m0 - mm) - e) + "px",
        [h ? "top" : "left"]: Math.max(0, Math.min(ws - ms, side == "s" ? s1 - ms : side == "e" ? s0 : s0 + (s1 - s0) / 2 - ms / 2)) + "px",
    });
}
export function menu(items) { return div("_ menu", g("table", 0, items)); }
/**menu item */
export const menuitem = (i, text, action, side, disabled) => g("tr", "i" + (disabled ? " " + "ds" /* C.disabled */ : ""), [
    g("td", 0, icon(i)),
    g("td", 0, text),
    g("td", "sd" /* C.side */, side),
    g("td")
]).on("click", !disabled && action);
/**checkbox */
export function menucb(checked, text, toggle, id = uuid(4), disabled) {
    let input = g("input", { id, checked, disabled, indeterminate: checked == null, type: "checkbox" });
    toggle && input.on("input", () => toggle.call(input, input.e.checked));
    return g("tr", ["i", disabled && "ds" /* C.disabled */], [
        g("td", 0, input.on("click", e => e.stopPropagation())),
        g("td", 0, g("label", 0, text).p("htmlFor", id)),
        g("td"), g("td")
    ]);
}
export const menuwait = (callback) => call(g("tr", 0, g("td", 0, wait(1 /* WaitType.out */)).p("colSpan", 4)), tr => waiter(tr, callback));
export const submenu = (i, text, items) => call(g("tr", "i", [
    g("td", 0, icon(i)),
    g("td", 0, text),
    g("td"),
    g("td", 0, icon("menuR"))
]), e => {
    let mn;
    e.on("click", () => {
        e.tcls("on" /* C.on */).is('.' + "on" /* C.on */) ?
            fluid(e.rect, (mn ||= g("table", "menu" /* C.menu */, items)).addTo(e), "h") :
            mn.remove();
    });
});
export const menusep = () => g("tr", "_ hr");
/** */
export const menubar = (...items) => div("_ bar", items);
/** */
export const right = () => div("r" /* HAlign.right */);
export const mbitem = (i, text, action) => g("button", "i", [icon(i), text]).on("click", action);
/**menubar separator */
export const mbsep = () => g("hr");
/**menubar checkbox */
export function barcb(checked, text, toggle, disabled) {
    let input = g("input", { checked, disabled, indeterminate: checked == null, type: "checkbox" });
    toggle && input.on("input", () => toggle.call(input, input.e.checked));
    return g("label", ["i", disabled && "ds" /* C.disabled */], [input, text]);
}
/**place holder */
export function ph(type = 1 /* WaitType.out */) {
    switch (type) {
        case 0 /* WaitType.inline */:
        case 1 /* WaitType.out */:
            return div("ld" /* C.loading */, [
            //icon({ /*s: size, */d: `loading ${C.centered}` }),
            //icon({ /*s: size, */d: `loading ${C.itemA} ${C.centered}` }),
            ]);
    }
}
export function waiter(element, cb) {
    cb && (isP(cb) ? cb : cb?.()).then(t => {
        if (t instanceof S) {
            t.c(Array.from(element.e.classList).slice(1));
            t.attr("style", (t.attr("style") || "") +
                (element.attr("style") || ""));
        }
        element.replace(t);
    });
}
export function wait(type, body) {
    if (!isN(type)) {
        body = type;
        type = 0 /* WaitType.inline */;
    }
    let loader = ph(type);
    waiter(loader, body);
    return loader;
}
//todo: colocar no galhui
export const loading = (sz = "n" /* Size.n */) => div("_ blank", div("_ load " + sz));
export async function busy(container, cb, sz) {
    let e = loading(sz), p;
    let t = setTimeout(() => {
        p = container.add(e).css("position");
        container.css({ position: "relative" });
    }, 750);
    let close = () => {
        e.remove();
        clearTimeout(t);
        container?.css({ position: p });
    };
    try {
        await cb(close);
    }
    finally {
        close();
    }
}
export const blobToBase64 = (v) => new Promise((rs, rj) => {
    var reader = new FileReader();
    reader.readAsDataURL(v);
    reader.onloadend = () => rs(reader.result);
    reader.onerror = rj;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsaHVpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2FsaHVpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBUyxHQUFHLEVBQWUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQVEsTUFBTSxPQUFPLENBQUM7QUFDN0YsT0FBTyxFQUFRLElBQUksRUFBMkIsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQ25HLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFnSGpDLGNBQWM7QUFDZCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQXFCO0lBQ2pDLFVBQVU7SUFDVixLQUFLLEVBQUUsR0FBRztJQUNWLEdBQUcsRUFBRSxFQUFFO0NBQ1IsQ0FBQTtBQUNELFdBQVc7QUFDWCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQWtCLEVBQUUsQ0FBQTtBQUlsQyxNQUFNLFVBQVUsSUFBSSxDQUFDLEdBQVEsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDOUMsTUFBTSxVQUFVLFFBQVEsQ0FBQyxNQUFXO0lBQ2xDLE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQztJQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFzQ0QsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsUUFBZSxDQUFDLENBQUM7QUFFMUMsZUFBZTtBQUNm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QUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFhLEVBQUUsSUFBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQWE7SUFDbEcsa0JBQWtCO0lBQ2xCLElBQ0UsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsR0FBRyxNQUFNLEVBQzVDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksRUFDckMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQ1osQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUNkLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JHLElBQUksS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDckQsSUFBSTtTQUNELEdBQUcsQ0FBQztRQUNILENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUk7UUFDL0UsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSTtRQUM5RSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUk7S0FDcEksQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUlELE1BQU0sVUFBVSxJQUFJLENBQUMsS0FBaUIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFdkYsZUFBZTtBQUNmLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQU8sRUFBRSxJQUFTLEVBQUUsTUFBYyxFQUFFLElBQVUsRUFBRSxRQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsUUFB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