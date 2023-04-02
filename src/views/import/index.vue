<template lang="">
  <div>
    <upload-excel :on-success="success" />
  </div>
</template>
<script>
import { importEmployees } from '@/api/employees.js'
export default {
  methods: {
    async success({ header, results }) {
      const userReflection = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber'
      }
      const newArr = results.map(el => {
        const userInfo = {}
        Object.keys(el).forEach(item => {
          if (userReflection[item] === 'timeOfEntry' || userReflection[item] === 'correctionTime') {
            userInfo[userReflection[item]] = this.formatDate(el[item], '/')
          } else {
            userInfo[userReflection[item]] = el[item]
          }
        })
        return userInfo
      })
      await importEmployees(newArr)
      this.$message.success('导入成功!')
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>
<style lang=""></style>
