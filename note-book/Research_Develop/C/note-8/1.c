//
// Created by SuperNu1L on 2022/5/10.
//

//#include "1.h"
#include "stdio.h"
//
//int main(int argc, char const *argv[]) {
//    int number;
//    scanf("%d", &number);
//    unsigned mask = 1u << 31;
//    for (; mask; mask >>= 1) {
//        printf("%d", number & mask ? 1 : 0);
//    }
//    printf("\n");
//
//    return 0;
//}

struct U0 {
    unsigned int leading: 2;
    unsigned int FLAG1: 1;
    unsigned int FLAG2: 1;
    unsigned int FLAG3: 2;
    int trailing: 3;
};

void printBin(unsigned int number);

int main(int argc, char *argv[]) {
    struct U0 uu;
    uu.leading = 2;
    uu.FLAG1 = 1;
    uu.FLAG2 = 1;
    uu.FLAG3 = 2;
    uu.trailing = 2;
    printf("sizeof uu = %d  %p %d\n", sizeof uu, &uu, uu);
    printBin(*(int *) &uu);
    return 0;
}

void printBin(unsigned int number) {
    unsigned mask = 1u << 31;
    for (; mask; mask >>= 1) {
        printf("%d", number & mask ? 1 : 0);
    }
    printf("\n");
}

// 000 00000000 00000000 00000000 10 010
// 000 00000000 00000000 00000000 10 010
// 000 00000000 00000000 00000000 10 010
// 000 00000000 00000000 00001010 11 111

// 0 1010 1110
