//
// Created by SuperNu1L on 2022/5/9.
//


#include <stdio.h>
#include "1.h"

void read(FILE *fp, int i);

int main(void) {
    FILE *fp = fopen("student.txt", "r");
    if (fp) {
        fseek(fp, 0L, SEEK_END);
        long size = ftell(fp);
        int number = size / sizeof(Student);
        int index = 0;
        printf("There are %d data,How the index number do you want? :", number);
        scanf("%d", &index);
        read(fp, index - 1);
        fclose(fp);
    }
    return 0;
}

void read(FILE *fp, int index) {
    fseek(fp, index*sizeof(Student), SEEK_SET);
    Student stu;
    if (fread(&stu, sizeof(Student) , 1, fp) == 1) {
        printf("The %d 's Student:\n",index + 1);
        printf("\t Name: %s\n",stu.name);

        printf("Age: %d", stu.age);
        switch (stu.gender) {
            case 0:
                printf("man\n");
                break;
            case 1:
                printf("wamen\n");
                break;
            case 2:
                printf("other\n");
                break;
            default:
                printf("%d\n",stu.gender);
        }

    }
}
//
// Created by SuperNu1L on 2022/5/9.
//


#include <stdio.h>
#include "1.h"

void read(FILE *fp, int i);

int main(void) {
    FILE *fp = fopen("student.txt", "r");
    if (fp) {
        fseek(fp, 0L, SEEK_END);
        long size = ftell(fp);
        int number = size / sizeof(Student);
        int index = 0;
        printf("There are %d data,How the index number do you want? :", number);
        scanf("%d", &index);
        read(fp, index - 1);
        fclose(fp);
    }
    return 0;
}

void read(FILE *fp, int index) {
    fseek(fp, index*sizeof(Student), SEEK_SET);
    Student stu;
    if (fread(&stu, sizeof(Student) , 1, fp) == 1) {
        printf("The %d 's Student:\n",index + 1);
        printf("\t Name: %s\n",stu.name);

        printf("Age: %d", stu.age);
        switch (stu.gender) {
            case 0:
                printf("man\n");
                break;
            case 1:
                printf("wamen\n");
                break;
            case 2:
                printf("other\n");
                break;
            default:
                printf("%d\n",stu.gender);
        }

    }
}
