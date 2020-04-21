//petición al chat
botones = document.getElementsByClassName('chat');

for (i=0;i<botones.length;i++){
    botones[i].addEventListener('click', createElements);
}

function limpiarDiv(params) {
    divBuscador = document.getElementById('resultados');
    divBuscador.setAttribute('style','display: none');
}

function createElements(event) {
    console.log('crearElementos');

    limpiarDiv();
    id= event.target.value;

    contenedor = document.createElement('div');
    contenedor.setAttribute('class', 'derecha col-7');
    contenedor.setAttribute('id', 'resultados');

    titulo = document.createElement('h2');
    textoTit = document.createTextNode('Mensajes');
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
    enviar.id = id;
    textoBoton = document.createTextNode('Enviar');
    enviar.addEventListener('click', enviarMensaje);

    enviar.appendChild(textoBoton);
    contenedor.appendChild(enviar);
    
    peticionMensajes(id);
}

function peticionMensajes(id){
    console.log(id);
  
    ruta = Routing.generate('chat');
    
    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', gestionarRespuesta);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('value='+id);
}

function gestionarRespuesta(event) {
    if (event.target.readyState == 4 && event.target.status == 200) {
        console.log('gestionarRespuesta');
        objeto_vuelta = event.target.responseText;
        objeto = JSON.parse(objeto_vuelta);
        console.log(objeto);
        contenedor = document.getElementById('msn');
        salto = document.createElement('br');
        for (let i = 0; i < objeto.enviados.length; i++) {
            mensaje = document.createTextNode(objeto.enviados[i].Mensaje+'-ENVIADOS');
            contenedor.appendChild(salto);   
            contenedor.appendChild(mensaje);               
        }
        for (let i = 0; i < objeto.recibidos.length; i++) {
            mensaje = document.createTextNode(objeto.recibidos[i].Mensaje+'-RECIBIDOS');
            contenedor.appendChild(salto);   
            contenedor.appendChild(mensaje);               
        }
    }
}

function enviarMensaje(event) {

    idPasivo = event.target.id;
    mensaje = document.getElementById('mensaje').value;
    console.log('enviarMensaje '+event.target.id+' '+ mensaje);

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
        console.log('gestionarEnviado'+idPasivo);
        peticionMensajes(idPasivo);
    }
}
