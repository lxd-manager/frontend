<template>
    <v-dialog v-model="dialog" :max-width="options.width" @keydown.esc="cancel">
        <v-card>
            <v-toolbar dark :color="options.color" dense text>
                <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text v-show="!!message" style="white-space: pre-wrap;">{{ message }}</v-card-text>
            <v-card-actions class="pt-0">
                <v-spacer></v-spacer>
                <v-btn v-if="!options.alert" color="primary darken-1" text="text" @click.native="agree">Yes</v-btn>
                <v-btn v-if="!options.alert" color="grey" text="text" @click.native="cancel">Cancel</v-btn>
                <v-btn v-if="options.alert" color="grey" text="text" @click.native="cancel">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
// based on https://gist.github.com/eolant/ba0f8a5c9135d1a146e1db575276177d

export default {
  name: 'Confirm',

  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      color: 'primary',
      width: 290,
      alert: false
    }
  }),

  methods: {
    open(title, message, options) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },

    agree() {
      this.resolve(true);
      this.dialog = false;
    },

    cancel() {
      this.resolve(false);
      this.dialog = false;
    }
  }
};
</script>
