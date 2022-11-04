<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template v-slot:activator="{ on }">
      <v-btn absolute dark fab right color="green" v-on="on" class="mt-3">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Create Project</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field v-model="form.name" ref="name" label="Project name" />
            </v-flex>
            <v-flex xs12>
              <AutoCompleteAPI v-model="form.users" ref="users" text="username" label="Project members" multiple api="/api/user/" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red darken-1" text @click.native="reset">Close</v-btn>
        <v-btn color="red darken-1" text @click.native="create">Create Project</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import AutoCompleteAPI from './AutoCompleteAPI.vue';

export default {
  name: 'CreateProjectDialog',
  components: { AutoCompleteAPI },

  data: () => ({
    dialog: false,

    form: {
      name: '',
      users: []
    }
  }),

  watch: {
    // workaround for broken autofocus
    dialog(val) {
      if (val) {
        requestAnimationFrame(() => {
          this.$refs.name.focus();
        });
      }
    }
  },

  methods: {
    async create() {
      this.$emit('create', {
        name: this.form.name,
        users: this.form.users
      });
      this.reset();
    },

    reset() {
      this.form.name = '';
      this.$refs.users.reset();
      this.dialog = false;
    }
  }
};
</script>
