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
export const panel = (hd, bd, ft) => div("_ panel", [
    hd && wrap(hd, "hd"),
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
export const menusep = () => g("tr", "div" /* separator */);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsaHVpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2FsaHVpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBUyxHQUFHLEVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3hGLE9BQU8sRUFBUSxJQUFJLEVBQTJCLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFvR2pDLGNBQWM7QUFDZCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQXFCO0lBQ2pDLFVBQVU7SUFDVixLQUFLLEVBQUUsR0FBRztJQUNWLEdBQUcsRUFBRSxFQUFFO0NBQ1IsQ0FBQTtBQUNELFdBQVc7QUFDWCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQWtCLEVBQUUsQ0FBQTtBQUlsQyxNQUFNLFVBQVUsSUFBSSxDQUFDLEdBQVEsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDOUMsTUFBTSxVQUFVLFFBQVEsQ0FBQyxNQUFXO0lBQ2xDLE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQztJQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFzQ0QsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsUUFBZSxDQUFDLENBQUM7QUFFMUMsZUFBZTtBQUNm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V0FBVyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLEdBQUcsTUFBTSxFQUM1QyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFDdkMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQ1osQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUNkLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JHLElBQUksS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDckQsSUFBSTtTQUNELEdBQUcsQ0FBQztRQUNILENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUk7UUFDL0UsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSTtRQUM5RSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUk7S0FDcEksQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUlELE1BQU0sVUFBVSxJQUFJLENBQUMsS0FBaUIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFdkYsZUFBZTtBQUNmLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQU8sRUFBRSxJQUFTLEVBQUUsTUFBYyxFQUFFLElBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksa0JBQVU7SUFDMUYsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQztJQUNoQixDQUFDLENBQUMsSUFBSSxtQkFBVSxJQUFJLENBQUM7SUFDckIsQ0FBQyxDQUFDLElBQUksQ0FBQztDQUNSLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBRXZCLGNBQWM7QUFDZCxNQUFNLFVBQVUsTUFBTSxDQUFDLE9BQWEsRUFBRSxJQUFTLEVBQUUsTUFBMEQsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQWU7SUFDeEksSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxPQUFPLElBQUksSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3BHLE1BQU0sSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRyxLQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEYsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSx1QkFBYyxDQUFDLEVBQUU7UUFDOUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO0tBQ2pCLENBQUMsQ0FBQztBQUNMLENBQUM7QUFDRCxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxRQUFpQixFQUFFLEVBQUUsQ0FDNUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksYUFBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQy9GLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQU8sRUFBRSxJQUFTLEVBQUUsS0FBZ0IsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQ2pGLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNQLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUMxQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDTixJQUFJLEVBQUssQ0FBQztJQUNWLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNqQixDQUFDLENBQUMsSUFBSSxlQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQU8sQ0FBQyxDQUFDLENBQUM7WUFDM0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FBTyxxQkFBVSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25FLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLHdCQUFhLENBQUM7QUFHakQsTUFBTTtBQUNOLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsS0FBYyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xFLE1BQU07QUFDTixNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxpQkFBYyxDQUFDO0FBQzdDLE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQU8sRUFBRSxJQUFTLEVBQUUsTUFBK0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBRXJJLHVCQUF1QjtBQUN2QixNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLHNCQUFzQjtBQUN0QixNQUFNLFVBQVUsS0FBSyxDQUFDLE9BQWEsRUFBRSxJQUFTLEVBQUUsTUFBMEQsRUFBRSxRQUFlO0lBQ3pILElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxPQUFPLElBQUksSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ2hHLE1BQU0sSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRyxLQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEYsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSx1QkFBYyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNwRSxDQUFDO0FBVUQsa0JBQWtCO0FBQ2xCLE1BQU0sVUFBVSxFQUFFLENBQUMsSUFBSSxjQUFlO0lBQ3BDLFFBQVEsSUFBSSxFQUFFO1FBQ1osb0JBQXFCO1FBQ3JCO1lBQ0UsT0FBTyxHQUFHLHFCQUFZO1lBQ3BCLG9EQUFvRDtZQUNwRCwrREFBK0Q7YUFDaEUsQ0FBQyxDQUFDO0tBQ047QUFDSCxDQUFDO0FBQ0QsTUFBTSxVQUFVLE1BQU0sQ0FBQyxPQUFVLEVBQUUsRUFBVTtJQUMzQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNyQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDbEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQ1osQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDdkIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUM5QixDQUFBO1NBQ0Y7UUFDRCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUdELE1BQU0sVUFBVSxJQUFJLENBQUMsSUFBd0IsRUFBRSxJQUFhO0lBQzFELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDZCxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1osSUFBSSxpQkFBa0IsQ0FBQztLQUN4QjtJQUNELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QixNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JCLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFHRCxNQUFNLFVBQVUsSUFBSSxDQUFDLFNBQVk7SUFDL0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDbEMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFUixPQUFPLEdBQUcsRUFBRTtRQUNWLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNYLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixDQUFDLENBQUE7QUFDSCxDQUFDIn0=