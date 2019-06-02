document.querySelector('#Boton').addEventListener('click',traerDatos);

var lenguajes = [];
var estados;
var inicio = [];
var final= [];
var transiciones;

function traerDatos() { //LEE EL JSON Y MUESTRA POR CONSOLA
    const xhttp = new XMLHttpRequest();

    xhttp.open('GET','AFDdate.json',true);  //asincronoco el true
    xhttp.send();

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200)
        {
            let datos = JSON.parse(this.responseText);
            console.log(datos);

            for(let item of datos){
                lenguajes.push(item.Lenguajes);
                estados = item.N_Estados;
                inicio.push(item.Inicio);
                final.push(item.EstadoFinal);
                transiciones = item.Transiciones;
            }
        }

    }

    var Tabla = [estados][lenguajes.length + 1]; //tabla de transicion

    console.log(transiciones);
    /*
    for(let i = 0; i < estados ; i++)
    {
        for (let j = 0; j < lenguajes.length; j++)
        {
            console.log(transiciones[i]);
            //Tabla[i][j] = transicion.;
            //console.log("posicion ["+i+"]["+j+"] = "+Tabla[i][j]);
        }
    }
*/
}

function drawState() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(50, 50, 15, 0, 2 * Math.PI); //Dibuja un circulo
    ctx.strokeStyle = "#000000";
    ctx.stroke();
}

function drawJump() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    // Staring point (10,45)
    ctx.moveTo(10,45);
    // End point (180,47)
    ctx.lineTo(180,47);
    // Make the line visible
    ctx.strokeStyle = "#000000";
    ctx.stroke();
}

