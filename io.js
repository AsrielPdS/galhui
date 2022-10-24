"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accordion = exports.hidden = exports.Output = exports.tip = exports.errorMessage = exports.message = exports.keyVal = exports.output = exports.label = exports.mobileImageSelector = exports.MobImgSelector = exports.readFile = exports.Camera = exports.ImageSelector = exports.FileInput = exports.Pagging = exports.lever = exports.searcher = exports.search = exports.checkbox = exports.textarea = exports.input = void 0;
const galho_1 = require("galho");
const orray_js_1 = require("galho/orray.js");
const util_js_1 = require("galho/util.js");
const galhui_js_1 = require("./galhui.js");
const hover_js_1 = require("./hover.js");
const list_js_1 = require("./list.js");
const util_js_2 = require("./util.js");
const input = (type, name, ph, input) => (0, galho_1.g)("input", { type, name, placeholder: ph }).c("_ in").on("input", input);
exports.input = input;
const textarea = (name, ph, input) => (0, galho_1.g)("textarea", { name, placeholder: ph }).c("_ in").on("input", input && (function () { input(this.value); }));
exports.textarea = textarea;
const checkbox = (label, input) => (0, galho_1.g)("label", (0, galhui_js_1.hc)("cb" /* checkbox */), [(0, galho_1.g)("input", { type: "checkbox" }).on("input", input && (function () { input(this.checked); })), label]);
exports.checkbox = checkbox;
function search(input) {
    let t = (0, galho_1.g)("input", { type: "search", placeholder: galhui_js_1.w.search }), i = (0, galhui_js_1.icon)(galhui_js_1.$.i.search);
    input && (0, galho_1.delay)(t, "input", galhui_js_1.$.delay, () => input(t.e.value));
    return (i ? (0, galho_1.div)(0, [t, i]) : t).c("_ in");
}
exports.search = search;
function searcher(query) {
    let dt = (0, orray_js_1.orray)(), menu = (0, list_js_1.list)({ kd: false, item: v => [(0, galho_1.div)(0, v.name), (0, galho_1.g)("span", "tag", ["NIF: ", v.nif])] }, dt).c("_ tip"), _, focus = () => _ || (_ = (menu.addTo(galhui_js_1.body),
        (0, util_js_2.anim)(() => galhui_js_1.body.contains(i) ? (0, galhui_js_1.fluid)(i.rect(), menu, "vc") : (_(), _ = null)))), i = (0, galho_1.delay)((0, galho_1.g)("input", { type: "search", placeholder: "NIF ou Nome da empresa" })
        .on({
        focus, blur() { _(); _ = null; },
        keydown(e) { (0, list_js_1.kbHandler)(dt, e, {}) && (0, galho_1.clearEvent)(e); }
    }), "input", galhui_js_1.$.delay, async () => {
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
exports.searcher = searcher;
const lever = (name) => (0, galho_1.g)("input", { type: "checkbox", name }).c("lv" /* lever */);
exports.lever = lever;
class Pagging extends galho_1.E {
    view() {
        let i = this.i, pags, count = (0, galho_1.g)('span'), total;
        if (i.setlimit) {
            var limits = new hover_js_1.Select({
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
            (0, galho_1.g)(limits).c("in");
        }
        return this.bind((0, galho_1.div)("_ bar pag", [
            i.extreme && (0, galhui_js_1.mbitem)(galhui_js_1.$.i.first, null, () => this.set('pag', 1)),
            (0, galhui_js_1.mbitem)(galhui_js_1.$.i.prev, null, () => this.set('pag', i.pag - 1)),
            (0, exports.output)(),
            (0, galhui_js_1.mbitem)(galhui_js_1.$.i.next, null, () => this.set('pag', i.pag + 1)),
            i.extreme && (0, galhui_js_1.mbitem)(galhui_js_1.$.i.last, count, () => this.set('pag', pags)),
            limits && [
                (0, galho_1.g)("hr"),
                limits.on('input', (value) => { this.set('limit', value); })
            ],
            i.viewtotal && [(0, galho_1.g)("hr"), total = (0, exports.output)()]
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
exports.Pagging = Pagging;
class FileInput extends galho_1.E {
    constructor(dt) {
        super(dt);
        dt.value = (0, orray_js_1.orray)(dt.value, {
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
        return (0, galho_1.div)(["fileSelector" /* fileSelector */, i.inline ? "inline" /* inline */ : ""], [
            this.input = (0, galho_1.g)('input', {
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
            values.bind((0, galho_1.div)("bd" /* body */), {
                insert(file) {
                    let tp = FileInput.getFileExt(file), prov;
                    for (let p of frp)
                        if (p.formats.indexOf(tp) != -1 && p.valid(file)) {
                            prov = p;
                            break;
                        }
                    //= model.render(value);
                    return (0, galho_1.div)("i" /* item */, [
                        prov.render(file),
                        (0, galhui_js_1.close)(() => values.remove(file))
                    ]);
                },
                empty(active, s) {
                    s
                        .c("lb" /* label */, active)
                        .set(active && (0, galhui_js_1.icon)(i.icon));
                }
            }),
            (0, galhui_js_1.menubar)(i.submit && !i.autosubmit && this.bind((0, galhui_js_1.ibt)("upload", null, () => this.submit()).c("_a" /* accept */), (s) => { (0, galho_1.g)(s).p("disabled", !values.length || values.every((value) => (0, util_js_1.isS)(value))); }, 'value'), (0, galhui_js_1.ibt)('folder-open', null, () => this.input.e.click()), i.options, this.bind((0, galhui_js_1.close)(() => values.set()), (s) => (0, galho_1.g)(s).p("disabled", !values.length), 'value'))
        ]).p("tabIndex", 0);
    }
    file() {
        return (0, galho_1.div)('file', [
            (0, galhui_js_1.icon)(null)
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
exports.FileInput = FileInput;
FileInput.default = {
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
//file Render Provedors
const frp = [
    {
        valid() { return true; },
        formats: ['pdf'],
        render(file) {
            return (0, galho_1.div)(0, [
                (0, galho_1.g)("img", { src: './img/util/pdf.svg' })
                    .css("height", galhui_js_1.$.rem * 4 + "px"),
                FileInput.getFileName(file)
            ]);
        }
    },
    {
        valid() { return true; },
        formats: ['docx', 'doc'],
        render(file) {
            return (0, galho_1.div)(0, [
                (0, galho_1.g)("img", { src: './img/util/doc.svg' })
                    .css("height", galhui_js_1.$.rem * 4 + "px"),
                FileInput.getFileName(file)
            ]);
        }
    },
    {
        valid() { return true; },
        formats: ['png', 'jpg', 'gif', 'svg', 'ico'],
        render(file) {
            var img = (0, galho_1.g)('img');
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
class ImageSelector extends FileInput {
    constructor(i) {
        if (i.camera)
            i.options = [(0, galhui_js_1.ibt)("camera", null, () => this.openCamera())];
        super(i);
    }
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
exports.ImageSelector = ImageSelector;
ImageSelector.default = {
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
class Camera extends galho_1.E {
    constructor(model) {
        super(model);
        model.state = model.value ? 1 /* preview */ : 0 /* asking */;
        this.on(e => {
            if ('value' in e)
                this.emit('input', e.value);
        });
    }
    view() {
        var model = this.i, output = (0, galho_1.g)('video').css('width', '100%').e, stream;
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
        return (0, galhui_js_1.panel)([(0, galhui_js_1.icon)('camera'), galhui_js_1.w.camera], this.bind((0, galho_1.div)(), (s) => {
            switch (model.state) {
                case 1 /* preview */:
                    s.set((0, galho_1.g)('img', {
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
        }, 'state'), this.bind((0, galho_1.div)(), (s) => {
            switch (model.state) {
                case 3 /* recording */:
                    s.set([
                        (0, galhui_js_1.ibt)('camera', galhui_js_1.w.save, () => {
                            var canvas = (0, galho_1.g)('canvas').e, ctx = canvas.getContext("2d");
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
                    s.set((0, galhui_js_1.confirm)(() => (0, galho_1.g)(this).d()()));
                    break;
                default:
            }
            if ((0, galho_1.g)(this).d())
                s.add((0, galhui_js_1.cancel)(() => (0, galho_1.g)(this).d()()));
        }, 'state'));
    }
    /** */
    show() { return (0, hover_js_1.openModal)((0, util_js_1.assign)((0, hover_js_1.modal)(), { body: (0, galho_1.g)(this) })); }
}
exports.Camera = Camera;
const readFile = (file) => new Promise(cb => {
    var reader = new FileReader();
    reader.onload = (e) => {
        cb(reader.result);
    };
    reader.readAsDataURL(file);
});
exports.readFile = readFile;
/**image select for smartphone/tablet */
class MobImgSelector extends galho_1.E {
    view() {
        let i = this.i, bd = (0, galho_1.div)("bd" /* body */), clear, emitInput = () => this.set("value", input.files[0]).emit("input", input.value), input = (0, galho_1.g)("input", { type: 'file', accept: 'image/*' }).on("input", emitInput).e;
        return this.bind((0, galho_1.div)((0, galhui_js_1.hc)("m" /* mobile */, "imgsel"), [
            input, bd,
            (0, galhui_js_1.ibt)("edit", null, () => input.click())
        ]), async (s) => {
            if (i.value) {
                s.prepend(clear || (clear = (0, galhui_js_1.close)(() => { input.value = null; emitInput(); })));
                bd.set((0, galho_1.g)("img", { src: await (0, exports.readFile)(i.value) }));
            }
            else {
                clear && clear.remove();
                bd.set((0, galhui_js_1.icon)(i.ph, "xl" /* xl */));
            }
        }, "value");
    }
}
exports.MobImgSelector = MobImgSelector;
function mobileImageSelector() {
}
exports.mobileImageSelector = mobileImageSelector;
//#endregion
//#region output
const label = (content) => (0, galho_1.g)("label", (0, galhui_js_1.hc)("lb" /* label */), content);
exports.label = label;
const output = (...content) => (0, galho_1.g)("span", (0, galhui_js_1.hc)("lb" /* label */), content);
exports.output = output;
const keyVal = (key, val) => (0, galho_1.g)("span", "_ in", [key + ": ", val]);
exports.keyVal = keyVal;
const message = (c, data) => (0, galho_1.div)((0, galhui_js_1.hc)("ms" /* message */), data).c(c);
exports.message = message;
const errorMessage = (data) => (0, exports.message)(data).c("_e" /* error */);
exports.errorMessage = errorMessage;
const tip = (e, value) => e.p("title", value);
exports.tip = tip;
class Output extends galho_1.E {
    constructor(text, value, fmt) {
        super((0, util_js_1.isS)(text) ? { text, value, fmt } : text);
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
        return this.bind((0, galho_1.div)(), (s) => {
            s
                .attr("class", false)
                .c((0, galho_1.cl)("in", i.color))
                .set([
                i.text, ': ',
                i.value == null ? i.def : i.fmt ? (0, util_js_1.fmt)(i.value, i.fmt) : i.value
            ]);
        });
    }
}
exports.Output = Output;
const hidden = (head, body, open) => (0, galho_1.div)(["_", "ac" /* accordion */], [
    head = (0, galho_1.div)("hd" /* head */, [
        (0, galhui_js_1.icon)("menuR"),
        head
    ]).c("on" /* on */, !!open).on("click", () => head.tcls("on" /* on */)),
    (0, galho_1.wrap)(body, "bd" /* body */)
]);
exports.hidden = hidden;
function accordion(items, i = {}) {
    return (0, orray_js_1.orray)(items).bind((0, galho_1.div)("_ accordion"), ([hd, bd], j, p) => {
        p.place(j * 2, [
            hd = (0, galho_1.div)("hd" /* head */, [
                (0, util_js_1.t)(i.icon) && (0, galhui_js_1.icon)("menuR"),
                hd
            ]).c("on" /* on */, i.def == j).on("click", () => {
                if (hd.is('.' + "on" /* on */))
                    hd.c("on" /* on */, false);
                else {
                    (0, util_js_1.t)(i.single) && p.childs("." + "hd" /* head */).c("on" /* on */, false);
                    hd.c("on" /* on */);
                }
            }),
            (0, galho_1.wrap)(bd, "bd" /* body */)
        ]);
    });
}
exports.accordion = accordion;
//#endregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBdUU7QUFDdkUsNkNBQTBDO0FBQzFDLDJDQUFvRjtBQUNwRiwyQ0FBOEk7QUFDOUkseUNBQXNEO0FBQ3RELHVDQUE0QztBQUM1Qyx1Q0FBaUM7QUFPMUIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFhLEVBQUUsSUFBUyxFQUFFLEVBQVEsRUFBRSxLQUF5QixFQUFFLEVBQUUsQ0FDckYsSUFBQSxTQUFDLEVBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUQ5RCxRQUFBLEtBQUssU0FDeUQ7QUFFcEUsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBTyxFQUFFLEtBQTJCLEVBQUUsRUFBRSxDQUMxRSxJQUFBLFNBQUMsRUFBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsY0FBYyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQURsRyxRQUFBLFFBQVEsWUFDMEY7QUFFeEcsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFVLEVBQUUsS0FBK0IsRUFBRSxFQUFFLENBQ3RFLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFBLGNBQUUsc0JBQVksRUFBRSxDQUFDLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJ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QyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN0RyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUFDLENBQUMsa0JBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUUzQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN6QixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRTFCLENBQUMsQ0FBQyxNQUFNLENBQW9CLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLENBQUMsQ0FBQyxNQUFNLENBQW9CLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUM7WUFFM0UsS0FBSyxDQUFDLEdBQUcsQ0FB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