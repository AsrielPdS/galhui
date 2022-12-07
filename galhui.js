import { cl, div, g, isE, S, svg, toSVG, wrap } from "galho";
import { call, isN, isP, isS } from "galho/util.js";
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
            return d.c(cl("c" /* icon */, s));
        return svg('svg', {
            fill: d.c || "currentColor",
            viewBox: $.is || "0 0 24 24",
        }, svg('path', { d: d.d })).c(cl("c" /* icon */, s));
    }
}
export const bt = (text, click, type = "button") => g("button", "_ bt", text).p("type", type).on("click", click);
export const link = (text, href) => g("a", ["_", "lk" /* link */], text).p("href", href);
/** button with icon */
export const ibt = (i, text, click, type = "button") => g("button", "_ bt", [icon(i), text])
    .p("type", type)
    .c("c" /* icon */, !text).on("click", click);
/** @deprecated */
export const ibutton = ibt;
export const positive = (i, text, click, type) => ibt(i, text, click, type).c("_a" /* accept */);
export const negative = (i, text, click, type) => ibt(i, text, click, type).c("_e" /* error */);
/** link with icon */
export const ilink = (i, text, href) => g("a", "lk" /* link */, [icon(i), text]).p("href", href);
/**close button */
export const close = (click) => div(hc("cl" /* close */), icon($.i.close)).on("click", click);
/**cancel button */
export const cancel = (click) => negative($.i.cancel, w.cancel, click);
/**confirm button */
export const confirm = (click) => positive($.i.check, w.confirm, click, "submit");
export const buttons = (...buttons) => div("bs" /* buttons */, buttons);
export const img = (src, cls) => g("img", cls).p("src", src);
export const a = (href, content, cls) => g("a", cls, content).p("href", href);
export const hr = (cls) => g("hr", cls);
export function logo(v) {
    if (v)
        if (isS(v)) {
            switch (v[0]) {
                case ".":
                case "/":
                    return img(v).c("c" /* icon */);
                case "<":
                    return toSVG(v).c("c" /* icon */);
            }
        }
        else
            return icon(v);
}
export const panel = (hd, bd, ft) => g("section", "_ panel", [
    hd && wrap(hd, "hd", "header"),
    wrap(bd, "bd"),
    ft && wrap(ft, "ft")
]);
export function fluid({ x, y, right: r, bottom: b }, menu, [o, side, main]) {
    /*m:main,s:side */
    let { innerHeight: wh, innerWidth: ww } = window, { width: mw, height: mh } = menu.rect(), h = o == "h", e = $.rem * .4, [ws, wm, ms, mm, s0, m0, s1, m1] = h ? [wh, ww, mh, mw, y, x, b, r] : [ww, wh, mw, mh, x, y, r, b];
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
export const menuitem = (i, text, action, side) => g("tr", "i" /* item */, [
    g("td", 0, icon(i)),
    g("td", 0, text),
    g("td", "sd" /* side */, side),
    g("td")
]).on("click", action);
/**checkbox */
export function menucb(checked, text, toggle, id = uuid(4), disabled) {
    let input = g("input", { id, checked, disabled, indeterminate: checked == null, type: "checkbox" });
    toggle && input.on("input", () => toggle.call(input, input.e.checked));
    return g("tr", cl("i", disabled && "ds" /* disabled */), [
        g("td", 0, input.on("click", e => e.stopPropagation())),
        g("td", 0, g("label", 0, text).p("htmlFor", id)),
        g("td"), g("td")
    ]);
}
export const menuwait = (callback) => call(g("tr", 0, g("td", 0, wait(1 /* out */)).p("colSpan", 4)), tr => waiter(tr, callback));
export const submenu = (i, text, items) => call(g("tr", "i", [
    g("td", 0, icon(i)),
    g("td", 0, text),
    g("td"),
    g("td", 0, icon("menuR"))
]), e => {
    let mn;
    e.on("click", () => {
        e.tcls("on" /* on */).is('.' + "on" /* on */) ?
            fluid(e.rect(), (mn ||= g("table", "menu" /* menu */, items)).addTo(e), "h") :
            mn.remove();
    });
});
export const menusep = () => g("tr", "_ hr");
/** */
export const menubar = (...items) => div("_ bar", items);
/** */
export const right = () => div("r" /* right */);
export const mbitem = (i, text, action) => g("button", "i", [icon(i), text]).on("click", action);
/**menubar separator */
export const mbsep = () => g("hr");
/**menubar checkbox */
export function barcb(checked, text, toggle, disabled) {
    let input = g("input", { checked, disabled, indeterminate: checked == null, type: "checkbox" });
    toggle && input.on("input", () => toggle.call(input, input.e.checked));
    return g("label", cl("i", disabled && "ds" /* disabled */), [input, text]);
}
/**place holder */
export function ph(type = 1 /* out */) {
    switch (type) {
        case 0 /* inline */:
        case 1 /* out */:
            return div("ld" /* loading */, [
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
        type = 0 /* inline */;
    }
    let loader = ph(type);
    waiter(loader, body);
    return loader;
}
export function busy(container) {
    let e = wait(), t = setTimeout(() => {
        container.add(e);
    }, 750);
    return () => {
        e.remove();
        clearTimeout(t);
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsaHVpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2FsaHVpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBUyxHQUFHLEVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3hGLE9BQU8sRUFBUSxJQUFJLEVBQTJCLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7QUE4R2pDLGNBQWM7QUFDZCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQXFCO0lBQ2pDLFVBQVU7SUFDVixLQUFLLEVBQUUsR0FBRztJQUNWLEdBQUcsRUFBRSxFQUFFO0NBQ1IsQ0FBQTtBQUNELFdBQVc7QUFDWCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQWtCLEVBQUUsQ0FBQTtBQUlsQyxNQUFNLFVBQVUsSUFBSSxDQUFDLEdBQVEsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDOUMsTUFBTSxVQUFVLFFBQVEsQ0FBQyxNQUFXO0lBQ2xDLE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQztJQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFzQ0QsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsUUFBZSxDQUFDLENBQUM7QUFFMUMsZUFBZTtBQUNm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QWtCO0lBQ2xCLElBQ0UsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsR0FBRyxNQUFNLEVBQzVDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxFQUN2QyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFDWixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQ2QsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckcsSUFBSSxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNyRCxJQUFJO1NBQ0QsR0FBRyxDQUFDO1FBQ0gsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSTtRQUMvRSxDQUFDLENBQUMs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