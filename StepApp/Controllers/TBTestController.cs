using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using StepApp.Bll;
using StepApp.Dal;
using StepApp.Model;

namespace StepApp.Controllers
{
    public class TBTestController : Controller
    {
        /// <summary>
        /// 测试首页
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            //初始化表格 test_id test_name test_value test_num test_date test_flag test_remark
            IEnumerable<TBInfoModel> selectList = new List<TBInfoModel>()
            {
                new TBInfoModel {fdName="test_name",fdType="string",fdInfo="测试名称"},
                new TBInfoModel {fdName="test_value",fdType="string",fdInfo="测试内容"},
                new TBInfoModel {fdName="test_num",fdType="number",fdInfo="测试数值"},
                new TBInfoModel {fdName="test_date",fdType="date",fdInfo="测试日期"},
                new TBInfoModel {fdName="test_flag",fdType="number",fdInfo="停用标识"},
                new TBInfoModel {fdName="test_remark",fdType="string",fdInfo="备注"},
            };
            ViewBag.SelectItemList = selectList;
            return View();
        }

        /// <summary>
        /// 获取测试数据
        /// </summary>
        /// <param name="limit"></param>
        /// <param name="offset"></param>
        /// <param name="sqlwhere"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult GetTest(int limit = 10, int offset = 0, string sqlwhere = "")
        {
            TestBll testBll = new TestBll();
            int rowCount = 0;
            var data = testBll.DapperGetTest<TestModel>("tb_test", sqlwhere, out rowCount, limit, offset);
            //DataTable data = testBll.GetTest("tb_test", sqlwhere, out rowCount, limit, offset);
            //DataTable data = MySqlHelper1.GetDataTable("select * from tbtest");
            //for (int i = 0; i < data.Rows.Count; i++)
            //{
            //    for (int j = 0; j < data.Columns.Count; j++)
            //    {
            //        Console.WriteLine(data.Rows[i][j].ToString());
            //    }
            //}
            return Json(new { total = rowCount, rows = data });
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Del(List<int> ids)
        {
            TestBll testBll = new TestBll();
            List<int> list = ids;
            bool result = testBll.TestDel("tb_test", list[0].ToString());
            if (result)
                return Content("OK");
            else
                return Content("NO");
        }

        /// <summary>
        /// 新增数据
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Add(TestModel model)
        {
            TestBll testBll = new TestBll();
            bool result = testBll.TestAdd(model);
            if (result)
            {
                return Content("OK");
            }
            else
            {
                return Content("NO");
            }
        }

        /// <summary>
        /// 查询数据 使用ID
        /// </summary>
        /// <param name="test_id"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult GetTestByID(int test_id)
        {
            TestBll testBll = new TestBll();
            var testData = testBll.GetTestByID(test_id);
            return Json(testData);
        }

        [HttpPost]
        public IActionResult Update(TestModel dto)
        {
            TestBll testBll = new TestBll();
            bool result = testBll.TestUpdate(dto);
            if (result)
                return Content("OK");
            else
                return Content("NO");
        }
    }
}
