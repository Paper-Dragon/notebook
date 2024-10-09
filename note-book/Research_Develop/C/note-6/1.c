//
// Created by SuperNu1L on 2022/5/5.
//

#include "stdio.h"

//const int red = 0;
//const int yellow = 1;
//const int green =2;

//#define red 0
//#define yellow 1
//#define green 2

//enum COLOR {RED, YELLOW, GREEN};

//int main(int argc, char *argv[]) {
//    int color = -1;
//    char *colorName = NULL;
//
//    printf("Input Color Code");
//    scanf("%d", &color);
//    switch (color) {
//
//        case RED :
//            colorName = "red";
//            break;
//        case YELLOW:
//            colorName = "yellow";
//            break;
//        case GREEN:
//            colorName = "green";
//            break;
//        default:
//            colorName = "unKnown";
//            break;
//    }
//    printf("Your favourite color is %s", colorName);
//    return 0;
//}

//enum COLOR {
//    RED, YELLOW, GREEN, NumCOLORS
//};
//
//
//void f(enum COLOR c);
//
//int main(int argc, char *argv[]) {
//    enum COLOR t;
//    t = YELLOW;
////    scanf("%d", &t);
//    f(t);
//    return 0;
//}
//
//void f(enum COLOR c) {
//    printf("%d\n", c);
//}


//结构体
//int main(int argc, char * argv[]){
//
//    struct date {
//        int month;
//        int day;
//        int year
//    };
//    struct date today;
//    today.month = 05;
//    today.day = 06;
//    today.year = 2022;
//    printf("Today's date is %i-%i-%i",today.month,today.day,today.year);
//    return 0;
//}
//结构的初始化
//struct date {
//    int month;
//    int day;
//    int year
//};

//int main(int argc, char *argv[]) {
//
//
////    struct date today;
////    today.month = 05;
////    today.day = 06;
////    today.year = 2022;
//    struct date today = {05, 06, 2022};
//    struct date * pDate = &today;
//
//    printf("Today's date is %i-%i-%i\n", today.month, today.day, today.year);
//    printf("Day's date is %i-%i-%i\n", pDate->month, pDate->day, pDate->year);
//    return 0;
//}


//struct date {
//    int month;
//    int day;
//    int year;
//};
//
//bool isLeap(struct date d);
//
//int numberOfDays(struct date d);
//
//int main(int argc, char *argv[]) {
//    struct date today, tomorrow;
//
//    printf("Enter today's date [mm dd yyyy]:");
//    scanf("%i %i %i", &today.month, &today.day, &today.year);
//    if (today.day != numberOfDays(today)) {
//        tomorrow.day = today.day + 1;
//        tomorrow.month = today.month;
//        tomorrow.year = today.year;
//    } else if (today.month == 12) {
//        tomorrow.day = 1;
//        tomorrow.month = 1;
//        tomorrow.year = today.month + 1;
//
//    } else {
//        tomorrow.day = 1;
//        tomorrow.month = today.month + 1;
//        tomorrow.year = today.year;
//    }
//    printf("Tomorrow date is %i-%i-%i\n", tomorrow.month, tomorrow.day, tomorrow.year);
//    return 0;
//}
//
//int numberOfDays(struct date d) {
//    int days;
//    const int daysPerMonth[12] = {31, 28, 31, 30, 31, 30,
//                                  31, 31, 30, 31, 30, 31};
//    if (d.month == 2 && isLeap(d)) days = 29;
//    else days = daysPerMonth[d.month - 1];
//    return days;
//}
//
//bool isLeap(struct date d) {
//    bool leaps = false;
//    if ((d.year % 4 == 0 && d.year % 100 != 0) || d.year % 400 == 0) {
//        return true;
//    } else {
//        return false;
//    }
//}



//struct point {
//    int x;
//    int y;
//};
//
//void getStruct(struct point p);
//
//void output(struct point p);
//
//
//int main(int argc, char *argv[]) {
//    struct point y = {0, 0};
//    printf("%d %d\n", y.x, y.y);
//    struct point *p = &y;
//    getStruct(*p);
//    output(*p);
//    return 0;
//}
//
//void output(struct point p) {
//    printf("%d %d\n", p.x, p.y);
//}
//
//void getStruct(struct point p) {
//    scanf("%d", &p.x);
//    scanf("%d", &p.y);
//
//}


