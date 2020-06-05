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

//funcion input number 



//funcion foto registratiob form
$(document).on("click", ".browse", function () {
    var file = $(this).parents().find(".file");
    file.trigger("click");
});
$('input[type="file"]').change(function (e) {
    var fileName = e.target.files[0].name;
    $("#file").val(fileName);

    var reader = new FileReader();
    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        document.getElementById("preview").src = e.target.result;
    };
    // read the image file as a data URL.
    reader.readAsDataURL(this.files[0]);
});

//Mostrar/ocultar contraseña registration form

$(document).ready(function () {
    $("#show_hide_password a").on('click', function (event) {
        event.preventDefault();
        if ($('#show_hide_password input').attr("type") == "text") {
            $('#show_hide_password input').attr('type', 'password');
            $('#show_hide_password i').addClass("fa-eye-slash");
            $('#show_hide_password i').removeClass("fa-eye");
        } else if ($('#show_hide_password input').attr("type") == "password") {
            $('#show_hide_password input').attr('type', 'text');
            $('#show_hide_password i').removeClass("fa-eye-slash");
            $('#show_hide_password i').addClass("fa-eye");
        }
    });
});

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

    remove = parseInt(event.target.getAttribute('value'));
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
    divContTag.setAttribute('class', 'border preference-box');
    nodoBuscador = document.getElementById('botonBusqueda');
    buscador.insertBefore(divContTag, nodoBuscador);

    divTag = document.createElement('span');
    texto = document.createTextNode(preference);
    boton = document.createElement('div');

    divTag.setAttribute('id', preferenciaId);
    divTag.setAttribute('name', preferencia);
    divTag.setAttribute('class', 'chip-preference');


    boton.setAttribute('value', preferenciaId);
    boton.setAttribute('class', 'closechip');
    boton.innerHTML = '&times';
    boton.addEventListener('click', removePreferences);

    divTag.appendChild(texto);
    divTag.appendChild(boton);
    divContTag.appendChild(divTag);

    var objDiv = document.getElementById("contenedorPref");
    objDiv.scrollTop = objDiv.scrollHeight;

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
var makeButton = true;

if (viewMessagesButton = document.getElementById('buttonMessages')) {
    viewSearchButton = document.getElementById('buttonSearch');
    viewMessagesMobileButton = document.getElementById('toggler-r');
    viewMessagesButton.addEventListener('click', userConversationsRequest);
    viewMessagesMobileButton.addEventListener('click', userConversationsRequest)
    viewSearchButton.addEventListener('click', createSearchElements);
}


//Solicitud de todos los mensajes asincrona
var idPasivo;
function messagesRequest(idParameter) {
    ruta = Routing.generate('chat');
    idPasivo = idParameter;
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
        objeto_vuelta = event.target.responseText;
        objeto = JSON.parse(objeto_vuelta);
        printChatElements(objeto);
    }
}

