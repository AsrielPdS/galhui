import { Component, G, active, clearEvent, delay, div, g, get, isE, onfocusout, svg, toSVG, wrap } from "galho";
import { orray, range } from "galho/orray.js";
import { call, def, is, isA, isF, isN, isP, isS, isU, l, sub, t } from "galho/util.js";
import { anim } from "./util.js";
export const icons = {};
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
export const body = new G(document.body);
export const doc = new G(document);
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
    return g("span", `_ ${"cl" /* C.close */}`, icon(icons.close)).on("click", click);
}
/**cancel button */
export function cancel(click) {
    return negative(icons.cancel, w.cancel, click);
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
    return g("tr", `i ${disabled ? "ds" /* C.disabled */ : ""}`, [
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
    return g("tr", `i ${disabled ? "ds" /* C.disabled */ : ""}`, [
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
    return g("label", `i ${disabled ? "ds" /* C.disabled */ : ""}`, [input, text]);
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
        if (t instanceof G) {
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
export const input = (type, name, ph, input) => g("input", { type, name, placeholder: ph }).c("_ in").on("input", input);
export const textarea = (name, ph, input) => g("textarea", { name, placeholder: ph }).c("_ in").on("input", input && (function () { input(this.value); }));
export const checkbox = (label, input, checked) => g("label", "_ cb", [g("input", { type: "checkbox", checked }).on("input", input && (function () { input(this.checked); })), label]);
export function search(input) {
    let t = g("input", { type: "search", placeholder: w.search }), i = icon(icons.search);
    input && delay(t, "input", $.delay, () => input(t.e.value));
    return (i ? div(0, [t, i]) : t).c("_ in");
}
export class ImgSelector extends Component {
    view() {
        let i = this.p, l;
        let input = g('input', { name: i.k, type: "file", accept: i.accept || "image/*" })
            .on("input", () => {
            let v = input.e.files[0];
            this.set("value", v);
        });
        let e = this.bind(g("span", "_ img-in", input), e => i.loading ? e.add(l = loading()) : l?.remove(), "loading");
        return this.bind(e, async (_) => {
            if (i.value) {
                let fr = new FileReader();
                let img = g("img").on("load", () => this.set({ w: img.e.naturalWidth, h: img.e.naturalHeight }));
                if (isS(i.value))
                    img.p("src", i.value);
                else {
                    // i.value = await (await fetch(i.value)).blob();
                    fr.onload = () => img.e.src = fr.result;
                    fr.readAsDataURL(i.value);
                }
                _.set([img, close(() => this.set({ w: null, h: null, value: input.e.value = null }))]);
            }
            else {
                _.set(g("button", { type: "button" }, [div(0, "+").css("fontSize", "6em"), i.ph])
                    .on("click", () => input.e.click()));
            }
        }, "value");
    }
}
export const submitImg = (url, value, img) => new Promise((resolve, err) => {
    let r = new XMLHttpRequest;
    r.withCredentials = true;
    r.onload = () => { img?.set("loading", false); resolve(r.responseText); };
    r.onerror = err;
    img?.set("loading", true);
    r.open("POST", url);
    r.send(value);
});
const lever = (name) => g("input", { type: "checkbox", name }).c("lv" /* C.lever */);
//#region output
export const output = (...content) => g("span", "_ out", content);
export const keyVal = (key, val, c, sz) => g("span", `_ out ${c || ""} ${sz || ""}`, [key, ": ", val]);
export const message = (c, data) => div("_ msg", data).c(c);
export const errorMessage = (data) => message("_e" /* Color.error */, data);
export function modal(modal, bd, actions, sz, blur = true) {
    if (isU(bd))
        modal = g(modal, "_ modal");
    else {
        let hd = modal;
        modal = g("dialog", "_ modal " + (sz || ""));
        modal.add(g("form", 0, [
            label(hd, "hd"),
            isE(bd) ? bd.c("bd") : bd,
            actions && div("ft", actions(() => modal.remove(), modal))
        ]));
    }
    modal.addTo(body).e.showModal();
    return modal;
    // let area = div("_ blank", ).addTo(body);
    // modal.p("tabIndex", 0).focus();
    // blur && mdOnBlur(area);
    // return area;
}
export const showDialog = (e) => e.addTo(body.c("dialog-on")).call("showModal").on("close", () => {
    e.remove();
    body.c("dialog-on", false);
});
/**modal with ok and cancel buttons */
export function mdOkCancel(body, sz = "xs" /* Size.xs */, valid = () => true) {
    return new Promise(ok => modal(null, wrap(body), cl => [
        confirm(() => { if (valid) {
            cl();
            ok(true);
        } }).css({ width: "50%" }),
        cancel(() => { cl(); ok(false); }).css({ width: "50%" })
    ], sz));
}
/**modal with yes/no buttons */
export function mdYN(body, sz = "xs" /* Size.xs */, valid = () => true) {
    return new Promise(ok => modal(null, wrap(body), cl => [
        positive(null, w.yes, () => { if (valid) {
            cl();
            ok(true);
        } }).css({ width: "50%" }),
        negative(null, w.no, () => { cl(); ok(false); }).css({ width: "50%" })
    ], sz));
}
/**modal with ok */
export function mdOk(body, sz = "xs" /* Size.xs */) {
    return new Promise(ok => modal(null, wrap(body), cl => confirm(() => { cl(); ok(); }), sz));
}
/**md with error style and ok button */
export function mdError(body, sz = "xs" /* Size.xs */) {
    return new Promise(ok => modal(null, wrap(body), cl => confirm(() => { cl(); ok(); }), sz).c("_e" /* Color.error */));
}
const topLayer = () => get("dialog") || body;
export function popup(refArea, div, align) {
    return anim(() => topLayer().contains(div) && hoverBox(refArea(), div, align));
}
/**context menu */
export function ctxmenu(e, data, align = "ve") {
    clearEvent(e);
    let last = active(), tl = topLayer();
    let wheelHandler = (e) => clearEvent(e);
    let ctx = div("_ menu", g("table", 0, data)).p("tabIndex", 0)
        .on({
        focusout(e) {
            ctx.contains(e.relatedTarget) || (ctx.remove() && tl.off("wheel", wheelHandler));
        },
        keydown(e) {
            if (e.key == "Escape") {
                e.stopPropagation();
                ctx.blur();
            }
        }
    }).addTo(tl).focus();
    ctx.queryAll('button').on('click', function () { last ? last.focus() : this.blur(); });
    tl.on("wheel", wheelHandler, { passive: false });
    popup(() => new DOMRect(e.clientX, e.clientY, 0, 0), ctx, align);
}
export function tip(root, tip, align = "v") {
    if (isP(tip)) {
        let t = tip;
        tip = div("_ tip", wait);
        t.then(v => { tip = wrap(v, "_ tip"); });
    }
    else
        tip = wrap(tip, "_ tip");
    return (root = g(root))?.on({
        mouseenter() {
            let tl = topLayer();
            tl.add(tip);
            anim(() => tl.contains(root) && tip.parent ?
                hoverBox(root.rect, tip, align) :
                (tip.remove(), false));
        },
        mouseleave() { tip.remove(); },
        //TODO:focusin,focusout
        // focusout(e) {
        //   tip.remove()
        // },
        // focusin(){
        // }
    });
}
/**create root, add handlers */
export function selectRoot(me, options, label, menu, setValue, tag) {
    let i = me.p, root = onfocusout(g(tag || "button", `_ in ${"sel" /* C.select */}`, [label.c("bd"), t(i.icon) && icon(icons.dd)?.c("sd" /* C.side */) /*, me.menu*/]), () => me.set("open", false))
        .p("tabIndex", 0)
        .on({
        focus(e) {
            if (i.off) {
                if (e.relatedTarget)
                    g(e.relatedTarget).focus();
                else
                    root.blur();
            }
            else
                root.c("on");
        },
        keydown(e) {
            switch (e.key) {
                case "ArrowUp":
                    me.set("open", true);
                    range.move(options, "on", -1, range.tp(e.shiftKey, e.ctrlKey));
                    break;
                case "ArrowDown":
                    me.set("open", true);
                    range.move(options, "on", 1, range.tp(e.shiftKey, e.ctrlKey));
                    break;
                case "Enter":
                    if (me.p.open) {
                        setValue(l(options) == 1 ?
                            options[0][options.key] :
                            sub(range.list(options, "on"), options.key)[0]);
                        me.set("open", false);
                    }
                    else
                        return;
                    // else {
                    //   let frm = g(me).closest("form");
                    //   if (frm) frm?.e.requestSubmit();
                    //   else return;
                    // }
                    break;
                case "Escape":
                    if (me.p.open) {
                        me.set("open", false);
                        break;
                    }
                    else
                        return;
                default:
                    return;
            }
            clearEvent(e);
        }
    });
    tag || root.attr("type", "button");
    if (t(i.click))
        root.on('click', (e) => {
            // if (i.off) {
            //   e.stopImmediatePropagation();
            // } else { }
            if (!menu.contains(e.target))
                me.toggle("open");
        });
    me.on(state => {
        if ("off" in state) {
            if (i.off)
                me.set("open", false);
            //{root.blur().attr("disabled", true).p('tabIndex', -1); } 
            root.attr("disabled", i.off); //.p('tabIndex', t(i.tab) ? 0 : -1);
        }
        if ("open" in state) {
            if (i.open && i.off) {
                me.set("open", false);
                return;
            }
            me.emit('open', i.open);
            root.c("on", i.open);
            if (i.open) {
                root.add(menu);
                anim(() => {
                    let r = root.rect;
                    return body.contains(menu) && (menu.css("minWidth", r.width + "px"), hoverBox(r, menu, "ve"));
                });
            }
            else {
                root.c(["b" /* VAlign.bottom */, "t" /* VAlign.top */], false);
                menu.remove();
            }
        }
    });
    return root;
}
export async function setValue(me, label) {
    let v = me.value;
    if (label.is("input")) {
        label.p("value", me.value == null ? "" : me.value);
    }
    else {
        if (v == null)
            label.c("_ ph").set(me.p.ph);
        else {
            let o = await me.option(v);
            label.c("ph", false).set([me.p.item(o), t(me.p.clear) && close(() => me.value = null)]);
            me.set("open", false);
        }
    }
}
export const dropdown = (label, items, align = "ve") => call(div("_ dd", label).p("tabIndex", 0), e => {
    function cl() { mn.remove(); e.c("on", false); }
    let mn = is(items, G) ? items : null;
    onfocusout(e, cl);
    e.on("click", () => {
        if (mn?.parent)
            cl();
        else {
            (mn ||= menu(items)).addTo(e.c("on"));
            popup(() => e.rect, mn, align);
        }
    });
});
export const idropdown = (label, items, align) => dropdown([label, icon(icons.dd)], items, align);
class FileInput extends Component {
    input;
    constructor(i) {
        super(i);
        i.value = orray(i.value, {
            parse: (file, index) => {
                if (is(file, Blob) && i.autosubmit)
                    setTimeout(() => this.submit(index, index + 1));
                return file;
            }
        });
        this.onset("value", () => this.emit('input', i.value.slice()));
    }
    view() {
        let i = this.p, values = i.value;
        return div(`_ ${"fileSelector" /* C.fileSelector */} ${i.inline ? "inline" /* C.inline */ : ""}`, [
            this.input = g('input', {
                type: 'file',
                accept: i.accept,
                multiple: i.multiple
            }).on('change', function () {
                let t = Array.from(this.files);
                if (i.multiple)
                    values.push(...t);
                else
                    values.set(t);
            }),
            values.bind(div("bd"), {
                insert(file) {
                    let name = isS(file) ? file : file.name || "", type = name.slice(name.lastIndexOf(".") + 1);
                    return g("figure", "i", [
                        close(() => values.remove(file)),
                        fileRenderers.find(p => p(type, file)),
                        g("figcaption", 0, name.slice(name.lastIndexOf("/") + 1))
                    ]);
                },
                empty(active, s) {
                    s.c("tag", active).set(active && icon(i.icon));
                }
            }),
            div("_ bar", [
                i.submit && !i.autosubmit && this.bind(ibt("upload", null, () => this.submit()).c("_a" /* Color.accept */), (s) => { g(s).p("disabled", !values.length || values.every((value) => isS(value))); }, 'value'),
                ibt(icons.upload, null, () => this.input.e.click()),
                i.options,
                this.bind(close(() => values.set()), (s) => g(s).p("disabled", !values.length), 'value')
            ])
        ]).p("tabIndex", 0);
    }
    file() {
        return div('file', [
            icon(null)
        ]);
    }
    submit(from, to) {
        var values = this.p.value, sub = values.slice(from, to).filter((v) => v instanceof Blob);
        if (sub.length)
            return FileInput.submitfile(sub, (e) => {
                //todo: progress
            }).then((result) => {
                //subistitui os valores do tipo File pela uid
                for (let i = 0; i < result.length; i++) {
                    for (let j = from || 0; j < values.length; j++) {
                        if (values[j] instanceof Blob) {
                            values[j] = result[i];
                            break;
                        }
                    }
                }
                this.emit('submit', result);
            });
    }
    static submitfile;
}
//file Render Provedors
const pdfRenderer = (type) => type == "pdf" && svg("svg", { viewBox: "0 0 56 56" /*,style="enable-background:new 0 0 56 56;"*/ })
    .html(`<g>
  <path style="fill:#E9E9E0;" d="M36.985,0H7.963C7.155,0,6.5,0.655,6.5,1.926V55c0,0.345,0.655,1,1.463,1h40.074c0.808,0,1.463-0.655,1.463-1V12.978c0-0.696-0.093-0.92-0.257-1.085L37.607,0.257C37.442,0.093,37.218,0,36.985,0z"/>
  <polygon style="fill:#D9D7CA;" points="37.5,0.151 37.5,12 49.349,12 	"/>
  <path style="fill:#CC4B4C;" d="M19.514,33.324L19.514,33.324c-0.348,0-0.682-0.113-0.967-0.326c-1.041-0.781-1.181-1.65-1.115-2.242c0.182-1.628,2.195-3.332,5.985-5.068c1.504-3.296,2.935-7.357,3.788-10.75c-0.998-2.172-1.968-4.99-1.261-6.643c0.248-0.579,0.557-1.023,1.134-1.215c0.228-0.076,0.804-0.172,1.016-0.172c0.504,0,0.947,0.649,1.261,1.049c0.295,0.376,0.964,1.173-0.373,6.802c1.348,2.784,3.258,5.62,5.088,7.562c1.311-0.237,2.439-0.358,3.358-0.358c1.566,0,2.515,0.365,2.902,1.117c0.32,0.622,0.189,1.349-0.39,2.16c-0.557,0.779-1.325,1.191-2.22,1.191c-1.216,0-2.632-0.768-4.211-2.285c-2.837,0.593-6.15,1.651-8.828,2.822c-0.836,1.774-1.637,3.203-2.383,4.251C21.273,32.654,20.389,33.324,19.514,33.324z M22.176,28.198c-2.137,1.201-3.008,2.188-3.071,2.744c-0.01,0.092-0.037,0.334,0.431,0.692C19.685,31.587,20.555,31.19,22.176,28.198z M35.813,23.756c0.815,0.627,1.014,0.944,1.547,0.944c0.234,0,0.901-0.01,1.21-0.441c0.149-0.209,0.207-0.343,0.23-0.415c-0.123-0.065-0.286-0.197-1.175-0.197C37.12,23.648,36.485,23.67,35.813,23.756z M28.343,17.174c-0.715,2.474-1.659,5.145-2.674,7.564c2.09-0.811,4.362-1.519,6.496-2.02C30.815,21.15,29.466,19.192,28.343,17.174z M27.736,8.712c-0.098,0.033-1.33,1.757,0.096,3.216C28.781,9.813,27.779,8.698,27.736,8.712z"/>
  <path style="fill:#CC4B4C;" d="M48.037,56H7.963C7.155,56,6.5,55.345,6.5,54.537V39h43v15.537C49.5,55.345,48.845,56,48.037,56z"/>
  <g>
   <path style="fill:#FFFFFF;" d="M17.385,53h-1.641V42.924h2.898c0.428,0,0.852,0.068,1.271,0.205c0.419,0.137,0.795,0.342,1.128,0.615c0.333,0.273,0.602,0.604,0.807,0.991s0.308,0.822,0.308,1.306c0,0.511-0.087,0.973-0.26,1.388c-0.173,0.415-0.415,0.764-0.725,1.046c-0.31,0.282-0.684,0.501-1.121,0.656s-0.921,0.232-1.449,0.232h-1.217V53z M17.385,44.168v3.992h1.504c0.2,0,0.398-0.034,0.595-0.103c0.196-0.068,0.376-0.18,0.54-0.335c0.164-0.155,0.296-0.371,0.396-0.649c0.1-0.278,0.15-0.622,0.15-1.032c0-0.164-0.023-0.354-0.068-0.567c-0.046-0.214-0.139-0.419-0.28-0.615c-0.142-0.196-0.34-0.36-0.595-0.492c-0.255-0.132-0.593-0.198-1.012-0.198H17.385z"/>
   <path style="fill:#FFFFFF;" d="M32.219,47.682c0,0.829-0.089,1.538-0.267,2.126s-0.403,1.08-0.677,1.477s-0.581,0.709-0.923,0.937s-0.672,0.398-0.991,0.513c-0.319,0.114-0.611,0.187-0.875,0.219C28.222,52.984,28.026,53,27.898,53h-3.814V42.924h3.035c0.848,0,1.593,0.135,2.235,0.403s1.176,0.627,1.6,1.073s0.74,0.955,0.95,1.524C32.114,46.494,32.219,47.08,32.219,47.682z M27.352,51.797c1.112,0,1.914-0.355,2.406-1.066s0.738-1.741,0.738-3.09c0-0.419-0.05-0.834-0.15-1.244c-0.101-0.41-0.294-0.781-0.581-1.114s-0.677-0.602-1.169-0.807s-1.13-0.308-1.914-0.308h-0.957v7.629H27.352z"/>
   <path style="fill:#FFFFFF;" d="M36.266,44.168v3.172h4.211v1.121h-4.211V53h-1.668V42.924H40.9v1.244H36.266z"/>
  </g></g>`), docRenderer = (type) => (type == "docx" || type == "doc") && svg("svg", { viewBox: "0 0 56 56" /*,style="enable-background:new 0 0 56 56;"*/ })
    .html(`<g>
  <path style="fill:#E9E9E0;" d="M36.985,0H7.963C7.155,0,6.5,0.655,6.5,1.926V55c0,0.345,0.655,1,1.463,1h40.074c0.808,0,1.463-0.655,1.463-1V12.978c0-0.696-0.093-0.92-0.257-1.085L37.607,0.257C37.442,0.093,37.218,0,36.985,0z"/>
  <polygon style="fill:#D9D7CA;" points="37.5,0.151 37.5,12 49.349,12 	"/>
  <path style="fill:#8697CB;" d="M18.5,13h-6c-0.552,0-1-0.448-1-1s0.448-1,1-1h6c0.552,0,1,0.448,1,1S19.052,13,18.5,13z"/>
  <path style="fill:#8697CB;" d="M21.5,18h-9c-0.552,0-1-0.448-1-1s0.448-1,1-1h9c0.552,0,1,0.448,1,1S22.052,18,21.5,18z"/>
  <path style="fill:#8697CB;" d="M25.5,18c-0.26,0-0.52-0.11-0.71-0.29c-0.18-0.19-0.29-0.45-0.29-0.71c0-0.26,0.11-0.52,0.29-0.71c0.37-0.37,1.05-0.37,1.42,0c0.18,0.19,0.29,0.45,0.29,0.71c0,0.26-0.11,0.52-0.29,0.71C26.02,17.89,25.76,18,25.5,18z"/>
  <path style="fill:#8697CB;" d="M37.5,18h-8c-0.552,0-1-0.448-1-1s0.448-1,1-1h8c0.552,0,1,0.448,1,1S38.052,18,37.5,18z"/>
  <path style="fill:#8697CB;" d="M12.5,33c-0.26,0-0.52-0.11-0.71-0.29c-0.18-0.19-0.29-0.45-0.29-0.71c0-0.26,0.11-0.52,0.29-0.71c0.37-0.37,1.05-0.37,1.42,0c0.18,0.19,0.29,0.44,0.29,0.71c0,0.26-0.11,0.52-0.29,0.71C13.02,32.89,12.76,33,12.5,33z"/>
  <path style="fill:#8697CB;" d="M24.5,33h-8c-0.552,0-1-0.448-1-1s0.448-1,1-1h8c0.552,0,1,0.448,1,1S25.052,33,24.5,33z"/>
  <path style="fill:#8697CB;" d="M43.5,18h-2c-0.552,0-1-0.448-1-1s0.448-1,1-1h2c0.552,0,1,0.448,1,1S44.052,18,43.5,18z"/>
  <path style="fill:#8697CB;" d="M34.5,23h-22c-0.552,0-1-0.448-1-1s0.448-1,1-1h22c0.552,0,1,0.448,1,1S35.052,23,34.5,23z"/>
  <path style="fill:#8697CB;" d="M43.5,23h-6c-0.552,0-1-0.448-1-1s0.448-1,1-1h6c0.552,0,1,0.448,1,1S44.052,23,43.5,23z"/>
  <path style="fill:#8697CB;" d="M16.5,28h-4c-0.552,0-1-0.448-1-1s0.448-1,1-1h4c0.552,0,1,0.448,1,1S17.052,28,16.5,28z"/>
  <path style="fill:#8697CB;" d="M30.5,28h-10c-0.552,0-1-0.448-1-1s0.448-1,1-1h10c0.552,0,1,0.448,1,1S31.052,28,30.5,28z"/>
  <path style="fill:#8697CB;" d="M43.5,28h-9c-0.552,0-1-0.448-1-1s0.448-1,1-1h9c0.552,0,1,0.448,1,1S44.052,28,43.5,28z"/>
  <path style="fill:#0096E6;" d="M48.037,56H7.963C7.155,56,6.5,55.345,6.5,54.537V39h43v15.537C49.5,55.345,48.845,56,48.037,56z"/>
  <g>
   <path style="fill:#FFFFFF;" d="M23.5,47.682c0,0.829-0.089,1.538-0.267,2.126s-0.403,1.08-0.677,1.477s-0.581,0.709-0.923,0.937s-0.672,0.398-0.991,0.513c-0.319,0.114-0.611,0.187-0.875,0.219C19.503,52.984,19.307,53,19.18,53h-3.814V42.924H18.4c0.848,0,1.593,0.135,2.235,0.403s1.176,0.627,1.6,1.073s0.74,0.955,0.95,1.524C23.395,46.494,23.5,47.08,23.5,47.682z M18.633,51.797c1.112,0,1.914-0.355,2.406-1.066s0.738-1.741,0.738-3.09c0-0.419-0.05-0.834-0.15-1.244c-0.101-0.41-0.294-0.781-0.581-1.114s-0.677-0.602-1.169-0.807s-1.13-0.308-1.914-0.308h-0.957v7.629H18.633z"/>
   <path style="fill:#FFFFFF;" d="M33.475,47.914c0,0.848-0.107,1.595-0.321,2.242c-0.214,0.647-0.511,1.185-0.889,1.613c-0.378,0.429-0.82,0.752-1.326,0.971s-1.06,0.328-1.661,0.328s-1.155-0.109-1.661-0.328s-0.948-0.542-1.326-0.971c-0.378-0.429-0.675-0.966-0.889-1.613c-0.214-0.647-0.321-1.395-0.321-2.242s0.107-1.593,0.321-2.235c0.214-0.643,0.51-1.178,0.889-1.606c0.378-0.429,0.82-0.754,1.326-0.978s1.06-0.335,1.661-0.335s1.155,0.111,1.661,0.335s0.948,0.549,1.326,0.978c0.378,0.429,0.674,0.964,0.889,1.606C33.367,46.321,33.475,47.066,33.475,47.914z M29.236,51.729c0.337,0,0.658-0.066,0.964-0.198c0.305-0.132,0.579-0.349,0.82-0.649c0.241-0.301,0.431-0.695,0.567-1.183s0.209-1.082,0.219-1.784c-0.009-0.684-0.08-1.265-0.212-1.743c-0.132-0.479-0.314-0.873-0.547-1.183s-0.497-0.533-0.793-0.67c-0.296-0.137-0.608-0.205-0.937-0.205c-0.337,0-0.659,0.063-0.964,0.191c-0.306,0.128-0.579,0.344-0.82,0.649c-0.242,0.306-0.431,0.699-0.567,1.183s-0.21,1.075-0.219,1.777c0.009,0.684,0.08,1.267,0.212,1.75c0.132,0.483,0.314,0.877,0.547,1.183s0.497,0.528,0.793,0.67C28.596,51.658,28.908,51.729,29.236,51.729z"/>
   <path style="fill:#FFFFFF;" d="M42.607,51.975c-0.374,0.364-0.798,0.638-1.271,0.82c-0.474,0.183-0.984,0.273-1.531,0.273c-0.602,0-1.155-0.109-1.661-0.328s-0.948-0.542-1.326-0.971c-0.378-0.429-0.675-0.966-0.889-1.613c-0.214-0.647-0.321-1.395-0.321-2.242s0.107-1.593,0.321-2.235c0.214-0.643,0.51-1.178,0.889-1.606c0.378-0.429,0.822-0.754,1.333-0.978c0.51-0.224,1.062-0.335,1.654-0.335c0.547,0,1.057,0.091,1.531,0.273c0.474,0.183,0.897,0.456,1.271,0.82l-1.135,1.012c-0.228-0.265-0.481-0.456-0.759-0.574c-0.278-0.118-0.567-0.178-0.868-0.178c-0.337,0-0.659,0.063-0.964,0.191c-0.306,0.128-0.579,0.344-0.82,0.649c-0.242,0.306-0.431,0.699-0.567,1.183s-0.21,1.075-0.219,1.777c0.009,0.684,0.08,1.267,0.212,1.75c0.132,0.483,0.314,0.877,0.547,1.183s0.497,0.528,0.793,0.67c0.296,0.142,0.608,0.212,0.937,0.212s0.636-0.06,0.923-0.178s0.549-0.31,0.786-0.574L42.607,51.975z"/>
  </g></g>`);
function imgRenderer(type, file) {
    if (['png', 'jpg', 'gif', 'svg', 'ico'].includes(type)) {
        let img = g('img');
        if (isS(file))
            img.p('src', $.fileURI?.(file) || file);
        else {
            let reader = new FileReader();
            reader.onload = (e) => {
                img.p('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
        return img;
    }
}
const fileRenderers = [];
const ISCameraOption = () => ibt("camera", null, async () => {
    let i = null /*this.i*/, camera = new Camera(i.format || {});
    await camera.show();
    if (camera.p.value)
        fetch(camera.p.value)
            .then(v => v.blob())
            .then(v => {
            i.multiple ?
                i.value.push(v) :
                i.value.set([v]);
        });
});
class ImageSelector extends FileInput {
    constructor(i) {
        i.accept ||= 'image/*';
        super(i);
    }
}
class Camera extends Component {
    constructor(model) {
        super(model);
        model.state = model.value ? 1 /* CameraState.preview */ : 0 /* CameraState.asking */;
        this.on(e => {
            if ('value' in e)
                this.emit('input', e.value);
        });
    }
    view() {
        var model = this.p, output = g('video').css('width', '100%').e, stream;
        if (!navigator.mediaDevices)
            this.set('state', 2 /* CameraState.error */);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((tempStream) => {
            stream = tempStream;
            this.set('state', 3 /* CameraState.recording */);
        })
            .catch((e) => {
            this.set('state', 4 /* CameraState.inaccessible */);
        });
        return null;
        // return panel(
        //   [icon('camera'), w.camera],
        //   this.bind(div(), (s) => {
        //     switch (model.state) {
        //       case CameraState.preview:
        //         s.set(g('img', {
        //           src: model.value
        //         }).css('width', '100%'));
        //         if (stream)
        //           stream.getVideoTracks().forEach(track => track.stop());
        //         break;
        //       case CameraState.asking:
        //         //s.set(button({
        //         //  tag: 'h1',
        //         //  cls: C.heading,
        //         //  icon: 'camera-plus',
        //         //  text: 'Confirme o acesso',
        //         //  info: 'Precisa dar accesso a sua camera'
        //         //}));
        //         break;
        //       case CameraState.error:
        //         //s.set(button({
        //         //  tag: 'h1',
        //         //  cls: C.heading,
        //         //  icon: 'alert-circle',
        //         //  text: 'Erro',
        //         //  info: 'Erro na tentativa de aceder a camera'
        //         //}));
        //         break;
        //       case CameraState.recording:
        //         s.set(output);
        //         output.srcObject = stream;
        //         output.play();
        //         break;
        //       case CameraState.inaccessible:
        //         //s.set(button({
        //         //  tag: 'h1',
        //         //  cls: C.heading,
        //         //  icon: 'lock-alert',
        //         //  text: 'N�o consegui acceder',
        //         //  info: 'Precisa dar accesso a sua camera'
        //         //}));
        //         break;
        //     }
        //   }, 'state'),
        //   this.bind(div(), (s) => {
        //     switch (model.state) {
        //       case CameraState.recording:
        //         s.set([
        //           ibt('camera', w.save, () => {
        //             var
        //               canvas = g('canvas').e,
        //               ctx = canvas.getContext("2d");
        //             canvas.width = output.videoWidth;
        //             canvas.height = output.videoHeight;
        //             ctx.drawImage(output, 0, 0, canvas.width, canvas.height);
        //             this.set({
        //               state: CameraState.preview,
        //               value: canvas.toDataURL()
        //             });
        //           })
        //         ]);
        //         break;
        //       case CameraState.preview:
        //         s.set(confirm(() => (<any>g(this).d())()));
        //         break;
        //       default:
        //     }
        //     if (g(this).d())
        //       s.add(cancel(() => (<any>g(this).d())()));
        //   }, 'state')
        // );
    }
    /** */
    show() { return null; /*openModal(assign(modal(), { body: g(this) }))*/ }
}
const readFile = (file) => new Promise(cb => {
    var reader = new FileReader();
    reader.onload = (e) => {
        cb(reader.result);
    };
    reader.readAsDataURL(file);
});
/**image select for smartphone/tablet */
class MobImgSelector extends Component {
    view() {
        let i = this.p, bd = div("bd" /* C.body */), clear, emitInput = () => this.set("value", input.files[0]).emit("input", input.value), input = g("input", { type: 'file', accept: 'image/*' }).on("input", emitInput).e;
        return this.bind(div(`_ ${"m" /* C.mobile */}-imgsel`, [
            input, bd,
            ibt("edit", null, () => input.click())
        ]), async (s) => {
            if (i.value) {
                s.badd(clear ||= close(() => { input.value = null; emitInput(); }));
                bd.set(g("img", { src: await readFile(i.value) }));
            }
            else {
                clear && clear.remove();
                bd.set(icon(i.ph, "xl" /* Size.xl */));
            }
        }, "value");
    }
}
function mobileImageSelector() {
}
export const hidden = (head, body, open) => div(`_ ${"ac" /* C.accordion */}`, [
    head = div("hd" /* C.head */, [
        icon("menuR"),
        head
    ]).c("on" /* C.on */, !!open).on("click", () => head.tcls("on" /* C.on */)),
    wrap(body, "bd" /* C.body */)
]);
export function accordion(items, i = {}) {
    return orray(items).bind(div("_ accordion"), ([hd, bd], j, p) => {
        p.place(j * 2, [
            hd = div("hd" /* C.head */, [
                t(i.icon) && icon("menuR"),
                hd
            ]).c("on" /* C.on */, i.def == j).on("click", () => {
                if (hd.is('.' + "on" /* C.on */))
                    hd.c("on" /* C.on */, false);
                else {
                    t(i.single) && p.childs("." + "hd" /* C.head */).c("on" /* C.on */, false);
                    hd.c("on" /* C.on */);
                }
            }),
            wrap(bd, "bd" /* C.body */)
        ]);
    });
}
export function tab(initial, ...items) {
    let hd = div("_ bar", items.map(([h, b]) => call(div("i", h), e => e.on("click", () => {
        d.set([hd, b]);
        hd.childs().c("on", false);
        e.c("on");
    })))), d = div("_ tab");
    hd.child(initial).e.click();
    return d;
}
export function slideshow(i, items, index = 0) {
    let title = div("title"), bd = g("img");
    let p = g("button", "p").html('&#10094;').on("click", () => set(index - 1));
    let n = g("button", "n").html('&#10095;').on("click", () => set(index + 1));
    let indices = items.map((_, i) => g("a").on("click", () => set(i)));
    let set = (i) => {
        let t = items[i];
        if (t) {
            bd.p({ src: t[0], alt: t[2] });
            title.set(t[1]);
            p.css("visibility", i ? "visible" : "hidden");
            n.css("visibility", i + 1 < l(items) ? "visible" : "hidden");
            indices[index].c("on", false);
            indices[index = i].c("on");
        }
    };
    set(index);
    if (i.click)
        bd.on("click", () => i.click(items[index][0]));
    return div("_ sshow", [
        p, bd, n, title,
        div("indices", indices)
    ]);
    // div("bd",items.map(i => g("img", { src: i[0], alt: i[2] })))
}
export const sshowModal = (src) => showDialog(g("dialog", "_ sshow-md", g("form", 0, [
    g("button", "cl" /* C.close */, icon(icons.close)).p("formMethod", "dialog"),
    g("img", { src })
])));
export const sshowTitle = (main, info) => [main, div("info", info)];
//#endregion
// export interface IOpenSelect<T extends Object = Dic, K extends Key = Key> extends bg.ISelect<T, K> {
//   input?: 'text' | 'number';
//   valid?: (value: string) => boolean;
// }
// export function openSelect<T extends Object = Dic, K extends Key = Key>(input: (this: Select<T, K>, value) => any, options: (T | K)[], i: IOpenSelect<T, K> = {}) {
//   let ip = i.labelE = g('input', { type: i.input }).on('input', function () {
//     input.call(select, this.value);
//   });
//   i.label = (value) => {
//     ip.p('value', <any>value);
//   }
//   let select = new Select<T, K>(i, options);
//   return select;
// }
// export interface ISelectBase<T extends Object, K> extends IRoot {
//   menuE?: S;
//   labelE?: S;
//   /**element in menu or menu itself where items will be added */
//   items?: S<HTMLTableElement>;
//   labelParent?: S;
//   menu?: (this: this, value: T) => One;
//   /**called when value change */
//   setMenu?: (this: this, value: K) => void;
//   /**elemento dentro da label onde a label vai ser renderizada */
//   //labelItem?: S;
//   //label: S | ((key: K) => void);
// }
// export abstract class SelectBase<M extends ISelectBase<T, K> = ISelectBase<any, any>, T extends Object = any, K = Key, E extends SelectEvents = SelectEvents> extends E<M, E>  {
//   menu: S;
//   label: S;
//   options: L<T, K>;
//   abstract setValue(...value: K[]): void;
//   constructor(i: M, options?: Alias<T, K>) {
//     super(i);
//     this.options = extend<T, K>(options, {
//       key: "key",
//       parse: (e) => isO(e) ? e : { key: e } as any
//     });
//   }
//   view(): S {
//     let
//       i = this.i,
//       lb = g(i.labelE || 'div').c(C.body);
//     this.label = i.labelParent || lb // model.labelItem || label;
//     this.menu = (i.menuE || div(0, i.items = g("table"))).c("_ menu");
//     //if (model.menuItems && model.menuItems != this.menu) {
//     //  this.menu.setClass(Cls.fill);
//     //  model.menuItems.setClass(Cls.full);
//     //}
//     i.open = false;
//     //if (!md.menuRender)
//     //  md.menuRender = value => div( null, value[md.key]);
//     return root(this, i, this.options);
//   }
//   protected insertItem(value: T) {
//     var model = this.i;
//     return g(model.menu(value))
//       //.setClass(Cls.option)
//       .on('click', (e) => {
//         e.stopPropagation();
//         let k = value[model.key];
//         this.setValue(k);
//       });
//   }
// }
// export interface IMultselect<T extends Object = any, K extends str | num = str> extends ISelectBase<T, K> {
//   value?: L<K>;
//   empty?: (empty: boolean, container?: S) => void;
//   label?: (this: L<K>, value: K, index?: number, container?: S) => void | One;// Child | Promise;
// }
// export class Multselect<T extends Object = { key: str }, K extends str | num = str> extends SelectBase<IMultselect<T, K>, T, K, { add: K[], remove: K[]; input: K[] } & SelectEvents> {
//   constructor(i: IMultselect<T, K>, options?: Array<T | K>) {
//     super(i, options);
//     this.options.addGroup("on");
//     i.value = orray(i.value, {
//       parse(item) {
//         if (this.indexOf(item) == -1)
//           return item;
//       }
//     });
//     //.bindToE(this, "value");
//   }
//   get value() { return this.i.value; }
//   view() {
//     let
//       i = this.i,
//       values = i.value,
//       options = this.options,
//       div = super.view(),
//       mItems = i.items,
//       menu = i.items || this.menu;
//     this.label.css('flexWrap', 'wrap');
//     bind(options, menu, {
//       insert: this.insertItem.bind(this),
//       tag(s, active, tag) {
//         s.c(tag, active);
//         if (active) {
//           vScroll(menu, s.e.offsetTop - menu.p('clientHeight') / 2 + s.p('clientHeight') / 2);
//         }
//       },
//       groups: {
//         ["on"](e, active) { e.c(C.on, active); }
//       }
//     });
//     bind(values, menu, {
//       insert(key) {
//         let index = itemIndex(options, key);
//         if (index != -1)
//           mItems
//             .child(index)
//             .c(C.main);
//       },
//       remove(key) {
//         let index = itemIndex(options, key);
//         if (index != -1)
//           mItems
//             .child(index)
//             .c(C.main, false);
//       }
//     });
//     bind(values, this.label, {
//       insert: i.label,
//       empty: i.empty
//     });
//     return root(this, i).on("keydown", e => {
//       switch (e.key) {
//         case "Delete": {
//           let target = g(e.target as HTMLElement);
//           if (is(target, 'input') || is(target, 'textarea') || !this.delete())
//             return;
//           else break;
//         }
//         case "Backspace": {
//           let target = g(e.target as HTMLElement);
//           if (is(target, 'input') || is(target, 'textarea') || !this.backspace())
//             return;
//           else break;
//         }
//       }
//       keydown(e, this.options);
//     });
//   }
//   delete() {
//     let vl = this.i.value;
//     if (!vl.length)
//       return false;
//     this.removeValue(vl[0]);
//     return true;
//   }
//   backspace() {
//     let vl = this.i.value;
//     if (!vl.length)
//       return false;
//     this.removeValue(z(vl));
//     return true;
//   }
//   setValue(...values: K[]) {
//     let md = this.i;
//     //let list = this.model.value;
//     if (values.length) {
//       //let l = list.length;
//       let inserted: K[] = [];
//       for (let value of values) {
//         if (md.value.indexOf(value) == -1) {
//           inserted.push(value);
//         }
//       }
//       //md.value.push(...values);
//       if (inserted.length > 0) {
//         md.value.push(...inserted);
//         this.emit('add', inserted);
//         this.emit('input', md.value.slice());
//         if (md.open && this.$)
//           this.setMenu(this.$)
//       }
//     }
//   }
//   removeValue(...values: K[]) {
//     let
//       md = this.i,
//       removed: K[] = [];
//     for (let value of values) {
//       let i = md.value.indexOf(value);
//       if (i != -1) {
//         md.value.removeAt(i);
//         removed.push(value);
//       }
//     }
//     if (removed.length > 0) {
//       this.emit('remove', removed);
//       this.emit('input', md.value.slice());
//       if (md.open && this.$)
//         this.setMenu(this.$)
//     }
//   }
//   //setLabel(value: T) {
//   //  var model = this.model;
//   //  return model.menuRender(<T>value)
//   //    .setClass(Cls.option)
//   //    .on('click', (e) => {
//   //      e.stopPropagation();
//   //      let k = value[model.key];
//   //      this.set('value', k);
//   //      model.child.setTag(focusKey, k);
//   //    })
//   //}
// }
// export interface IOpenMultselect<T extends Object = Dic, K extends Key = Key> extends IMultselect<T, K> {
//   input?: 'text' | 'number';
//   valid?: (value: string) => boolean;
//   /**place holder */
//   ph?: str;
// }
// export function openMultselect<T extends Object = Dic, K extends Key = Key>(i: IOpenMultselect<T, K>, allOptions: T[]) {
//   let
//     select = new Multselect<T, K>(assign(i, {
//       label(value) {
//         i.labelE.p('value', value);
//       },
//       labelE: g('input', { type: i.input, placeholder: i.ph }).on({
//         input() {
//           let arg: Arg<str> = { v: this.value };
//           select.emit("type" as any, arg);
//           if (!arg.p) {
//             allOptions ||= opts.slice();
//             let parts = valid(arg.v.split(/\s+/g)).map(q => new RegExp(q, "gu"));
//             opts.set(allOptions.filter(o => parts.every(p => p.test(o[i.key]))));
//           }
//           if (l(opts) == 1)
//             addSelection(opts, "on", opts[0], SelectionTp.set);
//         },
//         keydown(e) {
//           if (e.key == "Enter" && !opts.tags["on"]) {
//             clearEvent(e);
//             let arg: Arg<str> = { v: this.value };
//             if (i.valid ? i.valid(arg.v) : false) {
//               select.emit("submit" as any, arg)
//               if (!arg.p) {
//                 opts.push({ [i.key]: arg.v } as any);
//                 select.setValue(arg.v as K);
//               }
//             }
//           }
//         }
//       })
//     }), allOptions),
//     opts = select.options;
//   g(select).c(C.input)
//   return select;
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsaHVpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2FsaHVpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFtQyxNQUFNLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ2pKLE9BQU8sRUFBSyxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakQsT0FBTyxFQUF3QixJQUFJLEVBQUUsR0FBRyxFQUFxQixFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFPLEdBQUcsRUFBRSxDQUFDLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckksT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQztBQTJHakMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFtQixFQUFFLENBQUE7QUFDdkMsY0FBYztBQUNkLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBYTtJQUN6QixVQUFVO0lBQ1YsS0FBSyxFQUFFLEdBQUc7SUFDVixHQUFHLEVBQUUsRUFBRTtDQUNSLENBQUE7QUFDRCxXQUFXO0FBQ1gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFtQixFQUFFLENBQUE7QUFJbkMsTUFBTSxVQUFVLElBQUksQ0FBQyxHQUFRLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sVUFBVSxRQUFRLENBQUMsTUFBVztJQUNsQyxNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUM7SUFDdEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENB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QUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRSxJQUFJLE9BQU8sR0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUMsR0FBRSxFQUFFLENBQUEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RCxJQUFJLEdBQUcsR0FBQyxDQUFDLENBQUssRUFBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLEdBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsSUFBRyxDQUFDLEVBQUM7WUFDSCxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUM1QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLENBQUMsQ0FBQSxDQUFDLENBQUEsU0FBUyxDQUFBLENBQUMsQ0FBQSxRQUFRLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBQyxDQUFDLEdBQUMsQ0FBQyxHQUFD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