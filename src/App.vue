<template>
  <template v-if="isMounted"><NadezhdinMap v-bind="props"/></template>
  <template v-else></template>
</template>

<script setup lang="ts">
import NadezhdinMap from './components/NadezhdinMap.vue'
import { ref, onMounted } from 'vue'
import { Region } from './main';
const props = withDefaults(
  defineProps<{ regions: Region[], threshold: number }>(),
  { threshold: 2500 }
)
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>