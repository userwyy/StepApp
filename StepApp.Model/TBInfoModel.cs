using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace StepApp.Model
{
    public class TBInfoModel
    {
        //--------------------------------------------------------------------------
        /// <summary>
        /// dbName --- 数据库名称
        /// </summary>
        [Display(Name = "数据库名称")]
        public string dbName { get; set; }
        //--------------------------------------------------------------------------
        /// <summary>
        /// tbName --- 数据表名称
        /// </summary>
        [Display(Name = "数据表名称")]
        public string tbName { get; set; }
        //--------------------------------------------------------------------------
        /// <summary>
        /// tbInfo --- 数据表信息
        /// </summary>
        [Display(Name = "数据表信息")]
        public string tbInfo { get; set; }
        //--------------------------------------------------------------------------
        /// <summary>
        /// fdName --- 字段名称
        /// </summary>
        [Display(Name = "字段名称")]
        public string fdName { get; set; }
        //--------------------------------------------------------------------------
        /// <summary>
        /// fdInfo --- 字段信息
        /// </summary>
        [Display(Name = "字段信息")]
        public string fdInfo { get; set; }
        //--------------------------------------------------------------------------
        /// <summary>
        /// fdType --- 字段类型
        /// </summary>
        [Display(Name = "字段类型")]
        public string fdType { get; set; }
        //--------------------------------------------------------------------------
        /// <summary>
        /// fdLength --- 字段长度
        /// </summary>
        [Display(Name = "字段长度")]
        public int fdLength { get; set; }
        //--------------------------------------------------------------------------
        /// <summary>
        /// is_nullable --- 是否可空
        /// </summary>
        [Display(Name = "是否可空")]
        public bool is_nullable { get; set; }
        //--------------------------------------------------------------------------
    }
}
