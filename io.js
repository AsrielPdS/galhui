import { active, clearEvent, delay, div, E, g, onfocusout, S, svg, wrap } from "galho";
import { orray, range } from "galho/orray.js";
import { call, fmt, is, isP, isS, isU, l, sub, t } from "galho/util.js";
import { $, body, cancel, close, confirm, fluid, hc, ibt, icon, label, menu, negative, positive, w, wait } from "./galhui.js";
import { anim } from "./util.js";
export const input = (type, name, ph, input) => g("input", { type, name, placeholder: ph }).c("_ in").on("input", input);
export const textarea = (name, ph, input) => g("textarea", { name, placeholder: ph }).c("_ in").on("input", input && (function () { input(this.value); }));
export const checkbox = (label, input, checked) => g("label", "_ cb", [g("input", { type: "checkbox", checked }).on("input", input && (function () { input(this.checked); })), label]);
export function search(input) {
    let t = g("input", { type: "search", placeholder: w.search }), i = icon($.i.search);
    input && delay(t, "input", $.delay, () => input(t.e.value));
    return (i ? div(0, [t, i]) : t).c("_ in");
}
export class ImgSelector extends E {
    view() {
        let i = this.i, input = g('input', { name: i.k, type: "file", accept: i.accept || "image/*" }).on("input", () => {
            let v = input.e.files[0];
            this.set("value", v);
            if (isS(i.save))
                submitImg(i.save, v);
            else
                i.save?.(v);
        });
        return this.bind(div("_ img-in", input), async (_) => {
            if (i.value?.size) {
                let img = g("img"), fr = new FileReader();
                fr.onload = () => img.e.src = fr.result;
                fr.readAsDataURL(i.value);
                _.set([img, close(() => this.set("value", input.e.value = null))]);
            }
            else {
                _.set(g("button", { type: "button" }, [div(0, "+").css("fontSize", "6em"), i.ph])
                    .on("click", () => input.e.click()));
            }
        }, "value");
    }
}
export function submitImg(url, value) {
    return new Promise((resolve) => {
        let r = new XMLHttpRequest;
        r.withCredentials = true;
        r.onload = () => { resolve(r.responseText); };
        r.onprogress = e => {
            //TODO set busy
        };
        r.open("POST", url);
        r.send(value);
    });
}
const lever = (name) => g("input", { type: "checkbox", name }).c("lv" /* C.lever */);
//#region output
export const output = (...content) => g("span", "_ tag", content);
export const keyVal = (key, val) => g("span", "_ in", [key, ": ", val]);
export const message = (c, data) => div(hc("ms" /* C.message */), data).c(c);
export const errorMessage = (data) => message("_e" /* Color.error */, data);
export class Output extends E {
    constructor(text, value, fmt) {
        super(isS(text) ? { text, value, fmt } : text);
    }
    get key() { return this.i.key; }
    get value() { return this.i.value; }
    set value(v) { this.set('value', v); }
    view() {
        let i = this.i;
        return this.bind(div(), (s) => {
            s
                .attr("class", false)
                .c(["in", i.color])
                .set([
                i.text, ': ',
                i.value == null ? i.def : i.fmt ? fmt(i.value, i.fmt) : i.value
            ]);
        });
    }
}
export function mdOnBlur(area) {
    area.on("click", (e) => {
        if (e.target == e.currentTarget)
            area.remove();
    });
}
export function modal(modal, bd, actions, sz, blur = true, form) {
    if (isU(bd))
        modal = g(modal, "_ modal");
    else {
        modal = g(form ? "form" : "div", "_ modal " + (sz || ""), [
            label(modal, "hd"),
            bd,
            div("ft", actions?.(() => area.remove(), modal))
        ]);
    }
    let area = div("_ blank", modal).addTo(body);
    modal.p("tabIndex", 0).focus();
    blur && mdOnBlur(area);
    return area;
}
/**modal with ok and cancel buttons */
export const mdOkCancel = (body, sz = "xs" /* Size.xs */, valid = () => true) => new Promise(ok => {
    let md = modal(div("_ modal " + sz, [
        wrap(body).css({ minHeight: "4em" }),
        div("_ row", [
            confirm(() => { if (valid) {
                md.remove();
                ok(true);
            } }).css({ width: "50%" }),
            cancel(() => { md.remove(); ok(false); }).css({ width: "50%" })
        ])
    ]));
});
/**modal with yes/no buttons */
export const mdYN = (body, sz = "xs" /* Size.xs */, valid = () => true) => new Promise(ok => {
    let md = modal(div("_ modal " + sz, [
        wrap(body).css({ minHeight: "4em" }),
        div("_ row", [
            positive(null, w.yes, () => { if (valid) {
                md.remove();
                ok(true);
            } }).css({ width: "50%" }),
            negative(null, w.no, () => { md.remove(); ok(false); }).css({ width: "50%" }),
        ])
    ]));
});
/**modal with ok */
export const mdOk = (body, sz = "xs" /* Size.xs */) => new Promise((ok) => {
    let md = modal(div("_ modal " + sz, [
        wrap(body).css({ minHeight: "4em" }),
        confirm(() => { md.remove(); ok(); }),
    ]));
});
/**md with error style and ok button */
export const mdError = (msg, sz = "xs" /* Size.xs */) => new Promise((ok) => {
    let md = modal(div(`_ modal ${"_e" /* Color.error */} ${sz}`, [
        wrap(body).css({ minHeight: "4em" }),
        confirm(() => { md.remove(); ok(); }),
    ]));
});
export function popup(area, div, align) {
    return anim(() => body.contains(div) && fluid(area(), div, align));
}
/**context menu */
export function ctxmenu(e, data, align = "ve") {
    clearEvent(e);
    let last = active();
    let wheelHandler = (e) => clearEvent(e);
    let ctx = div("_ menu", g("table", 0, data)).p("tabIndex", 0)
        .on({
        focusout(e) {
            ctx.contains(e.relatedTarget) || (ctx.remove() && body.off("wheel", wheelHandler));
        },
        keydown(e) {
            if (e.key == "Escape") {
                e.stopPropagation();
                ctx.blur();
            }
        }
    }).addTo(body).focus();
    ctx.queryAll('button').on('click', function () { last ? last.focus() : this.blur(); });
    body.on("wheel", wheelHandler, { passive: false });
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
            body.add(tip);
            anim(() => body.contains(root) && tip.parent ?
                fluid(root.rect, tip, align) :
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
// export function keydown<T extends Object = any>(me: Root, e: KeyboardEvent, options: L<T, any>, set: (...values: Key[]) => any) {
// }
/**create root, add handlers */
export function setRoot(me, options, label, menu) {
    let i = me.i, root = onfocusout(div(`_ in ${"sel" /* C.select */}`, [label.c("bd"), t(i.icon) && icon($.i.dd)?.c("sd" /* C.side */) /*, me.menu*/]), () => me.set("open", false))
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
                    if (me.i.open) {
                        me.value = l(options) == 1 ?
                            options[0][options.key] :
                            sub(range.list(options, "on"), options.key)[0];
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
                    if (me.i.open) {
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
    if (t(i.click))
        root.on('click', (e) => {
            if (i.off) {
                e.stopImmediatePropagation();
            }
            else {
                //if (m(<Element>e.target).is('button'))
                //  _this.set(C.open, false);
                //else
                if (!menu.contains(e.target))
                    me.toggle("open");
            }
        });
    me.on(state => {
        if ("off" in state) {
            if (i.off) {
                me.set("open", false);
                root.blur();
                root.c("ds" /* C.disabled */);
                root.p('tabIndex', -1);
            }
            else {
                root.c("ds" /* C.disabled */, false);
                root.p('tabIndex', t(i.tab) ? 0 : -1);
            }
        }
        if ("open" in state) {
            if (i.open && i.off) {
                me.set("open", false);
                return;
            }
            me.emit('open', i.open);
            root.c("on", i.open);
            if (i.open) {
                menu.addTo(root);
                anim(() => {
                    let r = root.rect;
                    return body.contains(menu) && (menu.css("minWidth", r.width + "px"), fluid(r, menu, "ve"));
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
    if (label.e.tagName == "INPUT") {
        label.p("value", me.value == null ? "" : me.value);
    }
    else {
        if (v == null)
            label.c("_ ph").set(me.i.ph);
        else {
            let o = await me.option(v);
            label.c("ph", false).set([me.i.item(o), t(me.i.clear) && close(() => me.value = null)]);
            me.set("open", false);
        }
    }
}
// interface SelectItem<K> {
//   key: K;
//   text?: str;
//   i?: Icon;
// }
// export interface iSelect<K extends keyof T, T extends Dic> extends IRoot<T> {
//   value?: T[K];
//   ph?: str;
//   /**menu width will change acord to content */
//   fluid?: boolean;
// }
// export class Select<K extends keyof T, T extends Dic = Pair> extends E<iSelect<K, T>, { input: [T[K]]; open: [bool] }> {
// }
export const dropdown = (label, items, align = "ve") => call(div("_ dd", label), e => {
    let mn = items instanceof S ? items : null;
    e.on("click", () => {
        if (mn?.parent) {
            mn.remove();
            e.c("on", false);
        }
        else {
            (mn ||= menu(items)).c("menu" /* C.menu */).addTo(e.c("on"));
            popup(() => e.rect, mn, align);
        }
    });
});
export const idropdown = (label, items, align) => dropdown([label, icon($.i.dd)], items, align);
class FileInput extends E {
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
        let i = this.i, values = i.value;
        return div(["_", "fileSelector" /* C.fileSelector */, i.inline && "inline" /* C.inline */], [
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
                ibt($.i.upload, null, () => this.input.e.click()),
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
        var values = this.i.value, sub = values.slice(from, to).filter((v) => v instanceof Blob);
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
    if (camera.i.value)
        fetch(camera.i.value)
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
class Camera extends E {
    constructor(model) {
        super(model);
        model.state = model.value ? 1 /* CameraState.preview */ : 0 /* CameraState.asking */;
        this.on(e => {
            if ('value' in e)
                this.emit('input', e.value);
        });
    }
    view() {
        var model = this.i, output = g('video').css('width', '100%').e, stream;
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
class MobImgSelector extends E {
    view() {
        let i = this.i, bd = div("bd" /* C.body */), clear, emitInput = () => this.set("value", input.files[0]).emit("input", input.value), input = g("input", { type: 'file', accept: 'image/*' }).on("input", emitInput).e;
        return this.bind(div(hc("m" /* C.mobile */, "imgsel"), [
            input, bd,
            ibt("edit", null, () => input.click())
        ]), async (s) => {
            if (i.value) {
                s.prepend(clear ||= close(() => { input.value = null; emitInput(); }));
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
export const hidden = (head, body, open) => div(["_", "ac" /* C.accordion */], [
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFNLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQWtCLFVBQVUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUMzRyxPQUFPLEVBQUssS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2pELE9BQU8sRUFBZ0IsSUFBSSxFQUFPLEdBQUcsRUFBYSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQU8sQ0FBQyxFQUFPLEdBQUcsRUFBRSxDQUFDLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDM0gsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQVcsTUFBTSxFQUFFLEtBQUssRUFBMkIsT0FBTyxFQUFFLEtBQUssRUFBeUIsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQWUsS0FBSyxFQUFXLElBQUksRUFBYSxRQUFRLEVBQUUsUUFBUSxFQUFnQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3RPLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFPakMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBYSxFQUFFLElBQVMsRUFBRSxFQUFRLEVBQUUsS0FBeUIsRUFBRSxFQUFFLENBQ3JGLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBRTNFLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFPLEVBQUUsS0FB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