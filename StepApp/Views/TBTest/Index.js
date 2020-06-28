//== 初始化table列表 ==
var tableColumns = [];
var addtype = 2;

//== 页面加载 ==
$(function () {
    LoadTable('');
    //初始化日期控件
    $("#test_date").datepicker({
        format: 'yyyy-mm-dd',      //日期格式
        todayBtn: true,            //显示今日按钮
        autoclose: true,           //选择日期后自动关闭
        todayHighlight: true,      //今日高亮
        //startView: 2,            //日期从月份开始选择
        language: 'zh-CN'          //日期控件的语言版本
    });
});

//== 载入表格函数 ==
function LoadTable(jsonSql) {
    //初始化表格 test_id test_name test_value test_num test_date test_flag test_remark
    tableColumns = [
        { checkbox: true, visible: true }, //是否显示复选框
        {
            title: '序号',
            formatter: function (value, row, index) {
                return index + 1;
            },
            align: 'center',
            valign: 'middle',
            footerFormatter: function (value) {
                return '合计';
            }
        }, //显示序号
        { field: 'test_id', title: '测试编码', visible: false },
        { field: 'test_name', title: '测试名称', sortable: true },
        { field: 'test_value', title: '测试内容', sortable: true },
        {
            field: 'test_num',
            title: '测试数值',
            formatter: function (value, row, index) { return value.toFixed(2); },
            align: 'right',
            footerFormatter: function (rows) {
                //测试数值
                var sum = 0;
                for (var i = 0; i < rows.length; i++) {
                    sum += rows[i].test_num;
                }
                return sum.toFixed(2);
            }
        },
        { field: 'test_date', title: '测试日期', sortable: true },
        { field: 'test_flag', title: '停用标识', sortable: true },
        {
            field: 'test_remark', title: '备注', align: 'right',
            footerFormatter: function (value) {
                return '备注';
            }
        },
    ];
    //动态加载表格之前，先销毁表格
    $('#tbData').bootstrapTable('destroy');
    //表格属性设置
    $('#tbData').bootstrapTable({
        columns: tableColumns,
        url: '/TBTest/GetTest',             //请求后台的URL（*）
        method: 'post',                       //请求方式（*）
        toolbar: '#toolbar',                 //工具按钮用哪个容器
        striped: true,                       //是否显示行间隔色
        cache: false,                        //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                    //是否显示分页（*）
        sortable: true,                      //是否启用排序
        sortOrder: "asc",                    //排序方式
        queryParams: queryParams, //传递参数（*）
        sidePagination: "server",            //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                        //每页的记录行数（*）
        pageList: [10, 25, 50, 100],         //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        contentType: "application/x-www-form-urlencoded",
        strictSearch: true,
        showColumns: true,                   //是否显示所有的列
        showRefresh: true,                   //是否显示刷新按钮
        minimumCountColumns: 2,              //最少允许的列数
        clickToSelect: true,                 //是否启用点击选中行
        singleSelect: true,                  //是否进行单选
        height: $(window).height() - 50,     //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "no",                      //每一行的唯一标识，一般为主键列
        showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                     //是否显示详细视图
        detailView: false,                   //是否显示父子表
        showFooter: true,                    //显示页脚
        //sortOrder: "asc",                  //排序方式        
        idField: "testID",
        showExport: true,                    //显示导出按钮
        //exportDataType: $(this).val(),//显示导出范围
        //exportTypes: ['json', 'xml', 'png', 'csv', 'txt', 'sql', 'doc', 'excel', 'xlsx', 'pdf'],//导出格式
        //exportOptions: {//导出设置
        //    fileName: 'Tablexxx',//下载文件名称
        //},
        rowStyle: function (row, index) {
            var classesArr = ['success', 'info'];
            var strclass = "";
            if (index % 2 === 0) {//偶数行
                strclass = classesArr[0];
            } else {//奇数行
                strclass = classesArr[1];
            }
            return { classes: strclass };
        },//隔行变色 
    });
    //获取查询的参数
    function queryParams(params) {
        //var sql1 = jsonSql;
        var temp = {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset,
            sqlwhere: jsonSql,
            sort: params.sort,
            sortOrder: params.order
        };
        return temp;
    };
    $('#tbData').bootstrapTable('resetView', {
        height: $(window).height() - 50
    });
    $('#tbData').bootstrapTable('refresh');
}

