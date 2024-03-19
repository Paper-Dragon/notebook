#include "stdio.h"
#include "stdlib.h"
#include "time.h"
//int main() {
//    printf("Hello Word\n");
//    return 0;
//}


//// 嵌入式赋值
//int main() {
//    int a = 6;
//    int b;
//    int c = a + (b = 1);
//    printf("%d", c);
//
//
//    return 0;
//
//}


//// 猜数字游戏
//int main() {
//    srand(time(0));
//    int number = rand() % 100 + 1;
//    int test = -1;
//    int count = 0;
//    while (test != number) {
//        printf("please input a number range 1-100:");
//        scanf("%d", &test);
//        if (test > number) {
//            printf("bigger\n");
//        } else {
//            printf("smaller\n");
//        }
//        count++;
//    }
//    printf("count is %d", count);
//    return 0;
//}

// 算最简分数
//int main() {
//    int dividend, divisor;
//    scanf("%d/%d", &dividend, &divisor);
//    int a = dividend;
//    int b = divisor;
//    int t;
//    while (b > 0) {
//        t = a % b;
//        a = b;
//        b = t;
//    }
//    printf("%d/%d\n", dividend / a, divisor / a);
//    return 0;
//}
// 算最简分数，欧几里得算法
int Gcd(int m,int n)
{
    if(n==0)
        return m;
    return Gcd(n,m%n);

}
int main()
{
    int a, b;
    scanf("%d/%d", &a, &b);

    printf("%d/%d",a/Gcd(a,b),b/Gcd(a,b));
}
