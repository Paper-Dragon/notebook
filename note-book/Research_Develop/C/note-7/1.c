//
// Created by SuperNu1L on 2022/5/9.
//

#include <stdbool.h>
#include "1.h"
#include "stdio.h"


void getList(Student pStudent[], int number);

bool save(Student pStudent[], int number);

int main(int argc, char *argv[]) {
    int number = 0;
    printf("Number of student:");
    scanf("%d", &number);
    Student aStu[number];

    getList(aStu, number);
    if (save(aStu, number)) {
        printf("Save Success");
    } else {
        printf("Save Fail");
    }
    return 0;
}

bool save(Student aStu[], int number) {
    int ret = -1;
    FILE *fp = fopen("student.txt", "w");
    if (fp) {
        ret = fwrite(aStu, sizeof(Student), number, fp);
        fclose(fp);
    }
    return ret == number;
}

void getList(Student aStu[], int number) {
    char format[STR_LEN];
    sprintf(format, "%%%ds", STR_LEN - 1);
    for (int i = 0; i < number; ++i) {
        printf("The %d 's Student:\n",i + 1 );
        printf("\t Name:");
        scanf(format, aStu[i].name);
        printf("gender:(0-man,1-wenmon,2-other):\n");
        scanf("%d", &aStu[i].gender);
        printf("Age:");
        scanf("%d", &aStu[i].age);
    }
}

