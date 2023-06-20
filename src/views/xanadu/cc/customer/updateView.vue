<template>
    <div class="app-container">
        <el-form ref="form" :model="customer" :rules="rule" label-width="110px">
            <el-form-item label="客户编号" prop="id" align="center" width="100">
                <el-input v-model="customer.id" disabled />
            </el-form-item>
            <el-form-item label="客户名称" prop="name" width="100" align="center">
                <el-input v-model="customer.name" />
            </el-form-item>
            <el-form-item label="身份证号" prop="identityCard" width="100" align="center">
                <el-input v-model="customer.identityCard" />
            </el-form-item>
            <!-- 级联选择 -->
            <el-form-item label="收货地址" prop="address" width="100" align="center">
                <el-input v-model="customer.address" />
            </el-form-item>
            <el-form-item label="联系电话" prop="telephone" width="100" align="center">
                <el-input v-model="customer.telephone" />
            </el-form-item>
            <el-form-item label="工作单位" prop="organization" width="100" align="center">
                <el-input v-model="customer.organization" />
            </el-form-item>
            <el-form-item label="邮政编码" prop="postcode" width="100" align="center">
                <el-input v-model="customer.postcode" />
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item class="sumbit">
                <el-button type="primary" @click="submit">提交</el-button>
                <el-button type="primary" @click="() => this.customer = JSON.parse(JSON.stringify(this.originCustomer))">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { createCustomer, updateCustomer } from '@/api/cc-customer'

export default {
    name: "editCustomer",
    props: ['originCustomer', 'title'],
    data() {
        return {
            customer:JSON.parse(JSON.stringify(this.originCustomer)),
            rule: {
                name:{
                        required: true,
                        message: '请输入客户姓名',
                        trigger: 'blur'
                    },
                    address   :{
                        required: true,
                        message: '请输入收货地址',
                        trigger: 'blur'
                    }, 
                telephone: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },
                    // {
                    //     pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
                    //     pattern:/^((13[0-9])|(14[579])|(15([0-3]|[5-9]))|(16[56])|(17[0-8])|(18[0-9])|(19[1589]))[0-9]{8}$/,
                    //     message: '手机号格式不对',
                    //     trigger: 'blur'
                    // }
                ],
                identityCard: [
                    { required: true, message: '请填写证件号码', trigger: 'blur' },
                    // {
                    //     pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                    //     message: '证件号码格式有误！',
                    //     trigger: 'blur'
                    // }
                ]
            }
        }
    },
    methods: {
        submit() {
            console.log(this.customer)
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let fun = this.title === "新增客户" ? createCustomer : updateCustomer
                    fun(this.customer).then(res => {
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            duration:1000,
                        })
                        this.$emit('hideUpdateView')
                    }).catch(err => {
                        console.log(err)
                    })
                }else{
                    this.$modal.alertWarning("输入不合法");
                }
            })
        },
    },
}
</script>