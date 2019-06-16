document.querySelector('#Cargar').addEventListener('click',AnadirDatos);


//Variagles que van a guardar todos los estados
var alfabeto = []; //arreglo que guardara todos las palabras del alfabeto
var estados; //cantidad de estados
var inicio; //Estado de inicio
var final= []; //Estados finales

//Datos de creacion transicion
var Desde = []; //estado desde donde parte
var Por = [];   //Lenguaje que genera la transicion
var Hacia = []; //Estado final
var Tabla = [];

var Palabra = [];
//010100012
function sub(){

    Palabra.length = 0;
    let temp = document.getElementById("prod").value;
    for (let i of temp)
    {
        Palabra.push(i);
    }
    console.log(Palabra);
    Calcular();
}


//LEE EL JSON y guarda las variables
function AnadirDatos() {

    const xhttp = new XMLHttpRequest();

    xhttp.open('GET', '../JSON/AFD.json', true);  //asincro el true
    xhttp.send();

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            let datos = JSON.parse(this.responseText);

            estados = datos.Estados.length;

            // esta intruccion recorre el arreglo y pone en I el valor del arreglo
            for (let i of datos.Lenguajes) {
                alfabeto.push(i);
            }

            console.log("Lenguajes = " + alfabeto);

            inicio = datos.Inicio;

            console.log("Estados Iniciales = " + inicio);

            for (let i of datos.EstadoFinal) {
                final.push(i);
            }

            console.log("Estados Finales = " + final);

            for (let i in datos.Transiciones) {
                Desde.push(datos.Transiciones[i].De);
                Por.push(datos.Transiciones[i].Por);
                Hacia.push(datos.Transiciones[i].A);
            }
            console.log("Desde = " + Desde + " por= " + Por + " Hacia= " + Hacia);


        }else {
            console.log("ERROR EN LA CARGA DEL JSON")
        }

        //tabla de transicion creacion
        for (i = 0; i < estados; i++) {
            Tabla[i] = new Array(alfabeto.length);
        }

        for (let i = 0; i < (estados * (alfabeto.length)); i++) {
                let a = Desde[i];
                let b = Por[i];
                Tabla[a][b] = Hacia[i];
        }
        console.log(Tabla)

    }
}

/**     Funcion Calcular
 *  Va analizando las transiciones de las palabras
 */

function Calcular() {

    if(Pertenece())
        return console.log("La palabra no pertenece al alfabeto");

    let a = Tabla[inicio][Palabra[0]];
    for (let i of Palabra) {
        a = Tabla[a][i];
    }
    for(let i of final){
        if (a == i ){
            return console.log("La palabra es aceptada");
        }
    }
       return console.log("La palabra no es aceptada");
}

/**         Funcion Pertenece
 *  Analisa si todos los simbolos de la palabra
 *  pertenezcan al abcedario de la maquina
 */

function Pertenece() {

        for(let i of Palabra){
            let prueba = true;
            for(let j of alfabeto){
                if (i == j){
                    prueba = false;
                }
            }
            if (prueba){
                return true;
            }
        }
        return false;
}

function drawState(x) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var PosX = 10;
    var Posy = 10;
    ctx.beginPath();
    ctx.arc(x*50, 50, 15, 0, 2 * Math.PI); //Dibuja un circulo
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


