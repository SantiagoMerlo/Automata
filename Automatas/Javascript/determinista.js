document.querySelector('#Cargar').addEventListener('click',AnadirDatos);


//Variagles que van a guardar todos los estados
let alfabeto = []; //arreglo que guardara todos las palabras del alfabeto
let estados; //cantidad de estados
let inicio; //Estado de inicio
let final= []; //Estados finales

//Datos de creacion transicion
let Desde = []; //estado desde donde parte
let referencia = [];
let Por = [];   //Lenguaje que genera la transicion
let Hacia = []; //Estado final
let Tabla = [];

let Palabra = [];
//010100012
function sub(){

    clearcanvas();
    Palabra.length = 0;
    let temp = document.getElementById("prod").value;
    for (let i of temp)
    {
        Palabra.push(i);
    }
    Calcular();
}


//LEE EL JSON y guarda las variables
function AnadirDatos() {
    clearcanvas();
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', '../JSON/AFD.json', true);  //asincro el true
    xhttp.send();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            console.log("Json abierto");

            let datos = JSON.parse(this.responseText);

            estados = datos.Estados.length;

            // esta intruccion recorre el arreglo y pone en I el valor del arreglo
            for (let i of datos.Lenguajes) {
                alfabeto.push(i);
            }

            inicio = datos.Inicio;

            for (let i of datos.EstadoFinal) {
                final.push(i);
            }

            for (let i in datos.Transiciones) {
                Desde.push(datos.Transiciones[i].De);
                referencia.push(datos.Transiciones[i].Por);
                Hacia.push(datos.Transiciones[i].A);
            }

            //se crea una referencia para trabajar con numeros
            for(let i of referencia){
                for(let j in alfabeto) {
                    if(alfabeto[j] == i)
                        Por.push(j);
                }
            }


        }else {
            console.log("ERROR EN LA CARGA DEL JSON")
        }

        //tabla de transicion creacion
        for (let i = 0; i < estados; i++) {
            Tabla[i] = new Array(alfabeto.length);
        }

        for (let i = 0; i < (estados * (alfabeto.length)); i++) {
            let a = Desde[i];
            let b = Por[i];
            Tabla[a][b] = Hacia[i];
        }
    }
}

/**     Funcion Calcular
 *  Va analizando las transiciones de las palabras
 */

function Calcular() {

    let a;
    let aux;
    let tex;

    if( alfabeto.length === 0){
        tex = 1;
        draw_respuesta(tex);
    }
    if(Pertenece())
    {
        tex = 0;
        draw_respuesta(tex);
    }
    for(let j in alfabeto) {
        clearcanvas();
        if(Palabra[0] == alfabeto[j]){
            a = Tabla[inicio][j];
            drawState(inicio,a,j);
        }
    }

    for (let i of Palabra) {
        for(let j in alfabeto) {
            if(i == alfabeto[j]){
                aux=a;
                a = Tabla[aux][j];
                setInterval(function () {
                    clearcanvas();
                    drawState(aux, a, j)
                },1000);
            }
        }
    }

    for(let i of final){
        if (a === i ){
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
            if (i === j){
                prueba = false;
            }
        }
        if (prueba){
            return true;
        }
    }
    return false;
}

function drawState(estadoA,estadoB,paso) {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    if (estadoA===estadoB)
    {
        let PosX = 375;
        let Posy = 200;
        ctx.beginPath();
        ctx.arc(PosX, Posy, 60, 0, 2 * Math.PI); //Dibuja un circulo
        ctx.strokeStyle = "#000000";

        ctx.stroke();
        ctx.font = "30px Arial";
        ctx.fillText("Q"+estadoA,PosX-22,Posy+10);

    }else{
        let PosX = 200;
        let Posy = 200;
        ctx.beginPath();
        ctx.arc(PosX, Posy, 60, 0, 2 * Math.PI); //Dibuja un circulo
        ctx.strokeStyle = "#000000";
        ctx.stroke();
    }


}

function draw_respuesta(tex) {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.font = "30px Arial";
    if(tex === 0){
        ctx.fillText("Error: La palabra ingresada no pertenece al alfabeto", 15, 200);
    }
    if (tex === 1){
        ctx.fillText("Error: No se cargo el JSON", 15, 200);
    }

}

function clearcanvas() {
    let canvas = document.getElementById("myCanvas");
    let contexto = canvas.getContext("2d");
    contexto.clearRect(0, 0, canvas.width, canvas.height);
}