//== 删除选择数据 ==
$('#with_delete').click(function () {
    var dataRows = $('#tbData').bootstrapTable('getSelections');
    if (dataRows.length == 0) {
        alert('请选择要删除的记录');
        return;
    }
    if (!confirm("是否确认删除？"))
        return;
    var ids = new Array();
    $(dataRows).each(function () {
        ids.push(this.test_id);
    });
    //alert(ids);
    $.ajax({
        type: "post",
        url: "/TBTest/Del",
        cache: false,
        data: { ids },
        success: function (result) {
            if (result == "OK") {
                $('#tbData').bootstrapTable('refresh');
            } else {
                alert("删除失败");
                $('#tbData').bootstrapTable('refresh');
            }
        }
    });
});

//== 新增optionModal ==
$('#with_add').click(function () {
    document.getElementById('optionForm').reset();
    addtype = 1;
    //document.getElementById('test_type').value = "add";
    $('#test_num').val(0);
    var dateNow = new Date();
    $('#test_date').datepicker('setDate', dateNow);
    $('#optionModal').modal('show');
});

//== 编辑optionModal ==
$('#with_edit').click(function () {
    document.getElementById('optionForm').reset();
    addtype = 0;
    var dataRow = $('#tbData').bootstrapTable('getSelections');
    if (dataRow.length == 1) {
        var test_id = dataRow[0].test_id;
        $.ajax({
            type: "post",
            url: "/TBTest/GetTestByID",
            cache: false,
            data: { test_id },
            success: function (result) {
                $('#test_id').val(result.test_id);
                $('#test_name').val(result.test_name);
                $('#test_value').val(result.test_value);
                $('#test_num').val(result.test_num);
                $('#test_date').val(result.test_date);
                $('#test_remark').val(result.test_remark);
                $('#optionModal').modal('show');
            }
        });
    } else {
        alert("请选择一条数据");
    }
});

//== 点击“保存”按钮 ==
$('#btnSave').click(function () {

    if (addtype == 1) {
        //增加数据 //alert('1111');
        $.ajax({
            type: "post",
            url: "/TBTest/Add",
            data: $("#optionForm").serialize(),
            success: function (result) {
                if (result == "OK") {
                    addtype = 2;
                    $('#optionModal').modal('hide');
                    $('#tbData').bootstrapTable('refresh');
                } else {
                    addtype = 2;
                    alert("新增失败！");
                    $('#optionModal').modal('hide');
                }
            },
            error: function () {
                addtype = 2;
                alert("新增失败！");
            }
        });
    } else if (addtype == 0) {
        //编辑数据
        $.ajax({
            type: "post",
            url: "/TBTest/Update",
            data: {
                'dto': {
                    'test_id': $('#test_id').val(),
                    'test_name': $('#test_name').val(),
                    'test_value': $('#test_value').val(),
                    'test_num': $('#test_num').val(),
                    'test_date': $('#test_date').val(),
                    'test_remark': $('#test_remark').val(),
                }
            },
            success: function (result) {
                if (result == "OK") {
                    addtype = 2;
                    $('#optionModal').modal('hide');
                    $('#tbData').bootstrapTable('refresh');
                } else {
                    addtype = 2;
                    alert("更新失败！");
                    $('#optionModal').modal('hide');
                }
            },
            error: function () {
                addtype = 2;
                alert("更新失败！");
            }
        });
    }

});

//== 重新计算表格高度==
$(window).resize(function () {
    $('#tbData').bootstrapTable('resetView', {
        height: $(window).height() - 50
    });
});

