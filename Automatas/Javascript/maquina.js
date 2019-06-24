document.querySelector('#Cargar').addEventListener('click',AñadirDatos);

/**
 * JSON DE EJEMPLO transforma los "ceros" entre "unos" a unos
 *
 * si se cambia el estado vacio se tiene que cambiar en function sub los valores predefinidos y en el contructor
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
        return (this.stack.length);
    }
    pos(posicion){
        return (this.stack[posicion]);
    }
    esVacio(){
        if (this.stack.length === 0)
        {
            this.stack.push("/");
            return true;
        }
    }
    vaciar(){
        while (this.stack.length != 0){
            this.stack.pop();
        }
    }
    print(){
        console.log(this.stack);
    }
}


//Variagles que van a guardar todos los estados
var lenguajes = []; //arreglo que guardara todos las palabras del alfabeto
var estados; //cantidad de estados
var inicioE; //Estado de inicio
var inicioC; //Posicion donde empieza el cabezal
var final= []; //Estados finales

//Datos de creacion transicion
var Desde = [];
var Cabezal = [];
var Movimiento = [];
var Poner = [];
var Hacia = [];
var Tabla = [];
var Cinta = [];
var Derecha = new Stack();
var Izquierda = new Stack();



function sub(){
    //Cinta = "Vacio",0,1,0,1,0,0,1,0,1,0,0,1,0,"Vacio"
    //010000010
    Cinta.length = 0;
    let temp = document.getElementById("prod").value;
    Cinta.push("/");
    for (let i of temp)
    {
        Cinta.push(i);
    }
    Cinta.push("/");

    console.log(Cinta);
    Calcular();
}

function AñadirDatos() {

    //Si se recarga la funcion con uno nuevo json vaciamos los datos viejos
    Desde.length = 0;
    Cabezal.length = 0;
    Movimiento.length = 0;
    Poner.length = 0;
    Hacia.length = 0;
    Tabla.length = 0;

    const xhttp = new XMLHttpRequest();

    xhttp.open('GET', '../JSON/MAQUINA.json', true);  //asincro el true
    xhttp.send();

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            let datos = JSON.parse(this.responseText);

            estados = datos.Estados.length;
            inicioE = datos.Inicio_Estado;
            inicioC = datos.Inicio_Cabezal;

            for (let i of datos.Lenguajes) {
                lenguajes.push(i);
            }

            for (let i of datos.EstadoFinal) {
                final.push(i);
            }

            for (let i in datos.Transiciones) {
                Desde.push(datos.Transiciones[i].Estoy);
                Cabezal.push(datos.Transiciones[i].Cabezal);
                Movimiento.push(datos.Transiciones[i].Movimiento);
                Poner.push(datos.Transiciones[i].Poner);
                Hacia.push(datos.Transiciones[i].voy);
            }
            for (let i in Desde) {
                Tabla[i] = new Array(5);
            }

            for (let i in Tabla) {
                Tabla[i][0] = Desde[i];
                Tabla[i][1] = Cabezal[i];
                Tabla[i][2] = Movimiento[i];
                Tabla[i][3] = Poner[i];
                Tabla[i][4] = Hacia[i];
            }
            console.log(Tabla);
            draw_respuesta(2);
        }else{
            draw_respuesta(1);
        }
    }
}

function Calcular() {

    if (!Pertenece()) {
        return draw_respuesta(0);
    }

    if (Cinta.length == 0) {
        return draw_respuesta(5);
    }

    if( Desde.length === 0){
        return draw_respuesta(1);
    }

    Izquierda.vaciar();
    Derecha.vaciar();

    console.log(Cinta);
    for (let i = Cinta.length - 1; i>=0; i--) {
        Derecha.push(Cinta[i]);
    }
    //Carga la posicion
    for (let i = 0; i <= (inicioC + 1); i++){ //Mas uno por el elemento vacio
        Izquierda.push(Derecha.pop());
    }

    let Estado = inicioE;
    let cont = 1;
    let existe_estado;
    let inter = setInterval(function () {
        existe_estado = false;
        for (let j in Tabla) {
            if (Tabla[j][0] == Estado) { //Desde
                if (Tabla[j][1] == Izquierda.peek()) { //Por
                    existe_estado = true;
                    if (Tabla[j][2] == "Derecha") {
                        drawState(Estado,Tabla[j][4],Izquierda.peek(),"D",Tabla[j][3],cont);
                        console.log(Estado+" "+Tabla[j][4]+" "+Izquierda.peek()+" "+"D"+" "+Tabla[j][3]+" "+cont);
                        DrawCinta(Tabla[j][3],Izquierda.peek(),1);
                        Derecha.esVacio();
                        Izquierda.pop();
                        Izquierda.push(Tabla[j][3]);
                        Izquierda.push(Derecha.pop());
                        Estado = Tabla[j][4];
                    } else {
                        Izquierda.esVacio();
                        drawState(Estado,Tabla[j][4],Izquierda.peek(),"I",Tabla[j][3],cont);
                        console.log(Estado+" "+Tabla[j][4]+" "+Izquierda.peek()+" "+"I"+" "+Tabla[j][3]+" "+cont);
                        DrawCinta(Tabla[j][3],Izquierda.peek(),0);
                        Izquierda.pop();
                        Derecha.push(Tabla[j][3]);
                        Estado = Tabla[j][4];
                    }
                    break;
                }
            }
        }
        if(!existe_estado){
            draw_respuesta(6);
            clearInterval(inter);
        }
        for (let i of final) {
            console.log("Taf nibba "+Estado);
            if (Estado == i) {
                draw_respuesta(3);
                clearInterval(inter);
            }
        }
    cont++;
    },2000);
}

function drawState(estadoA,estadoB,paso,Direccion,valorAgregado,contador) {
    clearcanvas();
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    ctx.font = "20px Times New Roman";
    ctx.fillText("Transicion numero: "+contador,20,20);

    if (estadoA===estadoB)
    {
        let PosX = 375;
        let Posy = 160;
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
        ctx.fillText(paso+","+Direccion+";"+valorAgregado,PosX+140,Posy-80);
    }else{
        let PosX = 150;
        let Posy = 160;
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
        ctx.font = "15px Arial";
        ctx.fillText(paso+","+Direccion+";"+valorAgregado, PosX+190 ,Posy-15);
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

function DrawCinta(NewValor,OldValor,direc) {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    let PosX = 25 ,PosY = 260;

    let largoA = Izquierda.size()-1;
    let largoB = Derecha.size();
    //if(largoB<0) largoB =0;

    if(NewValor == OldValor){
        ctx.beginPath();
        ctx.rect(PosX+290,PosY,100,10);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
    }else{
        ctx.beginPath();
        ctx.rect(PosX+290,PosY,100,10);
        ctx.fillStyle = "#3ADF00";
        ctx.fill();
    }

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.rect(PosX+290,PosY+5,100,5);
    ctx.fill();

    if(direc == 1){  // 0 izquierda / 1 derecha

        //Flechas izq
        ctx.beginPath();
        ctx.lineTo(10,PosY+50);
        ctx.lineTo(20,PosY+60);
        ctx.lineTo(20,PosY+40);
        ctx.fill();

        //flecha der
        ctx.beginPath();
        ctx.lineTo(720,PosY+35);
        ctx.lineTo(720,PosY+65);
        ctx.lineTo(740,PosY+50);
        ctx.fill();
    }else {
        //Flechas izq
        ctx.beginPath();
        ctx.lineTo(5,PosY+50);
        ctx.lineTo(20,PosY+65);
        ctx.lineTo(20,PosY+35);
        ctx.fill();

        //flecha der
        ctx.beginPath();
        ctx.lineTo(720,PosY+40);
        ctx.lineTo(720,PosY+60);
        ctx.lineTo(730,PosY+50);
        ctx.fill();
    }

    ctx.font = "30px Arial";
    ctx.fillText(NewValor,360,PosY+50);
    ctx.fillText(OldValor,360,PosY+112);
    ctx.stroke();

    let mov = 260;

    ctx.beginPath();
       if(largoA == 0) {
           for (let i = 0; i < 3; i++) {
               ctx.font = "25px Arial";
               ctx.fillText("/", mov, PosY + 70);
               mov = mov - 100;
           }
       }
       else if (largoA == 1) {
           ctx.font = "25px Arial";
           ctx.fillText(Izquierda.pos(0), mov, PosY + 70);
           mov = mov - 100
           ctx.fillText("/", mov, PosY + 70);
           mov = mov - 100;
           ctx.fillText("/", mov, PosY + 70);
       }
        else if(largoA == 2) {
           ctx.font = "25px Arial";
           ctx.fillText(Izquierda.pos(1), mov, PosY + 70);
           mov = mov - 100;
           ctx.fillText(Izquierda.pos(0), mov, PosY + 70);
           mov = mov - 100;
           ctx.fillText("/", mov, PosY + 70);
       } else {
           ctx.font = "25px Arial";
           ctx.fillText(Izquierda.pos(largoA-1), mov, PosY + 70);
           mov = mov - 100;
           ctx.fillText(Izquierda.pos(largoA-2), mov, PosY + 70);
           mov = mov - 100;
           ctx.fillText(Izquierda.pos(largoA-3), mov, PosY + 70);
       }

    mov = 460;

    if(largoB == 0) {
        ctx.font = "25px Arial";
        ctx.fillText("/", mov, PosY + 70);
        mov = mov + 100;
        ctx.fillText("/", mov, PosY + 70);
        mov = mov + 100;
        ctx.fillText("/", mov + 100, PosY + 70);
    }
    else if (largoB == 1) {
        ctx.font = "25px Arial";
        ctx.fillText(Derecha.pos(0), mov, PosY + 70);
        mov = mov + 100;
        ctx.fillText("/", mov, PosY + 70);
        ctx.fillText("/", mov+100 , PosY + 70);
    }
    else if(largoB == 2) {
        ctx.font = "25px Arial";
        ctx.fillText(Derecha.pos(1), mov, PosY + 70);
        mov = mov + 100;
        ctx.fillText(Derecha.pos(0), mov, PosY + 70);
        ctx.fillText("/", mov + 100, PosY + 70);
    } else {
        ctx.font = "25px Arial";
        ctx.fillText(Derecha.pos(largoB-1), mov, PosY + 70);
        mov = mov + 100;
        ctx.fillText(Derecha.pos(largoB-2), mov, PosY + 70);
        mov = mov + 100;
        ctx.fillText(Derecha.pos(largoB-3), mov, PosY + 70);
    }
    ctx.stroke();

    //rectangulos de la izquierda

    ctx.beginPath(); //superior
    ctx.rect(PosX,PosY,300,10);
    ctx.fill();

    ctx.beginPath(); //inferior
    ctx.rect(PosX,PosY+100,300,10);
    ctx.fill();

    ctx.beginPath(); //izquierda
    ctx.rect(PosX,PosY,10,100);
    ctx.fill();

    ctx.beginPath(); //derecha
    ctx.rect(PosX+290,PosY,10,100);
    ctx.fill();

    ctx.beginPath(); //linea uno
    ctx.rect(PosX+95,PosY,10,100);
    ctx.fill();

    ctx.beginPath(); //linea dos
    ctx.rect(PosX+195,PosY,10,100);
    ctx.fill();

    //centro

    ctx.beginPath(); //izq
    ctx.rect(PosX+290,PosY-10,10,140);
    ctx.fill();
    ctx.beginPath(); //der
    ctx.rect(PosX+390,PosY-10,10,140);
    ctx.fill();
    ctx.beginPath(); //sup
    ctx.rect(PosX+290,PosY-10,100,10);
    ctx.fill();
    ctx.beginPath(); //MEDIO
    ctx.rect(PosX+290,PosY+80,100,5);
    ctx.fill();
    ctx.beginPath(); //infe
    ctx.rect(PosX+290,PosY+120,100,10);
    ctx.fill();

    //Rectangulo derecha
    PosX = PosX+390;
    ctx.beginPath(); //superior
    ctx.rect(PosX,PosY,300,10);
    ctx.fill();

    ctx.beginPath(); //inferior
    ctx.rect(PosX,PosY+100,300,10);
    ctx.fill();

    ctx.beginPath(); //izquierda
    ctx.rect(PosX,PosY,10,100);
    ctx.fill();

    ctx.beginPath(); //derecha
    ctx.rect(PosX+290,PosY,10,100);
    ctx.fill();

    ctx.beginPath(); //linea uno
    ctx.rect(PosX+95,PosY,10,100);
    ctx.fill();

    ctx.beginPath(); //linea dos
    ctx.rect(PosX+195,PosY,10,100);
    ctx.fill();
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
        DrawInicio(inicioE)
    }
    else if(tex === 3){
        ctx.fillText("La palabra es aceptada", 200,200);
    }
    else if(tex === 4){
        ctx.fillText("Los simbolos de la cinta no son aceptados", 150,200);
    }
    else if(tex === 5){
        ctx.fillText("No se ingreso la cinta", 150,200);
    }
    else if(tex === 6){
        ctx.fillText("No se pudo llegar a una salida", 150,200);
    }
    else{
        ctx.fillText("Error 404", 260,200)
    }
}

function Pertenece() {

    for (let i of Cinta) {
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

function clearcanvas() {
    let canvas = document.getElementById("myCanvas");
    let contexto = canvas.getContext("2d");
    contexto.clearRect(0, 0, canvas.width, canvas.height);
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