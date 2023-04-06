<template lang="">
  <div class="permission-container">
    <page-tools>
      <el-button slot="after" type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
    </page-tools>
    <el-table :data="authorityList" row-key="id" style="width: 100%" border :tree-props="{ children: 'children' }">
      <el-table-column prop="name" sortable align="center" label="名称" width="width"></el-table-column>
      <el-table-column prop="code" align="center" label="标识" width="width"></el-table-column>
      <el-table-column prop="description" align="center" label="描述" width="width"></el-table-column>
      <el-table-column align="center" label="操作" width="width">
        <template v-slot="{ row }">
          <el-button v-if="row.type === 1" type="text" @click="addPermission(2, row.id)">添加</el-button>
          <el-button type="text" @click="handleEdit(row.id)">编辑</el-button>
          <el-button type="text" @click="handleDel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="showText" :visible.sync="dialogVisible" @close="handleClose">
      <el-form ref="authority" :model="formData" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="权限名称" style="width: 90%">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="权限标识" style="width: 90%">
          <el-input v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" style="width: 90%">
          <el-input v-model="formData.description"></el-input>
        </el-form-item>
        <el-form-item label="开启" style="width: 90%">
          <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-row type="flex" justify="center">
            <el-button size="small" type="primary" @click="handleSubmit">确认</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList, delPermissionById, addPermission, getPermission, updatePermission } from '@/api/permission'
export default {
  data() {
    return {
      authorityList: [],
      formData: {
        name: '',
        code: '',
        description: '',
        enVisible: 1,
        type: 0,
        pid: ''
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      dialogVisible: false
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getAuthorList()
  },
  methods: {
    async getAuthorList() {
      const res = await getPermissionList()
      function arrayToTree(list, pid) {
        const arr = []
        list.forEach(el => {
          if (el.pid === pid) {
            const children = arrayToTree(list, el.id)
            if (children.length) {
              el.children = children
            }
            arr.push(el)
          }
        })
        return arr
      }
      this.authorityList = arrayToTree(res, '0')
    },
    handleDel(id) {
      this.$confirm('确认要删除该权限点吗?')
        .then(() => {
          return delPermissionById(id)
        })
        .then(() => {
          this.$message.success('删除成功!')
          this.getAuthorList()
        })
    },
    handleClose() {
      this.formData = {
        name: '',
        code: '',
        description: '',
        enVisible: 1
      }
      this.$refs.authority.resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs.authority
        .validate()
        .then(() => {
          if (this.formData.id) {
            return updatePermission(this.formData)
          }
          return addPermission(this.formData)
        })
        .then(() => {
          this.$message.success('操作成功!')
          this.getAuthorList()
          this.handleClose()
        })
    },
    addPermission(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.dialogVisible = true
    },
    async handleEdit(id) {
      this.formData = await getPermission(id)
      this.dialogVisible = true
    }
  }
}
</script>
