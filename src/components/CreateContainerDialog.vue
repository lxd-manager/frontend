<template>
  <v-dialog v-model="dialog" persistent max-width="900px">
    <template v-slot:activator="{ on }">
      <v-btn absolute dark fab right color="green" v-on="on" class="mt-3">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Create Container</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex md6>
              <v-text-field v-model="form.name" ref="name" label="Hostname" />
              <AutoCompleteAPI v-model="form.project" ref="project" text="name" label="Project" api="/api/project/" />
              <AutoCompleteAPI v-model="form.target" ref="target" text="name" label="Target" api="/api/host/" />
              <AutoCompleteAPI
                v-model="form.image"
                ref="image"
                text="description"
                label="Image"
                api="/api/image/"
                :disabled="!form.target"
                :filter="filterImages" />

              <v-card outlined>
                <v-list-item>
                  <v-list-item-content>
                    <div class="overline">Properties</div>
                  </v-list-item-content>
                </v-list-item>

                <v-card-actions>
                  <v-checkbox label="Nesting enabled?" v-model="form.nesting" />
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex md6>
              <v-textarea filled rows="15" v-model="form.description" label="Description" class="font-mono" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red darken-1" text @click.native="reset">Close</v-btn>
        <v-btn color="red darken-1" text @click.native="create">Create Container</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import AutoCompleteAPI from './AutoCompleteAPI.vue';

export default {
  name: 'CreateContainerDialog',
  components: { AutoCompleteAPI },

  data: () => ({
    dialog: false,

    form: {
      name: '',
      image: '',
      target: '',
      project: '',
      description: '',
      nesting: false
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
        description: this.form.description,
        image: this.form.image.fingerprint,
        target: this.form.target.url,
        project: this.form.project.url,
        nesting: this.form.nesting
      });
      this.reset();
    },

    reset() {
      this.form.name = '';
      this.form.description = '';
      this.form.nesting = false;
      this.$refs.target.reset();
      this.$refs.image.reset();
      this.dialog = false;
    },

    filterImages(image) {
      return this.form.target.images.includes(image.url);
    }
  }
};
</script>

<style scoped>
    .font-mono {
        font-family: monospace;
    }
</style>
