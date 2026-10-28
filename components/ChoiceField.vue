<script setup lang="ts">
const props = defineProps<{ label: string; options: string[][]; disabled?: boolean }>()
const model = defineModel<string>()
const id = useId()
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const open = ref(false)
const active = ref(0)
const current = computed(() => props.options.find(([value]) => value === model.value)?.[1])
let query = ''
let typedAt = 0

function close(restoreFocus = false) {
  open.value = false
  if (restoreFocus) trigger.value?.focus()
}
function reveal() {
  if (props.disabled || !props.options.length) return
  active.value = Math.max(0, props.options.findIndex(([value]) => value === model.value))
  open.value = true
}
function choose(index: number) {
  const option = props.options[index]
  if (!option) return
  model.value = option[0]
  close(true)
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Tab') return close()
  if (event.key === 'Escape') {
    event.preventDefault()
    return close(true)
  }
  if (['Enter', ' '].includes(event.key)) {
    event.preventDefault()
    return open.value ? choose(active.value) : reveal()
  }
  const steps: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 }
  if (event.key in steps || event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    if (!open.value) return reveal()
    const last = props.options.length - 1
    const positions: Record<string, number> = { Home: 0, End: last }
    active.value = positions[event.key] ?? Math.max(0, Math.min(last, active.value + steps[event.key]))
    nextTick(() => document.getElementById(id + '-' + active.value)?.scrollIntoView({ block: 'nearest' }))
    return
  }
  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return
  query = Date.now() - typedAt > 700 ? event.key : query + event.key
  typedAt = Date.now()
  const match = props.options.findIndex(([, label]) => label.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()))
  if (match < 0) return
  if (!open.value) reveal()
  active.value = match
}
function outside(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) close()
}
watch(() => props.disabled, disabled => { if (disabled) close() })
onMounted(() => document.addEventListener('pointerdown', outside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', outside))
</script>

<template>
  <div ref="root" class="choice" :class="{ 'choice-open': open }">
    <button ref="trigger" type="button" class="choice-trigger" role="combobox"
      :aria-label="label + ': ' + (current || label)" aria-haspopup="listbox"
      :aria-expanded="open" :aria-controls="id" :aria-activedescendant="open ? id + '-' + active : undefined"
      :disabled="disabled" @click="open ? close() : reveal()" @keydown="keydown">
      <span>{{ current || label }}</span><AppIcon name="chevron" />
    </button>
    <ul v-if="open" :id="id" class="choice-menu" role="listbox" :aria-label="label">
      <li v-for="([value, label], index) in options" :id="id + '-' + index" :key="value"
        role="option" :aria-selected="model === value" :data-active="index === active || undefined"
        @pointermove="active = index" @mousedown.prevent @click="choose(index)">
        <span>{{ label }}</span><span v-if="model === value" aria-hidden="true" class="choice-mark" />
      </li>
    </ul>
  </div>
</template>
