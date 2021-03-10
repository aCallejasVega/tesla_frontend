export default {
  install(Vue) {
    const notification = {
      success(texto) {
        Vue.prototype.$notify({
          group: 'notification',
          title: 'Éxito',
          text: texto,
          type: 'success'
        });
      },
      error(texto, code) {
        Vue.prototype.$notify({
          group: "notification",
          title: code != null ? "Error: " + code : "Error",
          text: texto,
          type: "error"
        });
      },
      warning(texto) {
        Vue.prototype.$notify({
          group: "notification",
          title: "Advertencia",
          text: texto,
          type: "warning"
        });
      },
    };
    Vue.prototype.$notification = notification;
  }
}