import { crudcrud } from '@/api/crudcrud'

const RESOURCE = 'discounts'

export const discountService = {
  create(payload) {
    return crudcrud.post(`/${RESOURCE}`, payload)
  },
}
