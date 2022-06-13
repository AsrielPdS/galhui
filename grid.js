"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
const galho_1 = require("galho");
const galhui_1 = require("./galhui");
const orray_1 = require("orray");
const list_1 = require("./list");
class Grid extends galho_1.E {
    perLine = 1;
    margin = 0;
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
        let i = this.i, dt = i.dt, d = (0, list_1.crudHandler)((0, galho_1.div)().attr("resize", true), dt, "grid", i);
        setTimeout(() => this.resize());
        return (0, orray_1.bind)(dt, this.bind(d, () => d.uncls().cls((0, galho_1.cl)("_", i.sz, "grid")), "sz"), {
            insert: (v) => (0, galho_1.div)("i" /* item */, [
                (0, galhui_1.logo)(v.icon) || (0, galhui_1.icon)(i.defIcon),
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
                if (!(0, list_1.kbHandler)(dt, e, i))
                    switch (e.key) {
                        case "ArrowLeft":
                            (0, list_1.kbHTp)(dt, -1, e);
                            break;
                        case "ArrowRight":
                            (0, list_1.kbHTp)(dt, 1, e);
                            break;
                        case "ArrowDown":
                            (0, list_1.kbHTp)(dt, this.perLine, e);
                            break;
                        case "ArrowUp":
                            (0, list_1.kbHTp)(dt, -this.perLine, e);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQStDO0FBQy9DLHFDQUFzRDtBQUN0RCxpQ0FBZ0M7QUFDaEMsaUNBQThEO0FBa0I5RCxNQUFhLElBQXFCLFNBQVEsU0FBVztJQUNuRCxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ1osTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNYLElBQUksRUFBRSxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlCLE1BQU07UUFFSixNQUFNO1FBQ04saUJBQWlCO1FBQ2pCLHdCQUF3QjtRQUN4QiwyQkFBMkI7UUFDM0IseUNBQXlDO1FBQ3pDLHFCQUFxQjtRQUNyQiw2Q0FBNkM7UUFDN0MsNENBQTRDO1FBQzVDLG1CQUFtQjtRQUNuQiwwQkFBMEI7UUFDMUIsMkJBQTJCO1FBQzNCLEtBQUs7SUFDUCxDQUFDO0lBQ0QsSUFBSTtRQUNGLElBQ0UsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQ1YsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQ1QsQ0FBQyxHQUFHLElBQUEsa0JBQVcsRUFBQyxJQUFBLFdBQUcsR0FBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3RCxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDaEMsT0FBTyxJQUFBLFlBQUksRUFBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFBLFVBQUUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLElB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