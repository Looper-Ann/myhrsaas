<template lang="">
  <el-dialog :title="showTitle" :visible="showDialog" @close="closeDialog">
    <el-form ref="deptForm" :model="form" :rules="rules">
      <el-form-item label="部门名称" label-width="120px" prop="name">
        <el-input v-model="form.name" placeholder="1-50个字符" style="width: 80%" />
      </el-form-item>
      <el-form-item label="部门编码" label-width="120px" prop="code">
        <el-input v-model="form.code" placeholder="1-50个字符" style="width: 80%" />
      </el-form-item>
      <el-form-item label="部门负责人" label-width="120px" prop="manager">
        <el-select v-model="form.manager" placeholder="请选择" style="width: 80%" @focus="getEmployeesList">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.username"
            :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" label-width="120px" prop="introduce">
        <el-input v-model="form.introduce" placeholder="1-50个字符" type="textarea" :rows="3" style="width: 80%" resize="none" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-row type="flex" justify="center">
          <el-button size="small" @click="closeDialog">取 消</el-button>
          <el-button type="primary" size="small" @click="onSubmit">确 定</el-button>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartmentsList, getDepartmentDetailById, updateDepartmentDetailById } from '@/api/departments'
import { getEmployeesSimple } from '@/api/employees'
import { addDepartments as addDeptAPI } from '@/api/departments'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: true
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = async (rule, value, callback) => {
      // value 是部门名称，要去和同级部门下的部门作比较，有没有相同的，如果有 不能通过，否则通过
      const { depts } = await getDepartmentsList()
      let isRepeat = false
      // 找同级部门下有没有和 value 相同的数据
      if (this.form.id) {
        isRepeat = depts.filter(el => el.pid === this.form.pid && el.id !== this.form.id).some(el => el.name === value)
      } else {
        isRepeat = depts.filter(el => el.pid === this.treeNode.id).some(el => el.name === value)
      }
      isRepeat ? callback(new Error(`同级下已存在${value}`)) : callback()
    }
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartmentsList()
      let isRepeat = false
      if (this.form.id) {
        isRepeat = depts.some(el => el.code === value && el.id !== this.form.id)
      } else {
        isRepeat = depts.some(el => el.code === value)
      }
      isRepeat ? callback(new Error(`已存在改部门代码:${value}`)) : callback()
    }
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称为必填项', trigger: 'blur' },
          { min: 1, max: 50, message: '最小长度为1最大长度为50', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门代码为必填项', trigger: 'blur' },
          { min: 1, max: 50, message: '最小长度为1最大长度为50', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [{ required: true, message: '部门负责人为必填项', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍为必填项', trigger: 'blur' },
          { min: 1, max: 300, message: '最小长度为1最大长度为300', trigger: 'blur' }
        ]
      },
      options: [],
      title: '新增部门'
    }
  },
  computed: {
    showTitle() {
      return this.form.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    onSubmit() {
      this.$refs.deptForm.validate(async valid => {
        if (valid) {
          if (this.form.id) {
            await updateDepartmentDetailById(this.form)
          } else {
            await addDeptAPI({ ...this.form, pid: this.treeNode.id })
          }
          this.$emit('update:showDialog', false)
          this.$emit('onAddSuccess')
        }
      })
    },
    async getEmployeesList() {
      const res = await getEmployeesSimple()
      this.options = res
    },
    closeDialog() {
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      this.$refs.deptForm.resetFields()
    },
    async getDepartmentDetail(param) {
      const res = await getDepartmentDetailById(param)
      this.form = res
    }
  }
}
</script>
