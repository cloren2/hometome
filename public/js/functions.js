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
$("input[type='number']").inputSpinner()
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
var makeButton = false;

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
    console.log(idPasivo);
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
        //printNewMessages(objeto);
        printChatElements(objeto);
        console.log(objeto);
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
            console.log(objeto);
            for (i = 0; i < objeto.length; i++) {
                console.log(objeto[i].Emisor)
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
            '<div class="container border border-secondary rounded" id="textArea">' +
            '<div class="row d-flex justify-content-center">' +
            '<div class="form-group mx-sm-3 ">' +
            `<input id="mensaje" onkeyup="sendMessageRequestKey(event, ${idPasivo})" class="form-control" type="text"></input>` +
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
                console.log(objeto[i].Emisor)
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
            '<div class="container border border-secondary rounded" id="textArea">' +
            '<div class="row d-flex justify-content-center">' +
            '<div class="form-group mx-sm-3 ">' +
            '<input id="mensaje"  class="form-control" type="text"></input>' +
            '</div>' +
            '<div class="form-group mx-sm-3">' +
            `<button id="btn-send" class="btn btn-outline-secondary" onClick="sendMessageRequest(${idPasivo})" type="button">Enviar</button>` +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        rpanel.innerHTML = chat;
        //Llamada a peticion de mensajes de forma regular
        // intervalo = setInterval(, 5000);
    }

}

//Solicitud asincrona para enviar un nuevo mensaje
function sendMessageRequest(event, idPasivo) {
    //idPasivo = event.target.value;

    mensaje = document.getElementById('mensaje').value;
    ruta = Routing.generate('sendMessage');
    xhr = new XMLHttpRequest();

    console.log(event);
    xhr.addEventListener('readystatechange', sendMessageResponse);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('idPasiva=' + idPasivo + '&mensaje=' + mensaje);
}

function sendMessageRequestKey(e, idPasivo) {
    //idPasivo = event.target.value;
    console.log(e);
    e.which = e.which || e.keyCode;
    if(e.which == 13) {
        mensaje = document.getElementById('mensaje').value;
        ruta = Routing.generate('sendMessage');
        xhr = new XMLHttpRequest();
    
       
        xhr.addEventListener('readystatechange', sendMessageResponse);
        xhr.open('POST', ruta);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('idPasiva=' + idPasivo + '&mensaje=' + mensaje);
    }

}


//Respuesta de envio de mensaje
function sendMessageResponse(event) {

    if (event.target.readyState == 4 && event.target.status == 200) {
        //idPasivo = event.target.id;
        console.log('ENVIO IDPASIVO ' + idPasivo)
        messagesRequest(idPasivo);
    }
}

