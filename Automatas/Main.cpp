#include <iostream>
using namespace std;

void LeerAFD();

int main(){

    int star;
    cout<<"Menu Principal"<<endl;
    cout<<"Eliga el Automata con el que quiera trabajar"<<endl;
    cout<<"1. Automata Finito"<<endl;
    cout<<"2. Automata de Pila"<<endl;
    cout<<"3. Maquina de Thurim"<<endl;
    do{
        cin>>star;
    }while (star<0 and star>4)


        if(star == 1){
            AFD automata;

        }

    return ();
}




/**
 * Automata Finito
 * Leer los archivos y crear una matriz donde cada valor que entra muestra la transicion y la direccion donde va
 * Arreglo[1][2] (en q1,b --> termina en q3 y recursivamente pregunta de vuelta el estado
 * si termino la cadena y no esta en salida arrelgo[4] --> Q4 la palabra no pertenece al lenguaje
 *
 *
 * Automata de Pila
 * se tiene una pila donde metes y sacas cosas que sirve para verificar
 * despues se tiene la posicion con sus correspondiente funciones de transicion
 *
**/