(function() {

    const BrowserWindow = require('electron').remote.BrowserWindow;
    const fs = require('fs');
    const path = require('path');
    const url = require('url');
    const { ipcRenderer } = require('electron');
    const axios = require('axios').default;

    /* Base de datos NEDB */
    const baseDatos = require('./nedb_database/database.js');

    const usuarios_db = baseDatos.usuarios;

    const listaEmpleados = document.getElementById('listaEmpleados');

    // const formulario = document.getElementById("formulario");

    // formulario.addEventListener('submit', (event) => {
    //         event.preventDefault();
    //         validacionFormulario();
    //         console.log('Formulario submit.');
    //     })
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
        email: {
            // Email is required
            // presence: true,
            // and must be an email (duh)
            email: true
        },
        password: {
            // Password is also required
            presence: true,
            // And must be at least 5 characters long
            length: {
                minimum: 5
            }
        },
        "confirm-password": {
            // You need to confirm your password
            presence: true,
            // and it needs to be equal to the other password
            equality: {
                attribute: "password",
                message: "^El password no es igual."
            }
        },
        username: {
            // You need to pick a username too
            presence: {
                allowEmpty: false,
                message: "^No puede estar vacío"
            },
            // And it must be between 3 and 20 characters long
            length: {
                minimum: 3,
                maximum: 20
            },
            format: {
                // We don't allow anything that a-z and 0-9
                pattern: "[a-z0-9]+",
                // but we don't care if the username is uppercase or lowercase
                flags: "i",
                message: "Solo puede contener caracteres como a-z y 0-9"
            }
        },
        birthdate: {
            // The user needs to give a birthday
            presence: true,
            // and must be born at least 18 years ago
            date: {
                latest: moment().subtract(18, "years"),
                message: "^Debes de tener al menos 18 años para usar este servicio."
            }
        },
        country: {
            // You also need to input where you live
            presence: true,
            // And we restrict the countries supported to Sweden
            inclusion: {
                within: ["ES"],
                // The ^ prevents the field name from being prepended to the error
                message: "^Este servicio es solo para España."
            }
        },
        zip: {
            // Zip is optional but if specified it must be a 5 digit long number
            format: {
                pattern: "\\d{5}"
            }
        },
        "number-of-children": {
            presence: true,
            // Number of children has to be an integer >= 0
            numericality: {
                onlyInteger: true,
                greaterThanOrEqualTo: 0,
                message: "^Debe ser un número mayor a 0."
            }
        }
    };

    // Hook up the form so we can prevent it from being posted
    var form = document.querySelector("form#main");
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

    function showSuccess() {
        // We made it \:D/
        alert("Todo correcto!");
        const datos = {
            nombre: document.getElementById('username').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value || 'no email',
            cumpleanos: document.getElementById('birthdate').value,
            pais: document.getElementById('country').value,
            zip: document.getElementById('zip').value || '0000',
            hijos: document.getElementById('number-of-children').value
        }
        ipcRenderer.send('form_success', datos);

        mostrarUsuarios();

    }

    function mostrarUsuarios() {
        ipcRenderer.send('mostrar_usuarios');
    }

    ipcRenderer.on('get_usuarios', (evento, args) => {
        console.log(args);
    })
})();