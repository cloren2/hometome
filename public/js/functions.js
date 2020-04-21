//petición al chat
botones = document.getElementsByClassName('chat');
var idPasivo="";

//Cargando los botones de chat con eventos
for (i=0;i<botones.length;i++){
    botones[i].addEventListener('click', createElements);
}

//Limpieza del div del chat
function limpiarDiv(params) {
    divBuscador = document.getElementById('resultados');
    divBuscador.setAttribute('style','display: none');
}

function createElements(event) {

    //Limpiamos el div y obtenemos el id del receptor
    limpiarDiv();
    idPasivo= event.target.value;

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
    setInterval(peticionMensajes,5000);
}

function peticionMensajes(){
  
    ruta = Routing.generate('chat');
    
    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', gestionarRespuesta);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('value='+idPasivo);
}

function gestionarRespuesta(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {

        objeto_vuelta = event.target.responseText;
        objeto = JSON.parse(objeto_vuelta);
        contenedor = document.getElementById('msn');
        contenedor.innerHTML="";

        for (let i = 0; i < objeto.length; i++) {

            div = document.createElement('div');
            contenedor.appendChild(div);
            mensaje = document.createTextNode(objeto[i].Mensaje);
            salto = document.createElement('br');

            div.appendChild(salto);   
            div.appendChild(mensaje); 

           if(parseInt(objeto[i].Receptor)==idPasivo){
            div.setAttribute('class','recibidos')             
        } else{
            div.setAttribute('class','enviados')   
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
    xhr.send('idPasiva='+idPasivo+'&mensaje='+mensaje);
}

function gestionarEnviado(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        idPasivo = event.target.id;
        peticionMensajes(idPasivo);
    }
}
