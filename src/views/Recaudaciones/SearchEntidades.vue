<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="20">
        <a-card style="width: 100%;">
          <a-row type="flex" justify="space-around" align="middle">
            <a-col :span="8">
              <h1>Entidades</h1>
            </a-col>
            <a-col :span="12">
              <a-input
                v-model="search"
                @keyup="buscar"
                placeholder="Empresa, Universidad, otro"
              />
            </a-col>
            <a-col :span="4">
              <a-button type="primary" @click="buscar"> Buscar </a-button>
            </a-col>
          </a-row>

          <br/>
          <br/>
          <br/>
          <!--Tipos de Entidades-->
          <div v-if="!displayEntidades">

           
             <a-row type="flex" justify="space-around">
              <a-col :span="6" hoverable
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
<!--
            <a-row :gutter="32">
              <a-col
                :span="24"
                hoverable
                style="width: 20%"
                v-for="(item, i) in lstTipoEntidades"
                :key="i"
                @click="cargarEntidades(item.dominioId)"
              >
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

            -->
          </div>
          
          <!--Entidades-->
          <div v-if="displayEntidades">

             <a-row type="flex" justify="space-around">
              <a-col :span="6" hoverable
                style="width: 20%"
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
export default {
  data() {
    return {
      token: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },

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
    cargarTiposEntidades(item) {
      try {
        this.$http
          .get("http://localhost:9080/entidades/tipos", this.token)
          .then((r) => {
            if (r.status == 200) {
              this.lstTipoEntidades = r.data.result;
            }
            console.log(r.data.result);
          });
      } catch (e) {
        console.log(e);
      }
    },

    seleccionar(item) {
      localStorage.setItem("entidadId", item.entidadId);
      this.$router.push({
        name: "Debts",
      });
    },
    cargarEntidades(tipo) {
      console.log(tipo);
      this.$http
        .get("http://localhost:9080/entidades/tipos/" + tipo, this.token)
        .then((r) => {
          console.log('cargar entidades')
          console.log(r.data)
          if (r.status == 200) {
            this.lstEntidades = r.data.result;
            this.lstEntidadesFilter = this.lstEntidades;
            this.displayEntidades = true;
          }
        });
    },
    buscar() {
      if (this.search != null) {
        this.lstEntidadesFilter = this.lstEntidades.filter((entidad) => {
          return (
            entidad.nombre.includes(this.search.toUpperCase()) ||
            entidad.nombreComercial.includes(this.search.toUpperCase())
          );
        })
        this.displayEntidades = this.lstEntidadesFilter.length > 0
      }
      if (this.search == ''){
        this.displayEntidades = false
        console.log('displayEntidades=false')
      }
      
      console.log("buscando");
    },
    cargarTodasEntidades() {
      try {
        this.$http
          .get("http://localhost:9080/entidades", this.token)
          .then((r) => {
            console.log("dasdas");
            console.log(r.data);
            if (r.status == 200) {
              this.lstEntidades = r.data.result;
              this.lstEntidadesFilter = this.lstEntidades;
            }
            console.log(r.data.result);
          });
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
