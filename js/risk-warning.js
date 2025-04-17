// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 首先加载中国地图数据，然后初始化所有图表
    window.loadChinaMapData().then(() => {
        // 初始化风险地图
        initRiskMap();
        
        // 初始化检测数据异常趋势图
        initTrendChart();
        
        // 初始化风险因子分析图
        initRiskFactorCharts();
    }).catch(error => {
        console.error('地图数据加载失败:', error);
    });
});

// 初始化风险地图
function initRiskMap() {
    const mapElement = document.getElementById('riskMap');
    if (!mapElement) {
        console.error('找不到风险地图容器元素');
        return;
    }
    
    // 确保之前的实例被销毁
    echarts.dispose(mapElement);
    const riskMapChart = echarts.init(mapElement);
    
    // 模拟数据 - 实际应用中应从API获取
    const data = [
        {name: '山东', value: 95, risk: 'high'},
        {name: '浙江', value: 92, risk: 'high'},
        {name: '江苏', value: 85, risk: 'medium'},
        {name: '广东', value: 87, risk: 'medium'},
        {name: '四川', value: 90, risk: 'high'},
        {name: '北京', value: 60, risk: 'low'},
        {name: '天津', value: 65, risk: 'low'},
        {name: '上海', value: 72, risk: 'low'},
        {name: '河北', value: 55, risk: 'low'},
        {name: '山西', value: 45, risk: 'low'},
        {name: '辽宁', value: 62, risk: 'low'},
        {name: '吉林', value: 52, risk: 'low'},
        {name: '黑龙江', value: 58, risk: 'low'},
        {name: '安徽', value: 70, risk: 'low'},
        {name: '福建', value: 65, risk: 'low'},
        {name: '江西', value: 62, risk: 'low'},
        {name: '河南', value: 58, risk: 'low'},
        {name: '湖北', value: 72, risk: 'low'},
        {name: '湖南', value: 65, risk: 'low'},
        {name: '广西', value: 60, risk: 'low'},
        {name: '海南', value: 55, risk: 'low'},
        {name: '贵州', value: 50, risk: 'low'},
        {name: '云南', value: 52, risk: 'low'},
        {name: '西藏', value: 45, risk: 'low'},
        {name: '陕西', value: 65, risk: 'low'},
        {name: '甘肃', value: 48, risk: 'low'},
        {name: '青海', value: 40, risk: 'low'},
        {name: '宁夏', value: 45, risk: 'low'},
        {name: '新疆', value: 50, risk: 'low'},
        {name: '重庆', value: 70, risk: 'low'},
        {name: '香港', value: 35, risk: 'low'},
        {name: '澳门', value: 30, risk: 'low'},
        {name: '台湾', value: 38, risk: 'low'},
        {name: '内蒙古', value: 65, risk: 'low'}
    ];

    // 将数据映射到完整省份名称
    const mappedData = data.map(item => {
        if (window.provinceNameMap && window.provinceNameMap[item.name]) {
            return {
                name: window.provinceNameMap[item.name],
                value: item.value,
                risk: item.risk,
                originalName: item.name // 保存原始名称用于显示
            };
        }
        return item;
    });

    const option = {
        title: {
            text: '食品安全风险区域分布',
            left: 'center',
            top: 10
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                const data = params.data;
                if (!data) return params.name;
                
                // 使用原始名称或者从完整名称转换回简称
                let displayName = data.originalName ? 
                    data.originalName : 
                    (window.provinceNameMapReverse && window.provinceNameMapReverse[params.name] ? 
                        window.provinceNameMapReverse[params.name] : params.name);
                
                let riskLevel = '';
                if (data.risk === 'high') {
                    riskLevel = '<span style="color: red">高风险</span>';
                } else if (data.risk === 'medium') {
                    riskLevel = '<span style="color: orange">中风险</span>';
                } else {
                    riskLevel = '<span style="color: green">低风险</span>';
                }
                return `${displayName}<br/>风险指数: ${data.value}<br/>风险等级: ${riskLevel}`;
            }
        },
        visualMap: {
            show: true,
            type: 'piecewise',
            pieces: [
                {min: 90, max: 100, label: '高风险', color: '#d94e5d'},
                {min: 80, max: 89, label: '中风险', color: '#eac736'},
                {min: 0, max: 79, label: '低风险', color: '#50a3ba'}
            ],
            textStyle: {
                color: '#333'
            },
            left: 'right',
            top: 'center',
            orient: 'vertical',
            calculable: true
        },
        series: [{
            name: '风险指数',
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
            }
        }]
    };

    // 设置加载动画
    riskMapChart.showLoading();
    
    // 确认地图已加载后设置选项
    if (echarts.getMap('china')) {
        riskMapChart.hideLoading();
        riskMapChart.setOption(option);
        
        // 窗口大小变化时，调整图表大小
        window.addEventListener('resize', function() {
            riskMapChart.resize();
        });
    } else {
        console.error('无法找到中国地图数据');
        riskMapChart.hideLoading();
    }
}

