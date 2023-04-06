<template lang="">
  <el-dialog title="分配角色" :visible="showRolePannel" @close="handleClose">
    <el-checkbox-group v-model="roleIds" v-loading="loading">
      <el-checkbox v-for="(item, id) in checkList" :key="id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-row type="flex" justify="center">
          <el-button size="small" type="primary" @click="handleAssign">确认</el-button>
          <el-button size="small" @click="handleClose">取消</el-button>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getRoleList as getRoleListAPI } from '@/api/roles.js'
import { getUserDetailById, assignRoleById } from '@/api/user.js'
export default {
  props: {
    showRolePannel: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null,
      required: true
    }
  },
  data() {
    return {
      checkList: [],
      roleIds: [],
      loading: false
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      this.loading = true
      const { rows } = await getRoleListAPI({ page: 1, pagesize: 9999 })
      this.checkList = rows
      this.loading = false
    },
    async getRoleIdList(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    handleClose() {
      this.$emit('update:showRolePannel', false)
      this.roleIds = []
    },
    async handleAssign() {
      await assignRoleById({ id: this.userId, roleIds: this.roleIds })
      this.$message.success('操作成功')
      this.handleClose()
    }
  }
}
</script>
<style lang=""></style>
