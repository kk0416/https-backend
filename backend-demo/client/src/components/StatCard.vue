<template>
  <section class="stat-card">
    <span class="stat-card__eyebrow">{{ eyebrow }}</span>
    <strong class="stat-card__value">{{ value }}</strong>
    <p class="stat-card__description">{{ description }}</p>
  </section>
</template>

<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: '-',
  },
  description: {
    type: String,
    default: '',
  },
});
</script>
