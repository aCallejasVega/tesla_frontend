<template>
  <div>
    <a-row type="flex">
      <a-col span="18">
        <a-select
          mode="multiple"
          v-model="entidadObj.recaudadorIdLst"
          style="width: 100%"
          placeholder="Seleccione las Recaudadoras"
          :loading="loading"
        >
          <a-select-option
            v-for="item in lstRecaudadores"
            :key="item.recaudadorId"
          >
            {{ item.nombre }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col span="6">
        <a-button type="link" @click="abrirRecaudador" icon="plus">
          Nuevo Recaudador
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import Recaudadores from "../../service/Administraciones/Recaudador.service";
export default {
  props: {
    entidadObj: null,
  },
  data() {
    return {
      /**Recaudadora */
      lstRecaudadores: [],
      loading: false,
    };
  },
  mounted() {
    this.cargarRecaudadores();
  },
  methods: {
    cargarRecaudadores() {
      this.$Progress.start();
      this.loading = true;
      Recaudadores.getLstRecaudadores()
        .then((r) => {
          if (r.status === 204) {
            (this.lstRecaudadores = []),
              this.$notification.warning(
                "No se ha encontrado ninguna Recaudador a la que pueda habilitar."
              );
            this.loading = false;
            this.$Progress.finish();
            return;
          }
          this.lstRecaudadores = r.data.result;
          this.loading = false;
          this.$Progress.finish();
        })
        .catch((error) => {
          (this.lstRecaudadores = []), console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.loading = false;
          this.$Progress.fail();
        });
    },
    abrirRecaudador() {
      this.$confirm({
        title: "¿Está seguro de ingresar a Registro de Recaudadores?",
        content: "Considere que los datos se perderán.",
        okText: "Aceptar",
        cancelText: "Cancelar",
        onOk: () => {
          console.log("ok");
          this.$router.push({
            name: "AbmRecaudadores",
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