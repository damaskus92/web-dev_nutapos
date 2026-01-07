<template>
  <div class="d-flex flex-column flex-grow-1">
    <v-card rounded="xl" class="pa-2 flex-grow-1" style="box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08)">
      <v-card-title class="d-flex align-center justify-space-between">
        <div>
          <div class="text-h5 font-weight-semibold">Daftar Diskon</div>
          <div class="text-body-1 text-medium-emphasis">Total jumlah diskon: 12</div>
        </div>

        <v-btn prepend-icon="mdi-plus" @click="dialog = true"> Tambah diskon </v-btn>
      </v-card-title>
    </v-card>

    <!-- Dialog Component -->
    <discount-form-dialog v-model="dialog" :loading="loading" @submit="handleSubmit" />
  </div>
</template>

<script setup>
import DiscountFormDialog from '@/components/DiscountFormDialog.vue'
import { discountService } from '@/services/discountService'
import { useSnackbarStore } from '@/stores/snackbar'
import { ref } from 'vue'

const dialog = ref(false)
const loading = ref(false)

const snackbar = useSnackbarStore()

async function handleSubmit(data) {
  loading.value = true

  try {
    const payload = {
      name: data.name,
      value: Number(data.value),
      type: data.type,
    }

    await discountService.create(payload)

    snackbar.success(`"${data.name}" berhasil ditambahkan.`)

    dialog.value = false
  } catch (error) {
    console.error(error)
    snackbar.error(`Gagal menyimpan "${data.name}".`)
  } finally {
    loading.value = false
  }
}
</script>
