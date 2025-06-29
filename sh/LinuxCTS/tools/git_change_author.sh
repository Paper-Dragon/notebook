#!/bin/bash

# --------------------------------------------------------------------
# author: Paper-Dragon <2678885646@qq.com>
# date: 2025-06-26
# description: Change git log author name and email
# --------------------------------------------------------------------

# 交互式输入参数
read -rp "请输入原作者姓名: " OLD_NAME
read -rp "请输入修正后的作者姓名: " CORRECT_NAME
read -rp "请输入原作者邮箱: " OLD_EMAIL
read -rp "请输入修正后的邮箱: " CORRECT_EMAIL

# 参数校验
if [[ -z "$OLD_NAME" || -z "$CORRECT_NAME" || -z "$OLD_EMAIL" || -z "$CORRECT_EMAIL" ]]; then
    echo "错误：所有参数都必须提供，不能为空！"
    echo "请确保输入以下所有信息："
    echo " - 原作者姓名"
    echo " - 修正后作者姓名"
    echo " - 原作者邮箱"
    echo " - 修正后邮箱"
    exit 1
fi

export OLD_NAME="$OLD_NAME"
export CORRECT_NAME="$CORRECT_NAME"
export OLD_EMAIL="$OLD_EMAIL"
export CORRECT_EMAIL="$CORRECT_EMAIL"


git filter-branch --env-filter '
if [ "$GIT_COMMITTER_NAME" = "$OLD_NAME" ] || [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ] || [ "$GIT_AUTHOR_NAME" = "$OLD_NAME" ] || [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]; then
    if [ "$GIT_COMMITTER_NAME" = "$OLD_NAME" ]; then
        export GIT_COMMITTER_NAME="$CORRECT_NAME"
    fi
    if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]; then
        export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
    fi
    if [ "$GIT_AUTHOR_NAME" = "$OLD_NAME" ]; then
        export GIT_AUTHOR_NAME="$CORRECT_NAME"
    fi
    if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]; then
        export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
    fi
fi
' --tag-name-filter cat -- --branches --tags