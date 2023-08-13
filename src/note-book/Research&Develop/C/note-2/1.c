//
// Created by SuperNu1L on 2022/4/27.
//
#include "stdio.h"
#include "include/function.h"
//素数
//int main() {
//    int m, n;
//    scanf("%d%d", &m, &n);
//    int swap, sum = 0, cnt = 0;
//    for ((m < n ? m = m, n = n : (swap = m, m = n, n = swap)); m <= n; m++) {
//        if (isPrime(m)) {
//            printf("%d\t",m);
//            sum += m;
//            cnt++;
//        }
//    }
//    return 0;
//}
// 数组
//int main(void) {
//    int a[] = {
//            234, 23, 4, 3, 43, 24, 23, 43, 24, 23, 4, 32, 42, 4, 32, 534, 563426, 2,
//    };
//    {
//        int i;
//        printf("%lu\n", sizeof(a));
//        printf("%lu\n", sizeof(a[0]));
//        for (i = 0; i < sizeof(a) / sizeof(a[0]); i++) {
//            printf("%d\t", a[i]);
//        }
//        printf("\n");
//    }
//
//}


// 搜索数组
int main(void) {
    int a[] = {
            32, 45, 3, 43, 43, 24, 3, 42, 4, 23, 2345, 46, 6,\
            45, 6, 6, 2455, 6,
    };
    int x;
    int loc;
    printf("Please import a number");
    scanf("%d", &x);
    loc = search(x, a, sizeof(a) / sizeof(a[0]));
    if (loc != -1) {
        printf("%d is in location %d\n", x, loc);
    } else {
        printf("%d not found \n", x);
    }
    return 0;
}




