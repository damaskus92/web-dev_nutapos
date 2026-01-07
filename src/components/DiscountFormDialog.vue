<template>
  <!-- Dialog form diskon -->
  <v-dialog v-model="model" max-width="480" persistent>
    <v-card rounded="xl">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between px-6 pt-4">
        <span class="text-h5 font-weight-semibold">
          {{ isEdit ? 'Ubah Diskon' : 'Tambah Diskon' }}
        </span>

        <v-btn icon variant="text" density="comfortable" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Body -->
      <v-card-text>
        <v-form ref="formRef" v-model="isValid">
          <v-row>
            <!-- Nama diskon -->
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                label="Nama Diskon"
                placeholder="Misal: Diskon opening, diskon akhir tahun"
                :rules="[rules.requiredName]"
              />
            </v-col>

            <!-- Nilai diskon -->
            <v-col cols="12">
              <v-row align="center">
                <v-col cols="8">
                  <v-text-field
                    v-model="form.discount_value"
                    label="Diskon"
                    placeholder="0"
                    type="number"
                    :rules="[rules.requiredDiscountValue, rules.minDiscountValue]"
                  >
                    <template #prepend-inner v-if="form.type === 'amount'">
                      <span>Rp</span>
                    </template>

                    <template #append-inner v-else>
                      <span>%</span>
                    </template>
                  </v-text-field>
                </v-col>

                <!-- Tipe diskon -->
                <v-col cols="4" style="margin-top: -22px">
                  <v-btn-toggle
                    v-model="form.type"
                    mandatory
                    density="comfortable"
                    rounded="lg"
                    variant="outlined"
                    class="w-100"
                  >
                    <v-btn value="percent">%</v-btn>
                    <v-btn value="amount">Rp</v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-col>

            <!-- Aksi -->
            <v-col cols="12">
              <!-- Mode edit -->
              <div v-if="isEdit" class="d-flex justify-space-between align-center">
                <v-btn
                  color="error"
                  variant="outlined"
                  :loading="loadingDelete"
                  :disabled="isActionDisabled"
                  @click="onDelete"
                >
                  Hapus
                </v-btn>

                <v-btn
                  color="primary"
                  :loading="loadingSubmit"
                  :disabled="isActionDisabled || !isValid"
                  @click="onSubmit"
                >
                  Simpan
                </v-btn>
              </div>

              <!-- Mode create -->
              <v-btn
                v-else
                block
                color="primary"
                :loading="loadingSubmit"
                :disabled="isActionDisabled || !isValid"
                @click="onSubmit"
              >
                Simpan
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

/* Props */
const props = defineProps({
  modelValue: Boolean,
  loadingSubmit: Boolean,
  loadingDelete: Boolean,
  mode: String, // create | edit
  initialData: Object,
})

/* Emits */
const emit = defineEmits(['update:modelValue', 'submit', 'delete'])

/* v-model dialog */
const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

/* Mode */
const isEdit = computed(() => props.mode === 'edit')

/* Disable state */
const isActionDisabled = computed(() => props.loadingSubmit || props.loadingDelete)

/* Form */
const formRef = ref(null)
const isValid = ref(false)

const form = reactive({
  name: '',
  discount_value: null,
  type: 'percent',
})

/* Validation rules */
const rules = {
  requiredName: (v) => !!v || 'Nama diskon tidak boleh kosong.',
  requiredDiscountValue: (v) => (v !== null && v !== '') || 'Diskon tidak boleh kosong.',
  minDiscountValue: (v) => v > 0 || 'Diskon tidak boleh "0".',
}

/* Sync data saat dialog dibuka */
watch(
  () => props.modelValue,
  (open) => {
    if (open && isEdit.value && props.initialData) {
      form.name = props.initialData.name
      form.discount_value = props.initialData.discount_value
      form.type = props.initialData.type
    }

    if (!open && props.mode === 'create') {
      resetForm()
    }
  },
)

/* Reset form */
function resetForm() {
  form.name = ''
  form.discount_value = null
  form.type = 'percent'
  formRef.value?.resetValidation()
}

/* Close dialog */
function closeDialog() {
  if (isActionDisabled.value) return
  model.value = false
  resetForm()
}

/* Submit form */
function onSubmit() {
  if (!formRef.value.validate()) return

  const payload = {
    name: form.name,
    discount_value: form.discount_value,
    type: form.type,
  }

  if (isEdit.value && props.initialData?._id) {
    payload._id = props.initialData._id
  }

  emit('submit', payload)
}

/* Delete data */
function onDelete() {
  emit('delete', props.initialData)
}
</script>
