<template lang="pug">
  footer.justify-center(color='white')
    h2 Green Campaign Handbook
    .caption.grey--text(:class='$vuetify.theme.dark ? `text--lighten-1` : `text--darken-1`')
      template(v-if='company && company.length > 0 && contentLicense !== ``')
        span(v-if='contentLicense === `alr`') {{ $t('common:footer.copyright', { company: company, year: currentYear, interpolation: { escapeValue: false } }) }} |&nbsp;
        span(v-else) {{ $t('common:footer.license', { company: company, license: $t('common:license.' + contentLicense), interpolation: { escapeValue: false } }) }}
      div
        span Developed by #[a(href='https://joppehoekstra.nl', ref='nofollow') Joppe Hoekstra] |&nbsp;
        span {{ $t('common:footer.poweredBy') }} #[a(href='https://wiki.js.org', ref='nofollow') Wiki.js]
</template>

<script>
import { get } from 'vuex-pathify'

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
footer a{
  color: #757575 !important;
  text-decoration: none;
}
</style>
