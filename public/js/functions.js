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
    divResult = document.getElementById('child-cpanel');

    incognita = document.getElementById('search-cpanel')
    if (divResult.hasChildNodes() && incognita) {
        divResult.removeChild(incognita);
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
console.log(document.getElementById('tags'))
//Peticion de preferencias al servidor que se produce
//cuando el usuario escribe sobre el input 'tags'
function searchPreferenceRequest() {
console.log('hola')
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

    buscador = document.getElementById('search-panel');

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
    viewSearchButton = document.getElementById('buttonSearch')
    viewMessagesButton.addEventListener('click', userConversationsRequest);
    viewSearchButton.addEventListener('click', createSearchElements);
}


//Crea los elementos necesarios para renderizar el chat
function printChatElements(objeto) {

    //Limpiamos el div y obtenemos el id del receptor
    //limpiarDiv();
    //idPasivo = event.target.value;

    /*
    //Creando el contenedor del chat
    buscador = document.getElementById('container-msn');
    contenedor = document.createElement('div');
    contenedor.setAttribute('id', 'contenedorChat');
    titulo = document.createElement('h2');
    textoTit = document.createTextNode('Mensajes');

    //Insercion del nuevo div(mensajes)
    titulo.appendChild(textoTit);
    contenedor.appendChild(titulo);
    buscador.appendChild(contenedor)
    //document.body.insertBefore(contenedor, buscador);

    msn = document.createElement('div');
    msn.setAttribute('id', 'msn');

    contenedor.appendChild(msn);
    //openNav();
    recuadro = document.createElement('textarea');
    recuadro.setAttribute('id', 'mensaje');

    contenedor.appendChild(recuadro);

    enviar = document.createElement('button');
    enviar.id = idPasivo;
    textoBoton = document.createTextNode('Enviar');
    enviar.addEventListener('click', sendMessageRequest);

    enviar.appendChild(textoBoton);
    contenedor.appendChild(enviar);
    */

    rpanel = document.getElementById('results-panel');

    rpanel.innerHTML = "";

/*
    chat =
        '<div class="h-100">' +
        '<div class="container scroll-chat" id="chat-box">' +
        '<div class="row justify-content-end">' +
        '<div class="col-7 enviados">' +
        'esto es un mensaje enviado' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-7 recibidos">' +
        'esto es un mensaje recibido' +
        '</div>' +
        '</div>' +
        '<div class="row justify-content-end">' +
        '<div class="col-7 enviados">' +
        'esto es un mensaje enviado' +
        '</div>' +
        '</div>' +
        '<div class="row justify-content-end">' +
        '<div class="col-7 enviados">' +
        'esto es un mensaje enviado' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-7 recibidos">' +
        'esto es un mensaje recibido' +
        '</div>' +
        '</div>' +
        '<div class="row justify-content-end">' +
        '<div class="col-7 enviados">' +
        'esto es un mensaje enviado' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-7 recibidos">' +
        'esto es un mensaje recibido' +
        '</div>' +
        '</div>' +
        '<div class="row justify-content-end">' +
        '<div class="col-7 enviados">' +
        'esto es un mensaje enviado' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-7 recibidos">' +
        'esto es un mensaje recibido' +
        '</div>' +
        '</div>' +
        '<div class="row justify-content-end">' +
        '<div class="col-7 enviados">' +
        'esto es un mensaje enviado' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-7 recibidos">' +
        'esto es un mensaje recibido' +
        '</div>' +
        '</div>' +
        '<div class="row justify-content-end">' +
        '<div class="col-7 enviados">' +
        'esto es un mensaje enviado' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div class="col-7 recibidos">' +
        'esto es un mensaje recibido' +
        '</div>' +
        '</div>' +
        '</div>'

    textArea = '<div class="container" id="textArea">' +
        '<div class="row">' +
        '<input type="text"></input>' +
        '<button type="button">Enviar</button>' +
        '</div>' +
        '</div>' +
        '</div>'

    rpanel.innerHTML = chat + textArea;
    //createProfileElements();
    rpanel.innerHTML="";*/

    chat = '<div class="h-100">' +
    '<div class="container overflow-auto" id="chat-box" style="height: 89%">';
   for (i=0;i<objeto.length;i++){
    if (objeto[i].usuarioActivo==objeto[i].Emisor){
        chat=chat+'<div class="row justify-content-end">'+
        '<div class="col-7 enviados">'+
        objeto[i].Mensaje+
        '</div>'+
    '</div>'
    } else{
        chat=chat+   '<div class="row">'+
        '<div class="col-7 recibidos">'+
        objeto[i].Mensaje+
        '</div>'+
    '</div>'
    }

    
    
     
} 
chat=chat+'</div>'+
'<div class="container border border-secondary rounded" id="textArea">'+
    '<div class="row d-flex justify-content-center">'+
    '<div class="form-group mx-sm-3 ">'+
        '<input id="mensaje"  class="form-control" type="text"></input>'+
        '</div>'+
        '<div class="form-group mx-sm-3">'+
        '<button id="btn-send" class="btn btn-outline-secondary" type="button">Enviar</button>'+
        '</div>'+
    '</div>'+
'</div>'+
'</div>';

    rpanel.innerHTML=chat;
   var btnsend =document.getElementById('btn-send');
   btnsend.addEventListener('click',sendMessageRequest)
    //Llamada a peticion de mensajes de forma regular
    // intervalo = setInterval(, 5000);
}


function createProfileElements(objeto) {
    profPanel = document.getElementById('profile-panel');
    profile =
    '<div class="profile-panel scroll-fit">'+
                '<div id="img-panel">'+
                    `<img id="profile-img"src="users/user${objeto.Id}/${objeto.Foto}">`+
                '</div>'+
                `<h2> ${objeto.Nombre},${objeto.Ciudad}  </h2>`+
                '<div>'+
                    `<p>${objeto.Preferencias}</p>`+
                '</div>'+
            '</div>'

    profPanel.innerHTML=profile;
}

//Solicitud de todos los mensajes asincrona
var idPasivo;
function messagesRequest(event) {

    console.log('estoy cargando mensajes')
    if(event.target)
     idPasivo=event.target.value
    ruta = Routing.generate('chat');
    //printChatElements();
    
    
    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', messagesResponse);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('value=' + idPasivo);
    panelUserRequest(idPasivo);
}

//Respuesta de todos los mensajes asincrona
function messagesResponse(event) {

    if (event.target.readyState == 4 && event.target.status == 200) {
        console.log('respuesta todos mensajes');
        objeto_vuelta = event.target.responseText;
        objeto = JSON.parse(objeto_vuelta);
        //printNewMessages(objeto);
        printChatElements(objeto);
    }
}

function panelUserRequest(idPasivo){
    ruta = Routing.generate('panel_user');
    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', panelUserResponse);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('value=' + idPasivo);
}
function panelUserResponse(event){
    if (event.target.readyState == 4 && event.target.status == 200) {
        console.log('respuesta todos mensajes');
        objeto_vuelta = event.target.responseText;
        objeto = JSON.parse(objeto_vuelta);
       console.log(objeto);
       createProfileElements(objeto);
    }
}
//Solicitud asincrona para enviar un nuevo mensaje
function sendMessageRequest(event) {
    console.log('estoy enviando mensajes')
    //idPasivo = event.target.value;
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
        //idPasivo = event.target.id;
        console.log('ENVIO IDPASIVO '+idPasivo)
        messagesRequest(idPasivo);
    }
}

