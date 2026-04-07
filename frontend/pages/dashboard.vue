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
            <div v-else class="bg-gray-50 p-4 rounded-md">
              <p v-if="modalError" class="text-sm text-red-600 mb-3">{{ modalError }}</p>
              <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ modalContent }}</pre>
              <div v-if="hasOriginalFileLink" class="mt-3">
                <a
                  :href="modalUri"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-indigo-600 hover:text-indigo-900 underline"
                >
                  Open original file
                </a>
              </div>
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

import { ref, onMounted, computed } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { ApiClient } from '../services/http/ApiClient'
import { CredentialService } from '../services/credentials/CredentialService'
import type { CredentialRecord } from '../types/credential'

const config = useRuntimeConfig()
const credentialService = new CredentialService(new ApiClient(String(config.public.apiUrl)))

const credentials = ref<CredentialRecord[]>([])
const loading = ref(true)
const error = ref('')
const showModal = ref(false)
const modalLoading = ref(false)
const modalError = ref('')
const modalContent = ref('')
const modalUri = ref('')

const hasOriginalFileLink = computed(() => {
  return CredentialService.hasExternalUri(modalUri.value)
})

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

onMounted(async () => {
  await loadCredentials()
})

const loadCredentials = async () => {
  try {
    credentials.value = await credentialService.getAll()
    if (credentials.value.length === 0) {
      error.value = ''
    }
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load credentials'
  } finally {
    loading.value = false
  }
}

const viewDetails = async (cred: CredentialRecord) => {
  showModal.value = true
  modalLoading.value = true
  modalError.value = ''
  modalContent.value = ''
  modalUri.value = ''

  try {
    const metadataView = await CredentialService.resolveMetadataView(cred.metadataURI)
    modalContent.value = metadataView.content
    modalUri.value = metadataView.originalFileUri
    modalError.value = metadataView.errorMessage
  } catch (err) {
    modalError.value = 'Details could not be parsed as JSON.'
    modalContent.value = 'Use the button below to open the original file if available.'
  } finally {
    modalLoading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  modalUri.value = ''
}

const revokeCredential = async (id: number) => {
  if (!confirm('Are you sure you want to revoke this credential?')) return

  try {
    await credentialService.revoke(id)
    await loadCredentials() // Reload list
  } catch (err) {
    alert('Failed to revoke credential')
  }
}

const activateCredential = async (id: number) => {
  if (!confirm('Are you sure you want to activate this credential?')) return

  try {
    await credentialService.activate(id)
    await loadCredentials() // Reload list
  } catch (err) {
    alert('Failed to activate credential')
  }
}
</script>