import { crudcrud } from '@/api/crudcrud'

const RESOURCE = 'discounts'

export const discountService = {
  getAll() {
    return crudcrud.get(`/${RESOURCE}`)
  },

  create(payload) {
    return crudcrud.post(`/${RESOURCE}`, payload)
  },
}
