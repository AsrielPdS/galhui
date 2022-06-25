"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobileImageSelector = exports.MobImgSelector = exports.readFile = exports.Camera = exports.ImageSelector = exports.FileInput = void 0;
const galho_1 = require("galho");
const orray_1 = require("orray");
const inutil_1 = require("inutil");
const galhui_1 = require("./galhui");
const menu_1 = require("./menu");
const hover_1 = require("./hover");
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
            (0, menu_1.menubar)(i.submit && !i.autosubmit && this.bind((0, galhui_1.ibutton)("upload", null, () => this.submit()).cls("_a" /* accept */), (s) => { (0, galho_1.g)(s).prop("disabled", !values.length || values.every((value) => (0, inutil_1.isS)(value))); }, 'value'), (0, galhui_1.ibutton)('folder-open', null, () => this.input.e.click()), i.options, this.bind((0, galhui_1.close)(() => (0, orray_1.set)(values)), (s) => (0, galho_1.g)(s).prop("disabled", !values.length), 'value'))
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
    show() { return (0, hover_1.openModal)((0, inutil_1.ex)((0, hover_1.modal)(), { body: (0, galho_1.g)(this) })); }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGVzZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQTBDO0FBQzFDLGlDQUFvRDtBQUNwRCxtQ0FBaUM7QUFDakMscUNBQXdHO0FBQ3hHLGlDQUEwQztBQUMxQyxtQ0FBMkM7QUE2QjNDLE1BQWEsU0FBbUQsU0FBUSxTQUFrRDtJQUN4SCxLQUFLLENBQXNCO0lBRTNCLE1BQU0sQ0FBQyxPQUFPLEdBQTJCO1FBQ3ZDLElBQUksRUFBRSxhQUFhO1FBQ25CLHdCQUF3QjtRQUN4QixpQ0FBaUM7UUFDakMsd0NBQXdDO1FBQ3hDLCtCQUErQjtRQUMvQix1QkFBdUI7UUFDdkIsbUJBQW1CO1FBQ25CLGlCQUFpQjtRQUNqQiw4Q0FBOEM7UUFDOUMsY0FBYztRQUVkLGtCQUFrQjtRQUNsQixpQkFBaUI7UUFDakIsOENBQThDO1FBQzlDLGNBQWM7UUFFZCxjQUFjO1FBQ2QsK0NBQStDO1FBQy9DLGNBQWM7UUFDZCxLQUFLO1FBQ0wsZUFBZTtRQUNmLEdBQUc7S0FDSixDQUFDO0lBQ0YsWUFBWSxFQUFLO1FBQ2YsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRVYsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFBLGVBQUssRUFBa0IsRUFBRSxDQUFDLEtBQUssRUFBRTtZQUMxQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksSUFBSSxZQUFZLElBQUksSUFBSSxFQUFFLENBQUMsVUFBVTtvQkFDdkMsVUFBVSxDQUFDLEdBQUcsRUFBRTt3QkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLHFDQUFxQztnQkFDckMsdURBQXVEO2dCQUV2RCxZQUFZO2dCQUNaLGlCQUFpQjtnQkFDakIsdUJBQXVCO2dCQUN2QiwyQkFBMkI7Z0JBQzNCLEtBQUs7Z0JBQ0wsR0FBRztnQkFDSCxPQUFPLElBQUksQ0FBQztZQUNkLENBQUM7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsSUFBSSxPQUFPLElBQUksQ0FBQztnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSTtRQUNGLElBQ0UsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQ1YsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDbkIsT0FBTyxJQUFBLFdBQUcsRUFBQyxvQ0FBaUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLHVCQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNyRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRTtnQkFDdEIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNO2dCQUNoQixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7YUFDckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxDQUFDLFFBQVE7b0JBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztvQkFFZixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLENBQUMsQ0FBQztZQUNGLElBQUEsWUFBSSxFQUFDLE1BQU0sRUFBRSxJQUFBLFdBQUcsa0JBQVEsRUFBRTtnQkFDeEIsTUFBTSxDQUFDLElBQUk7b0JBQ1QsSUFDRSxFQUFFLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFDL0IsSUFBeUIsQ0FBQztvQkFDNUIsS0FBSyxJQUFJLENBQUMsSUFBSSxHQUFHO3dCQUNmLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTs0QkFDaEQsSUFBSSxHQUFHLENBQUMsQ0FBQzs0QkFDVCxNQUFNO3lCQUNQO29CQUNILHdCQUF3QjtvQkFDeEIsT0FBTyxJQUFBLFdBQUcsa0JBQVM7d0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO3dCQUNqQixJQUFBLGNBQUssRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLGNBQU0sRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQ2xDLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUNELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDYixDQUFDO3lCQUNFLEdBQUcsbUJBQVUsTUFBTSxDQUFDO3lCQUNwQixHQUFHLENBQUMsTUFBTSxJQUFJLElBQUEsYUFBSSxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO2FBQ0YsQ0FBQztZQUNGLElBQUEsY0FBTyxFQUNMLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBQSxnQkFBTyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsR0FBRyxtQkFBYyxFQUNuRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBQSxTQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBQSxZQUFHLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FDbEcsRUFDRCxJQUFBLGdCQUFPLEVBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUN4RCxDQUFDLENBQUMsT0FBYyxFQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUEsY0FBSyxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsV0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUEsU0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQzNGO1NBQ0YsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUk7UUFDRixPQUFPLElBQUEsV0FBRyxFQUFDLE1BQU0sRUFBRTtZQUNqQixJQUFBLGFBQUksRUFBQyxJQUFJLENBQUM7U0FDWCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQWEsRUFBRSxFQUFXO1FBQy9CLElBQ0UsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUNyQixHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFPLENBQUMsQ0FBQyxFQUFhLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUM7UUFFakYsSUFBSSxHQUFHLENBQUMsTUFBTTtZQUNaLE9BQU8sU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDckMsZ0JBQWdCO1lBQ2xCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNqQiw2Q0FBNkM7Z0JBQzdDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzlDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLElBQUksRUFBRTs0QkFDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdEIsTUFBTTt5QkFDUDtxQkFDRjtpQkFDRjtnQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxNQUFNLENBQUMsVUFBVSxDQUFtRztJQUNwSCxNQUFNLENBQUMsUUFBUSxDQUEyQjtJQUUxQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQWE7UUFDN0IsSUFBSSxJQUFJLFlBQVksSUFBSTtZQUN0QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBRTdDLElBQUksT0FBTyxJQUFJLElBQUksUUFBUTtZQUM5QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTthQUVoRSxJQUFJLElBQUksWUFBWSxJQUFJO1lBQzNCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBRTVCLE9BQU8sRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDLElBQWE7UUFDOUIsSUFBSSxJQUFJLFlBQVksSUFBSTtZQUN0QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDZCxJQUFJLE9BQU8sSUFBSSxJQUFJLFFBQVE7WUFDOUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUN0QyxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7O0FBdkpILDhCQXdKQztBQUdELHVCQUF1QjtBQUN2QixNQUFNLEdBQUcsR0FBMEI7SUFDakM7UUFDRSxLQUFLLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNoQixNQUFNLENBQUMsSUFBSTtZQUNULE9BQU8sSUFBQSxXQUFHLEVBQUMsQ0FBQyxFQUFFO2dCQUNaLElBQUEsU0FBQyxFQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxvQkFBb0IsRUFBRSxDQUFDO3FCQUNwQyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDbEMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7YUFDNUIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztLQUNGO0lBQ0Q7UUFDRSxLQUFLLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUk7WUFDVCxPQUFPLElBQUEsV0FBRyxFQUFDLENBQUMsRUFBRTtnQkFDWixJQUFBLFNBQUMsRUFBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQztxQkFDcEMsR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ2xDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2FBQzVCLENBQUMsQ0FBQztRQUNMLENBQUM7S0FDRjtJQUNEO1FBQ0UsS0FBSyxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4QixPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxJQUFJO1lBQ1QsSUFBSSxHQUFHLEdBQUcsSUFBQSxTQUFDLEVBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkIsSUFBSSxJQUFJLFlBQVksSUFBSSxFQUFFO2dCQUN4QixJQUFJLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO2dCQUM5QixNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ3BCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFHLENBQUMsQ0FBQyxNQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzVDLENBQUMsQ0FBQztnQkFDRixNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzVCOztnQkFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakQsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO0tBQ0Y7Q0FDRixDQUFDO0FBVUYsTUFBYSxhQUFjLFNBQVEsU0FBeUI7SUFDMUQsWUFBWSxDQUFpQjtRQUMzQixJQUFJLENBQUMsQ0FBQyxNQUFNO1lBQ1YsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUEsZ0JBQU8sRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNELE1BQU0sQ0FBQyxPQUFPLEdBQTRCO1FBQ3hDLE1BQU0sRUFBRSxJQUFJO1FBQ1osTUFBTSxFQUFFLFNBQVM7UUFDakIsSUFBSSxFQUFFLGNBQWM7UUFDcEIsZ0NBQWdDO1FBQ2hDLHVCQUF1QjtRQUN2QixtQ0FBbUM7UUFDbkMsK0NBQStDO1FBQy9DLFlBQVk7UUFDWixvQ0FBb0M7UUFDcEMsOEJBQThCO1FBQzlCLGdEQUFnRDtRQUNoRCxRQUFRO1FBQ1Isa0NBQWtDO1FBQ2xDLEtBQUs7UUFDTCxlQUFlO1FBQ2YsR0FBRztLQUNKLENBQUM7SUFDRixVQUFVO0lBQ1Ysd0JBQXdCO0lBQ3hCLEdBQUc7SUFDSCxVQUFVO0lBQ1YsdUNBQXVDO0lBRXZDLFFBQVE7SUFDUixHQUFHO0lBRUgsS0FBSyxDQUFDLFVBQVU7UUFDZCxJQUNFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUNWLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRXRDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLO1lBQ2hCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztpQkFDbEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNuQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNWLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7O0FBL0NILHNDQWdEQztBQTJCRCxNQUFhLE1BQU8sU0FBUSxTQUE4QjtJQUV4RCxZQUFZLEtBQWM7UUFDeEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWIsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsaUJBQXFCLENBQUMsZUFBbUIsQ0FBQztRQUVyRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsSUFBSSxPQUFPLElBQUksQ0FBQztnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsSUFBSTtRQUNGLElBQ0UsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQ2QsTUFBTSxHQUFHLElBQUEsU0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUMxQyxNQUFtQixDQUFDO1FBRXRCLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWTtZQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sZ0JBQW9CLENBQUM7UUFFdkMsU0FBUyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7YUFDakQsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDbkIsTUFBTSxHQUFHLFVBQVUsQ0FBQztZQUVwQixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sb0JBQXdCLENBQUM7UUFDM0MsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sdUJBQTJCLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7UUFFTCxPQUFPLElBQUEsY0FBSyxFQUNWLENBQUMsSUFBQSxhQUFJLEVBQUMsUUFBUSxDQUFDLEVBQUUsVUFBQyxDQUFDLE1BQU0sQ0FBQyxFQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUEsV0FBRyxHQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUdyQixRQUFRLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQ25CO29CQUNFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBQSxTQUFDLEVBQUMsS0FBSyxFQUFFO3dCQUNiLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSztxQkFDakIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDekIsSUFBSSxNQUFNO3dCQUNSLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFFekQsTUFBTTtnQkFDUjtvQkFDRSxnQkFBZ0I7b0JBQ2hCLGNBQWM7b0JBQ2QsbUJBQW1CO29CQUNuQix3QkFBd0I7b0JBQ3hCLDhCQUE4QjtvQkFDOUIsNENBQTRDO29CQUM1QyxNQUFNO29CQUNOLE1BQU07Z0JBQ1I7b0JBQ0UsZ0JBQWdCO29CQUNoQixjQUFjO29CQUNkLG1CQUFtQjtvQkFDbkIseUJBQXlCO29CQUN6QixpQkFBaUI7b0JBQ2pCLGdEQUFnRDtvQkFDaEQsTUFBTTtvQkFDTixNQUFNO2dCQUVSO29CQUNFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ2QsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7b0JBQzFCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFFZCxNQUFNO2dCQUNSO29CQUNFLGdCQUFnQjtvQkFDaEIsY0FBYztvQkFDZCxtQkFBbUI7b0JBQ25CLHVCQUF1QjtvQkFDdkIsaUNBQWlDO29CQUNqQyw0Q0FBNEM7b0JBQzVDLE1BQU07b0JBQ04sTUFBTTthQUVUO1FBQ0gsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBQSxXQUFHLEdBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3JCLFFBQVEsS0FBSyxDQUFDLEtBQUssRUFBRTtnQkFDbkI7b0JBQ0UsQ0FBQyxDQUFDLEdBQUcsQ0FBQzt3QkFDSixJQUFBLGdCQUFPLEVBQUMsUUFBUSxFQUFFLFVBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFOzRCQUM3QixJQUNFLE1BQU0sR0FBRyxJQUFBLFNBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQ3RCLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUVoQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7NEJBQ2pDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQzs0QkFDbkMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFFekQsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQ0FDUCxLQUFLLGlCQUFxQjtnQ0FDMUIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUU7NkJBQzFCLENBQUMsQ0FBQzt3QkFDTCxDQUFDLENBQUM7cUJBQ0gsQ0FBQyxDQUFDO29CQUNILE1BQU07Z0JBQ1I7b0JBQ0UsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGdCQUFPLEVBQUMsR0FBRyxFQUFFLENBQU8sSUFBQSxTQUFDLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzNDLE1BQU07Z0JBQ1IsUUFBUTthQUNUO1lBQ0QsSUFBSSxJQUFBLFNBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGVBQU0sRUFBQyxHQUFHLEVBQUUsQ0FBTyxJQUFBLFNBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQ1osQ0FBQztJQUNKLENBQUM7SUFDRCxNQUFNO0lBQ04sSUFBSSxLQUFLLE9BQU8sSUFBQSxpQkFBUyxFQUFDLElBQUEsV0FBRSxFQUFDLElBQUEsYUFBSyxHQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBQSxTQUFDLEVBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzdEO0FBbEhELHdCQWtIQztBQUNNLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBTSxFQUFFLENBQUMsRUFBRTtJQUM1RCxJQUFJLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0lBQzlCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNwQixFQUFFLENBQUMsTUFBTSxDQUFDLE1BQWEsQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQztJQUNGLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0IsQ0FBQyxDQUFDLENBQUM7QUFOVSxRQUFBLFFBQVEsWUFNbEI7QUFNSCx3Q0FBd0M7QUFFeEMsTUFBYSxjQUFlLFNBQVEsU0FBa0M7SUFDcEUsSUFBSTtRQUNGLElBQ0UsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQ1YsRUFBRSxHQUFHLElBQUEsV0FBRyxrQkFBUSxFQUNoQixLQUFRLEVBQ1IsU0FBUyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFDOUUsS0FBSyxHQUFxQixJQUFBLFNBQUMsRUFBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFBLFdBQUcsRUFBQyxJQUFBLFdBQUUsb0JBQVcsUUFBUSxDQUFDLEVBQUU7WUFDM0MsS0FBSyxFQUFFLEVBQUU7WUFDVCxJQUFBLGdCQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDM0MsQ0FBQyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtZQUNaLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDWCxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFBLGNBQUssRUFBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDckUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFBLFNBQUMsRUFBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO2FBQ25EO2lCQUNJO2dCQUNILEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3hCLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBQSxhQUFJLEVBQUMsQ0FBQyxDQUFDLEVBQUUsZ0JBQVUsQ0FBQyxDQUFDO2FBQzdCO1FBRUgsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ2IsQ0FBQztDQUNGO0FBdkJELHdDQXVCQztBQUNELFNBQWdCLG1CQUFtQjtBQUVuQyxDQUFDO0FBRkQsa0RBRUMifQ==