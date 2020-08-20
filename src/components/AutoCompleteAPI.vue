<template>
    <v-autocomplete v-model="model" :items="entries" ref="input" v-on:focus="load"
                    :loading="isLoading" :search-input.sync="search" :disabled="disabled"
                    hide-no-data :label="label" :autofocus="autofocus" :multiple="multiple"
                    :item-text="text" return-object v-on:input="$emit('input', model)" />
</template>

<script>
import axios from 'axios';

export default {
  name: 'AutoCompleteAPI',

  props: ['label', 'api', 'value', 'text', 'autofocus', 'disabled', 'filter', 'multiple'],

  data: () => ({
    entries: [],
    isLoading: false,
    search: null,
    model: ''
  }),

  watch: {
    search() {
      this.load();
    }
  },

  methods: {
    focus() {
      this.$refs.input.focus();
    },

    reset() {
      this.entries = [];
      this.model = '';
    },

    async load() {
      if (this.entries.length > 0) {
        return;
      }

      this.isLoading = true;

      try {
        const entries = (await axios.get(this.api)).data;

        if (this.filter) {
          this.entries = entries.filter(this.filter);
        } else {
          this.entries = entries;
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