var nameChat;
//Crea los elementos necesarios para renderizar el chat
function printChatElements(objeto) {

    if (screen.width < 768) {
        document.body.setAttribute('class', 'overflow-hidden');
        rmobilepanel = document.getElementById('mobile-chat');
        chatbox = document.getElementById('chat-box');
        document.getElementById('name-chat').innerHTML = nameChat;
        chat = '<div class="h-100">' +
            '<div class="container overflow-auto" id="chat-box" style="height: 81%">';
        //Si lo entregado por parametro es un objeto
        if (typeof objeto === 'object') {
            for (i = 0; i < objeto.length; i++) {
                if (objeto[i].usuarioActivo == objeto[i].Emisor) {
                    chat = chat + '<div class="row justify-content-end">' +
                        '<div class="mw-60 enviados">' +
                        objeto[i].Mensaje +
                        '</div>' +
                        '</div>'

                } else {
                    chat = chat + '<div class="row">' +
                        '<div class="recibidos">' +
                        objeto[i].Mensaje +
                        '</div>' +
                        '</div>'
                }
            }
            //Si lo entregado por parametro es un int
        } else {
            idPasivo = objeto;
        }

        chat = chat + '</div>' +
            '<div class="container border border-secondary rounded fixed-bottom" id="textArea">' +
            '<div class="row d-flex justify-content-center">' +
            '<div class="form-group mx-sm-3 ">' +
            `<input id="mensaje" tabindex="0" placeholder="Di ¡Hola!"onkeyup="sendMessageRequestKey(event, ${idPasivo})" class="form-control" type="text"></input>` +
            '</div>' +
            '<div class="form-group mx-sm-3">' +
            `<button id="btn-send" class="btn btn-outline-secondary"  onClick="sendMessageRequest(${idPasivo})" type="button">Enviar</button>` +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        rmobilepanel.innerHTML = chat;


        var objDiv = document.getElementById("chat-box");
        objDiv.scrollTop = objDiv.scrollHeight;
        document.getElementById('mensaje').focus();
        //Llamada a peticion de mensajes de forma regular
        // intervalo = setInterval(, 5000);
    } else {
        var element = document.getElementById("c-app");
        element.classList.remove("d-none");
        rpanel = document.getElementById('results-panel');

        rpanel.innerHTML = "";

        chat = '<div class="h-100">' +
            '<div class="container overflow-auto" id="chat-box" style="height: 89%">';
        if (typeof objeto === 'object') {
            for (i = 0; i < objeto.length; i++) {
                if (objeto[i].usuarioActivo == objeto[i].Emisor) {
                    chat = chat + '<div class="row justify-content-end">' +
                        '<div class="enviados">' +
                        objeto[i].Mensaje +
                        '</div>' +
                        '</div>'

                } else {
                    chat = chat + '<div class="row">' +
                        '<div class="recibidos">' +
                        objeto[i].Mensaje +
                        '</div>' +
                        '</div>'
                }
            }
        } else {
            idPasivo = objeto;
        }

        chat = chat + '</div>' +
            '<div class="container border border-secondary rounded fixed-bottom" id="textArea">' +
            '<div class="row d-flex justify-content-center">' +
            '<div class="form-group mx-sm-3 ">' +
            `<input id="mensaje" tabindex="0" placeholder="Di ¡Hola!" onkeyup="sendMessageRequestKey(event, ${idPasivo})" class="form-control" type="text"></input>` +
            '</div>' +
            '<div class="form-group mx-sm-3">' +
            `<button id="btn-send" class="btn btn-outline-secondary" onClick="sendMessageRequest(${idPasivo})" type="button">Enviar</button>` +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
            
        rpanel.innerHTML = chat;
        var objDiv = document.getElementById("chat-box");
        objDiv.scrollTop = objDiv.scrollHeight;
        document.getElementById('mensaje').focus();
        //Llamada a peticion de mensajes de forma regular
        // intervalo = setInterval(, 5000);
    }

}

//Solicitud asincrona para enviar un nuevo mensaje
function sendMessageRequest(idPasivo) {
    //idPasivo = event.target.value;

    mensaje = document.getElementById('mensaje').value;
    document.getElementById('mensaje').focus();
    if (mensaje != '') {
        ruta = Routing.generate('sendMessage');
        xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', sendMessageResponse);
        xhr.open('POST', ruta);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('idPasiva=' + idPasivo + '&mensaje=' + mensaje);
    }

}

function sendMessageRequestKey(e, idPasivo) {
    //idPasivo = event.target.value;

    e.which = e.which || e.keyCode;
    if (e.which == 13) {
        mensaje = document.getElementById('mensaje').value;
        document.getElementById('mensaje').focus();

        if (mensaje != '') {
            ruta = Routing.generate('sendMessage');
            xhr = new XMLHttpRequest();


            xhr.addEventListener('readystatechange', sendMessageResponse);
            xhr.open('POST', ruta);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send('idPasiva=' + idPasivo + '&mensaje=' + mensaje);
        }

    }

}


//Respuesta de envio de mensaje
function sendMessageResponse(event) {

    if (event.target.readyState == 4 && event.target.status == 200) {
        messagesRequest(idPasivo);
        userConversationsRequest();
    }
}

function panelUserRequest(idPasivo) {

    ruta = Routing.generate('panel_user');
    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', panelUserResponse);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('value=' + idPasivo);
}
function panelUserResponse(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        objeto_vuelta = event.target.responseText;
        objeto = JSON.parse(objeto_vuelta);
        createProfileElements(objeto);

    }
}

