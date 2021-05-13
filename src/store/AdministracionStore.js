export default {
  namespaced:true,
  state: {
    dataStore: {   
    },
  },
  mutations: {
    setDataStore(state, dataStore) {
      state.dataStore = dataStore;
    }
  },
  actions: {
    almacenarDataStore({ commit }, dataStore) {
    
      commit('setDataStore', dataStore);
    },
  },
  getters: {
    getDataStore(state) {
     
      return state.dataStore;
    }
  },

};
