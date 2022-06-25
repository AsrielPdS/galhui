import { div, E, g, One, S } from "galho";
import orray, { bind, L, remove, set } from "orray";
import { ex, isS } from "inutil";
import { $, C, Color, hc, Size, icon, Icon, w, close, ibutton, cancel, confirm, panel } from "./galhui";
import { menubar, MBItems } from "./menu";
import { modal, openModal } from "./hover";

export interface FilePath {
  path: string;
  name: string;
  type: string;
}

interface IFileRenderProvedor {
  valid(file: FSValue): boolean
  formats: string[],
  render(file: FSValue): One;
}
export type ImageSelectorLayout = 'horizontal' | 'vertical' | 'grid';

type FSValue = string | File | Blob;
export interface IFileSelector {
  maxSize?: number;
  formats?: string[];
  value?: L<FSValue, string>;
  multiple?: boolean;
  layout?: ImageSelectorLayout;
  inline?: boolean;
  submit?: boolean;
  autosubmit?: boolean;
  accept?: string;
  options?: MBItems;
  icon?: Icon;
}
export class FileInput<T extends IFileSelector = IFileSelector> extends E<T, { input: Array<FSValue>, submit: string[]; }> {
  input: S<HTMLInputElement>;

  static default: Partial<IFileSelector> = {
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
  constructor(dt: T) {
    super(dt);

    dt.value = orray<FSValue, string>(dt.value, {
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
    let
      i = this.i,
      values = i.value;
    return div([C.fileSelector, i.inline ? C.inline : ""], [
      this.input = g('input', {
        type: 'file',
        accept: i.accept,
        multiple: i.multiple
      }).on('change', function () {
        let t = Array.from(this.files);
        if (i.multiple)
          values.push(...t);

        else values.set(t);
      }),
      bind(values, div(C.body), {
        insert(file) {
          let
            tp = FileInput.getFileExt(file),
            prov: IFileRenderProvedor;
          for (let p of frp)
            if (p.formats.indexOf(tp) != -1 && p.valid(file)) {
              prov = p;
              break;
            }
          //= model.render(value);
          return div(C.item, [
            prov.render(file),
            close(() => remove(values, file))
          ]);
        },
        empty(active, s) {
          s
            .cls(C.label, active)
            .set(active && icon(i.icon));
        }
      }),
      menubar(
        i.submit && !i.autosubmit && this.bind(ibutton("upload", null, () => this.submit()).cls(Color.accept),
          (s) => { g(s).prop("disabled", !values.length || values.every((value) => isS(value))); }, 'value'
        ),
        ibutton('folder-open', null, () => this.input.e.click()),
        i.options as any,
        this.bind(close(() => set(values)), (s) => g(s).prop("disabled", !values.length), 'value')
      )
    ]).prop("tabIndex", 0);
  }

  file() {
    return div('file', [
      icon(null)
    ]);
  }
  submit(from?: number, to?: number) {
    var
      values = this.i.value,
      sub = values.slice(from, to).filter<Blob>((v): v is Blob => v instanceof Blob);

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

  static submitfile: (files: Blob[], progress?: (this: XMLHttpRequest, e: ProgressEvent) => any) => Promise<string[]>;
  static filePath: (name: string) => string;

  static getFileExt(file: FSValue) {
    if (file instanceof File)
      return file.name.split('.').pop().toLowerCase();

    else if (typeof file == 'string')
      return file.replace(/^.*[\\\/]/, '').split('.').pop().toLowerCase()

    else if (file instanceof Blob)
      return file.type.split('/')[1];

    else return '';
  }
  static getFileName(file: FSValue) {
    if (file instanceof File)
      return file.name;
    else if (typeof file == 'string')
      return file.replace(/^.*[\\\/]/, '')
    return '';
  }
}


//file Render Provedors
const frp: IFileRenderProvedor[] = [
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
          img.prop('src', (e.target as any).result);
        };
        reader.readAsDataURL(file);
      } else img.prop('src', FileInput.filePath(file));
      return img;
    }
  }
];
//-----------------------------------------------------------
//--------------------image selector-------------------------
//-----------------------------------------------------------
export interface IImageSelector extends IFileSelector {
  format?: ImageFormat;
  camera?: boolean;
}


