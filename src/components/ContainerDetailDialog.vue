<template>
  <v-dialog v-model="dialog" max-width="900px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ container.name }}</span>
        <v-btn icon absolute right @click.native="dialog = false">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex md6>
              <v-list two-line>
                <v-list-item v-if="container.project">
                  <v-list-item-content>
                    <v-list-item-title>
                      Project

                      <v-menu offset-y max-height="400">
                        <template v-slot:activator="{ on }">
                          <v-btn icon absolute right class="mt-n2" v-on="on">
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <v-list dense>
                          <v-subheader>Assign to different Project</v-subheader>
                          <v-list-item-group>
                            <v-list-item v-for="(item, index) in projects" :key="index" @click.native="changeProject(item)">
                              <v-list-item-title>
                                {{ item.name }}
                              </v-list-item-title>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-menu>
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ container.project.name }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Image</v-list-item-title>
                    <v-list-item-subtitle>{{ container.image }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="container.host">
                  <v-list-item-content>
                    <v-list-item-title>Host</v-list-item-title>
                    <v-list-item-subtitle>{{ container.host.name }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      IP Addresses

                      <v-menu offset-y max-height="400">
                        <template v-slot:activator="{ on }">
                          <v-btn icon absolute right class="mt-n2" v-on="on">
                            <v-icon color="green">mdi-plus-circle</v-icon>
                          </v-btn>
                        </template>
                        <v-list dense>
                          <v-subheader>Add IP Address</v-subheader>
                          <v-list-item-group>
                            <v-list-item v-for="(item, index) in ips" :key="index" @click.native="addIP(item)">
                              <v-list-item-title class="pr-4">
                                <pre>{{ item.ip }}</pre>
                              </v-list-item-title>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-menu>
                    </v-list-item-title>

                    <v-list dense>
                      <v-list-item v-for="addr in container.ips" :key="addr.ip">
                        <v-list-item-content>
                          <v-list-item-title>
                            <span class="font-mono">{{ addr.ip }}/{{ addr.prefixlen }}</span>
                            <v-chip x-small v-show="!addr.container" class="ml-2">pending add</v-chip>
                            <v-chip x-small v-show="!addr.container_target" class="ml-2">pending del</v-chip>
                          </v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-action v-if="addr.is_ipv4 && addr.container_target">
                          <v-btn icon @click.native="removeIP(addr)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Security</v-list-item-title>
                    <v-list dense disabled>
                      <v-list-item-group>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-subtitle>Nesting</v-list-item-subtitle>
                          </v-list-item-content>

                          <v-list-item-action>
                            <v-btn icon v-if="container.nesting_enabled === 'true'">
                              <v-icon>mdi-check</v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-flex>
            <v-flex md6>
              <v-list two-line>
                <v-list-item v-if="container.project">
                  <v-list-item-content>
                    <v-list-item-title>
                      Description

                      <v-btn icon absolute right class="mt-n2" v-show="!editDescription" @click.native="editDescription = true">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>

                      <v-btn icon absolute right class="mt-n2" v-show="editDescription" @click.native="changeDescription()">
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-sheet elevation="2" class="pa-4" v-show="!editDescription">
                <div v-html="compiledMarkdown" />
              </v-sheet>
              <v-textarea filled v-show="editDescription" rows="9" v-model="container.description" class="font-mono" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="success" @click.native="performAction('start')" v-if="container.status === 'Stopped'">
          Start
          <v-icon right dark>mdi-play</v-icon>
        </v-btn>
        <v-btn color="error" @click.native="performAction('delete')" v-if="container.status === 'Stopped' || container.status === 'Created'">
          Delete
          <v-icon right dark>mdi-delete</v-icon>
        </v-btn>
        <v-btn color="error" @click.native="performAction('stop')" v-if="container.status === 'Running'">
          Stop
          <v-icon right dark>mdi-stop</v-icon>
        </v-btn>
        <v-btn color="warning" @click.native="performAction('restart')" v-if="container.status === 'Running'">
          Restart
          <v-icon right dark>mdi-replay</v-icon>
        </v-btn>
        <v-btn color="warning" @click.native="performAction('redeploy_keys')" v-if="container.status === 'Running'">
          Redeploy Keys
          <v-icon right dark>mdi-account-key</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <Confirm ref="confirm" />
  </v-dialog>
</template>

<script>
import axios from 'axios';
import { marked } from 'marked';
import Confirm from './Confirm.vue';

export default {
  name: 'ContainerDetailDialog',

  components: { Confirm },

  data: () => ({
    dialog: false,
    editDescription: false,
    container: {},
    ips: [],
    projects: []
  }),

  async mounted() {
    this.ips = (await axios.get('/api/ip/')).data
      .filter((ip) => ip.container === null && ip.siit_map === null && ip.container_target === null && ip.is_ipv4);

    this.projects = (await axios.get('/api/project/')).data;
  },

  computed: {
    compiledMarkdown() {
      if (!this.container || !this.container.description) {
        return '';
      }
      return marked.parse(this.container.description);
    }
  },

  watch: {
    dialog(value) {
      if (value === false) {
        this.$router.push('/container/');
      }
    }
  },

  methods: {
    async performAction(action) {
      if (action !== 'start') {
        if (!await this.$refs.confirm.open(`${action} container ${this.container.name}`, 'Are you sure?', { color: 'warning' })) {
          return;
        }
      }
      this.dialog = false;
      this.$emit('action', this.container, action);
    },

    open(container) {
      this.container = container;
      this.dialog = true;
    },

    async addIP(ip) {
      try {
        const req = await axios.put(ip.url, {
          container_target: this.container.url,
          prefixlen: ip.prefixlen,
          ip: ip.ip
        });

        this.ips = this.ips.filter((e) => e !== ip);
        this.container.ips.push(req.data);
      } catch (e) {
        this.$refs.confirm.open(`Could not assign ${ip} to container ${this.container.name}`, e.response, {
          color: 'warning',
          alert: true
        });
      }
    },

    async removeIP(ip) {
      const req = await axios.put(ip.url, {
        container_target: null,
        prefixlen: ip.prefixlen,
        ip: ip.ip
      });

      this.ips.push(req.data);
      ip.container_target = null;
    },

    async changeProject(newProject) {
      await axios.put(this.container.url, {
        project: newProject.url
      });
      this.container.project = newProject;
    },

    async changeDescription() {
      this.editDescription = false;
      await axios.put(this.container.url, {
        description: this.container.description
      });
    }
  }
};
</script>

<style scoped>
    .font-mono {
        font-family: monospace;
    }
</style>
