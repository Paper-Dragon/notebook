import os
from collections import defaultdict

def count_file_types(root_dir='.'):
    file_types = defaultdict(int)

    # 遍历目录及子目录
    for root, _, files in os.walk(root_dir):
        for file in files:
            ext = os.path.splitext(file)[1].lower()  # 获取扩展名
            if ext == '':
                ext = 'no extension'
            file_types[ext] += 1  # 统计扩展名的数量

    return file_types

def main():
    root_dir = '.'  # 当前目录
    file_types = count_file_types(root_dir)

    if not file_types:
        print("No files found.")
    else:
        # 按文件类型数量降序排序
        sorted_file_types = sorted(file_types.items(), key=lambda x: x[1], reverse=True)
        print("File type statistics (sorted by count):")
        for ext, count in sorted_file_types:
            print(f"{ext}: {count} files")

if __name__ == "__main__":
    main()