function createProfileElements(objeto) {

    if (screen.width >= 768) {
        profPanel = document.getElementById('profile-panel');
        profile =
            '<div class="profile-panel scroll-fit">' +
            '<div id="img-panel" class="d-flex justify-content-center">' +
            //AÑADIDO INICIO
            `<div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">`
        for (i = 0; i < objeto.Foto.length; i++) {
            profile = profile +
                `    <div class="carousel-item ${(i == 0) ? 'active' : ''}">
            <img class="" src="users/user${objeto.Id}/${objeto.Foto[i]}" alt="First slide">
            </div>
       `

        }
        profile = profile + `  </div>  <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
    </a>
    </div>`;
        profile = profile + '</div>';
        if (makeButton) {
            profile = profile + '<div class="m-2 d-flex justify-content-center">' +
                `<button type="button" class="btn btn-primary" value="${objeto.Id}" onClick="printChatElements(${objeto.Id})">Chatear</button>` +
                '</div>';
        }
        profile = profile +
            `<h2> ${objeto.Nombre}, ${objeto.Ciudad}  </h2>` +
            '<hr>'
        if (objeto.Descripcion != undefined) {
            profile = profile + '<div>' +
                `<p>${objeto.Descripcion}</p>` +
                '</div>';
        }
        '<div class="w-100">';
        if (objeto.Preferencias != undefined) {
            for (var i = 0; i < objeto.Preferencias.length; i++) {
                profile = profile +
                    ' <div class="chip">' +
                    '#' + objeto.Preferencias[i] +
                    ' </div>'
            }
        }

        profile = profile +
            '</div>' +
            '</div>'
        profPanel.innerHTML = profile;
    } else {
        profPanel = document.getElementById('mobile-profile');
        profile =
            '<div class="profile-panel scroll-fit">' +
            '<div id="img-panel">' +
            //AÑADIDO INICIO
            `<div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">`
        for (i = 0; i < objeto.Foto.length; i++) {
            profile = profile +
                `    <div class="carousel-item ${(i == 0) ? 'active' : ''}">
                <img class="d-block w-100 profile-img" src="users/user${objeto.Id}/${objeto.Foto[i]}" alt="First slide">
                </div>
           `

        }
        profile = profile + `  </div>  <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
        </div>`;

        //AÑADIDO FIN
        profile = profile + '</div>';
        if (makeButton) {
            profile = profile + '<div class="m-2 d-flex justify-content-center">' +
                `<button type="button" class="btn btn-primary"  value="${objeto.Id}" onClick="printChatElements(${objeto.Id});openChat()">Chatear</button>` +
                '</div>';
        }
        profile = profile +
            `<h2 class="overlay-margin"> ${objeto.Nombre}, ${objeto.Ciudad}  </h2>` +
            '<hr>'
        if (objeto.Descripcion != undefined) {
            profile = profile + '<div class="overlay-margin">' +
                `<p>${objeto.Descripcion}</p>` +
                '</div>';
        }
        '<div class="w-100">';
        if (objeto.Preferencias != undefined) {
            profile = profile +
                '<div class="overlay-margin">';
            for (var i = 0; i < objeto.Preferencias.length; i++) {
                profile = profile +
                    ' <div class="chip">' +
                    '#' + objeto.Preferencias[i] +
                    ' </div>';
            }
            profile = profile + '</div>';
        }
        profile = profile +
            '</div>' +
            '</div>'
        profPanel.innerHTML = profile;
        nameChat = objeto.Nombre;

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

function createUserConversationList(objeto) {
    //limpiarDiv();

    divResult = document.getElementById('child-cpanel');
    divMobile = document.getElementById('mobile-msn');

    makeButton = false;
    if (screen.width < 768) {
        document.body.setAttribute('class', 'overflow-hidden');
        resultados = '<span id="mobile-tit">Mensajes</span>';
        if (objeto[0].Id == undefined) {
            resultados = resultados +
                '<div class="container">' +
                '<div class="row">' +
                '<div class="md-p ml-2" id="conversation-box">No tienes mensajes, cuando alguien te escriba aparecera aquí.</div>' +
                '</div>' +
                '</div>';
            divMobile.innerHTML = resultados;
        } else {
            resultados = resultados +
                '<div class="container d-flex justify-content-center" id="conversation-box">';
            for (i = 0; i < objeto.length; i++) {

                resultados = resultados +
                    //`<button type="button" class="conversation-prev" value="${objeto[i].Id}">`+
                    '<div class="row d-flex justify-content-center border-bottom w-100">' +
                    '<div class="col-xs pt-2">' +
                    `<img src="users/user${objeto[i].Id}/${objeto[i].Foto}" class="rounded-circle img-fluid app-img">` +
                    '</div>' +
                    '<div class="col-sm" id="col-fix">' +
                    //nombre iba en div normal
                    `<button type="button" class="conversation-prev" onClick="messagesRequest(${objeto[i].Id});openChat()" >${objeto[i].Nombre}</button>` +
                    `<div class="msn-prev text-center">${objeto[i].msn}` +
                    '</div>' +
                    '</div>' +
                    '</div>';

            }
            resultados = resultados + '</div>';
        }
        divMobile.innerHTML = resultados;
        buttons = document.getElementsByClassName('conversation-prev');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function () {
                nameChat = buttons[i].innerHTML;
            })
        }
    } else {
        if (objeto[0].Id == undefined) {
            divResult.innerHTML = "No tienes mensajes";
        } else {
            resultados =
                '<div class="container scroll-fit" id="conversation-box">';

            for (i = 0; i < objeto.length; i++) {
                resultados = resultados +
                    //`<button type="button" class="conversation-prev" value="${objeto[i].Id}">`+
                    '<div class="row d-flex justify-content-center">' +
                    '<div class="col-xs">' +
                    `<img src="users/user${objeto[i].Id}/${objeto[i].Foto}" class="mt-1 rounded-circle img-fluid app-img">` +
                    '</div>' +
                    '<div class="col-sm" id="col-fix">' +
                    `<button type="button" class="conversation-prev" onClick="messagesRequest(${objeto[i].Id})" >${objeto[i].Nombre}</button>` +
                    `<div class="msn-prev d-flex justify-content-center">${objeto[i].msn}</div>` +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<hr>' +
                    '</div>';
            }
            resultados = resultados + '</div>';
            divResult.innerHTML = resultados;
        }

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

    //limpiarDiv();
    var element = document.getElementById("c-app");
    element.classList.remove("d-none");

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

    makeButton = true;

    if (containerPref = document.getElementById('contenedorPref')) {
        containerPref.innerHTML = "";
        arrayPref = [];
    }

   // limpiarDiv();

    divResult = document.getElementById('results-panel');

    if (screen.width > 768) {
        if (objeto[0].Id == undefined) {
            resultados = '<h2 class="top-tit">Resultados</h2>';
            divResult.innerHTML = resultados + "No se encontraron resultados con esos parámetros";

        } else {

            resultados = '<h2 class="top-tit">Resultados</h2>' +
                '<div class="container scroll-fit" style="height: 90%" id="user-list">';
            for (i = 0; i < objeto.length; i++) {
                resultados = resultados + '<div class="row">' +
                    '<div class="col-4">' +
                    `<img src="users/user${objeto[i].Id}/${objeto[i].Foto}" class="rounded-circle img-fluid list-dtimg mt-4">` +
                    '</div>' +
                    '<div class="col-8">' +
                    '<div class="row justify-content-center ">' +
                    `<span class="app-subp mb-2">${objeto[i].Nombre} ${objeto[i].Apellidos}</span>` +
                    '</div>' +
                    '<div class="row justify-content-center">'
                for (j = 0; j < 3; j++) {
                    if (objeto[i].Preferencias[j] != undefined) {
                        resultados = resultados + `<span class="chip-list">#${objeto[i].Preferencias[j]} </span>`;
                    }
                    ++j;
                    if (objeto[i].Preferencias[j] != undefined) {
                        resultados = resultados + `<span class="chip-list">#${objeto[i].Preferencias[j]}</span>`;
                    }

                }
                if (objeto[i].Preferencias.length >= 4) { resultados = resultados + '<span class="chip-list">#...</span>' }
                resultados = resultados + '</div>' +
                    '<div class="row d-flex mt-2 justify-content-center">' +
                    `<button class="btn-chatSearchUser btn btn-primary" onClick="panelUserRequest(${objeto[i].Id})" type="button">Ver perfil</button>` +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<hr class="bt-2">' +
                    '</div>';

            }
            resultados = resultados + '</div></div>';
            divResult.innerHTML = resultados;
        }
    } else {
        if (objeto[0].Id == undefined) {

            resultados = '<h2 class="top-tit">Resultados</h2>';
            divResult.innerHTML = resultados + "No se encontraron resultados con esos parámetros";

        } else {
            resultados = '<h2 class="top-tit">Resultados</h2>' +
                '<div class="container" id="user-list">'
            for (i = 0; i < objeto.length; i++) {
                resultados = resultados + '<div class="row">' +
                    '<div class="col-4">' +
                    `<img src="users/user${objeto[i].Id}/${objeto[i].Foto}" class="rounded-circle img-fluid list-img" style="margin-top: 3.5rem;">` +
                    '</div>' +
                    '<div class="col-8">' +
                    '<div class="row ">' +
                    `<span class="app-subp mb-2">${objeto[i].Nombre} ${objeto[i].Apellidos}</span>` +
                    '</div>' +
                    '<div class="row">'
                for (j = 0; j < 3; j++) {
                    if (objeto[i].Preferencias[j] != undefined) {
                        resultados = resultados + `<span class="chip-list">#${objeto[i].Preferencias[j]} </span>`;
                    }
                    ++j;
                    if (objeto[i].Preferencias[j] != undefined) {
                        resultados = resultados + `<span class="chip-list">#${objeto[i].Preferencias[j]} </span>`;
                    }
                }
                if (objeto[i].Preferencias.length >= 4) { resultados = resultados + '<span class="chip-list">#...</span>' }
                resultados = resultados + '</div></div>' +
                    '<div class="w-100 justify-content-center d-flex pt-2">' +
                    `<button class="btn-chatSearchUser btn btn-primary" onClick="panelUserRequest(${objeto[i].Id});openProfile()" type="button">Ver perfil</button>` +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<hr class="bt-2">' +
                    '</div>';

            }
            resultados = resultados + '</div></div>';
            divResult.innerHTML = resultados;
            var objDiv = document.getElementsByTagName('body');
            console.log(objDiv[0]);
            objDiv[0].scrollTop = objDiv[0].scrollHeight;
            buttons = document.getElementsByClassName('name-prevs');
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', function () {
                    nameChat = buttons[i].innerHTML;
                })
            }
        }
    }

}

