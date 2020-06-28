using StepApp.Dal;
using StepApp.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace StepApp.Bll
{
    public class TestBll
    {
        BaseDal baseDal = new BaseDal();
        /// <summary>
        /// 查询tb_test数据--ADO.net
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="sqlWhere"></param>
        /// <param name="rowTotal"></param>
        /// <param name="limit"></param>
        /// <param name="offset"></param>
        /// <returns></returns>
        public DataTable GetTest(string tbName, string sqlWhere, out int rowTotal, int limit = 10, int offset = 0)
        {
            return baseDal.SqlQuery(tbName, sqlWhere, out rowTotal, limit, offset);
        }

        /// <summary>
        /// 查询tb_test数据--Dapper
        /// </summary>
        /// <typeparam name="TestModel"></typeparam>
        /// <param name="tbName"></param>
        /// <param name="sqlWhere"></param>
        /// <param name="rowTotal"></param>
        /// <param name="limit"></param>
        /// <param name="offset"></param>
        /// <returns></returns>
        public IEnumerable<TestModel> DapperGetTest<TestModel>(string tbName, string sqlWhere, out int rowTotal, int limit = 10, int offset = 0)
        {
            return baseDal.DapperQuery<TestModel>(tbName, sqlWhere, out rowTotal, limit, offset);
        }

        /// <summary>
        /// 删除tb_test数据
        /// </summary>
        /// <param name="tbName"></param>
        /// <param name="dataID"></param>
        /// <returns></returns>
        public bool TestDel(string tbName, object dataID)
        {
            string sql = "delete from " + tbName + " where test_id=" + MySqlHelper.SqlFilters(dataID.ToString()) + "";
            return baseDal.DapperDel(sql);
        }

        /// <summary>
        /// 增加tb_test数据
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public bool TestAdd(TestModel model)
        {
            return baseDal.DapperInsert<TestModel>(model);
        }

        /// <summary>
        /// 查询tb_test数据 单个查询ID
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public TestModel GetTestByID(int ID)
        {
            return baseDal.DapperQueryByID<TestModel>(ID);
        }

        /// <summary>
        /// 更新tb_test数据 单个更新数据
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public bool TestUpdate(TestModel model)
        {
            return baseDal.DapperUpDate<TestModel>(model);
        }
    }
}
