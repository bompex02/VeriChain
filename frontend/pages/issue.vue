<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">Issue New Credential</h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Recipient Address -->
          <div>
            <label for="recipient" class="block text-sm font-medium text-gray-700 mb-2">
              Recipient Ethereum Address
            </label>
            <input
              id="recipient"
              v-model="form.recipient"
              type="text"
              required
              placeholder="0x..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p class="mt-1 text-sm text-gray-500">The wallet address of the credential recipient</p>
          </div>

          <!-- Credential Type -->
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
              Credential Type
            </label>
            <select
              id="type"
              v-model="form.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a type</option>
              <option value="UniversityDegree">University Degree</option>
              <option value="Certificate">Professional Certificate</option>
              <option value="Badge">Achievement Badge</option>
              <option value="License">License</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Credential Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Credential Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="e.g., Bachelor of Computer Science"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- Issuer -->
          <div>
            <label for="issuer" class="block text-sm font-medium text-gray-700 mb-2">
              Issuer Name
            </label>
            <input
              id="issuer"
              v-model="form.issuer"
              type="text"
              required
              placeholder="e.g., Example University"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="Additional details about the credential"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          <!-- Issue Date -->
          <div>
            <label for="issueDate" class="block text-sm font-medium text-gray-700 mb-2">
              Issue Date
            </label>
            <input
              id="issueDate"
              v-model="form.issueDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- File Upload (Optional) -->
          <div>
            <label for="file" class="block text-sm font-medium text-gray-700 mb-2">
              Upload File (Optional)
            </label>
            <input
              id="file"
              type="file"
              @change="handleFileUpload"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p class="mt-1 text-sm text-gray-500">Any file is allowed. JSON files can also prefill the form.</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="submitting"
            class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="submitting" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Issuing Credential...
            </span>
            <span v-else>Issue Credential</span>
          </button>
        </form>

        <!-- Success Message -->
        <div v-if="success" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Credential Issued Successfully!</h3>
              <div class="mt-2 text-sm text-green-700">
                <p>Transaction Hash: <code class="bg-green-100 px-1 rounded">{{ txHash }}</code></p>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error Issuing Credential</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { usePinataClient } from '../composables/usePinataClient'
import { ApiClient } from '../services/http/ApiClient'
import { CredentialService } from '../services/credentials/CredentialService'
import type { CredentialFormData } from '../types/credential'

const config = useRuntimeConfig()
const { uploadFile } = usePinataClient(String(config.public.PINATA_JWT))
const credentialService = new CredentialService(new ApiClient(String(config.public.apiUrl)))

const emptyForm = (): CredentialFormData => ({
  recipient: '',
  type: '',
  name: '',
  issuer: '',
  description: '',
  issueDate: '',
})

const form = ref<CredentialFormData>(emptyForm())

const submitting = ref(false)
const success = ref(false)
const error = ref('')
const txHash = ref('')
const selectedFile = ref<File | null>(null)

const uploadToIPFS = async (file: File) => {
  return await uploadFile(file)
}

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  selectedFile.value = file

  const isJson = file.type === 'application/json' || file.name.toLowerCase().endsWith('.json')
  if (isJson) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)
        Object.assign(form.value, jsonData)
      } catch (err) {
        // Ignore invalid JSON content and keep normal file upload behavior.
      }
    }
    reader.readAsText(file)
  }
}

const handleSubmit = async () => {
  submitting.value = true
  success.value = false
  error.value = ''
  txHash.value = ''

  try {
    let originalFileUri: string | null = null
    if (selectedFile.value) {
      const uploadedUri = await uploadToIPFS(selectedFile.value)
      if (!uploadedUri) throw new Error('IPFS upload failed')
      originalFileUri = uploadedUri
    }

    const credentialData = CredentialService.buildMetadata(form.value, originalFileUri)

    const jsonFile = new File([JSON.stringify(credentialData, null, 2)], 'credential.json', { type: 'application/json' })
    const uri = await uploadToIPFS(jsonFile)

    if (!uri) throw new Error('IPFS upload failed')

    const response = await credentialService.issue(form.value.recipient, uri)

    if (response.success) {
      success.value = true
      txHash.value = response.txHash
      form.value = emptyForm()
      selectedFile.value = null
    } else {
      throw new Error('Failed to issue credential')
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred'
  } finally {
    submitting.value = false
  }
}
</script>