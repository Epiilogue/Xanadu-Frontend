<template>
  <div class="custom-tree-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品分类</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="showDialog(null,'create')">添加父类
        </el-button>
      </div>
      <el-tree
        :data="category"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.category }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="showDialog(data,'append')"
            v-if="data.level==1"
          >
            添加子类
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >
            删除
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="showDialog(data,'edit')"
          >
            修改
          </el-button>
        </span>
      </span>
      </el-tree>
    </el-card>

    <div class="block">

      <el-dialog :title="dialogName" width="30%" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="分类名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="change(form.name,dialogName)">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>

import axios from 'axios'

let id = 1000

export default {
  data() {
    return {
      dialogName: '',
      currentNode: [],
      showForm: false,
      category: [],
      dialogFormVisible: false,
      form: {
        name: ''
      },
      formLabelWidth: '80px'
      //data: JSON.parse(JSON.stringify(data))
    }
  },

  created() {
    this.getCategory()
  },

  methods: {
    showDialog(data, flag) {
      this.dialogName = flag
      this.dialogFormVisible = true
      this.currentNode = data
    },
    getCategory() {
      let cate = []
      const that = this
      axios.get('dbc/categary/listAll')
        .then(function(res) {
          //that.category.push(res.data.data)
          that.category = res.data.data
        })
      //this.category = cate
    },

    change(data, name) {
      const that = this
      const node = this.currentNode
      console.log(node)
      if (name === 'create') {
        axios.post('dbc/categary/add', {
          category: data,
          level: 1,
          parentId: 0
        })
          .then(function() {
            that.getCategory()
          })
      } else if (name === 'append') {
        axios.post('dbc/categary/add', {
          category: data,
          level: node.level + 1,
          parentId: node.id
        })
          .then(function() {
            that.getCategory()
          })
      } else {
        axios.post('dbc/categary/update/', {
          id: node.id,
          category: data,
          level: data.level,
          parentId: data.id
        })
          .then(function(res) {
            that.getCategory()
          })
      }

      that.dialogFormVisible = false
    },

    remove(node, data) {
      console.log(node)
      const that = this
      if (!node.data.children) {
        axios.get(`dbc/categary/delete/${node.data.id}`)
          .then(function(res) {
            that.getCategory()
          })
      } else {
        this.$message.error('存在子节点，无法直接删除')
      }
    },

    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={() => this.change(data)}>Append</el-button>
              <el-button size="mini" type="text" on-click={() => this.remove(node, data)}>Delete</el-button>
            </span>
          </span>)
    }
  }
}
</script>

<style scoped>
.custom-tree-container {
  margin-left: 27%;
  padding-top: 3%;
}

.custom-tree-node {
  flex: 1;
  line-height: 80px;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  padding-right: 30px;
  margin-left: 30px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 800px;
  height: 800px;
  align-items: center;
}
</style>
