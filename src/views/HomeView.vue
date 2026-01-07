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

          <div v-if="discounts.length" class="text-body-1 text-medium-emphasis">
            Total jumlah diskon: {{ discounts.length }}
          </div>
        </div>

        <div class="d-flex align-center ga-2">
          <!-- Tambah -->
          <v-btn
            v-if="!hasSelection && discounts.length"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
          >
            Tambah diskon
          </v-btn>

          <!-- Batalkan selection -->
          <v-btn v-if="hasSelection" color="error" variant="outlined" @click="clearSelection">
            Batalkan
          </v-btn>

          <!-- Hapus bulk -->
          <v-btn v-if="hasSelection" color="error" @click="openBulkDeleteDialog"> Hapus </v-btn>
        </div>
      </v-card-title>

      <!-- Table -->
      <v-card-text v-if="isFetched && discounts.length" class="d-flex flex-column flex-grow-1 mt-2">
        <!-- Search -->
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

        <!-- Data table -->
        <v-data-table
          v-model="selected"
          show-select
          :headers="headers"
          :items="filteredDiscounts"
          item-value="_id"
          class="flex-grow-1 table-discount"
        >
          <template #loading>
            <v-skeleton-loader type="table-row@10" />
          </template>

          <template #item.name="{ item }">
            <div class="d-flex align-center ga-2">
              <span>{{ item.name }}</span>

              <v-chip
                v-if="item._id === newestDiscountId"
                size="small"
                variant="outlined"
                color="info"
                class="rounded-pill font-weight-semibold bg-blue-lighten-5 py-0"
              >
                baru
              </v-chip>
            </div>
          </template>

          <template #item.discount_value="{ item }">
            <span v-if="item.type === 'amount'"> Rp {{ formatRupiah(item.discount_value) }} </span>
            <span v-else> {{ item.discount_value }}% </span>
          </template>

          <template #item.actions="{ item }">
            <v-btn icon size="small" variant="text" @click="openEditDialog(item)">
              <v-icon icon="mdi-pencil" />
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <!-- Empty state -->
      <v-sheet
        v-else-if="isFetched"
        border
        class="flex-grow-1 ma-4 d-flex align-center justify-center pa-4"
        style="border-radius: 12px"
      >
        <div class="d-flex flex-column align-center ga-5 text-center" style="max-width: 420px">
          <v-img
            src="/images/il_empty_state_discount_not_available.png"
            max-height="135"
            max-width="240"
            contain
          />

          <div>
            <p class="text-h6 font-weight-semibold">Belum Ada Diskon</p>
            <p>Silahkan tambah diskon untuk menarik pelanggan dan meningkatkan penjualan.</p>
          </div>

          <v-btn prepend-icon="mdi-plus" @click="openCreateDialog"> Tambah diskon </v-btn>
        </div>
      </v-sheet>

      <!-- Loading -->
      <v-card-text v-else class="d-flex align-center justify-center flex-grow-1">
        <v-progress-circular indeterminate />
      </v-card-text>
    </v-card>

    <!-- Dialog form -->
    <discount-form-dialog
      v-model="dialog"
      :mode="dialogMode"
      :initial-data="editingDiscount"
      :loading-submit="loadingSubmit"
      :loading-delete="loadingDelete"
      :discounts="discounts"
      @submit="handleSubmit"
      @delete="openSingleDeleteDialog"
    />
  </div>

  <!-- Dialog konfirmasi hapus -->
  <confirm-delete-dialog
    v-model="confirmDialog"
    :items="itemsToDelete"
    :loading="loadingDelete"
    @confirm="handleConfirmDelete"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DiscountFormDialog from '@/components/DiscountFormDialog.vue'
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue'
import { discountService } from '@/services/discountService'
import { useSnackbarStore } from '@/stores/snackbar'

/* Store */
const snackbar = useSnackbarStore()