// 初始化检测数据异常趋势图
function initTrendChart() {
    const trendElement = document.getElementById('trendChart');
    if (!trendElement) {
        console.error('找不到趋势图容器元素');
        return;
    }
    
    // 确保之前的实例被销毁
    echarts.dispose(trendElement);
    const trendChart = echarts.init(trendElement);
    
    // 模拟数据 - 实际应用中应从API获取
    const days = ['4月10日', '4月11日', '4月12日', '4月13日', '4月14日', '4月15日', '4月16日'];
    
    const option = {
        title: {
            text: '一周内检测异常指标趋势',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['农药残留超标率', '重金属超标率', '微生物超标率', '添加剂超标率'],
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
            data: days
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}%'
            }
        },
        series: [
            {
                name: '农药残留超标率',
                type: 'line',
                data: [2.1, 2.3, 2.0, 2.5, 3.8, 4.2, 3.5],
                itemStyle: {
                    color: '#5470c6'
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
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name: '重金属超标率',
                type: 'line',
                data: [1.2, 1.5, 1.3, 1.8, 1.6, 2.1, 1.9],
                itemStyle: {
                    color: '#91cc75'
                },
                lineStyle: {
                    width: 3
                },
                symbol: 'circle',
                symbolSize: 8
            },
            {
                name: '微生物超标率',
                type: 'line',
                data: [3.2, 3.1, 3.3, 4.2, 5.3, 6.1, 4.2],
                itemStyle: {
                    color: '#ee6666'
                },
                lineStyle: {
                    width: 3
                },
                symbol: 'circle',
                symbolSize: 8,
                markPoint: {
                    data: [
                        {type: 'max', name: '最高值'}
                    ]
                }
            },
            {
                name: '添加剂超标率',
                type: 'line',
                data: [1.3, 1.5, 1.7, 1.9, 2.3, 2.8, 2.5],
                itemStyle: {
                    color: '#fac858'
                },
                lineStyle: {
                    width: 3
                },
                symbol: 'circle',
                symbolSize: 8
            }
        ]
    };

    trendChart.setOption(option);
    
    // 窗口大小变化时，调整图表大小
    window.addEventListener('resize', function() {
        trendChart.resize();
    });
}

// 初始化风险因子分析图
function initRiskFactorCharts() {
    // 饼图 - 风险因子占比
    const pieElement = document.getElementById('riskFactorPie');
    if (!pieElement) {
        console.error('找不到风险因子饼图容器元素');
        return;
    }
    
    // 确保之前的实例被销毁
    echarts.dispose(pieElement);
    const riskFactorPie = echarts.init(pieElement);
    
    const pieOption = {
        title: {
            text: '风险因子占比',
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
            data: ['农药残留', '重金属', '微生物', '添加剂', '真菌毒素', '其他']
        },
        series: [
            {
                name: '风险因子',
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
                data: [
                    {value: 32, name: '农药残留'},
                    {value: 28, name: '重金属'},
                    {value: 24, name: '微生物'},
                    {value: 18, name: '添加剂'},
                    {value: 12, name: '真菌毒素'},
                    {value: 8, name: '其他'}
                ]
            }
        ]
    };
    
    riskFactorPie.setOption(pieOption);
    
    // 柱状图 - 风险因子趋势
    const barElement = document.getElementById('riskFactorBar');
    if (!barElement) {
        console.error('找不到风险因子柱状图容器元素');
        return;
    }
    
    // 确保之前的实例被销毁
    echarts.dispose(barElement);
    const riskFactorBar = echarts.init(barElement);
    
    const barOption = {
        title: {
            text: '风险因子月度趋势',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['农药残留', '重金属', '微生物', '添加剂', '真菌毒素'],
            bottom: 0
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
            data: ['1月', '2月', '3月', '4月']
        },
        yAxis: {
            type: 'value',
            name: '超标批次'
        },
        series: [
            {
                name: '农药残留',
                type: 'bar',
                data: [18, 22, 25, 32],
                itemStyle: {
                    color: '#5470c6'
                }
            },
            {
                name: '重金属',
                type: 'bar',
                data: [15, 18, 22, 28],
                itemStyle: {
                    color: '#91cc75'
                }
            },
            {
                name: '微生物',
                type: 'bar',
                data: [12, 15, 20, 24],
                itemStyle: {
                    color: '#ee6666'
                }
            },
            {
                name: '添加剂',
                type: 'bar',
                data: [10, 12, 15, 18],
                itemStyle: {
                    color: '#fac858'
                }
            },
            {
                name: '真菌毒素',
                type: 'bar',
                data: [8, 10, 11, 12],
                itemStyle: {
                    color: '#73c0de'
                }
            }
        ]
    };
    
    riskFactorBar.setOption(barOption);
    
    // 窗口大小变化时，调整图表大小
    window.addEventListener('resize', function() {
        riskFactorPie.resize();
        riskFactorBar.resize();
    });
} 