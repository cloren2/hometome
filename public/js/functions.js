/////////////////////////////////////////////////
//
//TFG: HomeToMe 2020
//
//I.E.S Clara del Rey
//Autores: Cristina Lorenzo || Antonio Martin
//Tutor: Amadeo Mora
//
//Descripcion: Hoja de funciones de JavaScript que permite el uso de la aplicacion
//
/////////////////////////////////////////////////


/////////////////////////////////////////////////
//
//Metodos globales
//
/////////////////////////////////////////////////

//Limpieza del div resultados y el de chat
function limpiarDiv() {

    if (divBuscador = document.getElementById('provisional')) {
        document.body.removeChild(divBuscador);
    }
    if (msn = document.getElementById('msn')) {
        divChat = document.getElementById('contenedorChat');
        document.body.removeChild(divChat);
    }
}


/////////////////////////////////////////////////
//
//Buscador de preferencias asincrona.
//
//Este modulo consta de las llamadas asincronas al servidor, ademas de
//todos los metodos necesarios para renderizar dentro del template
//los nombres de las preferencias de modo que el usuario pueda 
//quitar y poner filtros segun sus prefernecias
//
//////////////////////////////////////////////// 

//Variables globales de este modulo
var arrayPref = [];
var nombres = [];
divContTag = document.createElement('div');

//Comprobamos si estamos en la home de usuario
if (search = document.getElementById('tags')) {
    search.addEventListener('keyup', searchPreferenceRequest);
}

//Peticion de preferencias al servidor que se produce
//cuando el usuario escribe sobre el input 'tags'
function searchPreferenceRequest() {

    valor = document.getElementById('tags').value;
    ruta = Routing.generate('search');

    if (valor.length > 0) {
        xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', searchPreferenceResponse);
        xhr.open('POST', ruta);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('value=' + valor);
    }
}

//Respuesta con las preferencias encontradas
//@return autocompletar (function)
function searchPreferenceResponse(event) {

    if (event.target.readyState == 4 && event.target.status == 200) {

        objeto_vuelta = event.target.responseText;
        objetoPref = JSON.parse(objeto_vuelta);
        nombres = [];

        for (i = 0; i < objetoPref.length; i++) {
            if (arrayPref.indexOf(objetoPref[i].Id) == -1) {
                nombres = [{
                    id: objetoPref[i].Id,
                    label: objetoPref[i].Nombre
                }];
            } else {
                break;
            }
        }
        autocompletar(nombres);
    }
}

//Funcion de jquery que implementa un imput de texto con autocompletar
function autocompletar(nombres) {
    $("#tags").autocomplete({
        source: nombres,

        select: function (event, ui) {
            preferencia = ui.item.label;
            preferenciaId = ui.item.id;

            paintPreference(preferencia, preferenciaId);
            addPreferences(preferenciaId);
            $(this).val(''); return false;
        }
    });
}

//Metodo para la clase Array que nos permite identificar elementos duplicados
Array.prototype.unique = function (a) {
    return function () { return this.filter(a) }
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0
});

//Añadir al array de preferencias una nueva
function addPreferences(preferenciaId) {
    arrayPref.push(preferenciaId);
    arrayPref = arrayPref.unique();
}

//Eliminar del arry de preferencias una de ellas
function removePreferences(event) {

    remove = parseInt(event.target.value);
    var indice = arrayPref.indexOf(remove);

    //Si no hay elementos entonces se vacia el array
    if (indice == 0) {
        arrayPref = [];
    } else {
        arrayPref.splice(indice, indice);
    }
    nodoBorrar = document.getElementById(remove);
    nodoBorrar.remove();
}

//Funcion para pintar la preferencia en el template
function paintPreference(preference, preferenciaId) {

    buscador = document.getElementById('buscador');

    tag = document.getElementById('tags');
    divContTag.setAttribute('id', 'contenedorPref');
    nodoBuscador = document.getElementById('botonBusqueda');
    buscador.insertBefore(divContTag, nodoBuscador);

    divTag = document.createElement('span');
    texto = document.createTextNode(preference);
    boton = document.createElement('button');

    divTag.setAttribute('id', preferenciaId);
    divTag.setAttribute('name', preferencia);

    boton.setAttribute('value', preferenciaId);
    boton.innerHTML = 'X';
    boton.addEventListener('click', removePreferences);

    divTag.appendChild(texto);
    divTag.appendChild(boton);
    divContTag.appendChild(divTag);

}

/////////////////////////////////////////////////
//
//Aplicacion de chat
//
//Este modulo consta de las llamadas asincronas al servidor, ademas de
//todos los metodos necesarios para renderizar dentro del template
//los mensajes que un usuario tenga con otro
//
//////////////////////////////////////////////// 

//Variables globales de este modulo
var idPasivo = "";
var objetoPref = "";
var intervalo;

if (viewMessagesButton = document.getElementById('buttonMessages')) {
    viewMessagesButton.addEventListener('click', userConversationsRequest);
}

