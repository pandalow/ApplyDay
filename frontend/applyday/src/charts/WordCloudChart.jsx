import ReactECharts from "echarts-for-react";
import "echarts-wordcloud";

const WordCloudChart = ({ words }) => {
  if (!words || words.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No data available</p>
      </div>
    );
  }

  // 如果传进来是数组，先统计频率
  let freq = {};
  if (Array.isArray(words)) {
    words.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });
  } else {
    freq = words; // 已经是对象
  }

  const data = Object.entries(freq).map(([name, value]) => ({ name, value }));

  const option = {
    series: [
      {
        type: "wordCloud",
        shape: "circle",
        sizeRange: [12, 50],
        rotationRange: [-90, 90],
        textStyle: {
          color: () =>
            `rgb(${[
              Math.round(Math.random() * 255),
              Math.round(Math.random() * 255),
              Math.round(Math.random() * 255),
            ].join(",")})`,
        },
        data,
      },
    ],
  };

  return (
    <div className="w-full">
      <ReactECharts 
        option={option} 
        style={{ height: 300, width: "100%" }}
        theme="light"
      />
    </div>
  );
};

export default WordCloudChart;
