import { active, cl, clearEvent, delay, div, E, g, HSElement, One, onfocusout, S, svg, wrap } from "galho";
import { L, orray, range } from "galho/orray.js";
import { assign, bool, call, Dic, fmt, int, is, isP, isS, isU, Key, l, str, sub, t, Task, unk } from "galho/util.js";
import { $, body, busy, C, cancel, close, close as closeBT, Color, confirm, fluid, FluidAlign, FluidRect, hc, ibt, icon, Icon, Label, label, MBItems, menu, MenuItems, negative, positive, Size, VAlign, w, wait } from "./galhui.js";
import { anim } from "./util.js";

//#region input
export type TextInputTp = "text" | "email" | "url" | "tel";
export type InputTp = TextInputTp | "number" | "search" | "checkbox" | "radio" | "password";
export type Input = S<HTMLInputElement | HTMLTextAreaElement>;

export const input = (type: InputTp, name: str, ph?: str, input?: (e: Event) => any) =>
  g("input", { type, name, placeholder: ph }).c("_ in").on("input", input);

export const textarea = (name: str, ph: str, input?: (text: str) => void) =>
  g("textarea", { name, placeholder: ph }).c("_ in").on("input", input && (function () { input(this.value) }));

export const checkbox = (label: any, input?: (checked: bool) => void, checked?: bool) =>
  g("label", "_ cb", [g("input", { type: "checkbox", checked }).on("input", input && (function () { input(this.checked) })), label]);

export function search(input?: (value: str) => any) {
  let t = g("input", { type: "search", placeholder: w.search }), i = icon($.i.search);
  input && delay(t, "input", $.delay, () => input(t.e.value));
  return (i ? div(0, [t, i]) : t).c("_ in");
}



export interface iImgSelector {
  k?: str;
  accept?: str;
  /**placeholder */
  ph?: str;
  value?: Blob;
  save?: str | ((value: File) => unk);
}
export class ImgSelector extends E<iImgSelector>{
  view() {
    let
      i = this.i,
      input = g('input', { name: i.k, type: "file", accept: i.accept || "image/*" }).on("input", () => {
        let v = input.e.files[0];
        this.set("value", v);
        if (isS(i.save))
          submitImg(i.save, v);
        else i.save?.(v)
      });
    return this.bind(div("_ img-in", input), async _ => {
      if (i.value?.size) {
        let img = g("img"), fr = new FileReader();
        fr.onload = () => img.e.src = fr.result as str;
        fr.readAsDataURL(i.value);
        _.set([img, close(() => this.set("value", input.e.value = null))]);
      } else {
        _.set(g("button", { type: "button" }, [div(0, "+").css("fontSize", "6em"), i.ph])
          .on("click", () => input.e.click()));
      }
    }, "value");
  }
}
export function submitImg(url: str, value: Blob) {
  return new Promise<str>((resolve) => {
    let r = new XMLHttpRequest;
    r.withCredentials = true;
    r.onload = () => { resolve(r.responseText) };
    r.onprogress = e => {
      //TODO set busy
    }
    r.open("POST", url);
    r.send(value);
  })
}

const lever = (name: str) => g("input", { type: "checkbox", name }).c(C.lever);

//#region output

export const output = (...content) => g("span", "_ tag", content);
export const keyVal = (key, val) => g("span", "_ in", [key, ": ", val]);

export const message = (c?: Color, data?) => div(hc(C.message), data).c(c);
export const errorMessage = (data?) => message(Color.error, data);

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

  view() {
    let i = this.i;
    return this.bind(div(), (s) => {
      s
        .attr("class", false)
        .c(["in", i.color])
        .set([
          i.text, ': ',
          i.value == null ? i.def : i.fmt ? fmt(<any>i.value, i.fmt) : i.value
        ]);
    });
  }
}

//#endregion

interface IModal<K> {
  valid?: (key: K) => Task<unknown>;
  /**close on click out of modal */
  blur?: bool;

  // close?: bool;
  // cls?: str | str[];
  // valid?(key: K): any;
  /**submit button(called when press enter) */
  // submit?: S;
}
interface IBody { cls?: str, close?: bool }
interface Modal<K> extends Promise<K>, IModal<K> {
  area: S;
  body: S;
  cb: (v: K) => void;
}
export function mdOnBlur(area: S) {
  area.on("click", (e) => {
    if (e.target == e.currentTarget)
      area.remove()
  });
}
/**open modal 
 * @returns modal container, to close modal only remove the modal container */
