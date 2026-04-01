<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          VeriChain
        </h1>
        <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          A decentralized platform for issuing, verifying, and managing digital credentials on the blockchain.
        </p>
        <div class="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <NuxtLink
            to="/issue"
            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="text-3xl mb-4">➕</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Issue</h3>
            <p class="text-gray-600">Create new credentials</p>
          </NuxtLink>
          <NuxtLink
            to="/dashboard"
            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="text-3xl mb-4">📊</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Dashboard</h3>
            <p class="text-gray-600">View all issued credentials</p>
          </NuxtLink>
          <NuxtLink
            to="/verify"
            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="text-3xl mb-4">✅</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Verify</h3>
            <p class="text-gray-600">Check credential validity</p>
          </NuxtLink>
          <NuxtLink
            to="/revoke"
            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="text-3xl mb-4">🚫</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Revoke</h3>
            <p class="text-gray-600">Revoke issued credentials</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>