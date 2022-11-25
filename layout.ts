import { div, E, g, One, Render, wrap } from "galho";
import { $, body, C, close, doc, icon, Icon } from "./galhui.js";
import { bool, call, extend, float, int, isA, isU, l, lazy, str, t } from "galho/util.js";
import { Alias, L, orray } from "galho/orray.js";



declare global {
  namespace GalhoUI {
    interface Settings {
      lyDivW?: float;
    }
  }
}
/**layout classes */
export const enum LC {
  divisor = "l-d",
  layout = "l-l",
  stack = "stack",
  item = "l-i"
}
export interface ISizeble {
  sz?: number;
}
export function defineSize(items: ISizeble[], apply?: boolean) {
  let
    size = 0,
    l = items.length,
    sizes = [];
  for (let i of items) {
    let s = i.sz;
    if ((s || (s = 0)) > 95)
      s = 95;
    else if (s === 0)
      s = 100 / l;
    sizes.push(s);
    size += s;
  }
  let result = sizes.map(s => s * 100 / size);
  if (apply)
    for (let i = 0; i < l; i++)
      items[i].sz = result[i];
  return result;
}
const enum Type {
  stack = 's',
  col = "c",
  row = "r",
  box = 'i',
  tab = 't'
}
interface iitem {
  tp: Type
}
type Ori = "v" | "h";
export type iitems = iStack | iTab | iBox;
interface Item {
  compress(): iitem | null | undefined | void;
}
export interface ICtx {
  compress?: bool;
  boxes?: Partial<iBox>;
  left?: Alias<iBox>;
  right?: Alias<iBox>;
  bottom?: Alias<iBox>;
  edit?: bool
}
export class Ctx extends E<ICtx, { change: never }>{
  public root: Item
  constructor(i: ICtx, root: iitems) {
    super(i);
    this.root = this.item(root);

    i.left && (i.left = orray(i.left));
    i.right && (i.right = orray(i.right));
    i.bottom && (i.bottom = orray(i.bottom));
  }
  private ignoreChange: bool;
  view() {
    let { left, right, bottom } = this.i;
    return div("_ galy", [
      left && div("l"),
      this.root,
      right && div("r"),
      bottom && div("b"),
    ]);
  }
  change() {
    if (!this.ignoreChange) {
      if (t(this.i.compress)) {
        this.ignoreChange = true;
        this.root.compress();
        this.ignoreChange = false;
      }
      this.emit("change");
    }
  }
  prots(key: str) {
    let t = this.i.boxes[key];
    if (!t)
      throw `protyupe "${key}" not found`;
    return t;
  }
  item(item: iitems) {
    switch (item.tp) {
      case Type.stack:
        return new Stack(this, item);
      case Type.tab:
        return new Tab(this, item);
      case Type.box:
        return new Box(this, item.base ? extend(item, this.prots(item.base)) : item);
    }
  }
}

type StackItems = L<[sz: int, item: iitems], iitems>
interface iStack {
  $?: Stack;
  tp: Type.stack;
  o: Ori;
  list: StackItems;
  persist?: bool
}
class Stack implements Item, Render {
  constructor(public ctx: Ctx, protected i: iStack) { i.$ = this; }
  render() {
    let { list, o } = this.i, ctx = this.ctx;
    return orray(list, v => isA(v) ? v : <[int, iitems]>[100 / l(list), v]).bind(div(["_", "stack", o]), {
      insert([sz, item], index, s) {
        s.place(index && index * 2 - 1, [
          //dupla negação para não inserir 0
          !!index && divisor("h", (l, r) => {
            this[index - 1][0] = l;
            this[index][0] = r;

            ctx.change();
          }),
          g(ctx.item(item)).css(o == "h" ? "width" : "height", `${sz}%`)
        ]);
      },
      remove: (_, index, parent) => {
        if (index)
          parent.childs(index * 2 - 1, index * 2 + 1).remove();
        else parent.childs(0, 2).remove();
      }
    });
  }
  compress() {
    let { list, persist: p } = this.i, _l = l(list);
    if (!_l) {
      if (!p)
        return null;
    } else if (_l == 1)
      return list[0][1];
    else for (let i = 0; i < _l; i++) {
      let t0 = <[int, iitems]>list[i], t = t0[1].$.compress()
      switch (t) {
        case null:
          //TODO: remove from context
          list.removeAt(i--);
          break;
        case undefined:
          break;
        default:
          throw "not implemented";
          // replace(t0, [t0[0], <iitems>t]);
      }
    }
  }
}
interface iTab {
  $?: Tab;
  tp: Type.tab;
  list: Alias<iBox>;
  persist?: bool;
  empty?: () => One
}
class Tab implements Item, Render {
  constructor(ctx: Ctx, protected i: iTab) { i.$ = this; }
  render() {
    let i = this.i, list = <L<iBox>>i.list;
    return div("_ tab", [
      list.bind(div(C.head), {
        tag: (v, i,p) => p.child(i).c("on", v),
        insert: box => box.$.head().c(C.item)
          .add(close(e => { e.stopPropagation(); list.remove(box); }))
          .on('click', () => list.tag("on", box))
      }),
      call(div(C.body), b => {
        let cb = (v: iBox) => {
          b.attr("id", false).c(C.body);
          if (v) {
            b.set(v.$.render(true));
            //v.$.focus?.(b);
          } else b.set(i.empty?.());

        };
        list.ontag("on", cb);
        cb(list.tags?.on.v);
      }),
    ]);
  }
  compress() {
    let { list, persist: p } = this.i;
    if (!list) {
      if (!p)
        return null;
    } else if (l(list) == 1)
      if (l[0].selfContain)
        return l[0];

  }
}

