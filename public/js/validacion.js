var form = document.getElementById('botonRegistro');


form.addEventListener('click', validacion);

function validacion(event) {
    var input = document.getElementsByClassName('pass');
    var fileInput= document.getElementsByClassName('fileImg');
    var filePath = fileInput[0].value;
     if (input[0].value == '') {
         event.preventDefault();
       text ='- Introduzca una contraseña';
       erroresUser(text);
      
     }  
     if (!(/\.(jpeg|jpg|webp|png|gif)$/i).test(filePath)) {
        text ='- No has introducido una foto o la extensión no está permitida';
        erroresUser(text)
     }
}
function erroresUser(userError){
var div =document.getElementById('errorDiv'); 
    if (div == null){
    parentNode = document.getElementById('formRegister')
     div= document.createElement('div');
    div.setAttribute('class', 'error');
    div.setAttribute('id', 'errorDiv');
        parentNode.appendChild(div)
    } else {div = document.getElementById('errorDiv');div.innerHTML=""}
     event.preventDefault();
     span = document.createElement('div')
     texto =document.createTextNode(userError);
     div.appendChild(span);
     span.appendChild(texto);
}