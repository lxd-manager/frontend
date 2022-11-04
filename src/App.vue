<template>
  <v-app ref="app">
    <v-app-bar app clipped-left dark>
      <v-app-bar-nav-icon>
        <v-avatar color="#121212" size="48">
          <v-img src="@/assets/logo.svg" />
        </v-avatar>
      </v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />

      <v-toolbar-items>
        <v-btn text v-for="(item, i) in items" :key="i" :to="item.link" class="d-none d-md-flex">
          {{ item.title }}
          <v-icon right>{{ item.icon }}</v-icon>
        </v-btn>

        <v-btn icon v-for="(item, i) in items" :key="`icon-${i}`" :to="item.link" class="d-none d-sm-flex d-md-none">
          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>

        <v-divider vertical class="d-none d-sm-flex" />

        <v-btn text target="_blank" :href="helpURL" v-if="helpURL" class="d-none d-md-flex" rel="noopener noreferrer">
          Help
          <v-icon right>mdi-help-circle</v-icon>
        </v-btn>

        <v-btn icon target="_blank" :href="helpURL" v-if="helpURL" class="d-none d-sm-flex d-md-none" rel="noopener noreferrer">
          <v-icon>mdi-help-circle</v-icon>
        </v-btn>

        <v-divider vertical v-if="helpURL" class="d-none d-sm-flex" />

        <v-btn text @click.native="toggleSudo" v-if="superuser" :color="sudoEnabled ? 'error' : ''" class="d-none d-md-flex">
          sudo
          <v-icon right>mdi-sword</v-icon>
        </v-btn>

        <v-btn icon @click.native="toggleSudo" v-if="superuser" :color="sudoEnabled ? 'error' : ''" class="d-none d-sm-flex d-md-none">
          <v-icon>mdi-sword</v-icon>
        </v-btn>

        <v-divider vertical class="d-none d-sm-flex" />

        <v-btn icon @click.native="toggleDarkMode" class="d-none d-sm-flex">
          <v-icon v-if="$vuetify.theme.dark">mdi-brightness-4</v-icon>
          <v-icon v-else>mdi-brightness-7</v-icon>
        </v-btn>

        <v-divider vertical class="d-none d-sm-flex" />

        <v-btn text @click.native="logout" v-if="user" class="d-none d-md-flex">
          Logout ({{ user }})
          <v-icon right>mdi-exit-to-app</v-icon>
        </v-btn>

        <v-btn icon @click.native="logout" v-if="user" class="d-none d-sm-flex d-md-none">
          <v-icon>mdi-exit-to-app</v-icon>
        </v-btn>

        <v-menu :close-on-content-click="false" :nudge-width="200" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" class="d-flex d-sm-none">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-list>
              <v-list-item @click="toggleDarkMode">
                <v-list-item-icon>
                  <v-icon v-if="$vuetify.theme.dark">mdi-brightness-4</v-icon>
                  <v-icon v-else>mdi-brightness-7</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Dark Mode</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item @click="toggleSudo" v-if="superuser">
                <v-list-item-icon>
                  <v-icon :color="sudoEnabled ? 'error' : ''">mdi-sword</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>SUDO Mode</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item @click="logout" v-if="user">
                <v-list-item-icon>
                  <v-icon>mdi-exit-to-app</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Logout</v-list-item-title>
                  <v-list-item-subtitle>{{ user }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider />

              <v-list-item :href="helpURL" target="_blank" v-if="helpURL" rel="noopener noreferrer">
                <v-list-item-icon>
                  <v-icon>mdi-help-circle</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Help</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider v-if="helpURL" />

              <v-list-item v-for="(item, i) in items" link :to="item.link" :key="i">
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',

  data() {
    return {
      items: [{
        icon: 'mdi-cloud',
        title: 'Container',
        link: '/container'
      }, {
        icon: 'mdi-database',
        title: 'Projects',
        link: '/projects'
      }, {
        icon: 'mdi-server-network',
        title: 'Hosts',
        link: '/hosts'
      }, {
        icon: 'mdi-album',
        title: 'Images',
        link: '/images'
      }],
      title: 'LXD Manager',
      superuser: false,
      sudoEnabled: false,
      darkModeEnabled: false,
      user: false,

      helpURL: 'https://lxd-manager.github.io/'
    };
  },

  async mounted() {
    if (!this.$root.$data.session.hasSession()) {
      try {
        const res = await axios.get('/api/user/me/');
        this.$root.$data.session.setSession(res.data);
      } catch {
        await this.logout();
      }
    }

    this.user = this.$root.$data.session.getUsername();
    this.superuser = this.$root.$data.session.getSuperuser();
    this.sudoEnabled = this.$root.$data.session.isSudoEnabled();

    this.darkModeEnabled = this.$root.$data.session.isDarkModeEnabled();
    this.$vuetify.theme.dark = this.darkModeEnabled;
    document.body.style.backgroundColor = this.darkModeEnabled ? '#121212' : 'white';

    this.$router.afterEach((to) => this.setTitle(to.name));
    this.setTitle(this.$router.currentRoute.name);
  },

  methods: {
    async logout() {
      this.$root.$data.session.clearSession();
      try {
        await axios.get('/api-auth/logout/');
      } catch {
        // ignore
      }
      await this.$router.push('/login');
    },

    setTitle(title) {
      this.title = `LXD Manager • ${title}`;
    },

    toggleSudo() {
      this.sudoEnabled = this.$root.$data.session.toggleSudo();
      this.$router.go();
    },

    toggleDarkMode() {
      this.darkModeEnabled = this.$root.$data.session.toggleDarkMode();
      this.$vuetify.theme.dark = this.darkModeEnabled;
      document.body.style.backgroundColor = this.darkModeEnabled ? '#121212' : 'white';
    }
  }
};
</script>
