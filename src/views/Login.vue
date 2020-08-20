<template>
    <v-dialog persistent max-width="500px" value="true">
        <v-card>
            <v-card-title>
                <span class="headline">Login</span>
            </v-card-title>

            <v-card-text>
                <v-btn block large dark color="#A32638" @click.native="gitlab">Sign in with GitLab</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: 'Login',

  mounted() {
    setTimeout(() => {
      if (this.$root.$data.session.hasSession()) {
        this.$router.push('/');
      }
    }, 200);
  },

  methods: {
    gitlab() {
      if (window.location.hostname === 'localhost') {
        // eslint-disable-next-line no-alert
        const sessionid = prompt('sessionid');
        if (sessionid) {
          document.cookie = `sessionid=${sessionid}; expires=${new Date(new Date().getTime() + 604800000).toUTCString()}; path=/`;
        }
        this.$router.push('/');
      } else {
        window.location.href = '/social-auth/login/gitlab/';
      }
    }
  }
};
</script>
