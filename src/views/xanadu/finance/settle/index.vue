<template>
  <div class="app-container" >
    <!--  上方表单  -->
    <el-form :model="form" ref="elForm" :rules="rules" size="small"  label-width="68px" :inline="true">
        <el-form-item label="开始时间" prop="startTime" label-width="80px">
            <el-col>
              <el-date-picker type="date" placeholder="选择日期" v-model="form.startTime" style="width: 100%;"></el-date-picker>
            </el-col>
        </el-form-item>
        <el-form-item label="结束时间" prop="startTime" label-width="80px">
          <el-col>
            <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="供应商id" prop="supplierId" label-width="80px">
          <el-input v-model="form.supplierId"  placeholder="输入供应商id"
                    prefix-icon='el-icon-paperclip' width="120%"></el-input>
        </el-form-item>
      <el-form-item label="商品id" prop="productId">
        <el-input v-model="form.productId"  placeholder="输入商品id"
                  prefix-icon='el-icon-paperclip' width="120%"></el-input>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getList()" >    查询    </el-button>
        </el-form-item>
    </el-form>


    <!--  查询之前显示  -->
    <div v-if="open3">
      <el-result title="提示" subTitle="请先输入查询条件" >
        <template slot="extra">
          <el-button type="primary" size="medium">刷新</el-button>
        </template>
      </el-result>
    </div>

      <!--  查询之后显示结算信息列表  -->
    <div v-show="open2">
      <el-table :data="refundList" ref="refundTableRefs"
                border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
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
        <el-table-column label="单价" align="center" prop="price"  class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.price"/>
          </template>
        </el-table-column>
        <el-table-column label="供货数量" align="center" prop="supplyNum" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.supplyNum"/>
          </template>
        </el-table-column>
        <el-table-column label="退货数量" align="center" prop="returnNum" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.returnNum"/>
          </template>
        </el-table-column>
        <el-table-column label="支出还是退款" align="center" prop="settleType" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.settleType === '支出' ? 'process' : 'warning'"
              disable-transitions>{{scope.row.settleType}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="结算数量" align="center" prop="totalNum"  class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_settle_normal" :value="Math.abs(scope.row.totalNum)"/>
          </template>
        </el-table-column>
        <el-table-column label="结算金额" align="center" prop="finalPrice"  class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_settle_normal" :value="Math.abs((scope.row.supplyNum - scope.row.returnNum) * scope.row.price)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
      <!--  合计结算按钮  -->
      <div v-show="open2" style="display: flex">
        <el-button type="success" size="medium" @click="account" style="margin-top: 25px; margin-left: 40%"> 结算 </el-button>
        <el-button type="primary" size="medium" @click="getToList()" style="margin-top: 25px;">    查看已结算记录    </el-button>
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
            <dict-tag :options="dict.type.sys_settle_normal" :value="scope.row.supplyNum - scope.row.returnNum"/>
          </template>
        </el-table-column>
        <el-table-column label="支出还是退款" align="center" prop="settleType" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.settleType === '支出' ? 'process' : 'warning'"
              disable-transitions>{{scope.row.settleType}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="结算金额" align="center" prop="finalPrice"  class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_settle_normal" :value="(scope.row.supplyNum - scope.row.returnNum) * scope.row.price"/>
          </template>
        </el-table-column>
      </el-table>

      <el-form size="small"  label-width="68px" :inline="true" style="margin-top: 10px;margin-left: 390px">
        <el-form-item label="合计金额" prop="totalprice">
          <el-input v-model="Math.abs(this.totalprice) + '(' + this.Type + ')'"  placeholder="合计金额"
                    prefix-icon='el-icon-paperclip' width="120%"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" size="small" @click="submit" >确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <!-- 已结算列表   -->
    <el-dialog :visible.sync="open1" width="1080px" append-to-body>
      <el-table v-loading="loading" :data="this.alreadyform"
                border >
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
            <dict-tag :options="dict.type.sys_settle_normal" :value="Math.abs(scope.row.supplyNum - scope.row.returnNum)"/>
          </template>
        </el-table-column>
        <el-table-column label="结算金额" align="center" prop="finalPrice"  class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_settle_normal" :value="Math.abs((scope.row.supplyNum - scope.row.returnNum) * scope.row.price)"/>
          </template>
        </el-table-column>
        <el-table-column label="结算日期" align="center" prop="refundTime" class-name="small-padding fixed-width" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}-{h}:{m}:{s}') }}</span>
          </template>
        </el-table-column>
      </el-table>

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
      // 支出还是结算
      Type : undefined,
      // 表单
      form: {
        startTime: undefined,
        endTime: undefined,
        supplierId: undefined,
        productId: undefined
      },
      // 总条数
      total: 0,
      // 查询数据
      refundList: [],
      alreadyform: [],
      // 是否显示弹出层
      open1: false,
      open: false,
      open2: false,
      open3: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 选中的数据
      selectList: [],
      // 选中数据的总金额
      totalprice: 0,
      // 表单校验
      rules: {
        startTime: [{
          required: true,
          type: 'date',
          message: '请选择时间',
          trigger: 'blur'
        }],
        endTime: [{
          required: true,
          type: 'data',
          message: '请选择时间',
          trigger: 'blur'
        }],
        supplyId: [{
          required: true,
          message: '请输入供应商id',
          trigger: 'blur'
        }],
      },
    };
  },
  methods: {
    /** 查询供应列表 */
    getList() {
      console.log(this.form.startTime);
      console.log(this.form.supplierId);
      if (this.form.startTime === undefined ||this.form.supplierId === undefined){
        this.$message({
          message: "请检查查询条件",
          type: 'error'
        });
      }
      else {
        this.open3 = false;
        this.open2 = true;
        const that = this;
        this.loading = true;
        axios.get("http://localhost:8010/ac/supply/listToSettlement",{
          params: {
            supplierId: that.form.supplierId,
            startTime: that.form.startTime.toLocaleString(),
            endTime: that.form.endTime.toLocaleString(),
            productId: that.form.productId
          }
        }).then( function(res){
          that.$message({
            message: res.data.msg,
            type: 'success'
          });
          //代表请求成功之后处理
          console.log(res);
          that.total = res.data.data.length;
          that.refundList = res.data.data;
          that.loading = false;
        }).catch( function (err){
          //代表请求失败之后处理
          console.log (err);
        });
        that.reset();
      }
    },
    getToList() {
      const that = this
      that.open1 = true;
      axios.get("http://localhost:8010/ac/supply/listSettlement").then( function(res){
        //代表请求成功之后处理
        console.log(res);
        that.loading = false;
        that.alreadyform = res.data.data;
      }).catch( function (err){
        that.$message({
          message: '查询失败',
          type: 'error'
        });
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
      this.refundList = undefined;
      this.resetForm("refundList");
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
      this.totalprice = 0;
      this.selectList = this.$refs.refundTableRefs.selection;
      let i = 0;
      while(i < this.selectList.length){
          this.totalprice += (this.selectList[i].supplyNum - this.selectList[i].returnNum) * this.selectList[i].price;
          i = i + 1;
      }
      if(this.totalprice > 0){
        this.Type = '支出'
      }
      else{
        this.Type = '退款'
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
        const that = this;
        let j = 0;
        while(j < this.selectList.length){
          // 向后端发送数据
          axios.post("http://localhost:8010/ac/supply/postSettlement",that.selectList)
            .then(function(){
              console.log(that.selectList);
              that.$message({
                message: '结算成功',
                type: 'success'
              });
              that.reset();
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
