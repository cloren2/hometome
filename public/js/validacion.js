var input = document.getElementsByClassName('pass');
var form = document.getElementById('botonRegistro');
form.addEventListener('click', validacion);

function validacion(event) {
    if (input[0].value == '') {
        event.preventDefault();
        var div = document.createElement('div');
        var text = document.createTextNode('Introduzca una contraseña');
        div.appendChild(text);
        div.setAttribute('style', 'color: red');
        document.body.appendChild(div);
    }
}