//Crea los elementos necesarios para renderizar el chat
function printChatElements(event) {

    //Limpiamos el div y obtenemos el id del receptor
    limpiarDiv();
    idPasivo = event.target.value;

    //Creando el contenedor del chat
    buscador = document.getElementById('buscador');
    contenedor = document.createElement('div');
    contenedor.setAttribute('class', 'derecha col-7');
    contenedor.setAttribute('id', 'contenedorChat');
    titulo = document.createElement('h2');
    textoTit = document.createTextNode('Mensajes');

    //Insercion del nuevo div(mensajes)
    titulo.appendChild(textoTit);
    contenedor.appendChild(titulo);
    document.body.insertBefore(contenedor, buscador);

    msn = document.createElement('div');
    msn.setAttribute('id', 'msn');

    contenedor.appendChild(msn);

    recuadro = document.createElement('textarea');
    recuadro.setAttribute('id', 'mensaje');

    contenedor.appendChild(recuadro);

    enviar = document.createElement('button');
    enviar.id = idPasivo;
    textoBoton = document.createTextNode('Enviar');
    enviar.addEventListener('click', sendMessageRequest);

    enviar.appendChild(textoBoton);
    contenedor.appendChild(enviar);
messagesRequest()
    //Llamada a peticion de mensajes de forma regular
   // intervalo = setInterval(, 5000);
}

//Funcion para pintar los mensajes nuevos
function printNewMessages(objeto) {

    contenedorMsn = document.getElementById('msn');
    contenedorMsn.innerHTML = "";

    for (let i = 0; i < objeto.length; i++) {

        divMensaje = document.createElement('div');
        contenedorMsn.appendChild(divMensaje);
        mensaje = document.createTextNode(objeto[i].Mensaje);
        salto = document.createElement('br');

        divMensaje.appendChild(salto);
        divMensaje.appendChild(mensaje);

        if (parseInt(objeto[i].Receptor) == idPasivo) {
            divMensaje.setAttribute('class', 'enviados col-6')
        } else {
            divMensaje.setAttribute('class', 'recibidos col-6')
        }
    }
}

//Solicitud de todos los mensajes asincrona
function messagesRequest() {

    ruta = Routing.generate('chat');

    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', messagesResponse);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('value=' + idPasivo);
}

//Respuesta de todos los mensajes asincrona
function messagesResponse(event) {

    if (event.target.readyState == 4 && event.target.status == 200) {
        objeto_vuelta = event.target.responseText;
        objeto = JSON.parse(objeto_vuelta);
        printNewMessages(objeto);
    }
}

//Solicitud asincrona para enviar un nuevo mensaje
function sendMessageRequest(event) {
    idPasivo = event.target.id;
    mensaje = document.getElementById('mensaje').value;
    ruta = Routing.generate('sendMessage');

    xhr = new XMLHttpRequest();
    xhr.id = idPasivo;
    xhr.addEventListener('readystatechange', sendMessageResponse);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('idPasiva=' + idPasivo + '&mensaje=' + mensaje);
}

//Respuesta de envio de mensaje
function sendMessageResponse(event) {

    if (event.target.readyState == 4 && event.target.status == 200) {
        idPasivo = event.target.id;
        messagesRequest(idPasivo);
    }
}

function userConversationsRequest(params) {

    ruta = Routing.generate('searchConversations');

    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', searchUserResponse);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);
}

function userConversationsResponse(event){

    if (intervalo) {
        clearInterval(intervalo);
    }

    if (event.target.readyState == 4 && event.target.status == 200){
        var objeto_vuelta = event.target.responseText;
        var objeto = JSON.parse(objeto_vuelta);

        createUserList(objeto);
    }
}
/////////////////////////////////////////////////
//
//Aplicacion de busqueda de usuarios
//
//Este modulo consta de las llamadas asincronas al servidor, ademas de
//todos los metodos necesarios para renderizar dentro del template
//los usuarios que constan en la base de datos segun los filtros escogidos
//
//////////////////////////////////////////////// 

//Variables globales de este modulo
var resultados;
var divResult;

//Comprobamos que estamos en la home de usuarios
if (searhUserButton = document.getElementById('botonBusqueda')) {
    searhUserButton.addEventListener('click', searchUserRequest);
}


//Peticion asincrona de busqueda de usuario
function searchUserRequest() {

    limpiarDiv();

    //Recogemos los datos que vamos a enviar al servidor
    gender = document.getElementById('genderSelect').value;
    rooMates = document.getElementById('roomMatesSelect').value;
    min = document.getElementById('min').value;
    max = document.getElementById('max').value;
    ciudad = document.getElementById('ciudadSelect').value;
    arrayPreferences = arrayPref.slice();

    ruta = Routing.generate('searchUsers');

    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', searchUserResponse);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('ciudad=' + ciudad + '&gender=' + gender + '&roomMates=' + rooMates + '&min='
        + min + '&max=' + max + '&preferencias=' + arrayPreferences);
}

//Respuesta de busqueda de usuarios
function searchUserResponse(event) {

    if (event.target.readyState == 4 && event.target.status == 200) {

        if (intervalo) {
            clearInterval(intervalo);
        }

        var objeto_vuelta = event.target.responseText;
        var objeto = JSON.parse(objeto_vuelta);

        createUserList(objeto);
    }
}



