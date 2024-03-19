//
// Created by SuperNu1L on 2022/5/3.
//

#include <malloc.h>
#include "1.h"
#include "stdio.h"
#include "string.h"

//// 英寸转换
//int main(void ){
//    double foot;
//    double inch;
//
//    scanf("%lf %lf",&foot,&inch);
//    printf("%f\n",(foot + inch /12) * 0.3048 );
//    return 0;
//}

//

//int main(void) {
//    /*
//     * 不能用运算符对字符串进行运算
//     * 通过数组的方式可以遍历字符串
//     * 唯一特殊的地方是字符串字面量可以用力啊初始化字符数组
//     *
//     * s是一个指针，初始化为指向一个字符串变量
//     * 由于这个变量所在的地方，所以实际上s是const char * s ，但是由于历史原因，编译器接受不带const的写法
//     * 但是试图对s所指的字符串做写入会导致严重后果
//     *
//     * 两处相同的东西会指向同一个地方
//     *
//     * 指针还是数组？
//     * 数组： 这个字符串就在这里 作为本地变量空间自动回收
//     * 指针： 这个字符串不知道在哪里 处理参数 动态分配空间
//     *
//     */
//    char *s = "Hello World";
//    char *s2 = "Hello World";
//    char s3[] = "Hello World";
////    s[0]=0;
//    printf("s =%p\n", s);
//    printf("s2=%p\n", s2);
//    printf("s3=%p\n", s3);
//    printf("Here is s[0] = %c\n", s[0]);
//    return 0;
//}


//int main(void ){
//    char string1[8];
//    char string2[8];
//    scanf("%s",string1);
//    scanf("%s",string2);
//    printf("%s\n",string1);
//    printf("%s\n",string2);
//    printf("#%s#%s#\n",string1,string2);
//    return 0;
//
//}

//int main(int argc, char const *argv[]) {
//    int i ;
//    for ( i= 0; i< argc;i++){
//        printf("%d:%s\n",i,argv[i]);
//    }
//    return 0;
//}


//int main(int argc,char const *argv[]){
//    int ch;
//    while ((ch = getchar()) != EOF) {
//        putchar(ch);
//    }
//    return 0;
//}


//int main(int argc,char *argv[]){
//    char line[] = "Hello";
//    printf("strlen=%u\n", strlen(line));
//    printf("sizeof=%u\n", sizeof(line));
//    return 0;
//}

//int main(int argc,char * argv[]){
//    char s1[ ] = "abc";
////    char s2[ ] = "abc";
//    char s2[ ] = "Abc";
//    // 因为地址永远不同，所以输出为0
//    printf("%d\n",s1 == s2);
//    printf("%d\n", strcmp(s1,s2));
//
//    if (strcmp(s1,s2) == 0 ){
//
//    }
//    return 0;
//}

//char *mycpy(char *dst, const char *src) {
//    int idx = 0;
//    while (src[idx] != '\0') {
//        dst[idx] = src[idx];
//        idx++;
//    }
//    dst[idx] = '\0';
//    return dst;
//}
//
//char *mycpy1(char *dst, const char *src) {
//    char * ret = dst;
//    while (*src) *dst++ = *src++;
//    *dst = '0';
//    return ret;
//}
//
//int main(int argc, char *argv[]) {
//    char s1[] = "abc";
//    char s2[] = "abc";
//    mycpy(s1, s2);
//    return 0;
//}


//int main(int argc, char *argv[]) {
//    char s[] = "hello";
//    char *p = strchr(s, 'l');
//    char c = *p;
//    *p = '\0';
//    p = strchr(p + 1, 'l');
//    printf("p=%s\n", p);
//    // 将搜索的结果复制到另外的地方去
//    char *t = (char *) malloc(strlen(p) + 1);
//    strcpy(t, p);
//    printf("t=%s\n", t);
//    free(t);
//    // 找到除了搜索外的其他的
//    char *e = (char *) malloc(strlen(s) + 1);
//    strcpy(e, s);
//    printf("e=%s\n", e);
//    free(e);
//    *p = c;
//    return 0;
//}

const int red = 0;
const int yellow = 1;
const int green = 2;

int main(int argc, char *argv[]) {
    int color = -1;
    char *colorName = NULL;

    printf("Input Color Code");
    scanf("%d", &color);
    switch (color) {
        case red:
            colorName = "red";
            break;
        case yellow:
            colorName = "yellow";
            break;
        case green:
            colorName = "green";
            break;
        default:
            colorName = "unKnown";
            break;
    }
    printf("Your favourite color is %s", colorName);
    return 0;
}