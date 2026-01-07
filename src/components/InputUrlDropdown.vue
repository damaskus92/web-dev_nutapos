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
              label="API URL crudcrud.com"
              placeholder="https://crudcrud.com/api/.../diskon"
              outlined
              class="mt-2"
            />
          </v-list-item>
          <v-list-item>
            <div class="d-flex justify-end w-100">
              <v-btn color="success" class="px-8">Terapkan</v-btn>
            </div>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { ChevronDownIcon, StoreIcon } from 'lucide-vue-next'
import { ref } from 'vue'

const menu = ref(false)
</script>

<style scoped>
.custom-button {
  border-radius: 12px !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
}
</style>
