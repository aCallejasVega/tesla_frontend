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
          <div v-if="!displayEntidades" style="background: #cfa9df; padding: 50px 50px 50px 50px">
            <div class="wrapper">
              <div class="card" v-for="(item, i) in lstTipoEntidades" :key="i"
                            @click="cargarEntidades(item.dominioId)">
                <img :src="item.abreviatura"/>
                <div class="info">
                  <h1>{{item.descripcion}}</h1>
                </div>
              </div>
            </div>
          </div>
          
          <!--Entidades-->
          <div v-if="displayEntidades" style="background: #cfa9df; padding: 50px 50px 50px 50px">
            <div class="wrapper">
              <div class="card" v-for="(item, i) in lstEntidadesFilter"
                            :key="i"
                            @click="seleccionar(item)">
                <img :src="item.pathLogo"/>
                <div class="info">
                  <h1>{{item.nombre}}</h1>
                </div>
              </div>
            </div>
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
        params: { entidadId: item.entidadId, entidad: item.nombre },
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
      if (this.search.length > 0) {
        this.lstEntidadesFilter = this.lstEntidades.filter((entidad) => {
          return (
            entidad.nombre.includes(this.search.toUpperCase()) ||
            entidad.nombreComercial.includes(this.search.toUpperCase())
          );
        });
        this.displayEntidades = this.lstEntidadesFilter.length > 0;
      } else {
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
<style scoped>
* {
  box-sizing: border-box;
}

body,
html {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: orange;
}

.wrapper {
  display: flex;
  width: 90%;
  justify-content: space-around;
}

.card {
  width: 280px;
  height: 280px;
  border-radius: 15px;
  padding: 1.5rem;
  background: white;
  position: relative;
  display: flex;
  align-items: flex-end;
  transition: 0.4s ease-out;
  box-shadow: 0px 7px 10px rgba(0, 0, 0, 0.5);
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
  border-radius: 15px;
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
  border-radius: 15px;
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
  border-radius: 3px;
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
</style>