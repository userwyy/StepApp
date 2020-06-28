//===== 页面渲染时加载findModel功能 ======
$(function () {
    //触发选择项目事件
    selectItemChange();
    document.getElementById('selectItem').onchange = selectItemChange;
    //=== 清空模态框 ===
    ClearQueryForm();
    //=== 并且-点击 ===
    $('#btnAnd').click(function () {
        var strType = strSplit(document.getElementById('selectItem').options[document.getElementById('selectItem').selectedIndex].value, 2);
        sqlListAdd('and', strType);
    });
    //=== 或者-点击 ===
    $('#btnOr').click(function () {
        var strType = strSplit(document.getElementById('selectItem').options[document.getElementById('selectItem').selectedIndex].value, 2);
        sqlListAdd('or', strType);
    });
    //=== 清除-点击 ===
    $('#btnClear').click(function () {
        sqlListAdd('btnClear');
    });
    //=== 查询-点击 ===
    $('#btnFind').click(function () {
        var strType = strSplit(document.getElementById('selectItem').options[document.getElementById('selectItem').selectedIndex].value, 2);
        sqlListAdd('Find', strType);
        var sql = $('#sqlList2').val();
        LoadTable(sql);
        ClearFindModal();
        $("#findModal").modal('hide');
    });
    //===================== 起始日期~结束日期 ======================
    $("#startDate").datepicker({
        format: 'yyyy-mm-dd',      //日期格式
        todayBtn: true,            //显示今日按钮
        autoclose: true,           //选择日期后自动关闭
        todayHighlight: true,      //今日高亮
        //startView: 2,            //日期从月份开始选择
        language: 'zh-CN'          //日期控件的语言版本
    });
    $("#endDate").datepicker({
        format: 'yyyy-mm-dd',
        todayBtn: true,
        autoclose: true,
        todayHighlight: true,
        //startView: 2,
        language: 'zh-CN'
    });
    //====================== 快捷选择日期 ======================
    //document.getElementById("ulDate").getElementsByTagName("li");
    var dateList = $("#ulDate li");
    for (var i = 0; i < dateList.length; i++) {
        dateList[i].onclick = function () {
            var aStr = $(this).find("a").eq(0).text();

            if (aStr == '今天') {
                var startdate = new Date();
                var enddate = new Date();
                //alert('今天');
                //var sdate = startdate.format("yyyy-MM-dd");
                $('#startDate').datepicker('setDate', startdate);
                $('#endDate').datepicker('setDate', enddate);
            }
            else if (aStr == '昨天') {
                var date = new Date();
                var startdate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
                var enddate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
                $('#startDate').datepicker('setDate', startdate);
                $('#endDate').datepicker('setDate', enddate);
            }
            else if (aStr == '本月') {
                var date = new Date();
                var startdate = new Date(date.getFullYear(), date.getMonth(), 1);
                var enddate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                //var sdate = startdate.getFullYear() + "-" + (startdate.getMonth() + 1) + "-" + "1";
                $('#startDate').datepicker('setDate', startdate);
                $('#endDate').datepicker('setDate', enddate);
            }
            else if (aStr == '上月') {
                var date = new Date();
                var startdate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
                var enddate = new Date(date.getFullYear(), date.getMonth(), 0);
                //var sdate = startdate.getFullYear() + "-" + (startdate.getMonth() + 1) + "-" + "1";
                $('#startDate').datepicker('setDate', startdate);
                $('#endDate').datepicker('setDate', enddate);
            }
            else if (aStr == '本周') {
                var date = new Date();
                var weekdate = date.getDay();
                //alert(weekdate);
                var startdate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekdate + 1);
                var enddate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (7 - weekdate));
                //var sdate = startdate.getFullYear() + "-" + (startdate.getMonth() + 1) + "-" + "1";
                $('#startDate').datepicker('setDate', startdate);
                $('#endDate').datepicker('setDate', enddate);
            }
            else if (aStr == '上周') {
                var date = new Date();
                var weekdate = date.getDay();
                var startdate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekdate + 1 - 7);
                var enddate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (7 - weekdate) - 7);
                $('#startDate').datepicker('setDate', startdate);
                $('#endDate').datepicker('setDate', enddate);
            }
            else if (aStr == '今年') {
                var date = new Date();
                var weekdate = date.getDay();
                //alert(weekdate);
                var startdate = new Date(date.getFullYear(), 0, 1);
                var enddate = new Date(date.getFullYear(), 11, 31);
                //var sdate = startdate.getFullYear() + "-" + (startdate.getMonth() + 1) + "-" + "1";
                $('#startDate').datepicker('setDate', startdate);
                $('#endDate').datepicker('setDate', enddate);
            }
            else if (aStr == '去年') {
                var date = new Date();
                var weekdate = date.getDay();
                //alert(weekdate);
                var startdate = new Date(date.getFullYear() - 1, 0, 1);
                var enddate = new Date(date.getFullYear() - 1, 11, 31);
                //var sdate = startdate.getFullYear() + "-" + (startdate.getMonth() + 1) + "-" + "1";
                $('#startDate').datepicker('setDate', startdate);
                $('#endDate').datepicker('setDate', enddate);
            }

        }
    }
});

