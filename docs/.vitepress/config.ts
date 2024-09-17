import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Utween',
  description: 'Animation & Transition',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/litingyes/utween' },
    ],
    search: {
      provider: 'local',
    },
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          {
            text: 'Playground',
            link: '/playground',
          },
        ],
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          {
            text: '演练场',
            link: '/zh/playground',
          },
        ],
      },
    },
  },
})
