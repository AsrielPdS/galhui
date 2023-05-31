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
export function modal(modal, bd, actions, sz, blur = true) {
    if (isU(bd))
        modal = g(modal, "_ modal");
    else {
        modal = div("_ modal " + (sz || ""), [
            label(modal, "hd"),
            bd,
            div("ft", actions?.(() => area.remove()))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFNLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQWtCLFVBQVUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUMzRyxPQUFPLEVBQUssS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2pELE9BQU8sRUFBZ0IsSUFBSSxFQUFPLEdBQUcsRUFBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQU8sQ0FBQyxFQUFPLEdBQUcsRUFBRSxDQUFDLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDckgsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQVcsTUFBTSxFQUFFLEtBQUssRUFBMkIsT0FBTyxFQUFFLEtBQUssRUFBeUIsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQWUsS0FBSyxFQUFXLElBQUksRUFBYSxRQUFRLEVBQUUsUUFBUSxFQUFnQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3RPLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFPakMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBYSxFQUFFLElBQVMsRUFBRSxFQUFRLEVBQUUsS0FBeUIsRUFBRSxFQUFFLENBQ3JGLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBRTNFLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFPLEVBQUUsS0FB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QyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7U0FDN0UsQ0FBQztLQUNILENBQUMsQ0FBQyxDQUFBO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxtQkFBbUI7QUFDbkIsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBUyxFQUFFLEVBQUUscUJBQVUsRUFBRSxFQUFFLENBQzlDLElBQUksT0FBTyxDQUFPLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsRUFBRSxFQUFFO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDcEMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDO0tBQ3JDLENBQUMsQ0FBQyxDQUFBO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCx1Q0FBdUM7QUFDdkMsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBUSxFQUFFLEVBQUUscUJBQVUsRUFBRSxFQUFFLENBQ2hELElBQUksT0FBTyxDQUFPLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLHNCQUFXLElBQUksRUFBRSxFQUFFLEVBQUU7UUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNwQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUM7S0FDckMsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLE1BQU0sVUFBVSxLQUFLLENBQUMsSUFBcUIsRUFBRSxHQUFNLEVBQUUsS0FBaUI7SUFDcEUsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDckUsQ0FBQztBQUNELGtCQUFrQjtBQUNsQixNQUFNLFVBQVUsT0FBTyxDQUFDLENBQWEsRUFBRSxJQUFlLEVBQUUsUUFBb0IsSUFBSTtJQUM5RSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZCxJQUFJLElBQUksR0FBRyxNQUFNLEVBQUUsQ0FBQztJQUNwQixJQUFJLFlBQVksR0FBRyxDQUFDLENBQVEsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztTQUMxRCxFQUFFLENBQUM7UUFDRixRQUFRLENBQUMsQ0FBQztZQUNSLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGFBQTRCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3BHLENBQUM7UUFDRCxPQUFPLENBQUMsQ0FBQztZQUNQLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxRQUFRLEVBQUU7Z0JBQ3JCLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDcEIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ1o7UUFDSCxDQUFDO0tBQ0YsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUV6QixHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsY0FBYyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEYsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbkQsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFFRCxNQUFNLFVBQVUsR0FBRyxDQUFzQixJQUFVLEVBQUUsR0FBTSxFQUFFLFFBQW9CLEdBQUc7SUFDbEYsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDWixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDWixHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN6Qzs7UUFDSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM5QixPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBTSxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUMvQixVQUFVO1lBQ1IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDNUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQUNELFVBQVUsS0FBSyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUEsQ0FBQyxDQUFDO1FBQzdCLHVCQUF1QjtRQUN2QixnQkFBZ0I7UUFDaEIsaUJBQWlCO1FBQ2pCLEtBQUs7UUFDTCxhQUFhO1FBRWIsSUFBSTtLQUNMLENBQUMsQ0FBQztBQUNMLENBQUM7QUE2QkQsb0lBQW9JO0FBRXBJLElBQUk7QUFDSiwrQkFBK0I7QUFDL0IsTUFBTSxVQUFVLE9BQU8sQ0FBQyxFQUFRLEVBQUUsT0FBVSxFQUFFLEtBQVEsRUFBRSxJQUFPO0lBQzdELElBQ0UsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ1IsSUFBSSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxvQkFBUSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxtQkFBUSxDQUFBLGFBQWEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDeEksQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FDaEIsRUFBRSxDQUFDO1FBQ0YsS0FBSyxDQUFDLENBQUM7WUFDTCxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1QsSUFBSSxDQUFDLENBQUMsYUFBYTtvQkFDakIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUF3QixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7O29CQUNuQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDbEI7O2dCQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQztRQUNELE9BQU8sQ0FBQyxDQUFDO1lBQ1AsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUNiLEtBQUssU0FBUztvQkFDWixFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDckIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDL0QsTUFBTTtnQkFDUixLQUFLLFdBQVc7b0JBQ2QsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM5RCxNQUFNO2dCQUNSLEtBQUssT0FBTztvQkFDVixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO3dCQUNiLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzRCQUMxQixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBUSxDQUFDLENBQUM7NEJBQ2hDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsR0FBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3hELEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO3FCQUN2Qjs7d0JBQU0sT0FBTztvQkFDZCxTQUFTO29CQUNULHFDQUFxQztvQkFDckMscUNBQXFDO29CQUNyQyxpQkFBaUI7b0JBQ2pCLElBQUk7b0JBQ0osTUFBTTtnQkFDUixLQUFLLFFBQVE7b0JBQ1gsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTt3QkFDYixFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDdEIsTUFBTTtxQkFDUDs7d0JBQU0sT0FBTztnQkFFaEI7b0JBQ0UsT0FBTzthQUNWO1lBQ0QsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLENBQUM7S0FDRixDQUFDLENBQUM7SUFDUCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ1osSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNyQixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1QsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUM7YUFDOUI7aUJBQU07Z0JBQ0wsd0NBQXdDO2dCQUN4Qyw2QkFBNkI7Z0JBQzdCLE1BQU07Z0JBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQXFCLENBQUM7b0JBQ3pDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDckI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDWixJQUFJLEtBQUssSUFBSSxLQUFLLEVBQUU7WUFDbEIsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUNULEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1osSUFBSSxDQUFDLENBQUMsdUJBQVksQ0FBQztnQkFDbkIsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN4QjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsQ0FBQyx3QkFBYSxLQUFLLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZDO1NBQ0Y7UUFDRCxJQUFJLE1BQU0sSUFBSSxLQUFLLEVBQUU7WUFDbkIsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ25CLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN0QixPQUFPO2FBQ1I7WUFDRCxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXJCLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDVixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsR0FBRyxFQUFFO29CQUNSLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtnQkFDNUYsQ0FBQyxDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsQ0FBQyxDQUFDLCtDQUEyQixFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDZjtTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFDRCxNQUFNLENBQUMsS0FBSyxVQUFVLFFBQVEsQ0FBVSxFQUFzQyxFQUFFLEtBQVE7SUFDdEYsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNqQixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sRUFBRTtRQUM5QixLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDcEQ7U0FBTTtRQUNMLElBQUksQ0FBQyxJQUFJLElBQUk7WUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3ZDO1lBQ0gsSUFBSSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQVEsQ0FBQyxDQUFDO1lBQ2xDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RixFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN2QjtLQUNGO0FBQ0gsQ0FBQztBQUNELDRCQUE0QjtBQUM1QixZQUFZO0FBQ1osZ0JBQWdCO0FBQ2hCLGNBQWM7QUFDZCxJQUFJO0FBRUosZ0ZBQWdGO0FBQ2hGLGtCQUFrQjtBQUNsQixjQUFjO0FBQ2Qsa0RBQWtEO0FBQ2xELHFCQUFxQjtBQUNyQixJQUFJO0FBQ0osMkhBQTJIO0FBQzNILElBQUk7QUFFSixNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFVLEVBQUUsS0FBVSxFQUFFLFFBQW9CLElBQUksRUFBRSxFQUFFLENBQzNFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQzNCLElBQUksRUFBRSxHQUFHLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzNDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNqQixJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUU7WUFDZCxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNsQjthQUFNO1lBQ0wsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDaEQsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQVUsRUFBRSxLQUFVLEVBQUUsS0FBa0IsRUFBRSxFQUFFLENBQ3RFLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQTZCaEQsTUFBTSxTQUFtRCxTQUFRLENBQThDO0lBQzdHLEtBQUssQ0FBc0I7SUFFM0IsWUFBWSxDQUFJO1FBQ2QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVQsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQWtCLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDeEMsS0FBSyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUNyQixJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVU7b0JBQ2hDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsT0FBTyxJQUFJLENBQUM7WUFDZCxDQUFDO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELElBQUk7UUFDRixJQUNFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUNWLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ25CLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyx1Q0FBa0IsQ0FBQyxDQUFDLE1BQU0sMkJBQVksQ0FBQyxFQUFFO1lBQ3RELElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtnQkFDdEIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNO2dCQUNoQixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7YUFDckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxDQUFDLFFBQVE7b0JBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztvQkFFZixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLENBQUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNyQixNQUFNLENBQUMsSUFBSTtvQkFDVCxJQUNFLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUUsSUFBYSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQ25ELElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQy9DLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7d0JBQ3RCLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNoQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDdEMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUMxRCxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELENBQUM7YUFDRixDQUFDO1lBQ0YsR0FBRyxDQUFDLE9BQU8sRUFBRTtnQkFDWCxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMseUJBQWMsRUFDN0YsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FDL0Y7Z0JBQ0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDakQsQ0FBQyxDQUFDLE9BQWM7Z0JBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUM7YUFDekYsQ0FBQztTQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJO1FBQ0YsT0FBTyxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDWCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQWEsRUFBRSxFQUFXO1FBQy9CLElBQ0UsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUNyQixHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFPLENBQUMsQ0FBQyxFQUFhLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUM7UUFFakYsSUFBSSxHQUFHLENBQUMsTUFBTTtZQUNaLE9BQU8sU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDckMsZ0JBQWdCO1lBQ2xCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNqQiw2Q0FBNkM7Z0JBQzdDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzlDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLElBQUksRUFBRTs0QkFDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdEIsTUFBTTt5QkFDUDtxQkFDRjtpQkFDRjtnQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxNQUFNLENBQUMsVUFBVSxDQUFtRztDQUNySDtBQUNELHVCQUF1QjtBQUN2QixNQUNFLFdBQVcsR0FBaUIsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUEsNkNBQTZDLEVBQUUsQ0FBQztLQUMxSSxJQUFJLENBQUM7Ozs7Ozs7OztXQVNDLENBQUMsRUFDVixXQUFXLEdBQWlCLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsV0FBVyxDQUFBLDZDQUE2QyxFQUFFLENBQUM7S0FDOUosSUFBSSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQW9CQyxDQUFDLENBQUM7QUFDYixTQUFTLFdBQVcsQ0FBQyxJQUFTLEVBQUUsSUFBYTtJQUMzQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN0RCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ1gsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFBO2FBQ3BDO1lBQ0gsSUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUM5QixNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BCLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFHLENBQUMsQ0FBQyxNQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDO1lBQ0YsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtRQUNELE9BQU8sR0FBRyxDQUFDO0tBQ1o7QUFDSCxDQUFDO0FBQ0QsTUFBTSxhQUFhLEdBQW1CLEVBQUUsQ0FBQztBQVF6QyxNQUFNLGNBQWMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtJQUMxRCxJQUNFLENBQUMsR0FBRyxJQUFJLENBQUEsVUFBVSxFQUNsQixNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQztJQUV0QyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQixJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSztRQUNoQixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFDbEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ25CLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNSLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDVixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7QUFDVCxDQUFDLENBQUMsQ0FBQztBQUNILE1BQU0sYUFBYyxTQUFRLFNBQXlCO0lBQ25ELFlBQVksQ0FBaUI7UUFDM0IsQ0FBQyxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUM7UUFDdkIsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztDQWNGO0FBMkJELE1BQU0sTUFBTyxTQUFRLENBQTZCO0lBRWhELFlBQVksS0FBYztRQUN4QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFYixLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyw2QkFBcUIsQ0FBQywyQkFBbUIsQ0FBQztRQUVyRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsSUFBSSxPQUFPLElBQUksQ0FBQztnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsSUFBSTtRQUNGLElBQ0UsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQ2QsTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDMUMsTUFBbUIsQ0FBQztRQUV0QixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVk7WUFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLDRCQUFvQixDQUFDO1FBRXZDLFNBQVMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDO2FBQ2pELElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ25CLE1BQU0sR0FBRyxVQUFVLENBQUM7WUFFcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLGdDQUF3QixDQUFDO1FBQzNDLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLG1DQUEyQixDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO1FBRUwsT0FBTyxJQUFJLENBQUM7UUFDWixnQkFBZ0I7UUFDaEIsZ0NBQWdDO1FBQ2hDLDhCQUE4QjtRQUc5Qiw2QkFBNkI7UUFDN0Isa0NBQWtDO1FBQ2xDLDJCQUEyQjtRQUMzQiw2QkFBNkI7UUFDN0Isb0NBQW9DO1FBQ3BDLHNCQUFzQjtRQUN0QixvRUFBb0U7UUFFcEUsaUJBQWlCO1FBQ2pCLGlDQUFpQztRQUNqQywyQkFBMkI7UUFDM0IseUJBQXlCO1FBQ3pCLDhCQUE4QjtRQUM5QixtQ0FBbUM7UUFDbkMseUNBQXlDO1FBQ3pDLHVEQUF1RDtRQUN2RCxpQkFBaUI7UUFDakIsaUJBQWlCO1FBQ2pCLGdDQUFnQztRQUNoQywyQkFBMkI7UUFDM0IseUJBQXlCO1FBQ3pCLDhCQUE4QjtRQUM5QixvQ0FBb0M7UUFDcEMsNEJBQTRCO1FBQzVCLDJEQUEyRDtRQUMzRCxpQkFBaUI7UUFDakIsaUJBQWlCO1FBRWpCLG9DQUFvQztRQUNwQyx5QkFBeUI7UUFDekIscUNBQXFDO1FBQ3JDLHlCQUF5QjtRQUV6QixpQkFBaUI7UUFDakIsdUNBQXVDO1FBQ3ZDLDJCQUEyQjtRQUMzQix5QkFBeUI7UUFDekIsOEJBQThCO1FBQzlCLGtDQUFrQztRQUNsQyw0Q0FBNEM7UUFDNUMsdURBQXVEO1FBQ3ZELGlCQUFpQjtRQUNqQixpQkFBaUI7UUFFakIsUUFBUTtRQUNSLGlCQUFpQjtRQUNqQiw4QkFBOEI7UUFDOUIsNkJBQTZCO1FBQzdCLG9DQUFvQztRQUNwQyxrQkFBa0I7UUFDbEIsMENBQTBDO1FBQzFDLGtCQUFrQjtRQUNsQix3Q0FBd0M7UUFDeEMsK0NBQStDO1FBRS9DLGdEQUFnRDtRQUNoRCxrREFBa0Q7UUFDbEQsd0VBQXdFO1FBRXhFLHlCQUF5QjtRQUN6Qiw0Q0FBNEM7UUFDNUMsMENBQTBDO1FBQzFDLGtCQUFrQjtRQUNsQixlQUFlO1FBQ2YsY0FBYztRQUNkLGlCQUFpQjtRQUNqQixrQ0FBa0M7UUFDbEMsc0RBQXNEO1FBQ3RELGlCQUFpQjtRQUNqQixpQkFBaUI7UUFDakIsUUFBUTtRQUNSLHVCQUF1QjtRQUN2QixtREFBbUQ7UUFDbkQsZ0JBQWdCO1FBQ2hCLEtBQUs7SUFDUCxDQUFDO0lBQ0QsTUFBTTtJQUNOLElBQUksS0FBSyxPQUFPLElBQUksQ0FBQyxDQUFBLGlEQUFpRCxDQUFDLENBQUM7Q0FDekU7QUFDRCxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQVUsRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQU0sRUFBRSxDQUFDLEVBQUU7SUFDckQsSUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztJQUM5QixNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDcEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFhLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQUM7SUFDRixNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLENBQUMsQ0FBQyxDQUFDO0FBTUgsd0NBQXdDO0FBRXhDLE1BQU0sY0FBZSxTQUFRLENBQW9DO0lBQy9ELElBQUk7UUFDRixJQUNFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUNWLEVBQUUsR0FBRyxHQUFHLG1CQUFRLEVBQ2hCLEtBQVEsRUFDUixTQUFTLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUM5RSxLQUFLLEdBQXFCLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxxQkFBVyxRQUFRLENBQUMsRUFBRTtZQUMzQyxLQUFLLEVBQUUsRUFBRTtZQUNULEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN2QyxDQUFDLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO1lBQ1osSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUNYLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDckUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTthQUNuRDtpQkFDSTtnQkFDSCxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN4QixFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxxQkFBVSxDQUFDLENBQUM7YUFDN0I7UUFFSCxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDYixDQUFDO0NBQ0Y7QUFDRCxTQUFTLG1CQUFtQjtBQUU1QixDQUFDO0FBUUQsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLENBQUMsSUFBUyxFQUFFLElBQVMsRUFBRSxJQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcseUJBQWMsRUFBRTtJQUNuRixJQUFJLEdBQUcsR0FBRyxvQkFBUztRQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ2IsSUFBSTtLQUNMLENBQUMsQ0FBQyxDQUFDLGtCQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFLLElBQUssQ0FBQyxJQUFJLGlCQUFNLENBQUM7SUFDMUQsSUFBSSxDQUFDLElBQUksb0JBQVM7Q0FDbkIsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FBQyxLQUFzQixFQUFFLElBQWdCLEVBQUU7SUFDbEUsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM5RCxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDYixFQUFFLEdBQUcsR0FBRyxvQkFBUztnQkFDZixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQzFCLEVBQUU7YUFDSCxDQUFDLENBQUMsQ0FBQyxrQkFBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO2dCQUN0QyxJQUFLLEVBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxrQkFBTyxDQUFDO29CQUN0QixFQUFHLENBQUMsQ0FBQyxrQkFBTyxLQUFLLENBQUMsQ0FBQztxQkFDcEI7b0JBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsb0JBQVMsQ0FBQyxDQUFDLENBQUMsa0JBQU8sS0FBSyxDQUFDLENBQUM7b0JBQ2pELEVBQUcsQ0FBQyxDQUFDLGlCQUFNLENBQUM7aUJBQ2pCO1lBQ0gsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxDQUFDLEVBQUUsb0JBQVM7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxPQUFZLEVBQUUsR0FBRyxLQUFnQjtJQUNuRCxJQUNFLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDaEYsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNMLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkIsRUFBRSxDQUFDLEtBQUssQ0FBaUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQzNDLE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUNELFlBQVk7QUFDWix1R0FBdUc7QUFDdkcsK0JBQStCO0FBQy9CLHdDQUF3QztBQUN4QyxJQUFJO0FBQ0osc0tBQXNLO0FBQ3RLLGdGQUFnRjtBQUNoRixzQ0FBc0M7QUFDdEMsUUFBUTtBQUNSLDJCQUEyQjtBQUMzQixpQ0FBaUM7QUFDakMsTUFBTTtBQUNOLCtDQUErQztBQUMvQyxtQkFBbUI7QUFDbkIsSUFBSTtBQUlKLG9FQUFvRTtBQUNwRSxlQUFlO0FBQ2YsZ0JBQWdCO0FBRWhCLG1FQUFtRTtBQUNuRSxpQ0FBaUM7QUFDakMscUJBQXFCO0FBQ3JCLDBDQUEwQztBQUMxQyxtQ0FBbUM7QUFDbkMsOENBQThDO0FBQzlDLG9FQUFvRTtBQUNwRSxxQkFBcUI7QUFFckIscUNBQXFDO0FBRXJDLElBQUk7QUFDSixtTEFBbUw7QUFDbkwsYUFBYTtBQUNiLGNBQWM7QUFFZCxzQkFBc0I7QUFDdEIsNENBQTRDO0FBRTVDLCtDQUErQztBQUMvQyxnQkFBZ0I7QUFDaEIsNkNBQTZDO0FBQzdDLG9CQUFvQjtBQUNwQixxREFBcUQ7QUFDckQsVUFBVTtBQUNWLE1BQU07QUFHTixnQkFBZ0I7QUFDaEIsVUFBVTtBQUNWLG9CQUFvQjtBQUNwQiw2Q0FBNkM7QUFFN0Msb0VBQW9FO0FBRXBFLHlFQUF5RTtBQUV6RSwrREFBK0Q7QUFDL0Qsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5QyxVQUFVO0FBRVYsc0JBQXNCO0FBR3RCLDRCQUE0QjtBQUM1Qiw4REFBOEQ7QUFFOUQsMENBQTBDO0FBQzFDLE1BQU07QUFFTixxQ0FBcUM7QUFDckMsMEJBQTBCO0FBRTFCLGtDQUFrQztBQUNsQyxnQ0FBZ0M7QUFDaEMsOEJBQThCO0FBQzlCLCtCQUErQjtBQUMvQixvQ0FBb0M7QUFDcEMsNEJBQTRCO0FBQzVCLFlBQVk7QUFDWixNQUFNO0FBQ04sSUFBSTtBQUNKLDhHQUE4RztBQUM5RyxrQkFBa0I7QUFDbEIscURBQXFEO0FBQ3JELG9HQUFvRztBQUNwRyxJQUFJO0FBQ0osMExBQTBMO0FBQzFMLGdFQUFnRTtBQUNoRSx5QkFBeUI7QUFDekIsbUNBQW1DO0FBQ25DLGlDQUFpQztBQUNqQyxzQkFBc0I7QUFDdEIsd0NBQXdDO0FBQ3hDLHlCQUF5QjtBQUN6QixVQUFVO0FBQ1YsVUFBVTtBQUNWLGlDQUFpQztBQUNqQyxNQUFNO0FBQ04seUNBQXlDO0FBQ3pDLGFBQWE7QUFDYixVQUFVO0FBQ1Ysb0JBQW9CO0FBQ3BCLDBCQUEwQjtBQUMxQixnQ0FBZ0M7QUFDaEMsNEJBQTRCO0FBQzVCLDBCQUEwQjtBQUMxQixxQ0FBcUM7QUFFckMsMENBQTBDO0FBQzFDLDRCQUE0QjtBQUM1Qiw0Q0FBNEM7QUFDNUMsOEJBQThCO0FBQzlCLDRCQUE0QjtBQUU1Qix3QkFBd0I7QUFDeEIsaUdBQWlHO0FBQ2pHLFlBQVk7QUFDWixXQUFXO0FBQ1gsa0JBQWtCO0FBQ2xCLG1EQUFtRDtBQUNuRCxVQUFVO0FBQ1YsVUFBVTtBQUNWLDJCQUEyQjtBQUMzQixzQkFBc0I7QUFDdEIsK0NBQStDO0FBQy9DLDJCQUEyQjtBQUMzQixtQkFBbUI7QUFDbkIsNEJBQTRCO0FBQzVCLDBCQUEwQjtBQUMxQixXQUFXO0FBQ1gsc0JBQXNCO0FBQ3RCLCtDQUErQztBQUMvQywyQkFBMkI7QUFDM0IsbUJBQW1CO0FBQ25CLDRCQUE0QjtBQUM1QixpQ0FBaUM7QUFDakMsVUFBVTtBQUNWLFVBQVU7QUFDVixpQ0FBaUM7QUFDakMseUJBQXlCO0FBQ3pCLHVCQUF1QjtBQUN2QixVQUFVO0FBRVYsZ0RBQWdEO0FBQ2hELHlCQUF5QjtBQUN6QiwyQkFBMkI7QUFDM0IscURBQXFEO0FBQ3JELGlGQUFpRjtBQUNqRixzQkFBc0I7QUFDdEIsd0JBQXdCO0FBQ3hCLFlBQVk7QUFDWiw4QkFBOEI7QUFDOUIscURBQXFEO0FBQ3JELG9GQUFvRjtBQUNwRixzQkFBc0I7QUFDdEIsd0JBQXdCO0FBQ3hCLFlBQVk7QUFDWixVQUFVO0FBQ1Ysa0NBQWtDO0FBQ2xDLFVBQVU7QUFDVixNQUFNO0FBRU4sZUFBZTtBQUNmLDZCQUE2QjtBQUM3QixzQkFBc0I7QUFDdEIsc0JBQXNCO0FBRXRCLCtCQUErQjtBQUMvQixtQkFBbUI7QUFDbkIsTUFBTTtBQUNOLGtCQUFrQjtBQUNsQiw2QkFBNkI7QUFFN0Isc0JBQXNCO0FBQ3RCLHNCQUFzQjtBQUV0QiwrQkFBK0I7QUFDL0IsbUJBQW1CO0FBQ25CLE1BQU07QUFFTiwrQkFBK0I7QUFDL0IsdUJBQXVCO0FBRXZCLHFDQUFxQztBQUNyQywyQkFBMkI7QUFDM0IsK0JBQStCO0FBQy9CLGdDQUFnQztBQUVoQyxvQ0FBb0M7QUFDcEMsK0NBQStDO0FBQy9DLGtDQUFrQztBQUNsQyxZQUFZO0FBQ1osVUFBVTtBQUdWLG9DQUFvQztBQUVwQyxtQ0FBbUM7QUFDbkMsc0NBQXNDO0FBRXRDLHNDQUFzQztBQUN0QyxnREFBZ0Q7QUFFaEQsaUNBQWlDO0FBQ2pDLGlDQUFpQztBQUNqQyxVQUFVO0FBQ1YsUUFBUTtBQUNSLE1BQU07QUFFTixrQ0FBa0M7QUFDbEMsVUFBVTtBQUNWLHFCQUFxQjtBQUNyQiwyQkFBMkI7QUFFM0Isa0NBQWtDO0FBQ2xDLHlDQUF5QztBQUN6Qyx1QkFBdUI7QUFDdkIsZ0NBQWdDO0FBQ2hDLCtCQUErQjtBQUMvQixVQUFVO0FBQ1YsUUFBUTtBQUVSLGdDQUFnQztBQUNoQyxzQ0FBc0M7QUFDdEMsOENBQThDO0FBRTlDLCtCQUErQjtBQUMvQiwrQkFBK0I7QUFDL0IsUUFBUTtBQUNSLE1BQU07QUFFTiwyQkFBMkI7QUFDM0IsZ0NBQWdDO0FBQ2hDLDBDQUEwQztBQUMxQyxnQ0FBZ0M7QUFDaEMsZ0NBQWdDO0FBQ2hDLGlDQUFpQztBQUNqQyxzQ0FBc0M7QUFDdEMsa0NBQWtDO0FBQ2xDLDZDQUE2QztBQUM3QyxhQUFhO0FBQ2IsUUFBUTtBQUVSLElBQUk7QUFJSiw0R0FBNEc7QUFDNUcsK0JBQStCO0FBQy9CLHdDQUF3QztBQUN4Qyx1QkFBdUI7QUFDdkIsY0FBYztBQUNkLElBQUk7QUFDSiwySEFBMkg7QUFDM0gsUUFBUTtBQUNSLGdEQUFnRDtBQUNoRCx1QkFBdUI7QUFDdkIsc0NBQXNDO0FBQ3RDLFdBQVc7QUFDWCxzRUFBc0U7QUFDdEUsb0JBQW9CO0FBQ3BCLG1EQUFtRDtBQUNuRCw2Q0FBNkM7QUFDN0MsMEJBQTBCO0FBQzFCLDJDQUEyQztBQUMzQyxvRkFBb0Y7QUFDcEYsb0ZBQW9GO0FBQ3BGLGNBQWM7QUFDZCw4QkFBOEI7QUFDOUIsa0VBQWtFO0FBQ2xFLGFBQWE7QUFDYix1QkFBdUI7QUFDdkIsd0RBQXdEO0FBQ3hELDZCQUE2QjtBQUM3QixxREFBcUQ7QUFDckQsc0RBQXNEO0FBQ3RELGtEQUFrRDtBQUNsRCw4QkFBOEI7QUFDOUIsd0RBQXdEO0FBQ3hELCtDQUErQztBQUMvQyxrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ2hCLGNBQWM7QUFDZCxZQUFZO0FBQ1osV0FBVztBQUNYLHVCQUF1QjtBQUN2Qiw2QkFBNkI7QUFDN0IseUJBQXlCO0FBQ3pCLG1CQUFtQjtBQUNuQixJQUFJIn0=