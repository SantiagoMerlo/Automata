document.querySelector('#Cargar').addEventListener('click',AnadirDatos);
document.querySelector('#Ejecutar').addEventListener('click',Calcular);

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
        return this.stack.length;
    }
    print(){
        console.log(this.stack);
    }
}

//Variables para trabajar
var lenguajes = [];
var estados;
var inicio = [];
var final = [];
//varaibles para hacer transicion
var pila = new Stack();
var Si = [];
var Desde = [];
var Por = [];
var Hacia = [];
var Accion = [];



function AnadirDatos() {
/*
    const xhttp = new XMLHttpRequest();

    xhttp.open('GET', '../JSON/PILA.json', true);  //asincro el true
    xhttp.send();

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
*/

       let datos = {
  Lenguajes: [0,1],
  N_Estados: 4,
  Inicio:[0],
  EstadoFinal: [3],
  Transiciones: [
    { Si: "Landa",De: 0, Por: 1, A: 1, Accion: "Push"},
    { Si: 1 ,De: 1, Por: 1, A: 1,Accion: "Push"},
    { Si: 1, De: 1, Por: 0, A: 2, Accion: "Pop"},
    { Si: 1, De: 2, Por: 0, A: 2, Accion: "Pop"},
    { Si: "Landa", De: 2, Por: 0, A: 3, Accion: "Nothing"}
  ]
}
            
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
                Si.push(datos.Transiciones[i].Si);
                Desde.push(datos.Transiciones[i].De);
                Por.push(datos.Transiciones[i].Por);
                Hacia.push(datos.Transiciones[i].A);
                Accion.push(datos.Transiciones[i].Accion);
            }
            
            /*
        }else{
            console.log("ERROR EN LA CARGA DEL JSON")
        }
        */
}
function Calcular(){
  console.log('se ejecuto')
  var Palabra = [1,1,1,0,0,0];
  for(let i in Palabra) {
      console.log(i);
      pila.print();
      console.log("Accion= " +Accion[i] )
      if(Accion[i]=== "Push")
        pila.push(Por[i]);
      if (Accion[i] === "Pop")
        pila.pop();
  }
  
  
}
