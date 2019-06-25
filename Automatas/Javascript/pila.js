document.querySelector('#Cargar').addEventListener('click',AnadirDatos);

/**
 *Se tiene que especificar como lenguaje el elemente vacio para reconocerlo en las transiciones
 * se necesita declarar en el JSON a "Landa" porque va a ser la condicion de salida de la funcion
 * en caso de ser modificada por otro valor, tenemos que modificar en SUB
 */
//Creacion de clase pilas modificada
class Stack{
    constructor(){
        this.stack = [];
    }
    push(element){
        this.stack.push(element);
        return this.stack;
    }
    pop(){
        return this.stack.pop();
    }
    peek(){
        return this.stack[this.stack.length - 1];
    }
    size(){
        return ((this.stack.length)-1);
    }
    pos(posicion){
        return this.stack[posicion];
    }
    esVacio(){
        if (this.stack.length === 1) return true; //Esta modificada para que el valor vacio sea Landa
    }
    print(){
        console.log(this.stack);
    }
}

//Variables globales
var lenguajes = [];
var estados;
var inicio;
var final = [];
var pila = new Stack();
pila.push("Landa");
var Si = [];
var Desde = [];
var Por = [];
var Hacia = [];
var Accion = [];
var Tabla = [];
var Palabra = []; //111000 json de ejemplo acepta misma cantidad de unos que ceros


function sub(){
    Palabra.length = 0;
    let temp = document.getElementById("prod").value;
    for (let i of temp)
    {
        Palabra.push(i);
    }
    Palabra.push("Landa");
    Calcular();
}

function AnadirDatos() {

    const xhttp = new XMLHttpRequest();

    xhttp.open('GET', '../JSON/PILA.json', true);  //asincro el true
    xhttp.send();

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {


            let datos= JSON.parse(this.responseText);

            estados = datos.Estados.length;

            for (let i of datos.Lenguajes) {
                lenguajes.push(i);
            }

            inicio = datos.Inicio;

            for (let i of datos.EstadoFinal) {
                final.push(i);
            }

            for (let i in datos.Transiciones) {
                Si.push(datos.Transiciones[i].Si);
                Desde.push(datos.Transiciones[i].De);
                Por.push(datos.Transiciones[i].Por);
                Hacia.push(datos.Transiciones[i].A);
                Accion.push(datos.Transiciones[i].Accion);
            }
            draw_respuesta(2);
        }

        //Creacion de matriz para guardar las transiciones
        for (let i in Si) {
            Tabla[i] = new Array(5);
        }
        for(let i in Tabla)
        {
            Tabla[i][0] = Desde[i];
            Tabla[i][1] = Por[i];
            Tabla[i][2] = Si[i];
            Tabla[i][3] = Accion[i];
            Tabla[i][4] = Hacia[i];
        }
    }

}

function Calcular() {

    if (!Pertenece()) {
        return draw_respuesta(0);
    }

    if (lenguajes.length == 0) {
        return draw_respuesta(1);
    }

    if( Palabra.length === 0){
        return draw_respuesta(6);
    }

    var a = inicio;
    var aux;
    var cont = 0;
    var existe_estado;
    var paso;

    let cambio = setInterval(function analisis() {

        if (cont > (Palabra.length - 1)) {
            clearcanvas();
            if (pila.peek() == "Landa") {
                for (let i of final) {
                    if (a == i) {
                        draw_respuesta(4);
                        return clearInterval(cambio);
                    }
                }
                draw_respuesta(5);
                return clearInterval(cambio);
            }
        }

        existe_estado = false;
        clearcanvas();
        paso = Palabra[cont];


        for (let j in Tabla) {
            if (Tabla[j][0] == a) { //Desde
                if (Tabla[j][1] == paso) { //Por
                    if (Tabla[j][2] == pila.peek()) { //Si se cumple esto
                        switch (Tabla[j][3]) {
                            case "Push":
                                a = Tabla[j][4];
                                drawState(Tabla[j][0], a, Tabla[j][1], pila.peek(), paso, cont ,0);
                                DrawPila(paso,0);
                                pila.push(paso);
                                existe_estado = true;
                                break;
                            case "Pop":
                                a = Tabla[j][4];
                                aux = pila.pop();
                                drawState(Tabla[j][0], a, Tabla[j][1], aux, "" , cont , 1);
                                DrawPila(aux,1);
                                existe_estado = true;
                                break;
                            case "Nothing":
                                a = Tabla[j][4];
                                drawState(Tabla[j][0], a, Tabla[j][1], pila.peek(),"", cont ,0);
                                DrawPila(paso,2);
                                existe_estado = true;
                                break;
                        }
                        console.log("Se repitio: " + j);
                        break;
                    }
                }
            }
        }
        //console.log("Contador: " + cont+" "+existe_estado);
        cont++;
        if (!existe_estado) {
            draw_respuesta(3);
            return clearInterval(cambio);
        }
    }, 2500);


}