//// 用->表示指针所指的结构变量中的成员
//struct date {
//    int month;
//    int day;
//    int year;
//} myDay;
//
//int main(int argc,char * argv[]){
//    struct date * p = &myDay;
//    (*p).month = 12;
//    printf("%d",p->month);
//    return 0;
//}


//struct point {
//    int x;
//    int y;
//};
//
//
//struct point *getStruct(struct point *pPoint);
//
//void output(struct point point1);
//
//int main(void) {
//    struct point y = {0, 0};
//    getStruct(&y);
//    printf("%d-%d\n", y.x, y.y);
//    output(y);
//
//    output(*getStruct(&y));
//    return 0;
//}
//
//void output(struct point point1) {
//    printf("%d-%d\n", point1.x,point1.y);
//
//}
//
//struct point *getStruct(struct point *pPoint) {
//    printf("%d-%d\n", pPoint->x, pPoint->y);
//    scanf("%d", &pPoint->x);
//    scanf("%d", &pPoint->y);
//    printf("%d-%d\n", pPoint->x, pPoint->y);
//    return pPoint;
//}


//struct time {
//    int hour;
//    int minutes;
//    int seconds;
//};

//
//struct time timeUpdate(struct time now);
//
//int main(void) {
//    struct time testTimes[5] = {
//            {11, 59, 59},
//            {12, 0,  0},
//            {1,  29, 59},
//            {23, 59, 59},
//            {19, 12, 27}
//    };
//    int i;
//    for (i = 0; i < 5; ++i) {
//        printf("Time is %.2d-%.2d-%.2d\n",
//               testTimes[i].hour, testTimes[i].minutes, testTimes[i].seconds);
//
//        testTimes[i] = timeUpdate(testTimes[i]);
//        printf("... One second later is %.2d-%.2d-%.2d\n",
//               testTimes[i].hour, testTimes[i].minutes, testTimes[i].seconds);
//    }
//    return 0;
//}
//
//struct time timeUpdate(struct time now) {
//
//    if (now.seconds == 59 && now.minutes != 59) {
//        now.minutes += 1;
//        now.seconds = 0;
//    } else if (now.seconds == 59 && now.minutes == 59) {
//        now.hour += 1;
//        now.minutes = 0;
//        now.seconds = 0;
//    } else {
//        now.seconds += 1;
//    }
//    return now;
//}
//
//





//
//
//
//
//struct time {
//    int hour;
//    int minutes;
//    int seconds;
//};
//
//struct date {
//    int day;
//    int month;
//    int year;
//};
//
//struct point {
//    int x;
//    int y;
//};
//
//typedef struct dataAndTime {
//    struct date sdata;
//    struct time stime;
//} dataAndTime;
//
//typedef struct rectangle {
//    struct point pt1;
//    struct point pt2;
//} rectangle;
//
//typedef struct node {
//    int data;
//    struct node *next;
//
//} aNode;
//
//int main(void) {
//
//
//    return 0;
//}
//union AnElt {
//    int i;
//    char c;
//
//} elt1, elt2;
//
//int main(void ){
//    elt1.i = 4;
//    elt2.c = 'a';
//    elt2.i = 0xDEADBEEF;
//    printf("123");
//    return 0;
//}


//typedef union {
//    int i;
//    char ch[sizeof(int)];
//} CHI;
//
//int main(int argc,char const * argv[]){
//    CHI chi;
//    int i;
//    chi.i = 1234;
//    for (i = 0; i< sizeof(int ); i++ ) {
//        printf("%02hhX",chi.ch[i]);
//    }
//    printf("\n");
//    return 0;
//}


//#define cube(x) ((x)*(x)*(x))
//int main(int argc, char const * argv[]){
//    printf("%d\n", cube(5));
//
//    return 0;
//}

//#define RADTODEG1 (x)  (x * 57.29578)
//#define RADTODEG2 (x)  (x) * 57.29578
//
//
//int main(int argc, char const *argv[]) {
//    printf("%f\n", RADTODEG1(5 + 2));
//    printf("%f\n", 180 / RADTODEG2(1));
//    return 0;
//}





int main(void ) {
    FILE * fp = fopen("I:\\note-book\\Markdown-notebook\\RD\\C_Language\\note-6\\12.ini", "r");
    if (fp) {
        int num;
        fscanf(fp, "%d", &num);
        printf("%d ",num);
        fclose(fp);
    } else {
        printf("Can not open The File\n");
    }
    return 0;
}



