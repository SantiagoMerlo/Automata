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

  let a = inicio; //A representa el estado donde se encuentra
  let existe_estado; //Controlador si el estado esta definido
  for(let i of Palabra)
  {
     existe_estado = false;
     for(let j in Tabla){
         if(Tabla[j][0]==a){ //Desde
             if(Tabla[j][1] == i){ //Por
                 if(Tabla[j][2] == pila.peek()){ //Si se cumple esto
                     switch (Tabla[j][3]){
                         case "Push":
                             pila.push(i);
                             a = Tabla[j][4];
                             existe_estado = true;
                             break;
                         case "Pop":
                             pila.pop();
                             a = Tabla[j][4];
                             existe_estado = true;
                             break;
                         case "Nothing":
                             a = Tabla[j][4];
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
              console.log(a);
              return console.log("La palabra es aceptada");
          }
      }
      return console.log("Palabra no aceptada");
  }

}

  
  

