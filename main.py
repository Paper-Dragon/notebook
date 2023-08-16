import os
import re
import string
import jieba
import jieba.analyse
from collections import defaultdict

# wordcloud
from wordcloud import WordCloud
from PIL import Image
import numpy as np

MARKDOWN_ROOT_PATH = "./src/note-book"

stop_words = ['你', '我', '的', '了', '们']

FONT = "./MiSans-Normal.ttf"
OUTPUT_IMG_NAME = "./wordcloud.png"
WORDCLOUD_IMAGE_MASK = "./coding.jpg"


def word_frequency(directory, key_nums=200):
    """
    param: directory markdown文件根目录
    param: key_nums 生成排名前 xx 个的列表，默认200
    return: list[key_nums]
    """
    # 初始化一个空字典来存储名词的词频
    noun_freq = defaultdict(int)

    wordcloud_item = []
    wordcloud_dict = {}

    # 遍历目录下的所有文件
    for dirpath, dirnames, filenames in os.walk(directory):
        for filename in filenames:
            # 检查文件是否为markdown文件
            if filename.endswith('.md') or filename.endswith('.txt'):
                file_path = os.path.join(dirpath, filename)
                # print(file_path)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # 使用jieba进行分词

                    # words = jieba.cut(content,cut_all=False)
                    words = jieba.lcut(content)

                    # 统计名词的词频
                    for word in words:
                        word = re.sub(
                            r'^(-|#|\.|\*|:|0-9|_|a-z|A-Z|0|png|the|to|一个|\+)*$', '', word)
                        word = re.sub(r'^assets.*$', '', word)
                        word = re.sub(r'^[a-z].*$', '', word)
                        word = re.sub(r'^[A-Z][A-Z][A-Z].*$', '', word)
                        word = re.sub(r'^[A-Z][a-z][a-z]$', '', word)
                        word = re.sub(r'^[0-9].*$', '', word)
                        word = re.sub(r'.*[个次]', '', word)
                        if len(word) < 3 or word == string.punctuation:  # 排除单个字符的分词结果
                            continue
                        else:
                            noun_freq[word] += 1
    items = list(noun_freq.items())

    # 根据词语出现的次数进行从大到小排序
    items.sort(key=lambda x: x[1], reverse=True)

    print("{0:<5}{1:<8}{2:<5}".format('序号', '词语', '频率'))

    # # 需要显示的范围  10即显示前10个，0到9
    for i in range(key_nums):
        word, count = items[i]
        wordcloud_item.append(word)
        wordcloud_dict[word] = count
        print("{0:<5}{1:<8}{2:>5}".format(i + 1, word, count))
    # return wordcloud_item

    return wordcloud_dict


# word_frequency(MARKDOWN_ROOT_PATH)


def create_wordlouod(wordcloud_item: dict = {"Shanghai": 30, "Beijing": 40}):
    mask = np.array(Image.open(f"{WORDCLOUD_IMAGE_MASK}"))

    wordcloud = WordCloud(background_color="white",
                          width=1366,
                          height=768,
                          max_words=400,
                          max_font_size=80,
                        #   mask=mask,
                          contour_width=3,
                          contour_color='steelblue',
                          font_path=f'{FONT}',
                          stopwords=stop_words
                          ).generate_from_frequencies(wordcloud_item)
    wordcloud.to_file(f'{OUTPUT_IMG_NAME}')


create_wordlouod(wordcloud_item=word_frequency(MARKDOWN_ROOT_PATH, key_nums=400))
