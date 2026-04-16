<template>
  <div>
    <h3 class="text-lg font-medium mb-2">Teilen & Sichtbarkeit</h3>
    <div class="mb-4">
      <label class="inline-flex items-center">
        <input type="checkbox" v-model="localSharing.isPublic" class="form-checkbox" />
        <span class="ml-2">Öffentlich sichtbar</span>
      </label>
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Mit Adressen teilen (eine pro Zeile):</label>
      <textarea v-model="sharedWithInput" rows="3" class="w-full border rounded p-2 text-sm" :disabled="localSharing.isPublic"></textarea>
    </div>
    <div class="flex justify-end space-x-2">
      <button @click="$emit('cancel')" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Abbrechen</button>
      <button @click="save" :disabled="loading" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        <span v-if="loading">Speichern...</span>
        <span v-else>Speichern</span>
      </button>
    </div>
    <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { SharingInfo } from '../../types/credential';

const props = defineProps<{
  modelValue: SharingInfo;
}>();
const emit = defineEmits(['update:modelValue', 'save', 'cancel']);

const localSharing = ref<SharingInfo>({ ...props.modelValue });
const loading = ref(false);
const error = ref('');

const sharedWithInput = ref(localSharing.value.sharedWith.join('\n'));

watch(
  () => props.modelValue,
  (val) => {
    localSharing.value = { ...val };
    sharedWithInput.value = val.sharedWith.join('\n');
  }
);

watch(
  () => localSharing.value.isPublic,
  (isPublic) => {
    if (isPublic) sharedWithInput.value = '';
  }
);

function save() {
  loading.value = true;
  error.value = '';
  localSharing.value.sharedWith = localSharing.value.isPublic
    ? []
    : sharedWithInput.value
        .split(/\n|,|;/)
        .map((a) => a.trim().toLowerCase())
        .filter((a) => a);
  emit('update:modelValue', { ...localSharing.value });
  emit('save', { ...localSharing.value });
  loading.value = false;
}
</script>
