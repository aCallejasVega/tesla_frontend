<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout>
      <Sidebar />
      <a-layout>
        <Header />
        <a-layout-content style="margin: 0 16px; background-color: #fcfafa">
          <router-view> </router-view>
           <a-alert
              :message="title"
              :description="description"
              :type="type"
              show-icon
              v-if="displayAlerta"
            />
        </a-layout-content>
        <Footer />
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import Footer from "@/components/Home/Footer.vue";
import Header from "@/components/Home/Header.vue";
import Sidebar from "@/components/Home/Sidebar.vue";
import Dosificaciones from "../../service/Facturacion/Dosages.service";

export default {
  components: {
    Footer,
    Header,
    Sidebar,
  },
  data() {
    return {
      title:null,
      description:null,
      type:null,
      displayAlerta: false,
    }
  },
  mounted() {
      this.cargarDosificacionesAlertas();
  },
  methods: {
      cargarDosificacionesAlertas() {
        Dosificaciones.getDosificacionesLstAlertas()
          .then((r) => {
            if (r.status === 204) {
              return;
            }  
            console.log(r.data.result);
            if(r.data.result != null) {
              let lstDosificaciones = r.data.result;
              if(lstDosificaciones.length > 0) {
                let msg = '';
                for(let i=0; i < lstDosificaciones.length; i++){
                  console.log(lstDosificaciones[i].fechaLimiteEmision);
                  msg = msg + '\n Sucursal: '+ lstDosificaciones[i].nombreSucursal + 
                        ' - Fecha Límite Emisión: ' + this.$dates.formaDateWithoutTime(lstDosificaciones[i].fechaLimiteEmision) +
                        ' - Código Actividada Económica: '+ lstDosificaciones[i].codigoActividadEconomica;
                }
                this.title = "Dosificaciones a Vencer"
                this.description = msg;
                this.type = "info";
                this.displayAlerta = true;  
              }
            }
          })
          .catch((error) => {
            console.log(error);
            this.$notification.error(error.response.data.message, error.response.data.code);
          });
      },
    },

};
</script>

<style>
#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
