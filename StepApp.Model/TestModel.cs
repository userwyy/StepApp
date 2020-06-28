using Dapper.Contrib.Extensions;
using System;
using System.ComponentModel.DataAnnotations;

namespace StepApp.Model
{
    [Table("tb_test")]
    public class TestModel
    {
        //test_id test_name test_value test_num test_date test_flag test_remark
        [Display(Name = "测试编码")]
        [Dapper.Contrib.Extensions.Key]
        public int test_id { get; set; }
        [Display(Name = "测试名称")]
        public string test_name { get; set; }
        [Display(Name = "测试内容")]
        public string test_value { get; set; }
        [Display(Name = "测试数值")]
        public decimal test_num { get; set; }
        [Display(Name = "测试日期")]
        public DateTime test_date { get; set; }
        [Display(Name = "停用标识")]
        public bool test_flag { get; set; }
        [Display(Name = "备注")]
        public string test_remark { get; set; }
    }
}
