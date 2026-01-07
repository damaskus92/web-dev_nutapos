import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  blueprint: md3,
  theme: {
    defaultTheme: 'light',
  },
  defaults: {
    global: {
      ripple: false,
    },
    VBtn: {
      color: 'success',
      elevation: 0,
      style: {
        textTransform: 'none',
        letterSpacing: 'normal',
        fontWeight: 600,
        height: '40px',
      },
    },
  },
})
