<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="20">
        <a-card style="width: 100%">
          <a-row>
            <a-col :xs="24" :sm="24" :md="8" :lg="8">
              <h1>Entidades</h1>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12">
              <a-input
                v-model="search"
                @keyup="buscar"
                placeholder="Empresa, Universidad, otro"
              />
            </a-col>
            <a-col :xs="24" :sm="4" :md="4" :lg="4">
              <a-button type="primary" @click="buscar"> Buscar </a-button>
            </a-col>
          </a-row>

          <br/>
          <br/>
          <br/>
          <!--Tipos de Entidades-->
          <div v-if="!displayEntidades">
           
            <a-row type="flex" justify="space-around">
              <a-col :xs="24" :sm="24" :md="12" :lg="6" 
                hoverable
                v-for="(item, i) in lstTipoEntidades"
                :key="i"
                @click="cargarEntidades(item.dominioId)">
                <a-card hoverable>
                  <img
                    slot="cover"
                    :alt="item.abreviatura"
                    :src="item.descripcion"
                  />
                  <a-card-meta :title="item.descripcion">
                  </a-card-meta>
                </a-card>
              </a-col>
            </a-row>
          </div>
          
          <!--Entidades-->
          <div v-if="displayEntidades">

             <a-row type="flex" justify="space-around" :gutter="[32,32]">
              <a-col :xs="24" :sm="12" :md="6" :lg="6" 
                hoverable
                v-for="(item, i) in lstEntidadesFilter"
                :key="i"
                @click="seleccionar(item)">
                 <a-card hoverable>
                  <img slot="cover" :alt="item.nombre" :src="item.pathLogo" />
                  <a-card-meta :title="item.nombre">
                  </a-card-meta>
                </a-card>
              </a-col>
            </a-row>

          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import PaymentDebts from "../../service/Recaudaciones/PaymentDebts.service";
export default {
  data() {
    return { 
      //Tipo Entidades
      lstTipoEntidades: [],
      //Entidades
      displayEntidades: false,
      lstEntidades: [],
      lstEntidadesFilter: [],
      search: null,
    };
  },

  mounted() {
    this.cargarTiposEntidades();
    this.cargarTodasEntidades();
  },

  methods: {
    cargarTiposEntidades() {
      PaymentDebts.cargarTiposEntidades()
        .then((r) => {
          this.lstTipoEntidades = r.data.result;
        })
        .catch((error) => {
            this.$message.error(error.message);
        });
    },

    seleccionar(item) {
      //Todo 
      //localStorage.setItem("entidadId", item.entidadId);
      this.$router.push({
        name: "Debts",
        params: { entidadId: item.entidadId, entidad: item.nombre }
      });
    },
    cargarEntidades(tipo) {
      PaymentDebts.cargarEntidades(tipo)
        .then((r) => {
          this.lstEntidades = r.data.result;
          this.lstEntidadesFilter = this.lstEntidades;
          this.displayEntidades = true;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    buscar() {
      if(this.search.length > 0) {
        this.lstEntidadesFilter = this.lstEntidades.filter((entidad) => {
          return (
            entidad.nombre.includes(this.search.toUpperCase()) ||
            entidad.nombreComercial.includes(this.search.toUpperCase())
          );
        });
        this.displayEntidades = this.lstEntidadesFilter.length > 0;
      }
      else {
        this.displayEntidades = false;
        console.log("displayEntidades=false");
      }


    },
    cargarTodasEntidades() {
      PaymentDebts.cargarTodasEntidades()
        .then((r) => {
          this.lstEntidades = r.data.result;
          this.lstEntidadesFilter = this.lstEntidades;
        })
        .catch((error) => {
          this.$message.error(error.message);              
        });
    },
  },
};
</script>
