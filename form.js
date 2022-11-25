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
            fields(inp, i.outline),
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
    return inputs.map(input => {
        let ii = input.i;
        return div(outline || ii.outline ? "_ io" : "_ ii", [
            g('label', "hd", ii.text).attrs({ for: ii.k, title: ii.text }),
            g(input).c("bd"),
            !!ii.req && g('span', "req", '*'),
        ]);
    });
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
    static defaultValue() {
        return false;
    }
}
/**check box input*/
export const checkIn = (key, req, text) => new CheckIn({ k: key, req, text });
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
    // value(): Dic;
    // value(v: Dic): this;
    // value(v?: Dic) {
    //   return isU(v) ? fromArray(this.ins, v => [v.key, v.value()]) : (, this);
    // }
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
        for (let i of edited ? this.ins.filter(i => (req && i.i.req) || !i.isDef()) : this.ins)
            data[i.key] = i.value;
    }
    isDef(v = this.value, def = this.def) {
        for (let i of this.ins)
            if (!i.isDef(v[i.key], def[i.key]))
                return false;
        return true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQWdCLFVBQVUsRUFBSyxNQUFNLE9BQU8sQ0FBQztBQUN0RSxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM5QyxPQUFPLEVBQUUsTUFBTSxFQUFRLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFtQixHQUFHLEVBQU8sR0FBRyxFQUFFLEdBQUcsRUFBTyxDQUFDLEVBQWtCLE1BQU0sZUFBZSxDQUFDO0FBQzVILE9BQU8sRUFBRSxDQUFDLEVBQVksR0FBRyxFQUFRLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBZSxNQUFNLFNBQVMsQ0FBQztBQUNwRCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBc0UvQixNQUFNLE9BQWdCLEtBQWdHLFNBQVEsQ0FBUTtJQUM3SCxHQUFHLENBQWdCO0lBQzFCLFlBQVksQ0FBSTtRQUNkLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3ZDLENBQUM7SUFDRCxJQUFJLEdBQUcsS0FBSyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENB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