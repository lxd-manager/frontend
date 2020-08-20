<template>
    <v-chip :color="color" :textColor="textColor" small>
        <slot>{{ status }} ({{ code }})</slot>
    </v-chip>
</template>

<script>
export default {
  name: 'ContainerStatus',

  props: {
    state: String
  },

  data: () => ({
    code: '',
    status: '',
    color: '',
    textColor: ''
  }),

  mounted() {
    const state = JSON.parse(this.state);
    this.status = state.status;
    this.code = state.status_code;

    switch (this.status) {
      case 'Running':
        this.color = 'green';
        this.textColor = 'white';
        break;

      default:
    }
  }
};
</script>