function panelUserRequest(idPasivo) {

    console.log(idPasivo);

    makeButton = true;

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

    if (screen.width > 768) {
        profPanel = document.getElementById('profile-panel');
        console.log(objeto)
        profile =
            '<div class="profile-panel scroll-fit">' +
            '<div id="img-panel">' +
            `<img id="profile-img"src="users/user${objeto.Id}/${objeto.Foto}">` +
            '</div>';
        if (makeButton) {
            profile = profile + `<button type="button" value="${objeto.Id}" onClick="printChatElements(${objeto.Id})">Chatear</button>`
        }
        profile = profile +
            `<h2> ${objeto.Nombre}, ${objeto.Ciudad}  </h2>` +
            '<hr>'
        if (objeto.Descripcion != undefined) {
            console.log('hola')
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
        console.log(objeto)
        profile =
            '<div class="profile-panel scroll-fit">' +
            '<div id="img-panel">' +
            `<img id="profile-img"src="users/user${objeto.Id}/${objeto.Foto}">` +
            '</div>';
        if (makeButton) {
            profile = profile + '<div class="m-2 d-flex justify-content-center">'+
             `<button type="button" class="btn btn-primary" value="${objeto.Id}" onClick="printChatElements(${objeto.Id});openChat()">Chatear</button>`+
             '</div>';
        }
        profile = profile +
            `<h2> ${objeto.Nombre}, ${objeto.Ciudad}  </h2>` +
            '<hr>'
        if (objeto.Descripcion != undefined) {
            console.log('hola')
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
        console.log(objeto)
        createUserConversationList(objeto);
    }
}

function createUserConversationList(objeto) {
    limpiarDiv();

    divResult = document.getElementById('child-cpanel');
    divMobile = document.getElementById('mobile-msn');


    if (screen.width < 768) {
        document.body.setAttribute('class', 'overflow-hidden');
        resultados = '<span id="mobile-tit">Mensajes</span>';
        if (objeto[0].Id == undefined) {
            resultados = resultados + "No tienes mensajes";
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
                nameChat = buttons[i].innerHTML; console.log(nameChat);
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
                    `<img src="users/user${objeto[i].Id}/${objeto[i].Foto}" class="rounded-circle img-fluid app-img">` +
                    '</div>' +
                    '<div class="col-sm" id="col-fix">' +
                    //nombre iba en div normal
                    `<button type="button" class="conversation-prev" onClick="messagesRequest(${objeto[i].Id})" >${objeto[i].Nombre}</button>` +
                    `<div class="msn-prev">${objeto[i].msn}</div>` +

                    '</div>' +
                    '</div>' +
                    // '</button>'+
                    '<div>' +
                    '<hr>' +
                    '</div>';
            }
            resultados = resultados + '</div>';
        }
        divResult.innerHTML = resultados;
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

    if (containerPref = document.getElementById('contenedorPref')) {
        containerPref.innerHTML = "";
        arrayPref = [];
    }

    limpiarDiv();

    divResult = document.getElementById('results-panel');

    if (screen.width > 768) {
        if (objeto[0].Id == undefined) {
            resultados = '<h2 class="top-tit">Resultados</h2>';
            divResult.innerHTML = resultados + "No se encontraron resultados con esos parámetros";

        } else {

            resultados = '<h2 class="top-tit">Resultados</h2>' +
                '<div class="container" id="user-list">' +
                '<div class="row" id="title-section">' +
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
                resultados = resultados + `<button class="btn-chatSearchUser" onClick="panelUserRequest(${objeto[i].Id})" type="button">Ver perfil</button>` +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<hr>' +
                    '</div>';
            }
            resultados = resultados + '</div>';
            divResult.innerHTML = resultados;
        }
    } else {
        if (objeto[0].Id == undefined) {
            resultados = '<h2 class="top-tit">Resultados</h2>';
            divResult.innerHTML = resultados + "No se encontraron resultados con esos parámetros";

        } else {

            resultados = '<h2 class="top-tit">Resultados</h2>' +
                '<div class="container" id="user-list">' +
                '<div class="row" id="title-section">' +
                '</div>';
            for (i = 0; i < objeto.length; i++) {
                resultados = resultados + '<div class="row">' +
                    '<div class="col-4">' +
                    `<img src="users/user${objeto[i].Id}/${objeto[i].Foto}" class="rounded-circle img-fluid app-img">` +
                    '</div>' +
                    '<div class="col-8">' +
                    '<div class="col-xs">' +
                    `<span class="name-prevs">${objeto[i].Nombre}</span>` +
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
                resultados = resultados + `<button class="btn-chatSearchUser" onClick="panelUserRequest(${objeto[i].Id});openProfile()" type="button">Ver perfil</button>` +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<hr>' +
                    '</div>';

            }
            resultados = resultados + '</div>';
            divResult.innerHTML = resultados;
            buttons = document.getElementsByClassName('name-prevs');
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', function () {
                    nameChat = buttons[i].innerHTML; console.log(nameChat);
                })
            }
        }
    }

}

