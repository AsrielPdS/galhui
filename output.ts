import { cl, div, E, g, S } from "galho";
import { isS, isU } from "inutil";
import { $, C, Color, hc } from "./galhui";


export const label = (content) => g("label", hc(C.label), content);
export const output = (...content) => g("span", hc(C.label), content);
export const keyVal = (key, val) => g("span", hc(C.input), [key + ": ", val]);

export const message = (c?: Color, data?) => div(hc(C.message), data).cls(c);
export const errorMessage = (data?) => message(data).cls(Color.error);
export const tip = (e: S, value) => e.prop("title", value);


export interface IOutput<T> {
  key?: str;
  text?:str;
  fmt?: str;
  value?: T;
  color?:Color;
  def?/*: Child*/;

}
export class Output<T = unknown> extends E<IOutput<T>>{
  constructor(model: IOutput<T>);
  constructor(text: string, value: T, format?: string)
  constructor(text: string | IOutput<T>, value?: T, fmt?: string) {
    super(isS(text) ? { text, value, fmt } : text);
  }
  key() { return this.i.key; }
  value(): T;
  value(value: T): this;
  value(value?: T) {
    if (isU(value))
      return this.i.value;
    else this.set('value', value)
    return this;
  }
  view() {
    let i = this.i;
    return this.bind(div(), (s) => {
      s
      .uncls().cls(cl(C.input,i.color))
        .set([
          i.text, ': ',
          $.fmt(i.value, i.fmt, i.def && { def: i.def })
        ]);
    });
  }
}
//export const join = (...content) => div(C.label, content);
