<template>
  <!--La entidad se reucperará del usuario logueado-->
  <compInvoices :opcion="{ anular: null, reimprimir: true, libro: false}" />
</template>
<script>

import compInvoices from "@/components/Facturacion/Invoices.vue";

export default {
  components: {
    compInvoices,
  }
  
}
</script>