using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using StepApp.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text.RegularExpressions;

namespace StepApp.Dal
{
    public class MySqlHelper : IDisposable
    {
        //----------------------------------------------------------------

        #region 0.读取appsetting.json中的数据库连接字符串 --- connStr
        //需要引入：  Microsoft.Extensions.Configuration; 与 Microsoft.Extensions.Configuration.FileExtensions；
        //需要引入：  Microsoft.Extensions.Configuration.Json；
        //1.加载appsetting.json
        static IConfiguration configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json").Build();
        //2.获取连接字符串
        private static readonly string connStr = configuration["MySql:MySqlConnection"];
        #endregion

        //----------------------------------------------------------------

        #region 1.获取MySql连接 --- MySqlConnection GetMySqlConnection
        public static MySqlConnection mysqlConn;
        /// <summary>
        /// 调用Mysql连接的静态方法
        /// </summary>
        /// <param name="open">是否打开连接</param>
        /// <param name="convertZeroDatetime"></param>
        /// <param name="allowZeroDatetime"></param>
        /// <returns></returns>
        public static MySqlConnection GetMySqlConnection(
            bool open = true,
            bool convertZeroDatetime = false,
            bool allowZeroDatetime = false)
        {
            var cbs = new MySqlConnectionStringBuilder(connStr)
            {
                AllowZeroDateTime = allowZeroDatetime,
                ConvertZeroDateTime = convertZeroDatetime
            };
            mysqlConn = new MySqlConnection(cbs.ConnectionString);
            return mysqlConn;
        }
        public void Dispose()
        {
            if (mysqlConn != null && mysqlConn.State != System.Data.ConnectionState.Closed)
            {
                mysqlConn.Close();
            }
        }
        #endregion

        //-------------------- 使用ADO.Net操作数据库 -----------------------

        #region 1.增、删、改 int ExecuteNonQuery(string sql,params SqlParameter[] pms)
        /// <summary>
        /// 执行增、删、改SQL语句
        /// </summary>
        /// <param name="sql">sql语句</param>
        /// <param name="pms">参数集合</param>
        /// <returns></returns>        
        public static int ExcuteNonQuery(string sql, params MySqlParameter[] pms)
        {
            using (MySqlConnection dbCon = new MySqlConnection(connStr))
            {
                using (MySqlCommand dbCmd = new MySqlCommand(sql, dbCon))
                {
                    if (pms != null)
                    {
                        dbCmd.Parameters.AddRange(pms);
                    }
                    dbCon.Open();
                    return dbCmd.ExecuteNonQuery();
                }
            }
        }
        #endregion

        #region 2.查询（返回多个值的方法）：SqlDataReader ExcuteReader(String sql, params SqlParameter[] pms)
        public static MySqlDataReader ExecuteReader(string sql, params MySqlParameter[] pms)
        {
            //ExcuteReader 连接是不可以使用Using()的
            MySqlConnection dbCon = new MySqlConnection(connStr);
            using (MySqlCommand dbCmd = new MySqlCommand(sql, dbCon))
            {
                if (pms != null)
                {
                    dbCmd.Parameters.AddRange(pms);
                }
                try
                {
                    dbCon.Open();
                    //System.Data.CommandBehavior.CloseConnection 这个枚举参数，
                    //表示将来使用完毕SqlDataReader后，在关闭reader的同时，
                    //在SQL Data Reader内部会将管理的Connection对象也关闭掉
                    return dbCmd.ExecuteReader(CommandBehavior.CloseConnection);
                }
                catch (Exception ex)
                {
                    dbCon.Close();
                    dbCon.Dispose();
                    throw ex;
                }
            }
        }
        #endregion

        #region 3.查询（返回单个值的方法）：object ExecuteScalar(string sql, params SqlParameter[] pms)
        public static object ExecuteScalar(string sql, params MySqlParameter[] pms)
        {
            using (MySqlConnection dbCon = new MySqlConnection(connStr))
            {
                using (MySqlCommand dbCmd = new MySqlCommand(sql, dbCon))
                {
                    if (pms != null)
                    {
                        dbCmd.Parameters.AddRange(pms);
                    }
                    dbCon.Open();
                    return dbCmd.ExecuteScalar();
                }
            }
        }
        #endregion

        #region 4.查询（返回DataTable的方法）：DataTable GetDataTable(string sql, params MySqlParameter[] pms)
        /// <summary>
        /// 返回 DATa Table 的查询
        /// </summary>
        /// <param name="sql">执行的SQL语句</param>
        /// <param name="pms">参数集合</param>
        /// <returns></returns>
        public static DataTable GetDataTable(string sql, params MySqlParameter[] pms)
        {
            DataTable dt = new DataTable();
            using (MySqlDataAdapter adapter = new MySqlDataAdapter(sql, connStr))
            {
                if (pms != null)
                {
                    adapter.SelectCommand.Parameters.AddRange(pms);
                }
                adapter.Fill(dt);
            }
            return dt;
        }
        #endregion

