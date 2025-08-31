import os
import wordcloud
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter


class Drawer():
    def __init__(self):
        if not os.path.exists('charts'):
            os.makedirs('charts')

    @staticmethod
    def draw_bar_chart(data, title, xlabel, ylabel, filename):
        """
        Generate and save a bar chart.
        Args:
        data (dict): A dictionary with keys as labels and values as counts.
        title (str): The title of the chart.
        xlabel (str): The label for the x-axis.
        ylabel (str): The label for the y-axis.
        filename (str): The filename to save the chart as.
    """

        plt.figure(figsize=(10, 6))
        sns.barplot(y=list(data.keys()), x=list(data.values()))
        plt.title(title)
        plt.xlabel(xlabel)
        plt.ylabel(ylabel)
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(f'charts/{filename}')
        plt.close()

    @staticmethod
    def draw_circle_chart(data, title, filename):
        """
        Generate and display a pie chart.
        Args:
            data (dict): A dictionary with keys as labels and values as counts.
            title (str): The title of the chart.
            filename (str): The filename to save the chart as.
        """
        plt.figure(figsize=(8, 8))
        plt.pie(data.values(), labels=data.keys(), autopct='%1.1f%%', startangle=140)
        plt.title(title)
        plt.tight_layout()
        plt.savefig(f'charts/{filename}')
        plt.close()

    @staticmethod
    def draw_wordcloud(data, filename):
        """
        Generate and save a word cloud image.
        Args:
            data (Counter): A Counter with words as keys and their frequencies as values.
            filename (str): The filename to save the word cloud image as.
        """
        wc = wordcloud.WordCloud(width=800, height=400, background_color='white').generate_from_frequencies(data)
        plt.figure(figsize=(10, 5))
        plt.imshow(wc, interpolation='bilinear')
        plt.axis('off')
        plt.savefig(f'charts/{filename}')
        plt.close()

    @staticmethod
    def draw_vertical_bar_chart(data, title, xlabel, ylabel, filename):
        """
        Generate and save a vertical bar chart.
        Args:
            data (dict): A dictionary with keys as labels and values as counts.
            title (str): The title of the chart.
            xlabel (str): The label for the x-axis.
            ylabel (str): The label for the y-axis.
            filename (str): The filename to save the chart as.
        """
        plt.figure(figsize=(10, 6))
        sns.barplot(x=list(data.keys()), y=list(data.values()))
        plt.title(title)
        plt.xlabel(xlabel)
        plt.ylabel(ylabel)
        plt.xticks(rotation=45)
        plt.tight_layout()