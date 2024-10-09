//
// Created by SuperNu1L on 2022/5/13.
//

#ifndef C_LANGUAGE_1_H
#define C_LANGUAGE_1_H
typedef struct {
    int *array;
    int size;
} Array;

const BLOCK_SIZE = 20;


Array array_create(int init_size);
void array_free(Array *a);
int array_size(const Array *a);
int * array_at(Array *a, int index);
void array_inflate(Array *a, int more_size);
#endif //C_LANGUAGE_1_H
