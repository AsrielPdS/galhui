import { clearEvent, div, E, g, m, onfocusout } from "galho";
import { any, fromArray } from "galho/dic.js";
import { extend } from "galho/orray.js";
import { assign, byKey, def, edate, filter, isA, isO, isS, isU, l, z } from "galho/util.js";
import { $, busy, cancel, confirm, ibt, icon, label, menuitem, w } from "./galhui.js";
import { errorMessage, modal, setRoot, setValue, tip } from "./io.js";
import { up } from "./util.js";
export function error(tp, msg, params) { return { tp, params, render: () => msg }; }
export const req = () => error("req" /* ErrorType.required */, w.required);
/** */
export class FormBase extends E {
    inputs;
    constructor(i, inputs) {
        if (isA(i)) {
            inputs = i;
            i = {};
        }
        inputs = filter(inputs);
        super(i);
        (this.inputs = inputs).forEach(this.addInput, this);
        if (i.bots) {
            let form = this;
            for (let bot of i.bots) {
                let srcs = {}, cb = z(bot);
                function calc() {
                    if (this)
                        srcs[this.key] = this.value;
                    cb(srcs, form);
                }
                for (let i = 0; i < bot.length - 1; i++) {
                    let src = bot[i];
                    let inp = this.input(src);
                    srcs[src] = inp.value;
                    inp.onset(["value", "off"], calc);
                }
                calc();
            }
        }
    }
    addInput(input) {
        input.onset(["value", "off"], () => {
            input.visited && this.setErrors(input.key, input.invalid);
            this.emit("input", input);
        });
        input.observeVisited(input => this.setErrors(input.key, input.invalid));
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
    // get def() {
    //   let r: Dic = {};
    //   for (let { key, def } of this.inputs)
    //     r[key] = def;
    //   return r;
    // }
    // /**default data */
    // def(): Dic;
    // def(value: Dic): this;
    // def(value: null): this;
    // def(v?: Dic) {
    //   if (isU(v)) {
    //     let r: Dic = {};
    //     for (let { key, def } of this.inputs)
    //       r[key] = def;
    //     return r;
    //   } else this.inputs.forEach(i => v ?
    //     i.key in v && i.set("def", v?.[i.key]) :
    //     i.set("def", null)
    //   );
    // }
    fill(value, setAsDefault) {
        this
            .emit("fill", value).inputs
            .forEach(i => i.fill(value, setAsDefault));
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
export const onOffHide = (e, isOff) => e.parent.c("_ off", isOff);
export const onOffDisable = (e, isOff) => e.parent.c("_ off", isOff);
export class Form extends FormBase {
    errDiv;
    constructor(i, inputs) {
        super(i, inputs);
        this.on('input', (input) => setTimeout(() => {
            let e = g(input);
            e.parent?.attr("edited", !input.isDef());
            this.i.offFN?.(e, !!input.i.off);
        }));
        this.errDiv = this.i.errorDiv || errorMessage();
        if (this.i.outline == null)
            this.i.outline = $.oform;
    }
    view() {
        let { i, inputs: inp } = this;
        return g(i.tag || 'form', "_ form", [
            fields(inp, this),
            this.errDiv
        ]);
    }
    setErrors(key, errors) {
        super.setErrors(key, errors);
        this.errDiv.set(renderErrors(this.inputs, this.errors));
    }
}
export function mdform(hd, form, cb, ok = confirm(), noCancel, sz) {
    if (isA(form))
        form = new Form(form);
    modal(label(hd, "hd"), g(form.set("tag", "div"), "bd"), (cl, md) => [
        ok.p({ type: "submit" }).on("click", async (e) => {
            e.preventDefault();
            if (form.valid()) {
                clearEvent(e);
                await busy(md, () => cb(form.data(), form));
                cl();
            }
        }),
        noCancel || cancel(cl)
    ], sz, !noCancel, true);
    form.focus();
    return form;
}
export function field(bd, i, form) {
    let t = div(def(form?.i.outline, i.outline) ? "oi" : "ii", [
        g('label', "hd", [
            i.text,
            i.tip && tip(icon($.i.info), i.tip)
        ]).attrs({ for: i.k }), bd = g(bd, "bd"),
        !!i.req && g('span', "req", '*'),
    ]);
    if (i.off)
        form?.i.offFN?.(bd, true);
    return t;
}
export function fields(inputs, form) {
    return inputs.map(input => input.field ?
        input.field(form) :
        field(input, input.i, form));
}
export function fieldGroup(title, inputs, form) {
    return g("fieldset", "_ formg", [
        //TODO: remove sub element in label
        g("legend", 0, label(title)),
        fields(inputs, form)
    ]);
}
export function expand(form, ...main) {
    for (let input of form.inputs)
        g(input).c("sd" /* C.side */, !main.includes(input.key));
    g(form).add(m(div(["ft", "_" + "sd" /* C.side */], [
        g("span", 0, "Mostrar todos"),
        ibt($.i.down, null)
    ]), div(["ft", "sd" /* C.side */], [
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
    fill(src, setAsDefault) {
        let { k } = this.i;
        if (k in src) {
            this.value = src[k];
            if (setAsDefault)
                this.set("def", src[k]);
        }
    }
    get def() { return def(this.i.def, this.null); }
    isDef(value = this.value, def = this.def) {
        return def === value;
    }
    isNull(value = this.value) { return this.isDef(value, this.null); }
    visited;
    observeVisited(handler) {
        onfocusout(g(this), () => {
            this.visited = true;
            handler(this);
        });
    }
    /**show or hide errors */
    error(state) {
        g(this).c("_e" /* Color.error */, state);
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
        let { k, value } = this.i;
        data[k] = value;
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
                errs.push(error("invalid_format" /* ErrorType.invalidFormat */, w.invalidFmt));
            if (i.max && value.length > i.max)
                errs.push(error("text_too_long" /* ErrorType.textTooLong */, "", { max: i.max }));
            if (i.min && value.length < i.min)
                errs.push(error("text_too_short" /* ErrorType.textTooShort */, "", { min: i.min }));
        }
        else if (i.req)
            errs.push(req());
        return errs;
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
            placeholder: i.ph || '',
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
            errs.push(error("is_decimal" /* ErrorType.isDecimal */));
        //if (i.unsigned && value < 0)
        //    errs.push({ type: form.ErrorType.isNegative, key });
        let max = i.max, min = i.min, omin = i.omin, omax = i.omax;
        if ((max != null) && value > max)
            errs.push(error("number_too_big" /* ErrorType.numberTooBig */, "", { max: max }));
        else if (omax != null && value >= omax)
            errs.push(error("number_too_big" /* ErrorType.numberTooBig */, "", { max: omax }));
        if ((min != null) && value < min)
            errs.push(error("number_too_small" /* ErrorType.numberTooSmall */, "", { min: min }));
        else if (omin != null && value <= omin)
            errs.push(error("number_too_small" /* ErrorType.numberTooSmall */, "", { min: omin }));
    }
    return errs;
}
export class CheckIn extends Input {
    view() {
        let i = this.i;
        switch (i.fmt) {
            case "y" /* CBFmt.yesNo */:
                return this.bind(div(null, [
                    g('label', ["cb" /* C.checkbox */, "i"], [
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
                    g('label', ["cb" /* C.checkbox */, "i"], [
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
                }).c("sw" /* C.switch */, i.fmt != "c" /* CBFmt.checkbox */);
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
        return this.bind(g("input").p({
            type: 'time',
            name: i.k, id: i.k,
            placeholder: i.ph,
        }).on('input', function () {
            _this.set('value', this.value + ':00');
        }), (s) => s.p('value', i.value && i.value.slice(0, 5)), 'value');
    }
}
export const time = (key, req) => new TimeIn({ k: key, req });
export class DateIn extends Input {
    view() {
        let i = this.i;
        let inp = g("input", "_ in").p({
            type: "date",
            name: i.k, id: i.k,
            placeholder: i.ph,
            value: i.value
        });
        console.log(i.value);
        this.onset("value", () => inp.e.value = i.value);
        return inp.on("input", () => this.set("value", inp.e.value || null));
    }
    get def() {
        return this.i.def == "now" ? dateISO() : null;
    }
}
function dateISO(v = new Date()) {
    let [y, m, d] = edate(v);
    return `${y}-${(m + "").padStart(2, "0")}-${(d + "").padStart(2, "0")}`;
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
    get active() { return byKey(this.options, this.i.value); }
    constructor(i, options, key = 0) {
        super(i);
        i.item ||= (v) => def(v[1], v[key]);
        this.options = extend(options, {
            key, parse: (e) => isO(e) ? e : { [key]: e }
        });
    }
    get value() { return this.i.value; }
    set value(v) { this.i.value === v || this.set("value", v); }
    view() {
        let { i, options } = this, label = g("span"), items = g("table").on("click", ({ currentTarget: ct, target: t }) => ct != t && (this.set("open", false).value = g(t).closest("tr").d())), menu = div("_ menu", items), root = setRoot(this, options, label, menu).attrs({ name: i.k });
        setValue(this, label);
        this.on(e => ("value" in e) && setValue(this, label));
        options.bind(items, {
            insert: v => menuitem(v.i, i.item(v)).d(v[options.key]),
            tag(active, i, p, tag) {
                let s = p.child(i);
                s.c(tag, active);
                if (active) {
                    menu.e.scroll({ top: s.p('offsetTop') - menu.p('clientHeight') / 2 + s.p('clientHeight') / 2 });
                }
            }
        });
        return root;
    }
    option(k) {
        return this.options.find(k);
    }
}
export class MobSelectIn extends Input {
    options;
    okey;
    constructor(i, options, okey) {
        super(i);
        this.options = options;
        this.okey = okey;
    }
    view() {
        let { i, options, okey } = this;
        return g("select", "_ in", options.map(v => g("option", { value: v[okey] }, i.item(v))))
            .p({ name: i.k, placeholder: i.ph });
    }
}
export class RadioIn extends Input {
    view() {
        let i = this.i, o = i.options.map(v => isS(v) ? [v] : v);
        i.layout ||= l(o) > 3 ? "column" : "wrap";
        return this.bind(g("span", i.layout == 'column' ? "_ col" : '', o.map(([key, text, ico]) => g('label', "cb" /* C.checkbox */, [
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
        i.isDef && (this.isDef = i.isDef);
    }
}
export class CompostIn extends Input {
    constructor(i, inputs) {
        i.value = null;
        super(i);
        for (let input of this.inputs = inputs)
            input.onset(["value", "off"], () => this.set(["value"]));
    }
    inputs;
    get def() { return fromArray(this.inputs, v => [v.key, v.def]); }
    get value() { return fromArray(this.inputs, v => [v.key, v.value]); }
    set value(v) {
        this.inputs.forEach(i => i.key in v && (i.value = v ? v[i.key] : i.null));
    }
    view() {
        for (let input of this.inputs)
            input.onset('value', () => this.set(['value']));
        return div("_ join", this.inputs);
    }
    fill(value, setAsDefault) {
        for (let i of this.inputs)
            i.fill(value, setAsDefault);
    }
    validate(v) {
        let err = [];
        for (let i of this.inputs)
            err.push(...i.validate(v[i.key]));
        return err;
    }
    focus() {
        this.inputs[0]?.focus();
        return this;
    }
    // reset() {
    //   for (let i of this.ins)
    //     i.reset();
    //   return this;
    // }
    submit(data, edited, req) {
        let { inputs: ins, i } = this;
        if (i.sub)
            data = data[i.k] = {};
        for (let i of edited ? ins.filter(i => (req && i.i.req) || !i.isDef()) : ins)
            data[i.key] = i.value;
    }
    isDef(v = this.value, def = this.def) {
        for (let i of this.inputs)
            if (!i.isDef(v[i.key], def[i.key]))
                return false;
        return true;
    }
}
export class GroupIn extends CompostIn {
    view() { throw 1; }
    field(form) {
        return this.$ ||= fieldGroup(this.i.text, this.inputs, form);
    }
    observeVisited(handler) {
        for (let i of this.inputs)
            i.observeVisited(handler);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBYSxDQUFDLEVBQWdCLFVBQVUsRUFBSyxNQUFNLE9BQU8sQ0FBQztBQUN6RixPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM5QyxPQUFPLEVBQVMsTUFBTSxFQUFLLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEQsT0FBTyxFQUFFLE1BQU0sRUFBUSxLQUFLLEVBQUUsR0FBRyxFQUFPLEtBQUssRUFBVSxNQUFNLEVBQWMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFPLENBQUMsRUFBNkIsQ0FBQyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNKLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFLLE1BQU0sRUFBUyxPQUFPLEVBQUUsR0FBRyxFQUFRLElBQUksRUFBUyxLQUFLLEVBQUUsUUFBUSxFQUFRLENBQUMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNuSCxPQUFPLEVBQUUsWUFBWSxFQUFtQixLQUFLLEVBQVEsT0FBTyxFQUFFLFFBQVEsRUFBZSxHQUFHLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDMUcsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQW9DL0IsTUFBTSxVQUFVLEtBQUssQ0FBQyxFQUFhLEVBQUUsR0FBUyxFQUFFLE1BQVksSUFBWSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUEsQ0FBQyxDQUFDO0FBQ2xILE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLGlDQUFxQixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7QUF3Qi9ELE1BQU07QUFDTixN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