function createSearchElements() {

    divResult = document.getElementById('child-cpanel');

    var search = '<div id="search-panel">' +
        '<label for="ciudad">Ciudad: </label>' +
        '<select id="ciudadSelect" name="ciudad" class="form-control">';
    if (ciudadSelect.length > 0) {
        for (i = 0; i < ciudadSelect.length; i++) {
            search = search +
                `<option value=${ciudadSelect[i].value} >${ciudadSelect[i].text}</option> `;
        }
    } else {
        search = search +
            '<option value="N">No hay ciudades</option> ';
    }
    search = search +
        '</select>' +
        '</br>' +
        '<label for="genero">¿Chicos, chicas?:</label>' +
        '<select  class="form-control" id="genderSelect" name="genero">' +
        '<option value="H">Hombre</option>' +
        '<option value="M">Mujer</option>' +
        '<option value="N" selected>No me importa</option>' +
        '</select>' +
        '</br>' +
        '<label for="genero">Nº Máximo de compañeros:</label>' +
        '<select  class="form-control" id="roomMatesSelect" name="roomMates">' +
        '<option value="1">1 persona</option> ' +
        '<option value="2" selected>2 personas</option>' +
        '<option value="3+">3 o más personas</option>' +
        '</select>' +
        '</br>' +
        '<div class="col">' +
        '<label for="genero">Precio min. del alquiler:</label>' +
        '<input class="form-control" type="text" size="4" placeholder="min" id="min">' +
        '</div>' +
        '<div class="col">' +
        '<label for="genero">Precio máx. del alquiler:</label>' +
        '<input class="form-control" type="text" size="4" placeholder="max" id="max">' +
        ' </div>' +
        '</br>' +
        '<div class="ui-widget" id="buscadorPreferencias">' +
        '<label for="tags">Búsqueda de preferencias: </label>' +
        '<input id="tags" class="form-control">' +
        '</div>' +
        '</br>' +
        '<button type="button" class="btn btn-primary w-100" id="botonBusqueda">Buscar</button>';

    divResult.innerHTML = search;
    search = document.getElementById('tags')
    btnSearch = document.getElementById('botonBusqueda');
    search.addEventListener('keyup', searchPreferenceRequest);
    btnSearch.addEventListener('click', searchUserRequest)

    rpanel = document.getElementById('results-panel');
    ppanel = document.getElementById('profile-panel');
    ppanel.innerHTML = "";
    rpanel.innerHTML = "";
}

