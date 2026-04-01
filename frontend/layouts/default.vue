<template>
  <div>
    <nav class="bg-white shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900">
            VeriChain
          </NuxtLink>
          <div class="space-x-6">
            <NuxtLink to="/" class="text-gray-700 hover:text-indigo-600 transition-colors">
              Home
            </NuxtLink>
            <NuxtLink to="/issue" class="text-gray-700 hover:text-indigo-600 transition-colors">
              Issue
            </NuxtLink>
            <NuxtLink to="/dashboard" class="text-gray-700 hover:text-indigo-600 transition-colors">
              Dashboard
            </NuxtLink>
            <NuxtLink to="/verify" class="text-gray-700 hover:text-indigo-600 transition-colors">
              Verify
            </NuxtLink>
            <NuxtLink to="/revoke" class="text-gray-700 hover:text-indigo-600 transition-colors">
              Revoke
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Default Layout mit Navigation
</script>