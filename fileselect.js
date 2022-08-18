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
        dt.value = (0, orray_1.orray)(dt.value, {
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
                        .cls("lb" /* label */, active)
                        .set(active && (0, galhui_js_1.icon)(i.icon));
                }
            }),
            (0, menu_js_1.menubar)(i.submit && !i.autosubmit && this.bind((0, galhui_js_1.ibt)("upload", null, () => this.submit()).cls("_a" /* accept */), (s) => { (0, galho_1.g)(s).prop("disabled", !values.length || values.every((value) => (0, inutil_1.isS)(value))); }, 'value'), (0, galhui_js_1.ibt)('folder-open', null, () => this.input.e.click()), i.options, this.bind((0, galhui_js_1.close)(() => values.set()), (s) => (0, galho_1.g)(s).prop("disabled", !values.length), 'value'))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGVzZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQTBDO0FBQzFDLGlDQUFpQztBQUNqQyxtQ0FBaUM7QUFDakMsMkNBQXVHO0FBQ3ZHLHVDQUE2QztBQUM3Qyx5Q0FBOEM7QUE2QjlDLE1BQWEsU0FBbUQsU0FBUSxTQUFrRDtJQTJCeEgsWUFBWSxFQUFLO1FBQ2YsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRVYsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFBLGFBQUssRUFBa0IsRUFBRSxDQUFDLEtBQUssRUFBRTtZQUMxQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksSUFBSSxZQUFZLElBQUksSUFBSSxFQUFFLENBQUMsVUFBVTtvQkFDdkMsVUFBVSxDQUFDLEdBQUcsRUFBRTt3QkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLHFDQUFxQztnQkFDckMsdURBQXVEO2dCQUV2RCxZQUFZO2dCQUNaLGlCQUFpQjtnQkFDakIsdUJBQXVCO2dCQUN2QiwyQkFBMkI7Z0JBQzNCLEtBQUs7Z0JBQ0wsR0FBRztnQkFDSCxPQUFPLElBQUksQ0FBQztZQUNkLENBQUM7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsSUFBSSxPQUFPLElBQUksQ0FBQztnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSTtRQUNGLElBQ0UsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQ1YsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDbkIsT0FBTyxJQUFBLFdBQUcsRUFBQyxvQ0FBaUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLHVCQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNyRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRTtnQkFDdEIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNO2dCQUNoQixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7YUFDckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxDQUFDLFFBQVE7b0JBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztvQkFFZixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLENBQUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBQSxXQUFHLGtCQUFRLEVBQUU7Z0JBQ3ZCLE1BQU0sQ0FBQyxJQUFJO29CQUNULElBQ0UsRUFBRSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQy9CLElBQXlCLENBQUM7b0JBQzVCLEtBQUssSUFBSSxDQUFDLElBQUksR0FBRzt3QkFDZixJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7NEJBQ2hELElBQUksR0FBRyxDQUFDLENBQUM7NEJBQ1QsTUFBTTt5QkFDUDtvQkFDSCx3QkFBd0I7b0JBQ3hCLE9BQU8sSUFBQSxXQUFHLGtCQUFTO3dCQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDakIsSUFBQSxpQkFBSyxFQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ2pDLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUNELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDYixDQUFDO3lCQUNFLEdBQUcsbUJBQVUsTUFBTSxDQUFDO3lCQUNwQixHQUFHLENBQUMsTUFBTSxJQUFJLElBQUEsZ0JBQUksRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQzthQUNGLENBQUM7WUFDRixJQUFBLGlCQUFPLEVBQ0wsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFBLGVBQUcsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsbUJBQWMsRUFDL0YsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUEsU0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUEsWUFBRyxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQ2xHLEVBQ0QsSUFBQSxlQUFHLEVBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUNwRCxDQUFDLENBQUMsT0FBYyxFQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUEsaUJBQUssRUFBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBQSxTQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FDNUY7U0FDRixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSTtRQUNGLE9BQU8sSUFBQSxXQUFHLEVBQUMsTUFBTSxFQUFFO1lBQ2pCLElBQUEsZ0JBQUksRUFBQyxJQUFJLENBQUM7U0FDWCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQWEsRUFBRSxFQUFXO1FBQy9CLElBQ0UsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUNyQixHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFPLENBQUMsQ0FBQyxFQUFhLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUM7UUFFakYsSUFBSSxHQUFHLENBQUMsTUFBTTtZQUNaLE9BQU8sU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDckMsZ0JBQWdCO1lBQ2xCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNqQiw2Q0FBNkM7Z0JBQzdDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzlDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLElBQUksRUFBRTs0QkFDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdEIsTUFBTTt5QkFDUDtxQkFDRjtpQkFDRjtnQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFLRCxNQUFNLENBQUMsVUFBVSxDQUFDLElBQWE7UUFDN0IsSUFBSSxJQUFJLFlBQVksSUFBSTtZQUN0QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBRTdDLElBQUksT0FBTyxJQUFJLElBQUksUUFBUTtZQUM5QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTthQUVoRSxJQUFJLElBQUksWUFBWSxJQUFJO1lBQzNCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBRTVCLE9BQU8sRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDLElBQWE7UUFDOUIsSUFBSSxJQUFJLFlBQVksSUFBSTtZQUN0QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDZCxJQUFJLE9BQU8sSUFBSSxJQUFJLFFBQVE7WUFDOUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUN0QyxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7O0FBdkpILDhCQXdKQztBQXJKUSxpQkFBTyxHQUEyQjtJQUN2QyxJQUFJLEVBQUUsYUFBYTtJQUNuQix3QkFBd0I7SUFDeEIsaUNBQWlDO0lBQ2pDLHdDQUF3QztJQUN4QywrQkFBK0I7SUFDL0IsdUJBQXVCO0lBQ3ZCLG1CQUFtQjtJQUNuQixpQkFBaUI7SUFDakIsOENBQThDO0lBQzlDLGNBQWM7SUFFZCxrQkFBa0I7SUFDbEIsaUJBQWlCO0lBQ2pCLDhDQUE4QztJQUM5QyxjQUFjO0lBRWQsY0FBYztJQUNkLCtDQUErQztJQUMvQyxjQUFjO0lBQ2QsS0FBSztJQUNMLGVBQWU7SUFDZixHQUFHO0NBQ0osQ0FBQztBQWlJSix1QkFBdUI7QUFDdkIsTUFBTSxHQUFHLEdBQTBCO0lBQ2pDO1FBQ0UsS0FBSyxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4QixPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDaEIsTUFBTSxDQUFDLElBQUk7WUFDVCxPQUFPLElBQUEsV0FBRyxFQUFDLENBQUMsRUFBRTtnQkFDWixJQUFBLFNBQUMsRUFBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQztxQkFDcEMsR0FBRyxDQUFDLFFBQVEsRUFBRSxhQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ2xDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2FBQzVCLENBQUMsQ0FBQztRQUNMLENBQUM7S0FDRjtJQUNEO1FBQ0UsS0FBSyxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4QixPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJO1lBQ1QsT0FBTyxJQUFBLFdBQUcsRUFBQyxDQUFDLEVBQUU7Z0JBQ1osSUFBQSxTQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLG9CQUFvQixFQUFFLENBQUM7cUJBQ3BDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsYUFBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNsQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQzthQUM1QixDQUFDLENBQUM7UUFDTCxDQUFDO0tBQ0Y7SUFDRDtRQUNFLEtBQUssS0FBSyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEIsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztRQUM1QyxNQUFNLENBQUMsSUFBSTtZQUNULElBQUksR0FBRyxHQUFHLElBQUEsU0FBQyxFQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLElBQUksSUFBSSxZQUFZLElBQUksRUFBRTtnQkFDeEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztnQkFDOUIsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNwQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRyxDQUFDLENBQUMsTUFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QyxDQUFDLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1Qjs7Z0JBQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztLQUNGO0NBQ0YsQ0FBQztBQVVGLE1BQWEsYUFBYyxTQUFRLFNBQXlCO0lBQzFELFlBQVksQ0FBaUI7UUFDM0IsSUFBSSxDQUFDLENBQUMsTUFBTTtZQUNWLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFBLGVBQUcsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQW1CRCxVQUFVO0lBQ1Ysd0JBQXdCO0lBQ3hCLEdBQUc7SUFDSCxVQUFVO0lBQ1YsdUNBQXVDO0lBRXZDLFFBQVE7SUFDUixHQUFHO0lBRUgsS0FBSyxDQUFDLFVBQVU7UUFDZCxJQUNFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUNWLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRXRDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLO1lBQ2hCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztpQkFDbEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNuQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNWLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7O0FBL0NILHNDQWdEQztBQTFDUSxxQkFBTyxHQUE0QjtJQUN4QyxNQUFNLEVBQUUsSUFBSTtJQUNaLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLElBQUksRUFBRSxjQUFjO0lBQ3BCLGdDQUFnQztJQUNoQyx1QkFBdUI7SUFDdkIsbUNBQW1DO0lBQ25DLCtDQUErQztJQUMvQyxZQUFZO0lBQ1osb0NBQW9DO0lBQ3BDLDhCQUE4QjtJQUM5QixnREFBZ0Q7SUFDaEQsUUFBUTtJQUNSLGtDQUFrQztJQUNsQyxLQUFLO0lBQ0wsZUFBZTtJQUNmLEdBQUc7Q0FDSixDQUFDO0FBb0RKLE1BQWEsTUFBTyxTQUFRLFNBQThCO0lBRXhELFlBQVksS0FBYztRQUN4QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFYixLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxpQkFBcUIsQ0FBQyxlQUFtQixDQUFDO1FBRXJFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDVixJQUFJLE9BQU8sSUFBSSxDQUFDO2dCQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxJQUFJO1FBQ0YsSUFDRSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFDZCxNQUFNLEdBQUcsSUFBQSxTQUFDLEVBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQzFDLE1BQW1CLENBQUM7UUFFdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZO1lBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxnQkFBb0IsQ0FBQztRQUV2QyxTQUFTLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUNqRCxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUNuQixNQUFNLEdBQUcsVUFBVSxDQUFDO1lBRXBCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxvQkFBd0IsQ0FBQztRQUMzQyxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyx1QkFBMkIsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztRQUVMLE9BQU8sSUFBQSxpQkFBSyxFQUNWLENBQUMsSUFBQSxnQkFBSSxFQUFDLFFBQVEsQ0FBQyxFQUFFLGFBQUMsQ0FBQyxNQUFNLENBQUMsRUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFBLFdBQUcsR0FBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFHckIsUUFBUSxLQUFLLENBQUMsS0FBSyxFQUFFO2dCQUNuQjtvQkFDRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUEsU0FBQyxFQUFDLEtBQUssRUFBRTt3QkFDYixHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUs7cUJBQ2pCLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksTUFBTTt3QkFDUixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7b0JBRXpELE1BQU07Z0JBQ1I7b0JBQ0UsZ0JBQWdCO29CQUNoQixjQUFjO29CQUNkLG1CQUFtQjtvQkFDbkIsd0JBQXdCO29CQUN4Qiw4QkFBOEI7b0JBQzlCLDRDQUE0QztvQkFDNUMsTUFBTTtvQkFDTixNQUFNO2dCQUNSO29CQUNFLGdCQUFnQjtvQkFDaEIsY0FBYztvQkFDZCxtQkFBbUI7b0JBQ25CLHlCQUF5QjtvQkFDekIsaUJBQWlCO29CQUNqQixnREFBZ0Q7b0JBQ2hELE1BQU07b0JBQ04sTUFBTTtnQkFFUjtvQkFDRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNkLE1BQU0sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO29CQUMxQixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBRWQsTUFBTTtnQkFDUjtvQkFDRSxnQkFBZ0I7b0JBQ2hCLGNBQWM7b0JBQ2QsbUJBQW1CO29CQUNuQix1QkFBdUI7b0JBQ3ZCLGlDQUFpQztvQkFDakMsNENBQTRDO29CQUM1QyxNQUFNO29CQUNOLE1BQU07YUFFVDtRQUNILENBQUMsRUFBRSxPQUFPLENBQUMsRUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUEsV0FBRyxHQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNyQixRQUFRLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQ25CO29CQUNFLENBQUMsQ0FBQyxHQUFHLENBQUM7d0JBQ0osSUFBQSxlQUFHLEVBQUMsUUFBUSxFQUFFLGFBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFOzRCQUN6QixJQUNFLE1BQU0sR0FBRyxJQUFBLFNBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQ3RCLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUVoQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7NEJBQ2pDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQzs0QkFDbkMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFFekQsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQ0FDUCxLQUFLLGlCQUFxQjtnQ0FDMUIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUU7NkJBQzFCLENBQUMsQ0FBQzt3QkFDTCxDQUFDLENBQUM7cUJBQ0gsQ0FBQyxDQUFDO29CQUNILE1BQU07Z0JBQ1I7b0JBQ0UsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFBLG1CQUFPLEVBQUMsR0FBRyxFQUFFLENBQU8sSUFBQSxTQUFDLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzNDLE1BQU07Z0JBQ1IsUUFBUTthQUNUO1lBQ0QsSUFBSSxJQUFBLFNBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGtCQUFNLEVBQUMsR0FBRyxFQUFFLENBQU8sSUFBQSxTQUFDLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUNaLENBQUM7SUFDSixDQUFDO0lBQ0QsTUFBTTtJQUNOLElBQUksS0FBSyxPQUFPLElBQUEsb0JBQVMsRUFBQyxJQUFBLFdBQUUsRUFBQyxJQUFBLGdCQUFLLEdBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFBLFNBQUMsRUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDN0Q7QUFsSEQsd0JBa0hDO0FBQ00sTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFNLEVBQUUsQ0FBQyxFQUFFO0lBQzVELElBQUksTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7SUFDOUIsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBYSxDQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUFDO0lBQ0YsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixDQUFDLENBQUMsQ0FBQztBQU5VLFFBQUEsUUFBUSxZQU1sQjtBQU1ILHdDQUF3QztBQUV4QyxNQUFhLGNBQWUsU0FBUSxTQUFrQztJQUNwRSxJQUFJO1FBQ0YsSUFDRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFDVixFQUFFLEdBQUcsSUFBQSxXQUFHLGtCQUFRLEVBQ2hCLEtBQVEsRUFDUixTQUFTLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUM5RSxLQUFLLEdBQXFCLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckcsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUEsV0FBRyxFQUFDLElBQUEsY0FBRSxvQkFBVyxRQUFRLENBQUMsRUFBRTtZQUMzQyxLQUFLLEVBQUUsRUFBRTtZQUNULElBQUEsZUFBRyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3ZDLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7WUFDWixJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ1gsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEtBQUwsS0FBSyxHQUFLLElBQUEsaUJBQUssRUFBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQTtnQkFDckUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFBLFNBQUMsRUFBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO2FBQ25EO2lCQUNJO2dCQUNILEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3hCLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBQSxnQkFBSSxFQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFVLENBQUMsQ0FBQzthQUM3QjtRQUVILENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNiLENBQUM7Q0FDRjtBQXZCRCx3Q0F1QkM7QUFDRCxTQUFnQixtQkFBbUI7QUFFbkMsQ0FBQztBQUZELGtEQUVDIn0=