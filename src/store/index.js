import Vue from 'vue';
import Vuex from 'vuex';
import decode from 'jwt-decode';
import router from '../router/index';
import AdmStore from './AdministracionStore';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    usuario: null,
    authorities:[]
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUsuario(state, usuario) {
      state.usuario = usuario;
    },
    setAuthorities(state, authorities) {
      state.authorities = authorities;
    },
  },
  actions: {
    guardarToken({ commit }, token) {
      
      commit('setToken', token);
      const usuario = decode(token);
      commit('setUsuario', usuario.user_name);
      commit('setAuthorities', usuario.authorities);
      localStorage.setItem('token', token);
      

    },
    activarSesion({ commit }, token) {
      
      commit('setToken', token);
      const usuario = decode(token);
      commit('setUsuario', usuario.user_name);
      commit('setAuthorities', usuario.authorities);
    },
    autoLogin({ commit }) {
      
      const token = localStorage.getItem('token');
      if (token) {
        commit('setToken', token);
        const usuario = decode(token);
        commit('setUsuario', usuario.user_name);
        commit('setAuthorities', usuario.authorities);
      }
      router.push({ name: 'home' });
    },
    salir({ commit }) {
      
      commit('setToken', null);
      commit('setUsuario', null);
      localStorage.removeItem('token');
      router.push({ name: 'login' });
    },
    autoLoginRoot({ commit }) {
      
      const token = localStorage.getItem('token');
      if (token) {
        commit('setToken', token);
        const usuario = decode(token);
        commit('setUsuario', usuario.user_name);
        commit('setAuthorities', usuario.authorities);
      }
      
    },
  },
  modules: {
    AdmStore,
  },
});
