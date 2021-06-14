window.onload = function() {
    console.log("pagina cargada!.");
    const BrowserWindow = require('electron').remote.BrowserWindow;
    const fs = require('fs');
    const path = require('path');
    const url = require('url');
    const { ipcRenderer } = require('electron');
    const axios = require('axios').default;

    const tabla_servicios = document.getElementById('tabla_servicios');

    let servicios = async function() {

        let response = await axios.get('http://localhost:8080/servicios')
            .then(datos => {
                console.log(datos.data)
                window.globalData = datos.data;
                // tabla_servicios.dataset.url = 'servicios.json';

            })
            .catch((err) => {
                console.warn(err);
            })

        return response;
    }

    servicios();


    function axiosTest() {
        var strr = [];
        axios.get('http://localhost:8080/servicios')
            .then(function(response) {
                strr.push(response.data);
            })



        .catch(function(error) {
            console.log(error);
        });
        return strr;
    }

    function cargarDatos() {
        console.log("----DATOS CARGADOS");
        $('#tabla_servicios').bootstrapTable({
            // url: 'servicios.json'
            url: 'http://localhost:8080/servicios',
            method: 'GET',
            sidePagination: 'client', // server
            pagination: true,
            pageList: [8, 10, 25, 50, 100, 'ALL'],
            showToggle: true,
            showColumns: true,
            searchAlign: 'left',
            detailViewByClick: true,
            detailViewIcon: false,
            showExport: true,
            exportTypes: ['json', 'xml', 'csv', 'txt', 'excel'],
            showFooter: true,
            showRefresh: true,
            showExtendedPagination: true,
            showPaginationSwitch: true,
            paginationDetailHAlign: "right",
            idField: '_id',
            btSelectItem: '_id',
            formatSearch: function() {
                return 'Buscar..'
            },
            formatLoadingMessage: function() {
                return 'Cargando datos...';
            },
            formatRecordsPerPage: function(pageNumber) {
                return pageNumber + ' filas por página';
            },
            formatShowingRows: function(pageFrom, pageTo, totalRows) {
                return 'Mostrando ' + pageFrom + ' a ' + pageTo + ' de ' + totalRows + ' servicios.';
            },
            formatNoMatches: function() {
                return 'No se han encontrado datos.';
            },
            formatPaginationSwitch: function() {
                return 'Ocultar/Mostrar paginación';
            },
            formatRefresh: function() {
                return 'Refrescar';
            },
            formatToggle: function() {
                return 'Activar/Desactivar';
            },
            formatColumns: function() {
                return 'Columnas';
            },
            formatAllRows: function() {
                return 'Todos';
            }
        });

        $('td').click(function() {
            alert($(this).serialize())
            return false
        })



    }
    cargarDatos();








}