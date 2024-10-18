//
// Created by SuperNu1L on 2022/4/30.
//
#include "stdio.h"

// 数字计数器
//int main(void) {
//    const int number = 10;
//    int x, i;
//    int count[number];
//    scanf("%d", &x);
//    while (x != -1) {
//        if (x >= 0 && x <= number - 1) {
//            count[x]++;
//        }
//        scanf("%d", &x);
//    }
//    for (i = 0; i <= number; i++) {
//        printf("%d:%d\n", i, count[i]);
//    }
//    return 0;
//}

#include "function.h"

int main(void) {
    // 井字棋
    const int length = 3;
    const int wide = 3;
    int board[length][wide];
    int j;
    int i;
    // 读入矩阵
    for (int i = 0; i < length; ++i) {
        for (int j = 0; j < wide; ++j) {
            scanf("%d", &board[i][j]);
        }
    }
    printf("%d", chessCheck(board[][3], length, wide));
    return 0;
}