import { div, g } from "galho";
import { button } from "./galhui";

interface Item { title: any; content: any }

export function indexItem(title: any, content: any): Item {
  return { title, content };
}

export function index(...items: Item[]) {
  let bd = div("bd", items.map((e, i) => [
    g("h2", "hd", e.title).id("_" + i),
    e.content
  ]));
  return [
    div("_ menurow hd", items.map((e, i) =>
      g("a", "i", e.title).on("click", () => bd.child("#_" + i).e.scrollIntoView({ behavior: "smooth" })))),
    bd
  ];//div("_ index", );
}