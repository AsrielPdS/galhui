import { cl, div, E, g, m, onfocusout, span } from "galho";
import { any, fromArray } from "galho/dic.js";
import { extend } from "galho/orray.js";
import { assign, byKey, date, def, filter, isA, isS, isU, l } from "galho/util.js";
import { $, ibt, icon, menuitem, w } from "./galhui.js";
import { setRoot, setValue } from "./hover.js";
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
            inputs = filter(i);
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
export const numbIn = (k, req, text, unit) => new NumbIn({ k, req, text, unit });
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
                return this.bind(div(null, [
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
                    checked: i.value,
                    onclick: i.clear && ((e) => {
                        if (e.altKey)
                            setTimeout(() => this.set('value', null));
                    }),
                    oninput: () => this.set('value', inp.p('checked'))
                }).c("sw" /* switch */, i.fmt != "c" /* checkbox */);
                return this.bind(inp, s => s.p({
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
export class SelectIn extends Input {
    options;
    active;
    #l;
    constructor(i, src, key = "key") {
        super(i);
        this.options = extend(src, { key });
        this.onset("value", v => {
            this.active = this.options.find(v.value);
            setValue(this, this.#l);
        });
    }
    // get value() { return this.i.value; }
    // set value(v: Key) {
    //   this.active = this.options.find(v);
    //   setValue(this, this.#l);
    //   this.set("value", v);
    // }
    option(k) { return this.options.find(k); }
    view() {
        //TODO: checar se é mobile e usar o tag select nativo
        let i = this.i, label = this.#l = g("span"), o = this.options, menu = div("_ menu", [
            o.bind(g("table"), {
                insert: v => menuitem(0, i.item(v), () => this.value = v[o.key]),
                tag(active, i, p, tag) {
                    let s = p.child(i).c(tag, active).e;
                    active && menu.e.scroll({ top: s.offsetTop - menu.e.clientHeight / 2 + s.clientHeight / 2 });
                }
            })
        ]), m = setRoot(this, o, label, menu).p({ id: i.k }).c("in");
        setValue(this, label);
        return m;
    }
}
export class RadioIn extends Input {
    view() {
        let i = this.i;
        if (this.inline)
            throw "not implemented";
        return this.bind(span(i.layout == 'column' ? "menu" /* menu */ : '', i.options.map(v => isS(v) ? [v] : v).map(([key, text, ico]) => g('label', ["cb" /* checkbox */, "i"], [
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQWdCLFVBQVUsRUFBSyxJQUFJLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDakYsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDOUMsT0FBTyxFQUFTLE1BQU0sRUFBSyxNQUFNLGdCQUFnQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxNQUFNLEVBQVEsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQWUsTUFBTSxFQUFjLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFPLENBQUMsRUFBa0IsTUFBTSxlQUFlLENBQUM7QUFDdkksT0FBTyxFQUFFLENBQUMsRUFBWSxHQUFHLEVBQVEsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDeEUsT0FBTyxFQUFlLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBZSxNQUFNLFNBQVMsQ0FBQztBQUNwRCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBOEQvQixNQUFNLE9BQWdCLEtBQWdHLFNBQVEsQ0FBUTtJQUM3SCxHQUFHLENBQWdCO0lBQzFCLFlBQVksQ0FBSTtRQUNkLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMs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