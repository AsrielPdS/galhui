"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accordion = exports.hidden = void 0;
const galho_1 = require("galho");
const s_1 = require("galho/s");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
const galhui_1 = require("./galhui");
const hidden = (head, body, open) => (0, galho_1.div)(["_", "ac" /* accordion */], [
    head = (0, galho_1.div)("hd" /* head */, [
        (0, galhui_1.icon)("menuR"),
        head
    ]).cls("on" /* on */, !!open).on("click", () => head.tcls("on" /* on */)),
    (0, galho_1.wrap)(body, "bd" /* body */)
]);
exports.hidden = hidden;
function accordion(items, i = {}) {
    return (0, orray_1.bind)((0, orray_1.orray)(items), (0, galho_1.div)("_ accordion"), ([hd, bd], j, p) => {
        p.place(j * 2, [
            hd = (0, galho_1.div)("hd" /* head */, [
                (0, inutil_1.t)(i.icon) && (0, galhui_1.icon)("menuR"),
                hd
            ]).cls("on" /* on */, i.def == j).on("click", () => {
                if ((0, s_1.is)(hd, '.' + "on" /* on */))
                    hd.cls("on" /* on */, false);
                else {
                    (0, inutil_1.t)(i.single) && p.childs("." + "hd" /* head */).cls("on" /* on */, false);
                    hd.cls("on" /* on */);
                }
            }),
            (0, galho_1.wrap)(bd, "bd" /* body */)
        ]);
    });
}
exports.accordion = accordion;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWNjb3JkaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFxQztBQUNyQywrQkFBNkI7QUFDN0IsbUNBQTJCO0FBQzNCLGlDQUFvQztBQUNwQyxxQ0FBbUM7QUFNNUIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFTLEVBQUUsSUFBUyxFQUFFLElBQVcsRUFBRSxFQUFFLENBQUMsSUFBQSxXQUFHLEVBQUMsQ0FBQyxHQUFHLHVCQUFjLEVBQUU7SUFDbkYsSUFBSSxHQUFHLElBQUEsV0FBRyxtQkFBUztRQUNqQixJQUFBLGFBQUksRUFBQyxPQUFPLENBQUM7UUFDYixJQUFJO0tBQ0wsQ0FBQyxDQUFDLEdBQUcsZ0JBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUssSUFBSyxDQUFDLElBQUksZUFBTSxDQUFDO0lBQzVELElBQUEsWUFBSSxFQUFDLElBQUksa0JBQVM7Q0FDbkIsQ0FBQyxDQUFDO0FBTlUsUUFBQSxNQUFNLFVBTWhCO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLEtBQXNCLEVBQUUsSUFBZ0IsRUFBRTtJQUNsRSxPQUFPLElBQUEsWUFBSSxFQUFDLElBQUEsYUFBSyxFQUFDLEtBQUssQ0FBQyxFQUFFLElBQUEsV0FBRyxFQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9ELENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNiLEVBQUUsR0FBRyxJQUFBLFdBQUcsbUJBQVM7Z0JBQ2YsSUFBQSxVQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUEsYUFBSSxFQUFDLE9BQU8sQ0FBQztnQkFDMUIsRUFBRTthQUNILENBQUMsQ0FBQyxHQUFHLGdCQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ3hDLElBQUksSUFBQSxNQUFFLEVBQUksRUFBRSxFQUFDLEdBQUcsZ0JBQUssQ0FBQztvQkFDaEIsRUFBRyxDQUFDLEdBQUcsZ0JBQU8sS0FBSyxDQUFDLENBQUM7cUJBQ3RCO29CQUNILElBQUEsVUFBQyxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsa0JBQVMsQ0FBQyxDQUFDLEdBQUcsZ0JBQU8sS0FBSyxDQUFDLENBQUM7b0JBQ25ELEVBQUcsQ0FBQyxHQUFHLGVBQU0sQ0FBQztpQkFDbkI7WUFDSCxDQUFDLENBQUM7WUFDRixJQUFBLFlBQUksRUFBQyxFQUFFLGtCQUFTO1NBQ2pCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWpCRCw4QkFpQkMifQ==