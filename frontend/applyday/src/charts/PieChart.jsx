import ReactECharts from "echarts-for-react";

const PieChart = ({ data }) => {
  if (!data) return (
    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
      <p>No data available</p>
    </div>
  );

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' }
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: { color: '#6b7280' }
    },
    series: [
      {
        name: "Frequency",
        type: "pie",
        radius: ["40%", "70%"], // Donut chart
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: "{b}: {c}",
        },
        data: chartData,
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

export default PieChart;
