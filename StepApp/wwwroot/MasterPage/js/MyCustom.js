//自定义项目放在这个JS中，并提示需要jQuery支持
if (typeof jQuery === "undefined") {
    throw new Error("MyCustom requires jQuery");
}
//==============================================================================
//快捷选取日期
function QueryDate(DateInfo) {
    var DateStartTemp;
    var DateEndTemp;
    //今天
    if (DateInfo == '今天') {
        DateStartTemp = new Date();
        DateEndTemp = new Date();
    }
    else if (DateInfo == '昨天') {
        var NowDate = new Date();
        DateStartTemp = new Date(NowDate.getDate() - 1);
        DateEndTemp = new Date(NowDate.getDate() - 1);
    }
    else if (DateInfo == '本周') {
        var NowDate = new Date();
        var weekdate = date.getDay();
        DateStartTemp = new Date(NowDate.getFullYear(), NowDate.getMonth(), NowDate.getDate() - weekdate + 1);
        DateEndTemp = new Date(NowDate.getFullYear(), NowDate.getMonth(), NowDate.getDate() + (7 - weekdate));
    }
    else if (DateInfo == '上周') {
        var NowDate = new Date();
        var weekdate = date.getDay();
        DateStartTemp = new Date(NowDate.getFullYear(), NowDate.getMonth(), NowDate.getDate() - weekdate + 1 - 7);
        DateEndTemp = new Date(NowDate.getFullYear(), NowDate.getMonth(), NowDate.getDate() + (7 - weekdate) - 7);
    }
    else if (DateInfo == '本月') {
        var NowDate = new Date();
        DateStartTemp = new Date(NowDate.getFullYear(), date.getMonth(), 1);
        DateEndTemp = new Date(NowDate.getFullYear(), date.getMonth() + 1, 0);
    }
    else if (DateInfo == '上月') {
        var NowDate = new Date();
        DateStartTemp = new Date(NowDate.getFullYear(), date.getMonth() - 1, 1);
        DateEndTemp = new Date(NowDate.getFullYear(), date.getMonth(), 0);
    }
    else if (DateInfo == '今年') {
        var NowDate = new Date();
        DateStartTemp = new Date(date.getFullYear(), 0, 1);
        DateEndTemp = new Date(date.getFullYear(), 11, 31);
    }
    else if (DateInfo == '去年') {
        var NowDate = new Date();
        DateStartTemp = new Date(date.getFullYear() - 1, 0, 1);
        DateEndTemp = new Date(date.getFullYear() - 1, 11, 31);
    }
    var dateStart = DateStartTemp.format("yyyy-mm-dd");
    var dateEnd = DateEndTemp.format("yyyy-mm-dd");
    var dateArrays;
    dateArrays[0] = dateStart;
    dateArrays[1] = dateEnd;

    return dateArrays;
}
//==============================================================================
//获取系统时间
//var newDate = '';
//getLangDate();
//值小于10时，在前面补0
//function dateFilter(date) {
//    if (date < 10) { return "0" + date; }
//    return date;
//}
//function getLangDate() {
//    var dateObj = new Date(); //表示当前系统时间的Date对象
//    var year = dateObj.getFullYear(); //当前系统时间的完整年份值
//    var month = dateObj.getMonth() + 1; //当前系统时间的月份值
//    var date = dateObj.getDate(); //当前系统时间的月份中的日
//    var day = dateObj.getDay(); //当前系统时间中的星期值
//    var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
//    var week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
//    var hour = dateObj.getHours(); //当前系统时间的小时值
//    var minute = dateObj.getMinutes(); //当前系统时间的分钟值
//    var second = dateObj.getSeconds(); //当前系统时间的秒钟值
//    var timeValue = "" + ((hour >= 12) ? (hour >= 18) ? "晚上" : "下午" : "上午"); //当前时间属于上午、晚上还是下午
//    newDate = dateFilter(year) + "年" + dateFilter(month) + "月" + dateFilter(date) + "日 " + " " + dateFilter(hour) + ":" + dateFilter(minute) + ":" + dateFilter(second);
//    //document.getElementById("nowTime").innerHTML = "亲爱的朋友，" + timeValue + "好！ 欢迎使用layuiCMS 2.0模版。当前时间为： " + newDate + "　" + week;
//    document.getElementById("nowTime").innerHTML = timeValue + "好！ 欢迎使用综合管理系统。当前时间为： " + newDate + "　" + week;
//    setTimeout("getLangDate()", 1000);
//}
//==============================================================================