// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import dotenv from 'dotenv'

dotenv.config()

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    public: {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    }
  },
  compatibilityDate: '2026-04-01'
})