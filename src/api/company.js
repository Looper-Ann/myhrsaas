import request from '@/utils/request'

// 根据ID获取公司信息
export const getCompanyById = id =>
  request({
    url: `/company/${id}`
  })
