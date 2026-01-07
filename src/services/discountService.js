import { crudcrud } from '@/api/crudcrud'

const RESOURCE = 'discounts'

export const discountService = {
  getAll() {
    return crudcrud.get(`/${RESOURCE}`)
  },

  getById(id) {
    return crudcrud.get(`/${RESOURCE}/${id}`)
  },

  create(payload) {
    return crudcrud.post(`/${RESOURCE}`, payload)
  },

  update(id, payload) {
    const { _id, ...data } = payload

    return crudcrud.put(`/${RESOURCE}/${id}`, data)
  },

  delete(id) {
    return crudcrud.delete(`/${RESOURCE}/${id}`)
  },
}
