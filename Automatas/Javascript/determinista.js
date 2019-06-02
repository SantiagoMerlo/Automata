document.querySelector('#Cargar').addEventListener('click',AñadirDatos);
//ducument.querySelector('#Subir').addEventListener('click',Calcular);


//Variagles que van a guardar todos los estados
var lenguajes = []; //arreglo que guardara todos las palabras del alfabeto
var estados; //cantidad de estados
var inicio = []; //Estado de inicio
var final= []; //Estados finales

//Datos de creacion transicion
var Desde = []; //estado desde donde parte
var Por = [];   //Lenguaje que genera la transicion
var Hacia = []; //Estado final


//LEE EL JSON y guarda las variables
function AñadirDatos() {

    const xhttp = new XMLHttpRequest();

    xhttp.open('GET', '../JSON/AFD.json', true);  //asincro el true
    xhttp.send();

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            let datos = JSON.parse(this.responseText);

            estados = datos.N_Estados;

            for (let i = 0; i < datos.Lenguajes.length; i++) {
                lenguajes.push(datos.Lenguajes[i]);
            }

            console.log("Lenguajes = " + lenguajes);

            for (let i = 0; i < datos.Inicio.length; i++) {
                inicio.push(datos.Inicio[i]);
            }

            console.log("Estados Iniciales = " + inicio);

            for (let i = 0; i < datos.EstadoFinal.length; i++) {
                final.push(datos.EstadoFinal[i]);
            }

            console.log("Estados Finales = " + final);

            for (let i = 0; i < datos.Transiciones.length; i++) {
                Desde.push(datos.Transiciones[i].De);
                Por.push(datos.Transiciones[i].Por);
                Hacia.push(datos.Transiciones[i].A);
            }
            console.log("Desde = " + Desde + " por= " + Por + " Hacia= " + Hacia);

        }else {
            console.log("ERROR EN LA CARGA DEL JSON")
        }

        //tabla de transicion creacion
        var Tabla = [];
        for (i = 0; i < estados; i++) {
            Tabla[i] = new Array(lenguajes.length);
        }

        for (let i = 0; i < (estados * (lenguajes.length)); i++) {
            let a = Desde[i];
            let b = Por[i];
            Tabla[a][b] = Hacia[i];
        }
        console.log(Tabla)

    }
}


function Calcular() {

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

