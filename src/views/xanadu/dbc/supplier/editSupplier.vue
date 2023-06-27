<template>
  <div>
    <div class="container">
      <!-- 供应商信息 -->
      <el-form ref="form" :rules="rule" :model="supplier" label-width="100px" label-position="left"
        style="min-width: 300px; margin-left: 50px">
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="supplier.name" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="supplier.address" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="supplier.contactPerson" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="supplier.phone" />
        </el-form-item>
        <el-form-item label="开户行" prop="bankAccount">
          <el-input v-model="supplier.bankAccount" />
        </el-form-item>
        <!-- <el-form-item label="创建日期" prop="contactPerson">
          <el-date-picker v-model="supplier.createTime" type="datetime" />
        </el-form-item>
        <el-form-item label="修改日期" prop="contactPerson">
          <el-date-picker v-model="supplier.updateTime" type="datetime" />
        </el-form-item> -->
        <el-form-item label="备注">
          <el-input v-model="supplier.remarks" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="sumbit">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button type="primary"
            @click="() => this.supplier = JSON.parse(JSON.stringify(this.originSup))">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 商品信息 -->
    <!-- 合计 -->
    <!-- <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>商品信息</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="handleSelectProduct"
          >
            查看商品列表</el-button
          >
        </div>
        <div style="display: none">
          {{ `修改次数:${proChanged}-${cusChanged}` }}
        </div>
        <div :v-if="this.ifShow">
          <el-table
            :key="0"
            :row-key="(row) => row.productId"
            :data="temp.products"
            border
            fit
            highlight-current-row
            style="width: 100%"
          >
            <div>商品信息</div>
            <el-button type="primary" @click="handleCreatePro"
              >新增商品</el-button
            >
            <el-table-column label="商品名称" width="100" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.productName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品大类" min-width="100" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.productCategary }}</span>
              </template>
            </el-table-column>
            <el-table-column label="一级分类ID" min-width="100" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.firstCategray }}</span>
              </template>
            </el-table-column>
            <el-table-column label="二级分类ID" min-width="100" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.secondCategray }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="100" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="成本" width="100" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.cost }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="能否退货"
              class-name="status-col"
              width="100"
            >
              <template slot-scope="{ row }">
                <el-tag :type="row.refundAble ? 'success' : 'danger'">
                  {{ row.refundAble ? "可退货" : "不可退货" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="能否换货"
              class-name="status-col"
              width="100"
            >
              <template slot-scope="{ row }">
                <el-tag :type="row.changeAble ? 'success' : 'danger'">
                  {{ row.changeAble ? "可换货" : "不可换货" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="100" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.comment }}</span>
              </template>
            </el-table-column>
            <el-table-column label="成本" width="100" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.cost }}</span>
              </template>
            </el-table-column>
            <el-table-column label="图片" width="100" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.picture }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div> -->

    <!-- 录入商品信息 -->
    <!-- <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        width="85%"
      >
        <el-form
          ref="proForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="70px"
          style="width: 400px; margin-left: 50px"
        >
          <el-form-item label="供应商名称" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="temp.address" />
          </el-form-item>
          <el-form-item label="联系人" prop="contactPerson">
            <el-input v-model="temp.contactPerson" />
          </el-form-item>
          <el-form-item label="联系电话" prop="contactPerson">
            <el-input v-model="temp.phone" />
          </el-form-item>
          <el-form-item label="开户行" prop="contactPerson">
            <el-input v-model="temp.bankAccount" />
          </el-form-item>
          <el-form-item label="创建日期" prop="contactPerson">
            <el-input v-model="temp.createTime" />
          </el-form-item>
          <el-form-item label="修改日期" prop="contactPerson">
            <el-input v-model="temp.updateTime" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="temp.remarks"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false"> Cancel </el-button>
          <el-button
            type="primary"
            @click="dialogStatus === 'create' ? createData() : updateData()"
          >
            Confirm
          </el-button>
        </div>
      </el-dialog> -->
  </div>
</div></template>

<script>
import { createSup, updateSup } from "@/api/dbc-supplier";
export default {
  name: "editSup",
  props: ['originSup', 'title'],
  data() {
    return {
      supplier: JSON.parse(JSON.stringify(this.originSup)),
      rule: {
        name: {
          required: true,
          message: '请输入供应商名称',
          trigger: 'blur'
        },
        address: {
          required: true,
          message: '请输入地址',
          trigger: 'blur'
        },
        phone: {
          required: true,
          message: '请输入联系电话',
          trigger: 'blur'
        },
      },
    }
  },
  methods: {
    submit() {
      console.log(this.customer)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let fun = this.title === "create" ? createSup : updateSup
          fun(this.supplier).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1000,
            })
            this.$emit('hideUpdateView')
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$modal.alertWarning("输入不合法");
        }
      })
    },
  },

}
</script>
