using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StepApp.Bll;
using StepApp.Model;

namespace StepApp.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            IEnumerable<TBInfoModel> selectList = new List<TBInfoModel>()
            {
                new TBInfoModel {fdName="testname",fdType="string",fdInfo="测试名称"},
                //new TBInfoModel {fdName="test_value",fdType="string",fdInfo="测试内容"},
                new TBInfoModel {fdName="testnum",fdType="number",fdInfo="测试数值"},
                //new TBInfoModel {fdName="test_date",fdType="date",fdInfo="测试日期"},
            };
            ViewBag.SelectItemList = selectList;
            return View();
        }
        public IActionResult TestData()
        {
            //int limit, int offset, string sqlwhere = ""
            //TestBll testBll = new TestBll();
            //int rowCount = 0;
            //var data = testBll.GetTest("tbtest", sqlwhere, out rowCount, limit, offset);
            //return Json(new { total = rowCount, rows = data });
            return View();
        }
    }
}