function userConversationsRequest(params) {

    ruta = Routing.generate('searchConversations');

    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', userConversationsResponse);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);
}

function userConversationsResponse(event) {

    if (intervalo) {
        clearInterval(intervalo);
    }

    if (event.target.readyState == 4 && event.target.status == 200) {
        var objeto_vuelta = event.target.responseText;
        var objeto = JSON.parse(objeto_vuelta);
        createUserConversationList(objeto);
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
var ciudadSelect;

//Comprobamos que estamos en la home de usuarios
if (searchUserButton = document.getElementById('botonBusqueda')) {
    searchUserButton.addEventListener('click', searchUserRequest);
    ciudadSelect = document.getElementById("ciudadSelect").options;
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

    divResult = document.getElementById('results-panel');
    div = document.createElement('div');
    div.setAttribute('id', 'parrafo');

    if (objeto[0].Id == undefined) {

        texto = document.createTextNode(objeto);

        p = document.createElement('p');
        p.appendChild(texto);
        div.appendChild(p);
        divResult.appendChild(div);

    } else {

        resultados =
            '<div class="container" id="conversation-box">' +
            '<div class="row" id="title-section">' +
            '<h5>Resultados</h5>' +
            '</div>';
        for (i = 0; i < objeto.length; i++) {
            resultados = resultados + '<div class="row">' +
                '<div class="col-4">' +
                `<img src="users/user${objeto[i].Id}/${objeto[i].Foto}" class="rounded-circle img-fluid app-img">` +
                '</div>' +
                '<div class="col-8">' +
                '<div class="col-xs">' +
                `<span>${objeto[i].Nombre}</span>` +
                '</div>' +
                '<div class="col-xs">'
            for (j = 0; j < 3; j++) {
                if (objeto[i].Preferencias[j] != undefined) {
                    resultados = resultados + `<span>#${objeto[i].Preferencias[j]} </span>`;
                }
                ++j;
                if (objeto[i].Preferencias[j] != undefined) {
                    resultados = resultados + `<span>#${objeto[i].Preferencias[j]}</span>` +
                        '</div>'
                }

            }
            if (objeto[i].Preferencias.length >= 4) { resultados = resultados + '<span>#...</span>' }
            resultados = resultados + '<br>'
            resultados = resultados + '<br>'
            resultados = resultados + `<button class="btn-chatSearchUser" value="${objeto[i].Id}" type="button">Chat</button>` +
                '</div>' +
                '</div>' +
                '<div>' +
                '<hr>' +
                '</div>';
        }
        resultados = resultados + '</div>';
        divResult.innerHTML = resultados;
        btnSearchUser = document.getElementsByClassName('btn-chatSearchUser');
        for (let i = 0; i< btnSearchUser.length; i++) {
            btnSearchUser[i].addEventListener('click',messagesRequest)
           
        }
        

    }
}

function createUserConversationList(objeto) {
    limpiarDiv();

    divResult = document.getElementById('child-cpanel');
    div = document.createElement('div');
    div.setAttribute('id', 'parrafo');

    if (objeto[0].Id == undefined) {

        texto = document.createTextNode(objeto);

        p = document.createElement('p');
        p.appendChild(texto);
        div.appendChild(p);
        divResult.appendChild(div);

    } else {
        resultados =
            '<div class="container scroll-fit" id="conversation-box">';
        for (i = 0; i < objeto.length; i++) {
            resultados = resultados + 
                //`<button type="button" class="conversation-prev" value="${objeto[i].Id}">`+
                    '<div class="row d-flex justify-content-center">' +
                        '<div class="col-xs">' +
                            `<img src="users/user${objeto[i].Id}/${objeto[i].Foto}" class="rounded-circle img-fluid app-img">` +
                        '</div>'+
                        '<div class="col-sm" id="col-fix">'+
                        //nombre iba en div normal
                            `<button type="button" class="conversation-prev" value="${objeto[i].Id}">${objeto[i].Nombre}</button>` +
                            `<div class="msn-prev">${objeto[i].msn}</div>`+ 
                           
                        '</div>'+
                    '</div>'+
               // '</button>'+
                '<div>'+
                '<hr>'+
                '</div>';
        }
        resultados = resultados + '</div>';
        divResult.innerHTML = resultados;

        chatPrevs = document.getElementsByClassName('conversation-prev');
        for (let i = 0; i < chatPrevs.length; i++) {
            chatPrevs[i].addEventListener('click', messagesRequest);
        }

    }
}

function createSearchElements() {

    divResult = document.getElementById('child-cpanel');

    var search = '<div id="child-cpanel">' +
        '<div id="search-panel">' +
        '<label for="ciudad">Ciudad:</label>' +
        '<select id="ciudadSelect" name="ciudad" class="form-control-sm">';
    if (ciudadSelect.length > 0) {
        for (i = 0; i < ciudadSelect.length; i++) {
            search = search +
                `<option value=${ciudadSelect[i].value} >${ciudadSelect[i].text}</option> `;
                    }
                }else{
    search = search +                
                    '<option value="N">No hay ciudades</option> ';
                }
    search = search +             
                '</select>'+
                '</br>'+
                '<label for="genero">¿Chicos, chicas?:</label>'+
                '<select  class="form-control-sm" id="genderSelect" name="genero">'+
                    '<option value="H">Hombre</option>'+
                    '<option value="M">Mujer</option>'+
                    '<option value="N" selected>No me importa</option>'+
                '</select>'+
                '</br>'+
                '<label for="genero">Nº Máximo de compañeros:</label>'+
                '<select  class="form-control-sm" id="roomMatesSelect" name="roomMates">'+
                    '<option value="1">1 persona</option> '+
                    '<option value="2" selected>2 personas</option>'+
                    '<option value="3+">3 o más personas</option>'+
                '</select>'+
                '</br>'+
                '<div class="col">'+
                    '<label for="genero">Precio minimo del alquiler:</label>'+
                    '<input class="form-control-sm" type="text" size="4" placeholder="min" id="min">'+
                '</div>'+
                '<div class="col">'+
                    '<label for="genero">Precio máximo del alquiler:</label>'+
                    '<input class="form-control-sm" type="text" size="4" placeholder="max" id="max">'+
               ' </div>'+
                '</br>'+
                '<div class="ui-widget" id="buscadorPreferencias">'+
                    '<label for="tags">Búsqueda de preferencias: </label>'+
                    '<input id="tags" class="form-control">'+
                '</div>'+
                '</br>'+
                '<button type="button" class="form-control" id="botonBusqueda">Buscar</button>'+
                '</div>';     
        divResult.innerHTML = search;
        search = document.getElementById('tags')
        btnSearch = document.getElementById('botonBusqueda');
        search.addEventListener('keyup', searchPreferenceRequest);
        btnSearch.addEventListener('click',searchUserRequest)

        rpanel = document.getElementById('results-panel');
        ppanel = document.getElementById('profile-panel');
        ppanel.innerHTML="";
        rpanel.innerHTML="";
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

/////////////////////////////////////////////////
//
//Funciones esteticas de la app y la home
//
////////////////////////////////////////////////

buttonsToggler = document.getElementsByClassName('navbar-toggler')
buttonClose = document.getElementsByClassName('close');
if (buttonsToggler) {
    for (i = 0; i < buttonsToggler.length; i++) {
        buttonsToggler[i].addEventListener('click', openNav);
        buttonClose[i].addEventListener('click', closeNav);
    }
}

function openNav(event) {
    console.log(event.target.getAttribute('id'));
    if (event.target.getAttribute('id') == 'toggler-l') {

        document.getElementById("myNav-profile").style.width = "100%";
    } else {
        if (chat = document.getElementById('myNav-chat')) {
            chat.style.width = "100%";
        }
        if (home = document.getElementById('myNav')) {
            home.style.width = "100%";
        }
    }
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav(event) {

    if (event.target.getAttribute('id') == 'toggler-close-r') {
        document.getElementById('myNav-profile').style.width = "0%";
    } else {
        if (chat = document.getElementById('myNav-chat')) {
            chat.style.width = "0%";
        }
        if (home = document.getElementById('myNav')) {
            home.style.width = "0%";
        }
    }
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

    if (idx >= totalItems - (itemsPerSlide - 1)) {
        var it = itemsPerSlide - (totalItems - idx);
        for (var i = 0; i < it; i++) {
            // append slides to end
            if (e.direction == "left") {
                $('.carousel-item').eq(i).appendTo('.carousel-inner');
            }
            else {
                $('.carousel-item').eq(0).appendTo('.carousel-inner');
            }
        }
    }
});


/*!
    * Start Bootstrap - SB Admin v6.0.0 (https://startbootstrap.com/templates/sb-admin)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-sb-admin/blob/master/LICENSE)
    */
(function ($) {
    "use strict";

    // Add active state to sidbar nav links
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
    $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function () {
        if (this.href === path) {
            $(this).addClass("active");
        }
    });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function (e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
})(jQuery);
