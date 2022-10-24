"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompostIn = exports.PWIn = exports.RadioIn = exports.DTIn = exports.dateIn = exports.DateIn = exports.time = exports.TimeIn = exports.checkboxIn = exports.validateNumber = exports.NumbIn = exports.textIn = exports.TextIn = exports.value = exports.valid = exports.expand = exports.fields = exports.Form = exports.FormBase = exports.bots = exports.req = exports.error = exports.Input = void 0;
const galho_1 = require("galho");
const dic_js_1 = require("galho/dic.js");
const util_js_1 = require("galho/util.js");
const galhui_js_1 = require("./galhui.js");
const io_js_1 = require("./io.js");
const util_js_2 = require("./util.js");
class Input extends galho_1.E {
    constructor(i) {
        super(i);
        if ((0, util_js_1.isU)(i.text))
            i.text = (0, util_js_1.def)(galhui_js_1.w[i.k], (0, util_js_2.up)(i.k));
        if ((0, util_js_1.isU)(i.value))
            i.value = this.def;
    }
    get key() { return this.i.k; }
    get value() { return (0, util_js_1.def)(this.i.value, null); }
    set value(v) { this.set("value", v); }
    get def() { return (0, util_js_1.def)(this.i.def, this.null); }
    get inline() { return this.ctx?.inline; }
    isDef(value = this.value, def = this.def) {
        return def === value;
    }
    isNull(value = this.value) { return this.isDef(value, this.null); }
    observeVisited(handler) {
        (0, galho_1.onfocusout)((0, galho_1.g)(this), () => {
            this.visited = true;
            handler();
        });
    }
    /**show or hide errors */
    error(state) {
        (0, galho_1.g)(this).c("_e" /* error */, state);
        return this;
    }
    get invalid() {
        let e = this.i.off ? [] : this.validate(this.value);
        return (0, util_js_1.l)(e) ? e : null;
    }
    validate(value) {
        let i = this.i, errs = [];
        if (i.req && this.isNull(value))
            errs.push((0, exports.req)());
        return errs;
    }
    submit(data) {
        data[this.i.k] = this.value;
    }
    /**null value used for clear method */
    get null() { return null; }
}
exports.Input = Input;
function error(tp, msg, params) { return { tp, params, render: () => msg }; }
exports.error = error;
const req = () => error("req" /* required */, galhui_js_1.w.required);
exports.req = req;
exports.bots = {};
/** */
class FormBase extends galho_1.E {
    constructor(i, inputs) {
        super(i);
        this.errors = {};
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
                let calc = () => exports.bots[bot.tp].call(this, srcs, bot);
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
    input(key) { return (0, util_js_1.byKey)(this.inputs, key); }
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
        return !(0, dic_js_1.any)(this.errors, e => e && (0, util_js_1.l)(e));
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
        if ((0, util_js_1.isU)(v)) {
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
        for (let i of (0, util_js_1.l)(fields) ? this.inputs.filter(i => fields.includes(i.key)) : this.inputs)
            i.value = i.def;
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
        let r = (0, util_js_1.assign)({}, this.i.hidden);
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
exports.FormBase = FormBase;
function renderErrors(inputs, errs) {
    let result = [];
    for (let key in errs) {
        let i = (0, util_js_1.byKey)(inputs, key);
        result.push(errs[key]?.map(err => (0, galho_1.div)(0, [i && [(0, galho_1.g)("b", 0, i.i.text), ": "], err])));
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
class Form extends FormBase {
    constructor(i, inputs) {
        if ((0, util_js_1.isA)(i)) {
            inputs = i;
            i = {};
        }
        super(i, inputs);
        this.on('input', (input) => setTimeout(() => {
            (0, galho_1.g)(input).parent().try(p => p.attr("edited", !input.isDef()));
        }));
        this._errorDiv = i.errorDiv || (0, io_js_1.errorMessage)();
    }
    view() {
        let { i, inputs: inp } = this;
        return (0, galho_1.g)(i.intern ? 'div' : 'form', "_ form", [
            fields(inp, i.outline),
            this._errorDiv
        ]);
    }
    setErrors(key, errors) {
        super.setErrors(key, errors);
        this._errorDiv.set(renderErrors(this.inputs, this.errors));
    }
}
exports.Form = Form;
function fields(inputs, outline) {
    return inputs.map(input => {
        let ii = input.i;
        return (0, galho_1.div)(outline || ii.outline ? "_ io" : "_ ii", [
            (0, galho_1.g)('label', "hd", ii.text).attrs({ for: ii.k, title: ii.text }),
            (0, galho_1.g)(input).c("bd"),
            !!ii.req && (0, galho_1.g)('span', "req", '*'),
        ]);
    });
}
exports.fields = fields;
function expand(form, ...main) {
    for (let input of form.inputs)
        (0, galho_1.g)(input).c("sd" /* side */, !main.includes(input.key));
    (0, galho_1.g)(form).add((0, galho_1.m)((0, galho_1.div)((0, galho_1.cl)("ft", "_" + "sd" /* side */), [
        (0, galho_1.g)("span", 0, "Mostrar todos"),
        (0, galhui_js_1.ibt)(galhui_js_1.$.i.down, null)
    ]), (0, galho_1.div)((0, galho_1.cl)("ft", "sd" /* side */), [
        (0, galho_1.g)("span", 0, "Mostrar principais"),
        (0, galhui_js_1.ibt)(galhui_js_1.$.i.up, null),
    ])).on("click", () => (0, galho_1.g)(form).tcls("expand")));
}
exports.expand = expand;
function valid(e) {
    for (let c = 0; c < e.length; c++) {
        let i = e[c];
        if (!i.validity.valid)
            return false;
    }
    return true;
}
exports.valid = valid;
function value(e) {
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
exports.value = value;
class TextIn extends Input {
    view() {
        var i = this.i, r;
        if (i.input == 'ta') {
            r = (0, galho_1.g)('textarea', "_ in v").props({
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
            r = (0, galho_1.g)("input", "_ in").props({
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
                errs.push(error("invalid_format" /* invalidFormat */, galhui_js_1.w.invalidFmt));
            if (i.max && value.length > i.max)
                errs.push(error("text_too_long" /* textTooLong */, "", { max: i.max }));
            if (i.min && value.length < i.min)
                errs.push(error("text_too_short" /* textTooShort */, "", { min: i.min }));
        }
        else if (i.req)
            errs.push((0, exports.req)());
        return errs;
    }
    focus() {
        if (this.i.input == 'ta' && this.inline)
            (0, galho_1.g)(this).first().focus();
        else
            (0, galho_1.g)(this).focus();
        return this;
    }
}
exports.TextIn = TextIn;
/**text input */
const textIn = (k, req, input) => new TextIn({ k, req, input });
exports.textIn = textIn;
class NumbIn extends Input {
    view() {
        let i = this.i, inp = (0, galho_1.g)("input")
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
        return (i.unit ? (0, galho_1.div)(0, [inp, i.unit]) : inp).c("_ in");
    }
    validate(value) {
        return validateNumber(this.i, value);
    }
    calc(...values) {
        var r = 0;
        for (let value of values)
            r += value || 0;
        return r;
    }
    focus() {
        let { $, i } = this;
        (i.unit ? $.first() : $).focus();
        return this;
    }
}
exports.NumbIn = NumbIn;
function validateNumber(i, value) {
    let errs = [];
    if (value == null) {
        if (i.req)
            errs.push((0, exports.req)());
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
exports.validateNumber = validateNumber;
class CheckBoxInput extends Input {
    view() {
        let i = this.i;
        switch (i.fmt) {
            case "y" /* yesNo */:
                return this.bind((0, galho_1.g)('div', null, [
                    (0, galho_1.g)('label', ["cb" /* checkbox */, "i"], [
                        (0, galho_1.g)("input", {
                            type: 'radio',
                            value: 1,
                            name: i.k,
                            oninput: () => {
                                this.set('value', true);
                            }
                        }),
                        'Sim'
                    ]),
                    (0, galho_1.g)('label', ["cb" /* checkbox */, "i"], [
                        (0, galho_1.g)("input", {
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
                let inp = (0, galho_1.g)("input", {
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
                    placeholder: i.ph || (i.value == null ? '' : i.value ? galhui_js_1.w.yes : galhui_js_1.w.no)
                }), 'value');
        }
    }
    static defaultValue() {
        return false;
    }
}
/**checkbox input*/
const checkboxIn = (key, req) => new CheckBoxInput({ k: key, req });
exports.checkboxIn = checkboxIn;
class TimeIn extends Input {
    view() {
        let _this = this, i = this.i;
        return this.bind((0, galho_1.g)("input").props({
            type: 'time',
            name: i.k, id: i.k,
            placeholder: i.ph,
        }).on('input', function () {
            _this.set('value', this.value + ':00');
        }), (s) => s.prop('value', i.value && i.value.slice(0, 5)), 'value');
    }
}
exports.TimeIn = TimeIn;
const time = (key, req) => new TimeIn({ k: key, req });
exports.time = time;
class DateIn extends Input {
    view() {
        let i = this.i, inp = (0, galho_1.g)("input", "_ in").p({
            type: i.tp || "date",
            name: i.k, id: i.k,
            value: i.value,
            placeholder: i.ph
        });
        this.onset("value", () => inp.e.value = i.value);
        return inp.on("input", () => this.set("value", inp.e.value));
        // this.bind(inp, () => (inp.e.valueAsDate != this.value()) && (inp.e.valueAsDate = this.value()), "value");
        // inp.on("input", () => this.set("value", inp.e.valueAsDate));
    }
    validate(value) {
        let i = this.i, errs = [];
        if (i.req && value == null)
            errs.push((0, exports.req)());
        return errs;
    }
    get def() {
        let d = this.i.def;
        if (d == "now")
            d = new Date();
        else if ((0, util_js_1.isN)(d))
            d = new Date(d);
        return d ? (0, util_js_1.isS)(d) ? d : `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` : null;
    }
    isDef(value = this.value, def = this.def) {
        return !def ? !value : def.valueOf() === value.valueOf();
    }
}
exports.DateIn = DateIn;
const dateIn = (key, tp = "date", req) => new DateIn({ k: key, req, tp });
exports.dateIn = dateIn;
class DTIn extends Input {
    view() {
        let i = this.i, inp = (0, galho_1.g)("input", "_ in").props({
            type: "datetime-local",
            name: i.k, id: i.k,
            placeholder: i.ph
        }).on("input", () => {
            this.set("value", inp.e.value || null);
        });
        return this.bind(inp, () => inp.e.value = i.value || "");
    }
}
exports.DTIn = DTIn;
class RadioIn extends Input {
    view() {
        let i = this.i;
        if (this.inline)
            throw "not implemented";
        return this.bind((0, galho_1.g)("span", i.layout == 'column' ? "menu" /* menu */ : '', i.options.map(v => (0, util_js_1.isS)(v) ? [v] : v).map(([key, text, ico]) => (0, galho_1.g)('label', ["cb" /* checkbox */, "i"], [
            (0, galho_1.g)("input", {
                type: 'radio',
                value: key,
                name: i.k,
                checked: key == i.value,
                oninput: () => { this.set('value', key); }
            }),
            ico && (0, galhui_js_1.icon)(ico),
            text || key
        ]))).on('click', (e) => {
            if (e.altKey) {
                (0, galho_1.g)(e.currentTarget).queryAll('input').p('checked', false);
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
exports.RadioIn = RadioIn;
/**password input */
class PWIn extends Input {
    view() {
        let i = this.i, inp = (0, galho_1.g)("input", "_ in").p({
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
            errs.push((0, exports.req)());
        return errs;
    }
}
exports.PWIn = PWIn;
class CompostIn extends Input {
    get ins() { return this.i.inputs; }
    get def() { return (0, dic_js_1.fromArray)(this.ins, v => [v.key, v.def]); }
    view() {
        let i = this.i;
        for (let input of i.inputs)
            input.onset('value', () => this.set(['value']));
        return (0, galho_1.div)("_ in join", i.inputs);
    }
    get value() { return (0, dic_js_1.fromArray)(this.ins, v => [v.key, v.value()]); }
    set value(v) {
        this.ins.forEach(i => i.key in v && i.value(v ? v[i.key] : i.null));
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
            data[i.key] = i.value();
    }
    isDef(v = this.value, def = this.def) {
        for (let i of this.ins)
            if (!i.isDef(v[i.key], def[i.key]))
                return false;
        return true;
    }
}
exports.CompostIn = CompostIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXNFO0FBQ3RFLHlDQUE4QztBQUM5QywyQ0FBc0g7QUFDdEgsMkNBQThEO0FBQzlELG1DQUFvRDtBQUNwRCx1Q0FBK0I7QUFzRS9CLE1BQXNCLEtBQWdHLFNBQVEsU0FBUTtJQUVwSSxZQUFZLENBQUk7UUFDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxJQUFJLElBQUEsYUFBRyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUEsYUFBRyxFQUFDLGFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBQSxZQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsSUFBSSxJQUFBLGFBQUcsRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3ZDLENBQUM7SUFDRCxJQUFJLEdBQUcsS0FBSyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixJQUFJLEtBQUssS0FBSyxPQUFPLElBQUEsYUFBRyxFQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBR3RDLElBQUksR0FBRyxLQUFLLE9BQU8sSUFBQSxhQUFHLEVBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxJQUFJLE1BQU0sS0FBSyxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN6QyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHO1FBQ3RDLE9BQU8sR0FBRyxLQUFLLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUduRSxjQUFjLENBQUMsT0FBa0I7UUFDL0IsSUFBQSxrQkFBVSxFQUFDLElBQUEsU0FBQyxFQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRTtZQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNwQixPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELHlCQUF5QjtJQUN6QixLQUFLLENBQUMsS0FBVztRQUNmLElBQUEsU0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsbUJBQWMsS0FBSyxDQUFDLENBQUM7UUFDOUIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsSUFBSSxPQUFPO1FBQ1QsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEQsT0FBTyxJQUFBLFdBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUNELFFBQVEsQ0FBQyxLQUFRO1FBQ2YsSUFDRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFDVixJQUFJLEdBQVksRUFBRSxDQUFDO1FBRXJCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUEsV0FBRyxHQUFFLENBQUMsQ0FBQztRQUVuQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFHRCxNQUFNLENBQUMsSUFBUztRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUNELHNDQUFzQztJQUN0QyxJQUFJLElBQUksS0FBUSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7Q0FDL0I7QUFwREQsc0JBb0RDO0FBRUQsU0FBZ0IsS0FBSyxDQUFDLEVBQWEsRUFBRSxHQUFTLEVBQUUsTUFBWSxJQUFZLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQSxDQUFDLENBQUM7QUFBbEgsc0JBQWtIO0FBQzNHLE1BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssdUJBQXFCLGFBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUFsRCxRQUFBLEdBQUcsT0FBK0M7QUFHbEQsUUFBQSxJQUFJLEdBQWlCLEVBQUUsQ0FBQztBQXdCckMsTUFBTTtBQUNOLE1BQWEsUUFBOEUsU0FBUSxTQUFRO0lBRXpHLFlBQVksQ0FBSSxFQUFFLE1BQWU7UUFDL0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBNkJYLFdBQU0sR0FBaUIsRUFBRSxDQUFDO1FBM0J4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDL0IsZ0VBQWdFO1lBQ2hFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNqQyxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzFELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDckUsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxDQUFDLElBQUk7WUFDUixLQUFLLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3RCLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQTtnQkFDbEIsSUFBSSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDcEQsS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSTtvQkFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3ZDO0lBQ0wsQ0FBQztJQUNELElBQUksS0FBVSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEIsSUFBSSxLQUFLO1FBQ1AsS0FBSyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTTtZQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtnQkFDaEIsT0FBTyxLQUFLLENBQUM7UUFFakIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsS0FBSyxDQUFDLEdBQVEsSUFBSSxPQUFPLElBQUEsZUFBSyxFQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRW5ELFNBQVMsQ0FBQyxHQUFRLEVBQUUsTUFBZ0I7UUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFDRCxLQUFLLENBQUMsSUFBVyxFQUFFLEtBQUssR0FBRyxDQUFDLElBQUk7UUFDOUIsSUFBSSxJQUFJO1lBQ04sS0FBSyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTTtnQkFDM0IsSUFBSSxLQUFLLENBQUMsT0FBTztvQkFBRSxPQUFPLEtBQUssQ0FBQztRQUVwQyxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDN0IsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFL0IsSUFBSSxHQUFHLElBQUksS0FBSyxFQUFFO2dCQUNoQixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2QsS0FBSyxHQUFHLEtBQUssQ0FBQzthQUNmO1NBQ0Y7UUFDRCxpRUFBaUU7UUFDakUsT0FBTyxDQUFDLElBQUEsWUFBRyxFQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBQSxXQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsS0FBSztRQUNILEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU07WUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUNoQixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2QsTUFBTTthQUNQO1FBQ0gsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBV0QsR0FBRyxDQUFDLENBQU87UUFDVCxJQUFJLElBQUEsYUFBRyxFQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsSUFBSSxDQUFDLEdBQVEsRUFBRSxDQUFDO1lBQ2hCLEtBQUssSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTTtnQkFDbEMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNmLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7O1lBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBQ0QsSUFBSSxDQUFDLEtBQVUsRUFBRSxZQUFtQjtRQUNsQyxJQUFJLFlBQVk7WUFDZCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLElBQUk7YUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLE1BQU07YUFDMUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELEtBQUssQ0FBQyxHQUFHLE1BQWE7UUFDcEIsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFBLFdBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUNyRixDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDbEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsNEJBQTRCO0lBQzVCLDZGQUE2RjtJQUM3Rix1QkFBdUI7SUFDdkIsaUJBQWlCO0lBQ2pCLElBQUk7SUFDSjs7OztPQUlHO0lBQ0gsSUFBSSxDQUFDLE1BQWEsRUFBRSxHQUFVO1FBQzVCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFekIsSUFBSSxDQUFDLEdBQVEsSUFBQSxnQkFBTSxFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO1lBQ3BGLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QyxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDRCxRQUFRLENBQUMsTUFBYSxFQUFFLFFBQWU7UUFDckMsSUFDRSxDQUFDLEdBQUcsSUFBSSxRQUFRLEVBQUUsRUFDbEIsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSTtZQUNsQixDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNoQyxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBUSxFQUFFLFFBQW1DO1FBQ25ELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUV0RSxjQUFjO1FBQ2QsSUFBSSxNQUFNLEVBQUU7WUFDVixRQUFRLElBQVksTUFBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMxQztRQUNELGFBQWE7YUFDUixJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNO1lBQ2xDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUk7WUFDOUIsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O1lBQ2xCLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVoRSxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0NBQ0Y7QUF4SUQsNEJBd0lDO0FBQ0QsU0FBUyxZQUFZLENBQUMsTUFBZSxFQUFFLElBQWtCO0lBQ3ZELElBQUksTUFBTSxHQUFVLEVBQUUsQ0FBQztJQUV2QixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtRQUNwQixJQUFJLENBQUMsR0FBRyxJQUFBLGVBQUssRUFBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBQSxXQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBQSxTQUFDLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BGLElBQUk7UUFDSiwyQ0FBMkM7UUFDM0MsdUJBQXVCO1FBQ3ZCLHNDQUFzQztRQUN0Qyx3QkFBd0I7UUFDeEIsMkNBQTJDO1FBQzNDLE9BQU87UUFDUCxJQUFJO0tBQ0w7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBUUQsTUFBYSxJQUFLLFNBQVEsUUFBZTtJQUd2QyxZQUFZLENBQWtCLEVBQUUsTUFBZ0I7UUFDOUMsSUFBSSxJQUFBLGFBQUcsRUFBQyxDQUFDLENBQUMsRUFBRTtZQUNWLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDWCxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ1I7UUFDRCxLQUFLLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBWSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2pELElBQUEsU0FBQyxFQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0osSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUEsb0JBQVksR0FBRSxDQUFDO0lBQ2hELENBQUM7SUFDRCxJQUFJO1FBQ0YsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzlCLE9BQU8sSUFBQSxTQUFDLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO1lBQzVDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN0QixJQUFJLENBQUMsU0FBUztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxTQUFTLENBQUMsR0FBUSxFQUFFLE1BQWdCO1FBQ2xDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7Q0FFRjtBQTVCRCxvQkE0QkM7QUFDRCxTQUFnQixNQUFNLENBQUMsTUFBZSxFQUFFLE9BQWM7SUFDcEQsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3hCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDakIsT0FBTyxJQUFBLFdBQUcsRUFBQyxPQUFPLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDbEQsSUFBQSxTQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM5RCxJQUFBLFNBQUMsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLElBQUEsU0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDO1NBQ2xDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVRELHdCQVNDO0FBQ0QsU0FBZ0IsTUFBTSxDQUFDLElBQVUsRUFBRSxHQUFHLElBQVc7SUFDL0MsS0FBSyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTTtRQUMzQixJQUFBLFNBQUMsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGtCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRCxJQUFBLFNBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBQSxTQUFDLEVBQ1gsSUFBQSxXQUFHLEVBQUMsSUFBQSxVQUFFLEVBQUMsSUFBSSxFQUFFLEdBQUcsa0JBQVMsQ0FBQyxFQUFFO1FBQzFCLElBQUEsU0FBQyxFQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsZUFBZSxDQUFDO1FBQzdCLElBQUEsZUFBRyxFQUFDLGFBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztLQUNwQixDQUFDLEVBQ0YsSUFBQSxXQUFHLEVBQUMsSUFBQSxVQUFFLEVBQUMsSUFBSSxrQkFBUyxFQUFFO1FBQ3BCLElBQUEsU0FBQyxFQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsb0JBQW9CLENBQUM7UUFDbEMsSUFBQSxlQUFHLEVBQUMsYUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDO0tBQ2xCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxTQUFDLEVBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBWkQsd0JBWUM7QUFDRCxTQUFnQixLQUFLLENBQUMsQ0FBa0I7SUFDdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBcUIsQ0FBQztRQUNqQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLO1lBQ25CLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBUEQsc0JBT0M7QUFDRCxTQUFnQixLQUFLLENBQUMsQ0FBa0I7SUFDdEMsSUFBSSxDQUFDLEdBQTBCLEVBQUUsQ0FBQztJQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFxQixDQUFDO1FBQ2pDLElBQUksQ0FBQyxDQUFDLElBQUk7WUFDUixRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2QsS0FBSyxPQUFPO29CQUNWLElBQUksQ0FBQyxDQUFDLE9BQU87d0JBQ1gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUN0QixNQUFNO2dCQUNSLEtBQUssVUFBVTtvQkFDYixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ3RCLE1BQU07Z0JBQ1IsS0FBSyxNQUFNLENBQUM7Z0JBQ1osS0FBSyxNQUFNLENBQUM7Z0JBQ1osS0FBSyxNQUFNO29CQUNULENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQztvQkFDMUIsTUFBTTtnQkFDUixLQUFLLFFBQVEsQ0FBQztnQkFDZCxLQUFLLE9BQU87b0JBQ1YsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDO29CQUM1QixNQUFNO2dCQUNSLEtBQUssUUFBUTtvQkFDWCxNQUFNO2dCQUNSO29CQUNFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDcEIsTUFBTTthQUNUO0tBQ0o7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUE5QkQsc0JBOEJDO0FBZ0JELE1BQWEsTUFBTyxTQUFRLEtBQW1CO0lBQzdDLElBQUk7UUFDRixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQTRDLENBQUM7UUFDN0QsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtZQUNuQixDQUFDLEdBQUcsSUFBQSxTQUFDLEVBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDaEMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFO2FBQ3hCLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxPQUFPLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxDQUFDLE9BQU87d0JBQ1gsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDOzt3QkFDaEIsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO2lCQUMxQjtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7O1lBQU0sQ0FBQyxHQUFHLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLE1BQU07Z0JBQ3ZCLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUU7YUFDNUMsQ0FBQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFDRCxRQUFRLENBQUMsS0FBYTtRQUNwQixJQUNFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUNWLElBQUksR0FBWSxFQUFFLENBQUM7UUFFckIsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBVSxDQUFDLENBQUMsT0FBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyx1Q0FBMEIsYUFBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFFMUQsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUc7Z0JBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxvQ0FBd0IsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUc7Z0JBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxzQ0FBeUIsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FFaEU7YUFBTSxJQUFJLENBQUMsQ0FBQyxHQUFHO1lBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFBLFdBQUcsR0FBRSxDQUFDLENBQUM7UUFFbkIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsS0FBSztRQUNILElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNO1lBQ3JDLElBQUEsU0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDOztZQUNyQixJQUFBLFNBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQTlDRCx3QkE4Q0M7QUFDRCxnQkFBZ0I7QUFDVCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQU0sRUFBRSxHQUFVLEVBQUUsS0FBbUIsRUFBRSxFQUFFLENBQ2hFLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBRG5CLFFBQUEsTUFBTSxVQUNhO0FBZWhDLE1BQWEsTUFBTyxTQUFRLEtBQXFCO0lBQy9DLElBQUk7UUFDRixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBd0IsSUFBQSxTQUFDLEVBQUMsT0FBTyxDQUFDO2FBQ2xELENBQUMsQ0FBQztZQUNELElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUs7WUFDaEMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRTtZQUM5QyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUs7U0FDZixDQUFDO2FBQ0QsRUFBRSxDQUFDO1lBQ0YsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3hFLEtBQUssS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBLENBQUMsQ0FBQztTQUMzQixDQUFDLENBQUM7UUFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEQsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUEsV0FBRyxFQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFDRCxRQUFRLENBQUMsS0FBYTtRQUNwQixPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDRCxJQUFJLENBQUMsR0FBRyxNQUFnQjtRQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixLQUFLLElBQUksS0FBSyxJQUFJLE1BQU07WUFDdEIsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDbEIsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBQ0QsS0FBSztRQUNILElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQWhDRCx3QkFnQ0M7QUFDRCxTQUFnQixjQUFjLENBQUMsQ0FBNkIsRUFBRSxLQUFVO0lBQ3RFLElBQUksSUFBSSxHQUFZLEVBQUUsQ0FBQztJQUN2QixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDakIsSUFBSSxDQUFDLENBQUMsR0FBRztZQUNQLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBQSxXQUFHLEdBQUUsQ0FBQyxDQUFDO0tBQ3BCO1NBQU07UUFDTCxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLO1lBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyw4QkFBcUIsQ0FBQyxDQUFDO1FBQ3hDLDhCQUE4QjtRQUM5QiwwREFBMEQ7UUFDMUQsSUFDRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFDWCxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFDWCxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFDaEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFbkIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsR0FBRztZQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssc0NBQXlCLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDeEQsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJO1lBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxzQ0FBeUIsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU5RCxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxHQUFHO1lBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSywwQ0FBMkIsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUMxRCxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksS0FBSyxJQUFJLElBQUk7WUFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLDBDQUEyQixFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2pFO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBM0JELHdDQTJCQztBQWdCRCxNQUFNLGFBQWMsU0FBUSxLQUFxQjtJQUMvQyxJQUFJO1FBQ0YsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNmLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRTtZQUNiO2dCQUNFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFBLFNBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO29CQUM5QixJQUFBLFNBQUMsRUFBQyxPQUFPLEVBQUUsc0JBQWEsR0FBRyxDQUFDLEVBQUU7d0JBQzVCLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRTs0QkFDVCxJQUFJLEVBQUUsT0FBTzs0QkFDYixLQUFLLEVBQU8sQ0FBQzs0QkFDYixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ1QsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQ0FDWixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQzs0QkFDMUIsQ0FBQzt5QkFDRixDQUFDO3dCQUNGLEtBQUs7cUJBQ04sQ0FBQztvQkFDRixJQUFBLFNBQUMsRUFBQyxPQUFPLEVBQUUsc0JBQWEsR0FBRyxDQUFDLEVBQUU7d0JBQzVCLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRTs0QkFDVCxJQUFJLEVBQUUsT0FBTzs0QkFDYixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ1QsS0FBSyxFQUFPLENBQUM7NEJBQ2IsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQ0FDWixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQzs0QkFDM0IsQ0FBQzt5QkFDRixDQUFDO3dCQUNGLElBQUk7cUJBQ0wsQ0FBQztpQkFDSCxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDUixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDekQsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRWQ7Z0JBQ0UsSUFBSSxHQUFHLEdBQXdCLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRTtvQkFDeEMsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbEIsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQWEsRUFBRSxFQUFFO3dCQUNyQyxJQUFJLENBQUMsQ0FBQyxNQUFNOzRCQUNWLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0NBRWQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7NEJBQzFCLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUMsQ0FBQztvQkFDRixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDdEQsQ0FBQyxDQUFDLENBQUMsb0JBQVcsQ0FBQyxDQUFDLEdBQUcsc0JBQWtCLENBQUMsQ0FBQztnQkFFeEMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQ2pDLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSztvQkFDaEIsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFDLENBQUMsRUFBRSxDQUFDO2lCQUNyRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FFaEI7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQVk7UUFDakIsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0NBQ0Y7QUFDRCxtQkFBbUI7QUFDWixNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQVEsRUFBRSxHQUFVLEVBQUUsRUFBRSxDQUNqRCxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUR4QixRQUFBLFVBQVUsY0FDYztBQVFyQyxNQUFhLE1BQU8sU0FBUSxLQUFtQjtJQUM3QyxJQUFJO1FBQ0YsSUFDRSxLQUFLLEdBQUcsSUFBSSxFQUNaLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUEsU0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNoQyxJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsQixXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUU7U0FDbEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFDYixLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7Q0FDRjtBQWRELHdCQWNDO0FBRU0sTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFRLEVBQUUsR0FBVSxFQUFFLEVBQUUsQ0FDM0MsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFEakIsUUFBQSxJQUFJLFFBQ2E7QUFROUIsTUFBYSxNQUFPLFNBQVEsS0FBbUI7SUFDN0MsSUFBSTtRQUNGLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksTUFBTTtZQUNwQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLO1lBQ2QsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFO1NBQ2xCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3RCw0R0FBNEc7UUFDNUcsK0RBQStEO0lBQ2pFLENBQUM7SUFDRCxRQUFRLENBQUMsS0FBVTtRQUNqQixJQUNFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUNWLElBQUksR0FBWSxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssSUFBSSxJQUFJO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBQSxXQUFHLEdBQUUsQ0FBQyxDQUFDO1FBRW5CLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELElBQUksR0FBRztRQUNMLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEtBQUs7WUFBRSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQzthQUMxQixJQUFJLElBQUEsYUFBRyxFQUFDLENBQUMsQ0FBQztZQUFFLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBQSxhQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3pGLENBQUM7SUFDRCxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzNELENBQUM7Q0FDRjtBQWhDRCx3QkFnQ0M7QUFFTSxNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQVEsRUFBRSxLQUFvQixNQUFNLEVBQUUsR0FBVSxFQUFFLEVBQUUsQ0FDekUsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRHJCLFFBQUEsTUFBTSxVQUNlO0FBT2xDLE1BQWEsSUFBSyxTQUFRLEtBQWlCO0lBQ3pDLElBQUk7UUFDRixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFBLFNBQUMsRUFBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzdDLElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRTtTQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUM7SUFDM0QsQ0FBQztDQUNGO0FBWEQsb0JBV0M7QUFZRCxNQUFhLE9BQVEsU0FBUSxLQUFvQjtJQUUvQyxJQUFJO1FBQ0YsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksSUFBSSxDQUFDLE1BQU07WUFDYixNQUFNLGlCQUFpQixDQUFDO1FBRTFCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFBLFNBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsQ0FBQyxtQkFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBQSxhQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBQSxTQUFDLEVBQUMsT0FBTyxFQUFFLHNCQUFhLEdBQUcsQ0FBQyxFQUFFO1lBQ2xLLElBQUEsU0FBQyxFQUFDLE9BQU8sRUFBRTtnQkFDVCxJQUFJLEVBQUUsT0FBTztnQkFDYixLQUFLLEVBQVUsR0FBRztnQkFDbEIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNULE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEtBQUs7Z0JBQ3ZCLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0MsQ0FBQztZQUNGLEdBQUcsSUFBSSxJQUFBLGdCQUFJLEVBQUMsR0FBRyxDQUFDO1lBQ2hCLElBQUksSUFBSSxHQUFHO1NBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBYSxFQUFFLEVBQUU7WUFDakMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUNaLElBQUEsU0FBQyxFQUFVLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDekI7UUFDSCxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ1IsQ0FBQyxDQUFDLFFBQVEsQ0FBbUIsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNwRCxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hDLHFCQUFxQjtRQUNyQixXQUFXO0lBQ2IsQ0FBQztDQUNGO0FBOUJELDBCQThCQztBQWNELG9CQUFvQjtBQUNwQixNQUFhLElBQUssU0FBUSxLQUFpQjtJQUN6QyxJQUFJO1FBQ0YsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBQSxTQUFDLEVBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQixXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUU7U0FDbEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQztRQUN6QyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQWE7UUFDcEIsSUFDRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDVixlQUFlO1FBQ2YsSUFBSSxHQUFZLEVBQUUsQ0FBQztRQUdyQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLO1lBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBQSxXQUFHLEdBQUUsQ0FBQyxDQUFDO1FBRW5CLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGO0FBcEJELG9CQW9CQztBQU1ELE1BQWEsU0FBVSxTQUFRLEtBQXNCO0lBQ25ELElBQUksR0FBRyxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ25DLElBQUksR0FBRyxLQUFLLE9BQU8sSUFBQSxrQkFBUyxFQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQzdELElBQUk7UUFDRixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2YsS0FBSyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsTUFBTTtZQUN4QixLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxELE9BQU8sSUFBQSxXQUFHLEVBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0QsSUFBSSxLQUFLLEtBQUssT0FBTyxJQUFBLGtCQUFTLEVBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRSxJQUFJLEtBQUssQ0FBQyxDQUFNO1FBQ2QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUNELGdCQUFnQjtJQUNoQix1QkFBdUI7SUFDdkIsbUJBQW1CO0lBQ25CLDZFQUE2RTtJQUM3RSxJQUFJO0lBQ0osSUFBSSxDQUFDLEtBQVUsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDeEMsUUFBUSxDQUFDLENBQU07UUFDYixJQUFJLEdBQUcsR0FBWSxFQUFFLENBQUM7UUFDdEIsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRztZQUNwQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFDRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNyQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxZQUFZO0lBQ1osNEJBQTRCO0lBQzVCLGlCQUFpQjtJQUNqQixpQkFBaUI7SUFDakIsSUFBSTtJQUNKLE1BQU0sQ0FBQyxJQUFTLEVBQUUsTUFBWSxFQUFFLEdBQVM7UUFDdkMsS0FBSyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRztZQUNwRixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRztRQUNsQyxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHO1lBQ3BCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEMsT0FBTyxLQUFLLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUE3Q0QsOEJBNkNDIn0=