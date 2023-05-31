import { clearEvent, div, E, g, m, onfocusout } from "galho";
import { any, fromArray } from "galho/dic.js";
import { extend } from "galho/orray.js";
import { assign, byKey, def, edate, filter, isA, isO, isS, isU, l, z } from "galho/util.js";
import { $, busy, cancel, confirm, ibt, icon, label, menuitem, w } from "./galhui.js";
import { errorMessage, mdOnBlur, modal, setRoot, setValue, tip } from "./io.js";
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
        input.observeVisited(() => this.setErrors(input.key, input.invalid));
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
export function mdform(hd, form, cb, ok = confirm(), noCancel) {
    if (isA(form))
        form = new Form(form);
    let cl = () => md.remove();
    g(form)
        .badd(label(hd, "hd"))
        .add(div("ft", [
        ok.p({ type: "submit" }).on("click", async (e) => {
            e.preventDefault();
            if (form.valid()) {
                clearEvent(e);
                await busy(g(form), () => cb(form.data(), form));
                cl();
            }
        }),
        noCancel || cancel(cl)
    ]));
    let md = modal(form);
    noCancel || mdOnBlur(md);
    form.focus();
    return form;
}
export function fields(inputs, form) {
    return inputs.map(input => input.field(form));
}
export function inputGroup(i, title, inputs, form) {
    return div("_ formg", [
        div("hd", [icon(i), title]),
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
            handler();
        });
    }
    field(form) {
        let i = this.i, bd = g(this, "bd");
        let t = div(def(form?.i.outline, i.outline) ? "oi" : "ii", [
            g('label', "hd", [
                i.text,
                i.tip && tip(icon($.i.info), i.tip)
            ]).attrs({ for: i.k }), bd,
            !!i.req && g('span', "req", '*'),
        ]);
        if (i.off)
            form?.i.offFN?.(bd, true);
        return t;
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
    fill(value, setAsDefault) {
        for (let i of this.i.inputs)
            i.fill(value, setAsDefault);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQWdCLFVBQVUsRUFBSyxNQUFNLE9BQU8sQ0FBQztBQUM5RSxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM5QyxPQUFPLEVBQVMsTUFBTSxFQUFLLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEQsT0FBTyxFQUFFLE1BQU0sRUFBUSxLQUFLLEVBQUUsR0FBRyxFQUFPLEtBQUssRUFBVSxNQUFNLEVBQWMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFPLENBQUMsRUFBNkIsQ0FBQyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNKLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFLLE1BQU0sRUFBUyxPQUFPLEVBQUUsR0FBRyxFQUFRLElBQUksRUFBUyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUM3RyxPQUFPLEVBQUUsWUFBWSxFQUFTLFFBQVEsRUFBRSxLQUFLLEVBQVEsT0FBTyxFQUFFLFFBQVEsRUFBZSxHQUFHLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDMUcsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQW9DL0IsTUFBTSxVQUFVLEtBQUssQ0FBQyxFQUFhLEVBQUUsR0FBUyxFQUFFLE1BQVksSUFBWSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUEsQ0FBQyxDQUFDO0FBQ2xILE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLGlDQUFxQixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7QUF3Qi9ELE1B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SUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRTtZQUNqQixLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM1QixDQUFDLENBQUM7UUFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RCxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUNELElBQUksR0FBRztRQUNMLElBQUksQ0FBTSxFQUFFLENBQU0sRUFBRSxDQUFNLENBQUM7UUFDM0IsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ25GLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBUztRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDMUQsQ0FBQztDQUNGO0FBTUQsTUFBTSxPQUFPLElB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QUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Q0FDRjtBQU1ELE1BQU0sT0FBTyxTQUFVLFNBQVEsS0FBc0I7SUFDbkQsSUFBSSxHQUFHLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbkMsSUFBSSxHQUFHLEtBQUssT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDN0QsSUFBSTtRQUNGLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDZixLQUFLLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxNQUFNO1lBQ3hCLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbEQsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsSUFBSSxLQUFLLEtBQUssT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsSUFBSSxLQUFLLENBQUMsQ0FBTTtRQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxD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