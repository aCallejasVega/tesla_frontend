<template>
  <compSucursalesEntdades :entidadId="entidadId" :nombreEntidad="nombreEntidad" />
</template>
<script>
import compSucursalesEntdades from "../../components/Administracion/SucursalesEntidades.vue";

export default {
  components: {
    compSucursalesEntdades,
  },
  data() {
    return {
      entidadId: null,
      nombreEntidad: null,
    }
  },
  created() {
    this.entidadId = this.$route.params.entidadId;
    this.nombreEntidad = this.$route.params.nombre;
  }
}
</script>


