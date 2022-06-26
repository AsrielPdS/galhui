"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = exports.indexItem = void 0;
const galho_1 = require("galho");
function indexItem(title, content) {
    return { title, content };
}
exports.indexItem = indexItem;
function index(...items) {
    let bd = (0, galho_1.div)("bd", items.map((e, i) => [
        (0, galho_1.g)("h2", { id: i }, e.title),
        e.content
    ]));
    return [
        (0, galho_1.div)("_ menurow hd", items.map((e, i) => (0, galho_1.g)("button", "i", e.title).on("click", () => { }))),
        bd
    ]; //div("_ index", );
}
exports.index = index;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBK0I7QUFLL0IsU0FBZ0IsU0FBUyxDQUFDLEtBQVUsRUFBRSxPQUFZO0lBQ2hELE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUZELDhCQUVDO0FBRUQsU0FBZ0IsS0FBSyxDQUFDLEdBQUcsS0FBYTtJQUNwQyxJQUFJLEVBQUUsR0FBRyxJQUFBLFdBQUcsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3JDLElBQUEsU0FBQyxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxPQUFPO0tBQ1YsQ0FBQyxDQUFDLENBQUM7SUFDSixPQUFPO1FBQ0wsSUFBQSxXQUFHLEVBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FDckMsSUFBQSxTQUFDLEVBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBQyxHQUFFLEVBQUUsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hELEVBQUU7S0FDSCxDQUFDLENBQUEsbUJBQW1CO0FBQ3ZCLENBQUM7QUFWRCxzQkFVQyJ9