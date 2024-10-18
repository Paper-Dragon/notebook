//
// Created by SuperNu1L on 2022/4/30.
//

#ifndef C_LANGUAGE_FUNCTION_H
#define C_LANGUAGE_FUNCTION_H

#endif //C_LANGUAGE_FUNCTION_H

// 井字棋
int chessCheck(int board[][3], int length, int wide) {
    int i, num0f0, num0fx;
    int j;
    int ret;
    for (i = 0; i < length && ret == -1; i++) {
        num0f0 = num0fx = 0;
        for (int j = 0; j < wide; ++j) {
            if(board[i][j] == 1){
                num0fx++;
            } else {
                num0f0++;
            }
        }
        if (num0f0 == length) {
            ret = 0;
        } else if (num0fx == length) {
            ret = 1;
        }
    }
    return ret;
}