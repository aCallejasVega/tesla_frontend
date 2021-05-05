<template>
<div>
  {{opcion}}
  <compInvoices :entidadId="entidadId" :opcion="opcion" />
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
     // opcion: null,
    }
  },
  created() {
    this.entidadId = this.$route.params.entidadId;

    /*this.anular = this.$route.params.anular;
    this.reimprimir = this.$route.params.reimprimir;

    this.opcion = { anular: true,//this.anular, 
                    reimprimir: true,//this.reimprimir, 
                    libro: false}*/

  },
}
</script>