export class ImageSelector extends FileInput<IImageSelector> {
  constructor(i: IImageSelector) {
    if (i.camera)
      i.options = [ibutton("camera", null, () => this.openCamera())];
    super(i);
  }
  static default: Partial<IImageSelector> = {
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
    let
      i = this.i,
      camera = new Camera(i.format || {});

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


//-----------------------------------------------------------
//--------------------camera---------------------------------
//-----------------------------------------------------------

export interface ImageFormat {
  propotion?: "square" | [number, number],
  minW?: number,
  minH?: number,
  maxW?: number,
  maxH?: number;
}

export const enum CameraState {
  asking,
  preview,
  error,
  recording,
  inaccessible
}
export interface ICamera extends ImageFormat {
  state?: CameraState;
  /**base64 */
  value?: string;
}
export class Camera extends E<ICamera, { input: string; }>{

  constructor(model: ICamera) {
    super(model);

    model.state = model.value ? CameraState.preview : CameraState.asking;

    this.on(e => {
      if ('value' in e)
        this.emit('input', e.value);
    });
  }
  view() {
    var
      model = this.i,
      output = g('video').css('width', '100%').e,
      stream: MediaStream;

    if (!navigator.mediaDevices)
      this.set('state', CameraState.error);

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((tempStream) => {
        stream = tempStream;

        this.set('state', CameraState.recording);
      })
      .catch((e) => {
        this.set('state', CameraState.inaccessible);
      });

    return panel(
      [icon('camera'), w.camera],
      this.bind(div(), (s) => {


        switch (model.state) {
          case CameraState.preview:
            s.set(g('img', {
              src: model.value
            }).css('width', '100%'));
            if (stream)
              stream.getVideoTracks().forEach(track => track.stop());

            break;
          case CameraState.asking:
            //s.set(button({
            //  tag: 'h1',
            //  cls: C.heading,
            //  icon: 'camera-plus',
            //  text: 'Confirme o acesso',
            //  info: 'Precisa dar accesso a sua camera'
            //}));
            break;
          case CameraState.error:
            //s.set(button({
            //  tag: 'h1',
            //  cls: C.heading,
            //  icon: 'alert-circle',
            //  text: 'Erro',
            //  info: 'Erro na tentativa de aceder a camera'
            //}));
            break;

          case CameraState.recording:
            s.set(output);
            output.srcObject = stream;
            output.play();

            break;
          case CameraState.inaccessible:
            //s.set(button({
            //  tag: 'h1',
            //  cls: C.heading,
            //  icon: 'lock-alert',
            //  text: 'N�o consegui acceder',
            //  info: 'Precisa dar accesso a sua camera'
            //}));
            break;

        }
      }, 'state'),
      this.bind(div(), (s) => {
        switch (model.state) {
          case CameraState.recording:
            s.set([
              ibutton('camera', w.save, () => {
                var
                  canvas = g('canvas').e,
                  ctx = canvas.getContext("2d");

                canvas.width = output.videoWidth;
                canvas.height = output.videoHeight;
                ctx.drawImage(output, 0, 0, canvas.width, canvas.height);

                this.set({
                  state: CameraState.preview,
                  value: canvas.toDataURL()
                });
              })
            ]);
            break;
          case CameraState.preview:
            s.set(confirm(() => (<any>g(this).d())()));
            break;
          default:
        }
        if (g(this).d())
          s.add(cancel(() => (<any>g(this).d())()));
      }, 'state')
    );
  }
  /** */
  show() { return openModal(ex(modal(), { body: g(this) })); }
}
export const readFile = (file: Blob) => new Promise<str>(cb => {
  var reader = new FileReader();
  reader.onload = (e) => {
    cb(reader.result as str);
  };
  reader.readAsDataURL(file);
});
export interface IMobImgSelector {
  value?: Blob;
  /**place holder */
  ph: Icon;
}
/**image select for smartphone/tablet */

export class MobImgSelector extends E<IMobImgSelector, { input: str }>{
  view() {
    let
      i = this.i,
      bd = div(C.body),
      clear: S,
      emitInput = () => this.set("value", input.files[0]).emit("input", input.value),
      input: HTMLInputElement = g("input", { type: 'file', accept: 'image/*' }).on("input", emitInput).e;
    return this.bind(div(hc(C.mobile, "imgsel"), [
      input, bd,
      ibutton("edit", null, () => input.click())
    ]), async s => {
      if (i.value) {
        s.prepend(clear ||= close(() => { input.value = null; emitInput() }))
        bd.set(g("img", { src: await readFile(i.value) }))
      }
      else {
        clear && clear.remove();
        bd.set(icon(i.ph, Size.xl));
      }

    }, "value")
  }
}
export function mobileImageSelector() {

}