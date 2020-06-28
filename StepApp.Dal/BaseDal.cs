using Dapper;
using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Data;

namespace StepApp.Dal
{
    public class BaseDal
    {
        #region 1.查询数据  SqlQuery/DapperQuery<T> (string tbName, string sqlWhere, out int rowTotal)

        /// <summary>
        /// 数据查询 - ADO.net
        /// </summary>
        /// <param name="tbName">数据表名</param>
        /// <param name="strWhere">查询条件</param>
        /// <param name="rowTotal">查询结果总行数</param>
        /// <returns></returns>
        public DataTable SqlQuery(string tbName, string sqlWhere, out int rowTotal, int limit = 10, int offset = 0)
        {
            string sql = "";
            string rowSql = "";

            if (string.IsNullOrEmpty(sqlWhere) || sqlWhere.Trim() == "")
            {
                sql = "select * from " + tbName + " ";
                sql = sql + " limit " + offset.ToString() + "," + limit.ToString();
                rowSql = "select count(1) from " + tbName + " ";
            }
            else
            {
                //sql = sql + " limit " + offset.ToString() + "," + limit.ToString();
                sql = "select * from " + tbName + " where ";
                rowSql = "select count(1) from " + tbName + " where ";
                sql = sql + MySqlHelper.SqlFilters(sqlWhere);
                sql = sql + " limit " + offset.ToString() + "," + limit.ToString();
                rowSql = rowSql + MySqlHelper.SqlFilters(sqlWhere);
            }
            rowTotal = Convert.ToInt32(MySqlHelper.ExecuteScalar(rowSql));
            return MySqlHelper.GetDataTable(sql);
        }

        /// <summary>
        /// 数据查询 - Dapper
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="tbName"></param>
        /// <param name="sqlWhere"></param>
        /// <param name="rowToatal"></param>
        /// <param name="limit"></param>
        /// <param name="offset"></param>
        /// <returns></returns>
        public IEnumerable<T> DapperQuery<T>(string tbName, string sqlWhere, out int rowToatal, int limit = 10, int offset = 0)
        {
            string sql = "";
            string rowSql = "";
            if (string.IsNullOrEmpty(sqlWhere) || sqlWhere.Trim() == "")
            {
                sql = "select * from " + tbName + " ";
                sql = sql + " limit " + offset.ToString() + "," + limit.ToString();
                rowSql = "select count(1) from " + tbName + " ";
            }
            else
            {
                sql = "select * from " + tbName + " where ";
                rowSql = "select count(1) from " + tbName + " where ";
                sql = sql + MySqlHelper.SqlFilters(sqlWhere);
                sql = sql + " limit " + offset.ToString() + "," + limit.ToString();
                rowSql = rowSql + MySqlHelper.SqlFilters(sqlWhere);
            }
            rowToatal = Convert.ToInt32(MySqlHelper.ExecuteScalar(rowSql));
            using (IDbConnection dbCon = MySqlHelper.GetMySqlConnection())
            {
                return dbCon.Query<T>(sql).AsList<T>();
            }
        }

        /// <summary>
        /// 数据查询 - Dapper 使用ID查询
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="ID"></param>
        /// <returns></returns>
        public T DapperQueryByID<T>(int ID) where T : class, new()
        {
            using (IDbConnection dbCon = MySqlHelper.GetMySqlConnection())
            {
                return dbCon.Get<T>(ID);
            }
        }

        #endregion

        #region 2.新增数据 Dapper DapperInsert<T>(T model) where T : class, new()
        /// <summary>
        /// 数据增加 - Dapper DapperInsert<T>(T model) where T : class, new()
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="model"></param>
        /// <returns></returns>
        public bool DapperInsert<T>(T model) where T : class, new()
        {
            using (IDbConnection dbCon = MySqlHelper.GetMySqlConnection())
            {
                var result = dbCon.Insert<T>(model);
                if (result > 0)
                {
                    return true;
                }
                else return false;
            }
        }
        #endregion

        #region 3.删除数据 bool DapperDel(string sql)
        /// <summary>
        /// 数据删除 - Dapper bool DapperDel(string sql)
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public bool DapperDel(string sql)
        {
            using (IDbConnection dbCon = MySqlHelper.GetMySqlConnection())
            {
                var result = dbCon.Execute(sql);
                if (result > 0)
                    return true;
                else
                    return false;
            }
        }
        #endregion

        #region 3.更新数据 - Dapper
        /// <summary>
        /// 更新数据 DapperUpDate<T>(T model) where T : class, new()
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="model"></param>
        /// <returns></returns>
        public bool DapperUpDate<T>(T model) where T : class, new()
        {
            bool result = false;
            using (IDbConnection dbCon = MySqlHelper.GetMySqlConnection())
            {                
                result = dbCon.Update<T>(model);                
            }
            return result;
        }
        #endregion

    }
}
