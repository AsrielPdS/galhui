import { cl, clearEvent, delay, div, E, g, One, S, wrap } from "galho";
import { L, orray } from "galho/orray.js";
import { assign, bool, call, Dic, fmt, int, isN, isS, isU, str, t, Task } from "galho/util.js";
import { $, body, C, fluid, cancel, close, Color, confirm, hc, ibt, icon, Icon, mbitem, MBItems, menubar, panel, Size, w } from "./galhui.js";
import { modal, openModal, Select } from "./hover.js";
import { kbHandler, list } from "./list.js";
import { anim } from "./util.js";

//#region input
export type TextInputTp = "text" | "email" | "url" | "tel";
export type InputTp = TextInputTp | "number" | "search" | "checkbox" | "radio" | "password";
export type Input = S<HTMLInputElement | HTMLTextAreaElement>;

export const input = (type: InputTp, name: str, ph?: str, input?: (e: Event) => any) =>
  g("input", { type, name, placeholder: ph }).c("_ in").on("input", input);

export const textarea = (name: str, ph: str, input?: (text: str) => void) =>
  g("textarea", { name, placeholder: ph }).c("_ in").on("input", input && (function () { input(this.value) }));

export const checkbox = (label: any, input?: (checked: bool) => void) =>
  g("label", hc(C.checkbox), [g("input", { type: "checkbox" }).on("input", input && (function () { input(this.checked) })), label]);

export function search(input?: (value: str) => any) {
  let t = g("input", { type: "search", placeholder: w.search }), i = icon($.i.search);
  input && delay(t, "input", $.delay, () => input(t.e.value));
  return (i ? div(0, [t, i]) : t).c("_ in");
}
export function searcher<T extends Dic>(query: (q: str) => Task<T[]>) {
  let
    dt = orray<T>(),
    menu = list({ kd: false, item: v => [div(0, v.name), g("span", "tag", ["NIF: ", v.nif])] }, dt).c("_ tip"),
    _: () => any,
    focus = () => _ ||= (
      menu.addTo(body),
      anim(() => body.contains(i) ? fluid(i.rect(), menu, "vc") : (_(), _ = null))),
    i: Input = delay(g("input", { type: "search", placeholder: "NIF ou Nome da empresa" })
      .on({
        focus, blur() { _(); _ = null; },
        keydown(e) { kbHandler(dt, e, {}) && clearEvent(e) }
      }),
      "input", $.delay, async () => {
        if (i.e.value) {
          focus();
          dt.set(await query(i.e.value))
        } else { _?.(); _ = null; }
      });
  return i;
}
export const lever = (name: str) => g("input", { type: "checkbox", name }).c(C.lever);


