<template lang="">
  <el-dialog title="新增员工" :visible="show" @close="handleClose">
    <el-form ref="addEmployee" :model="form" :rules="rules">
      <el-form-item label="姓名:" label-width="100px" prop="username">
        <el-input v-model="form.username" style="width: 50%" />
      </el-form-item>
      <el-form-item label="手机号:" label-width="100px" prop="mobile">
        <el-input v-model="form.mobile" style="width: 50%" />
      </el-form-item>
      <el-form-item label="聘用形式:" label-width="100px" prop="formOfEmployment">
        <el-select v-model="form.formOfEmployment" placeholder="请选择" style="width: 50%">
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号:" label-width="100px" prop="workNumber">
        <el-input v-model="form.workNumber" style="width: 50%" />
      </el-form-item>
      <el-form-item label="组织名称:" label-width="100px" prop="departmentName">
        <el-input v-model="form.departmentName" style="width: 50%" placeholder="请选择" @focus="getDeptsList" />
        <el-tree v-if="showTree" :data="treeData" :props="defaultProps" default-expand-all style="width: 50%" @node-click="selectDept" />
      </el-form-item>
      <el-form-item label="入职时间:" label-width="100px" prop="timeOfEntry">
        <el-date-picker
          v-model="form.timeOfEntry"
          type="date"
          placeholder="选择日期"
          style="width: 50%" />
      </el-form-item>
      <el-form-item label="转正时间:" label-width="100px" prop="correctionTime">
        <el-date-picker
          v-model="form.correctionTime"
          type="date"
          placeholder="选择日期"
          style="width: 50%" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleAddEmployee">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addEmployee } from '@/api/employees'
import { getDepartmentsList } from '@/api/departments'
import hireType from '@/api/constant/employees'
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, trigger: 'blur', message: '用户姓名为1-4位' }
        ],
        mobile: [
          { required: true, message: '用户手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门名称不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }]
      },
      hireType: hireType.hireType,
      pickerOptions: {
        end: Date.now()
      },
      treeData: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showTree: false
    }
  },
  methods: {
    handleClose() {
      this.form = {
        username: '',
        mobile: '',
        formOfEmployment: 0,
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields()
      this.$emit('update:show', false)
    },
    handleAddEmployee() {
      this.$refs.addEmployee.validate(async valid => {
        if (valid) {
          const res = await addEmployee(this.form)
          console.log(res)
          this.$message.success('操作成功!')
          this.$emit('update:show', false)
          this.$parent.getEmployeesList()
        }
      })
    },
    async getDeptsList() {
      const { depts } = await getDepartmentsList()
      function arrayToTree(list, rootId) {
        const arr = []
        list.forEach(element => {
          if (element.pid === rootId) {
            const children = arrayToTree(list, element.id)
            if (children.length) {
              element.children = children
            }
            arr.push(element)
          }
        })
        return arr
      }
      const arr = arrayToTree(depts, '')
      console.log(arr)
      this.treeData = arr
      this.showTree = true
    },
    selectDept(data) {
      this.form.departmentName = data.name
      this.showTree = false
    }
  }
}
</script>
