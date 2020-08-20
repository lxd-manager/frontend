<template>
    <v-chip :color="color" :textColor="textColor" small>
        <slot>{{ ip.ip }}</slot>
    </v-chip>
</template>

<script>
export default {
  name: 'ContainerStatus',

  props: [
    'ip'
  ],

  data: () => ({
    color: '',
    textColor: ''
  }),

  mounted() {
    if (this.ip.container !== this.ip.container_target) {
      this.color = 'gray';
      this.textColor = 'white';
    }
  }
};
</script>
