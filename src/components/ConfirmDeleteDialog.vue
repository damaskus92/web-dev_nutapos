<template>
  <!-- Dialog konfirmasi hapus -->
  <v-dialog v-model="model" max-width="480" persistent>
    <v-card rounded="xl">
      <!-- Judul dialog -->
      <v-card-title class="text-h5 font-weight-semibold px-6 pt-4"> Hapus Diskon </v-card-title>

      <!-- Konten dialog -->
      <v-card-text>
        <p>Apakah Anda yakin ingin menghapus diskon "{{ item?.name }}"?</p>

        <div class="d-flex items-center ga-2 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
            <g fill="none">
              <path
                fill="url(#SVGskxbwd9h)"
                d="M10.03 3.659c.856-1.548 3.081-1.548 3.937 0l7.746 14.001c.83 1.5-.255 3.34-1.969 3.34H4.254c-1.715 0-2.8-1.84-1.97-3.34z"
              />
              <path
                fill="url(#SVGYnStacUU)"
                d="M12.997 17A.999.999 0 1 0 11 17a.999.999 0 0 0 1.997 0m-.259-7.852a.75.75 0 0 0-1.493.103l.004 4.501l.007.102a.75.75 0 0 0 1.493-.103l-.004-4.502z"
              />
              <defs>
                <linearGradient
                  id="SVGskxbwd9h"
                  x1="5.125"
                  x2="16.719"
                  y1="-.393"
                  y2="23.477"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#ffcd0f" />
                  <stop offset="1" stop-color="#fe8401" />
                </linearGradient>
                <linearGradient
                  id="SVGYnStacUU"
                  x1="9.336"
                  x2="13.752"
                  y1="8.5"
                  y2="18.405"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#4a4a4a" />
                  <stop offset="1" stop-color="#212121" />
                </linearGradient>
              </defs>
            </g>
          </svg>
          <p class="text-medium-emphasis">Diskon yang dihapus tidak bisa dikembalikan lagi.</p>
        </div>
      </v-card-text>

      <!-- Aksi dialog -->
      <v-card-actions class="px-6 pb-6 d-flex justify-end ga-2">
        <v-btn
          color="error"
          variant="outlined"
          class="px-8"
          :disabled="loading"
          @click="model = false"
        >
          Batal
        </v-btn>

        <v-btn color="error" variant="flat" class="px-8" :loading="loading" @click="onConfirm">
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

/* Props */
const props = defineProps({
  modelValue: Boolean,
  item: {
    type: Object,
    default: null,
  },
  loading: Boolean,
})

/* Emit events */
const emit = defineEmits(['update:modelValue', 'confirm'])

/* v-model wrapper */
const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

/* Handle konfirmasi hapus */
function onConfirm() {
  if (!props.item) return
  emit('confirm', props.item)
}
</script>
