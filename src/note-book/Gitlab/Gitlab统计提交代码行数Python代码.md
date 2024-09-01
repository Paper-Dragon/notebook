# Gitlab统计提交代码行数Python代码

> 要求统计Gitlab所有项目的任何人提交代码行数

## 代码逻辑

- 获取仓库列表
- 克隆仓库
- 在本地统计

## 代码如下

```python
# http://gitlabr.cidana.com/
import os
from git import Repo
import requests
import subprocess

GITLAB_URL = 'http://gitlabr.c4a.com/'
GITLAB_TOKEN = 'hboA_yaibr3b2WwFahaQ'
GITLAB_CLONE_METHOD = 'ssh_url_to_repo'  # http_url_to_repo ssh_url_to_repo
ssh_private_key = "./id_rsa"
merge_dict = {}


def get_gitlab_repositories():
    url = f'{GITLAB_URL}/api/v4/projects?per_page=5'
    headers = {
        'Authorization': f'Bearer {GITLAB_TOKEN}',
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    repositories = []
    for i in response.json():
        repositories.append(i[GITLAB_CLONE_METHOD])
    return repositories


def clone_repository(clone_url):
    env = os.environ.copy()
    env['PKEY'] = GITLAB_CLONE_METHOD
    subprocess.run(['git', 'clone', '--no-checkout', clone_url], env=env)


def walk_dir():
    # 获取当前目录下的所有Git仓库
    repo_dirs = []
    for d in os.listdir('.'):
        if os.path.isdir(d) and '.git' in os.listdir(d):
            repo_dirs.append(d)
    return repo_dirs


def get_commit_lines(repo_path):
    repo = Repo(repo_path)
    commits = list(repo.iter_commits())
    last_commit = commits[-1]
    total_lines_added = last_commit.stats.total['lines']
    return total_lines_added


def get_all_committers(repo_path):
    repo = Repo(repo_path)
    committers = set()
    for commit in repo.iter_commits():
        committers.add(commit.author.name)
    return committers


def count_lines_per_committer(repo_path):
    repo = Repo(repo_path)
    committers = get_all_committers(repo_path)
    lines_per_committer = {}
    for committer in committers:
        total_lines = 0
        for commit in repo.iter_commits():
            if commit.author.name == committer:
                total_lines += commit.stats.total['lines']
        lines_per_committer[committer] = total_lines
        if committer in merge_dict:
            merge_dict[committer] = merge_dict[committer] + total_lines
        else:
            merge_dict[committer] = total_lines
    return lines_per_committer


def calc(repo_path):
    lines_per_committer = count_lines_per_committer(repo_path)
    return lines_per_committer


def main():
    for i in walk_dir():
        print(i)
        print(calc(i))
    print(dict(sorted(merge_dict.items(), key=lambda item: item[1], reverse=True)))
    # repositories = get_gitlab_repositories()
    # for repository in repositories:
    #     clone_repository(repository)


if __name__ == '__main__':
    main()

```

