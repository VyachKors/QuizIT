export class Form {
    constructor() {
        this.agreeElement = null;
        this.processElement = null;
        this.fields = [
            {
                name: 'name',
                id: 'name',
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false,
            },
            {
                name: 'lastName',
                id: 'last-name',
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false,
            },
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
        ];
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validationField.call(that, item, this)
            }
        });
        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        };
        this.agreeElement = document.getElementById('agree');
        this.agreeElement.onchange = function () {
            that.validateForm();
        }
    }

    validationField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.parentNode.style.borderColor = 'red';
            field.valid = false;
        } else {
            element.parentNode.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }


    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        const isValid = this.agreeElement.checked && validForm;
        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }

    processForm() {
        if (this.validateForm()) {
            let paramString = '';
            this.fields.forEach(item => {
                paramString += (!paramString ? '?' : '&') + item.name + '=' + item.element.value;
            })
            location.href = '#/choice' + paramString;
        }
    }
}