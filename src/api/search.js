/**
 * 搜索模块
 */
import request from "@/utils/request";

export const getSerachSuggestions = q => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: { q }
  })
}