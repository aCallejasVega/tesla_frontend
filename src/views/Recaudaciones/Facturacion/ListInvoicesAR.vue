<template>
<div>
  <compInvoices :entidadId="entidadId" :opcion="{ anular: true, reimprimir: true, libro: false, anularErroneo: false }" />
</div>
</template>
<script>

import compInvoices from "@/components/Facturacion/Invoices.vue";

export default {
  components: {
    compInvoices,
  },
  data() {
    return {
      entidadId: null,
    }
  },
  created() {
    this.entidadId = this.$route.params.entidadId;
  },
}
</script>