export function modal(modal: One): S
export function modal(hd: Label, bd: any, actions?: (close: () => void) => any, sz?: Size, blur?: bool): S;
export function modal(modal: One | Label, bd?: any, actions?: (close: () => void) => any, sz?: Size, blur = true) {
  if (isU(bd))
    modal = g(modal as One, "_ modal");
  else {
    modal = div("_ modal " + (sz || ""), [
      label(modal, "hd"),
      bd,
      div("ft", actions?.(() => area.remove()))
    ]);
  }
  let area = div("_ blank", modal).addTo(body);
  modal.p("tabIndex", 0).focus();
  blur && mdOnBlur(area);
  return area;
}

/**modal with ok and cancel buttons */
export const mdOkCancel = (body: any, sz = Size.xs, valid = () => true) =>
  new Promise<bool>(ok => {
    let md = modal(div("_ modal " + sz, [
      wrap(body).css({ minHeight: "4em" }),
      div("_ row", [
        confirm(() => { if (valid) { md.remove(); ok(true) } }).css({ width: "50%" }),
        cancel(() => { md.remove(); ok(false) }).css({ width: "50%" })
      ])
    ]))
  });
/**modal with yes/no buttons */
export const mdYN = (body: any, sz = Size.xs, valid = () => true) =>
  new Promise<bool>(ok => {
    let md = modal(div("_ modal " + sz, [
      wrap(body).css({ minHeight: "4em" }),
      div("_ row", [
        positive(null, w.yes, () => { if (valid) { md.remove(); ok(true) } }).css({ width: "50%" }),
        negative(null, w.no, () => { md.remove(); ok(false) }).css({ width: "50%" }),
      ])
    ]))
  });
/**modal with ok */
export const mdOk = (body: any, sz = Size.xs) =>
  new Promise<void>((ok) => {
    let md = modal(div("_ modal " + sz, [
      wrap(body).css({ minHeight: "4em" }),
      confirm(() => { md.remove(); ok() }),
    ]))
  });
/**md with error style and ok button */
export const mdError = (msg: any, sz = Size.xs) =>
  new Promise<void>((ok) => {
    let md = modal(div(`_ modal ${Color.error} ${sz}`, [
      wrap(body).css({ minHeight: "4em" }),
      confirm(() => { md.remove(); ok() }),
    ]))
  });
export function popup(area: () => FluidRect, div: S, align: FluidAlign) {
  return anim(() => body.contains(div) && fluid(area(), div, align));
}
/**context menu */
export function ctxmenu(e: MouseEvent, data: MenuItems, align: FluidAlign = "ve") {
  clearEvent(e);
  let last = active();
  let wheelHandler = (e: Event) => clearEvent(e);
  let ctx = div("_ menu", g("table", 0, data)).p("tabIndex", 0)
    .on({
      focusout(e) {
        ctx.contains(e.relatedTarget as HTMLElement) || (ctx.remove() && body.off("wheel", wheelHandler));
      },
      keydown(e) {
        if (e.key == "Escape") {
          e.stopPropagation();
          ctx.blur();
        }
      }
    }).addTo(body).focus();

  ctx.queryAll('button').on('click', function () { last ? last.focus() : this.blur() });
  body.on("wheel", wheelHandler, { passive: false });
  popup(() => new DOMRect(e.clientX, e.clientY, 0, 0), ctx, align);
}
export function tip<T extends HSElement>(root: One<T>, div: any, align?: FluidAlign): S<T>
export function tip<T extends HSElement>(root: S<T>, tip: S, align: FluidAlign = "v") {
  if (isP(tip)) {
    let t = tip;
    tip = div("_ tip", wait);
    t.then(v => { tip = wrap(v, "_ tip") });
  }
  else tip = wrap(tip, "_ tip");
  return (root = g(<any>root))?.on({
    mouseenter() {
      body.add(tip);
      anim(() => body.contains(root) && tip.parent ?
        fluid(root.rect, tip as S, align) :
        (tip.remove(), false));
    },
    mouseleave() { tip.remove() },
    //TODO:focusin,focusout
    // focusout(e) {
    //   tip.remove()
    // },
    // focusin(){

    // }
  });
}