        #region 5-1.查询所表信息 ：DataTable GetTableInfo(string tbName = "")
        public static DataTable GetTableInfo(string tbName = "")
        {
            string sql = "SELECT a.TABLE_SCHEMA AS dbName,a.TABLE_NAME AS tbName,b.table_comment AS tbInfo,a.COLUMN_NAME AS fdName,";
            sql += "a.COLUMN_COMMENT AS fdInfo,a.data_type AS fdType,a.character_maximum_length AS fdLenth,a.is_nullable AS is_nullable";
            sql += " FROM information_schema.`COLUMNS` AS a LEFT JOIN INFORMATION_SCHEMA.TABLES b ON(a.TABLE_NAME = b.TABLE_NAME) WHERE ";
            sql += "a.TABLE_SCHEMA = 'db_mydatabase'";
            if (!string.IsNullOrEmpty(tbName.Trim()))
            {
                sql += " and a.TABLE_NAME like'%" + tbName.Trim() + "%'";
            }
            return GetDataTable(sql);
        }
        #endregion

        #region 5-2.查询所有表信息 ：List<TBInfoModel> GetTableInfoList(string tbName = "")
        /// <summary>
        /// 查询所有表的字段信息
        /// </summary>
        /// <param name="tbName"></param>
        /// <returns></returns>
        public static List<TBInfoModel> GetTableInfoList(string tbName = "")
        {
            List<TBInfoModel> lsTbInfo = new List<TBInfoModel>();
            DataTable dt = GetTableInfo(tbName);
            foreach (DataRow dr in dt.Rows)
            {
                TBInfoModel model = new TBInfoModel();
                model.dbName = dr["dbName"] == DBNull.Value ? "" : Convert.ToString(dr["dbName"]);
                model.tbName = dr["tbName"] == DBNull.Value ? "" : Convert.ToString(dr["tbName"]);
                model.tbInfo = dr["tbInfo"] == DBNull.Value ? "" : Convert.ToString(dr["tbInfo"]);
                model.fdName = dr["fdName"] == DBNull.Value ? "" : Convert.ToString(dr["fdName"]);
                model.fdInfo = dr["fdInfo"] == DBNull.Value ? "" : Convert.ToString(dr["fdInfo"]);
                model.fdType = dr["fdType"] == DBNull.Value ? "" : Convert.ToString(dr["fdType"]);
                model.fdLength = dr["fdLenth"] == DBNull.Value ? 0 : Convert.ToInt32(dr["fdLenth"]);
                model.is_nullable = dr["fdLenth"] == DBNull.Value ? false : Convert.ToBoolean(dr["fdLenth"]);
                //reader.IsDBNull(6) ? 0 : reader.GetInt32(6);
                //reader.IsDBNull(7) ? false : reader.GetBoolean(7);
                //model.DBName = reader["dbName"].ToString();
                //model.TBName = reader["tbBame"].ToString();
                //model.TBInfo = reader["tbInfo"].ToString();
                //model.FDName = reader["fdName"].ToString();
                //model.FDInfo = reader["fdInfo"].ToString();
                //model.FDType = reader["fdType"].ToString();
                //model.FDLength = Convert.ToInt32(reader["fdLength"]);
                //model.IsNullAble = Convert.ToBoolean(reader["is_nullable"]);
                lsTbInfo.Add(model);
            }
            return lsTbInfo;
        }

        #endregion

        #region 6.过滤 sql关键字过滤 ：string SqlFilters(string source)
        /// <summary>
        /// Sql语句关键字过滤
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static string SqlFilters(string source)
        {
            if (source.Trim() == "" || string.IsNullOrEmpty(source))
                return "1=2";
            //半角括号替换为全角括号
            //source = source.Replace("'", "'''");
            //去除执行SQL语句的命令关键字
            source = Regex.Replace(source, "select", "", RegexOptions.IgnoreCase);
            source = Regex.Replace(source, "insert", "", RegexOptions.IgnoreCase);
            source = Regex.Replace(source, "update", "", RegexOptions.IgnoreCase);
            source = Regex.Replace(source, "delete", "", RegexOptions.IgnoreCase);
            source = Regex.Replace(source, "drop", "", RegexOptions.IgnoreCase);
            source = Regex.Replace(source, "truncate", "", RegexOptions.IgnoreCase);
            source = Regex.Replace(source, "declare", "", RegexOptions.IgnoreCase);
            source = Regex.Replace(source, "xp_cmdshell", "", RegexOptions.IgnoreCase);
            source = Regex.Replace(source, "/add", "", RegexOptions.IgnoreCase);
            source = Regex.Replace(source, "net user", "", RegexOptions.IgnoreCase);
            //去除执行存储过程的命令关键字 
            source = Regex.Replace(source, "exec", "", RegexOptions.IgnoreCase);
            source = Regex.Replace(source, "execute", "", RegexOptions.IgnoreCase);
            //去除系统存储过程或扩展存储过程关键字
            source = Regex.Replace(source, "xp_", "x p_", RegexOptions.IgnoreCase);
            source = Regex.Replace(source, "sp_", "s p_", RegexOptions.IgnoreCase);
            //防止16进制注入
            source = Regex.Replace(source, "0x", "0 x", RegexOptions.IgnoreCase);
            return source;
        }
        #endregion

        #region 7.生成（Guid）：string GetGuid()
        /// <summary>
        /// 获取Guid
        /// </summary>
        /// <returns></returns>
        public static string GetGuid()
        {
            string guid = System.Guid.NewGuid().ToString();
            //一句话即可，但此时id中有“-”符号存在，使用下面语句可变为纯字母+数字。
            //string id = System.Guid.NewGuid().ToString("N");
            return guid;
        }
        #endregion

        //------------------- 使用Dapper操作数据库 ------------------------

        //----------------------------------------------------------------

    }
}
