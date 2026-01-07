<template>
  <v-dialog v-model="model" max-width="480" persistent>
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center justify-space-between px-6 pt-4">
        <span class="text-h5 font-weight-semibold">Tambah Diskon</span>

        <v-btn icon variant="text" density="comfortable" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="isValid">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                label="Nama Diskon"
                placeholder="Misal: Diskon opening, diskon akhir tahun"
                :rules="[rules.requiredName]"
              />
            </v-col>

            <v-col cols="12">
              <v-row align="center">
                <v-col cols="8">
                  <v-text-field
                    v-model="form.value"
                    label="Diskon"
                    placeholder="0"
                    type="number"
                    :rules="[rules.requiredValue, rules.minValue]"
                  >
                    <template #prepend-inner v-if="form.type === 'amount'">
                      <span>Rp</span>
                    </template>

                    <template #append-inner v-else>
                      <span>%</span>
                    </template>
                  </v-text-field>
                </v-col>

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

            <v-col cols="12">
              <v-btn
                block
                color="primary"
                :loading="loading"
                :disabled="loading || !isValid"
                @click="submit"
              >
                <template v-if="loading">Menyimpan...</template>
                <template v-else>Simpan</template>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const formRef = ref(null)
const isValid = ref(false)

const form = reactive({
  name: '',
  value: null,
  type: 'percent',
})

const rules = {
  requiredName: (v) => !!v || 'Nama diskon tidak boleh kosong.',
  requiredValue: (v) => (v !== null && v !== '') || 'Diskon tidak boleh kosong.',
  minValue: (v) => v > 0 || 'Diskon tidak boleh "0".',
}

function resetForm() {
  form.name = ''
  form.value = null
  form.type = 'percent'
  formRef.value?.resetValidation()
}

function close() {
  if (props.loading) return
  model.value = false
  resetForm()
}

function submit() {
  if (!formRef.value.validate()) return

  emit('submit', {
    name: form.name,
    value: form.value,
    type: form.type,
  })
}
</script>
