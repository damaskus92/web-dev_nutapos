<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" class="custom-button" variant="outlined" color="blue-grey-darken-3">
          Kopi Anak Bangsa

          <template v-slot:prepend>
            <store-icon size="18" />
          </template>

          <template v-slot:append>
            <chevron-down-icon size="18" />
          </template>
        </v-btn>
      </template>

      <v-card min-width="420">
        <v-list>
          <v-list-item>
            <v-text-field
              v-model="apiKey"
              label="API Key crudcrud.com"
              placeholder="Masukkan API Key crudcrud.com"
              hide-details
              outlined
              class="mt-2"
            />
          </v-list-item>
          <v-list-item>
            <div class="d-flex justify-end w-100 ga-3">
              <v-btn color="success" class="px-8" :disabled="!apiKey.trim()" @click="applyApiKey">
                Terapkan
              </v-btn>
            </div>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar'
import { getApiKey, setApiKey } from '@/utils/apiKey'
import { ChevronDownIcon, StoreIcon } from 'lucide-vue-next'
import { ref } from 'vue'

const emit = defineEmits(['api-key-applied'])

const snackbar = useSnackbarStore()

const menu = ref(false)
const apiKey = ref(getApiKey() || '')

const applyApiKey = () => {
  const trimmedKey = apiKey.value.trim()

  if (!trimmedKey) {
    snackbar.error('API Key tidak boleh kosong!')
    return
  }

  setApiKey(trimmedKey)
  menu.value = false
  snackbar.success('API Key berhasil disimpan!')

  emit('api-key-applied', trimmedKey)
}
</script>

<style scoped>
.custom-button {
  border-radius: 12px !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
}
</style>
