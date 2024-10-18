cmake_minimum_required(VERSION 3.22)
project(C_Language C)

set(CMAKE_C_STANDARD 11)
#set(CMAKE_C_STANDARD 99)
#set(CMAKE_C_FLAGS -m32)
#set(CMAKE_CXX_FLAGS -m32)

add_executable(C_Language
        链表/1.c 链表/1.h)
#set(CMAKE_BUILD_TYPE Debug)

