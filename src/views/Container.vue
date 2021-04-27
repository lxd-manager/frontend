<template>
  <v-container fluid>

    <v-card outlined class="mb-5">
      <v-card-actions class="mb-3 pl-5 pr-5">
        <v-text-field v-model="filter" prepend-icon="mdi-filter-outline" label="Filter container list" single-line hide-details @change="persistFilter" />
      </v-card-actions>
    </v-card>

    <v-skeleton-loader ref="skeleton" type="table" class="mx-auto" v-show="loading" />
    <v-data-table
            :headers="headers"
            :items="container"
            v-show="!loading"
            :search="filter"
            hide-default-footer
            disable-pagination
            show-select
            single-select
            class="elevation-1">
      <template v-slot:item.data-table-select="{ item }">
        <v-btn text icon color="green" @click.native="showDetails(item.id)">
          <v-icon>mdi-settings</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.ips="{ item }">
        <ip-status :ip="ip" v-for="ip in item.ips" :key="ip.ip" class="mr-1" />
      </template>
      <template v-slot:item.nesting_enabled="{ item }">
        <v-btn text icon v-if="item.nesting_enabled === 'true'">
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.status="{ item }">
        <container-status :state="item.state" />
      </template>
    </v-data-table>

    <CreateContainerDialog @create="createContainer" />
    <ContainerDetailDialog @action="performAction" ref="detailDialog" />
    <Confirm ref="confirm" />
  </v-container>
</template>

<script>
import axios from 'axios';
import Confirm from '../components/Confirm.vue';
import ContainerStatus from '../components/ContainerStatus.vue';
import IpStatus from '../components/IPStatus.vue';
import CreateContainerDialog from '../components/CreateContainerDialog.vue';
import ContainerDetailDialog from '../components/ContainerDetailDialog.vue';

export default {
  components: {
    Confirm,
    ContainerStatus,
    IpStatus,
    CreateContainerDialog,
    ContainerDetailDialog
  },

  async mounted() {
    this.filter = localStorage.getItem('lxd-filter');
    await this.reloadData();
    if (this.$route.params.id) {
      this.showDetails(parseInt(this.$route.params.id, 10));
    }
  },

  data() {
    return {
      loading: false,
      headers: [
        { value: 'name', align: 'left', text: 'Hostname' },
        { value: 'image', align: 'left', text: 'Image' },
        { value: 'project.name', align: 'left', text: 'Project' },
        { value: 'ips', align: 'left', text: 'IPs' },
        { value: 'host.name', align: 'left', text: 'Host' },
        { value: 'nesting_enabled', align: 'left', text: 'Nesting?' },
        { value: 'status', align: 'left', text: 'Status' },
        { value: 'target_status_code', align: 'left', text: 'Target Status' }
      ],
      container: [],
      filter: ''
    };
  },

  methods: {
    async reloadData(setIndicator = true) {
      if (setIndicator) {
        this.loading = true;
      }

      this.container = (await axios.get('/api/container/')).data.map((row) => {
        row.status = JSON.parse(row.state).status;
        row.config = JSON.parse(row.config);
        row.image = row.config['image.description'];
        return row;
      }).sort((a, b) => a.name.localeCompare(b.name));

      if (setIndicator) {
        this.loading = false;
      }

      const fastUpdate = this.container.some(c => c.target_status_code !== null);
      setTimeout(this.reloadData, fastUpdate ? 7000 : 37000, false);
    },

    async createContainer(config) {
      const ctConfig = { source: { fingerprint: config.image }, config: {} };
      if (config.nesting) {
        ctConfig.config['security.nesting'] = 'true';
      }
      await axios.post('/api/container/', {
        host: config.target,
        name: config.name,
        description: config.description,
        project: config.project,
        config: JSON.stringify(ctConfig)
      });
      setTimeout(this.reloadData, 1000, false);
    },

    async performAction(container, action) {
      if (action === 'delete') {
        await axios.delete(`/api/container/${container.id}/`);
      } else {
        await axios.post(`/api/container/${container.id}/${action}/`);
      }
      setTimeout(this.reloadData, 1000, false);
    },

    showDetails(containerId) {
      const container = this.container.find(c => c.id === containerId);
      if (container) {
        const route = `/container/${containerId}`;
        if (this.$router.currentRoute.path !== route) {
          this.$router.push(route);
        }

        this.$refs.detailDialog.open(container);
      }
    },

    persistFilter() {
        localStorage.setItem('lxd-filter', this.filter);
    }
  }
};
</script>
