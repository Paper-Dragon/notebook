cmake_minimum_required(VERSION 3.22)
project(example C)

set(CMAKE_C_STANDARD 11)

add_executable(example
#        操作系统介绍/cpu.c
#        操作系统介绍/mem.c
#        操作系统介绍/threads.c
        操作系统介绍/io.c)
