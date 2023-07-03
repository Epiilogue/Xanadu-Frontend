<template>
  <div>
    <el-card>
      <div class="block" style="margin-bottom:20px;">
        <el-date-picker
          v-model="value1"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"
        >
        </el-date-picker>
        <el-button style="margin-left: 20px" type="primary" @click="searchByDate(value1)">查询</el-button>
      </div>
      <el-table :data="tableData">
        <!-- Substation ID Column -->
        <el-table-column label="分站ID" prop="substationId"></el-table-column>

        <!-- Substation Name Column -->
        <el-table-column label="分站名称" prop="substationName"></el-table-column>

        <!-- Statistic Time Column -->
        <el-table-column label="统计时间" prop="statisticTime">
          <template slot-scope="{row}">
            <span>{{ timestampToTime()(row.statisticTime) }}</span>
          </template>
        </el-table-column>

        <!-- Receive Column -->
        <el-table-column label="收款额" prop="receive" :formatter="rounding"></el-table-column>

        <!-- Return Num Column -->
        <el-table-column label="退回数量" prop="returnNum"></el-table-column>

        <!-- Refund Column -->
        <el-table-column label="退款额" prop="refund" :formatter="rounding"></el-table-column>

        <!-- Delivery Fee Column -->
        <el-table-column label="配送费" prop="deliveryFee" :formatter="rounding"></el-table-column>

        <!-- To Pay Column -->
        <el-table-column label="待缴款" prop="toPay" :formatter="rounding"></el-table-column>

        <!-- Feedback Column -->
        <el-table-column label="今日满意度" prop="feedback" :formatter="rounding"></el-table-column>


        <el-table-column label="报表状态" min-width="50px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.isSettled ===false?'warning': 'success'">
              {{ row.isSettled === false ? '未结算' : '已结算' }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- Unfinished Tasks Column -->
        <el-table-column label="任务类型">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showTypeState(scope.row)">详情</el-button>
          </template>
        </el-table-column>

        <!-- Finished Tasks Column -->
        <el-table-column label="任务状态">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showTaskState(scope.row)">详情</el-button>
          </template>
        </el-table-column>

        <!-- Operation Button Column -->
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" :disabled="scope.row.isSettled === true"
                       @click="handleButtonClick(scope.row)"
            >
              结算
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog @open="open()" title="任务详情" :visible.sync="showState" height="800px" width="900px" append-to-body>
      <div id="chart-panel" style="height: 400px; width: 800px ;margin-left: 50px"></div>
    </el-dialog>

  </div>
</template>

<script>
import { dailyReportsByDate, generateSubstationStatistics, updateDailyReportStatus } from '@/api/sub'
import { timestampToTime } from '@/utils/ruoyi'
import * as echarts from 'echarts'
import moment from 'moment/moment'

export default {
  data() {
    return {
      value1: '',
      chartData: '',
      title: '',
      tableData: [], // Populate with your actual data
      showState: false,
      myChart: null
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    timestampToTime() {
      return timestampToTime
    },
    getList() {
      let date = this.formatDateString(new Date())
      dailyReportsByDate(date).then(res => {
        console.log(res)
        this.tableData = res.data
      })
    },
    formatDateString(date) {
      let year = date.getFullYear()
      let month = ('0' + (date.getMonth() + 1)).slice(-2)
      let day = ('0' + date.getDate()).slice(-2)
      let hours = ('0' + date.getHours()).slice(-2)
      let minutes = ('0' + date.getMinutes()).slice(-2)
      let seconds = ('0' + date.getSeconds()).slice(-2)

      var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
      return formattedDate
    },

    searchByDate(value) {
      dailyReportsByDate(value).then(res => {
        this.tableData = res.data
        console.log(res)
      })
    },

    handleButtonClick(row) {
      updateDailyReportStatus(row.id).then(res=>{
        row.isSettled = true
      })
      console.log('Button clicked for row:', row)
    },

    showTaskState(row) {
      // Handle the button click event for the corresponding row
      this.title = '任务状态'
      this.showState = true
      this.chartData = [
        { 'name': '失败任务数', 'value': row.failTaskNum },
        { 'name': '完成任务数', 'value': row.finishTaskNum },
        { 'name': '部分完成任务数', 'value': row.partFinishTaskNum }
      ]
      //console.log("Button clicked for row:", row);
    },
    showTypeState(row) {
      // Handle the button click event for the corresponding row
      this.title = '任务类型'
      this.showState = true
      this.chartData = [
        { 'name': '送货', 'value': row.deliveryTaskNum },
        { 'name': '收款', 'value': row.receiveTaskNum },
        { 'name': '送货收款', 'value': row.deliveryReceiveTaskNum },
        { 'name': '退货', 'value': row.returnTaskNum },
        { 'name': '换货', 'value': row.exchangeTaskNum }

      ]
      console.log(this.chartData)
    },
    init() {
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.chartData
          }
        ]
      }
      let newPromise = new Promise(resolve => {
        resolve()
      })
      newPromise.then(() => {
        this.myChart = echarts.init(document.getElementById('chart-panel'))
        if (option) {
          console.log(option)
          this.myChart.setOption(option)
        }
      })
    },
    rounding(row, column) {
      return parseFloat(row[column.property]).toFixed(2)
    },
    open() {
      this.$nextTick(() => {
        this.init()
      })
    }
  }
}
</script>
<style scoped>
#chart-panel {
  width: 500px;
  height: 400px;
}

.menu-dialog-height {

  height: 56%;

}
</style>
