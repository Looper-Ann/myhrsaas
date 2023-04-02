<template>
  <div>
    <el-upload list-type="picture-card" :file-list="fileList" :limit="1" action="#" :on-preview="handlePreview" :class="{ disabled: isFull }" :on-remove="handleRemove" :on-change="handleChange" :before-upload="beforeUpload" :http-request="upload">
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px" />
    <el-dialog title="图片预览" :visible.sync="showImage" width="50%">
      <div>
        <img :src="imgSrc" style="max-width: 100%; display: block; margin: 10px auto" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Cos from 'cos-js-sdk-v5'
const cos = new Cos({
  SecretId: 'AKIDMiy0ueHhZBYfW7TfcKo8ELD0dO6rqiOy',
  SecretKey: 'UjonY2IMCnb9VkpgNr10kETear47wXHx'
})
export default {
  data() {
    return {
      fileList: [],
      imgSrc: '',
      showImage: false,
      currentFileUid: '',
      percent: 0,
      showPercent: false
    }
  },
  computed: {
    isFull() {
      return this.fileList.length === 1
    }
  },
  methods: {
    handlePreview(file) {
      console.log(file)
      this.showImage = true
      this.imgSrc = file.url
    },
    handleRemove(f) {
      this.fileList = this.fileList.filter(el => el.uid !== f.uid)
    },
    handleChange(f, fl) {
      //  如果 当前fileList中没有当前文件就添加
      this.fileList = fl.map(el => el)
    },
    beforeUpload(f) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(f.type)) {
        this.$message.error('上传图片的格式只能是 JPG, GIF, BMP, PNG!')
        return false
      }
      const maxSize = 10 * 1024 * 1024
      if (f.size > maxSize) {
        this.$message.error('图片大小需要低于 10 Mb!')
        return false
      }
      this.currentFileUid = f.uid
      this.showPercent = true
      return true
    },
    upload(param) {
      cos.putObject(
        {
          Bucket: 'looper-1317156031',
          Region: 'ap-chengdu',
          Key: param.file.name,
          Body: param.file,
          StorageClass: 'STANDARD',
          onProgress: params => {
            this.percent = Math.floor(params.percent * 100)
          }
        },
        (err, data) => {
          if (!err && data.statusCode === 200) {
            this.fileList = this.fileList.map(el => {
              if (el.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
              }
              return el
            })
          }
          setTimeout(() => {
            this.showPercent = false
            this.percent = 0
          }, 1000)
        }
      )
    }
  }
}
</script>

<style>
.disabled .el-upload {
  display: none;
}
</style>