export interface iBox {
  $?: Box;
  tp: Type.box
  base?: str;
  dt?: any;
  render?(this: this): any;
  remove?(this: this): any;
  /**default dt used when dt is undefined */
  def?(): any;
  selfContain?: bool;
  icon?: Icon;
  title?: str | One | (() => str | One)
}
class Box implements Item, Render {
  constructor(ctx: Ctx, protected i: iBox) {
    if (i.def && isU(i.dt))
      i.dt = i.def();
    i.$ = this;
  }
  render(headerless?: bool) {
    let bd = wrap(this.i.render());
    return headerless ? bd.c(C.item) : div("_ tab", [
      this.head().c("_ bar"),
      div(C.body, bd)
    ]);
  }
  head() {
    let i = this.i;
    return div(0, [
      icon(i.icon),
      lazy(i.title),
      close(() => { })
    ]);
  }
  compress() { }
}

/**box interface */
export const ibox = (base: str): iBox => ({ tp: Type.box, base });
/**row interface */
export const irow = (...list: StackItems): iStack => ({ tp: Type.stack, o: "h", list });
/**col interface */
export const icol = (...list: StackItems): iStack => ({ tp: Type.stack, o: "v", list });
/**tab interface */
export const itab = (...list: iBox[]): iTab => ({ tp: Type.tab, list });


export function divisor(o: Ori, endcallback?: (a: number, b: number) => any) {
  let hr = g('hr', LC.divisor);
  return hr.on('mousedown', function () {
    let
      parent = hr.parent(),
      parentRect = parent.rect(),
      prev = hr.prev(),
      next = hr.next(),
      l: number, r: number,
      div = $.lyDivW / 2,
      clamp = (value: float, min: float, max: float) => value < min ? min : value > max ? max : value,
      trigger = () => {
        let e = new Event("resize", { bubbles: true });
        prev.emit(e);
        next.emit(e);
      };

    function moveEventX(e: MouseEvent) {
      let p = parentRect.width * 0.05;
      l = clamp(e.clientX - parentRect.left, p, parentRect.left - p);
      prev.css('width', `calc(${(l = l / parentRect.width * 100)}% - ${div}px)`);
      next.css('width', `calc(${(r = 100 - l)}% - ${div}px)`);
      trigger();
    }
    function moveEventY(e: MouseEvent) {
      let p = parentRect.height * 0.05;
      l = clamp(e.clientX - parentRect.top, p, parentRect.top - p);
      prev.css('height', `calc(${(l = l / parentRect.height * 100)}% - ${div}px)`);
      next.css('height', `calc(${(r = 100 - l)}% - ${div}px)`);
      trigger();
    }
    body.css({ cursor: 'col-resize', userSelect: "none" });
    let t = o == "h" ? moveEventX : moveEventY;
    doc
      .on('mousemove', t)
      .one('mouseup', () => {
        body.uncss(["cursor", "userSelect"]);
        doc.off('mousemove', t);
        endcallback?.(l, r);
      });
  });
}
export const stack = (o: Ori, list: Array<One | [float, One]>) => div(["_", "stack", o], list.map((v, i) => {
  let [sz, item] = isA(v) ? v : <[int, One]>[100 / l(list), v];
  return [
    !!i && divisor("h"),
    g(item).css(o == "h" ? "width" : "height", `${sz}%`)
  ];
}));
export const row = (...list: Array<One | [float, One]>) => stack("h", list);
export const col = (...list: Array<One | [float, One]>) => stack("v", list);
