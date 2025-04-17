/**
 * 中国地图数据加载模块
 * 所有需要使用中国地图的页面都可以引用此模块
 */

// 定义全局变量，用于跟踪地图数据加载状态
window.chinaMapLoaded = false;
window.chinaMapLoading = false;
window.chinaMapLoadPromise = null;

// 省份名称映射表 - 将简称映射到完整名称
window.provinceNameMap = {
    '北京': '北京市',
    '天津': '天津市',
    '上海': '上海市',
    '重庆': '重庆市',
    '河北': '河北省',
    '山西': '山西省',
    '辽宁': '辽宁省',
    '吉林': '吉林省',
    '黑龙江': '黑龙江省',
    '江苏': '江苏省',
    '浙江': '浙江省',
    '安徽': '安徽省',
    '福建': '福建省',
    '江西': '江西省',
    '山东': '山东省',
    '河南': '河南省',
    '湖北': '湖北省',
    '湖南': '湖南省',
    '广东': '广东省',
    '海南': '海南省',
    '四川': '四川省',
    '贵州': '贵州省',
    '云南': '云南省',
    '陕西': '陕西省',
    '甘肃': '甘肃省',
    '青海': '青海省',
    '台湾': '台湾省',
    '内蒙古': '内蒙古自治区',
    '广西': '广西壮族自治区',
    '西藏': '西藏自治区',
    '宁夏': '宁夏回族自治区',
    '新疆': '新疆维吾尔自治区',
    '香港': '香港特别行政区',
    '澳门': '澳门特别行政区'
};

// 反向映射表 - 从完整名称映射到简称
window.provinceNameMapReverse = {};
for (const key in window.provinceNameMap) {
    window.provinceNameMapReverse[window.provinceNameMap[key]] = key;
}

/**
 * 加载中国地图数据
 * @returns {Promise} 返回Promise对象，加载成功时resolve，失败时reject
 */
function loadChinaMapData() {
    // 如果地图已加载，则立即返回成功
    if (window.chinaMapLoaded && echarts.getMap('china')) {
        console.log('中国地图数据已加载');
        return Promise.resolve();
    }
    
    // 如果正在加载中，则返回正在进行的Promise
    if (window.chinaMapLoading && window.chinaMapLoadPromise) {
        console.log('中国地图数据正在加载中');
        return window.chinaMapLoadPromise;
    }
    
    // 创建新的加载Promise
    console.log('开始加载中国地图数据...');
    window.chinaMapLoading = true;
    window.chinaMapLoadPromise = new Promise((resolve, reject) => {
        // 从阿里云数据可视化平台获取中国地图数据
        fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP错误，状态: ${response.status}`);
                }
                return response.json();
            })
            .then(chinaMapData => {
                // 将获取的GeoJSON数据注册到ECharts
                echarts.registerMap('china', {
                    // 需要将GeoJSON数据转换为ECharts使用的格式
                    type: 'FeatureCollection',
                    features: chinaMapData.features
                });
                console.log('中国地图数据加载成功');
                window.chinaMapLoaded = true;
                window.chinaMapLoading = false;
                resolve();
            })
            .catch(err => {
                console.error('加载中国地图数据失败:', err);
                // 尝试备用数据源
                console.log('尝试从备用数据源加载...');
                fetch('https://geo.datav.aliyun.com/areas_v3/bound/china.json')
                    .then(response => response.json())
                    .then(backupData => {
                        echarts.registerMap('china', backupData);
                        console.log('通过备用源加载中国地图数据成功');
                        window.chinaMapLoaded = true;
                        window.chinaMapLoading = false;
                        resolve();
                    })
                    .catch(backupErr => {
                        console.error('备用地图数据源也加载失败:', backupErr);
                        window.chinaMapLoading = false;
                        window.chinaMapLoadPromise = null;
                        reject(backupErr);
                    });
            });
    });
    
    return window.chinaMapLoadPromise;
}

// 在所有脚本加载完成后自动开始加载地图数据
document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面是否需要地图数据（主页、风险预警页等）
    const pagePathLower = window.location.pathname.toLowerCase();
    const needsMapData = 
        pagePathLower.endsWith('index.html') || 
        pagePathLower.includes('risk-warning') ||
        pagePathLower === '/' || 
        pagePathLower === '';
    
    if (needsMapData) {
        loadChinaMapData().catch(error => {
            console.error('地图数据预加载失败:', error);
        });
    }
});

// 暴露给全局作用域，方便其他脚本使用
window.loadChinaMapData = loadChinaMapData; 