//====================== selctItem change 事件 ======================
function selectItemChange() {
    var strType = strSplit(document.getElementById('selectItem').options[document.getElementById('selectItem').selectedIndex].value, 2);
    if (strType == 'string') {
        document.getElementById('selectCondition').disabled = false;
        document.getElementById('selectCondition').value = 'like';
        document.getElementById('divString').style.display = '';
        document.getElementById('divNumber').style.display = 'none';
        document.getElementById('divDate').style.display = 'none';
    }
    else if (strType == 'number') {
        document.getElementById('selectCondition').disabled = false;
        document.getElementById('selectCondition').value = 'like';
        document.getElementById('divString').style.display = 'none';
        document.getElementById('divNumber').style.display = '';
        document.getElementById('divDate').style.display = 'none';
    }
    else {
        document.getElementById('selectCondition').disabled = true;
        document.getElementById('selectCondition').value = '=';
        document.getElementById('divString').style.display = 'none';
        document.getElementById('divNumber').style.display = 'none';
        document.getElementById('divDate').style.display = '';
    }
}

//====================== 拆分字符串函数(用,拆分) ======================
function strSplit(strTemp, numTemp) {
    var strTempR;
    var strIndex = strTemp.indexOf(",");
    if (numTemp == 1) {
        strTempR = strTemp.substring(0, strIndex);
        return strTempR;
    }
    else {
        strTempR = strTemp.substr(strIndex + 1, strTemp.length - strIndex - 1);
        return strTempR;
    }
}

