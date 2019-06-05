document.querySelector('#Cargar').addEventListener('click',AnadirDatos);
document.querySelector('#Ejecutar').addEventListener('click',Calcular);


/**
 * DUDA: Si no esta especificada la transicion significa que no importa?
 *  Es decir, se representan todos los casos o solo lo que de salida al automata????
 *  En caso de que importe pero no requiere
 *  el ejemplo es un automata que acepta 1ªn y elimina con 0ªn
 *  si el codigo es 1 1 1 0 1 0 0 0 esta bien?
 */

//Creacion de clase pilas
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




function AnadirDatos() {

    const xhttp = new XMLHttpRequest();

    xhttp.open('GET', '../JSON/PILA.json', true);  //asincro el true
    xhttp.send();

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {


            let datos= JSON.parse(this.responseText);

            estados = datos.N_Estados;

            for (let i of datos.Lenguajes) {
                lenguajes.push(i);
            }

            console.log("Lenguajes = " + lenguajes);

            for (let i of datos.Inicio) {
                inicio = i;
            }

            console.log("Estado Inicial = " + inicio);

            for (let i of datos.EstadoFinal) {
                final.push(i);
            }

            console.log("Estados Finales = " + final);

            for (let i in datos.Transiciones) {
                Si.push(datos.Transiciones[i].Si);
                Desde.push(datos.Transiciones[i].De);
                Por.push(datos.Transiciones[i].Por);
                Hacia.push(datos.Transiciones[i].A);
                Accion.push(datos.Transiciones[i].Accion);
            }
        }

        //cantidad de transiciones posibles
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
        console.log(Tabla)
    }

}

function Calcular(){

  var Palabra = [1,1,1,0,0,0];
  let a = inicio;
  for(let i of Palabra)
  {
     for(let j in Tabla){
         if(Tabla[j][0]==a){
             if(Tabla[j][1] == i){
                 if(Tabla[j][2] == pila.peek()){
                     switch (Tabla[j][3]){
                         case "Push":
                             pila.push(i);
                             a = Tabla[j][4];
                             break;
                         case "Pop":
                             pila.pop();
                             a = Tabla[j][4];
                             break;
                         case "Nothing":
                             a = Tabla[j][4];
                     }

                 }
             }

         }
     }
  }
  if (pila.peek() == "Landa")
  {
      for(let i of final) {
          if (a == i) {
              return console.log("La palabra es aceptada");
          }
      }
  }else{
      console.log("Palabra no aceptada");
  }

}

  
  

