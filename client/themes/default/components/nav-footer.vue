<template lang="pug">
  footer.justify-center(color='white')
    h1 Green Campaign Handbook
    .caption.grey--text.subtitle
      strong European Green Party
    .caption.grey--text
      template(v-if='company && company.length > 0 && contentLicense !== ``')
        span(v-if='contentLicense === `alr`') {{ $t('common:footer.copyright', { company: company, year: currentYear, interpolation: { escapeValue: false } }) }} |&nbsp;
        span(v-else) {{ $t('common:footer.license', { company: company, license: $t('common:license.' + contentLicense), interpolation: { escapeValue: false } }) }}
      div
        span Developed by #[a(href='https://joppehoekstra.nl', ref='nofollow') Joppe Hoekstra]. {{ $t('common:footer.poweredBy') }} #[a(href='https://wiki.js.org', ref='nofollow') Wiki.js]
</template>

<script>
import { get } from 'vuex-pathify'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  breaks: false,
  linkify: true
})

export default {
  props: {
    color: {
      type: String,
      default: 'grey lighten-3'
    },
    darkColor: {
      type: String,
      default: 'grey darken-3'
    }
  },
  data() {
    return {
      currentYear: (new Date()).getFullYear()
    }
  },
  computed: {
    company: get('site/company'),
    contentLicense: get('site/contentLicense'),
    footerOverride: get('site/footerOverride'),
    footerOverrideRender() {
      if (!this.footerOverride) { return '' }
      return md.renderInline(this.footerOverride)
    },
    bgColor() {
      if (!this.$vuetify.theme.dark) {
        return this.color
      } else {
        return this.darkColor
      }
    }
  }
}
</script>

<style lang="scss">
footer {
  h1 {
    font-size: 1.5em
  }

  h1,
  strong {
    color: #727272 !important;
  }

  .subtitle {
    margin-bottom: 8px
  }

  a {
    color: #9e9e9e !important;
    text-decoration: none;
  }
}</style>
