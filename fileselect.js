"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobileImageSelector = exports.MobImgSelector = exports.readFile = exports.Camera = exports.ImageSelector = exports.FileInput = void 0;
const galho_1 = require("galho");
const orray_1 = require("orray");
const inutil_1 = require("inutil");
const galhui_js_1 = require("./galhui.js");
const menu_js_1 = require("./menu.js");
const hover_js_1 = require("./hover.js");
class FileInput extends galho_1.E {
    constructor(dt) {
        super(dt);
        dt.value = (0, orray_1.default)(dt.value, {
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
            (0, orray_1.bind)(values, (0, galho_1.div)("bd" /* body */), {
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
                        (0, galhui_js_1.close)(() => (0, orray_1.remove)(values, file))
                    ]);
                },
                empty(active, s) {
                    s
                        .cls("lb" /* label */, active)
                        .set(active && (0, galhui_js_1.icon)(i.icon));
                }
            }),
            (0, menu_js_1.menubar)(i.submit && !i.autosubmit && this.bind((0, galhui_js_1.ibutton)("upload", null, () => this.submit()).cls("_a" /* accept */), (s) => { (0, galho_1.g)(s).prop("disabled", !values.length || values.every((value) => (0, inutil_1.isS)(value))); }, 'value'), (0, galhui_js_1.ibutton)('folder-open', null, () => this.input.e.click()), i.options, this.bind((0, galhui_js_1.close)(() => (0, orray_1.set)(values)), (s) => (0, galho_1.g)(s).prop("disabled", !values.length), 'value'))
        ]).prop("tabIndex", 0);
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
    //      img.prop('src', './img/util/pdf.svg');
    //      break;
    //    case 'docx':
    //    case 'doc':
    //      img.prop('src', './img/util/doc.svg');
    //      break;
    //    default:
    //      img.prop('src', './img/util/file.svg');
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
                    img.prop('src', e.target.result);
                };
                reader.readAsDataURL(file);
            }
            else
                img.prop('src', FileInput.filePath(file));
            return img;
        }
    }
];
class ImageSelector extends FileInput {
    constructor(i) {
        if (i.camera)
            i.options = [(0, galhui_js_1.ibutton)("camera", null, () => this.openCamera())];
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
    //    img.prop('src', request.filePath(value));
    //  } else {
    //    var reader = new FileReader();
    //    reader.onload = (e) => {
    //      img.prop('src', (<any>e.target).result);
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
                        (0, galhui_js_1.ibutton)('camera', galhui_js_1.w.save, () => {
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
    show() { return (0, hover_js_1.openModal)((0, inutil_1.ex)((0, hover_js_1.modal)(), { body: (0, galho_1.g)(this) })); }
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
            (0, galhui_js_1.ibutton)("edit", null, () => input.click())
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGVzZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQTBDO0FBQzFDLGlDQUFvRDtBQUNwRCxtQ0FBaUM7QUFDakMsMkNBQTJHO0FBQzNHLHVDQUE2QztBQUM3Qyx5Q0FBOEM7QUE2QjlDLE1BQWEsU0FBbUQsU0FBUSxTQUFrRDtJQTJCeEgsWUFBWSxFQUFLO1FBQ2YsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRVYsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFBLGVBQUssRUFBa0IsRUFBRSxDQUFDLEtBQUssRUFBRTtZQUMxQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksSUFBSSxZQUFZLElBQUksSUFBSSxFQUFFLENBQUMsVUFBVTtvQkFDdkMsVUFBVSxDQUFDLEdBQUcsRUFBRTt3QkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLHFDQUFxQztnQkFDckMsdURBQXVEO2dCQUV2RCxZQUFZO2dCQUNaLGlCQUFpQjtnQkFDakIsdUJBQXVCO2dCQUN2QiwyQkFBMkI7Z0JBQzNCLEtBQUs7Z0JBQ0wsR0FBRztnQkFDSCxPQUFPLElBQUksQ0FBQztZQUNkLENBQUM7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsSUFBSSxPQUFPLElBQUksQ0FBQztnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSTtRQUNGLElBQ0UsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQ1YsTUFBTSxH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