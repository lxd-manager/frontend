<template>
  <v-container fluid>
    <v-skeleton-loader type="list-item-avatar, image" class="mx-auto" v-show="loading" />
    <v-card v-for="host in hosts" :key="host.id">
      <v-card-title>
        <v-row>
          <v-col cols="4" sm="4" lg="1">
            <v-icon left>mdi-server-network</v-icon>
            {{ host.name }}
          </v-col>
          <v-col cols="4" sm="3" lg="1">
            <v-chip color="green ${$vuetify.theme.dark ? '' : 'lighten-4'}">
              <v-avatar left :class="`green ${$vuetify.theme.dark ? 'darken-2' : 'lighten-3'}`">
                {{ host.container_states['103'] || '0' }}
              </v-avatar>
              Running Containers
            </v-chip>
          </v-col>
          <v-col cols="4" sm="3" lg="1">
            <v-chip color="red ${$vuetify.theme.dark ? '' : 'lighten-4'}">
              <v-avatar left :class="`red ${$vuetify.theme.dark ? 'darken-2' : 'lighten-3'}`">
                {{ host.container_states['102'] || '0' }}
              </v-avatar>
              Stopped Containers
            </v-chip>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text v-if="host.monitoring_url">
        <v-skeleton-loader type="date-picker-days, date-picker-days, date-picker-days" v-show="!host.monitoringLoaded" />
        <iframe
          :title="`${host.name} monitoring`"
          :src="`${host.monitoring_url}&kiosk&theme=${$vuetify.theme.dark ? 'dark' : 'light'}`"
          @load="loaded(host)"
          v-show="host.monitoringLoaded"
          class="grafana"
          referrerpolicy="no-referrer" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  async mounted() {
    await this.reloadData();
  },

  data() {
    return {
      loading: false,
      hosts: []
    };
  },

  methods: {
    async reloadData() {
      this.loading = true;
      this.hosts = (await axios.get('/api/host/')).data.map((host) => {
        host.monitoringLoaded = false;
        return host;
      }).sort((a, b) => a.name.length - b.name.length || a.name.localeCompare(b.name));
      this.loading = false;
    },

    loaded(host) {
      host.monitoringLoaded = true;
    }
  }
};
</script>

<style scoped>
.grafana {
    border: none;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
    width: 100%;
    height: 260px;
}
</style>