export interface IRoot<T extends Dic = Dic> {

  /**if should open when clicked 
   * @default true */
  click?: bool;
  /**if should have menu-down icon 
   * @default true */
  icon?: bool;
  open?: bool;
  off?: bool;
  /**gain focus via tab key 
   * @default true
  */
  tab?: bool;
  //TODO: change name to clean 'probable'
  clear?: bool
  /**placeholder */
  ph?: any;
  item?(v: T): any
  /**label field */
  // label?: Key;
}
export type Root = E<IRoot, { open?: [bool] }> & {
  value: Key;
};


// export function keydown<T extends Object = any>(me: Root, e: KeyboardEvent, options: L<T, any>, set: (...values: Key[]) => any) {

// }
/**create root, add handlers */
export function setRoot(me: Root, options: L, label: S, menu: S) {
  let
    i = me.i,
    root = onfocusout(div(`_ in ${C.select}`, [label.c("bd"), t(i.icon) && icon($.i.dd)?.c(C.side)/*, me.menu*/]), () => me.set("open", false))
      .p("tabIndex", 0)
      .on({
        focus(e) {
          if (i.off) {
            if (e.relatedTarget)
              g(e.relatedTarget as Element).focus();
            else root.blur();
          } else root.c("on");
        },
        keydown(e) {
          switch (e.key) {
            case "ArrowUp":
              me.set("open", true);
              range.move(options, "on", -1, range.tp(e.shiftKey, e.ctrlKey));
              break;
            case "ArrowDown":
              me.set("open", true);
              range.move(options, "on", 1, range.tp(e.shiftKey, e.ctrlKey));
              break;
            case "Enter":
              if (me.i.open) {
                me.value = l(options) == 1 ?
                  options[0][options.key] as any :
                  sub(range.list(options, "on"), options.key as any)[0];
                me.set("open", false);
              } else return;
              // else {
              //   let frm = g(me).closest("form");
              //   if (frm) frm?.e.requestSubmit();
              //   else return;
              // }
              break;
            case "Escape":
              if (me.i.open) {
                me.set("open", false);
                break;
              } else return;

            default:
              return;
          }
          clearEvent(e);
        }
      });
  if (t(i.click))
    root.on('click', (e) => {
      if (i.off) {
        e.stopImmediatePropagation();
      } else {
        //if (m(<Element>e.target).is('button'))
        //  _this.set(C.open, false);
        //else
        if (!menu.contains(e.target as HTMLElement))
          me.toggle("open");
      }
    });
  me.on(state => {
    if ("off" in state) {
      if (i.off) {
        me.set("open", false);
        root.blur();
        root.c(C.disabled);
        root.p('tabIndex', -1);
      } else {
        root.c(C.disabled, false);
        root.p('tabIndex', t(i.tab) ? 0 : -1);
      }
    }
    if ("open" in state) {
      if (i.open && i.off) {
        me.set("open", false);
        return;
      }
      me.emit('open', i.open);
      root.c("on", i.open);

      if (i.open) {
        menu.addTo(root);
        anim(() => {
          let r = root.rect;
          return body.contains(menu) && (menu.css("minWidth", r.width + "px"), fluid(r, menu, "ve"))
        });
      } else {
        root.c([VAlign.bottom, VAlign.top], false);
        menu.remove();
      }
    }
  });

  return root;
}
export async function setValue<K = any>(me: Root & { option(k: K): Task<Dic> }, label: S) {
  let v = me.value;
  if (label.e.tagName == "INPUT") {
    label.p("value", me.value == null ? "" : me.value);
  } else {
    if (v == null) label.c("_ ph").set(me.i.ph);
    else {
      let o = await me.option(v as any);
      label.c("ph", false).set([me.i.item(o), t(me.i.clear) && close(() => me.value = null)]);
      me.set("open", false);
    }
  }
}
// interface SelectItem<K> {
//   key: K;
//   text?: str;
//   i?: Icon;
// }

