import { cl, clearEvent, delay, div, E, g, wrap } from "galho";
import { orray } from "galho/orray.js";
import { assign, fmt, isS, t } from "galho/util.js";
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
                        .c("lb" /* label */, active)
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
export const label = (content) => g("label", hc("lb" /* label */), content);
export const output = (...content) => g("span", hc("lb" /* label */), content);
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
export function tab() {
    let hd = div("_ tab bar", items.map(([h, b]) => div("i", h).on("click", () => {
        d.set([hd, b]);
        hd.childs().c("on", false);
    }))), d = div("_ tab");
    return d;
}
//#endregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQVUsSUFBSSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3ZFLE9BQU8sRUFBSyxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsTUFBTSxFQUFhLEdBQUcsRUFBTyxHQUFHLEVBQVksQ0FBQyxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFLLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFTLE9BQU8sRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBUSxNQUFNLEVBQVcsT0FBTyxFQUFFLEtBQUssRUFBUSxDQUFDLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDOUksT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQzVDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFPakMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBYSxFQUFFLElBQVMsRUFBRSxFQUFRLEVBQUUsS0FBeUIsRUFBRSxFQUFFLENBQ3JGLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBRTNFLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFPLEVBQUUsS0FBMkIs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