import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    show: false,
    message: '',
    color: 'teal-darken-3',
  }),
  actions: {
    success(message) {
      this.message = message
      this.color = 'teal-darken-3'
      this.show = true
    },
    error(message) {
      this.message = message
      this.color = 'error'
      this.show = true
    },
    info(message) {
      this.message = message
      this.color = 'info'
      this.show = true
    },
  },
})