// export interface iSelect<K extends keyof T, T extends Dic> extends IRoot<T> {
//   value?: T[K];
//   ph?: str;
//   /**menu width will change acord to content */
//   fluid?: boolean;
// }
// export class Select<K extends keyof T, T extends Dic = Pair> extends E<iSelect<K, T>, { input: [T[K]]; open: [bool] }> {
// }

export const dropdown = (label: any, items: any, align: FluidAlign = "ve") =>
  call(div("_ dd", label), e => {
    let mn = items instanceof S ? items : null;
    e.on("click", () => {
      if (mn?.parent) {
        mn.remove();
        e.c("on", false);
      } else {
        (mn ||= menu(items)).c(C.menu).addTo(e.c("on"));
        popup(() => e.rect, mn, align);
      }
    });
  });
export const idropdown = (label: any, items: any, align?: FluidAlign) =>
  dropdown([label, icon($.i.dd)], items, align);

//#region layouts
//-----------------DEPRECATED---------------------------

interface FilePath {
  path: string;
  name: string;
  type: string;
}


type FileRenderer = (type: str, file: FSValue) => One<HSElement> | void
type ImageSelectorLayout = 'horizontal' | 'vertical' | 'grid';

type FSValue = string | File | Blob;
interface IFileSelector {
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
class FileInput<T extends IFileSelector = IFileSelector> extends E<T, { input: [FSValue[]], submit: [str[]]; }> {
  input: S<HTMLInputElement>;

  constructor(i: T) {
    super(i);

    i.value = orray<FSValue, string>(i.value, {
      parse: (file, index) => {
        if (is(file, Blob) && i.autosubmit)
          setTimeout(() => this.submit(index, index + 1));
        return file;
      }
    });
    this.onset("value", () => this.emit('input', i.value.slice()));
  }

