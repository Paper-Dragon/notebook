#include <stdio.h>
#include <malloc.h>
#include "main.h"

typedef struct _node {
    int value;
    struct _node *next;
} Node;

typedef struct _list {
    Node *head;
//    Node *tail;
} List;

void add(List *pList, int number);

void print(List *pList);

void delete_node(List *pList);

void delete_linked_list(List *pList);

int main() {
    Node *head = NULL;
    List list;
    list.head = NULL;
    int number;
    do {
        scanf("%d", &number);
        if (number != -1) {
            add(&list, number);
        }
    } while (number != -1);
    print(&list);


//    Node *p;
//    for (p = list.head; p; p = p->next) {
//        printf("%d\t", p->value);
//    }
//    printf("\n");


    //删除一个节点
    delete_node(&list);
//    Node *p;
//    Node *q;
//    q = NULL;
//    int isFound = 0;
//    for (p = list.head; p; q = p, p = p->next) {
//        if (p->value == number) {
////            printf("found!!!\n");
////            isFound = 1;
//            if (q) {
//                q->next = p->next;
//            } else {
//                list.head = p->next;
//            }
//            free(p);
//            break;
//        } else {
//
////            printf("NotFount\n");
////            break;
//        }
//    }
    delete_linked_list(&list);
    Node *p;
    Node *q;
    for (p = head, p; p = q ) {
        q = q->next;
        free(p);
    }

    return 0;
}

void delete_linked_list(List *pList) {

}

void delete_node(List *pList) {
    Node *p;
    Node *q;
    q = NULL;
    int isFound = 0;
    int number;
    scanf("%d", &number);
    for (p = pList->head; p; q = p, p = p->next) {
        if (p->value == number) {
//            printf("found!!!\n");
//            isFound = 1;
            if (q) {
                q->next = p->next;
            } else {
                pList->head = p->next;
            }
            free(p);
            break;
        } else {

//            printf("NotFount\n");
//            break;
        }
    }
}

void print(List *pList) {
    Node *p;
    for (p = pList->head; p; p = p->next) {
        printf("%d\t", p->value);
    }
    printf("\n");
}

void add(List *pList, int number) {
    // add to linked-list
    Node *p = (Node *) malloc(sizeof(Node));
    p->value = number;
    p->next = NULL;
    // find the last
    Node *last = pList->head;
    if (last) {
        while (last->next) {
            last = last->next;
        }
        //attach
        last->next = p;
    }
}


