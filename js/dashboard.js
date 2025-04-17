// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 使用共享模块加载地图数据，然后初始化所有图表
    window.loadChinaMapData().then(() => {
        // 初始化城乡食品安全热力图
        initSafetyHeatmap();
        
        // 初始化安全指数环比图
        initSafetyIndexChart();
    }).catch(error => {
        console.error('地图数据加载失败:', error);
    });
});

// 初始化城乡食品安全热力图
function initSafetyHeatmap() {
    const heatmapElement = document.getElementById('safetyHeatmap');
    if (!heatmapElement) {
        console.error('找不到热力图容器元素');
        return;
    }
    
    // 确保之前的实例被销毁
    echarts.dispose(heatmapElement);
    const heatmapChart = echarts.init(heatmapElement);
    
    // 模拟数据 - 实际应用中应从API获取
    const data = [
        {name: '北京', value: 92},
        {name: '天津', value: 89},
        {name: '上海', value: 94},
        {name: '重庆', value: 87},
        {name: '河北', value: 85},
        {name: '山西', value: 83},
        {name: '辽宁', value: 91},
        {name: '吉林', value: 90},
        {name: '黑龙江', value: 88},
        {name: '江苏', value: 93},
        {name: '浙江', value: 95},
        {name: '安徽', value: 86},
        {name: '福建', value: 91},
        {name: '江西', value: 85},
        {name: '山东', value: 82}, // 风险区域
        {name: '河南', value: 86},
        {name: '湖北', value: 89},
        {name: '湖南', value: 87},
        {name: '广东', value: 81}, // 风险区域
        {name: '广西', value: 84},
        {name: '海南', value: 90},
        {name: '四川', value: 88},
        {name: '贵州', value: 86},
        {name: '云南', value: 85},
        {name: '西藏', value: 92},
        {name: '陕西', value: 87},
        {name: '甘肃', value: 86},
        {name: '青海', value: 91},
        {name: '宁夏', value: 89},
        {name: '新疆', value: 87},
        {name: '台湾', value: 88},
        {name: '香港', value: 90},
        {name: '澳门', value: 89},
        {name: '内蒙古', value: 85}
    ];

    // 将数据映射到完整省份名称
    const mappedData = data.map(item => {
        if (window.provinceNameMap && window.provinceNameMap[item.name]) {
            return {
                name: window.provinceNameMap[item.name],
                value: item.value,
                originalName: item.name // 保存原始名称用于显示
            };
        }
        return item;
    });

    const option = {
        title: {
            text: '食品安全评分',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                // 使用原始名称或者从完整名称转换回简称
                let displayName = params.data && params.data.originalName ? 
                    params.data.originalName : 
                    (window.provinceNameMapReverse && window.provinceNameMapReverse[params.name] ? 
                        window.provinceNameMapReverse[params.name] : params.name);
                
                return displayName + ': ' + (params.value || '--') + '分';
            }
        },
        visualMap: {
            show: true,
            type: 'continuous',
            min: 80,
            max: 100,
            inRange: {
                color: ['#50a3ba', '#eac736', '#d94e5d'].reverse()
            },
            text: ['高', '低'],
            calculable: true,
            left: 'right',
            top: 'bottom'
        },
        series: [{
            name: '食品安全评分',
            type: 'map',
            map: 'china',
            roam: true, // 允许缩放和拖动
            data: mappedData,
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true
                },
                itemStyle: {
                    areaColor: '#66ccff'
                }
            },
            select: {
                label: {
                    show: true
                },
                itemStyle: {
                    color: '#66ccff'
                }
            }
        }]
    };

    // 设置加载动画
    heatmapChart.showLoading();
    // 确认地图已加载后设置选项
    if (echarts.getMap('china')) {
        heatmapChart.hideLoading();
        heatmapChart.setOption(option);
        
        // 窗口大小变化时，调整图表大小
        window.addEventListener('resize', function() {
            heatmapChart.resize();
        });
    } else {
        console.error('无法找到中国地图数据');
        heatmapChart.hideLoading();
    }
}

// 初始化安全指数环比图
function initSafetyIndexChart() {
    const indexElement = document.getElementById('safetyIndexChart');
    if (!indexElement) {
        console.error('找不到环比图容器元素');
        return;
    }
    
    // 确保之前的实例被销毁
    echarts.dispose(indexElement);
    const indexChart = echarts.init(indexElement);
    
    // 模拟数据 - 实际应用中应从API获取
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const urbanData = [91, 92, 90, 91, 92, 93, 92, 93, 94, 93, 94, 93];
    const ruralData = [87, 86, 87, 88, 87, 88, 89, 90, 89, 90, 91, 92];

    const option = {
        title: {
            text: '城乡食品安全指数对比',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['城市地区', '农村地区'],
            bottom: 0
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: months
        },
        yAxis: {
            type: 'value',
            min: 85,
            max: 100,
            name: '安全指数'
        },
        series: [
            {
                name: '城市地区',
                type: 'line',
                data: urbanData,
                itemStyle: {
                    color: '#0d6efd'
                },
                lineStyle: {
                    width: 3
                },
                symbol: 'circle',
                symbolSize: 8,
                markPoint: {
                    data: [
                        {type: 'max', name: '最高值'},
                        {type: 'min', name: '最低值'}
                    ]
                }
            },
            {
                name: '农村地区',
                type: 'line',
                data: ruralData,
                itemStyle: {
                    color: '#20c997'
                },
                lineStyle: {
                    width: 3
                },
                symbol: 'circle',
                symbolSize: 8,
                markPoint: {
                    data: [
                        {type: 'max', name: '最高值'},
                        {type: 'min', name: '最低值'}
                    ]
                }
            }
        ]
    };

    // 设置图表
    indexChart.setOption(option);
    
    // 窗口大小变化时，调整图表大小
    window.addEventListener('resize', function() {
        indexChart.resize();
    });
} 