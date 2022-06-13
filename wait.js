"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.busy = exports.wait = exports.waiter = exports.ph = void 0;
const galho_1 = require("galho");
const inutil_1 = require("inutil");
/**place holder */
function ph(type = 1 /* out */) {
    switch (type) {
        case 0 /* inline */:
        case 1 /* out */:
            return (0, galho_1.div)("ld" /* loading */, [
            //icon({ /*s: size, */d: `loading ${C.centered}` }),
            //icon({ /*s: size, */d: `loading ${C.itemA} ${C.centered}` }),
            ]);
    }
}
exports.ph = ph;
function waiter(element, cb) {
    cb && ((0, inutil_1.isP)(cb) ? cb : cb?.()).then(t => {
        if (t instanceof galho_1.S) {
            t.cls(Array.from(element.e.classList).slice(1));
            t.attr("style", (t.attr("style") || "") +
                (element.attr("style") || ""));
        }
        element.replace(t);
    });
}
exports.waiter = waiter;
function wait(type, body) {
    if (!(0, inutil_1.isN)(type)) {
        body = type;
        type = 0 /* inline */;
    }
    let loader = ph(type);
    waiter(loader, body);
    return loader;
}
exports.wait = wait;
function busy(container) {
    let e = wait(), t = setTimeout(() => {
        container.add(e);
    }, 750);
    return () => {
        e.remove();
        clearTimeout(t);
    };
}
exports.busy = busy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndhaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQStCO0FBQy9CLG1DQUFrQztBQVVsQyxrQkFBa0I7QUFDbEIsU0FBZ0IsRUFBRSxDQUFDLElBQUksY0FBUztJQUM5QixRQUFRLElBQUksRUFBRTtRQUNaLG9CQUFlO1FBQ2Y7WUFDRSxPQUFPLElBQUEsV0FBRyxzQkFBWTtZQUNwQixvREFBb0Q7WUFDcEQsK0RBQStEO2FBQ2hFLENBQUMsQ0FBQztLQUNOO0FBQ0gsQ0FBQztBQVRELGdCQVNDO0FBQ0QsU0FBZ0IsTUFBTSxDQUFDLE9BQVUsRUFBRSxFQUFNO0lBQ3ZDLEVBQUUsSUFBSSxDQUFDLElBQUEsWUFBRyxFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDckMsSUFBSSxDQUFDLFlBQVksU0FBQyxFQUFFO1lBQ2xCLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUNaLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3ZCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FDOUIsQ0FBQTtTQUNGO1FBQ0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFYRCx3QkFXQztBQUdELFNBQWdCLElBQUksQ0FBQyxJQUFjLEVBQUUsSUFBUztJQUM1QyxJQUFJLENBQUMsSUFBQSxZQUFHLEVBQUMsSUFBSSxDQUFDLEVBQUU7UUFDZCxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1osSUFBSSxpQkFBWSxDQUFDO0tBQ2xCO0lBQ0QsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckIsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQVJELG9CQVFDO0FBR0QsU0FBZ0IsSUFBSSxDQUFDLFNBQVk7SUFDL0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDbEMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFUixPQUFPLEdBQUcsRUFBRTtRQUNWLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNYLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixDQUFDLENBQUE7QUFDSCxDQUFDO0FBVEQsb0JBU0MifQ==