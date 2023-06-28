<template>
    <div class="app-container">
        <!-- 步骤条 -->
        <el-steps :active="active === 3 ? 2 : active" align-center>
            <!-- wait / process / error / success / finish -->
            <el-step v-for="item, index in steps" :title="item.title" :key="item.key" :status="getStatus(index)"
                v-if="!item.disabled" @click.native="ChangeView(item.key)">
            </el-step>
        </el-steps>
        <!-- 表单内容 -->
        <!-- 分配任务页面 -->
        
        <!-- 取货页面 -->
        <!-- 回执录入页面 -->
    </div>
</template>

<script>

export default {
    created() {
        // 获取任务信息
        // this.task = {};
        // 计算任务进度
        this.getStep()
    },
    data() {
        return {
            steps: [{ title: "分配任务", key: 0, disabled: false }, { title: "取货", key: 1, disabled: false }, { title: "回执录入", key: 2, disabled: false }],
            active: 0,  //正在进行的步骤,3表示已完成
            current: 0,  //当前展示的页面
            task: {
                taskType: '送货收款',
                taskStatus: '已调度',
            },
        }
    },
    methods: {
        // 步骤条状态
        getStatus(index) {
            if (this.active === 3)
                return 'finish'
            if (index < this.active)
                return 'success'
            if (index === this.active)
                return 'process'
            return 'wait'
        },
        /**
         * 计算任务进度
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
                    case '可分配':
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
            // 计算当前进度
            switch (this.task.taskStatus) {
                case '成功':
                case '失败':
                case '部分完成':
                    active = 3
                    break;
            }
            this.active = active
            this.current = active
        },
        // 点击步骤条，切换视图
        ChangeView(key) {
            if (key > this.active) {
                // 请先完成当前流程
                return
            } else if (key === this.active) {
                // 不需要切换视图
                return
            }
            console.log(key)
            this.current = key
            // switch (key) {
            //     // 展示分配任务页面
            //     case 0:
            //         break;
            //     // 展示取货页面
            //     case 1:
            //         break;
            //     // 展示回执录入页面
            //     case 2:
            //         break;
            // }
        }
    },
    computed: {

    }
}
</script>

<style >
.el-step__head:hover {
    color: #67c23a;
    border-color: #67c23a;
}
</style>