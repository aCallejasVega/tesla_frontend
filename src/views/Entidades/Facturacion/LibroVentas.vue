<template>
  <!--La entidad se reucperará del usuario logueado-->
  <compInvoices :opcion="{ anular: null, reimprimir: null, libro: true}" />
</template>
<script>

import compInvoices from "@/components/Facturacion/Invoices.vue";

export default {
  components: {
    compInvoices,
  }
  
}
</script>