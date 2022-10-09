import { div, S } from "galho";
import { isN, isP } from "galho/util.js";
import { C, icon } from "./galhui.js";
/**call back */
export type CB = PromiseLike<any> | (() => Promise<any>);

/**wait type */
export const enum tp {
  inline,
  out,
}
/**place holder */
export function ph(type = tp.out) {
  switch (type) {
    case tp.inline:
    case tp.out:
      return div(C.loading, [
        //icon({ /*s: size, */d: `loading ${C.centered}` }),
        //icon({ /*s: size, */d: `loading ${C.itemA} ${C.centered}` }),
      ]);
  }
}
export function waiter(element: S, cb: CB) {
  cb && (isP(cb) ? cb : cb?.()).then(t => {
    if (t instanceof S) {
      t.c(Array.from(element.e.classList).slice(1));
      t.attr("style",
        (t.attr("style") || "") +
        (element.attr("style") || "")
      )
    }
    element.replace(t);
  });
}
export function wait(body?: CB): S;
export function wait(type: tp, body?: CB): S;
export function wait(type?: tp | CB, body?: CB): any {
  if (!isN(type)) {
    body = type;
    type = tp.inline;
  }
  let loader = ph(type);
  waiter(loader, body);
  return loader;
}


export function busy(container: S) {
  let e = wait(), t = setTimeout(() => {
    container.add(e);
  }, 750);

  return () => {
    e.remove();
    clearTimeout(t);
  }
}