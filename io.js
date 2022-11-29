import { cl, clearEvent, delay, div, E, g, wrap } from "galho";
import { orray } from "galho/orray.js";
import { assign, call, fmt, isS, t } from "galho/util.js";
import { $, body, fluid, cancel, close, confirm, hc, ibt, icon, mbitem, menubar, panel, w } from "./galhui.js";
import { modal, openModal, Select } from "./hover.js";
import { kbHandler, list } from "./list.js";
import { anim } from "./util.js";
export const input = (type, name, ph, input) => g("input", { type, name, placeholder: ph }).c("_ in").on("input", input);
export const textarea = (name, ph, input) => g("textarea", { name, placeholder: ph }).c("_ in").on("input", input && (function () { input(this.value); }));
export const checkbox = (label, input) => g("label", hc("cb" /* checkbox */), [g("input", { type: "checkbox" }).on("input", input && (function () { input(this.checked); })), label]);
export function search(input) {
    let t = g("input", { type: "search", placeholder: w.search }), i = icon($.i.search);
    input && delay(t, "input", $.delay, () => input(t.e.value));
    return (i ? div(0, [t, i]) : t).c("_ in");
}
export function searcher(query) {
    let dt = orray(), menu = list({ kd: false, item: v => [div(0, v.name), g("span", "tag", ["NIF: ", v.nif])] }, dt).c("_ tip"), _, focus = () => _ ||= (menu.addTo(body),
        anim(() => body.contains(i) ? fluid(i.rect(), menu, "vc") : (_(), _ = null))), i = delay(g("input", { type: "search", placeholder: "NIF ou Nome da empresa" })
        .on({
        focus, blur() { _(); _ = null; },
        keydown(e) { kbHandler(dt, e, {}) && clearEvent(e); }
    }), "input", $.delay, async () => {
        if (i.e.value) {
            focus();
            dt.set(await query(i.e.value));
        }
        else {
            _?.();
            _ = null;
        }
    });
    return i;
}
export const lever = (name) => g("input", { type: "checkbox", name }).c("lv" /* lever */);
export class Pagging extends E {
    view() {
        let i = this.i, pags, count = g('span'), total;
        if (i.setlimit) {
            var limits = new Select({
                value: i.limit,
                fluid: true,
                clear: false,
            }, [
                i.minLimit,
                i.minLimit * 2,
                i.minLimit * 4,
                i.minLimit * 10,
                i.minLimit * 20,
                { key: 0, text: 'Mostrar todos' }
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
            s.c("off" /* off */, !!(pags < 2 && i.hideOnSingle));
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
export class FileInput extends E {
    input;
    static default = {
        icon: 'file-search',
        //render(value: IFile) {
        //  if (typeof value == 'string')
        //    var type = value.split('.').pop();
        //  else var type = value.type;
        //  var img = m('img');
        //  switch (type) {
        //    case 'pdf':
        //      img.p('src', './img/util/pdf.svg');
        //      break;
        //    case 'docx':
        //    case 'doc':
        //      img.p('src', './img/util/doc.svg');
        //      break;
        //    default:
        //      img.p('src', './img/util/file.svg');
        //      break;
        //  }
        //  return img;
        //}
    };
    constructor(dt) {
        super(dt);
        dt.value = orray(dt.value, {
            parse: (file, index) => {
                if (file instanceof Blob && dt.autosubmit)
                    setTimeout(() => {
                        this.submit(index, index + 1);
                    });
                //else if (typeof file == 'string') {
                //  let name = file.replace(/^.*[\\\/]/, '').split('.')
                //  file = {
                //    path: file,
                //    type: name.pop(),
                //    name: name.join('.'),
                //  }
                //}
                return file;
            }
        });
        this.on(e => {
            if ("value" in e)
                this.emit('input', dt.value.slice());
        });
    }
    view() {
        let i = this.i, values = i.value;
        return div(["fileSelector" /* fileSelector */, i.inline ? "inline" /* inline */ : ""], [
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
            values.bind(div("bd" /* body */), {
                insert(file) {
                    let tp = FileInput.getFileExt(file), prov;
                    for (let p of frp)
                        if (p.formats.indexOf(tp) != -1 && p.valid(file)) {
                            prov = p;
                            break;
                        }
                    //= model.render(value);
                    return div("i" /* item */, [
                        prov.render(file),
                        close(() => values.remove(file))
                    ]);
                },
                empty(active, s) {
                    s
                        .c("tag", active)
                        .set(active && icon(i.icon));
                }
            }),
            menubar(i.submit && !i.autosubmit && this.bind(ibt("upload", null, () => this.submit()).c("_a" /* accept */), (s) => { g(s).p("disabled", !values.length || values.every((value) => isS(value))); }, 'value'), ibt('folder-open', null, () => this.input.e.click()), i.options, this.bind(close(() => values.set()), (s) => g(s).p("disabled", !values.length), 'value'))
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
    static filePath;
    static getFileExt(file) {
        if (file instanceof File)
            return file.name.split('.').pop().toLowerCase();
        else if (typeof file == 'string')
            return file.replace(/^.*[\\\/]/, '').split('.').pop().toLowerCase();
        else if (file instanceof Blob)
            return file.type.split('/')[1];
        else
            return '';
    }
    static getFileName(file) {
        if (file instanceof File)
            return file.name;
        else if (typeof file == 'string')
            return file.replace(/^.*[\\\/]/, '');
        return '';
    }
}
//file Render Provedors
const frp = [
    {
        valid() { return true; },
        formats: ['pdf'],
        render(file) {
            return div(0, [
                g("img", { src: './img/util/pdf.svg' })
                    .css("height", $.rem * 4 + "px"),
                FileInput.getFileName(file)
            ]);
        }
    },
    {
        valid() { return true; },
        formats: ['docx', 'doc'],
        render(file) {
            return div(0, [
                g("img", { src: './img/util/doc.svg' })
                    .css("height", $.rem * 4 + "px"),
                FileInput.getFileName(file)
            ]);
        }
    },
    {
        valid() { return true; },
        formats: ['png', 'jpg', 'gif', 'svg', 'ico'],
        render(file) {
            var img = g('img');
            if (file instanceof Blob) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    img.p('src', e.target.result);
                };
                reader.readAsDataURL(file);
            }
            else
                img.p('src', FileInput.filePath(file));
            return img;
        }
    }
];
export class ImageSelector extends FileInput {
    constructor(i) {
        if (i.camera)
            i.options = [ibt("camera", null, () => this.openCamera())];
        super(i);
    }
    static default = {
        camera: true,
        accept: 'image/*',
        icon: 'image-search',
        //render(value: string | Blob) {
        //  var img = m('img');
        //  if (typeof value == 'string') {
        //    img.p('src', request.filePath(value));
        //  } else {
        //    var reader = new FileReader();
        //    reader.onload = (e) => {
        //      img.p('src', (<any>e.target).result);
        //    };
        //    reader.readAsDataURL(value);
        //  }
        //  return img;
        //}
    };
    //view() {
    //  return super.view();
    //}
    //view() {
    //    return this.viewdata((value) => {
    //    })
    //}
    async openCamera() {
        let i = this.i, camera = new Camera(i.format || {});
        await camera.show();
        if (camera.i.value)
            fetch(camera.i.value)
                .then(v => v.blob())
                .then(v => {
                i.multiple ?
                    i.value.push(v) :
                    i.value.set([v]);
            });
    }
}
export class Camera extends E {
    constructor(model) {
        super(model);
        model.state = model.value ? 1 /* preview */ : 0 /* asking */;
        this.on(e => {
            if ('value' in e)
                this.emit('input', e.value);
        });
    }
    view() {
        var model = this.i, output = g('video').css('width', '100%').e, stream;
        if (!navigator.mediaDevices)
            this.set('state', 2 /* error */);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((tempStream) => {
            stream = tempStream;
            this.set('state', 3 /* recording */);
        })
            .catch((e) => {
            this.set('state', 4 /* inaccessible */);
        });
        return panel([icon('camera'), w.camera], this.bind(div(), (s) => {
            switch (model.state) {
                case 1 /* preview */:
                    s.set(g('img', {
                        src: model.value
                    }).css('width', '100%'));
                    if (stream)
                        stream.getVideoTracks().forEach(track => track.stop());
                    break;
                case 0 /* asking */:
                    //s.set(button({
                    //  tag: 'h1',
                    //  cls: C.heading,
                    //  icon: 'camera-plus',
                    //  text: 'Confirme o acesso',
                    //  info: 'Precisa dar accesso a sua camera'
                    //}));
                    break;
                case 2 /* error */:
                    //s.set(button({
                    //  tag: 'h1',
                    //  cls: C.heading,
                    //  icon: 'alert-circle',
                    //  text: 'Erro',
                    //  info: 'Erro na tentativa de aceder a camera'
                    //}));
                    break;
                case 3 /* recording */:
                    s.set(output);
                    output.srcObject = stream;
                    output.play();
                    break;
                case 4 /* inaccessible */:
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
                case 3 /* recording */:
                    s.set([
                        ibt('camera', w.save, () => {
                            var canvas = g('canvas').e, ctx = canvas.getContext("2d");
                            canvas.width = output.videoWidth;
                            canvas.height = output.videoHeight;
                            ctx.drawImage(output, 0, 0, canvas.width, canvas.height);
                            this.set({
                                state: 1 /* preview */,
                                value: canvas.toDataURL()
                            });
                        })
                    ]);
                    break;
                case 1 /* preview */:
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
export const readFile = (file) => new Promise(cb => {
    var reader = new FileReader();
    reader.onload = (e) => {
        cb(reader.result);
    };
    reader.readAsDataURL(file);
});
/**image select for smartphone/tablet */
export class MobImgSelector extends E {
    view() {
        let i = this.i, bd = div("bd" /* body */), clear, emitInput = () => this.set("value", input.files[0]).emit("input", input.value), input = g("input", { type: 'file', accept: 'image/*' }).on("input", emitInput).e;
        return this.bind(div(hc("m" /* mobile */, "imgsel"), [
            input, bd,
            ibt("edit", null, () => input.click())
        ]), async (s) => {
            if (i.value) {
                s.prepend(clear ||= close(() => { input.value = null; emitInput(); }));
                bd.set(g("img", { src: await readFile(i.value) }));
            }
            else {
                clear && clear.remove();
                bd.set(icon(i.ph, "xl" /* xl */));
            }
        }, "value");
    }
}
export function mobileImageSelector() {
}
//#endregion
//#region output
export const label = (content) => g("label", "_ tag", content);
export const output = (...content) => g("span", "_ tag", content);
export const keyVal = (key, val) => g("span", "_ in", [key + ": ", val]);
export const message = (c, data) => div(hc("ms" /* message */), data).c(c);
export const errorMessage = (data) => message(data).c("_e" /* error */);
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
                .c(cl("in", i.color))
                .set([
                i.text, ': ',
                i.value == null ? i.def : i.fmt ? fmt(i.value, i.fmt) : i.value
            ]);
        });
    }
}
export const hidden = (head, body, open) => div(["_", "ac" /* accordion */], [
    head = div("hd" /* head */, [
        icon("menuR"),
        head
    ]).c("on" /* on */, !!open).on("click", () => head.tcls("on" /* on */)),
    wrap(body, "bd" /* body */)
]);
export function accordion(items, i = {}) {
    return orray(items).bind(div("_ accordion"), ([hd, bd], j, p) => {
        p.place(j * 2, [
            hd = div("hd" /* head */, [
                t(i.icon) && icon("menuR"),
                hd
            ]).c("on" /* on */, i.def == j).on("click", () => {
                if (hd.is('.' + "on" /* on */))
                    hd.c("on" /* on */, false);
                else {
                    t(i.single) && p.childs("." + "hd" /* head */).c("on" /* on */, false);
                    hd.c("on" /* on */);
                }
            }),
            wrap(bd, "bd" /* body */)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQVUsSUFBSSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3ZFLE9BQU8sRUFBSyxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsTUFBTSxFQUFRLElBQUksRUFBTyxHQUFHLEVBQVksR0FBRyxFQUFZLENBQUMsRUFBUSxNQUFNLGVBQWUsQ0FBQztBQUMvRixPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBSyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBUyxPQUFPLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQVEsTUFBTSxFQUFXLE9BQU8sRUFBRSxLQUFLLEVBQVEsQ0FBQyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzlJLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUM1QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBT2pDLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLElBQWEsRUFBRSxJQUFTLEVBQUUsRUFBUSxFQUFFLEtBQXlCLEVBQUUsRUFBRSxDQUNyRixDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUUzRSxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBTyxFQUFFLEtBQTJCLEVBQUUsRUFBRSxDQUMxRSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBSSxDQUFDLGNBQWMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFL0csTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBVSxFQUFFLEtBQStCLEVBQUUsRUFBRSxDQUN0RSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUscUJBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBSSxDQUFDLGNBQWMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUVwSSxNQUFNLFVBQVUsTUFBTSxDQUFDLEtBQTJCO0lBQ2hELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEYsS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM1RCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMs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