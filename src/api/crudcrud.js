import axios from 'axios'
import { getApiKey } from '@/utils/apiKey'

const apiKey = getApiKey()

export const crudcrud = axios.create({
  baseURL: `https://crudcrud.com/api/${apiKey}`,
  headers: {
    'Content-Type': 'application/json',
  },
})
