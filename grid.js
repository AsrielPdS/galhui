"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
const galho_1 = require("galho");
const galhui_js_1 = require("./galhui.js");
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
        let i = this.i, dt = i.dt, d = (0, galho_1.div)().attr("resize", true);
        setTimeout(() => this.resize());
        return dt.bind(this.bind(d, () => d.c((0, galho_1.cl)("_", i.sz, "grid")), "sz"), {
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
            groups: (e, v, _, k) => e.c(k, v),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQStDO0FBRS9DLDJDQUF3RDtBQUN4RCx1Q0FBaUU7QUFtQmpFLE1BQWEsSUFBcUIsU0FBUSxTQUFXO0lBQXJEOztRQUNFLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFDWixXQUFNLEdBQUcsQ0FBQyxDQUFDO0lBMkRiLENBQUM7SUExREMsSUFBSSxFQUFFLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUIsTUFBTTtRQUVKLE1BQU07UUFDTixpQkFBaUI7UUFDakIsd0JBQXdCO1FBQ3hCLDJCQUEyQjtRQUMzQix5Q0FBeUM7UUFDekMscUJBQXFCO1FBQ3JCLDZDQUE2QztRQUM3Qyw0Q0FBNEM7UUFDNUMsbUJBQW1CO1FBQ25CLDBCQUEwQjtRQUMxQiwyQkFBMkI7UUFDM0IsS0FBSztJQUNQLENBQUM7SUFDRCxJQUFJO1FBQ0YsSUFDRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFDVixFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFDVCxDQUFDLEdBQUcsSUFBQSxXQUFHLEdBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNoQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFBLFVBQUUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ25FLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBQSxXQUFHLGtC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