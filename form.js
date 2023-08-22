import { clearEvent, div, E, g, m, onfocusout } from "galho";
import { extend } from "galho/orray.js";
import { assign, byKey, def, filter, is, isA, isO, isS, isU, l, z } from "galho/util.js";
import { $, busy, cancel, confirm, focusable, ibt, icon, label, menuitem, w } from "./galhui.js";
import { errorMessage, modal, selectRoot, setValue, tip } from "./io.js";
import { anyProp, arrayToDic, up } from "./util.js";
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
        super(i);
        (this.inputs = inputs = filter(inputs)).forEach(this.addInput, this);
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
                setTimeout(calc);
            }
        }
    }
    addInput(input) {
        input.form = this;
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
    input(key) {
        for (let input of this.inputs)
            if (input.key == key || (is(input, CompostIn) && (input = input.input(key))))
                return input;
    }
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
        return !anyProp(this.errors, e => e && l(e));
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
export class TForm extends FormBase {
    cols;
    #f;
    constructor(i, cols, inputs) {
        super(i, inputs);
        this.cols = cols;
        g("form").e.requestSubmit();
        inputs.map(i => g(i).on("focusin", () => this.#f = i));
    }
    view() {
        return g("form", "ft tr", [div("sd" /* C.side */), this.cols]).on({
            submit: async (e) => {
                clearEvent(e);
                this.emit("requestsubmit", e);
            },
            keydown: e => {
                let _ = g(this.#f);
                switch (e.key) {
                    case "ArrowLeft":
                        while (_ = _.prev)
                            if (_.is(focusable)) {
                                _.focus();
                                clearEvent(e);
                                break;
                            }
                        break;
                    case "ArrowRight":
                        while (_ = _.next)
                            if (_.is(focusable)) {
                                _.focus();
                                clearEvent(e);
                                break;
                            }
                }
            }
        });
    }
}
/**modal form */
// export function mdform(hd: Label, inputs: Input[], cb?: (dt: Dic, form: FormBase) => Task<unk>, confirm?: S<HTMLButtonElement>, noCancel?: bool, sz?: Size): Promise<Dic>
// export function mdform(hd: Label, form: FormBase, cb?: (dt: Dic, form: FormBase) => Task<unk>, confirm?: S<HTMLButtonElement>, noCancel?: bool, sz?: Size): Promise<Dic>
export function mdform(hd, form, cb, ok = confirm(), noCancel, sz) {
    if (isA(form))
        form = new Form(form);
    return new Promise(res => {
        modal(hd, g(form.set("tag", "div"), "bd"), (cl, md) => [
            ok.p({ type: "submit" }).on("click", e => {
                e.preventDefault();
                if (form.valid()) {
                    clearEvent(e);
                    busy(md, async () => {
                        let dt = form.data();
                        res((await cb?.(dt, form)) || dt);
                        cl();
                    });
                }
            }),
            noCancel || cancel(() => { cl(); res(null); })
        ], sz, !noCancel);
        form.focus();
    });
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
    form;
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
        let k = this.i.k;
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
            input: () => {
                this.emit("input", r.v());
                this.set("value", r.v() || null);
            },
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
        let i = this.i, inp = g("input", {
            type: 'number',
            placeholder: i.ph || '',
            step: i.integer ? 1 : 'any',
            name: i.k, id: i.k, value: i.value,
            min: (i.min || i.omin), max: (i.max || i.omax),
            oninput: () => this.value = inp.v() ? inp.e.valueAsNumber : null,
            onfocus() { inp.e.select(); }
        });
        this.onset(["value", "off"], () => {
            inp.v(i.value);
            inp.e.disabled = !!i.off;
        });
        return (i.unit ? g("span", 0, [inp, i.unit]) : inp).c("_ in");
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
export class DateIn extends Input {
    view() {
        let i = this.i;
        let inp = g("input", "_ in").p({
            type: "date",
            name: i.k, id: i.k,
            placeholder: i.ph,
            value: i.value
        });
        this.onset("value", () => inp.e.value = i.value);
        return inp.on("input", () => this.set("value", inp.e.value || null));
    }
    get def() {
        return this.i.def == "now" ? new Date().toISOString().slice(0, 10) : null;
    }
}
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
        return this.i.def == "now" ? new Date().toISOString().slice(0, 7) : null;
    }
    submit(data) {
        data[this.i.k] = this.value ? this.value + "-01" : null;
    }
}
/**date & time input */
export class DTIn extends Input {
    view() {
        let i = this.i, inp = g("input", "_ in").p({
            type: "datetime-local",
            name: i.k, id: i.k,
            placeholder: i.ph
        }).on("input", () => {
            this.set("value", inp.v() || null);
        });
        return this.bind(inp, () => inp.v(i.value || ""));
    }
}
export class SelectIn extends Input {
    options;
    get active() { return byKey(this.options, this.i.value); }
    constructor(i, options, key = 0) {
        super(i);
        i.item ||= v => def(v[1], v[key]);
        this.options = extend(options, {
            key, parse: e => isO(e) ? e : { [key]: e }
        });
    }
    get value() { return this.i.value; }
    set value(v) { this.i.value === v || this.set("value", v); }
    view() {
        let { i, options } = this, label = g("span"), items = g("table").on("click", ({ currentTarget: ct, target: t }) => ct != t && (this.set("open", false).value = g(t).closest("tr").d())), menu = div("_ menu", items), root = selectRoot(this, options, label, menu, v => this.value = v).attrs({ name: i.k });
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
    get def() { return arrayToDic(this.inputs, v => [v.key, v.def]); }
    get value() { return arrayToDic(this.inputs, v => [v.key, v.value]); }
    set value(v) {
        this.inputs.forEach(i => i.key in v && (i.value = v ? v[i.key] : i.null));
    }
    view() {
        for (let input of this.inputs)
            input.onset('value', () => this.set(['value']));
        return g("span", "_ join", this.inputs);
    }
    fill(value, setAsDefault) {
        if (this.i.sub)
            if (!(value = value[this.i.k]))
                return;
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
    submit(data, edited, req) {
        let { inputs, i } = this;
        if (i.sub)
            data = data[i.k] = i.sub == "array" ? [] : {};
        for (let inp of edited && !i.sub ? inputs.filter(i => (req && i.i.req) || !i.isDef()) : inputs)
            inp.submit(data, edited, req);
    }
    input(key) {
        for (let input of this.inputs)
            if (input.key == key || (is(input, CompostIn) && (input = input.input(key))))
                return input;
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
