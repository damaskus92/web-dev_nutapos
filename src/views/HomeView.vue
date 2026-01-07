<template>
  <div class="d-flex flex-column flex-grow-1">
    <v-card
      rounded="xl"
      class="pa-2 flex-grow-1 d-flex flex-column"
      style="box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08)"
    >
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between">
        <div>
          <div class="text-h5 font-weight-semibold">Daftar Diskon</div>

          <div v-if="discounts && discounts.length > 0" class="text-body-1 text-medium-emphasis">
            Total jumlah diskon: {{ discounts.length }}
          </div>
        </div>

        <div class="d-flex items-center ga-2">
          <v-btn
            v-if="!hasSelection && discounts.length > 0"
            prepend-icon="mdi-plus"
            @click="dialog = true"
          >
            Tambah diskon
          </v-btn>

          <!-- Batalkan selection -->
          <v-btn v-if="hasSelection" color="error" variant="outlined" @click="selected = []">
            Batalkan
          </v-btn>

          <!-- Hapus -->
          <v-btn v-if="hasSelection" color="error"> Hapus </v-btn>
        </div>
      </v-card-title>

      <!-- Table -->
      <v-card-text
        v-if="isFetched && discounts.length > 0"
        class="d-flex flex-column flex-grow-1 mt-2"
      >
        <!-- Table Action -->
        <div class="d-flex mb-6">
          <v-text-field
            v-model="search"
            placeholder="Cari diskon"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            style="max-width: 260px"
          />
        </div>

        <!-- Table -->
        <v-data-table
          v-model="selected"
          show-select
          :headers="headers"
          :items="filteredDiscounts"
          item-value="_id"
          class="flex-grow-1 table-discount"
        >
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@10" />
          </template>

          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center ga-2">
              <span>{{ item.name }}</span>

              <v-chip
                v-if="item._id === newestDiscountId"
                variant="outlined"
                size="small"
                class="rounded-pill font-weight-semibold bg-blue-lighten-5 py-0"
                color="info"
              >
                baru
              </v-chip>
            </div>
          </template>

          <template v-slot:item.discount_value="{ item }">
            <span v-if="item.type === 'amount'"> Rp {{ formatRupiah(item.discount_value) }} </span>
            <span v-else> {{ item.discount_value }}% </span>
          </template>
        </v-data-table>
      </v-card-text>

      <!-- Empty State -->
      <v-sheet
        v-else-if="isFetched && discounts.length === 0"
        border
        class="flex-grow-1 ma-4 d-flex align-center justify-center pa-4"
        style="border-radius: 12px"
      >
        <div
          class="d-flex flex-column align-center ga-5 text-center"
          style="width: 100%; max-width: 420px"
        >
          <v-img
            src="/images/il_empty_state_discount_not_available.png"
            max-height="135"
            max-width="240"
            width="100%"
            contain
          />

          <div>
            <p class="text-h6 font-weight-semibold">Belum Ada Diskon</p>
            <p>Silahkan tambah diskon untuk menarik pelanggan dan meningkatkan penjualan.</p>
          </div>

          <v-btn prepend-icon="mdi-plus" @click="dialog = true"> Tambah diskon </v-btn>
        </div>
      </v-sheet>

      <v-card-text v-else class="d-flex align-center justify-center flex-grow-1">
        <v-progress-circular indeterminate />
      </v-card-text>
    </v-card>

    <!-- Dialog -->
    <discount-form-dialog v-model="dialog" :loading="loading" @submit="handleSubmit" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DiscountFormDialog from '@/components/DiscountFormDialog.vue'
import { discountService } from '@/services/discountService'
import { useSnackbarStore } from '@/stores/snackbar'

// store
const snackbar = useSnackbarStore()

// state
const dialog = ref(false)
const loading = ref(false)
const loadingList = ref(false)
const isFetched = ref(false)

const discounts = ref([])
const selected = ref([])
const search = ref('')

// table config
const headers = [
  { title: 'Nama Diskon', key: 'name' },
  { title: 'Nilai Diskon', key: 'discount_value' },
]

// computed
const hasSelection = computed(() => selected.value.length > 0)

// urutkan dari data terbaru
const sortedDiscounts = computed(() => {
  return [...discounts.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

// id diskon terbaru
const newestDiscountId = computed(() => {
  return sortedDiscounts.value.length ? sortedDiscounts.value[0]._id : null
})

// filter
const filteredDiscounts = computed(() => {
  if (!search.value) return sortedDiscounts.value

  const keyword = search.value.toLowerCase()

  return sortedDiscounts.value.filter((item) => item.name.toLowerCase().includes(keyword))
})

// fetch data
async function fetchDiscounts() {
  loadingList.value = true
  isFetched.value = false

  try {
    const res = await discountService.getAll()
    discounts.value = res.data
  } catch (error) {
    console.error(error)
    snackbar.error('Gagal memuat data.')
  } finally {
    loadingList.value = false
    isFetched.value = true
  }
}

// create discount
async function handleSubmit(data) {
  loading.value = true

  try {
    const now = new Date().toISOString()

    await discountService.create({
      name: data.name,
      discount_value: Number(data.discount_value),
      type: data.type,
      created_at: now,
      updated_at: now,
    })

    snackbar.success(`"${data.name}" berhasil ditambahkan.`)
    dialog.value = false

    await fetchDiscounts()
  } catch (error) {
    console.error(error)
    snackbar.error(`Gagal menyimpan "${data.name}".`)
  } finally {
    loading.value = false
  }
}

// helpers
function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID').format(value)
}

onMounted(fetchDiscounts)
</script>

<style scoped>
.table-discount :deep(.v-table__wrapper) {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  overflow: hidden;
}

.table-discount :deep(.v-data-table-footer) {
  border-top: none;
}

.table-discount :deep(.v-divider) {
  display: none;
}

.table-discount :deep(.v-data-table-footer) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
