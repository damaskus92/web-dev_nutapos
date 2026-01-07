<template>
  <v-app class="bg-grey-lighten-3">
    <v-main class="d-flex flex-column overflow-y-auto" style="height: 100vh">
      <v-container class="pa-6 d-flex flex-grow-1" fluid>
        <div class="d-flex flex-grow-1">
          <router-view />
        </div>
      </v-container>

      <!-- Global Snackbar -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="3000"
        location="top"
        class="mt-6"
      >
        {{ snackbar.message }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar'

const snackbar = useSnackbarStore()
</script>
