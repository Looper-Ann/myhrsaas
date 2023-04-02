<template lang="">
  <div class="employees-container">
    <page-tools :show-before="true">
      <span slot="before">共{{ total }}条数据</span>
      <div slot="after">
        <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
        <el-button size="small" type="danger" @click="handleExportExcel">excel导出</el-button>
        <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
      </div>
    </page-tools>
    <el-card>
      <el-table v-loading="loading" :data="tableData">
        <el-table-column type="index" label="序号" sortable="" />
        <el-table-column prop="username" label="姓名" sortable="" />
        <el-table-column label="头像">
          <template slot-scope="{ row }">
            <div class="avatar-wrap">
              <img v-imageerror="require('@/assets/common/bigUserHeader.png')" style="width: 100px; height: 100px" :src="row.staffPhoto" @click="handleQRCode(row.staffPhoto)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="workNumber" label="工号" sortable="" />
        <el-table-column prop="mobile" label="手机号" sortable="" />
        <el-table-column prop="formOfEmployment" label="聘用形式" sortable="" :formatter="formatEmployment" />
        <el-table-column prop="departmentName" label="部门" sortable="" />
        <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
          <template slot-scope="{ row }">
            <div v-if="row.timeOfEntry">
              {{ row.timeOfEntry | formatDate }}
            </div>
            <div v-else>未知</div>
          </template>
        </el-table-column>
        <el-table-column prop="enableState" label="账户状态" sortable="">
          <template slot-scope="{ row }">
            <el-switch :value="Number(row.enableState)" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <div class="btn-wrap">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination layout="prev, pager, next" :page-size="page.size" :current-page="page.page" :total="total" @current-change="pageChange" />
      </el-row>
    </el-card>
    <AddEmpolyee :show.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showQRCode">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from '@/filters'
import { getEmployeesList as getEmployeesListAPI, delEmployee as delEmployeeAPI } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmpolyee from './components/add-employee.vue'
import Qrcode from 'qrcode'
// import xlsx from 'xlsx'
export default {
  components: { AddEmpolyee },
  data() {
    return {
      tableData: [],
      page: {
        page: 1,
        size: 10
      },
      total: 0,
      loading: false,
      showDialog: false,
      showQRCode: false
    }
  },
  created() {
    this.getEmployeesList()
  },
  methods: {
    async getEmployeesList() {
      this.loading = true
      const { rows, total } = await getEmployeesListAPI(this.page)
      if (rows.length === 0 && this.page.page > 1) {
        this.page.page--
        this.getEmployeesList()
        return
      }
      this.tableData = rows
      this.total = total
      this.loading = false
    },
    pageChange(page) {
      this.page.page = page
      this.getEmployeesList()
    },
    formatEmployment(row, column, cellValue, index) {
      const res = EmployeeEnum.hireType.find(el => el.id === Number(cellValue))
      return res ? res.value : '未知'
    },
    async delEmployee(id) {
      try {
        await this.$confirm('确认要删除此员工吗?')
        console.log(id)
        await delEmployeeAPI(id)
        this.$message.success('删除成功')
        this.getEmployeesList()
      } catch (error) {
        console.log(error)
        this.$message.fail('删除失败')
      }
    },
    handleExportExcel() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel.js').then(async excel => {
        const { rows } = await getEmployeesListAPI({ page: 1, size: this.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          multiHeader,
          filename: '员工信息表',
          merges
        })
      })
    },
    formatJson(headers, rows) {
      return rows.map(el => {
        return Object.keys(headers).map(item => {
          if (headers[item] === 'timeOfEntry' || headers[item] === 'correctionTime') {
            return formatDate(el[headers[item]])
          } else if (headers[item] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === Number(el[headers[item]]))
            return obj ? obj.value : '未知'
          } else {
            return el[headers[item]]
          }
        })
      })
    },
    handleQRCode(url) {
      if (url) {
        this.showQRCode = true
        this.$nextTick(() => {
          Qrcode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户未上传头像!')
      }
    }
  }
}
</script>
<style lang="scss">
.avatar-wrap {
  height: 100px;
  width: 100px;
  border-radius: 50px;
  overflow: hidden;
}
</style>
