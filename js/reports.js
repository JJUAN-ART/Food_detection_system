// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化合格率趋势图
    initQualifiedRateChart();
    
    // 初始化地区对比图
    initRegionComparisonChart();
    
    // 初始化品类对比图
    initCategoryComparisonChart();
    
    // 初始化不合格原因分析图
    initFailureReasonCharts();
});

// 初始化合格率趋势图
function initQualifiedRateChart() {
    const qualifiedRateChart = echarts.init(document.getElementById('qualifiedRateChart'));
    
    // 模拟数据 - 实际应用中应从API获取
    const months = ['2022-11', '2022-12', '2023-01', '2023-02', '2023-03', '2023-04'];
    const qualifiedRateData = [88.5, 89.2, 90.1, 89.8, 90.6, 91.2];
    const nationalAvgData = [87.2, 87.5, 87.9, 88.3, 88.5, 88.9];

    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                let result = params[0].name + '<br/>';
                params.forEach(param => {
                    result += param.seriesName + ': ' + param.value + '%<br/>';
                });
                return result;
            }
        },
        legend: {
            data: ['本地区合格率', '全国平均合格率']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
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
            max: 95,
            axisLabel: {
                formatter: '{value}%'
            }
        },
        series: [
            {
                name: '本地区合格率',
                type: 'line',
                data: qualifiedRateData,
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
                name: '全国平均合格率',
                type: 'line',
                data: nationalAvgData,
                itemStyle: {
                    color: '#6c757d'
                },
                lineStyle: {
                    type: 'dashed',
                    width: 2
                },
                symbol: 'circle',
                symbolSize: 6
            }
        ]
    };

    qualifiedRateChart.setOption(option);
    
    // 窗口大小变化时，调整图表大小
    window.addEventListener('resize', function() {
        qualifiedRateChart.resize();
    });
}

// 初始化地区对比图
function initRegionComparisonChart() {
    const regionComparisonChart = echarts.init(document.getElementById('regionComparisonChart'));
    
    // 模拟数据 - 实际应用中应从API获取
    const regions = ['北京', '上海', '广州', '深圳', '成都', '杭州', '重庆', '武汉'];
    const qualifiedData = [92.5, 93.1, 88.7, 89.9, 90.2, 91.5, 89.3, 90.8];
    const nationalAvg = 88.9;

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                return params[0].name + ': ' + params[0].value + '%';
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: regions,
            axisLabel: {
                interval: 0,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value',
            min: 85,
            max: 95,
            axisLabel: {
                formatter: '{value}%'
            }
        },
        series: [
            {
                name: '合格率',
                type: 'bar',
                data: qualifiedData,
                itemStyle: {
                    color: function(params) {
                        // 高于全国平均值显示为绿色，低于显示为橙色
                        return params.value > nationalAvg ? '#20c997' : '#fd7e14';
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}%'
                },
                markLine: {
                    data: [
                        {
                            name: '全国平均',
                            type: 'average',
                            label: {
                                formatter: '全国平均: {c}%',
                                position: 'end'
                            },
                            lineStyle: {
                                color: '#dc3545',
                                type: 'dashed'
                            }
                        }
                    ]
                }
            }
        ]
    };

    regionComparisonChart.setOption(option);
    
    // 窗口大小变化时，调整图表大小
    window.addEventListener('resize', function() {
        regionComparisonChart.resize();
    });
}

// 初始化品类对比图
function initCategoryComparisonChart() {
    const categoryComparisonChart = echarts.init(document.getElementById('categoryComparisonChart'));
    
    // 模拟数据 - 实际应用中应从API获取
    const categories = ['蔬菜水果', '肉禽蛋', '水产品', '乳制品', '粮油制品', '酒类', '饮料', '调味品'];
    const currentData = [93.5, 89.2, 86.7, 94.1, 95.2, 92.8, 93.3, 91.8];
    const previousData = [92.1, 88.5, 85.9, 93.2, 94.8, 91.9, 92.4, 90.7];

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['本月', '上月']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            min: 80,
            max: 100,
            axisLabel: {
                formatter: '{value}%'
            }
        },
        yAxis: {
            type: 'category',
            data: categories
        },
        series: [
            {
                name: '本月',
                type: 'bar',
                data: currentData,
                itemStyle: {
                    color: '#0d6efd'
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}%'
                }
            },
            {
                name: '上月',
                type: 'bar',
                data: previousData,
                itemStyle: {
                    color: '#6c757d'
                }
            }
        ]
    };

    categoryComparisonChart.setOption(option);
    
    // 窗口大小变化时，调整图表大小
    window.addEventListener('resize', function() {
        categoryComparisonChart.resize();
    });
}

// 初始化不合格原因分析图
function initFailureReasonCharts() {
    // 饼图 - 不合格原因占比
    const failureReasonPieChart = echarts.init(document.getElementById('failureReasonPieChart'));
    
    // 模拟数据 - 实际应用中应从API获取
    const pieData = [
        {value: 38, name: '农药残留超标'},
        {value: 25, name: '重金属含量超标'},
        {value: 18, name: '微生物指标超标'},
        {value: 12, name: '添加剂超标'},
        {value: 7, name: '其他原因'}
    ];

    const pieOption = {
        title: {
            text: '不合格原因占比分析',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            top: 'center',
            data: pieData.map(item => item.name)
        },
        series: [
            {
                name: '不合格原因',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: pieData
            }
        ]
    };
    
    failureReasonPieChart.setOption(pieOption);
    
    // 柱状图 - 不合格原因对比
    const failureReasonBarChart = echarts.init(document.getElementById('failureReasonBarChart'));
    
    // 模拟数据 - 实际应用中应从API获取
    const categories = ['蔬菜水果', '肉禽蛋', '水产品', '乳制品', '粮油制品'];
    const reasons = ['农药残留超标', '重金属含量超标', '微生物指标超标', '添加剂超标', '其他原因'];
    
    // 生成模拟数据
    const seriesData = reasons.map((reason, index) => {
        const data = categories.map(() => Math.floor(Math.random() * 10) + 1);
        
        return {
            name: reason,
            type: 'bar',
            stack: 'total',
            emphasis: {
                focus: 'series'
            },
            data: data
        };
    });

    const barOption = {
        title: {
            text: '各品类不合格原因分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: reasons,
            top: 'bottom'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: categories
        },
        yAxis: {
            type: 'value',
            name: '不合格样本数',
            axisLabel: {
                formatter: '{value}个'
            }
        },
        series: seriesData
    };
    
    failureReasonBarChart.setOption(barOption);
    
    // 窗口大小变化时，调整图表大小
    window.addEventListener('resize', function() {
        failureReasonPieChart.resize();
        failureReasonBarChart.resize();
    });
} 