  view() {
    let
      i = this.i,
      values = i.value;
    return div(["_", C.fileSelector, i.inline && C.inline], [
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
      values.bind(div("bd"), {
        insert(file) {
          let
            name = isS(file) ? file : (file as File).name || "",
            type = name.slice(name.lastIndexOf(".") + 1);
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
        i.submit && !i.autosubmit && this.bind(ibt("upload", null, () => this.submit()).c(Color.accept),
          (s) => { g(s).p("disabled", !values.length || values.every((value) => isS(value))); }, 'value'
        ),
        ibt($.i.upload, null, () => this.input.e.click()),
        i.options as any,
        this.bind(close(() => values.set()), (s) => g(s).p("disabled", !values.length), 'value')
      ])
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
}
//file Render Provedors
const
  pdfRenderer: FileRenderer = (type: str) => type == "pdf" && svg("svg", { viewBox: "0 0 56 56"/*,style="enable-background:new 0 0 56 56;"*/ })
    .html(`<g>
  <path style="fill:#E9E9E0;" d="M36.985,0H7.963C7.155,0,6.5,0.655,6.5,1.926V55c0,0.345,0.655,1,1.463,1h40.074c0.808,0,1.463-0.655,1.463-1V12.978c0-0.696-0.093-0.92-0.257-1.085L37.607,0.257C37.442,0.093,37.218,0,36.985,0z"/>
  <polygon style="fill:#D9D7CA;" points="37.5,0.151 37.5,12 49.349,12 	"/>
  <path style="fill:#CC4B4C;" d="M19.514,33.324L19.514,33.324c-0.348,0-0.682-0.113-0.967-0.326c-1.041-0.781-1.181-1.65-1.115-2.242c0.182-1.628,2.195-3.332,5.985-5.068c1.504-3.296,2.935-7.357,3.788-10.75c-0.998-2.172-1.968-4.99-1.261-6.643c0.248-0.579,0.557-1.023,1.134-1.215c0.228-0.076,0.804-0.172,1.016-0.172c0.504,0,0.947,0.649,1.261,1.049c0.295,0.376,0.964,1.173-0.373,6.802c1.348,2.784,3.258,5.62,5.088,7.562c1.311-0.237,2.439-0.358,3.358-0.358c1.566,0,2.515,0.365,2.902,1.117c0.32,0.622,0.189,1.349-0.39,2.16c-0.557,0.779-1.325,1.191-2.22,1.191c-1.216,0-2.632-0.768-4.211-2.285c-2.837,0.593-6.15,1.651-8.828,2.822c-0.836,1.774-1.637,3.203-2.383,4.251C21.273,32.654,20.389,33.324,19.514,33.324z M22.176,28.198c-2.137,1.201-3.008,2.188-3.071,2.744c-0.01,0.092-0.037,0.334,0.431,0.692C19.685,31.587,20.555,31.19,22.176,28.198z M35.813,23.756c0.815,0.627,1.014,0.944,1.547,0.944c0.234,0,0.901-0.01,1.21-0.441c0.149-0.209,0.207-0.343,0.23-0.415c-0.123-0.065-0.286-0.197-1.175-0.197C37.12,23.648,36.485,23.67,35.813,23.756z M28.343,17.174c-0.715,2.474-1.659,5.145-2.674,7.564c2.09-0.811,4.362-1.519,6.496-2.02C30.815,21.15,29.466,19.192,28.343,17.174z M27.736,8.712c-0.098,0.033-1.33,1.757,0.096,3.216C28.781,9.813,27.779,8.698,27.736,8.712z"/>
  <path style="fill:#CC4B4C;" d="M48.037,56H7.963C7.155,56,6.5,55.345,6.5,54.537V39h43v15.537C49.5,55.345,48.845,56,48.037,56z"/>
  <g>
   <path style="fill:#FFFFFF;" d="M17.385,53h-1.641V42.924h2.898c0.428,0,0.852,0.068,1.271,0.205c0.419,0.137,0.795,0.342,1.128,0.615c0.333,0.273,0.602,0.604,0.807,0.991s0.308,0.822,0.308,1.306c0,0.511-0.087,0.973-0.26,1.388c-0.173,0.415-0.415,0.764-0.725,1.046c-0.31,0.282-0.684,0.501-1.121,0.656s-0.921,0.232-1.449,0.232h-1.217V53z M17.385,44.168v3.992h1.504c0.2,0,0.398-0.034,0.595-0.103c0.196-0.068,0.376-0.18,0.54-0.335c0.164-0.155,0.296-0.371,0.396-0.649c0.1-0.278,0.15-0.622,0.15-1.032c0-0.164-0.023-0.354-0.068-0.567c-0.046-0.214-0.139-0.419-0.28-0.615c-0.142-0.196-0.34-0.36-0.595-0.492c-0.255-0.132-0.593-0.198-1.012-0.198H17.385z"/>
   <path style="fill:#FFFFFF;" d="M32.219,47.682c0,0.829-0.089,1.538-0.267,2.126s-0.403,1.08-0.677,1.477s-0.581,0.709-0.923,0.937s-0.672,0.398-0.991,0.513c-0.319,0.114-0.611,0.187-0.875,0.219C28.222,52.984,28.026,53,27.898,53h-3.814V42.924h3.035c0.848,0,1.593,0.135,2.235,0.403s1.176,0.627,1.6,1.073s0.74,0.955,0.95,1.524C32.114,46.494,32.219,47.08,32.219,47.682z M27.352,51.797c1.112,0,1.914-0.355,2.406-1.066s0.738-1.741,0.738-3.09c0-0.419-0.05-0.834-0.15-1.244c-0.101-0.41-0.294-0.781-0.581-1.114s-0.677-0.602-1.169-0.807s-1.13-0.308-1.914-0.308h-0.957v7.629H27.352z"/>
   <path style="fill:#FFFFFF;" d="M36.266,44.168v3.172h4.211v1.121h-4.211V53h-1.668V42.924H40.9v1.244H36.266z"/>
  </g></g>`),
  docRenderer: FileRenderer = (type: str) => (type == "docx" || type == "doc") && svg("svg", { viewBox: "0 0 56 56"/*,style="enable-background:new 0 0 56 56;"*/ })
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
function imgRenderer(type: str, file: FSValue,) {
  if (['png', 'jpg', 'gif', 'svg', 'ico'].includes(type)) {
    let img = g('img');
    if (isS(file))
      img.p('src', $.fileURI?.(file) || file)
    else {
      let reader = new FileReader();
      reader.onload = (e) => {
        img.p('src', (e.target as any).result);
      };
      reader.readAsDataURL(file);
    }
    return img;
  }
}
const fileRenderers: FileRenderer[] = [];
//-----------------------------------------------------------
//--------------------image selector-------------------------
//-----------------------------------------------------------
interface IImageSelector extends IFileSelector {
  format?: ImageFormat;
}

const ISCameraOption = () => ibt("camera", null, async () => {
  let
    i = null/*this.i*/,
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
});
class ImageSelector extends FileInput<IImageSelector> {
  constructor(i: IImageSelector) {
    i.accept ||= 'image/*';
    super(i);
  }
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
}


//-----------------------------------------------------------
//--------------------camera---------------------------------
//-----------------------------------------------------------

interface ImageFormat {
  propotion?: "square" | [number, number],
  minW?: number,
  minH?: number,
  maxW?: number,
  maxH?: number;
}

const enum CameraState {
  asking,
  preview,
  error,
  recording,
  inaccessible
}
interface ICamera extends ImageFormat {
  state?: CameraState;
  /**base64 */
  value?: string;
}
class Camera extends E<ICamera, { input: [str]; }>{

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

    return null;
    // return panel(
    //   [icon('camera'), w.camera],
    //   this.bind(div(), (s) => {


    //     switch (model.state) {
    //       case CameraState.preview:
    //         s.set(g('img', {
    //           src: model.value
    //         }).css('width', '100%'));
    //         if (stream)
    //           stream.getVideoTracks().forEach(track => track.stop());

    //         break;
    //       case CameraState.asking:
    //         //s.set(button({
    //         //  tag: 'h1',
    //         //  cls: C.heading,
    //         //  icon: 'camera-plus',
    //         //  text: 'Confirme o acesso',
    //         //  info: 'Precisa dar accesso a sua camera'
    //         //}));
    //         break;
    //       case CameraState.error:
    //         //s.set(button({
    //         //  tag: 'h1',
    //         //  cls: C.heading,
    //         //  icon: 'alert-circle',
    //         //  text: 'Erro',
    //         //  info: 'Erro na tentativa de aceder a camera'
    //         //}));
    //         break;

    //       case CameraState.recording:
    //         s.set(output);
    //         output.srcObject = stream;
    //         output.play();

    //         break;
    //       case CameraState.inaccessible:
    //         //s.set(button({
    //         //  tag: 'h1',
    //         //  cls: C.heading,
    //         //  icon: 'lock-alert',
    //         //  text: 'N�o consegui acceder',
    //         //  info: 'Precisa dar accesso a sua camera'
    //         //}));
    //         break;

    //     }
    //   }, 'state'),
    //   this.bind(div(), (s) => {
    //     switch (model.state) {
    //       case CameraState.recording:
    //         s.set([
    //           ibt('camera', w.save, () => {
    //             var
    //               canvas = g('canvas').e,
    //               ctx = canvas.getContext("2d");

    //             canvas.width = output.videoWidth;
    //             canvas.height = output.videoHeight;
    //             ctx.drawImage(output, 0, 0, canvas.width, canvas.height);

    //             this.set({
    //               state: CameraState.preview,
    //               value: canvas.toDataURL()
    //             });
    //           })
    //         ]);
    //         break;
    //       case CameraState.preview:
    //         s.set(confirm(() => (<any>g(this).d())()));
    //         break;
    //       default:
    //     }
    //     if (g(this).d())
    //       s.add(cancel(() => (<any>g(this).d())()));
    //   }, 'state')
    // );
  }
  /** */
  show() { return null;/*openModal(assign(modal(), { body: g(this) }))*/ }
}
const readFile = (file: Blob) => new Promise<str>(cb => {
  var reader = new FileReader();
  reader.onload = (e) => {
    cb(reader.result as str);
  };
  reader.readAsDataURL(file);
});
interface IMobImgSelector {
  value?: Blob;
  /**place holder */
  ph: Icon;
}
/**image select for smartphone/tablet */

class MobImgSelector extends E<IMobImgSelector, { input: [str] }>{
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
function mobileImageSelector() {

}
//#endregion


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
export function tab(initial: int, ...items: TabItem[]) {
  let
    hd = div("_ bar", items.map(([h, b]) => call(div("i", h), e => e.on("click", () => {
      d.set([hd, b]);
      hd.childs().c("on", false);
      e.c("on");
    })))),
    d = div("_ tab");
  hd.child<HTMLDivElement>(initial).e.click()
  return d;
}
//#endregion
// export interface IOpenSelect<T extends Object = Dic, K extends Key = Key> extends bg.ISelect<T, K> {
//   input?: 'text' | 'number';
//   valid?: (value: string) => boolean;
// }
// export function openSelect<T extends Object = Dic, K extends Key = Key>(input: (this: Select<T, K>, value) => any, options: (T | K)[], i: IOpenSelect<T, K> = {}) {
//   let ip = i.labelE = g('input', { type: i.input }).on('input', function () {
//     input.call(select, this.value);
//   });
//   i.label = (value) => {
//     ip.p('value', <any>value);
//   }
//   let select = new Select<T, K>(i, options);
//   return select;
// }



// export interface ISelectBase<T extends Object, K> extends IRoot {
//   menuE?: S;
//   labelE?: S;

//   /**element in menu or menu itself where items will be added */
//   items?: S<HTMLTableElement>;
//   labelParent?: S;
//   menu?: (this: this, value: T) => One;
//   /**called when value change */
//   setMenu?: (this: this, value: K) => void;
//   /**elemento dentro da label onde a label vai ser renderizada */
//   //labelItem?: S;

//   //label: S | ((key: K) => void);

// }
// export abstract class SelectBase<M extends ISelectBase<T, K> = ISelectBase<any, any>, T extends Object = any, K = Key, E extends SelectEvents = SelectEvents> extends E<M, E>  {
//   menu: S;
//   label: S;

//   options: L<T, K>;
//   abstract setValue(...value: K[]): void;

//   constructor(i: M, options?: Alias<T, K>) {
//     super(i);
//     this.options = extend<T, K>(options, {
//       key: "key",
//       parse: (e) => isO(e) ? e : { key: e } as any
//     });
//   }


//   view(): S {
//     let
//       i = this.i,
//       lb = g(i.labelE || 'div').c(C.body);

//     this.label = i.labelParent || lb // model.labelItem || label;

//     this.menu = (i.menuE || div(0, i.items = g("table"))).c("_ menu");

//     //if (model.menuItems && model.menuItems != this.menu) {
//     //  this.menu.setClass(Cls.fill);
//     //  model.menuItems.setClass(Cls.full);
//     //}

//     i.open = false;


//     //if (!md.menuRender)
//     //  md.menuRender = value => div( null, value[md.key]);

//     return root(this, i, this.options);
//   }

//   protected insertItem(value: T) {
//     var model = this.i;

//     return g(model.menu(value))
//       //.setClass(Cls.option)
//       .on('click', (e) => {
//         e.stopPropagation();
//         let k = value[model.key];
//         this.setValue(k);
//       });
//   }
// }
// export interface IMultselect<T extends Object = any, K extends str | num = str> extends ISelectBase<T, K> {
//   value?: L<K>;
//   empty?: (empty: boolean, container?: S) => void;
//   label?: (this: L<K>, value: K, index?: number, container?: S) => void | One;// Child | Promise;
// }
// export class Multselect<T extends Object = { key: str }, K extends str | num = str> extends SelectBase<IMultselect<T, K>, T, K, { add: K[], remove: K[]; input: K[] } & SelectEvents> {
//   constructor(i: IMultselect<T, K>, options?: Array<T | K>) {
//     super(i, options);
//     this.options.addGroup("on");
//     i.value = orray(i.value, {
//       parse(item) {
//         if (this.indexOf(item) == -1)
//           return item;
//       }
//     });
//     //.bindToE(this, "value");
//   }
//   get value() { return this.i.value; }
//   view() {
//     let
//       i = this.i,
//       values = i.value,
//       options = this.options,
//       div = super.view(),
//       mItems = i.items,
//       menu = i.items || this.menu;

//     this.label.css('flexWrap', 'wrap');
//     bind(options, menu, {
//       insert: this.insertItem.bind(this),
//       tag(s, active, tag) {
//         s.c(tag, active);

//         if (active) {
//           vScroll(menu, s.e.offsetTop - menu.p('clientHeight') / 2 + s.p('clientHeight') / 2);
//         }
//       },
//       groups: {
//         ["on"](e, active) { e.c(C.on, active); }
//       }
//     });
//     bind(values, menu, {
//       insert(key) {
//         let index = itemIndex(options, key);
//         if (index != -1)
//           mItems
//             .child(index)
//             .c(C.main);
//       },
//       remove(key) {
//         let index = itemIndex(options, key);
//         if (index != -1)
//           mItems
//             .child(index)
//             .c(C.main, false);
//       }
//     });
//     bind(values, this.label, {
//       insert: i.label,
//       empty: i.empty
//     });

//     return root(this, i).on("keydown", e => {
//       switch (e.key) {
//         case "Delete": {
//           let target = g(e.target as HTMLElement);
//           if (is(target, 'input') || is(target, 'textarea') || !this.delete())
//             return;
//           else break;
//         }
//         case "Backspace": {
//           let target = g(e.target as HTMLElement);
//           if (is(target, 'input') || is(target, 'textarea') || !this.backspace())
//             return;
//           else break;
//         }
//       }
//       keydown(e, this.options);
//     });
//   }

//   delete() {
//     let vl = this.i.value;
//     if (!vl.length)
//       return false;

//     this.removeValue(vl[0]);
//     return true;
//   }
//   backspace() {
//     let vl = this.i.value;

//     if (!vl.length)
//       return false;

//     this.removeValue(z(vl));
//     return true;
//   }

//   setValue(...values: K[]) {
//     let md = this.i;

//     //let list = this.model.value;
//     if (values.length) {
//       //let l = list.length;
//       let inserted: K[] = [];

//       for (let value of values) {
//         if (md.value.indexOf(value) == -1) {
//           inserted.push(value);
//         }
//       }


//       //md.value.push(...values);

//       if (inserted.length > 0) {
//         md.value.push(...inserted);

//         this.emit('add', inserted);
//         this.emit('input', md.value.slice());

//         if (md.open && this.$)
//           this.setMenu(this.$)
//       }
//     }
//   }

//   removeValue(...values: K[]) {
//     let
//       md = this.i,
//       removed: K[] = [];

//     for (let value of values) {
//       let i = md.value.indexOf(value);
//       if (i != -1) {
//         md.value.removeAt(i);
//         removed.push(value);
//       }
//     }

//     if (removed.length > 0) {
//       this.emit('remove', removed);
//       this.emit('input', md.value.slice());

//       if (md.open && this.$)
//         this.setMenu(this.$)
//     }
//   }

//   //setLabel(value: T) {
//   //  var model = this.model;
//   //  return model.menuRender(<T>value)
//   //    .setClass(Cls.option)
//   //    .on('click', (e) => {
//   //      e.stopPropagation();
//   //      let k = value[model.key];
//   //      this.set('value', k);
//   //      model.child.setTag(focusKey, k);
//   //    })
//   //}

// }



// export interface IOpenMultselect<T extends Object = Dic, K extends Key = Key> extends IMultselect<T, K> {
//   input?: 'text' | 'number';
//   valid?: (value: string) => boolean;
//   /**place holder */
//   ph?: str;
// }
// export function openMultselect<T extends Object = Dic, K extends Key = Key>(i: IOpenMultselect<T, K>, allOptions: T[]) {
//   let
//     select = new Multselect<T, K>(assign(i, {
//       label(value) {
//         i.labelE.p('value', value);
//       },
//       labelE: g('input', { type: i.input, placeholder: i.ph }).on({
//         input() {
//           let arg: Arg<str> = { v: this.value };
//           select.emit("type" as any, arg);
//           if (!arg.p) {
//             allOptions ||= opts.slice();
//             let parts = valid(arg.v.split(/\s+/g)).map(q => new RegExp(q, "gu"));
//             opts.set(allOptions.filter(o => parts.every(p => p.test(o[i.key]))));
//           }
//           if (l(opts) == 1)
//             addSelection(opts, "on", opts[0], SelectionTp.set);
//         },
//         keydown(e) {
//           if (e.key == "Enter" && !opts.tags["on"]) {
//             clearEvent(e);
//             let arg: Arg<str> = { v: this.value };
//             if (i.valid ? i.valid(arg.v) : false) {
//               select.emit("submit" as any, arg)
//               if (!arg.p) {
//                 opts.push({ [i.key]: arg.v } as any);
//                 select.setValue(arg.v as K);
//               }
//             }
//           }
//         }
//       })
//     }), allOptions),
//     opts = select.options;
//   g(select).c(C.input)
//   return select;
// }