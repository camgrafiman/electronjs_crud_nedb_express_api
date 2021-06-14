const { Menu } = require('electron');
const path = require('path');
const isMac = process.platform === 'darwin';
const url = require('url');

/* Menu totalmente personalizado: */
function nuevoMenu(app, ventana) {
    const template = [
        // { role: 'appMenu' }
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about', label: 'Acerca de' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        // { role: 'fileMenu' }
        {
            label: 'Archivo',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' },
                {
                    label: 'Agregar servicio',
                    click: function() {
                        cargarHTML("agregar_servicio.html", ventana);
                        // console.log("guardado");

                    }
                },
                {
                    label: 'Listados',
                    click: function() {
                        cargarHTML("listados.html", ventana);

                    }
                },
                {
                    label: 'Tabla servicios',
                    click: function() {
                        cargarHTML("tabla_servicios.html", ventana);

                    }
                }
            ]
        },
        {
            label: '0. Acerca de',
            accelerator: 'CommandOrControl+0',
            registerAccelerator: true,
            click: function() {
                mostrarAbout();
            }
        },
        // { role: 'editMenu' }
        {
            label: 'Editar',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startspeaking' },
                            { role: 'stopspeaking' }
                        ]
                    }
                ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                    { role: 'close' }
                ])
            ]
        },
        {
            role: 'help',
            label: 'Ayuda',
            submenu: [{
                label: 'Aprender mas',
                click: async() => {
                    await shell.openExternal('https://electronjs.org')
                }
            }, {
                label: 'Menu item personalizado',
                click: async() => {
                    await shell.openExternal('https://wearematterkind.com/');
                }
            }]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

function cargarHTML(ruta, ventana) {
    /* Función para cargar diferentes htmls en la misma ventana. ventanaInicial. */


    const indexUrl = url.format({ protocol: 'file', slashes: true, pathname: path.join(__dirname, ruta) })
    ventana.loadURL(indexUrl);

    ventana.once('ready-to-show', () => {
        ventana.show();
    });
}

function mostrarAbout() {
    showAboutWindow({
        icon: path.join(__dirname, 'static/iconos/icono.png'),
        copyright: 'Copyright © Compañia',
        text: 'Información acerca de Compañia.',
        title: 'Compañia'
    })
}

module.exports = { nuevoMenu }