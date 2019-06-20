document.querySelector('#Cargar').addEventListener('click',AnadirDatos);


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
    console.log(Palabra);
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

function Calcular(){

    if(lenguajes.length == 0){
        return draw_respuesta(0);
    }

  var a = inicio; //A representa el estado donde se encuentra
  let existe_estado; //Controlador si el estado esta definido
  for(var i of Palabra)
  {
     existe_estado = false;
     for(let j in Tabla){
         if(Tabla[j][0]==a){ //Desde
             if(Tabla[j][1] == i){ //Por
                 if(Tabla[j][2] == pila.peek()){ //Si se cumple esto
                     switch (Tabla[j][3]){
                         case "Push":
                             a = Tabla[j][4];
                             setTimeout(function () {
                                 drawState(Tabla[j][0],a,Tabla[j][1],pila.peek(),i);
                                 console.log(Tabla[j][0]+" "+a+" "+Tabla[j][1]+" "+" "+pila.peek()+" "+i);
                                 pila.push(i);
                             },2000);
                             existe_estado = true;
                             break;
                         case "Pop":
                             setTimeout(function () {
                                 drawState(Tabla[j][0],a,Tabla[j][1],pila.peek(),"Landa");
                                 console.log(Tabla[j][0]+" "+a+" "+Tabla[j][1]+" "+" "+pila.peek()+" "+i);
                                 pila.pop();
                                 a = Tabla[j][4];
                             },2000);
                             existe_estado = true;
                             break;
                         case "Nothing":
                             setTimeout(function () {
                                 drawState(Tabla[j][0],a,Tabla[j][1],pila.peek()," ");
                                 console.log(Tabla[j][0]+" "+a+" "+Tabla[j][1]+" "+" "+pila.peek()+" "+i);
                                 a = Tabla[j][4];
                             },2000);
                             existe_estado = true;
                             break;
                     }
                 }
             }
         }
     }
     if (!existe_estado) return console.log("Palabra no aceptada");
  }
  if (pila.peek() == "Landa")
  {
      for(let i of final) {
          if (a == i) {
              return console.log("La palabra es aceptada");
          }
      }
      return console.log("Palabra no aceptada");
  }

}
function drawState(estadoA,estadoB,paso,valorA,valorD) {
    clearcanvas();
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
        ctx.beginPath();
        ctx.lineTo(PosX+60,Posy);
        ctx.lineTo(PosX+120,Posy-60);
        ctx.lineTo(PosX+120,Posy-120);
        ctx.lineTo(PosX+60,Posy-180);
        ctx.lineTo(PosX,Posy-120);
        ctx.lineTo(PosX,Posy-60);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(PosX-10,Posy-75);
        ctx.lineTo(PosX+10,Posy-75);
        ctx.lineTo(PosX,Posy-60);
        ctx.fill();
        ctx.font = "15px Arial";
        ctx.fillText(paso+","+valorA+";"+valorA+valorD,PosX+50,Posy-80);

    }else{
        let PosX = 150;
        let Posy = 200;
        let PosXB = 550;
        ctx.beginPath();
        ctx.arc(PosX, Posy, 60, 0, 2 * Math.PI);
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
            ctx.fillText( paso+","+valorA+";"+valorA+valorD ,275 ,Posy-15);

            ctx.beginPath();
            ctx.arc(PosXB+50, Posy, 60, 0, 2 * Math.PI);
            ctx.strokeStyle = "#000000";
            ctx.stroke();
            ctx.font = "15px Arial";
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
    if (tex === 1){
        ctx.fillText("Error: No se cargo el JSON", 200, 200);
    }
    if (tex === 2){
        ctx.fillText("Json cargado!", 260,200)
    }

}

function clearcanvas() {
    let canvas = document.getElementById("myCanvas");
    let contexto = canvas.getContext("2d");
    contexto.clearRect(0, 0, canvas.width, canvas.height);
}

  
  

