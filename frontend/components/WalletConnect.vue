<template>
  <div class="flex items-center gap-2">
    <button
      @click="connectWallet"
      :disabled="isConnecting || !isAvailable"
      class="px-4 py-2 rounded bg-orange-500 text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center gap-2 min-w-[220px]"
    >
      <img v-if="wallet" :src="wallet.icon" alt="MetaMask" class="w-5 h-5" />
      <span v-if="isConnecting">Connecting...</span>
      <template v-else-if="isConnected && account">
        <span>MetaMask connected</span>
        <span class="ml-2 bg-white/20 rounded px-2 py-0.5 text-xs font-mono truncate max-w-[100px]" :title="account">
          {{ account.slice(0, 6) }}...{{ account.slice(-4) }}
          @hover="account"
        </span>
      </template>
      <span v-else>Connect with MetaMask</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MetaMaskAdapter } from './wallets/MetaMaskProvider'
import { provideWallet } from '../composables/useWallet'

const wallet = ref<MetaMaskAdapter | null>(null)
const isConnected = ref(false)
const isConnecting = ref(false)
const account = ref<string | null>(null)
const isAvailable = ref(true)

// initialize wallet adapter and check availability on component mount
onMounted(() => {
  wallet.value = new MetaMaskAdapter()
  isAvailable.value = wallet.value.isAvailable()
})

// connect to MetaMask and update state
async function connectWallet() {
  if (!wallet.value || !isAvailable.value) {
    alert('MetaMask is not available or not installed!')
    return
  }
  isConnecting.value = true
  try {
    const acc = await wallet.value.connect()
    if (acc) {
      account.value = acc
      isConnected.value = true
      provideWallet(acc, (window as any).ethereum)
    } else {
      isConnected.value = false
      account.value = null
    }
  } catch {
    isConnected.value = false
    account.value = null
  } finally {
    isConnecting.value = false
  }
}
</script>