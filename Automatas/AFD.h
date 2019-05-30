//
// Created by usuario on 28/05/2019.
//

#ifndef AUTOMATAS_AFD_H
#define AUTOMATAS_AFD_H

class AFD{
    private:
        int estado;
        int lenguaje;
        int destino;
    public:
        //void LeerXML();
        void AFD(); //CONSTRUCCTOR
        int estados;
        int SetEstado(char nombre);
        int transicion(int estado, int lenguaje);
};


#endif //AUTOMATAS_AFD_H
