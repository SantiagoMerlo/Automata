console.log("Todo anda bien");

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


document.querySelector('#Boton').addEventListener('click',traerDatos());

function traerDatos() { //LEE EL JSON Y MUESTRA POR CONSOLA
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET","AFDdate.json",true);  //asincronoco el true
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
        {
            console.log(this.responseText);
        }
    }

}



var pila = new Stack();
