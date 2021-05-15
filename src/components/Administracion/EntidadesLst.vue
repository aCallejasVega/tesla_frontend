<template>
  <div>
    <a-row type="flex">
      <a-col span="18">
        <a-select
          mode="multiple"
          v-model="recaudadorObj.entidadIdLst"
          placeholder="Seleccione las Recaudadoras"
          style="width: 100%"
        >
          <a-select-option v-for="item in lstEntidades" :key="item.entidadId">
            {{ item.nombre }}  *{{item.estado}}*
          </a-select-option>
        </a-select>
      </a-col>
      <a-col span="6">
        <a-button type="link" @click="abrirEntidad" icon="plus">
          Nueva Entidad
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import Entidades from "../../service/Administraciones/Entidad.service";
export default {
  props: {
    recaudadorObj: null,
  },
  data() {
    return {
      /**Entidades */
      lstEntidades: [],
    };
  },
  mounted() {
    this.cargarEntidades();
  },
  methods: {
    /**Entidaes */
    cargarEntidades() {
      this.$Progress.start();
      Entidades.getLstEntidad()
        .then((r) => {
          if (r.status === 204) {
            (this.lstEntidades = []),
              this.$notification.warning(
                "No se ha encontrado ninguna Entidad registrada"
              );
            this.$Progress.finish();
            return;
          }

          this.lstEntidades = r.data.result;
          //Obtener solo Activos y creados
          this.lstEntidades = this.lstEntidades.filter((rec) => {
            return (rec.estado == 'ACTIVO' || rec.estado == 'CREADO');
          });
          this.$Progress.finish();
        })
        .catch((error) => {
          (this.lstEntidades = []), console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },
    abrirEntidad() {
      this.$confirm({
        title: "¿Está seguro de ingresar a Registro de Entidades?",
        content: "Considere que los datos se perderán.",
        okText: "Aceptar",
        cancelText: "Cancelar",
        onOk: () => {
          console.log("ok");
          this.$router.push({
            name: "AbmEntidades",
          });
        },
        onCancel() {
          console.log("Cancel");
        },
        class: "test",
      });
    },
  },
};
</script>