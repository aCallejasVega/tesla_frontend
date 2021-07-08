<template>
  <!--La entidad se reucperará del usuario logueado-->
  <compInvoices :opcion="{ anular: true, reimprimir: false, libro: false, anularErroneo: true }" />
</template>
<script>

import compInvoices from "@/components/Facturacion/Invoices.vue";

export default {
  components: {
    compInvoices,
  }
  
}
</script>