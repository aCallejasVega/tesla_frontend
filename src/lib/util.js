import moment from "moment";
moment.locale("es");


export default {
  install(Vue) {
    
    /**Notificaciones */
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
      info(texto) {
        Vue.prototype.$notify({
          group: "notification",
          title: "Información",
          text: texto,
          type: "info"
        });
      },
    };
    Vue.prototype.$notification = notification;


    /**Fechas */
    const dates = {
      formaDateWithoutTime(pFecha) {
        if (pFecha != null && pFecha != "")
          return moment(pFecha, "YYYY-MM-DDTHH:mm:ssZ").format(
            "DD/MM/YYYY"
          );
        return "";
      }
    }
    Vue.prototype.$dates = dates;
  }
}