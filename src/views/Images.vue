<template>
  <v-container fluid>
    <v-skeleton-loader ref="skeleton" type="table" class="mx-auto" v-show="loading" />
    <v-data-table
            :headers="headers"
            :items="images"
            v-show="!loading"
            hide-default-footer
            disable-pagination
            show-select
            single-select
            class="elevation-1">
      <template v-slot:item.available="{ item }">
          {{ item.available.map(host => host.name).join(', ') }}
      </template>
    </v-data-table>

    <v-divider />

    <v-card class="mx-auto mt-5" v-if="sudoEnabled">
        <v-card-title>Images to Sync</v-card-title>
        <v-card-text>
            <v-data-table
                :headers="headersSync"
                :items="imagesSync"
                v-show="!loading"
                hide-default-footer
                disable-pagination
                show-select
                single-select
                class="elevation-1" />
        </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {

  async mounted() {
    this.sudoEnabled = this.$root.$data.session.isSudoEnabled();
    await this.reloadData();
  },

  data() {
    return {
      loading: false,
      sudoEnabled: false,
      headers: [
        { value: 'description', align: 'left', text: 'Description' },
        { value: 'available', align: 'left', text: 'Available on' }
      ],
      headersSync: [
        { value: 'protocol', align: 'left', text: 'Protocol' },
        { value: 'server', align: 'left', text: 'Server' },
        { value: 'alias', align: 'left', text: 'Alias' }
      ],
      images: [],
      imagesSync: []
    };
  },

  methods: {
    async reloadData() {
      this.loading = true;

      const images = (await axios.get('/api/image/')).data;
      this.images = images.filter(img => !img.sync);
      this.imagesSync = images.filter(img => img.sync);

      this.loading = false;
    }
  }
};
</script>