export interface IPagging {
  limit?: number;
  pag?: number;
  total?: number;
  hideOnSingle?: boolean;
  setlimit?: boolean;
  minLimit?: number;
  viewtotal?: boolean;
  extreme?: boolean;
}
export class Pagging extends E<IPagging>{
  view() {
    let
      i = this.i,
      pags: number,
      count = g('span'),
      total: S;
    if (i.setlimit) {
      var limits = new Select<number>({
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
        total.set(`${Math.min(i.total - i.limit * (i.pag - 1), i.limit || i.total) || 0} / ${i.total || 0}`)
      pags = i.limit ? Math.ceil((i.total || 0) / i.limit) : 1;
      s.c(C.off, !!(pags < 2 && i.hideOnSingle));

      let t = i.extreme ? 0 : 1
      s.child(2 - t).set(i.pag);

      s.childs<HTMLButtonElement>(0, 2 - t).p('disabled', i.pag == 1);
      s.childs<HTMLButtonElement>(3 - t, 5 - t * 2).p('disabled', i.pag == pags);

      count.set(pags);
    });
  }

  get pags() {
    let { limit: l, total: t } = this.i;
    return l ? Math.ceil((t || 0) / l) : 1
  }
}

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
export class FileInput<T extends IFileSelector = IFileSelector> extends E<T, { input: [FSValue[]], submit: [str[]]; }> {
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
      values.bind(div(C.body), {
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
            close(() => values.remove(file))
          ]);
        },
        empty(active, s) {
          s
            .c(C.label, active)
            .set(active && icon(i.icon));
        }
      }),
      menubar(
        i.submit && !i.autosubmit && this.bind(ibt("upload", null, () => this.submit()).c(Color.accept),
          (s) => { g(s).p("disabled", !values.length || values.every((value) => isS(value))); }, 'value'
        ),
        ibt('folder-open', null, () => this.input.e.click()),
        i.options as any,
        this.bind(close(() => values.set()), (s) => g(s).p("disabled", !values.length), 'value')
      )
    ]).p("tabIndex", 0);
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
          img.p('src', (e.target as any).result);
        };
        reader.readAsDataURL(file);
      } else img.p('src', FileInput.filePath(file));
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
      i.options = [ibt("camera", null, () => this.openCamera())];
    super(i);
  }
  static default: Partial<IImageSelector> = {
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
export class Camera extends E<ICamera, { input: [str]; }>{

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
              ibt('camera', w.save, () => {
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
  show() { return openModal(assign(modal(), { body: g(this) })); }
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

export class MobImgSelector extends E<IMobImgSelector, { input: [str] }>{
  view() {
    let
      i = this.i,
      bd = div(C.body),
      clear: S,
      emitInput = () => this.set("value", input.files[0]).emit("input", input.value),
      input: HTMLInputElement = g("input", { type: 'file', accept: 'image/*' }).on("input", emitInput).e;
    return this.bind(div(hc(C.mobile, "imgsel"), [
      input, bd,
      ibt("edit", null, () => input.click())
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
//#endregion

//#region output

export const label = (content) => g("label", hc(C.label), content);
export const output = (...content) => g("span", hc(C.label), content);
export const keyVal = (key, val) => g("span", "_ in", [key + ": ", val]);

export const message = (c?: Color, data?) => div(hc(C.message), data).c(c);
export const errorMessage = (data?) => message(data).c(Color.error);
export const tip = (e: S, value) => e.p("title", value);


export interface iOutput<T> {
  key?: str;
  text?: str;
  fmt?: str;
  value?: T;
  color?: Color;
  def?: any;
}
export class Output<T = unknown> extends E<iOutput<T>>{
  constructor(model: iOutput<T>);
  constructor(text: string, value: T, format?: string)
  constructor(text: string | iOutput<T>, value?: T, fmt?: string) {
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
          i.value == null ? i.def : i.fmt ? fmt(<any>i.value, i.fmt) : i.value
        ]);
    });
  }
}

//#endregion

//#region layouts

export type AccordionItem = [head: any, body: any];
export interface IAccordion {
  icon?: bool, single?: bool, def?: int
}
export const hidden = (head: any, body: any, open?: bool) => div(["_", C.accordion], [
  head = div(C.head, [
    icon("menuR"),
    head
  ]).c(C.on, !!open).on("click", () => (<S>head).tcls(C.on)),
  wrap(body, C.body)
]);
export function accordion(items: AccordionItem[], i: IAccordion = {}) {
  return orray(items).bind(div("_ accordion"), ([hd, bd], j, p) => {
    p.place(j * 2, [
      hd = div(C.head, [
        t(i.icon) && icon("menuR"),
        hd
      ]).c(C.on, i.def == j).on("click", () => {
        if ((hd as S).is('.' + C.on))
          (<S>hd).c(C.on, false);
        else {
          t(i.single) && p.childs("." + C.head).c(C.on, false);
          (<S>hd).c(C.on);
        }
      }),
      wrap(bd, C.body)
    ]);
  });
}
export type TabItem = [hd: any, bd: any];
export function tab(items: TabItem[],initial?:int) {
  let
    hd = div("_ bar", items.map(([h, b]) => call(div("i", h), e => e.on("click", () => {
      d.set([hd, b]);
      hd.childs().c("on", false);
      e.c("on");
    })))),
    d = div("_ tab");
    isN(initial)&&hd.child<HTMLDivElement>(initial).e.click()
  return d;
}
//#endregion