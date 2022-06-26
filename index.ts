import { div, g } from "galho";
import { button } from "./galhui";

interface Item { title: any; content: any }

export function indexItem(title: any, content: any): Item {
  return { title, content };
}

export function index(...items: Item[]) {
  let bd = div("bd", items.map((e, i) => [
    g("h2", { id: <any>i }, e.title),
    e.content
  ]));
  return [
    div("_ menurow hd", items.map((e, i) =>
      g("button", "i", e.title).on("click",()=>{}))),
    bd
  ];//div("_ index", );
}