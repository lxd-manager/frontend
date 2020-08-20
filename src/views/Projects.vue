<template>
  <v-container fluid>
    <v-skeleton-loader ref="skeleton" type="table" class="mx-auto" v-show="loading" />
    <v-data-table
            :headers="headers"
            :items="projects"
            v-show="!loading"
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
      <template v-slot:item.users="{ item }">
        <v-chip small v-for="user in item.users" :key="user.username" class="mr-1">
          {{ user.username }}
        </v-chip>
      </template>
      <template v-slot:item.containers="{ item }">
        <container-status :state="container.state" v-for="container in item.containers" :key="container.name" class="mr-1">
          {{ container.name }}
        </container-status>
      </template>
    </v-data-table>

    <ProjectDetailDialog ref="detailDialog" />
    <CreateProjectDialog v-on:create="createProject" />
    <Confirm ref="confirm" />
  </v-container>
</template>

<script>
import axios from 'axios';
import Confirm from '../components/Confirm.vue';
import ContainerStatus from '../components/ContainerStatus.vue';
import CreateProjectDialog from '../components/CreateProjectDialog.vue';
import ProjectDetailDialog from '../components/ProjectDetailDialog.vue';

export default {
  components: {
    Confirm,
    ContainerStatus,
    CreateProjectDialog,
    ProjectDetailDialog
  },

  async mounted() {
    await this.reloadData();
    if (this.$route.params.id) {
      this.showDetails(parseInt(this.$route.params.id, 10));
    }
  },

  data() {
    return {
      loading: false,
      headers: [
        { value: 'name', align: 'left', text: 'Project' },
        { value: 'users', align: 'left', text: 'Users' },
        { value: 'containers', align: 'left', text: 'Containers' },
        { value: 'actions', align: 'left', text: '' }
      ],
      projects: []
    };
  },

  methods: {
    async reloadData() {
      this.loading = true;

      this.projects = (await axios.get('/api/project/')).data;

      this.loading = false;
    },

    async createProject(config) {
      const usersUrl = config.users.map(x => x.url);
      await axios.post('/api/project/', {
        name: config.name,
        users: usersUrl
      });
      setTimeout(this.reloadData, 1000);
    },

    showDetails(projectId) {
      const project = this.projects.find(c => c.id === projectId);
      if (project) {
        const route = `/projects/${projectId}`;
        if (this.$router.currentRoute.path !== route) {
          this.$router.push(route);
        }

        this.$refs.detailDialog.open(project);
      }
    }
  }
};
</script>
