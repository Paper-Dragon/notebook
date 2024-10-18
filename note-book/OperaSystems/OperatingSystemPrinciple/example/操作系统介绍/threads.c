//
// Created by SuperNu1L on 2022/5/22.
//

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

volatile int counter = 0;
int loops;

void *worker(void *arg) {
    for (int i = 0; i < loops; ++i) {
        counter++;
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "usage: threads <value>\n");
        exit(1);
    }
    loops = atoi(argv[1]);
    pthread_t p1, p2;
    printf("Initial value: %d \n", counter);
    pthread_create(&p1, NULL, worker, NULL);
    pthread_create(&p2, NULL, worker, NULL);

    pthread_join(p1,NULL);
    pthread_join(p2,NULL);

    printf("Final value: %d \n",counter);
    return 0;
}

//#include <stdio.h>
//
//int main(int argc, char *argv[]) {
//    int count = 0;
//    while (count < 11) {
//        count += 2;
//        printf("Count is %d\n", count);
//    }
//
//}
