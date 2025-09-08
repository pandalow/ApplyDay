import ReactECharts from "echarts-for-react";

const TfidfGroupedChart = ({ data }) => {
  if (!data) return (
    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
      <p>No data available</p>
    </div>
  );

  const roles = Object.keys(data);

  // Find all skills that appeared
  const allSkills = [
    ...new Set(roles.flatMap((r) => data[r].map((s) => s.skill))),
  ];

  const option = {
    tooltip: { 
      trigger: "axis",
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#374151' }
    },
    legend: { 
      data: roles,
      textStyle: { color: '#6b7280' }
    },
    grid: { 
      left: "3%", 
      right: "4%", 
      bottom: "3%", 
      containLabel: true,
      backgroundColor: 'transparent'
    },
    xAxis: { 
      type: "value",
      axisLabel: { color: '#6b7280' },
      axisLine: { lineStyle: { color: '#e5e7eb' } }
    },
    yAxis: { 
      type: "category", 
      data: allSkills,
      axisLabel: { color: '#6b7280' },
      axisLine: { lineStyle: { color: '#e5e7eb' } }
    },
    series: roles.map((role) => ({
      name: role,
      type: "bar",
      data: allSkills.map(
        (skill) => data[role].find((s) => s.skill === skill)?.score || 0
      ),
    })),
  };

  return (
    <div className="w-full">
      <ReactECharts 
        option={option} 
        style={{ height: 400, width: "100%" }}
        theme="light"
      />
    </div>
  );
};

export default TfidfGroupedChart;
