const BrowserWindow = require('electron').remote.BrowserWindow;
const fs = require('fs');
const path = require('path');
const url = require('url');
const { ipcRenderer } = require('electron');
const axios = require('axios').default;


ipcRenderer.send('emit_page_ready');


const btnCrear = document.getElementById('btnCrear');
const btnLeer = document.getElementById('btnLeer');
const btnEliminar = document.getElementById('btnEliminar');
const contenidoArchivo = document.getElementById('contenidoArchivo');
const nombreArchivo = document.getElementById('nombreArchivo');
const btnVentana = document.getElementById('btnVentana');
const btnGet = document.getElementById('btnGet');
const btnProductos = document.getElementById('btnProductos');

let rutaArchivos = path.join(__dirname, 'archivos');

btnCrear.addEventListener('click', () => {
    let archivo = path.join(rutaArchivos, nombreArchivo.value);
    let contenido = contenidoArchivo.value;
    fs.writeFile(archivo, contenido, (error) => {
        if (error) {
            return console.error(error);
        }
        console.log("El archivo fué creado.");
    })
})

btnLeer.addEventListener('click', () => {
    let archivo = path.join(rutaArchivos, nombreArchivo.value);
    fs.readFile(archivo, (error, data) => {
        if (error) {
            return console.error(error);
        }
        contenidoArchivo.value = data;
        console.log("El archivo fué leído.");
    })
})

btnEliminar.addEventListener('click', () => {
    let archivo = path.join(rutaArchivos, nombreArchivo.value);
    fs.unlink(archivo, (error) => {
        if (error) {
            return console.error(error);
        }
        nombreArchivo.value = '';
        contenidoArchivo.value = '';
        console.log("El archivo fué eliminado.");
    })
})


btnVentana.addEventListener('click', function(e) {
    console.log("boton clickado.");
    let ventana2 = new BrowserWindow({
        frame: false,
        show: false,
        width: 500,
        height: 300,
        maxHeight: 300,
        maxWidth: 500,
        minHeight: 300,
        minWidth: 500,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });

    ventana2.loadURL(url.format({
        pathname: path.join(__dirname, 'ventana2.html'),
        protocol: 'file',
        slashes: true
    }));
    ventana2.on('closed', () => {
        ventana2 = null;
    });

    ventana2.once('ready-to-show', () => {
        ventana2.show();
    })
})


btnGet.addEventListener('click', async function(e) {
    const peticion = await axios.get('https://rickandmortyapi.com/api/character')
        .then(response => {
            console.log(response);
        })
});



btnProductos.addEventListener('click', async() => {
    ipcRenderer.send('consulta', { system: 'solar' });
})