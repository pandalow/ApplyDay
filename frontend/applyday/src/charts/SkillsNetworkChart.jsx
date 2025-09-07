import ReactECharts from "echarts-for-react";

const SkillsNetworkChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No network data available</p>
      </div>
    );
  }

  // 从边数据中提取所有唯一的节点
  const nodeSet = new Set();
  data.forEach(edge => {
    nodeSet.add(edge.source);
    nodeSet.add(edge.target);
  });

  // 计算每个节点的连接数和总权重
  const nodeStats = {};
  data.forEach(edge => {
    if (!nodeStats[edge.source]) {
      nodeStats[edge.source] = { connections: 0, totalWeight: 0 };
    }
    if (!nodeStats[edge.target]) {
      nodeStats[edge.target] = { connections: 0, totalWeight: 0 };
    }
    
    nodeStats[edge.source].connections += 1;
    nodeStats[edge.source].totalWeight += edge.weight;
    nodeStats[edge.target].connections += 1;
    nodeStats[edge.target].totalWeight += edge.weight;
  });

  // 定义颜色方案
  const getNodeColor = (totalWeight) => {
    if (totalWeight > 2) return '#ef4444'; // 红色 - 高权重
    if (totalWeight > 1) return '#f59e0b'; // 橙色 - 中权重
    return '#4f46e5'; // 蓝色 - 低权重
  };

  // 创建节点数据
  const nodes = Array.from(nodeSet).map(name => {
    const stats = nodeStats[name] || { connections: 0, totalWeight: 0 };
    return {
      id: name,
      name: name,
      symbolSize: Math.max(25, Math.min(70, stats.totalWeight * 20)), // 根据总权重调整节点大小
      value: stats.totalWeight,
      connections: stats.connections,
      category: 0,
      label: {
        show: true,
        position: 'inside',
        fontSize: Math.max(8, Math.min(12, stats.totalWeight * 4)),
        fontWeight: 'bold',
        color: '#fff',
        textBorderColor: '#000',
        textBorderWidth: 1
      },
      itemStyle: {
        color: getNodeColor(stats.totalWeight),
        borderColor: '#fff',
        borderWidth: 2,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      }
    };
  });

  // 创建边数据
  const links = data.map(edge => ({
    source: edge.source,
    target: edge.target,
    value: edge.weight,
    lineStyle: {
      width: Math.max(1, Math.min(6, edge.weight * 2.5)), // 根据权重调整线条粗细
      color: edge.weight > 1.5 ? '#ef4444' : edge.weight > 0.8 ? '#f59e0b' : '#6b7280',
      opacity: 0.8,
      shadowBlur: 5,
      shadowColor: 'rgba(0, 0, 0, 0.2)'
    },
    label: {
      show: edge.weight > 1.2, // 只显示较高权重边的标签
      position: 'middle',
      fontSize: 9,
      color: '#374151',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 3,
      padding: [2, 4],
      formatter: function(params) {
        return params.data.value.toFixed(2);
      }
    }
  }));

  const option = {
    title: {
      text: 'Skills Relationship Network',
      textStyle: {
        color: '#374151',
        fontSize: 18,
        fontWeight: 'bold'
      },
      left: 'center',
      top: 15
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        if (params.dataType === 'edge') {
          return `
            <div style="padding: 8px;">
              <strong>${params.data.source} ↔ ${params.data.target}</strong><br/>
              <span style="color: #6b7280;">Relationship Weight:</span> <strong>${params.data.value.toFixed(3)}</strong>
            </div>
          `;
        } else {
          return `
            <div style="padding: 8px;">
              <strong>${params.data.name}</strong><br/>
              <span style="color: #6b7280;">Total Weight:</span> <strong>${params.data.value.toFixed(2)}</strong><br/>
              <span style="color: #6b7280;">Connections:</span> <strong>${params.data.connections}</strong>
            </div>
          `;
        }
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      borderRadius: 8,
      textStyle: { color: '#374151' },
      extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'
    },
    legend: {
      show: false
    },
    toolbox: {
      show: true,
      feature: {
        restore: { title: 'Reset View' },
        saveAsImage: { title: 'Save as Image' }
      },
      right: 20,
      top: 20
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        name: 'Skills Network',
        type: 'graph',
        layout: 'force',
        data: nodes,
        links: links,
        categories: [
          {
            name: 'Skills',
            itemStyle: {
              color: '#4f46e5'
            }
          }
        ],
        roam: true, // 允许缩放和拖拽
        focusNodeAdjacency: true, // 高亮相邻节点
        draggable: true,
        force: {
          repulsion: 200,
          gravity: 0.05,
          edgeLength: [50, 150],
          layoutAnimation: true
        },
        label: {
          show: true,
          position: 'inside'
        },
        lineStyle: {
          opacity: 0.8,
          curveness: 0.1
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 6,
            opacity: 1
          },
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        select: {
          itemStyle: {
            borderColor: '#000',
            borderWidth: 3
          }
        }
      }
    ]
  };

  return (
    <div className="w-full">
      <ReactECharts 
        option={option} 
        style={{ height: 600, width: "100%" }}
        theme="light"
        opts={{ renderer: 'canvas' }}
      />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="space-y-1">
          <p><strong>Visual Guide:</strong></p>
          <p>🔴 Red nodes: High total weight (&gt; 2.0)</p>
          <p>🟠 Orange nodes: Medium total weight (&gt; 1.0)</p>
          <p>🔵 Blue nodes: Lower total weight</p>
        </div>
        <div className="space-y-1">
          <p><strong>Interactions:</strong></p>
          <p>• Drag nodes to rearrange network</p>
          <p>• Mouse wheel to zoom in/out</p>
          <p>• Hover for detailed information</p>
          <p>• Click to highlight connections</p>
        </div>
      </div>
    </div>
  );
};

export default SkillsNetworkChart;
