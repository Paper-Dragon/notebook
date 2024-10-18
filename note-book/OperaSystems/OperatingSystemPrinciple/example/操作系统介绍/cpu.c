//
// Created by SuperNu1L on 2022/5/22.
//
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>


int main(int argc,char * argv[]){
    if (argc != 2) {
        fprintf(stderr,"usage: cpu <string> \n");
        exit(1);
    }
    char * str = argv[1];
    while (1) {
        sleep(1);
        printf("%s\n",str);
    }
    return 0;
}