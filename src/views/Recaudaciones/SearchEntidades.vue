<template>
  <div>
    <a-card style="width: 100%">
       <div
        class="card-head"
      >
        <a-row type="flex" justify="space-around" align="middle"
          ><a-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
            <h2><b style="color: #086346">Búsqueda de Entidad</b></h2></a-col
          >
          <a-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
            <a-row type="flex" justify="end">
              <a-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4"
                ><b>Buscar por :</b></a-col
              >
              <a-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20">
                <a-input-search
                  v-model="search"
                  placeholder="Empresa, Universidad, Colegio, otro..."
                  @keyup="buscar"
                  @search="buscar"
                  enter-button=" Buscar "
                  :maxLength="50"
                />
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <!--Tipos de Entidades-->
    </a-card>
    <a-card style="width: 100%">
      <template slot="actions" class="ant-card-actions">
        <div style="width: 100%">
          <a-row type="flex" justify="center">
            <a-col
              :xs="{ span: 24 }"
              :sm="{ span: 24 }"
              :md="{ span: 12 }"
              :lg="{ span: 6 }"
              hoverable
              v-for="(item, i) in lstTipoEntidades"
              :key="i"
              @click="cargarEntidades(item.dominioId)"
            >
              <a-card hoverable>
                <a-card-meta :title="item.descripcion">
                  <a-avatar slot="avatar" :src="item.imagen64" :size="44"/>
                </a-card-meta>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </template>
    </a-card>
    <a-card style="width: 100%">
      <!--Entidades-->
      <div v-if="displayEntidades" style="width: 100%">
        <div >
          <a-row type="flex" justify="center">
            <a-col
              :xs="24"
              :sm="24"
              :md="12"
              :lg="6"
              class="card"
              v-for="(item, i) in lstEntidadesFilter"
              :key="i"
              @click="seleccionar(item)"
            >
              <img :src="item.imagen64" />
              <div>
                <h1>{{ item.nombre }}</h1>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script>
import PaymentDebts from "../../service/Recaudaciones/PaymentDebts.service";
export default {
  data() {
    return {
      /**Datos */
      lstTipoEntidades: [],
      lstEntidades: [],
      lstEntidadesFilter: [],
      search: "",
      /**Visaulizaciones */
      displayEntidades: false,
      disableCard: null,
    };
  },

  mounted() {
    this.cargarTiposEntidades();
    this.cargarTodasEntidades();
  },

  methods: {
    /**Datos */
    cargarTodasEntidades() {
      PaymentDebts.cargarTodasEntidades()
        .then((r) => {
          console.log('todas')
          console.log(r)
          if(r.status === 204) {
            this.lstEntidades = [];
            this.lstEntidadesFilter = this.lstEntidades;
            this.$notification.warning("No existe Entidades asociadas a la Recaudadora");
            return;
          }

          this.lstEntidades = r.data.result;
          this.lstEntidadesFilter = this.lstEntidades;
          this.$notification.success(r.data.message);
        })
        .catch((error) => {
          this.lstEntidades = [];
          this.lstEntidadesFilter = this.lstEntidades;
          this.$notification.error(error.response.data.message,error.response.data.code);

        });
    },
    cargarTiposEntidades() {
      PaymentDebts.cargarTiposEntidades()
        .then((r) => {
          console.log(r)
          //el control status==204 se visializara en cargado de entidades, para evitar duplicidad 
          this.lstTipoEntidades = r.data.result;
        })
        .catch((error) => {
          this.lstTipoEntidades = [];
          this.$notification.error(error.response.data.message,error.response.data.code);
        });
    },
    cargarEntidades(tipo) {
      this.search = "";
      PaymentDebts.cargarEntidades(tipo)
        .then((r) => {
          //el control status==204 se visializara en cargado de entidades, para evitar duplicidad
          this.lstEntidadesFilter = r.data.result;
          this.displayEntidades = true;
        })
        .catch((error) => {
          this.lstEntidadesFilter = [],
          this.$notification.error(error.response.data.message,error.response.data.code);
        });
    },
    /**Acciones*/
    seleccionar(item) {
      this.$router.push({
        name: "Debts",
        params: { entidadId: item.entidadId },
      });
    },   
    buscar() {
      if (this.search.length > 0) {
        this.lstEntidadesFilter = this.lstEntidades.filter((entidad) => {
          if (entidad.nombreComercial != null) {
            return (
              entidad.nombre.includes(this.search.toUpperCase()) ||
              entidad.nombre.includes(this.search.toLowerCase()) ||
              entidad.nombreComercial.includes(this.search.toUpperCase()) ||
              entidad.nombreComercial.includes(this.search.toLowerCase())
            );
          } else {
            return (
              entidad.nombre.includes(this.search.toUpperCase()) ||
              entidad.nombre.includes(this.search.toLowerCase())
            );
          }
        });
        this.displayEntidades = this.lstEntidadesFilter.length > 0;
      } else {
        this.displayEntidades = false;
      }

      console.log(this.lstEntidadesFilter)
    },
  },
};
</script>

<style scoped>

.wrapper {
  display: flex;
  width: 100%;
  justify-content: space-around;
}

.card {
  width: 180px;
  height: 180px;
  border-radius: 3px;
  padding: 1.5rem;
  background: white;
  position: relative;
  display: flex;
  align-items: flex-end;
  transition: 0.4s ease-out;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.5);
}
.card:hover {
  transform: translateY(20px);
}
.card:hover:before {
  opacity: 1;
}
.card:hover .info {
  opacity: 1;
  transform: translateY(0px);
}
.card:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2;
  transition: 0.5s;
  opacity: 0;
}
.card img {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3px;
}
.card .info {
  position: relative;
  z-index: 3;
  color: white;
  opacity: 0;
  transform: translateY(30px);
  transition: 0.5s;
}
.card .info h1 {
  margin: 0px;
}
.card .info p {
  letter-spacing: 1px;
  font-size: 15px;
  margin-top: 8px;
}
.card .info button {
  padding: 0.6rem;
  outline: none;
  border: none;
  border-radius: 5px;
  background: white;
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: 0.4s ease;
}
.card .info button:hover {
  background: dodgerblue;
  color: white;
}
.card-head {
  border: 2px solid #086346;
  border-radius: 8px;
  height: 55px;
  width: 100%;
  padding: 1%;
  color: #086346;
}
</style>