/////////////////////////////////////////////////
//
//Validacion del formulario de registro
//
////////////////////////////////////////////////

if (form=document.getElementById('botonRegistro') ) {
    document.addEventListener('DOMContentLoaded', userUniqueVal);
    form.addEventListener('click', validacion);
}
if (form = document.getElementById('botonEdit')) {
    document.addEventListener('DOMContentLoaded', userUniqueVal);
    form.addEventListener('click', validacion);
}

var check=[];

function userUniqueVal(){
    ruta = Routing.generate('userUnique');

    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', userUniqueResponse);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send();
}
function userUniqueResponse(event){
    if (event.target.readyState == 4 && event.target.status == 200) {
        objeto_vuelta = event.target.responseText;
        objeto = JSON.parse(objeto_vuelta);
        check=objeto;
    }
}
function validacion(event) {
    
    var input = document.getElementsByClassName('pass');
    var fileInput = document.getElementsByClassName('fileImg');
    var filePath = fileInput[0].value;
    var fileSize=0;
    var userUnique = document.getElementsByClassName('userUnique');
    if (check.includes(userUnique[0].value)){
        text ='Este usuario ya existe, pruebe con otro';
        erroresUser(text);
    }
   if (botonEdit=document.getElementById('botonEdit')){
    if (filePath !=""){
        if (!(/\.(jpeg|jpg|webp|png|gif)$/i).test(filePath)) {
            event.preventDefault();
            text = '- No has introducido una foto o la extensión no está permitida';
            erroresUser(text);
            
        } else {
             fileSize = fileInput[0].files[0].size;
             if ( fileSize > 200000) {
                text = "Te has excedido del tamaño de imagen permitido, máximo 2 Mb"
                erroresUser(text);
             } 
        } 
    }
   }
  
   
    if (botonRegistro=document.getElementById('botonRegistro')){
        if (!(/\.(jpeg|jpg|webp|png|gif)$/i).test(filePath)) {
            event.preventDefault();
            text = '- No has introducido una foto o la extensión no está permitida';
            erroresUser(text);
            
        } else {
             fileSize = fileInput[0].files[0].size;
             if ( fileSize > 200000) {
                text = "Te has excedido del tamaño de imagen permitido, máximo 2 Mb"
                erroresUser(text);
             } 
        } 
        if (input[0].value == ''||input[0].value.length<4 ) {
            event.preventDefault();
            text = '- Introduzca una contraseña, esta debe tener al menos 4 caracteres';
             erroresUser(text);
                }
    }
  
   
}

