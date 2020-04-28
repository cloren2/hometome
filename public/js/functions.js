//petición al chat
var idPasivo = "";
var objetoPref = "";
//Limpieza del div resultados
function limpiarDiv() {
    divBuscador = document.getElementById('resultados');
    document.body.removeChild(divBuscador)
}
function limpiarChat(){
    divChat = document.getElementById('contenedorChat');
    document.body.removeChild(divChat)
}
var intervalo;
//crea el chat
function createElements(event) {

    //Limpiamos el div y obtenemos el id del receptor
    limpiarDiv();
    idPasivo = event.target.value;
    buscador = document.getElementById('buscador');
    //Creando elementos html
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
    enviar.addEventListener('click', enviarMensaje);

    enviar.appendChild(textoBoton);
    contenedor.appendChild(enviar);
   
    //Llamada a peticion de mensajes de forma regular
    intervalo = setInterval(peticionMensajes, 5000);
}
function peticionMensajes() {

    ruta = Routing.generate('chat');

    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', gestionarRespuesta);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('value=' + idPasivo);
}

function gestionarRespuesta(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {

        objeto_vuelta = event.target.responseText;
        objeto = JSON.parse(objeto_vuelta);
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
}

function enviarMensaje(event) {

    idPasivo = event.target.id;
    mensaje = document.getElementById('mensaje').value;
    ruta = Routing.generate('sendMessage');

    xhr = new XMLHttpRequest();
    xhr.id = idPasivo;
    xhr.addEventListener('readystatechange', gestionarEnviado);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('idPasiva=' + idPasivo + '&mensaje=' + mensaje);
}

function gestionarEnviado(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        idPasivo = event.target.id;
        peticionMensajes(idPasivo);
    }
}


//buscador preferencia petición asíncrona
search = document.getElementById('tags');
search.addEventListener('keyup', enviarPeticionBuscador);

function enviarPeticionBuscador(event) {

    valor = document.getElementById('tags').value;
    ruta = Routing.generate('search');

    if (valor.length > 0) {
        xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', gestionarRespuestaBuscador);
        xhr.open('POST', ruta);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('value=' + valor);
    }
}

var arrayPref = [];
var nombres = [];

function gestionarRespuestaBuscador(event) {

    if (event.target.readyState == 4 && event.target.status == 200) {

        objeto_vuelta = event.target.responseText;
        objetoPref = JSON.parse(objeto_vuelta);
        nombres = [];

        for (i = 0; i < objetoPref.length; i++) {
            if (arrayPref.indexOf(objetoPref[i].Id) == -1) {
                nombres = [{
                    id: objetoPref[i].Id,
                    label: objetoPref[i].Nombre
                }]
            }  else{
                break;
            } 
        }   
        autocompletar(nombres);
    }
}

// autocompletar
function autocompletar(nombres) {
    $("#tags").autocomplete({
        source: nombres,

        select: function (event, ui) {
            preferencia = ui.item.label;
            preferenciaId = ui.item.id;

            paintPreference(preferencia,preferenciaId);
            addPreferences(preferenciaId);
            $(this).val(''); return false;
        }
    });
}

//add Preferences list
div = document.createElement('div');
Array.prototype.unique=function(a){
    return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
  });

function addPreferences(preferenciaId) {
    arrayPref.push(preferenciaId);
    arrayPref = arrayPref.unique();
}

function removePreferences(event) {

    remove = parseInt(event.target.value);
    var indice = arrayPref.indexOf(remove);
    
    if (indice == 0) {
        arrayPref = [];
    } else {
        arrayPref.splice(indice, indice);
    }
    nodoBorrar = document.getElementById(remove);
    nodoBorrar.remove();

}


function paintPreference(preference,preferenciaId) {
    
    buscador = document.getElementById('buscador');

    tag = document.getElementById('tags');
    div.setAttribute('id', 'contenedorPref');
    nodoBuscador = document.getElementById('botonBusqueda')
    buscador.insertBefore(div, nodoBuscador);

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
    div.appendChild(divTag);

}

//función que hace petición asíncrona de búsqueda
botonBusqueda = document.getElementById('botonBusqueda');
botonBusqueda.addEventListener('click', recogidaDatos);

function recogidaDatos() {
   
    msn = document.getElementById('msn');
    if (msn !=null){
         limpiarChat()
    }
    gender = document.getElementById('genderSelect').value;
    rooMates = document.getElementById('roomMatesSelect').value;
    min = document.getElementById('min').value;
    max = document.getElementById('max').value;
    ciudad = document.getElementById('ciudadSelect').value;
    arrayPreferences = arrayPref.slice();

    ruta = Routing.generate('searchUsers');

    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', gestionarRespuestaBuscadorUsers);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('ciudad=' + ciudad + '&gender=' + gender + '&roomMates=' + rooMates + '&min='
        + min + '&max=' + max + '&preferencias=' + arrayPreferences);
}
var resultados;
var divResult;
function gestionarRespuestaBuscadorUsers(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        provisional = document.getElementById('provisional');
        if (intervalo){ clearInterval(intervalo)}
        if (provisional){ document.body.removeChild(provisional)}
    buscador = document.getElementById('buscador');
   
    resultados = document.createElement('div');
    resultados.setAttribute('class','col-7 derecha')
    resultados.setAttribute('id','resultados')
    divResult= document.createElement('div');
    document.body.insertBefore(resultados, buscador);
        var objeto_vuelta = event.target.responseText;
        var objeto = JSON.parse(objeto_vuelta);
        resultados.appendChild(divResult);
        divResult.setAttribute('id','datos')
       if (objeto[0].Id ==undefined){
            createDiv(objeto);
       }else {
           createTable(objeto);
       }
       
    }
}

function createTable(objeto){
    tabla= document.createElement('table');
    tabla.setAttribute('class','tablaUsuarios')
    var encabezado = tabla.insertRow(0);
    var nombreEncabezado = encabezado.insertCell(0);
    nombreEncabezado.innerHTML = 'Nombre';
    var idEncabezado = encabezado.insertCell(0);
    idEncabezado.innerHTML = 'Id'
divResult.appendChild(tabla);

    for (i=0;i<objeto.length;i++){
        var nombreUsuarios = objeto[i].Nombre;
        var idUsuarios=  objeto[i].Id;
        var row = tabla.insertRow(1);
        var celdaId = row.insertCell(0);
        var botonChat = document.createElement('button');
       var texto = document.createTextNode('Chat')
        botonChat.appendChild(texto)
        botonChat.setAttribute('class','chat');
        botonChat.setAttribute('value',idUsuarios);
        botonChat.addEventListener('click',createElements);
        celdaId.appendChild(botonChat);
        var celdaUsuarios = row.insertCell(1);
        celdaUsuarios.innerHTML = nombreUsuarios;
    }
}
function createDiv(objeto){
    
    texto = document.createTextNode(objeto);
    divResult.appendChild(texto);
}
//slider
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