//====================== 组合条件函数 ======================
function sqlListAdd(btnOperation, pramType) {
    if (btnOperation != 'btnClear') {
        var selectitem = document.getElementById('selectItem');
        var selectcondition = document.getElementById('selectCondition');
        var indexitem = selectitem.selectedIndex;
        var indexcondition = selectcondition.selectedIndex;
        var item = strSplit(selectitem.options[indexitem].value, 1);
        if (pramType == "string") {
            document.getElementById('sqlList1').value += selectitem.options[indexitem].text + " " + selectcondition.options[indexcondition].text;
            document.getElementById('sqlList2').value += item + " " + selectcondition.options[indexcondition].value;
            if (selectcondition.options[indexcondition].value === 'like' || selectcondition.options[indexcondition].value === 'not like') {
                if (btnOperation == 'and') {
                    document.getElementById('sqlList1').value += " \'" + document.getElementById('txtString').value + "\' 并且" + " \n";
                    document.getElementById('sqlList2').value += " \'%" + document.getElementById('txtString').value + "%\' " + btnOperation + " \n";
                }
                else if (btnOperation == 'or') {
                    document.getElementById('sqlList1').value += " \'" + document.getElementById('txtString').value + "\' 或者" + " \n";
                    document.getElementById('sqlList2').value += " \'%" + document.getElementById('txtString').value + "%\' " + btnOperation + " \n";
                }
                else {
                    document.getElementById('sqlList1').value += " \'" + document.getElementById('txtString').value + "\'";
                    document.getElementById('sqlList2').value += " \'%" + document.getElementById('txtString').value + "%\'";
                }
            }
            else {
                if (btnOperation == 'and') {
                    document.getElementById('sqlList1').value += " \'" + document.getElementById('txtString').value + "\' 并且" + " \n";
                    document.getElementById('sqlList2').value += " \'" + document.getElementById('txtString').value + "\' " + btnOperation + " \n";
                }
                else if (btnOperation == 'or') {
                    document.getElementById('sqlList1').value += " \'" + document.getElementById('txtString').value + "\' 或者" + " \n";
                    document.getElementById('sqlList2').value += " \'" + document.getElementById('txtString').value + "\' " + btnOperation + " \n";
                }
                else {
                    document.getElementById('sqlList1').value += " \'" + document.getElementById('txtString').value + "\'";
                    document.getElementById('sqlList2').value += " \'" + document.getElementById('txtString').value + "\'";
                }
            }
            document.getElementById('txtString').value = '';
            document.getElementById('txtNumber').value = '';
            document.getElementById('startDate').value = '';
            document.getElementById('endDate').value = '';
        }
        else if (pramType == "date") {
            document.getElementById('sqlList1').value += "( " + selectitem.options[indexitem].text + "  等于 ";
            document.getElementById('sqlList2').value += "( " + item + " ";
            var startdatetime = document.getElementById('startDate').value;
            var enddatetime = document.getElementById('endDate').value + " 23:59:59";
            if (btnOperation == 'and') {
                document.getElementById('sqlList1').value += "\'" + startdatetime + "\' 至 " + "\'" + enddatetime + "\' ) 并且 \n";
                document.getElementById('sqlList2').value += " >= \'" + startdatetime + "\' and " + item + " <= \'" + enddatetime + "\' ) " + btnOperation + " \n";
            }
            else if (btnOperation == 'or') {
                document.getElementById('sqlList1').value += "\'" + startdatetime + "\' 至 " + "\'" + enddatetime + "\' ) 或者 \n";
                document.getElementById('sqlList2').value += " >= \'" + startdatetime + "\' and " + item + " <= \'" + enddatetime + "\' ) " + btnOperation + " \n";
            }
            else {
                document.getElementById('sqlList1').value += "\'" + startdatetime + "\' 至 " + "\'" + enddatetime + "\' )";
                document.getElementById('sqlList2').value += " >= \'" + startdatetime + "\' and " + item + " <= \'" + enddatetime + "\' ) ";
            }
        }
        else if (pramType == "number") {
            document.getElementById('sqlList1').value += selectitem.options[indexitem].text + " " + selectcondition.options[indexcondition].text;
            document.getElementById('sqlList2').value += item + " " + selectcondition.options[indexcondition].value;
            if (selectcondition.options[indexcondition].value === 'like') {
                if (btnOperation == 'and') {
                    document.getElementById('sqlList1').value += " \'" + document.getElementById('txtNumber').value + "\' 并且" + " \n";
                    document.getElementById('sqlList2').value += " \'%" + document.getElementById('txtNumber').value + "%\' " + btnOperation + " \n";
                }
                else if (btnOperation == 'or') {
                    document.getElementById('sqlList1').value += " \'" + document.getElementById('txtNumber').value + "\' 或者" + " \n";
                    document.getElementById('sqlList2').value += " \'%" + document.getElementById('txtNumber').value + "%\' " + btnOperation + " \n";
                }
                else {
                    document.getElementById('sqlList1').value += " \'" + document.getElementById('txtNumber').value + "\'";
                    document.getElementById('sqlList2').value += " \'%" + document.getElementById('txtNumber').value + "%\' ";
                }
            }
            else {
                if (btnOperation == 'and') {
                    document.getElementById('sqlList1').value += " \'" + document.getElementById('txtNumber').value + "\' 并且" + " \n";
                    document.getElementById('sqlList2').value += " \'" + document.getElementById('txtNumber').value + "\' " + btnOperation + " \n";
                }
                else if (btnOperation == 'or') {
                    document.getElementById('sqlList1').value += " \'" + document.getElementById('txtNumber').value + "\' 或者" + " \n";
                    document.getElementById('sqlList2').value += " \'" + document.getElementById('txtNumber').value + "\' " + btnOperation + " \n";
                }
                else {
                    document.getElementById('sqlList1').value += " \'" + document.getElementById('txtNumber').value + "\'";
                    document.getElementById('sqlList2').value += " \'" + document.getElementById('txtNumber').value + "\'";
                }
            }
        }
    }
    else {
        //清空查询信息
        document.getElementById("queryForm").reset();
        selectItemChange();
        //document.getElementById('sqlList1').value = '';        
    }
}

//====================== 清空模态框函数 ======================
function ClearQueryForm() {
    //var form = document.getElementById('queryForm');
    //form.submit();
    $("#findModal").on("hidden.bs.modal", function () {
        //$(this).removeData("bs.modal");
        document.getElementById("queryForm").reset();
        selectItemChange();
    });
};

//====================== 清空表单的函数 ======================
function ClearFindModal() {
    //var form = document.getElementById('queryForm');
    //form.submit();
    $("#findModal").on("hidden.bs.modal", function () {
        //$(this).removeData("bs.modal");
        document.getElementById("queryForm").reset();
    });
};
