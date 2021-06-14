const Datastore = require('nedb');
const path = require('path');

console.log("Datastore archivo de conexion encontrado.")

var baseDatos = {};
baseDatos.usuarios = new Datastore({ filename: path.join(__dirname + '/db_usuarios.db'), autoload: true, timestampData: true });
baseDatos.servicios = new Datastore({ filename: path.join(__dirname + '/db_servicios.db'), autoload: true, timestampData: true });
baseDatos.productos = new Datastore({ filename: path.join(__dirname + '/db_productos.db'), autoload: true, timestampData: true });

baseDatos.usuarios.loadDatabase(function(error) {
    console.log(error);
});
baseDatos.servicios.loadDatabase(function(error) {
    console.log(error);
});
baseDatos.productos.loadDatabase(function(error) {
    console.log(error);
});


/* agregar datos: */
// baseDatos.insert({ nombre: 'Manuel Alejandro', profesion: 'Programador' });

module.exports = baseDatos;