function createSearchElements() {

    divResult = document.getElementById('child-cpanel');

    var search = '<div id="child-cpanel">' +
        '<div id="search-panel">' +
        '<label for="ciudad">Ciudad: </label>' +
        '<select id="ciudadSelect" name="ciudad" class="form-control-sm">';
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
        '<select  class="form-control-sm" id="genderSelect" name="genero">' +
        '<option value="H">Hombre</option>' +
        '<option value="M">Mujer</option>' +
        '<option value="N" selected>No me importa</option>' +
        '</select>' +
        '</br>' +
        '<label for="genero">Nº Máximo de compañeros:</label>' +
        '<select  class="form-control-sm" id="roomMatesSelect" name="roomMates">' +
        '<option value="1">1 persona</option> ' +
        '<option value="2" selected>2 personas</option>' +
        '<option value="3+">3 o más personas</option>' +
        '</select>' +
        '</br>' +
        '<div class="col">' +
        '<label for="genero">Precio min. del alquiler:</label>' +
        '<input class="form-control-sm" type="text" size="4" placeholder="min" id="min">' +
        '</div>' +
        '<div class="col">' +
        '<label for="genero">Precio máx. del alquiler:</label>' +
        '<input class="form-control-sm" type="text" size="4" placeholder="max" id="max">' +
        ' </div>' +
        '</br>' +
        '<div class="ui-widget" id="buscadorPreferencias">' +
        '<label for="tags">Búsqueda de preferencias: </label>' +
        '<input id="tags" class="form-control">' +
        '</div>' +
        '</br>' +
        '<button type="button" class="form-control" id="botonBusqueda">Buscar</button>' +
        '</div>';

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

if (form = document.getElementById('botonRegistro')) {
    form.addEventListener('click', validacion);
}

function validacion(event) {
    var input = document.getElementsByClassName('pass');
    var fileInput = document.getElementsByClassName('fileImg');
    var filePath = fileInput[0].value;

    if (!(/\.(jpeg|jpg|webp|png|gif)$/i).test(filePath)) {
        text = '- No has introducido una foto o la extensión no está permitida';
        erroresUser(text);
    }
    if (input[0].value == '') {
        event.preventDefault();
        text = '- Introduzca una contraseña';
        erroresUser(text);
    }
}

function erroresUser(userError) {
    var div = document.getElementById('errorDiv');
    var fileInput = document.getElementsByClassName('fileImg');
    if (div == null) {
        parentNode = fileInput[0].parentNode
        div = document.createElement('div');
        div.setAttribute('class', 'error');
        div.setAttribute('id', 'errorDiv');
        parentNode.appendChild(div)
    } else { div = document.getElementById('errorDiv'); div.innerHTML = "" }
    $('html,body').animate({ scrollTop: document.body.scrollHeight }, "fast");
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

/*
buttonsToggler = document.getElementsByClassName('navbar-toggler')
buttonClose = document.getElementsByClassName('close');
console.log(buttonsToggler);
if (buttonsToggler ) {
    for (let i = 0; i < buttonsToggler.length; i++) {
        buttonsToggler[i].addEventListener('click', openNav);
    }
    for (let i = 0; i < buttonClose.length; i++) {
        buttonClose[i].addEventListener('click', closeNav);
    }
}

function openNav(event) {
    console.log(event.target.getAttribute('id'));
    if (event.target.getAttribute('id') == 'toggler-l') {

        document.getElementById("myNav-profile").style.width = "100%";
    } else {
        if (chat = document.getElementById('myNav-msn')) {
            chat.style.width = "100%";
        }
        if (home = document.getElementById('myNav')) {
            home.style.width = "100%";
        }
    }
}

/* Close when someone clicks on the "x" symbol inside the overlay *//*
function closeNav(event) {
    document.body.setAttribute('class', 'overflow-auto')
    if(event != undefined){
        if (event.target.getAttribute('id') == 'toggler-close-r') {
            document.getElementById('myNav-profile').style.width = "0%";
        } else {
            if (chat = document.getElementById('myNav-msn')) {
                chat.style.width = "0%";
            }
            if (home = document.getElementById('myNav')) {
                home.style.width = "0%";
            }
        }
    }

}
*/

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
    document.getElementById("myNav-chat").style.width = "0%";
}
function openProfile() {
    console.log('hola');
    document.getElementById("myNav-user").style.width = "100%";
}
function closeProfile() {
    document.getElementById("myNav-user").style.width = "0%";
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
