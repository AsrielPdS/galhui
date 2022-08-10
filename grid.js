"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
const galho_1 = require("galho");
const galhui_js_1 = require("./galhui.js");
const orray_1 = require("orray");
const list_js_1 = require("./list.js");
class Grid extends galho_1.E {
    constructor() {
        super(...arguments);
        this.perLine = 1;
        this.margin = 0;
    }
    get dt() { return this.i.dt; }
    resize() {
        // let
        //   d = g(this),
        //   w = d.rect().width,
        //   mrg = hs(theme.a.mrg),
        //   itemW = hs(theme.grid.sz) + mrg * 2,
        //   spc = w % itemW,
        //   pl = this.perLine = ((w - spc) / itemW),
        //   m = this.margin = (spc / 2) / pl + mrg;
        // d.childs().css({
        //   marginLeft: m + "px",
        //   marginRight: m + "px",
        // })
    }
    view() {
        let i = this.i, dt = i.dt, d = (0, list_js_1.crudHandler)((0, galho_1.div)().attr("resize", true), dt, "grid", i);
        setTimeout(() => this.resize());
        return (0, orray_1.bind)(dt, this.bind(d, () => d.uncls().cls((0, galho_1.cl)("_", i.sz, "grid")), "sz"), {
            insert: (v) => (0, galho_1.div)("i" /* item */, [
                (0, galhui_js_1.logo)(v.icon) || (0, galhui_js_1.icon)(i.defIcon),
                v.txt || v.key,
                i.info && (0, galho_1.div)("sd" /* side */, i.info.fields.map(k => [k, v[k]])
                    .filter(v => v[1] != null).slice(0, i.info.max)
                    .map(([k, v]) => (0, galho_1.div)(0, [i.info.showKey && k, v])))
            ]).d(v).css({
                marginLeft: this.margin + "px",
                marginRight: this.margin + "px",
            }),
            groups: (e, v, _, k) => e.cls(k, v),
        }).on({
            keydown: (e) => {
                if (!(0, list_js_1.kbHandler)(dt, e, i))
                    switch (e.key) {
                        case "ArrowLeft":
                            (0, list_js_1.kbHTp)(dt, -1, e);
                            break;
                        case "ArrowRight":
                            (0, list_js_1.kbHTp)(dt, 1, e);
                            break;
                        case "ArrowDown":
                            (0, list_js_1.kbHTp)(dt, this.perLine, e);
                            break;
                        case "ArrowUp":
                            (0, list_js_1.kbHTp)(dt, -this.perLine, e);
                            break;
                        default:
                            return;
                    }
                (0, galho_1.clearEvent)(e);
            },
            resize: () => this.resize()
        });
    }
}
exports.Grid = Grid;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQStDO0FBQy9DLDJDQUF5RDtBQUN6RCxpQ0FBZ0M7QUFDaEMsdUNBQWlFO0FBa0JqRSxNQUFhLElBQXFCLFNBQVEsU0FBVztJQUFyRDs7UUFDRSxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osV0FBTSxHQUFHLENBQUMsQ0FBQztJQTJEYixDQUFDO0lBMURDLElBQUksRUFBRSxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlCLE1BQU07UUFFSixNQUFNO1FBQ04saUJBQWlCO1FBQ2pCLHdCQUF3QjtRQUN4QiwyQkFBMkI7UUFDM0IseUNBQXlDO1FBQ3pDLHFCQUFxQjtRQUNyQiw2Q0FBNkM7UUFDN0MsNENBQTRDO1FBQzVDLG1CQUFtQjtRQUNuQiwwQkFBMEI7UUFDMUIsMkJBQTJCO1FBQzNCLEtBQUs7SUFDUCxDQUFDO0lBQ0QsSUFBSTtRQUNGLElBQ0UsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQ1YsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQ1QsQ0FBQyxHQUFHLElBQUEscUJBQVcsRUFBQyxJQUFBLFdBQUcsR0FBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3RCxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDaEMsT0FBTyxJQUFBLFlBQUksRUFBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFBLFVBQUUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFN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