function erroresUser(userError) {
    var div = document.getElementById('errorDiv');
    var parentNode = document.getElementById('edit-form');
    if (div == null) {
        div = document.createElement('div');
        div.setAttribute('class', 'error');
        div.setAttribute('id', 'errorDiv');
        parentNode.appendChild(div)
    } else { div = document.getElementById('errorDiv'); div.innerHTML = "" }
    $('body').animate({ scrollTop: document.body.scrollHeight }, "fast");
    event.preventDefault();
    span = document.createElement('div')
    texto = document.createTextNode(userError);
    div.appendChild(span);
    span.appendChild(texto);
}

if (numImg= document.getElementById('numImg')){
    numImg= numImg.innerHTML
    if (parseInt(numImg)>=3){
        divHide=document.getElementById('img-div');
        divHide.innerHTML='<div class="mb-4 mt-4"><i class="fas fa-heart-broken"></i>'
        +" No puedes añadir más imágenes, borra una para subir una nueva</div>"

    }

}
/////////////////////////////////////////////////
//
//Funciones esteticas de la app y la home
//
////////////////////////////////////////////////

function openHomeNav() {
    document.getElementById("myNav").style.width = "100%";
}
function closeHomeNav() {
    document.getElementById("myNav").style.width = "0%";
}
function openUser() {
    document.getElementById("myNav-profile").style.width = "100%";
}
function closeUser() {
    document.getElementById("myNav-profile").style.width = "0%";
}
function openMsn() {
    document.getElementById('myNav-msn').style.width = "100%";
}
function closeMsn() {
    document.getElementById('myNav-msn').style.width = "0%";
    document.body.setAttribute('class', 'overflow-auto');
}
function openChat() {
    document.getElementById("myNav-chat").style.width = "100%";
}
function closeChat() {
    document.getElementById('textArea').remove()
    document.getElementById("myNav-chat").style.width = "0%";
}
function openProfile() {
    document.getElementById("myNav-user").style.width = "100%";
}
function closeProfile() {
    document.getElementById("myNav-user").style.width = "0%";
    document.body.setAttribute('class', 'overflow-auto');
}

$('#carouselExample').on('slide.bs.carousel', function (e) {

    /*

    CC 2.0 License Iatek LLC 2018
    Attribution required
    
    */

    var $e = $(e.relatedTarget);

    var idx = $e.index();

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
