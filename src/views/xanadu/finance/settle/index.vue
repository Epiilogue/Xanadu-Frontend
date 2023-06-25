<template>
  <div class="app-container" >
    <!--  上方表单  -->
    <el-form :model="form" ref="elForm" :rules="rules" size="small"  label-width="68px" :inline="true">
        <el-form-item label="开始时间" prop="startTime">
            <el-col>
              <el-date-picker type="date" placeholder="选择日期" v-model="form.startTime" style="width: 100%;"></el-date-picker>
            </el-col>
        </el-form-item>
        <el-form-item label="结束时间" prop="startTime">
          <el-col>
            <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="供应商id" prop="supplyId">
          <el-input v-model="form.supplyId"  placeholder="输入供应商id"
                    prefix-icon='el-icon-paperclip' width="120%"></el-input>
        </el-form-item>
          <el-form-item label="结算状态" prop="status" >
            <el-select v-model="form.status" placeholder="结算状态" clearable>
              <el-option
                v-for="dict in options"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList()" >    查询    </el-button>
          </el-form-item>
    </el-form>

    <!--  结算信息列表  -->
    <el-table v-loading="loading" :data="refundList" ref="refundTableRefs"
               border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" width="50" class-name="small-padding fixed-width"/>
      <el-table-column label="供应商id" align="center" prop="supplierId" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.supplierId"/>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" prop="productName" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.productName"/>
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center" prop="productPrice"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.productPrice"/>
        </template>
      </el-table-column>
      <el-table-column label="供货数量" align="center" prop="inputNum" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.inputNum"/>
        </template>
      </el-table-column>
      <el-table-column label="退货数量" align="center" prop="refundCount" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.refundCount"/>
        </template>
      </el-table-column>
      <el-table-column label="结算数量" align="center" prop="finalcount"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.inputNum - scope.row.refundCount"/>
        </template>
      </el-table-column>
      <el-table-column label="结算金额" align="center" prop="finalPrice"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_settle_normal" :value="(scope.row.inputNum - scope.row.refundCount) * scope.row.productPrice"/>
        </template>
      </el-table-column>
      <el-table-column label="结算状态" align="center" prop="status" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === '已结算' ? 'success' : 'warning'"
            disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="日期" align="center" prop="refundTime" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.refundTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--  合计结算  -->
    <div style="display: flex">
      <el-button type="success" size="medium" @click="account" style="margin-top: 25px; margin-left: 45%"> 结算 </el-button>
      <div style="margin-left: 44%">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>


    <!--合计结算窗口-->
    <el-dialog :visible.sync="open" width="780px" append-to-body>
      <el-table v-loading="loading" :data="this.selectList"
                border >
        <el-table-column label="序号" align="center" prop="id" width="50" class-name="small-padding fixed-width"/>
        <el-table-column label="供应商id" align="center" prop="supplierId" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.supplierId"/>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center" prop="productName" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.productName"/>
          </template>
        </el-table-column>
        <el-table-column label="结算数量" align="center" prop="finalcount"  class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.inputNum - scope.row.refundCount"/>
          </template>
        </el-table-column>
        <el-table-column label="结算金额" align="center" prop="finalPrice"  class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_settle_normal" :value="(scope.row.inputNum - scope.row.refundCount) * scope.row.productPrice"/>
          </template>
        </el-table-column>
        <el-table-column label="结算状态" align="center" prop="status" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '已结算' ? 'success' : 'warning'"
              disable-transitions>{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="日期" align="center" prop="refundTime" class-name="small-padding fixed-width" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.refundTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-form size="small"  label-width="68px" :inline="true" style="margin-top: 10px;margin-left: 390px">
        <el-form-item label="合计金额" prop="totalprice">
          <el-input v-model="this.totalprice"  placeholder="合计金额"
                    prefix-icon='el-icon-paperclip' width="120%"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" size="small" @click="submit" >结算</el-button>
        </el-form-item>
      </el-form>



    </el-dialog>

  </div>

</template>

<script>

import axios from 'axios'

export default {
  name: "RegisInvoice",
  dicts: ['sys_settle_normal'],
  props: [],
  data: function () {
    return {
      //发票状态
      options: [{
        value: '选项1',
        label: '已结算'
      }, {
        value: '选项2',
        label: '未结算'
      }],
      // 显示搜索条件
      showSearch: true,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 表单
      form: {},
      // 总条数
      total: 0,
      // 发票表格数据
      refundList: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: undefined,
      },
      // 选中的数据
      selectList: [],
      // 选中数据的总金额
      totalprice: 0,
      // 表单校验
      rules: {
        startTime: [{
          type: 'date',
          message: '请选择时间',
          trigger: 'blur'
        }],
        endTime: [{
          type: 'data',
          message: '请选择时间',
          trigger: 'blur'
        }],
        supplyId: [{
          message: '请输入供应商id',
          trigger: 'blur'
        }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      const that = this
      this.loading = true;
      axios.get("http://localhost:8004/dbc/refund/list").then( function(res){
        //代表请求成功之后处理
        console.log(res);
        that.total = res.data.data.length;
        that.refundList = res.data.data;
        that.loading = false;
      }).catch( function (err){
        //代表请求失败之后处理
        console.log (err);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 表单重置
    reset() {
      this.form = undefined;
      this.resetForm("form");
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getListlimited();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    account(){
      this.selectList = this.$refs.refundTableRefs.selection;
      let i = 0;
      while(i < this.selectList.length){
        if(this.selectList[i].status === '未结算')
          this.totalprice += (this.selectList[i].inputNum - this.selectList[i].refundCount) * this.selectList[i].productPrice;
          i = i + 1;
      }
      if(this.selectList.length === 0){
        this.$message.error('请选择至少一条结算数据');
      }
      else {
        this.open = true;
      }
    },
    /** 提交按钮 */
    submit: function() {
      this.$confirm('您确定要结算吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let i = 0;
        while(i < this.selectList.length){
          this.selectList[i].status = '已结算';
          i = i + 1;
        }
        const that = this;
        let j = 0;
        while(j < this.selectList.length){
          // 向后端发送数据
          axios.post("http://localhost:8004/dbc/refund/update",that.selectList[j])
            .then(function(){
              console.log(that.selectList[j]);
              that.reset();R
            }).catch( function (err){
            //代表请求失败之后处理
            console.log (err);
            that.$message({
              message: '结算失败',
              type: 'error'
            });
          });
          j = j + 1;
        }  //while
        that.open = false;
      })
    }
  },
};
</script>
