<template>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">
                    <v-icon>mdi-database</v-icon>
                    {{ project.name }}
                </span>

                <v-btn icon absolute right @click.native="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text>
                <v-list two-line>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>
                                Members

                                <v-menu offset-y max-height="400">
                                    <template v-slot:activator="{ on }">
                                        <v-btn icon absolute right class="mt-n2" v-on="on">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list dense>
                                        <v-subheader>Select user to add</v-subheader>
                                        <v-list-item-group>
                                            <v-list-item v-for="(user, index) in users" :key="index" @click.native="addUser(user)">
                                                <v-list-item-title>
                                                    {{ user.first_name }} {{ user.last_name }} ({{ user.username}})
                                                </v-list-item-title>
                                                <v-list-item-action>
                                                    <v-btn icon>
                                                        <v-icon>mdi-account-plus</v-icon>
                                                    </v-btn>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </v-list-item-group>
                                    </v-list>
                                </v-menu>
                            </v-list-item-title>

                            <v-list dense>
                                <v-list-item-group>
                                    <v-list-item v-for="user in project.users" :key="user.username" >
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                                {{ user.first_name }} {{ user.last_name }} ({{ user.username }})
                                            </v-list-item-subtitle>
                                        </v-list-item-content>

                                        <v-list-item-action>
                                            <v-btn icon @click.native="removeMember(user)">
                                                <v-icon>mdi-account-minus</v-icon>
                                            </v-btn>
                                        </v-list-item-action>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>

            <v-card-text>
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>
                                Containers
                            </v-list-item-title>

                            <v-list dense>
                                <v-list-item v-for="container in project.containers" :key="container.url" :to="`/container/${container.id}`">
                                    <v-list-item-content>
                                        <v-list-item-subtitle>
                                            {{ container.name }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <container-status :state="container.state" />
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
import ContainerStatus from './ContainerStatus.vue';

export default {
  name: 'ProjectDetailDialog',

  components: {
    ContainerStatus
  },

  data: () => ({
    dialog: false,
    project: {},
    users: []
  }),

  watch: {
    dialog(value) {
      if (value === false) {
        this.$router.push('/projects/');
      }
    }
  },

  methods: {
    async open(project) {
      this.project = project;
      this.dialog = true;
      this.users = (await axios.get('/api/user')).data.filter(user => !this.project.users.some(u => u.url === user.url));
    },

    updateMembers(members) {
      return axios.put(this.project.url, {
        users: members
      });
    },

    async removeMember(user) {
      await this.updateMembers(this.project.users.map(u => u.url).filter(u => u !== user.url));
      this.project.users = this.project.users.filter(u => u.url !== user.url);
      this.users.push(user);
    },

    async addUser(user) {
      this.addDialog = false;
      await this.updateMembers([user.url, ...this.project.users.map(u => u.url)]);
      this.users = this.users.filter(u => u.url !== user.url);
      this.project.users.push(user);
    }
  }
};
</script>
