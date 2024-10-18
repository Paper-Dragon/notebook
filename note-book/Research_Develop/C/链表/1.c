//
// Created by SuperNu1L on 2022/5/13.
//

#include <stdio.h>
#include <malloc.h>
#include "1.h"


int main(int argc,char * argv[]){
    int number;
    Node * HEAD = NULL;
    do {
        scanf("%d", &number);
        if (number != -1) {
            //add to link-list
            Node * p = (Node *)malloc(sizeof(Node));
            p->value = number;
            p->next = NULL;

            //find the last
            Node * last = HEAD;
            while (last->next){
                last = last->next;
            }
            // attach
            last->next = p;

        }
    } while (number != -1)
    return 0;
}