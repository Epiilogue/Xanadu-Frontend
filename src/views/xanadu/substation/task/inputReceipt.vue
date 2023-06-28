<template>
    <div class="container">
        <!-- 回执信息 -->
        <el-card class="box-card" shadow="always">
            <div slot="header" class="clearfix">
                <span>回执信息</span>
            </div>
            <el-form ref="form" :model="form" :rules="rule" label-width="120px">
                <el-form-item label="任务编号">
                    <el-input v-model="form.taskId" disabled/>
                </el-form-item>
                <el-form-item label="任务完成情况">
                    <el-select v-model="form.state">
                        <el-option v-for="item of (payment? paymentStateOption:stateOption)" :label="item" :value="item" :key="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签收时间">
                    <el-date-picker v-model="form.signTime" type="date" placeholder="签收时间" style="width: 100%" />
                </el-form-item>
                <el-form-item label="客户满意度">
                    <el-rate v-model="form.feedback" allow-half :max="10" show-score style="padding-top: 8px;"></el-rate>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" type="textarea" />
                </el-form-item>
            </el-form>
        </el-card>
        <!-- 商品信息 -->
        <!-- 合计 -->
        <el-card class="box-card" shadow="always" v-if="!payment">
            <div slot="header" class="clearfix">
                <span>商品信息</span>
            </div>
            <el-descriptions>
                <el-descriptions-item label="签收商品总数">{{
                    form.numbers
                }}</el-descriptions-item>
                <el-descriptions-item label="任务交易金额">{{
                    form.totalAmount
                }}</el-descriptions-item>
            </el-descriptions>
            <el-button @click="confirmPro">
                {{ confirm }}
            </el-button>
            <div>
                <el-table :key="0" :row-key="(row) => row.productId" :data="form.products" border fit highlight-current-row
                    style="width: 100%">
                    <el-table-column label="商品编号" prop="productId" align="center" width="100"></el-table-column>
                    <el-table-column label="商品名称" prop="productName" width="100" align="center">
                    </el-table-column>
                    <el-table-column label="商品大类" prop="productCategary" min-width="100" align="center">
                    </el-table-column>
                    <el-table-column label="单价" prop="price" width="100" align="center">
                    </el-table-column>
                    <el-table-column label="下单数量" prop="number" width="100" align="center">
                    </el-table-column>
                    <el-table-column label="签收数量" min-width="200" align="center" fixed="right">
                        <template slot-scope="{ row }">
                            <el-input-number ref="inputNumber" v-model="row.actualNumber" :min="0" :max="row.number" width="80"
                                size="small"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="能否退货" class-name="status-col" width="100">
                        <template slot-scope="{ row }">
                            <el-tag :type="row.refundAble ? 'success' : 'danger'">
                                {{ row.refundAble ? "可退货" : "不可退货" }}
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <div class="btn">
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="Return">返回</el-button>
        </div>
    </div>
</template>

<script>

import { fillPaymentReceipt, fillReceipt } from '@/api/sub-task'
export default {
    name:'Receipt',
    props:['payment'],
    data() {
        return {
            form: {
                taskId: undefined,
                taskType: '',
                state: '',
                signTime: '',
                feedback: 0,
                remark: '',
                numbers: 0,
                totalAmount: 0,
                products: [{ productId: undefined, productName: '', number: 0, price: 0, actualNumber: '', refundAble: '' }],
            },
            rule: {},
            // 回执填写的完成状态
            stateOption: ['成功', '失败', '部分完成'],
            paymentStateOption: ['成功', '失败'],
            ifShow: false,
            confirm: "确认",
            success:false, //提交成功
        };
    },
    created() {
        let task = this.$cache.local.getJSON("operateTask");
        console.log(task)
        this.form.taskId = task.id; // 任务编号
        this.form.taskType = task.taskType; // 任务类型
        // this.payment = this.form.taskType === '收款'
        if (this.payment) return
        let products = JSON.parse(task.productsJson)    //商品信息
        products.forEach(p => { //设置签收数量默认值
            p.actualNumber = p.number
        });
    },

    methods: {
        onSubmit() {
            // 表单校验
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    // 非收款任务需确认商品签收情况
                    if (!this.payment && this.confirm === '确认') {
                        this.$message({
                            type: 'error',
                            message: '请确认商品签收情况',
                            durarion: 1000,
                        });
                        return
                    }
                    // 根据任务类型确定回执录入接口
                    let opfun = new Function();
                    if (this.payment) opfun = fillPaymentReceipt;
                    else {
                        opfun = fillReceipt;
                    }
                    // 请求服务
                    opfun(this.form).then((res) => {
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            durarion: 1000,
                        });
                        this.success=true
                        this.Return()
                    });
                }
            });
        },
        // 返回
        Return() {
            // 清除缓存 
            this.$cache.local.remove("selectedProduct")
            // 回到任务主页
            this.$emit('close',this.success)
        },
        // 确认商品签收情况
        confirmPro() {
            if (this.confirm === '确认') {
                // 计算总数和总价
                this.form.numbers = this.form.products.reduce((sum, p) => sum + p.actualNumber,
                    0)
                this.form.totalAmount = this.form.products.reduce((sum, p) => sum + p.actualNumber*p.price,
                    0)
                // 禁用输入框
                this.$refs.inputNumber.disabled=true
                // 修改confirm
                this.confirm = '编辑'
            } else {
                // 总数和总价置0
                this.form.numbers = 0
                this.form.totalAmount = 0
                // 启用输入框
                this.$refs.inputNumber.disabled=false
                // 修改confirm
                this.confirm = '确认'
            }
        }
    },
};
</script>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.box-card {
  width: 85%;
  align-self: center;
  margin: 5px;
}

.btn {
  /* text-align: center; */
  display: flex;
  justify-content: space-around;
  margin: 0px 0px 5px;
}
</style>