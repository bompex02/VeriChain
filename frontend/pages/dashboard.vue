<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">VeriChain Dashboard</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading credentials...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-700">{{ error }}</p>
      </div>

      <div v-else-if="credentials.length === 0" class="bg-white rounded-lg shadow p-6 text-center">
        <p class="text-gray-600">No credentials found.</p>
      </div>

      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issuer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued At</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="cred in credentials" :key="cred.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ cred.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="cred.revoked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ cred.revoked ? 'Revoked' : 'Active' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {{ shortenAddress(cred.recipient) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {{ shortenAddress(cred.issuer) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(cred.timestamp * 1000).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewDetails(cred)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </button>
                    <button
                      v-if="!cred.revoked"
                      @click="revokeCredential(cred.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Revoke
                    </button>
                    <button
                      v-else
                      @click="activateCredential(cred.id)"
                      class="text-green-600 hover:text-green-900"
                    >
                      Activate
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Details Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" @click="closeModal">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Credential Details</h3>
            <div v-if="modalLoading" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p class="mt-2 text-gray-600">Loading details...</p>
            </div>
            <div v-else-if="modalError" class="text-red-600">
              <p>{{ modalError }}</p>
            </div>
            <div v-else class="bg-gray-50 p-4 rounded-md">
              <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ modalContent }}</pre>
            </div>
            <div class="flex justify-end mt-4">
              <button
                @click="closeModal"
                class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
interface Credential {
  id: number
  issuer: string
  recipient: string
  metadataURI: string
  timestamp: number
  revoked: boolean
}
const credentials = ref<Credential[]>([])
const loading = ref(true)
const error = ref('')
const showModal = ref(false)
const modalLoading = ref(false)
const modalError = ref('')
const modalContent = ref('')

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

onMounted(async () => {
  await loadCredentials()
})

const loadCredentials = async () => {
  try {
    const response = await $fetch(`${config.public.apiUrl}/credentials/all`)
    if (Array.isArray(response)) {
      credentials.value = response
    } else {
      error.value = 'Invalid data format received'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load credentials'
  } finally {
    loading.value = false
  }
}

const viewDetails = async (cred: Credential) => {
  showModal.value = true
  modalLoading.value = true
  modalError.value = ''
  modalContent.value = ''

  try {
    if (cred.metadataURI.startsWith('data:')) {
      // Handle data URL
      const base64 = cred.metadataURI.split(',')[1]
      const json = JSON.parse(atob(base64))
      modalContent.value = JSON.stringify(json, null, 2)
    } else {
      // Fetch from URL
      const response = await $fetch(cred.metadataURI)
      modalContent.value = JSON.stringify(response, null, 2)
    }
  } catch (err) {
    modalError.value = 'Failed to load credential details'
  } finally {
    modalLoading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
}

const revokeCredential = async (id: number) => {
  if (!confirm('Are you sure you want to revoke this credential?')) return

  try {
    await $fetch(`${config.public.apiUrl}/credentials/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { id }
    })
    await loadCredentials() // Reload list
  } catch (err) {
    alert('Failed to revoke credential')
  }
}

const activateCredential = async (id: number) => {
  if (!confirm('Are you sure you want to activate this credential?')) return

  try {
    await $fetch(`${config.public.apiUrl}/credentials/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { id }
    })
    await loadCredentials() // Reload list
  } catch (err) {
    alert('Failed to activate credential')
  }
}
</script>