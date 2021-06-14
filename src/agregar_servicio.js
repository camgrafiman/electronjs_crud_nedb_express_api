const { async } = require('validate.js');

window.onload = function() {

    const BrowserWindow = require('electron').remote.BrowserWindow;
    const fs = require('fs');
    const path = require('path');
    const url = require('url');
    const { ipcRenderer } = require('electron');
    const axios = require('axios').default;

    var tiempo = moment();
    moment.lang('es', {
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
        weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
        weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
        weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
    });
    moment.locale('es');
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a')); // October 10th 2020, 2:06:11 pm
    console.log(moment().format('dddd')); // Saturday
    console.log(moment().locale('es').format('LLLL'));
    console.log(moment().format('L'));
    console.log(moment().format('LT')) // hora

    function dataTiempo() {
        return {
            fecha_completa: moment().format('MMMM Do YYYY, h:mm:ss a'),
            fecha_completa2: moment().locale('es').format('LLLL'),
            dia: moment().format('dddd'),
            fecha: moment().format('L'),
            hora: moment().format('LT')
        }
    }



    // Before using it we must add the parse and format functions
    // Here is a sample implementation using moment.js
    validate.extend(validate.validators.datetime, {
        // The value is guaranteed not to be null or undefined but otherwise it
        // could be anything.
        parse: function(value, options) {
            return +moment.utc(value);
        },
        // Input is a unix timestamp
        format: function(value, options) {
            var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
            return moment.utc(value).format(format);
        }
    });

    // These are the constraints used to validate the form
    var constraints = {
        // email: {
        //     // Email is required
        //     // presence: true,
        //     // and must be an email (duh)
        //     email: true
        // },
        // password: {
        //     // Password is also required
        //     presence: true,
        //     // And must be at least 5 characters long
        //     length: {
        //         minimum: 5
        //     }
        // },
        // "confirm-password": {
        //     // You need to confirm your password
        //     presence: true,
        //     // and it needs to be equal to the other password
        //     equality: {
        //         attribute: "password",
        //         message: "^El password no es igual."
        //     }
        // },
        nombre_servicio: {
            // You need to pick a username too
            presence: {
                allowEmpty: false,
                message: "^No puede estar vacío"
            },
            // And it must be between 3 and 20 characters long
            length: {
                minimum: 3,
                maximum: 30,
                message: "^Nombre es muy corto o muy largo (min: 3, máx:30 caracteres)"
            },
            type: "string"
                // format: {
                //     // We don't allow anything that a-z and 0-9
                //     // pattern: "[a-z0-9]+",
                //     patten: "[a-zA-Z0-9]+",
                //     // but we don't care if the username is uppercase or lowercase
                //     flags: "i",
                //     message: "Solo puede contener caracteres como a-z y 0-9"
                // }
        },
        // birthdate: {
        //     // The user needs to give a birthday
        //     presence: true,
        //     // and must be born at least 18 years ago
        //     date: {
        //         latest: moment().subtract(18, "years"),
        //         message: "^Debes de tener al menos 18 años para usar este servicio."
        //     }
        // },
        categoria: {
            // You also need to input where you live
            presence: {
                allowEmpty: false,
                message: "^Debe elegir una categoría"
            },
            // And we restrict the countries supported to Sweden
            // inclusion: {
            //     within: ["ES"],
            //     // The ^ prevents the field name from being prepended to the error
            //     message: "^Este servicio es solo para España."
            // }
        },
        numero_servicio: {
            // Zip is optional but if specified it must be a 5 digit long number
            presence: {
                allowEmpty: false,
                message: "^Debe elegir un número para este servicio."
            },
            numericality: {
                onlyInteger: true,
                greaterThanOrEqualTo: 0,
                message: "^Debe ser un número mayor a 0."
            }
        },
        precio_servicio: {
            // Zip is optional but if specified it must be a 5 digit long number
            presence: {
                allowEmpty: false,
                message: "^Debe elegir un precio inicial para este servicio."
            },
            // format: {
            //     pattern: "[0-9]+",
            //     flags: "i",
            //     message: "can only contain 0-9"
            // }
            numericality: {
                greaterThanOrEqualTo: 0,
                message: "^Debe ser un número mayor a 0."
            }

        },
        iva: {
            // Zip is optional but if specified it must be a 5 digit long number
            presence: {
                allowEmpty: false,
                message: "^Debe elegir el porcentaje de iva aplicado a este servicio."
            },
            numericality: {
                greaterThanOrEqualTo: 0,
                message: "^Debe ser un número mayor a 0."
            }
        }
    };

    // Hook up the form so we can prevent it from being posted
    var form = document.querySelector("form#servicios");
    form.addEventListener("submit", function(ev) {
        ev.preventDefault();
        handleFormSubmit(form);
    });

    // Hook up the inputs to validate on the fly
    var inputs = document.querySelectorAll("input, textarea, select")
    for (var i = 0; i < inputs.length; ++i) {
        inputs.item(i).addEventListener("change", function(ev) {
            var errors = validate(form, constraints) || {};
            showErrorsForInput(this, errors[this.name])
        });
    }

    function handleFormSubmit(form, input) {
        // validate the form against the constraints
        var errors = validate(form, constraints);
        // then we update the form to reflect the results
        showErrors(form, errors || {});
        if (!errors) {
            showSuccess();
        }
    }

    // Updates the inputs with the validation errors
    function showErrors(form, errors) {
        // We loop through all the inputs and show the errors for that input
        _.each(form.querySelectorAll("input[name], select[name]"), function(input) {
            // Since the errors can be null if no errors were found we need to handle
            // that
            showErrorsForInput(input, errors && errors[input.name]);
        });
    }

    // Shows the errors for a specific input
    function showErrorsForInput(input, errors) {
        // This is the root of the input
        var formGroup = closestParent(input.parentNode, "form-group")
            // Find where the error messages will be insert into
            ,
            messages = formGroup.querySelector(".messages");
        // First we remove any old messages and resets the classes
        resetFormGroup(formGroup);
        // If we have errors
        if (errors) {
            // we first mark the group has having errors
            formGroup.classList.add("has-error");
            // then we append all the errors
            _.each(errors, function(error) {
                addError(messages, error);
            });
        } else {
            // otherwise we simply mark it as success
            formGroup.classList.add("has-success");
        }
    }

    // Recusively finds the closest parent that has the specified class
    function closestParent(child, className) {
        if (!child || child == document) {
            return null;
        }
        if (child.classList.contains(className)) {
            return child;
        } else {
            return closestParent(child.parentNode, className);
        }
    }

    function resetFormGroup(formGroup) {
        // Remove the success and error classes
        formGroup.classList.remove("has-error");
        formGroup.classList.remove("has-success");
        // and remove any old messages
        _.each(formGroup.querySelectorAll(".help-block.error"), function(el) {
            el.parentNode.removeChild(el);
        });
    }

    // Adds the specified error with the following markup
    // <p class="help-block error">[message]</p>
    function addError(messages, error) {
        var block = document.createElement("p");
        block.classList.add("help-block");
        block.classList.add("error");
        block.innerText = error;
        messages.appendChild(block);
    }

    let categoria = document.getElementById('categoria');
    categoria.addEventListener('change', detectarCambioCategoria);

    let iva = document.getElementById('iva');
    let precio_servicio = document.getElementById('precio_servicio');

    function calcularTotal() {
        let precioServicio = parseFloat(document.getElementById('precio_servicio').value);
        let iva = document.getElementById('iva').value;
        let precioFinal = calcularIva(precioServicio, iva);
        let total = document.getElementById('total');
        total.value = precioFinal;
    }
    iva.addEventListener('change', calcularTotal);
    precio_servicio.addEventListener('change', calcularTotal);

    function detectarCambioCategoria(e) {
        const valor_categoria = document.getElementById('valor_categoria');
        valor_categoria.innerText = e.target.value;

    }

    function calcularIva(precio, porcentaje) {
        const iva = precio * porcentaje / 100;
        // console.log(porcentaje);
        // const iva = precio * 0.21;
        return parseFloat((precio + iva).toFixed(2));
    }

    function mostrarAlerta(clase, info) {
        const alerta = document.querySelector(clase);
        alerta.classList.toggle('fade');

        setTimeout(() => {
            alerta.classList.toggle('fade');
        }, 3000)
    }

    function showSuccess() {
        // We made it \:D/
        // alert("Todo correcto!");
        let categoriaSel = document.getElementById('categoria').options.selectedIndex;
        let precioServicio = parseFloat(document.getElementById('precio_servicio').value);
        let iva = document.getElementById('iva').value;
        let precioFinal = calcularIva(precioServicio, iva);
        const datos = {
            nombre_servicio: document.getElementById('nombre_servicio').value,
            categoria: document.getElementById('categoria').value,
            nombre_categoria: document.getElementById('categoria').options[categoriaSel].dataset.catnombre,
            numero_servicio: parseInt(document.getElementById('numero_servicio').value),
            codigo_servicio: document.getElementById('categoria').value + document.getElementById('numero_servicio').value,
            precio_servicio: parseFloat(document.getElementById('precio_servicio').value),
            iva: parseFloat(document.getElementById('iva').value),
            precio_con_iva: precioFinal,
            tiempo: dataTiempo(),
            fechajs: new Date()
        }

        //ipcRenderer.send('form_success', datos);
        console.log(datos);
        async function axiosPost() {

            await axios.post('http://localhost:8080/servicios', datos, {
                'Content-Type': 'application/json'
            }).then((respuesta) => {
                console.log(respuesta);
                document.querySelector("form").reset();
                mostrarAlerta('.alert-success', respuesta.statusText);
            }).catch((err) => {
                console.error(err);
                mostrarAlerta('.alert-danger', err);
            });

        }
        axiosPost();

    }

}