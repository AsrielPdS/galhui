import { delay, div, E, g, svg, wrap } from "galho";
import { orray } from "galho/orray.js";
import { assign, call, fmt, is, isS, t } from "galho/util.js";
import { $, cancel, close, confirm, hc, ibt, icon, mbitem, panel, w } from "./galhui.js";
import { modal, openModal, Select } from "./hover.js";
export const input = (type, name, ph, input) => g("input", { type, name, placeholder: ph }).c("_ in").on("input", input);
export const textarea = (name, ph, input) => g("textarea", { name, placeholder: ph }).c("_ in").on("input", input && (function () { input(this.value); }));
export const checkbox = (label, input, checked) => g("label", "_ cb", [g("input", { type: "checkbox", checked }).on("input", input && (function () { input(this.checked); })), label]);
export function search(input) {
    let t = g("input", { type: "search", placeholder: w.search }), i = icon($.i.search);
    input && delay(t, "input", $.delay, () => input(t.e.value));
    return (i ? div(0, [t, i]) : t).c("_ in");
}
export class Pagging extends E {
    view() {
        let i = this.i, pags, count = g('span'), total;
        if (i.setlimit) {
            var limits = new Select({
                value: i.limit,
                fluid: true,
                clear: false
            }, [
                i.min,
                i.min * 5,
                i.min * 10,
                i.min * 10,
                i.min * 20,
                [0, 'Mostrar todos']
            ]);
            g(limits).c("in");
        }
        return this.bind(div("_ bar pag", [
            i.extreme && mbitem($.i.first, null, () => this.set('pag', 1)),
            mbitem($.i.prev, null, () => this.set('pag', i.pag - 1)),
            output(),
            mbitem($.i.next, null, () => this.set('pag', i.pag + 1)),
            i.extreme && mbitem($.i.last, count, () => this.set('pag', pags)),
            limits && [
                g("hr"),
                limits.on('input', (value) => { this.set('limit', value); })
            ],
            i.viewtotal && [g("hr"), total = output()]
        ]), (s) => {
            if (i.viewtotal)
                total.set(`${Math.min(i.total - i.limit * (i.pag - 1), i.limit || i.total) || 0} / ${i.total || 0}`);
            pags = i.limit ? Math.ceil((i.total || 0) / i.limit) : 1;
            s.c("off" /* C.off */, !!(pags < 2 && i.hideOnSingle));
            let t = i.extreme ? 0 : 1;
            s.child(2 - t).set(i.pag);
            s.childs(0, 2 - t).p('disabled', i.pag == 1);
            s.childs(3 - t, 5 - t * 2).p('disabled', i.pag == pags);
            count.set(pags);
        });
    }
    get pags() {
        let { limit: l, total: t } = this.i;
        return l ? Math.ceil((t || 0) / l) : 1;
    }
}
export class ImgSelector extends E {
    view() {
        let i = this.i, input = g('input', { name: i.k, type: "file", accept: i.accept || "image/*" }).on("input", () => {
            this.set("value", input.e.files[0]);
            if (i.saveTo)
                this.submit(i.saveTo);
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
    submit(url) {
        return new Promise((resolve) => {
            let r = new XMLHttpRequest;
            r.withCredentials = true;
            r.onload = () => { resolve(r.responseText); };
            r.onprogress = e => {
                //TODO set busy
            };
            r.open("POST", url);
            r.send(this.i.value);
        });
    }
}
const lever = (name) => g("input", { type: "checkbox", name }).c("lv" /* C.lever */);
//#region output
export const label = (content) => g("label", "_ tag", content);
export const output = (...content) => g("span", "_ tag", content);
export const keyVal = (key, val) => g("span", "_ in", [key + ": ", val]);
export const message = (c, data) => div(hc("ms" /* C.message */), data).c(c);
export const errorMessage = (data) => message("_e" /* Color.error */, data);
/**@deprecated */
export const tip = (e, value) => e.p("title", value);
export class Output extends E {
    constructor(text, value, fmt) {
        super(isS(text) ? { text, value, fmt } : text);
    }
    get key() { return this.i.key; }
    get value() { return this.i.value; }
    set value(v) { this.set('value', v); }
    // value(): T;
    // value(value: T): this;
    // value(v?: T) {
    //   return isU(v) ? this.i.value : this.set('value', v);
    // }
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
        return panel([icon('camera'), w.camera], this.bind(div(), (s) => {
            switch (model.state) {
                case 1 /* CameraState.preview */:
                    s.set(g('img', {
                        src: model.value
                    }).css('width', '100%'));
                    if (stream)
                        stream.getVideoTracks().forEach(track => track.stop());
                    break;
                case 0 /* CameraState.asking */:
                    //s.set(button({
                    //  tag: 'h1',
                    //  cls: C.heading,
                    //  icon: 'camera-plus',
                    //  text: 'Confirme o acesso',
                    //  info: 'Precisa dar accesso a sua camera'
                    //}));
                    break;
                case 2 /* CameraState.error */:
                    //s.set(button({
                    //  tag: 'h1',
                    //  cls: C.heading,
                    //  icon: 'alert-circle',
                    //  text: 'Erro',
                    //  info: 'Erro na tentativa de aceder a camera'
                    //}));
                    break;
                case 3 /* CameraState.recording */:
                    s.set(output);
                    output.srcObject = stream;
                    output.play();
                    break;
                case 4 /* CameraState.inaccessible */:
                    //s.set(button({
                    //  tag: 'h1',
                    //  cls: C.heading,
                    //  icon: 'lock-alert',
                    //  text: 'N�o consegui acceder',
                    //  info: 'Precisa dar accesso a sua camera'
                    //}));
                    break;
            }
        }, 'state'), this.bind(div(), (s) => {
            switch (model.state) {
                case 3 /* CameraState.recording */:
                    s.set([
                        ibt('camera', w.save, () => {
                            var canvas = g('canvas').e, ctx = canvas.getContext("2d");
                            canvas.width = output.videoWidth;
                            canvas.height = output.videoHeight;
                            ctx.drawImage(output, 0, 0, canvas.width, canvas.height);
                            this.set({
                                state: 1 /* CameraState.preview */,
                                value: canvas.toDataURL()
                            });
                        })
                    ]);
                    break;
                case 1 /* CameraState.preview */:
                    s.set(confirm(() => g(this).d()()));
                    break;
                default:
            }
            if (g(this).d())
                s.add(cancel(() => g(this).d()()));
        }, 'state'));
    }
    /** */
    show() { return openModal(assign(modal(), { body: g(this) })); }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFxQixHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3ZFLE9BQU8sRUFBSyxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsTUFBTSxFQUFRLElBQUksRUFBRSxHQUFHLEVBQU8sRUFBRSxFQUFFLEdBQUcsRUFBTyxDQUFDLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUUsT0FBTyxFQUFFLENBQUMsRUFBSyxNQUFNLEVBQUUsS0FBSyxFQUFTLE9BQU8sRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBUSxNQUFNLEVBQVcsS0FBSyxFQUFRLENBQUMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN4SCxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFPdEQsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBYSxFQUFFLElBQVMsRUFBRSxFQUFRLEVBQUUsS0FBeUIsRUFBRSxFQUFFLENBQ3JGLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBRTNFLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFPLEVBQUUsS0FBMkIsRUFBRSxFQUFFLENBQzFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUs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