//
// Created by SuperNu1L on 2022/5/22.
//


#include <stdio.h>
#include <stdlib.h>
#include <process.h>
#include <assert.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    int *p = malloc(sizeof(int));
    assert(p != NULL);
    printf("(%d) memory address of p: %x\n", getpid(), (unsigned) p);
    *p = 0;
    while (1) {
        sleep(1);
        *p += 1;
        printf("(%d) p: %d\n", getpid(), *p);
    }

    return 0;
}