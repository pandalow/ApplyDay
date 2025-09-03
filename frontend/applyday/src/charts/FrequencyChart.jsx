import ReactECharts from "echarts-for-react";

const FrequencyChart = ({ data }) => {
  if (!data) return (
    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
      <p>No data available</p>
    </div>
  );

  const entries = Object.entries(data);
  const names = entries.map(([name]) => name);
  const counts = entries.map(([_, count]) => count);

  const option = {
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' }
    },
    xAxis: {
      type: "category",
      data: names,
      axisLabel: { 
        rotate: 45,
        color: '#6b7280'
      },
      axisLine: { lineStyle: { color: '#e5e7eb' } }
    },
    yAxis: {
      type: "value",
      axisLabel: { color: '#6b7280' },
      axisLine: { lineStyle: { color: '#e5e7eb' } }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "10%",
      containLabel: true
    },
    series: [
      {
        type: "bar",
        data: counts,
        itemStyle: {
          color: "#4f46e5", // 你原来 Recharts 的颜色
        },
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

export default FrequencyChart;
