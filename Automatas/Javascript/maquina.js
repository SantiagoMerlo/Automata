document.querySelector('#Cargar').addEventListener('click',AñadirDatos);
document.querySelector('#Ejecutar').addEventListener('click',Calcular);

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
        if (this.stack.length === 0)
        {
            this.stack.push("Vacio");
            return true;
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
        }
    }
}

function Calcular() {
    console.log("adentro");
    Cinta = ["Vacio",0,1,0,1,0,0,1,0,1,0,0,1,0,"Vacio"];
    console.log(Cinta);
    for (let i = Cinta.length - 1; i>=0; i--) {
        Derecha.push(Cinta[i]);
    }
    //Carga la posicion
    for (let i = 0; i <= (inicioC + 1); i++){ //Mas uno por el elemento vacio
        Izquierda.push(Derecha.pop());
    }

    let Estado = inicioE;
    let Modificando = true;

    while(Modificando){
        for (let j in Tabla) {
            if (Tabla[j][0] == Estado) { //Desde
                if (Tabla[j][1] == Izquierda.peek()) { //Por
                    if (Tabla[j][2] == "Derecha") {
                        Derecha.esVacio();
                        Izquierda.pop();
                        Izquierda.push(Tabla[j][3]);
                        Estado = Tabla[j][4];
                        Izquierda.push(Derecha.pop());
                    } else {
                        Izquierda.esVacio();
                        Izquierda.pop();
                        Derecha.push(Tabla[j][3]);
                        Estado = Tabla[j][4];
                    }
                }
            }
        }
        for (let i of final) {
            if (Estado == i)
                Modificando = false;
        }
    }
    Izquierda.print();
}




