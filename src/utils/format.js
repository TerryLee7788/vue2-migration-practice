// Vue 3 removed filters entirely — plain functions used from computed/methods instead.
export function formatCurrency(value) {
  if (typeof value !== 'number') return value
  return 'NT$ ' + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function toUppercase(value) {
  return String(value || '').toUpperCase()
}
