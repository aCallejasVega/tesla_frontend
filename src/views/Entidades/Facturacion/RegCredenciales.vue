<template>
  <div>
    <a-card style="width: 100%">
      <div
        style="
          border: 2px solid #21618c;
          border-radius: 5px;
          height: 100%;
          width: 100%;
          padding: 1%;
          color: #21618c;
        "
      >
        <a-row type="flex" justify="space-around" align="middle"
          ><a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <h2>
              <b style="color: #21618c"> Registro de Credenciales </b>
            </h2></a-col
          >
        </a-row>
      </div>
      <a-divider orientation="left">{{ sucursalEntidadObj.nombreSucursal }}</a-divider>
      <Credenciales
        :entidadId="sucursalEntidadObj.entidadId"
        :sucursalEntidadId="sucursalEntidadObj.sucursalEntidadId"
      />
    
    </a-card>
  </div>
</template>
<script>
import SucursalesEntidades from "../../../service/Administraciones/SucursalEntidad.service";
import Credenciales from "../../../components/Administracion/CredencialesFacturacion.vue";

export default {
  components: {
    Credenciales,
  },
  data() {
    return {
      sucursalEntidadObj: {},
    };
  },
  mounted() {
    this.cargarSucursalEmiteFactura();
  },
  methods: {
    cargarSucursalEmiteFactura() {
      SucursalesEntidades.getSucursalEmtidadEmiteFacturaTesla()
        .then((r) => {
          this.sucursalEntidadObj = r.data.result;
        })
        .catch((error) => {
          this.sucursalEntidadObj = {};
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },
   
  },
};
</script>