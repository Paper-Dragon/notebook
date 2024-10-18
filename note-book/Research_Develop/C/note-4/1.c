//
// Created by SuperNu1L on 2022/5/1.
//

#include <stdbool.h>
#include <stdlib.h>
#include "1.h"
#include "stdio.h"
#include "windows.h"

//bool divide(int a, int b, int *ret);
//
////swap
//void swap(int *pInt, int *pInt1) {
//    int t = *pInt;
//    *pInt = *pInt1;
//    *pInt1 = t;
//}
//
////min max
//void minmax(int a[], int length, int *min, int *max) {
//    int i;
//    *max = *min = a[0];
//    for (int i = 0; i < length; ++i) {
//        if (a[i] < *min) {
//            *min = a[i];
//        }
//        if (a[i] > *max) {
//            *max = a[i];
//        }
//    }
//}
//
////指针应用2，函数返回运行状态，指针返回结果
//bool divide(int a, int b, int *result) {
//    bool ret = 1;
//    if (b == 0) ret = 0;
//    else {
//        *result = a / b;
//    }
//    return ret;
//}
//
//int main(void) {
//
//
////    int a = 5;
////    int b = 6;
////    swap(&a, &b);
////    printf("%d\n%d", a, b);
//
//
//
////    int a[] = {23523, 5, 43, 5, 43, 325, 2, 42, 243, 45, 2, 5, 4, 5, 4, 6, 5, 67, 3456, 2, 61, 643, 134,};
////    int min, max;
////    minmax(a, sizeof(a) / sizeof(a[0]), &min, &max);
////    printf("%d\n%d", min, max);
//    int a = 5;
//    int b = 2;
//    int c;
//    if (divide(a, b, &c)) {
//        printf("%d/%d=%d", a, b, c);
//    }
//    return 0;
//}
//

//动态内存malloc
//int main(void) {
////    //内存分配
////    int *a = (int *) malloc(n * sizeof(int))
//
//
//
//    int number;
//    int i;
//    printf("Please input number of int:");
//    scanf("%d", &number);
//    //C99写法
////    int a[number];
//    //C99 ago
//    //分配内存
//    a = (int *) malloc(number * sizeof(int));
//    for (i = 0; i < number; i++) {
//        scanf("%d", &a[i]);
//    }
//    for ( i = number - 1; i >= 0; i--) {
//        printf("%d ", a[i]);
//    }
//    //释放内存
//    free(a);
//    return 0;
//}



////内存分配实验，最大,可以测试内存+虚拟内存最大
//int main(void) {
//    void *p;
//    int count = 0;
//    while ((p = malloc(100 * 1024 * 1024))) {
//        count++;
//        printf("%d00MB\n", count);
//        Sleep(200);
//    }
//
//    return 0;
//}
/*
 * 申请了没有free->长时间运行内存逐渐下降
 *  * 新手： 忘了
 *  * 老手： 找不到合适的free时机
 *  free过了再free是不行的
 *  地址变过了，直接去free
 */
//归还内存空间,必须与之前地址一致
int main(void) {
    void *p;
    int count = 0;
    p = malloc(100 * 1024 * 1024 * 1024);
//    p++;
    free(p);
    return 0;
}
