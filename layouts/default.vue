<script setup lang="ts">
const auth = useAuthStore()
const request = useRequestFetch()
await callOnce('viewer', () => auth.load(request))
</script>
<template><AppShell><slot /></AppShell></template>
