<template>
    <div class="app-container">
        <el-steps class="steps" :active="active" finish-status="success">
            <!-- wait / process / error / success / finish -->
            <el-step v-for="item, index in steps" :title="item.title" :status="getStatus(index)" v-if="!item.disabled">
            </el-step>
        </el-steps>
        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    </div>
</template>

<script>

export default {
    created() {
        // 换成自己计算比较好
        this.getStep()
        // 任务信息
        // this.task = {};
    },
    data() {
        return {
            steps: [{ title: "分配任务", disabled: false }, { title: "取货", disabled: false }, { title: "回执录入", disabled: false }],
            active: 0,
            task: {
                taskType: '收款',
                taskStatus: '已分配',
            },
        }
    },
    methods: {
        next() {
            if (this.active++ > 2) this.active = 0;
        },
        // 步骤条状态
        getStatus(index) {
            if (index < this.active)
                return 'success'
            if (index === this.active)
                return 'process'
            return 'wait'
        },
        /**
         * '收款', '退货'任务不需要取货
         * "分配任务" 1.可分配 + 收款 退货、2.已调度 + 送货收款 送货 换货
         * "取货" 已分配 + 送货收款 送货 换货
         * "回执录入" 1.已分配+收款 退货  2.已领货+送货收款 送货 换货
        */
        getStep() {
            let active = 0
            if (this.task.taskType === '收款' || this.task.taskType === '退货') {
                // 隐藏取货步骤条
                this.steps[1].disabled = true
                // 计算当前进度
                switch (this.task.taskStatus) {
                    case '可分配':
                        active = 0
                        break;
                    case '已分配':
                        active = 2
                        break;
                }
            } else if (this.task.taskType === '送货收款' || this.task.taskType === '送货' || this.task.taskType === '换货') {
                // 计算当前进度
                switch (this.task.taskStatus) {
                    case '已调度':
                        active = 0
                        break;
                    case '已分配':
                        active = 1
                        break;
                    case '已领货':
                        active = 2
                        break;
                }
            }
            this.active=active 
        }
    },
}
</script>

<style scoped>
.steps{
    width: 50%;
    text-align: center;
}
</style>