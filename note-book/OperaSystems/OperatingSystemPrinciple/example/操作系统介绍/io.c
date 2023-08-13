//
// Created by SuperNu1L on 2022/5/22.
//


#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <assert.h>
#include <sys/stat.h>

int main(int argc, char * argv[]){
    int fd = open("file", O_WRONLY| O_CREAT | O_TRUNC, S_IRWXU);
    assert(fd > -1);
    int rc = write(fd, "hello world\n", 13);
    assert(rc = 13);
    close(fd);
    return 0;
}