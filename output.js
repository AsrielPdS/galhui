"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Output = exports.tip = exports.errorMessage = exports.message = exports.keyVal = exports.output = exports.label = void 0;
const galho_1 = require("galho");
const inutil_1 = require("inutil");
const galhui_1 = require("./galhui");
const label = (content) => (0, galho_1.g)("label", (0, galhui_1.hc)("lb" /* label */), content);
exports.label = label;
const output = (...content) => (0, galho_1.g)("span", (0, galhui_1.hc)("lb" /* label */), content);
exports.output = output;
const keyVal = (key, val) => (0, galho_1.g)("span", (0, galhui_1.hc)("in" /* input */), [key + ": ", val]);
exports.keyVal = keyVal;
const message = (c, data) => (0, galho_1.div)((0, galhui_1.hc)("ms" /* message */), data).cls(c);
exports.message = message;
const errorMessage = (data) => (0, exports.message)(data).cls("_e" /* error */);
exports.errorMessage = errorMessage;
const tip = (e, value) => e.prop("title", value);
exports.tip = tip;
class Output extends galho_1.E {
    constructor(text, value, fmt) {
        super((0, inutil_1.isS)(text) ? { text, value, fmt } : text);
    }
    key() { return this.i.key; }
    value(value) {
        if ((0, inutil_1.isU)(value))
            return this.i.value;
        else
            this.set('value', value);
        return this;
    }
    view() {
        let i = this.i;
        return this.bind((0, galho_1.div)(), (s) => {
            s
                .uncls().cls((0, galho_1.cl)("in" /* input */, i.color))
                .set([
                i.text, ': ',
                galhui_1.$.fmt(i.value, i.fmt, i.def && { def: i.def })
            ]);
        });
    }
}
exports.Output = Output;
//export const join = (...content) => div(C.label, content);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3V0cHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUF5QztBQUN6QyxtQ0FBa0M7QUFDbEMscUNBQTJDO0FBR3BDLE1BQU0sS0FBSyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxJQUFBLFNBQUMsRUFBQyxPQUFPLEVBQUUsSUFBQSxXQUFFLG1CQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFBdEQsUUFBQSxLQUFLLFNBQWlEO0FBQzVELE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLElBQUEsU0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFBLFdBQUUsbUJBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUF6RCxRQUFBLE1BQU0sVUFBbUQ7QUFDL0QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFBLFNBQUMsRUFBQyxNQUFNLEVBQUUsSUFBQSxXQUFFLG1CQUFTLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFBakUsUUFBQSxNQUFNLFVBQTJEO0FBRXZFLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBUyxFQUFFLElBQUssRUFBRSxFQUFFLENBQUMsSUFBQSxXQUFHLEVBQUMsSUFBQSxXQUFFLHFCQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQWhFLFFBQUEsT0FBTyxXQUF5RDtBQUN0RSxNQUFNLFlBQVksR0FBRyxDQUFDLElBQUssRUFBRSxFQUFFLENBQUMsSUFBQSxlQUFPLEVBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxrQkFBYSxDQUFDO0FBQXpELFFBQUEsWUFBWSxnQkFBNkM7QUFDL0QsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUE5QyxRQUFBLEdBQUcsT0FBMkM7QUFZM0QsTUFBYSxNQUFvQixTQUFRLFNBQWE7SUFHcEQsWUFBWSxJQUF5QixFQUFFLEtBQVMsRUFBRSxHQUFZO1FBQzVELEtBQUssQ0FBQyxJQUFBLFlBQUcsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0QsR0FBRyxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRzVCLEtBQUssQ0FBQyxLQUFTO1FBQ2IsSUFBSSxJQUFBLFlBQUcsRUFBQyxLQUFLLENBQUM7WUFDWixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDOztZQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM3QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNmLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFBLFdBQUcsR0FBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsQ0FBQztpQkFDQSxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBQSxVQUFFLG9CQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDOUIsR0FBRyxDQUFDO2dCQUNILENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSTtnQkFDWixVQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUMvQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTFCRCx3QkEwQkM7QUFDRCw0REFBNEQifQ==