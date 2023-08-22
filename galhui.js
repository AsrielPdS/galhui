import { div, g, isE, S, svg, toSVG } from "galho";
import { call, def, isA, isF, isN, isP, isS } from "galho/util.js";
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
export function cc(...cls) { return `._.${cls.join('-')}`; }
/**html class */
export function hc(...cls) { return ['_', cls.join('-')]; }
/**selector for element that can gain focus*/
export const focusable = ":not(:disabled):is(a[href],button,input,textarea,select,[tabindex])";
export function icon(d, s) {
    if (d) {
        if (isS(d))
            d = { d };
        else if (isE(d))
            return d.c(`icon ${s}`);
        return svg('svg', {
            fill: d.c || "currentColor",
            viewBox: $.is || "0 0 24 24",
        }, svg('path', { d: d.d })).c(`icon ${s}`);
    }
}
export function label(v, cls) {
    return v && ((isS(v) ? div(0, v) : isA(v) ? div(0, [icon(v[0]), v[1]]) : g(v)))?.c(cls);
}
export function bt(text, click, type = "button") {
    return g("button", "_ bt", text).p("type", type).on("click", click);
}
export const link = (text, href) => g("a", ["_", "lk" /* C.link */], text).p("href", href);
/** button with icon */
export function ibt(i, text, click, type = "button") {
    return g("button", "_ bt", [icon(i), text])
        .p("type", type)
        .c("icon" /* C.icon */, !text).on("click", click);
}
export function positive(i, text, click, type) {
    return ibt(i, text, click, type).c("_a" /* Color.accept */);
}
export function negative(i, text, click, type) {
    return ibt(i, text, click, type).c("_e" /* Color.error */);
}
/** link with icon */
export function ilink(i, text, href) {
    return g("a", "lk" /* C.link */, [icon(i), text]).p("href", href);
}
/**close button */
export function close(click) {
    return g("span", `_ ${"cl" /* C.close */}`, icon($.i.close)).on("click", click);
}
/**cancel button */
export function cancel(click) {
    return negative($.i.cancel, w.cancel, click);
}
/**confirm button */
export function confirm(click) {
    return positive(null, w.confirm, click, "submit");
}
export function buttons(...buttons) {
    return div("bs" /* C.buttons */, buttons);
}
export function img(src, cls) { return g("img", cls).p("src", src); }
export function a(href, content, cls) { return g("a", cls, content).p("href", href); }
export function hr(cls) { return g("hr", cls); }
export function logo(v) {
    if (v)
        if (isS(v)) {
            switch (v[0]) {
                case ".":
                case "/":
                    return img(v).c("icon" /* C.icon */);
                case "<":
                    return toSVG(v).c("icon" /* C.icon */);
            }
        }
        else
            return icon(v);
}
export function hoverBox({ x, y, right: r, bottom: b }, e, [o, side, main]) {
    /*m:main,s:side,w:windows,e:Element,h:Horizontal */
    let { innerHeight: wh, innerWidth: ww } = window, { width: ew, height: eh } = e.rect, h = o == "h", border = $.rem * .4, [ws, wm, es, em, s0, m0, s1, m1] = h ? [wh, ww, eh, ew, y, x, b, r] : [ww, wh, ew, eh, x, y, r, b];
    main ||= (m0 + (m1 - m0) / 2) > (wm / 2) ? "s" : "e";
    e
        .css({
        //main
        ["max" + (h ? "Width" : "Height")]: (main == "e" ? wm - m1 : m0) - border * 2 + "px",
        [h ? "left" : "top"]: (main == "e" ? m1 + border : Math.max(0, m0 - em) - border) + "px",
        //side
        ["max" + (h ? "Height" : "Width")]: (side == "e" ? ws - s0 : s1) - border + "px",
        [h ? "top" : "left"]: Math.max(0, Math.min(ws - es, side == "s" ? s1 - es : side == "e" ? s0 : s0 + (s1 - s0) / 2 - es / 2)) + "px",
    });
}
export function menu(items) { return div("_ menu", g("table", 0, items)); }
/**menu item */
export function menuitem(i, text, action, side, disabled) {
    return g("tr", "i" + (disabled ? " " + "ds" /* C.disabled */ : ""), [
        g("td", 0, icon(i)),
        g("td", 0, text),
        g("td", "sd" /* C.side */, side),
        g("td")
    ]).on("click", !disabled && action);
}
// export function menuitemFull(){
//   return g("tr","i",[g("td"),g("td",{colSpan:3})])
// }
/**checkbox */
export function menucb(checked, text, toggle, id, disabled) {
    let input = g("input", { id, checked, disabled, indeterminate: checked == null, type: "checkbox" });
    toggle && input.on("input", () => toggle.call(input, input.e.checked));
    return g("tr", ["i", disabled && "ds" /* C.disabled */], [
        g("td", 0, input),
        g("td", 0, text).on("click", () => input.e.click()),
        g("td"), g("td")
    ]).on("click", e => e.stopPropagation());
}
export function menuwait(callback) {
    return call(g("tr", 0, g("td", 0, wait(1 /* WaitType.out */)).p("colSpan", 4)), tr => waiter(tr, callback));
}
export const submenu = (i, text, items) => call(g("tr", "i", [
    g("td", 0, icon(i)),
    g("td", 0, text),
    g("td"),
    g("td", 0, icon("menuR"))
]), e => {
    let mn;
    e.on("click", () => {
        e.tcls("on" /* C.on */).is('.' + "on" /* C.on */) ?
            hoverBox(e.rect, (mn ||= g("table", "menu" /* C.menu */, items)).addTo(e), "h") :
            mn.remove();
    });
});
export const menusep = () => g("tr", "_ hr");
/** */
export function menubar(...items) { return div("_ bar", items); }
/** */
export function right() { return div("r" /* HAlign.right */); }
export function mbitem(i, text, action) {
    return g("button", "i", [icon(i), text]).p({ type: "button" }).on("click", action);
}
/**menubar separator */
export function mbsep() { return g("hr"); }
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
export function loading(sz = "n" /* Size.n */) { return div("_ blank", div("_ load " + sz)); }
export function busy(arg0, arg1, arg2, arg3) {
    if (isF(arg0)) {
        let e = g("span");
        (async () => {
            let t = setTimeout(() => e.replace(e = loading(arg1)), def(arg2, 750));
            e.replace(e = await arg0());
            clearTimeout(t);
        })();
        // setTimeout(async () => e.replace(e = await arg0()), def(arg2, 750));
        // let t = await arg0();
        // e.parent && e.replace(t);
        // e = t;
        return e;
    }
    else {
        let e = loading(arg2), p, t = setTimeout(() => {
            p = arg0.add(e).css("position");
            arg0.css({ position: "relative" });
        }, arg3);
        let close = () => {
            e.remove();
            clearTimeout(t);
            arg0.css({ position: p });
        };
        return (async () => {
            try {
                await arg1(close);
            }
            finally {
                close();
            }
        })();
    }
}
export const blobToBase64 = (v) => new Promise((rs, rj) => {
    var reader = new FileReader();
    reader.readAsDataURL(v);
    reader.onloadend = () => rs(reader.result);
    reader.onerror = rj;
});
