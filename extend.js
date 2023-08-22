import { div, E, g } from "galho";
import { l } from "galho/util.js";
import { SelectIn } from "./form.js";
import { $, icon, mbitem } from "./galhui.js";
import { output, showDialog } from "./io.js";
export class Pagging extends E {
    view() {
        let i = this.i, pags, count = g('span'), total;
        if (i.setlimit) {
            var limits = new SelectIn({
                value: i.limit,
                fluid: true,
                clear: false
            }, [
                i.min,
                i.min * 5,
                i.min * 10,
                i.min * 10,
                i.min * 20,
                [0, 'Mostrar todos']
            ]);
        }
        return this.bind(div("_ bar pag", [
            i.extreme && mbitem($.i.first, null, () => this.set('pag', 1)),
            mbitem($.i.prev, null, () => this.set('pag', i.pag - 1)),
            output().css({ textAlign: "center" }),
            mbitem($.i.next, null, () => this.set('pag', i.pag + 1)),
            i.extreme && mbitem($.i.last, count, () => this.set('pag', pags)),
            limits && [
                g("hr"),
                limits.onset("value", ({ value }) => { this.set('limit', value); })
            ],
            i.viewtotal && [g("hr"), total = output()]
        ]), (s) => {
            if (i.viewtotal)
                total.set(`${Math.min(i.total - i.limit * (i.pag - 1), i.limit || i.total) || 0} / ${i.total || 0}`);
            pags = i.limit ? Math.ceil((i.total || 0) / i.limit) : 1;
            s.c("off" /* C.off */, !!(pags < 2 && i.hideOnSingle));
            let t = i.extreme ? 0 : 1;
            s.child(2 - t).set(i.pag);
            s.childs(0, 2 - t).p('disabled', i.pag == 1);
            s.childs(3 - t, 5 - t * 2).p('disabled', i.pag == pags);
            count.set(pags);
        });
    }
    get pags() {
        let { limit: l, total: t } = this.i;
        return l ? Math.ceil((t || 0) / l) : 1;
    }
}
export function slideshow(i, items, index = 0) {
    let title = div("title"), bd = g("img");
    let p = g("button", "p").html('&#10094;').on("click", () => set(index - 1));
    let n = g("button", "n").html('&#10095;').on("click", () => set(index + 1));
    let indices = items.map((_, i) => g("a").on("click", () => set(i)));
    let set = (i) => {
        let t = items[i];
        if (t) {
            bd.p({ src: t[0], alt: t[2] });
            title.set(t[1]);
            p.css("visibility", i ? "visible" : "hidden");
            n.css("visibility", i + 1 < l(items) ? "visible" : "hidden");
            indices[index].c("on", false);
            indices[index = i].c("on");
        }
    };
    set(index);
    if (i.click)
        bd.on("click", () => i.click(items[index][0]));
    return div("_ sshow", [
        p, bd, n, title,
        div("indices", indices)
    ]);
    // div("bd",items.map(i => g("img", { src: i[0], alt: i[2] })))
}
export const sshowModal = (src) => showDialog(g("dialog", "_ sshow-md", g("form", 0, [
    g("button", "cl" /* C.close */, icon($.i.close)).p("formMethod", "dialog"),
    g("img", { src })
])));
export const sshowTitle = (main, info) => [main, div("info", info)];
// export class Slideshow extends E<iSlideshow>{
//   constructor() {
//     super(assign(i, { items, index }));
//   }
//   view() {
//   }
// }
