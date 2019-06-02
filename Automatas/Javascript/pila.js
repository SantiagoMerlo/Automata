document.querySelector('#Cargar').addEventListener('click',AñadirDatos);

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

function AñadirDatos() {

    const xhttp = new XMLHttpRequest();

    xhttp.open('GET', '../JSON/PILA.json', true);  //asincro el true
    xhttp.send();

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            let datos = JSON.parse(this.responseText);

    }
}