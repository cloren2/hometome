console.log('hola');

botones = document.getElementsByClassName('chat');

botones[0].addEventListener('click', createElements);

function createElements(event) {
    console.log('crearElementos');
    divBuscador = document.getElementById('resultados');
    divBuscador.setAttribute('style','display: none');

    contenedor = document.createElement('div');
    contenedor.setAttribute('class', 'derecha col-7');

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
    textoBoton = document.createTextNode('Enviar');
    enviar.appendChild(textoBoton);
    contenedor.appendChild(enviar);

    peticionMensajes();
}

function peticionMensajes(event){
    console.log('enviarPeticion');
    hidden = document.getElementsByClassName('usuarioPasivo');
    id = hidden[0].value;
    ruta = Routing.generate('chat', )
    
    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', gestionarRespuesta);
    xhr.open('POST', ruta);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('value='+id);
}

function gestionarRespuesta(event) {
    console.log('gestionarRespuesta');
    if (event.target.readyState == 4 && event.target.status == 200) {
        objeto_vuelta = event.target.responseText;
        console.log(objeto_vuelta);

    }
}
