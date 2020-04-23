//petición al chat
botones = document.getElementsByClassName('chat');
var idPasivo = "";
var objetoPref = "";
//Cargando los botones de chat con eventos
for (i = 0; i < botones.length; i++) {
    botones[i].addEventListener('click', createElements);
}

//Limpieza del div del chat
function limpiarDiv(params) {
    divBuscador = document.getElementById('resultados');
    divBuscador.setAttribute('style', 'display: none');
}

function createElements(event) {

    //Limpiamos el div y obtenemos el id del receptor
    limpiarDiv();
    idPasivo = event.target.value;

    //Creando elementos html
    contenedor = document.createElement('div');
    contenedor.setAttribute('class', 'derecha col-7');
    contenedor.setAttribute('id', 'resultados');
    titulo = document.createElement('h2');
    textoTit = document.createTextNode('Mensajes');

    //Insercion del nuevo div(mensajes)
    titulo.appendChild(textoTit);
    contenedor.appendChild(titulo);
    document.body.insertBefore(contenedor, divBuscador);

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
    setInterval(peticionMensajes, 5000);
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
        contenedor = document.getElementById('msn');
        contenedor.innerHTML = "";

        for (let i = 0; i < objeto.length; i++) {

            div = document.createElement('div');
            contenedor.appendChild(div);
            mensaje = document.createTextNode(objeto[i].Mensaje);
            salto = document.createElement('br');

            div.appendChild(salto);
            div.appendChild(mensaje);

            if (parseInt(objeto[i].Receptor) == idPasivo) {
                div.setAttribute('class', 'recibidos')
            } else {
                div.setAttribute('class', 'enviados')
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
function gestionarRespuestaBuscador(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {

        objeto_vuelta = event.target.responseText;
        objetoPref = JSON.parse(objeto_vuelta);
        nombres = [];
        for (i = 0; i < objetoPref.length; i++) {

            if(arrayPref.indexOf(objetoPref[i].Nombre) == -1){
                nombres[i] = objetoPref[i].Nombre;
            }   
        }
        if(nombres.length>0){
            autocompletar(nombres);
        }
        
    }
}

// autocompletar
function autocompletar(nombres) {
    $("#tags").autocomplete({
        source: nombres
    });
}

//add Preferences list
add = document.getElementById('add');
add.addEventListener('click', addPreferences);
add.addEventListener('keyup', addPreferences);

div = document.createElement('div');

function addPreferences(event) {
    preferencia = document.getElementById('tags').value;
    if (preferencia.length > 0) {
        arrayPref.push(preferencia);
    }
    console.log(arrayPref);
    paintPreference(preferencia);
    document.getElementById('tags').innerHTML='';
}

function removePreferences(event) {
    remove = event.target.value;
    var indice = arrayPref.indexOf(remove);

    if(indice==0){
        arrayPref=[];
    }else{
        arrayPref.splice(indice, indice);
    }

    nodoBorrar = document.getElementById(remove)
    nodoBorrar.remove()
    console.log(arrayPref);
    
}

function paintPreference(preference) {
    
    buscador = document.getElementById('buscador');
    
    tag = document.getElementById('tags');
    div.setAttribute('id', 'contenedorPref');

    buscador.insertBefore(div, buscador.childNodes[19]);

    divTag = document.createElement('span');
    texto = document.createTextNode(preference);
    boton = document.createElement('button');

    divTag.setAttribute('id', preference);
    boton.setAttribute('value', preference);
    boton.innerHTML = 'X';
    boton.addEventListener('click', removePreferences);

    divTag.appendChild(texto);
    divTag.appendChild(boton);
    div.appendChild(divTag);


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
