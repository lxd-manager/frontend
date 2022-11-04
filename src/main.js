import Vue from 'vue';
import axios from 'axios';

import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.interceptors.response.use((r) => r, (error) => {
  if (error.response.status === 403) {
    if (error.response.data.detail === 'Authentication credentials were not provided.') {
      if (router.currentRoute.path !== '/login') {
        router.push('/login');
      }
    } else {
      // eslint-disable-next-line no-alert
      alert(`Not authorized?\n${JSON.stringify(error.response.data)}`);
    }
    return false;
  }

  return Promise.reject(error);
});

class Session {
  constructor() {
    this.user = null;
    this.sudo = localStorage.getItem('lxd-sudo') === 'true';
    axios.defaults.headers.common['X-SUDO'] = this.sudo ? '1' : '0';
    this.darkMode = localStorage.getItem('lxd-darkMode') === 'true';
  }

  hasSession() {
    return this.user !== null && this.user !== undefined;
  }

  setSession(user) {
    this.user = user;
  }

  clearSession() {
    this.user = null;
  }

  getUsername() {
    return this.hasSession() ? this.user.username : false;
  }

  getSuperuser() {
    return this.hasSession() ? this.user.superuser : false;
  }

  isSudoEnabled() {
    return this.sudo;
  }

  isDarkModeEnabled() {
    return this.darkMode;
  }

  toggleSudo() {
    this.sudo = !this.sudo;
    localStorage.setItem('lxd-sudo', this.sudo);
    axios.defaults.headers.common['X-SUDO'] = this.sudo ? '1' : '0';
    return this.sudo;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('lxd-darkMode', this.darkMode);
    return this.darkMode;
  }
}

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
  data: { session: new Session() }
}).$mount('#app');
