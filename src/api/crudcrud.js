import axios from 'axios'
import { getApiKey } from '@/utils/apiKey'

export const crudcrud = {
  get: async (path) => {
    const apiKey = getApiKey()
    if (!apiKey) throw new Error('API Key tidak tersedia')

    const url = `https://crudcrud.com/api/${apiKey}${path}`
    return axios.get(url)
  },

  post: async (path, payload) => {
    const apiKey = getApiKey()
    if (!apiKey) throw new Error('API Key tidak tersedia')

    const url = `https://crudcrud.com/api/${apiKey}${path}`
    return axios.post(url, payload)
  },

  put: async (path, payload) => {
    const apiKey = getApiKey()
    if (!apiKey) throw new Error('API Key tidak tersedia')

    const url = `https://crudcrud.com/api/${apiKey}${path}`
    return axios.put(url, payload)
  },

  delete: async (path) => {
    const apiKey = getApiKey()
    if (!apiKey) throw new Error('API Key tidak tersedia')

    const url = `https://crudcrud.com/api/${apiKey}${path}`
    return axios.delete(url)
  },
}
