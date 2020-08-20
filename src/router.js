import Vue from 'vue';
import Router from 'vue-router';
import Container from './views/Container.vue';
import Projects from './views/Projects.vue';
import Images from './views/Images.vue';
import Hosts from './views/Hosts.vue';
import Login from './views/Login.vue';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/container',
    name: 'Container Overview',
    component: Container
  }, {
    path: '/container/:id',
    name: 'Container Detail View',
    component: Container
  }, {
    path: '/projects',
    name: 'Project Overview',
    component: Projects
  }, {
    path: '/projects/:id',
    name: 'Project Detail View',
    component: Projects
  }, {
    path: '/hosts',
    name: 'Host Overview',
    component: Hosts
  }, {
    path: '/images',
    name: 'Image Overview',
    component: Images
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/',
    redirect: '/container'
  }]
});
