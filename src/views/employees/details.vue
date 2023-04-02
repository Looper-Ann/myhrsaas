<template lang="">
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form ref="infoForm" label-width="120px" style="margin: 30px auto 0 120px" :model="userInfo" :rules="rules">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width: 300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUserInfo">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <UserInfoForm />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="userComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfoForm from './components/user-info.vue'
import JobInfoForm from './components/job-info.vue'
export default {
  components: {
    UserInfoForm,
    JobInfoForm
  },
  data() {
    return {
      userComponent: 'JobInfoForm',
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        userInfo: [{ required: true, trigger: 'blur', message: '姓名不能为空' }],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          {
            min: 6,
            max: 9,
            trigger: 'blur',
            message: '密码必须在6-16位之间'
          }
        ]
      }
    }
  },
  created() {
    this.getUserDetail()
  },
  methods: {
    async getUserDetail() {
      this.userInfo = await getUserDetailById(this.$route.params.id)
    },
    saveUserInfo() {
      this.$refs.infoForm.validate().then(async () => {
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2, password2: '' })
        this.$message.success('修改成功！')
      })
    }
  }
}
</script>