//Metodo que pinta la lista de usuarios encontrados o un texto en el caso de que no
function createUserList(objeto) {

    limpiarDiv();

    buscador = document.getElementById('buscador');

    resultados = document.createElement('div');
    resultados.setAttribute('class', 'col-7 derecha');
    resultados.setAttribute('id', 'provisional');
    divResult = document.createElement('div');
    document.body.insertBefore(resultados, buscador);
    resultados.appendChild(divResult);
    divResult.setAttribute('id', 'datos');

    if (objeto[0].Id == undefined) {

        texto = document.createTextNode(objeto);
        divResult.appendChild(texto);
    } else {

        tabla = document.createElement('table');
        tabla.setAttribute('class', 'tablaUsuarios');

        var encabezado = tabla.insertRow(0);
        var nombreEncabezado = encabezado.insertCell(0);
        nombreEncabezado.innerHTML = 'Nombre';

        var idEncabezado = encabezado.insertCell(0);
        idEncabezado.innerHTML = 'Id'
        divResult.appendChild(tabla);

        for (i = 0; i < objeto.length; i++) {

            var nombreUsuarios = objeto[i].Nombre;
            var idUsuarios = objeto[i].Id;
            var row = tabla.insertRow(1);
            var celdaId = row.insertCell(0);
            var botonChat = document.createElement('button');
            var texto = document.createTextNode('Chat');

            botonChat.appendChild(texto);
            botonChat.setAttribute('class', 'chat');
            botonChat.setAttribute('value', idUsuarios);
            botonChat.addEventListener('click', printChatElements);
            celdaId.appendChild(botonChat);
            var celdaUsuarios = row.insertCell(1);
            celdaUsuarios.innerHTML = nombreUsuarios;
        }
    }
}

//Slider de para el rango de precios
/*
$(function () {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500,
        values: [75, 300],
        slide: function (event, ui) {
            $("#amount").val(ui.values[0] + "€ - " + ui.values[1] + "€");
        }

    });
    $("#amount").val($("#slider-range").slider("values", 0) + "€ - " + $("#slider-range").slider("values", 1) + "€");
});

*/
/////////////////////////////////////////////////
//
//Validacion del formulario de registro
//
////////////////////////////////////////////////

if (form = document.getElementById('botonRegistro')) {
    form.addEventListener('click', validacion);
}

function validacion(event) {
    var input = document.getElementsByClassName('pass');
    var fileInput = document.getElementsByClassName('fileImg');
    var filePath = fileInput[0].value;
    if (input[0].value == '') {
        event.preventDefault();
        text = '- Introduzca una contraseña';
        erroresUser(text);

    }
    if (!(/\.(jpeg|jpg|webp|png|gif)$/i).test(filePath)) {
        text = '- No has introducido una foto o la extensión no está permitida';
        erroresUser(text)
    }
}

function erroresUser(userError) {
    var div = document.getElementById('errorDiv');
    if (div == null) {
        parentNode = document.getElementById('formRegister')
        div = document.createElement('div');
        div.setAttribute('class', 'error');
        div.setAttribute('id', 'errorDiv');
        parentNode.appendChild(div)
    } else { div = document.getElementById('errorDiv'); div.innerHTML = "" }
    event.preventDefault();
    span = document.createElement('div')
    texto = document.createTextNode(userError);
    div.appendChild(span);
    span.appendChild(texto);
}

function openNav() {
    document.getElementById("myNav").style.width = "100%";
  }
  
  /* Close when someone clicks on the "x" symbol inside the overlay */
  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
  }

  $('#carouselExample').on('slide.bs.carousel', function (e) {

    /*

    CC 2.0 License Iatek LLC 2018
    Attribution required
    
    */

    var $e = $(e.relatedTarget);
    
    var idx = $e.index();
    console.log("IDX :  " + idx);
    
    var itemsPerSlide = 3;
    var totalItems = $('.carousel-item').length;
    
    if (idx >= totalItems-(itemsPerSlide-1)) {
        var it = itemsPerSlide - (totalItems - idx);
        for (var i=0; i<it; i++) {
            // append slides to end
            if (e.direction=="left") {
                $('.carousel-item').eq(i).appendTo('.carousel-inner');
            }
            else {
                $('.carousel-item').eq(0).appendTo('.carousel-inner');
            }
        }
    }
});

if (viewMessagesButton = document.getElementById('buttonMessages')) {
    viewMessagesButton.addEventListener('click', userConversationsRequest);
}
function userConversationsRequest(params) {

    ruta = Routing.generate('searchConversations');

    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', searchUserResponse);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);
}
/*!
    * Start Bootstrap - SB Admin v6.0.0 (https://startbootstrap.com/templates/sb-admin)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-sb-admin/blob/master/LICENSE)
    */
   (function($) {
    "use strict";

    // Add active state to sidbar nav links
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
        $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
            if (this.href === path) {
                $(this).addClass("active");
            }
        });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function(e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
})(jQuery);
