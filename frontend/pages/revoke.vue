<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">Revoke Credential</h1>

        <form @submit.prevent="handleRevoke" class="space-y-4">
          <div>
            <label for="id" class="block text-sm font-medium text-gray-700 mb-2">
              Credential ID
            </label>
            <input
              id="id"
              v-model="id"
              type="number"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter credential ID"
            />
          </div>

          <button
            type="submit"
            :disabled="revoking"
            class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {{ revoking ? 'Revoking...' : 'Revoke' }}
          </button>
        </form>

        <div v-if="message" class="mt-6 p-4 rounded-md" :class="message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
const id = ref('')
const message = ref('')
const revoking = ref(false)

const handleRevoke = async () => {
  revoking.value = true
  message.value = ''
  try {
    const response = await $fetch<{ ok?: boolean; error?: string }>(`${config.public.apiUrl}/credentials/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { id: parseInt(id.value) }
    })

    if (response && response.ok) {
      message.value = 'Credential revoked successfully!'
      id.value = ''
    } else {
      message.value = `Error: ${response?.error || 'Failed to revoke'}`
    }
  } catch (err) {
    message.value = 'Network error occurred'
  } finally {
    revoking.value = false
  }
}
</script>