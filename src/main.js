console.log('Main process funcionando...');

const electron = require('electron');
const { app, BrowserWindow, ipcMain, dialog } = electron;
const path = require('path');
const url = require('url');


/* Base de datos NEDB */
const baseDatos = require('./nedb_database/database.js');

const usuarios_db = baseDatos.usuarios;

const { datastore, restApi } = require('./server');




let ventana, ventana2;
let ventanaPadre, ventanaHijo;

const { nuevoMenu } = require('./menuGeneral');

function crearVentana() {

    const { serverApp } = require('./server');

    ventana = new BrowserWindow({
        width: 1600,
        height: 1300,
        maxHeight: 1300,
        maxWidth: 1600,
        /* Quitar la barra de menu: */
        // frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        title: 'Alejandro´s App'
    });
    ventana.loadURL(url.format({
        pathname: path.join(__dirname, 'agregar_servicio.html'),
        // pathname: path.join(__dirname, 'tabla_servicios.html'),
        //pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));
    /* Activar DevTools: */
    //ventana.webContents.openDevTools();
    ventana.on('closed', () => {
        ventana = null;
    });

    // Cargar menu:
    nuevoMenu(app, ventana);

    // /* Ventana hija para que esté siempre por encima del padre: */
    // ventanaPadre = new BrowserWindow({ title: 'Padre' });
    // ventanaHijo = new BrowserWindow({ show: false, parent: ventanaPadre, modal: true, title: 'Hijo' });

    // /*Cargar URL externa */
    // ventanaHijo.loadURL('https://github.com');
    // ventanaHijo.once('ready-to-show', () => {
    //     ventanaHijo.show();
    // })


    /* Ventana 2 */
    // ventana2 = new BrowserWindow({
    //     width: 1000,
    //     height: 800,
    //     minWidth: 800,
    //     minHeight: 600,
    //     webPreferences: {
    //         nodeIntegration: true,
    //         enableRemoteModule: true,
    //     }
    // });
    // ventana2.loadURL(url.format({
    //     pathname: path.join(__dirname, 'index2.html'),
    //     protocol: 'file',
    //     slashes: true
    // }));
    // ventana2.on('closed', () => {
    //     ventana2 = null;
    // })
}

function cargarHTML(ruta) {
    /* Función para cargar diferentes htmls en la misma ventana. ventanaInicial. */
    const indexUrl = url.format({ protocol: 'file', slashes: true, pathname: path.join(__dirname, ruta) })
    ventana.loadURL(indexUrl);

    ventana.once('ready-to-show', () => {
        ventana.show();
    });
}


app.on('ready', crearVentana);


/* Código para MAC OS: */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (ventana === null) {
        crearVentana();
    }
});




/* IPC ================ */
ipcMain.on('emit_page_ready', (evento, args) => {
    console.log('Página lista.')
})

ipcMain.on('consulta', (evento, args) => {
    console.log(args)
})

ipcMain.on('form_success', (evento, args) => {

    const dataUser = async function() {
        await usuarios_db.insert(args);
        console.log("Datos de usuario nuevo insertados.");
    }
    dataUser();

    // console.log(args);
});

ipcMain.on('mostrar_usuarios', (evento, args) => {
    const dataUsers = async function() {
            const usuarios = await usuarios_db.find({});
            return usuarios;

        }
        // evento.reply(JSON.parse(dataUsers()));

})