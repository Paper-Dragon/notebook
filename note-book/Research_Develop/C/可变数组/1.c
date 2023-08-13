//
// Created by SuperNu1L on 2022/5/13.
//

#include <malloc.h>
#include <stdio.h>
#include "1.h"


int main(int argc, char *argv[]) {
    Array a = array_create(100);
    array_size(&a);
    *array_at(&a, 0) = 10;
    printf("a[0] = %d\n", *array_at(&a, 0));
    int number = 0;
    int cnt = 0;
    while (number != -1) {
        scanf("%d", &number);
        if (number != -1) *array_at(&a, cnt++) = number;
//        scanf("%d", array_at(&a, cnt++));
    }
    array_inflate(&a, 10);
    array_free(&a);
    return 0;
}

Array array_create(int init_size) {
    Array ret;
    ret.size = init_size;
    ret.array = (int *) malloc(sizeof(int) * ret.size);
    return ret;
}

void array_free(Array *a) {
    free(a->array);
    a->array = NULL;
    a->size = 0;
}

int array_size(const Array *a) {
    return a->size;
}

int *array_at(Array *a, int index) {
    if (index >= a->size) {
//        array_inflate(a, index - a->size + 1);
        array_inflate(a, (index / BLOCK_SIZE + 1) * BLOCK_SIZE - a->size);
    }
    return &(a->array[index]);
}

void array_inflate(Array *a, int more_size) {
    int *p = (int *) malloc(sizeof(int) * (a->size + more_size));
    // 下面的for可以更换为memcpy
    for (int i = 0; i < a->size; ++i) {
        p[i] = a->array[i];
    }
    free(a->array);
    a->array = p;
    a->size += more_size;
}