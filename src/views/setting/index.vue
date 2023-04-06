<template lang="">
  <div class="setting-container">
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-row>
            <el-button type="primary" class="addBtn" @click="showDialog = true">新增角色</el-button>
          </el-row>
          <el-table v-loading="loading" :data="tableData" border style="width: 100%">
            <el-table-column type="index" label="序号" :width="120" align="center" />
            <el-table-column prop="name" label="名称" :width="240" align="center" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" align="center">
              <template slot-scope="{ row }">
                <el-button size="small" type="success" @click="assignPermission(row.id)">分配权限</el-button>
                <el-button size="small" type="primary" @click="handleEdit(row.id)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center" align="middle" style="height: 60px">
            <!-- 分页组件 -->
            <el-pagination layout="prev,pager,next" :page-size="pageOptions.pagesize" :current-page="pageOptions.page" :total="pageOptions.total" @next-click="handleNextPage" @prev-click="handlePrevPage" @current-change="handleChangePage" />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon />
          <el-form class="companyForm" :model="companyForm" disabled>
            <el-form-item label="公司名称" label-width="120px">
              <el-input v-model="companyForm.name" style="width: 400px" />
            </el-form-item>
            <el-form-item label="公司地址" label-width="120px">
              <el-input v-model="companyForm.companyAddress" style="width: 400px" />
            </el-form-item>
            <el-form-item label="邮箱" label-width="120px">
              <el-input v-model="companyForm.mailbox" style="width: 400px" />
            </el-form-item>
            <el-form-item label="备注" label-width="120px">
              <el-input v-model="companyForm.remarks" style="width: 400px" type="textarea" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :title="roleTitle" :visible="showDialog" @close="handleDialogClose">
      <el-form ref="roleForm" :model="roleForm" :rules="roleRules">
        <el-form-item prop="name" label="角色名称" label-width="100px">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item prop="description" label="角色描述" label-width="100px">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmitEdit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="permissionDialogVisible" @close="handlePermDialogCancel">
      <el-tree ref="permissionTree" :data="permissionTree" node-key="id" show-checkbox :check-strictly="true" :default-checked-keys="selectCheck" :props="{ label: 'name', children: 'children' }" default-expand-all> </el-tree>
      <div slot="footer">
        <el-button @click="handlePermDialogCancel">取 消</el-button>
        <el-button type="primary" @click="handlePermDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList as getRoleListAPI, delRoleById, getRoleById, updateRole, createRole, assignRole } from '@/api/roles'
import { getCompanyById } from '@/api/company'
import { getPermissionList } from '@/api/permission'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'first',
      tableData: [],
      pageOptions: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      loading: false,
      companyForm: {},
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      roleRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      permissionDialogVisible: false,
      permissionTree: [],
      roleId: '',
      selectCheck: []
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    roleTitle() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      this.loading = true
      const { rows, total } = await getRoleListAPI(this.pageOptions)
      if (rows.length === 0 && this.pageOptions.page !== 1) {
        this.pageOptions.page--
        this.getRoleList()
        return
      }
      this.tableData = rows
      this.pageOptions.total = total
      console.log(rows)
      this.loading = false
    },
    async getCompanyInfo() {
      const res = await getCompanyById(this.companyId)
      this.form = res
    },
    handleNextPage() {
      this.pageOptions.page++
      this.getRoleList()
    },
    handlePrevPage() {
      this.pageOptions.page--
      this.getRoleList()
    },
    handleChangePage(currentPage) {
      this.pageOptions.page = currentPage
      this.getRoleList()
    },
    async handleDelete(id) {
      try {
        await this.$confirm('确认删除该角色吗?')
        await delRoleById(id)
        this.getRoleList()
        this.$message.success('删除成功!')
      } catch (error) {
        console.log(error)
      }
    },
    async handleEdit(id) {
      this.roleForm = await getRoleById(id)
      this.showDialog = true
    },
    handleDialogClose() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.showDialog = false
    },
    handleSubmitEdit() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          if (this.roleForm.id) {
            await updateRole(this.roleForm)
          } else {
            await createRole(this.roleForm)
          }
          this.getRoleList()
          this.showDialog = false
        }
      })
    },
    async getPermissionTree() {
      const res = await getPermissionList()
      console.log(res)
      function atot(array, ppointer) {
        const arr = []
        array.forEach(el => {
          if (el.pid === ppointer) {
            const children = atot(array, el.id)
            if (children.length) {
              el.children = children
            }
            arr.push(el)
          }
        })
        return arr
      }
      this.permissionTree = atot(res, '0')
    },
    async assignPermission(id) {
      this.roleId = id
      await this.getPermissionTree()
      const { permIds } = await getRoleById(id)
      console.log('perms:' + permIds)
      this.selectCheck = permIds
      this.permissionDialogVisible = true
    },
    handlePermDialogCancel() {
      this.roleId = ''
      this.selectCheck = []
      this.permissionDialogVisible = false
    },
    async handlePermDialogSubmit() {
      await assignRole({
        id: this.roleId,
        permIds: this.$refs.permissionTree.getCheckedKeys()
      }).then(res => {
        console.log(res)
        this.$message.success('操作成功!')
        this.permissionDialogVisible = false
      })
    }
  }
}
</script>
<style>
.addBtn {
  margin-bottom: 10px;
}

.companyForm {
  margin-top: 30px;
}

.pagination {
  margin-top: 10px;
}
</style>
