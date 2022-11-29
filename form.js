import { cl, div, E, g, m, onfocusout } from "galho";
import { any, fromArray } from "galho/dic.js";
import { assign, byKey, date, def, isA, isS, isU, l } from "galho/util.js";
import { $, ibt, icon, w } from "./galhui.js";
import { errorMessage } from "./io.js";
import { up } from "./util.js";
export class Input extends E {
    ctx;
    constructor(i) {
        super(i);
        if (isU(i.text))
            i.text = def(w[i.k], up(i.k));
        if (isU(i.value))
            i.value = this.def;
    }
    get key() { return this.i.k; }
    get value() { return def(this.i.value, null); }
    set value(v) { this.set("value", v); }
    get def() { return def(this.i.def, this.null); }
    get inline() { return this.ctx?.inline; }
    isDef(value = this.value, def = this.def) {
        return def === value;
    }
    isNull(value = this.value) { return this.isDef(value, this.null); }
    visited;
    observeVisited(handler) {
        onfocusout(g(this), () => {
            this.visited = true;
            handler();
        });
    }
    field(outline) {
        let i = this.i;
        outline ||= i.outline;
        return div(outline ? "_ oi" : "_ ii", [
            g('label', "hd", i.text).attrs({ for: i.k, title: i.text }),
            g(this).c("bd"),
            !!i.req && g('span', "req", '*'),
        ]);
    }
    /**show or hide errors */
    error(state) {
        g(this).c("_e" /* error */, state);
        return this;
    }
    get invalid() {
        let e = this.i.off ? [] : this.validate(this.value);
        return l(e) ? e : null;
    }
    validate(value) {
        let i = this.i, errs = [];
        if (i.req && this.isNull(value))
            errs.push(req());
        return errs;
    }
    submit(data) {
        data[this.i.k] = this.value;
    }
    /**null value used for clear method */
    get null() { return null; }
}
export function error(tp, msg, params) { return { tp, params, render: () => msg }; }
export const req = () => error("req" /* required */, w.required);
export const bots = {};
/** */
export class FormBase extends E {
    inputs;
    constructor(i, inputs) {
        super(i);
        this.inputs = inputs.map(input => {
            //let input = <Input>Reflect.construct(inputs[i.tp], [i, this]);
            input.onset(["value", "off"], () => {
                input.visited && this.setErrors(input.key, input.invalid);
                this.emit("input", input);
            });
            input.observeVisited(() => this.setErrors(input.key, input.invalid));
            return input;
        });
        if (i.bots)
            for (let bot of i.bots) {
                let srcs = {};
                let calc = () => bots[bot.tp].call(this, srcs, bot);
                for (let src of bot.srcs)
                    srcs[src] = this.getData(src, calc);
            }
    }
    view() { throw 1; }
    get isDef() {
        for (let input of this.inputs)
            if (!input.isDef())
                return false;
        return true;
    }
    input(key) { return byKey(this.inputs, key); }
    errors = {};
    setErrors(key, errors) {
        this.errors[key] = errors;
        this.input(key)?.error(!!errors);
    }
    valid(omit, focus = !omit) {
        if (omit)
            for (let input of this.inputs)
                if (input.invalid)
                    return false;
        for (let input of this.inputs) {
            let inv = input.invalid;
            this.setErrors(input.key, inv);
            if (inv && focus) {
                input.focus();
                focus = false;
            }
        }
        //use isto para incluir erros não gerados por inputs direitamente
        return !any(this.errors, e => e && l(e));
    }
    focus() {
        for (let input of this.inputs)
            if (!input.i.off) {
                input.focus();
                break;
            }
        return this;
    }
    def(v) {
        if (isU(v)) {
            let r = {};
            for (let { key, def } of this.inputs)
                r[key] = def;
            return r;
        }
        else
            this.inputs.forEach(i => v && i.key in v && i.set("def", v?.[i.key]));
    }
    fill(value, setAsDefault) {
        if (setAsDefault)
            this.def(value);
        this
            .emit("fill", value).inputs
            .forEach(i => i.fill ? i.fill(value) : i.key in value && (i.value = value[i.key]));
        return this;
    }
    reset(...fields) {
        for (let i of l(fields) ? this.inputs.filter(i => fields.includes(i.key)) : this.inputs) {
            i.visited = false;
            i.value = i.def;
        }
        return this;
    }
    // clear(...fields: str[]) {
    //   for (let i of l(fields) ? this.inputs.filter(i => fields.includes(i.key)) : this.inputs)
    //     i.value(i.null);
    //   return this;
    // }
    /**
     * get value of form
     * @param edited se true only return fields that heve a value
     * @param req se true fields required with default value will be returned too
     */
    data(edited, req) {
        let inputs = this.inputs;
        let r = assign({}, this.i.hidden);
        for (let input of edited ? inputs.filter(i => (req && i.i.req) || !i.isDef()) : inputs)
            input.i.off || input.submit(r, edited, req);
        this.emit("submit", r);
        return r;
    }
    formData(edited, required) {
        let r = new FormData(), data = this.data(edited, required);
        for (let key in data)
            r.append(key, data[key]);
        return r;
    }
    getData(key, onupdate) {
        let i = this.i, target = this.inputs.find(f => f.key == key);
        //se for input
        if (target) {
            onupdate && target.on(onupdate);
        }
        //se for meta
        else if (i.hidden && key in i.hidden)
            target = i.hidden[key];
        else if (i.meta && key in i.meta)
            target = i.meta[key];
        else
            target = i.parent ? i.parent.getData(key, onupdate) : null;
        return target;
    }
}
function renderErrors(inputs, errs) {
    let result = [];
    for (let key in errs) {
        let i = byKey(inputs, key);
        result.push(errs[key]?.map(err => div(0, [i && [g("b", 0, i.i.text), ": "], err])));
        // {
        // (isS(error)) && (error = { tp: error });
        // result.push(div(0, [
        //   i && [g("b", 0, i.i.text), ": "],
        //   errors[error.tp](),
        //   error.info && g("sub", 0, error.info),
        // ]));
        // }
    }
    return result;
}
export class Form extends FormBase {
    constructor(i, inputs) {
        if (isA(i)) {
            inputs = i;
            i = {};
        }
        super(i, inputs);
        this.on('input', (input) => setTimeout(() => {
            g(input).parent().try(p => p.attr("edited", !input.isDef()));
        }));
        this._errorDiv = i.errorDiv || errorMessage();
    }
    view() {
        let { i, inputs: inp } = this;
        return g(i.intern ? 'div' : 'form', "_ form", [
            fields(inp, def(i.outline, $.oform)),
            this._errorDiv
        ]);
    }
    setErrors(key, errors) {
        super.setErrors(key, errors);
        this._errorDiv.set(renderErrors(this.inputs, this.errors));
    }
    _errorDiv;
}
export function fields(inputs, outline) {
    return inputs.map(input => input.field(outline));
}
export function expand(form, ...main) {
    for (let input of form.inputs)
        g(input).c("sd" /* side */, !main.includes(input.key));
    g(form).add(m(div(cl("ft", "_" + "sd" /* side */), [
        g("span", 0, "Mostrar todos"),
        ibt($.i.down, null)
    ]), div(cl("ft", "sd" /* side */), [
        g("span", 0, "Mostrar principais"),
        ibt($.i.up, null),
    ])).on("click", () => g(form).tcls("expand")));
}
export function valid(e) {
    for (let c = 0; c < e.length; c++) {
        let i = e[c];
        if (!i.validity.valid)
            return false;
    }
    return true;
}
export function value(e) {
    let r = {};
    for (let c = 0; c < e.length; c++) {
        let i = e[c];
        if (i.name)
            switch (i.type) {
                case 'radio':
                    if (i.checked)
                        r[i.name] = i.value;
                    break;
                case 'checkbox':
                    r[i.name] = i.checked;
                    break;
                case 'date':
                case 'time':
                case 'week':
                    r[i.name] = i.valueAsDate;
                    break;
                case 'number':
                case 'range':
                    r[i.name] = i.valueAsNumber;
                    break;
                case 'submit':
                    break;
                default:
                    r[i.name] = i.value;
                    break;
            }
    }
    return r;
}
export class TextIn extends Input {
    view() {
        var i = this.i, r;
        if (i.input == 'ta') {
            r = g('textarea', "_ in v").props({
                name: i.k, id: i.k,
                placeholder: i.ph || ''
            }).on('keydown', (e) => {
                if (e.key == "Enter") {
                    if (e.ctrlKey)
                        e.preventDefault();
                    else
                        e.stopPropagation();
                }
            });
        }
        else
            r = g("input", "_ in").props({
                type: i.input || 'text',
                name: i.k, id: i.k, placeholder: i.ph || ''
            });
        r.on("input", () => this.set("value", r.e.value || null));
        return this.bind(r, () => r.e.value = i.value || '', "value");
    }
    validate(value) {
        var i = this.i, errs = [];
        if (value) {
            if (i.pattern && !i.pattern.test(value))
                errs.push(error("invalid_format" /* invalidFormat */, w.invalidFmt));
            if (i.max && value.length > i.max)
                errs.push(error("text_too_long" /* textTooLong */, "", { max: i.max }));
            if (i.min && value.length < i.min)
                errs.push(error("text_too_short" /* textTooShort */, "", { min: i.min }));
        }
        else if (i.req)
            errs.push(req());
        return errs;
    }
    focus() {
        if (this.i.input == 'ta' && this.inline)
            g(this).first().focus();
        else
            g(this).focus();
        return this;
    }
}
/**text input */
export const textIn = (k, req, input) => new TextIn({ k, req, input });
export class NumbIn extends Input {
    view() {
        let i = this.i, inp = g("input")
            .p({
            type: 'number',
            name: i.k, id: i.k,
            step: i.integer ? 1 : 'any',
            placeholder: this.inline ? i.text : i.ph || '',
            value: i.value
        })
            .on({
            input: () => this.set("value", inp.e.value ? inp.e.valueAsNumber : null),
            focus() { inp.e.select(); }
        });
        this.onset("value", () => inp.e.value = i.value);
        return (i.unit ? div(0, [inp, i.unit]) : inp).c("_ in");
    }
    validate(value) {
        return validateNumber(this.i, value);
    }
    // calc(...values: number[]) {
    //   var r = 0;
    //   for (let value of values)
    //     r += value || 0;
    //   return r;
    // }
    focus() {
        let { $, i } = this;
        (i.unit ? $.first() : $).focus();
        return this;
    }
}
export const numbIn = (k, req, text) => new NumbIn({ k, req, text });
export function validateNumber(i, value) {
    let errs = [];
    if (value == null) {
        if (i.req)
            errs.push(req());
    }
    else {
        if (i.integer && Math.floor(value) != value)
            errs.push(error("is_decimal" /* isDecimal */));
        //if (i.unsigned && value < 0)
        //    errs.push({ type: form.ErrorType.isNegative, key });
        let max = i.max, min = i.min, omin = i.openMin, omax = i.openMax;
        if ((max != null) && value > max)
            errs.push(error("number_too_big" /* numberTooBig */, "", { max: max }));
        else if (omax != null && value >= omax)
            errs.push(error("number_too_big" /* numberTooBig */, "", { max: omax }));
        if ((min != null) && value < min)
            errs.push(error("number_too_small" /* numberTooSmall */, "", { min: min }));
        else if (omin != null && value <= omin)
            errs.push(error("number_too_small" /* numberTooSmall */, "", { min: omin }));
    }
    return errs;
}
class CheckIn extends Input {
    view() {
        let i = this.i;
        switch (i.fmt) {
            case "y" /* yesNo */:
                return this.bind(g('div', null, [
                    g('label', ["cb" /* checkbox */, "i"], [
                        g("input", {
                            type: 'radio',
                            value: 1,
                            name: i.k,
                            oninput: () => {
                                this.set('value', true);
                            }
                        }),
                        'Sim'
                    ]),
                    g('label', ["cb" /* checkbox */, "i"], [
                        g("input", {
                            type: 'radio',
                            name: i.k,
                            value: 0,
                            oninput: () => {
                                this.set('value', false);
                            }
                        }),
                        'No'
                    ])
                ]), (s) => {
                    s.child(i.value ? 0 : 1).first().prop('checked', true);
                }, 'value');
            default:
                let inp = g("input", {
                    type: 'checkbox',
                    name: i.k, id: i.k,
                    onclick: i.clear && ((e) => {
                        if (e.altKey)
                            setTimeout(() => {
                                this.set('value', null);
                            });
                    }),
                    oninput: () => this.set('value', inp.prop('checked'))
                }).c("sw" /* switch */, i.fmt != "c" /* checkbox */);
                return this.bind(inp, s => s.props({
                    checked: i.value,
                    placeholder: i.ph || (i.value == null ? '' : i.value ? w.yes : w.no)
                }), 'value');
        }
    }
}
/**check box input*/
export const checkIn = (key, text) => new CheckIn({ k: key, text });
export class TimeIn extends Input {
    view() {
        let _this = this, i = this.i;
        return this.bind(g("input").props({
            type: 'time',
            name: i.k, id: i.k,
            placeholder: i.ph,
        }).on('input', function () {
            _this.set('value', this.value + ':00');
        }), (s) => s.prop('value', i.value && i.value.slice(0, 5)), 'value');
    }
}
export const time = (key, req) => new TimeIn({ k: key, req });
export class DateIn extends Input {
    view() {
        let i = this.i, inp = g("input", "_ in").p({
            type: "date",
            name: i.k, id: i.k,
            placeholder: i.ph,
            value: i.value
        });
        this.onset("value", () => inp.e.value = i.value);
        return inp.on("input", () => this.set("value", inp.e.value || null));
    }
    get def() {
        let y, m, d;
        return this.i.def == "now" ? ([y, m, d] = date(new Date()), `${y}-${m}-${d}`) : null;
    }
}
export const dateIn = (key, req, def) => new DateIn({ k: key, req, def });
export class MonthIn extends Input {
    view() {
        let i = this.i, inp = g("input", "_ in").p({
            type: "month",
            name: i.k, id: i.k,
            placeholder: i.ph,
            value: i.value?.slice(0, 7)
        });
        this.onset("value", () => inp.e.value = i.value?.slice(0, 7));
        return inp.on("input", () => this.set("value", inp.e.value || null));
    }
    get def() {
        let y, m, d;
        return this.i.def == "now" ? ([y, m, d] = date(new Date()), `${y}-${m}`) : null;
    }
    submit(data) {
        data[this.i.k] = this.value ? this.value + "-01" : null;
    }
}
export class DTIn extends Input {
    view() {
        let i = this.i, inp = g("input", "_ in").props({
            type: "datetime-local",
            name: i.k, id: i.k,
            placeholder: i.ph
        }).on("input", () => {
            this.set("value", inp.e.value || null);
        });
        return this.bind(inp, () => inp.e.value = i.value || "");
    }
}
export class RadioIn extends Input {
    view() {
        let i = this.i;
        if (this.inline)
            throw "not implemented";
        return this.bind(g("span", i.layout == 'column' ? "menu" /* menu */ : '', i.options.map(v => isS(v) ? [v] : v).map(([key, text, ico]) => g('label', ["cb" /* checkbox */, "i"], [
            g("input", {
                type: 'radio',
                value: key,
                name: i.k,
                checked: key == i.value,
                oninput: () => { this.set('value', key); }
            }),
            ico && icon(ico),
            text || key
        ]))).on('click', (e) => {
            if (e.altKey) {
                g(e.currentTarget).queryAll('input').p('checked', false);
                this.set('value', null);
            }
        }), (s) => {
            s.queryAll('input').forEach(input => {
                input.checked = input.value == i.value;
            });
        }, 'value').css('position', 'relative');
        //this.fill(options);
        //return e;
    }
}
/**password input */
export class PWIn extends Input {
    view() {
        let i = this.i, inp = g("input", "_ in").p({
            type: 'password', name: i.k,
            placeholder: i.ph
        }).attr('autocomplete', i.auto || false);
        return inp.on("input", () => this.set("value", inp.e.value));
    }
    validate(value) {
        var i = this.i, 
        // key = i.key,
        errs = [];
        if (i.req && !value)
            errs.push(req());
        return errs;
    }
}
export class CompostIn extends Input {
    get ins() { return this.i.inputs; }
    get def() { return fromArray(this.ins, v => [v.key, v.def]); }
    view() {
        let i = this.i;
        for (let input of i.inputs)
            input.onset('value', () => this.set(['value']));
        return div("_ in join", i.inputs);
    }
    get value() { return fromArray(this.ins, v => [v.key, v.value]); }
    set value(v) {
        this.ins.forEach(i => i.key in v && (i.value = v ? v[i.key] : i.null));
    }
    fill(value) { this.value = value; }
    validate(v) {
        let err = [];
        for (let i of this.ins)
            err.push(...i.validate(v[i.key]));
        return err;
    }
    focus() {
        this.ins[0]?.focus();
        return this;
    }
    // reset() {
    //   for (let i of this.ins)
    //     i.reset();
    //   return this;
    // }
    submit(data, edited, req) {
        let { ins, i } = this;
        if (i.sub)
            data = data[i.k] = {};
        for (let i of edited ? ins.filter(i => (req && i.i.req) || !i.isDef()) : ins)
            data[i.key] = i.value;
    }
    isDef(v = this.value, def = this.def) {
        for (let i of this.ins)
            if (!i.isDef(v[i.key], def[i.key]))
                return false;
        return true;
    }
}
export class GroupIn extends CompostIn {
    constructor(i) {
        i.outline = true;
        super(i);
    }
    view() {
        let i = this.i;
        return g("fieldset", "_ g form io", [
            g("legend", 0, i.text),
            fields(i.inputs)
        ]);
    }
    field() {
        return this;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQWdCLFVBQVUsRUFBSyxNQUFNLE9BQU8sQ0FBQztBQUN0RSxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM5QyxPQUFPLEVBQUUsTUFBTSxFQUFRLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFtQixHQUFHLEVBQU8sR0FBRyxFQUFFLEdBQUcsRUFBTyxDQUFDLEVBQWtCLE1BQU0sZUFBZSxDQUFDO0FBQzVILE9BQU8sRUFBRSxDQUFDLEVBQVksR0FBRyxFQUFRLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBZSxNQUFNLFNBQVMsQ0FBQztBQUNwRCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBOEQvQixNQUFNLE9BQWdCLEtBQWdHLFNBQVEsQ0FBUTtJQUM3SCxHQUFHLENBQWdCO0lBQzFCLFlBQVksQ0FBSTtRQUNkLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3ZDLENBQUM7SUFDRCxJQUFJLEdBQUcsS0FBSyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENB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