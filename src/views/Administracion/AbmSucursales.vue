<template>
  <compSucursales :recaudadorId="recaudadorId" :nombreRecaudador="nombreRecaudador" />
</template>
<script>
import compSucursales from "../../components/Administracion/Sucursales.vue";

export default {
  components: {
    compSucursales,
  },
  data() {
    return {
      recaudadorId: null,
      nombreRecaudador: null,
    }
  },
  created() {
    this.recaudadorId = this.$route.params.recaudadorId;
    this.nombreRecaudador = this.$route.params.nombre;
  },  
}
</script>


