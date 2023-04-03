import { div, E, g, m, onfocusout, span } from "galho";
import { any, fromArray } from "galho/dic.js";
import { extend } from "galho/orray.js";
import { assign, byKey, edate, def, filter, isA, isS, isU, l } from "galho/util.js";
import { $, ibt, icon, menuitem, w } from "./galhui.js";
import { Select, setRoot, setValue } from "./hover.js";
import { errorMessage } from "./io.js";
import { up } from "./util.js";
export function error(tp, msg, params) { return { tp, params, render: () => msg }; }
export const req = () => error("req" /* required */, w.required);
export const bots = {};
/** */
export class FormBase extends E {
    inputs;
    constructor(i, inputs) {
        if (isA(i)) {
            inputs = filter(i);
            i = {};
        }
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
async function dataAsync(form, edited, req) {
    let inputs = form.inputs;
    let r = assign({}, form.i.hidden);
    for (let input of edited ? inputs.filter(i => (req && i.i.req) || !i.isDef()) : inputs)
        input.i.off || await input.submit(r, edited, req);
    form.emit("submit", r);
    return r;
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
    errDiv;
    constructor(i, inputs) {
        super(i, inputs);
        this.on('input', (input) => setTimeout(() => {
            g(input).parent?.attr("edited", !input.isDef());
        }));
        this.errDiv = this.i.errorDiv || errorMessage();
    }
    view() {
        let { i, inputs: inp } = this;
        return g(i.intern ? 'div' : 'form', "_ form", [
            fields(inp, def(i.outline, $.oform)),
            this.errDiv
        ]);
    }
    setErrors(key, errors) {
        super.setErrors(key, errors);
        this.errDiv.set(renderErrors(this.inputs, this.errors));
    }
}
export function fields(inputs, outline) {
    return inputs.map(input => input.field(outline));
}
export function expand(form, ...main) {
    for (let input of form.inputs)
        g(input).c("sd" /* side */, !main.includes(input.key));
    g(form).add(m(div(["ft", "_" + "sd" /* side */], [
        g("span", 0, "Mostrar todos"),
        ibt($.i.down, null)
    ]), div(["ft", "sd" /* side */], [
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
            g(this, "bd"),
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
export class TextIn extends Input {
    view() {
        var i = this.i, r;
        if (i.input == 'ta') {
            r = g('textarea', "_ in v").p({
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
            r = g("input", "_ in").p({
                type: i.input || 'text',
                name: i.k, id: i.k, placeholder: i.ph || ''
            });
        r.on({
            input: () => this.set("value", r.e.value || null),
            focus() { r.e.select(); }
        });
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
            g(this).first.focus();
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
            min: i.min || i.omin, max: i.max || i.omax,
            value: i.value
        })
            .on({
            input: () => this.set("value", inp.e.value ? inp.e.valueAsNumber : null),
            focus() { inp.e.select(); }
        });
        this.onset(["value", "off"], () => {
            inp.e.value = i.value;
            inp.e.disabled = !!i.off;
        });
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
        (i.unit ? $.first : $).focus();
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
        let max = i.max, min = i.min, omin = i.omin, omax = i.omax;
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
export class CheckIn extends Input {
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
                    s.child(i.value ? 0 : 1).first.prop('checked', true);
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
        return this.i.def == "now" ? ([y, m, d] = edate(new Date()), `${y}-${m}-${d}`) : null;
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
        return this.i.def == "now" ? ([y, m, d] = edate(new Date()), `${y}-${m}`) : null;
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
        let i = this.i, o = i.options.map(v => isS(v) ? [v] : v);
        i.layout ||= this.inline || l(o) > 5 ? "select" : l(o) > 3 ? "column" : "wrap";
        return i.layout == "select" ?
            new Select({ value: i.value, key: 0 }, o).on("input", v => this.set("value", v)) :
            this.bind(span(i.layout == 'column' ? "_ col" : '', o.map(([key, text, ico]) => g('label', "cb" /* checkbox */, [
                g("input", {
                    type: 'radio',
                    value: key,
                    name: i.k,
                    checked: key == i.value,
                    oninput: () => { this.set('value', key); }
                }),
                ico && icon(ico),
                text || key
            ]))).on('click', e => {
                if (e.altKey) {
                    g(e.currentTarget).queryAll('input').p('checked', false);
                    this.set('value', null);
                }
            }), (s) => {
                s.queryAll('input').forEach(input => {
                    input.checked = input.value == i.value;
                });
            }, 'value').css('position', 'relative');
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
export class CustomIn extends Input {
    view;
    constructor(i, view) {
        super(i);
        this.view = view;
        i.submit && (this.submit = i.submit);
    }
}
export class CompostIn extends Input {
    get ins() { return this.i.inputs; }
    get def() { return fromArray(this.ins, v => [v.key, v.def]); }
    view() {
        let i = this.i;
        for (let input of i.inputs)
            input.onset('value', () => this.set(['value']));
        return div("_ join", i.inputs);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBZ0IsVUFBVSxFQUFLLElBQUksRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUN4RSxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM5QyxPQUFPLEVBQVMsTUFBTSxFQUFLLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEQsT0FBTyxFQUFFLE1BQU0sRUFBUSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBZSxNQUFNLEVBQWMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQU8sQ0FBQyxFQUF3QixNQUFNLGVBQWUsQ0FBQztBQUM5SSxPQUFPLEVBQUUsQ0FBQyxFQUFZLEdBQUcsRUFBUSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN4RSxPQUFPLEVBQWUsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDcEUsT0FBTyxFQUFFLFlBQVksRUFBZSxNQUFNLFNBQVMsQ0FBQztBQUVwRCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBZ0QvQixNQUFNLFVBQVUsS0FBSyxDQUFDLEVBQWEsRUFBRSxHQUFTLEVBQUUsTUFBWSxJQUFZLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQSxDQUFDLENBQUM7QUFDbEgsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssdUJBQXFCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUcvRCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQWlCLEVBQUUsQ0FBQztBQXlCckMsTUFBTTtBQUNO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