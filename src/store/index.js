import Vue from 'vue';
import Vuex from 'vuex';
import decode from 'jwt-decode';
import router from '../router/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    usuario: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUsuario(state, usuario) {
      state.usuario = usuario;
    },
  },
  actions: {
    guardarToken({ commit }, token) {
      commit('setToken', token);
      const usuario = decode(token);
      commit('setUsuario', usuario.user_name);
      localStorage.setItem('token', token);
    },
    activarSesion({ commit }, token) {
      commit('setToken', token);
      const usuario = decode(token);
      commit('setUsuario', usuario.user_name);
    },
    autoLogin({ commit }) {
      const token = localStorage.getItem('token');
      if (token) {
        commit('setToken', token);
        const usuario = decode(token);
        commit('setUsuario', usuario.user_name);
      }
      router.push({ name: 'home' });
    },
    salir({ commit }) {
      commit('setToken', null);
      commit('setUsuario', null);
      localStorage.removeItem('token');
      router.push({ name: 'login' });
    },
  },
  modules: {},
});
