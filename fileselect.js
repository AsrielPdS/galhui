"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobileImageSelector = exports.MobImgSelector = exports.readFile = exports.Camera = exports.ImageSelector = exports.FileInput = void 0;
const galho_1 = require("galho");
const orray_1 = require("orray");
const inutil_1 = require("inutil");
const galhui_1 = require("./galhui");
const menubar_1 = require("./menubar");
const modal_1 = require("./modal");
class FileInput extends galho_1.E {
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
                        (0, galhui_1.close)(() => (0, orray_1.remove)(values, file))
                    ]);
                },
                empty(active, s) {
                    s
                        .cls("lb" /* label */, active)
                        .set(active && (0, galhui_1.icon)(i.icon));
                }
            }),
            (0, menubar_1.menubar)(i.submit && !i.autosubmit && this.bind((0, galhui_1.ibutton)("upload", null, () => this.submit()).cls("_a" /* accept */), (s) => { (0, galho_1.g)(s).prop("disabled", !values.length || values.every((value) => (0, inutil_1.isS)(value))); }, 'value'), (0, galhui_1.ibutton)('folder-open', null, () => this.input.e.click()), i.options, this.bind((0, galhui_1.close)(() => (0, orray_1.set)(values)), (s) => (0, galho_1.g)(s).prop("disabled", !values.length), 'value'))
        ]).prop("tabIndex", 0);
    }
    file() {
        return (0, galho_1.div)('file', [
            (0, galhui_1.icon)(null)
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
exports.FileInput = FileInput;
//file Render Provedors
const frp = [
    {
        valid() { return true; },
        formats: ['pdf'],
        render(file) {
            return (0, galho_1.div)(0, [
                (0, galho_1.g)("img", { src: './img/util/pdf.svg' })
                    .css("height", galhui_1.$.rem * 4 + "px"),
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
                    .css("height", galhui_1.$.rem * 4 + "px"),
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
            i.options = [(0, galhui_1.ibutton)("camera", null, () => this.openCamera())];
        super(i);
    }
    static default = {
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
        return (0, galhui_1.panel)([(0, galhui_1.icon)('camera'), galhui_1.w.camera], this.bind((0, galho_1.div)(), (s) => {
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
                        (0, galhui_1.ibutton)('camera', galhui_1.w.save, () => {
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
                    s.set((0, galhui_1.confirm)(() => (0, galho_1.g)(this).d()()));
                    break;
                default:
            }
            if ((0, galho_1.g)(this).d())
                s.add((0, galhui_1.cancel)(() => (0, galho_1.g)(this).d()()));
        }, 'state'));
    }
    /** */
    show() { return (0, modal_1.openModal)((0, inutil_1.ex)((0, modal_1.modal)(), { body: (0, galho_1.g)(this) })); }
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
        return this.bind((0, galho_1.div)((0, galhui_1.hc)("m" /* mobile */, "imgsel"), [
            input, bd,
            (0, galhui_1.ibutton)("edit", null, () => input.click())
        ]), async (s) => {
            if (i.value) {
                s.prepend(clear ||= (0, galhui_1.close)(() => { input.value = null; emitInput(); }));
                bd.set((0, galho_1.g)("img", { src: await (0, exports.readFile)(i.value) }));
            }
            else {
                clear && clear.remove();
                bd.set((0, galhui_1.icon)(i.ph, "xl" /* xl */));
            }
        }, "value");
    }
}
exports.MobImgSelector = MobImgSelector;
function mobileImageSelector() {
}
exports.mobileImageSelector = mobileImageSelector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGVzZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQTBDO0FBQzFDLGlDQUFvRDtBQUNwRCxtQ0FBaUM7QUFDakMscUNBQXdHO0FBQ3hHLHVDQUEyQztBQUMzQyxtQ0FBMkM7QUE2QjNDLE1BQWEsU0FBbUQsU0FBUSxTQUFrRDtJQUN4SCxLQUFLLENBQXNCO0lBRTNCLE1BQU0sQ0FBQyxPQUFPLEdBQTJCO1FBQ3ZDLElBQUksRUFBRSxhQUFhO1FBQ25CLHdCQUF3QjtRQUN4QixpQ0FBaUM7UUFDakMsd0NBQXdDO1FBQ3hDLCtCQUErQjtRQUMvQix1QkFBdUI7UUFDdkIsbUJBQW1CO1FBQ25CLGlCQUFpQjtRQUNqQiw4Q0FBOEM7UUFDOUMsY0FBYztRQUVkLGtCQUFrQjtRQUNsQixpQkFBaUI7UUFDakIsOENBQThDO1FBQzlDLGNBQWM7UUFFZCxjQUFjO1FBQ2QsK0NBQStDO1FBQy9DLGNBQWM7UUFDZCxLQUFLO1FBQ0wsZUFBZTtRQUNmLEdBQUc7S0FDSixDQUFDO0lBQ0YsWUFBWSxFQUFLO1FBQ2YsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRVYsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFBLGVBQUssRUFBa0IsRUFBRSxDQUFDLEtBQUssRUFBRTtZQUMxQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksSUFBSSxZQUFZLElBQUksSUFBSSxFQUFFLENBQUMsVUFBVTtvQkFDdkMsVUFBVSxDQUFDLEdBQUcsRUFBRTt3QkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLHFDQUFxQztnQkFDckMsdURBQXVEO2dCQUV2RCxZQUFZO2dCQUNaLGlCQUFpQjtnQkFDakIsdUJBQXVCO2dCQUN2QiwyQkFB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