function drawState(estadoA,estadoB,paso,valorPila,valorAgregado,contador,De_tipo) {
    clearcanvas();
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    ctx.font = "20px Times New Roman";
    ctx.fillText("Transicion numero: "+contador,20,20);

    if (estadoA===estadoB)
    {
        let PosX = 175;
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
        ctx.font = "15px Arial";
        if(De_tipo === 0){
            ctx.fillText(paso+","+valorPila+";"+valorPila+valorAgregado,PosX+140,Posy-80);
        }else {
            ctx.fillText(paso+";Landa",PosX+140,Posy-80);
        }

    }else{
        let PosX = 100;
        let Posy = 200;
        let PosXB = 350;
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
        ctx.font = "15px Arial";
        if(De_tipo === 0){
            ctx.fillText(paso+","+valorPila+";"+valorPila+valorAgregado, PosX+80,Posy-15);
        }else {
            ctx.fillText(paso+";Landa",PosX+140,Posy-80);
        }
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

function DrawPila(valor,caso) {

    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let PosX = 550,PosY = 50,largo;

    if (pila.size() < 4) largo = pila.size();
    else largo = 4;

    ctx.beginPath();
    ctx.lineTo(PosX+10,PosY);
    ctx.lineTo(PosX+10,PosY+240);
    ctx.lineTo(PosX+140,PosY+240);
    ctx.lineTo(PosX+140,PosY);
    ctx.lineTo(PosX+150,PosY);
    ctx.lineTo(PosX+150,PosY+250);
    ctx.lineTo(PosX,PosY+250);
    ctx.lineTo(PosX,PosY);
    ctx.fill();
    switch (caso){
        case 0:
            ctx.beginPath();
            ctx.lineTo(PosX+75,PosY);
            ctx.lineTo(PosX+75,PosY+40);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineTo(PosX+75,PosY+40);
            ctx.lineTo(PosX+85,PosY+30);
            ctx.lineTo(PosX+65,PosY+30);
            ctx.fill();
            ctx.font = "20px Arial";
            ctx.fillText(valor,PosX+50,PosY+20);
            ctx.font = "20px Arial";
            ctx.fillText("Pongo un",PosX+20,PosY-20);
            for (let i = 0; i<largo ; i++) {
                ctx.beginPath();
                ctx.lineTo(PosX+10,PosY +195);
                ctx.lineTo(PosX+140,PosY +195);
                ctx.lineTo(PosX+140,PosY +200);
                ctx.lineTo(PosX+10,PosY +200);
                ctx.fill();
                PosY=PosY-40;
            }
            for (let i=0;i<largo;i++){
                PosY=PosY+40;
                ctx.font = "20px Arial";
                ctx.fillText(pila.pos(largo-i),PosX+75,PosY+230);
            }
            break;
        case 1:
            ctx.beginPath();
            ctx.lineTo(PosX+75,PosY);
            ctx.lineTo(PosX+75,PosY+40);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineTo(PosX+75,PosY);
            ctx.lineTo(PosX+85,PosY+10);
            ctx.lineTo(PosX+65,PosY+10);
            ctx.fill();
            ctx.font = "20px Arial";
            ctx.fillText(valor,PosX+50,PosY+20);
            ctx.font = "20px Arial";
            ctx.fillText("Saco el ultimo valor",PosX+10,PosY-20);
            for (let i = 0; i<largo; i++) {
                ctx.beginPath();
                ctx.lineTo(PosX+10,PosY +195);
                ctx.lineTo(PosX+140,PosY +195);
                ctx.lineTo(PosX+140,PosY +200);
                ctx.lineTo(PosX+10,PosY +200);
                ctx.fill();
                ctx.stroke();
                PosY=PosY-40;
            }
            for (let i=0;i<largo;i++){
                PosY=PosY+40;
                ctx.font = "20px Arial";
                ctx.fillText(pila.pos(largo-i),PosX+75,PosY+230);
            }
            break;
        case 2:
            ctx.font = "20px Arial";
            ctx.fillText("No pasa nada",PosX+10,PosY-20);
            for (let i = 0; i<largo; i++) {
                ctx.beginPath();
                ctx.lineTo(PosX+10,PosY +195);
                ctx.lineTo(PosX+140,PosY +195);
                ctx.lineTo(PosX+140,PosY +200);
                ctx.lineTo(PosX+10,PosY +200);
                ctx.fill();
                PosY=PosY-40;
            }
            for (let i=0;i<largo;i++){
                PosY=PosY+40;
                ctx.font = "20px Arial";
                ctx.fillText(pila.pos(largo-i),PosX+75,PosY+230);
            }
            break;
    }

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

function draw_respuesta(tex) {
    clearcanvas();
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.font = "30px Arial";
    if(tex === 0){
        ctx.fillText("Error: un simbolo ingresado no existe", 15, 200);
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
        ctx.fillText("Tiene un estado no definido", 200,200);
    }
    else if(tex === 4){
        ctx.fillText("La palabra es aceptada", 200,200);
    }
    else if(tex === 5){
        ctx.fillText("La palabra no es aceptada", 200,200);
    }
    else if(tex === 6){
        ctx.fillText("No se ingreso una palabra", 200,200);
    }
    else{
        ctx.fillText("Error 404", 260,200)
    }
}

function clearcanvas() {
    let canvas = document.getElementById("myCanvas");
    let contexto = canvas.getContext("2d");
    contexto.clearRect(0, 0, canvas.width, canvas.height);
}

function Pertenece() {

    for (let i of Palabra) {
        let prueba = false;
        for (let j of lenguajes) {
            if (i == j) {
                prueba = true;
            }
        }
            if (!prueba) return false;
    }
    return true;
}
  
  

