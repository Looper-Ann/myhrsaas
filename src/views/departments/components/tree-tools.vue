<template lang="">
  <el-row type="flex" align="middle" style="height: 40px; width: 100%" justify="space-between">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <!-- 下拉菜单按钮 -->
            <span class="el-dropdown-link"> 操作 <i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单item -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add" :disabled="!checkPermission('add-dept')">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { removeDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async handleDelete() {
      try {
        const res = await removeDepartments(this.treeNode.id)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    operateDepts(command) {
      if (command === 'add') {
        this.$emit('addDept', this.treeNode)
      } else if (command === 'edit') {
        this.$emit('editDept', this.treeNode)
      } else {
        this.$confirm('您确定要删除当前部门吗?')
          .then(() => {
            return removeDepartments(this.treeNode.id)
          })
          .then(() => {
            this.$emit('delDepts')
            this.$message.success('删除成功')
          })
      }
    }
  }
}
</script>
