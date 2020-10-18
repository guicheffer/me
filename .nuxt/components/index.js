export { default as Logo } from '../../components/Logo.vue'
export { default as VuesaxLogo } from '../../components/VuesaxLogo.vue'

export const LazyLogo = import('../../components/Logo.vue' /* webpackChunkName: "components/Logo" */).then(c => c.default || c)
export const LazyVuesaxLogo = import('../../components/VuesaxLogo.vue' /* webpackChunkName: "components/VuesaxLogo" */).then(c => c.default || c)
