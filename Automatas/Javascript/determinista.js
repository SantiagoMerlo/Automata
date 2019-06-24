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
var Tabla = [];

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
        draw_respuesta(2);

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

    clearcanvas();

    if( alfabeto.length === 0){
       return draw_respuesta(1);
    }
    if( Palabra.length === 0){
        return draw_respuesta(5);
    }
    if(!Pertenece())
    {
        return draw_respuesta(0);
    }

    var a= inicio;
    var aux;
    var cont = 0;

    function analisis() {
        clearcanvas();

        if (cont > (Palabra.length-1) ) {
            clearcanvas();
            for(let i of final){
                if (a === i ) draw_respuesta(3);
                else draw_respuesta(4);
            }
            return clearInterval(inter);
        }


        let paso = Palabra[cont];
        for (let j in alfabeto) {
            if (paso == alfabeto[j]) {
                paso=j;
            }
        }
        aux = a;
        a = Tabla[aux][paso];
        clearcanvas();
        drawState(aux, a, Palabra[cont] ,cont);
        cont++;
    }

    var inter = setInterval(analisis,2500);

}

/**         Funcion Pertenece
 *  Analisa si todos los simbolos de la palabra
 *  pertenezcan al abcedario de la maquina
 */

function Pertenece() {

    for (let i of Palabra) {
        let prueba = false;
        for (let j of alfabeto) {
            if (i == j) {
                prueba = true;
            }
        }
        if (!prueba) return false;
    }
    return true;
}

function DrawInicio(estadoInicio) {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    let PosX = 375;
    let Posy = 200;
    ctx.beginPath();
    for(let i = 0; i<5;i++){
        ctx.arc(PosX, Posy, 60-i, 0, 2 * Math.PI);
    }
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.font = "30px Arial";
    ctx.fillText("Q"+estadoInicio,PosX-22,Posy+10);

    ctx.beginPath();
    ctx.lineTo(PosX-120,Posy);
    ctx.lineTo(PosX-60,Posy);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineTo(PosX-70,Posy+10);
    ctx.lineTo(PosX-70,Posy-10);
    ctx.lineTo(PosX-60,Posy);
    ctx.fill();
    ctx.stroke();

}

function drawState(estadoA,estadoB,paso,numero) {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    ctx.font = "20px Times New Roman";
    ctx.fillText("Transicion numero: "+ numero,20,20);

    if (estadoA===estadoB)
    {
        let PosX = 375;
        let Posy = 200;
        ctx.beginPath();
        for(let i = 0; i<5;i++){
            ctx.arc(PosX, Posy, 60-i, 0, 2 * Math.PI);
        }
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.font = "30px Arial";
        ctx.fillText("Q"+estadoA,PosX-22,Posy+10);
        ctx.beginPath();
        ctx.lineTo(PosX+60,Posy);       //1
        ctx.lineTo(PosX+95,Posy-15);   //2
        ctx.lineTo(PosX+120,Posy-50);   //3
        ctx.lineTo(PosX+125,Posy-80);   //4
        ctx.lineTo(PosX+120,Posy-110);   //5
        ctx.lineTo(PosX+95,Posy-135);  //6
        ctx.lineTo(PosX+60,Posy-150);   //7
        ctx.lineTo(PosX+25,Posy-135);   //8
        ctx.lineTo(PosX,Posy-110);      // 9
        ctx.lineTo(PosX-5,Posy-80);     //10
        ctx.lineTo(PosX,Posy-60);       //11
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(PosX-10,Posy-75);
        ctx.lineTo(PosX+10,Posy-75);
        ctx.lineTo(PosX,Posy-60);
        ctx.fill();
        ctx.font = "30px Arial";
        ctx.fillText(paso,PosX+50,Posy-70);

    }else{
        let PosX = 150;
        let Posy = 200;
        let PosXB = 550;
        ctx.beginPath();
        for(let i = 0; i<5;i++){
            ctx.arc(PosX, Posy, 60-i, 0, 2 * Math.PI);
        }
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.font = "30px Arial";
        ctx.fillText("Q"+estadoA,PosX-22,Posy+10);

        ctx.beginPath();
        ctx.lineTo(PosX+60,Posy);
        ctx.lineTo(PosXB-10,Posy);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(PosXB-30,Posy+10);
        ctx.lineTo(PosXB-30,Posy-10);
        ctx.lineTo(PosXB-10,Posy);
        ctx.fill();
        ctx.font = "30px Arial";
        ctx.fillText( paso ,375 ,Posy-15);
        ctx.beginPath();
        for(let i = 0; i<5;i++){
            ctx.arc(PosXB+50, Posy, 60-i, 0, 2 * Math.PI);
        }
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.font = "30px Arial";
        ctx.fillText("Q"+estadoB,PosXB+25,Posy+10);
    }
}

function draw_respuesta(tex) {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.font = "30px Arial";
    if(tex === 0){
        ctx.fillText("Error: La palabra ingresada no pertenece al alfabeto", 15, 200);
    }
    else if (tex === 1){
        ctx.fillText("Error: No se cargo el JSON", 200, 200);
    }
    else if (tex === 2){
        ctx.fillText("Json cargado correctamente!", 10,30);
        ctx.fillText("Precione 'enviar' para ver las transiciones.", 100,80);
        ctx.fillText("Estado Inicial:", 100,120);
        DrawInicio(inicio)
    }
    else if (tex === 3){
        ctx.fillText("Palabra aceptada.", 260,200)
    }
    else if (tex === 4){
        ctx.fillText("Palabra no aceptada.", 260,200)
    }
    else if(tex === 5){
        ctx.fillText("Por favor ingrese una plabra.", 200,200)
    }
    else{
        ctx.fillText("Error 404", 280,200)
    }
}

function clearcanvas() {
    let canvas = document.getElementById("myCanvas");
    let contexto = canvas.getContext("2d");
    contexto.clearRect(0, 0, 750, 400);
}