/* Dialog & loading state */
const dialog = ref(false)
const dialogMode = ref('create')
const confirmDialog = ref(false)

const loadingSubmit = ref(false)
const loadingDelete = ref(false)
const isFetched = ref(false)

/* Data */
const discounts = ref([])
const selected = ref([])
const search = ref('')
const editingDiscount = ref(null)
const itemsToDelete = ref([])

/* Computed */
const hasSelection = computed(() => selected.value.length > 0)

const headers = [
  { title: 'Nama Diskon', key: 'name' },
  { title: 'Nilai Diskon', key: 'discount_value' },
  { title: '', key: 'actions', sortable: false },
]

const sortedDiscounts = computed(() =>
  [...discounts.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
)

const newestDiscountId = computed(() => sortedDiscounts.value[0]?._id ?? null)

const filteredDiscounts = computed(() => {
  if (!search.value) return sortedDiscounts.value

  const keyword = search.value.toLowerCase()
  return sortedDiscounts.value.filter((item) => item.name.toLowerCase().includes(keyword))
})

/* Fetch data */
async function fetchDiscounts() {
  isFetched.value = false
  try {
    const res = await discountService.getAll()
    discounts.value = res.data
  } catch {
    snackbar.error('Gagal memuat data.')
  } finally {
    isFetched.value = true
  }
}

/* Dialog handlers */
function openCreateDialog() {
  dialogMode.value = 'create'
  editingDiscount.value = null
  dialog.value = true
}

function openEditDialog(item) {
  dialogMode.value = 'edit'
  editingDiscount.value = item
  dialog.value = true
}

/* Submit */
async function handleSubmit(data) {
  loadingSubmit.value = true

  try {
    const now = new Date().toISOString()

    if (dialogMode.value === 'edit') {
      await discountService.update(data._id, {
        ...data,
        discount_value: Number(data.discount_value),
        updated_at: now,
      })
      snackbar.success(`"${data.name}" berhasil disimpan.`)
    } else {
      await discountService.create({
        ...data,
        discount_value: Number(data.discount_value),
        created_at: now,
        updated_at: now,
      })
      snackbar.success(`"${data.name}" berhasil ditambahkan.`)
    }

    dialog.value = false
    await fetchDiscounts()
  } catch {
    snackbar.error('Gagal menyimpan data.')
  } finally {
    loadingSubmit.value = false
  }
}

/* Delete */
function openSingleDeleteDialog(item) {
  itemsToDelete.value = [item]
  confirmDialog.value = true
}

function openBulkDeleteDialog() {
  itemsToDelete.value = [...selected.value]
  confirmDialog.value = true
}

async function handleConfirmDelete(items) {
  if (items.length === 0) return

  console.log(items)

  loadingDelete.value = true

  try {
    // Ekstrak ID dari items (bisa string atau object)
    const ids = items.map((item) => (typeof item === 'string' ? item : item._id))

    // Hapus satu per satu
    await Promise.all(ids.map((id) => discountService.delete(id)))

    if (items.length === 1) {
      // Ambil nama jika tersedia (object), jika tidak gunakan pesan default
      const name = typeof items[0] === 'object' && items[0].name ? items[0].name : null

      if (name) {
        snackbar.success(`"${name}" berhasil dihapus.`)
      } else {
        snackbar.success('1 diskon berhasil dihapus.')
      }
    } else {
      snackbar.success(`${items.length} diskon berhasil dihapus.`)
    }

    // Reset state
    confirmDialog.value = false
    dialog.value = false
    selected.value = []

    await fetchDiscounts()
  } catch (error) {
    console.error(error)
    snackbar.error('Gagal menghapus diskon.')
  } finally {
    loadingDelete.value = false
  }
}

/* Helpers */
function clearSelection() {
  selected.value = []
}

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

.table-discount :deep(td:last-child),
.table-discount :deep(th:last-child) {
  width: 48px;
  text-align: center;
}
</style>
