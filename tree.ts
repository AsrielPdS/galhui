import { clearEvent, div, E, g, S, wrap } from "galho";
import orray, { Alias, L } from "orray";
import { $, C, Child, icon, Icon } from "./galhui.js";
import { ctx } from "./hover.js";
import { ICrud } from "./list.js";

function prev(start: S, parent: S) {
  let e: Element = start.e;
  do {
    let p = e.previousElementSibling;
    while (p && p.lastElementChild)
      p = p.lastElementChild;

    if (p)
      e = p;
    else if (parent.e == (e = e.parentElement))
      e = null;
  } while (e && !e.matches("." + C.head));

  return e && new S(e);
}
function next(start: S, parent: S) {
  let e: Element = start.e;
  do {
    let n = e.firstElementChild || e.nextElementSibling
    if (n)
      e = n;
    else {
      while (!(parent.e == (e = e.parentElement)) && !e.nextElementSibling) { }
      e = parent.e == e ? null : e.nextElementSibling;
    }
  } while (e && !e.matches("." + C.head));

  return e && new S(e);
}
export interface ITree extends ICrud<Branch> {
  toggle?(i: Branch, state: bool): any;

  data?: Alias<Branch, IBranch>;
  /**selected element */
  s?: Branch;
}

export function tree(i: ITree) {

  let
    d = div("_ tree"),
    click = ({ currentTarget: c, target: t }: MouseEvent) => {
      if (c == t)
        select(i);
      else select(g(<Element>t).closest(".i").d());
    };
  return orray(i.data, v => v instanceof Branch ? v : new Branch(i, v, 0)).bind(d.prop("tabIndex", 0)).on({
    keydown: (e) => {
      let f = i.s;

      switch (e.key) {
        case "ArrowUp":
          let p = prev(f.head, d);
          if (p) {
            select(i, p.d<Branch>());
            break;
          } else return;
        case "ArrowDown":
          let n = next(f.head, d);
          if (n) {
            select(i, n.d<Branch>());
            break;
          } else return;
        case "ArrowLeft":
          if (f.i.open) {
            f.set("open", false);
            break;
          } else {
            let p = prev(f.head, d);
            if (p) {
              select(i, p.d<Branch>());
              break;
            } else return;
          }
        case "ArrowRight":
          if (f.i.dt && !f.i.open) {
            f.set("open", true);
            break;
          } else {
            let n = next(f.head, d);
            if (n) {
              select(i, n.d<Branch>());
              break;
            } else return;
          }
        default:
          return;
      }
      clearEvent(e);
    },
    click,
    dblclick: i.open && (() => i.open(i.s)),
    contextmenu: i.menu && ((e) => {
      click(e);
      let t = i.menu(i.s);
      if (t) {
        ctx(e, t);
        e.preventDefault();
      }
    })
  });
}
export function query({ data }: ITree, text: string) {
  text = text.toLowerCase();
  for (let item of data)
    (<Branch>item).filter((e) => (e.key + '').toLowerCase().indexOf(text) != -1);
}
export function select(i: ITree, e?: Branch) {
  let f = i.focus, o = i.s, n = i.s = e;
  if (o) {
    o.head.cls(C.on, false);
    f?.(o, false);
  }
  if (n) {
    n.head.cls(C.on);
    f?.(n, true);
  }
}
// export class Tree extends E<ITree> {
//   data: L<Branch, IBranch>;
//   constructor(i: ITree, data?: L<Branch, IBranch>) {
//     super(i);
//     this.data = orray(data, { parse: v => v instanceof Branch ? v : new Branch(this, v, 0) });
//   }


//   private _ficused: Branch
// }
export interface IBranch {
  side?: Child;
  key?: str;
  icon?: Icon;
  tp?: str;
  dt?: Alias<Branch, IBranch>;
  open?: bool;
}
export class Branch extends E<IBranch> {
  uuid?: number;
  // dt: L<Branch, IBranch>;
  constructor(public ctx: ITree, i: IBranch, public level: number) {
    super(i);
    i.dt && (i.dt = orray<Branch, IBranch>(i.dt, v => v instanceof Branch ? v : new Branch(ctx, v, level + 1)));
  }
  get key() { return this.i.key; }

  get(path: string) {
    var t1 = path.split('/', 2);
    let result = (this.i.dt as L<Branch>).find(t1[0]);
    if (t1.length > 1) {
      if (result.i.dt)
        result = result.get(t1[1]);
      else throw "";
    }
    return result;
  }
  head: S;
  view() {
    let
      i = this.i,
      h = this.head = div(C.head, div(C.body, [i.key, i.side && wrap(i.side, C.side)]))
        .css("paddingLeft", $.rem * this.level + "px").d(this);
    if (i.dt) {
      let body = (i.dt as L<Branch>).bind(div()), ico = icon('menuR');

      return this.bind(div(C.item, [
        h.prepend(div(0, ico).on('click', e => { this.toggle("open"); clearEvent(e) })),
        i.open && body
      ]).d(this), (t) => {
        if (i.open) {
          t.add(body);
          ico.replace(ico = icon('menuD'));
        } else {
          body.remove();
          ico.replace(ico = icon('menuR'));
        }
        this.ctx.toggle?.(this, i.open);
      }, 'open');
    } else return h.cls(C.item).d(this).prepend(icon(i.icon));
  }
  filter(filter: (item: IBranch) => boolean, /*sub: boolean = true,*/  ok = false) {
    //obs: ok � para que se o parent passar no filtro todos os filhos devem passar tambem
    //obs: any � para se algum dos filhos dele passar ele tambem passa
    ok || (ok = filter(this.i));
    let any: boolean, dt = <Branch[]>this.i.dt;
    if (dt)
      for (let item of dt) {
        any = item.filter(filter, ok) || any;
      }
    // this.div.cls(C.off, !any);
    return ok;
  }
}
// .on({
//   contextmenu: tp.ctx && ((e) => ctx(e, tp.ctx(i))),
//   dblclick: tp.open && (() => tp.open(i)),
//   click: () => this.ctx.focus(this),
// })
