<template lang="">
  <div v-loading="loading" class="departments-container">
    <!-- 组织架构内容 -->
    <el-card class="tree-card">
      <!-- 结构内容 -->
      <tree-tools :tree-node="company" :is-root="true" @addDept="handleAdd" />
      <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
        <!-- 传入内容 插槽内容 会循环多次 有多少节点就循环多少次 -->
        <!-- 作用域插槽 -->
        <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDeparts" @addDept="handleAdd" @editDept="handleEdit" />
      </el-tree>
    </el-card>
    <add-department :ref="'adddept'" :show-dialog.sync="showDialog" :tree-node="node" @hideDialog="showDialog=false" @onAddSuccess="getDeparts" />
  </div>
</template>
<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartmentsList } from '@/api/departments'
import { transListToTreeData } from '@/utils/index'
import AddDepartment from './components/add-department.vue'
export default {
  components: {
    TreeTools,
    AddDepartment
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showDialog: false,
      node: null,
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },
  created() {
    this.getDeparts()
  },
  methods: {
    async getDeparts() {
      this.loading = true
      try {
        const result = await getDepartmentsList()
        this.company = {
          name: result.companyName,
          manager: result.companyManage,
          id: ''
        }
        this.departs = transListToTreeData(result.depts, '')
      } catch (err) {
        this.$message.error('获取信息失败')
      }
      this.loading = false
    },
    handleAdd(tnode) {
      this.showDialog = true
      this.node = tnode
    },
    handleEdit(tnode) {
      this.showDialog = true
      this.node = tnode
      this.$refs.adddept.getDepartmentDetail(this.node.id)
    }
  }
}
</script>
<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
