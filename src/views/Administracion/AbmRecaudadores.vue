<template>
  <div>
    <div v-if="!displayForm"
        style="
          border: 2px solid #21618c;
          border-radius: 5px;
          height: 100%;
          width: 100%;
          padding: 1%;
          color: #21618c;
        "
      >
        <a-row type="flex" justify="space-around" align="middle"
          ><a-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
            <h2><b style="color: #21618c"> Administración de Registro de Recaudadores </b></h2></a-col
          >
          <a-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14" align="right">
            <a-row type="flex" justify="end">
              <a-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20" align="right">
               <a-input-search
                  v-model="search"
                  placeholder="Buscar por nombre..."
                  @search="filterTable"
                  enter-button=" Buscar "
                  :maxLength="50"
                />
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
   
    <a-card v-if="!displayForm" style="width: 100%">
      <template slot="actions" class="ant-card-actions">
        <b>{{filter}}</b>
        <a-button-group>
          <a-button
            v-for="(item, i) in lstOpciones"
            :key="i"
            @click="seleccionarOpcion(item.transaccion)"
            type ="primary"
          >
            {{ item.etiqueta }}
          </a-button>
        </a-button-group>
      </template>
    </a-card>
    <a-card v-if="!displayForm" style="width: 100%">
      <!--LISTADO DE RECAUDADORES-->
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="lstFilter"
        rowKey="recaudadorId"
        :pagination="pagination"
        :loading = "loading"
        :scroll="{ x: 1000 }"
      >
        <template slot="estado" slot-scope="text, record">
          <div v-if="record.estado == 'ACTIVO'" align="center">
            <a-tag color="green">
              <a-icon type="caret-up" :style="{ fontSize: '20px' }" />
              {{ record.estado }}
            </a-tag>
          </div>
          <div v-if="record.estado == 'INACTIVO'" align="center">
            <a-tag color="red">
              <a-icon type="caret-down" :style="{ fontSize: '20px' }" />
              {{ record.estado }}
            </a-tag>
          </div>
          <div v-if="record.estado == 'CREADO'" align="center">
            <a-tag color="blue">
              {{ record.estado }}
            </a-tag>
          </div>
        </template>
        <template
          slot="opciones"
          slot-scope="text, record"
          v-if="record.estado == 'ACTIVO' || record.estado == 'CREADO'"
        >
          <a href="javascript:;" @click="mostrarSucursal(record.recaudadorId, record.nombre)"
            >Sucursales</a
          >
          <br />
          <a href="javascript:;" @click="openModal(record.recaudadorId)"
            >Entidades</a
          >
          <br/>
           <a href="javascript:;" @click="openModalComision(record.recaudadorId)">
            Comisión </a
          ><br />
        </template>
        <template slot="datosGenerales" slot-scope="text, record">
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Nombre
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValueMain">
              {{record.nombre}} 
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Tipo Recaudador
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              {{record.tipoRecaudadorDescripcion}} 
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Dirección
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              {{record.direccion}} 
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Teléfono
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              {{record.telefono}} 
            </a-col>
          </a-row>
        </template>
      </a-table>
    </a-card>
    <div v-if="displayForm"
        style="
          border: 2px solid #21618c;
          border-radius: 5px;
          height: 100%;
          width: 100%;
          padding: 1%;
          color: #21618c;
        "
      >
        <a-row type="flex" justify="space-around" align="middle"
          ><a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <h2><b style="color: #21618c"><a-icon type="arrow-left" @click="volverListado"/> Administración de Recaudadoras: {{subTitle}} </b></h2>
            </a-col
          >
        </a-row>
    </div>
    <a-card v-if="displayForm">
      <!--LISTADO DE RECAUDADORES-->
      <a-form-model
        ref="ruleForm"
        :model="recaudadorObj"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        size="small"
      >
        <a-divider orientation="left">Información General</a-divider>
        <a-form-model-item ref="nombre" label="Nombre Recaudador" prop="nombre">
          <a-input
            v-model="recaudadorObj.nombre"
            @blur="
              () => {
                $refs.nombre.onFieldBlur();
              }
            "
            :maxLength="250"
          />
        </a-form-model-item>
        <a-form-model-item label="Tipo Recaudador" prop="tipoRecaudadorId">
          <a-select
            v-model="recaudadorObj.tipoRecaudadorId"
            placeholder="Seleccione Tipo Recaudador"
          >
            <a-select-option
              v-for="(item, i) in lstTipoRecaudadores"
              :key="i"
              :value="item.dominioId"
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="direccion" label="Dirección" prop="direccion">
          <a-input
            v-model="recaudadorObj.direccion"
            @blur="
              () => {
                $refs.direccion.onFieldBlur();
              }
            "
            :maxLength="250"
          />
        </a-form-model-item>
        <a-form-model-item ref="telefono" label="Teléfono" prop="telefono">
          <a-input
            v-model="recaudadorObj.telefono"
            @blur="
              () => {
                $refs.telefono.onFieldBlur();
              }
            "
            :maxLength="10"
          />
        </a-form-model-item>
        <a-divider orientation="left"
          >Entidades donde serán habilitadas</a-divider
        >
        <a-form-model-item
          label="Entidades"
          v-if="recaudadorObj.recaudadorId == null"
        >
          <EntidadLst :recaudadorObj="recaudadorObj" />  
        </a-form-model-item>
      </a-form-model>
      <template slot="actions" class="ant-card-actions">
        <a-button type="link" @click="onSubmit" style="color:white; background-color:#339966;border:0px"><a-icon type="form" /> Registrar </a-button>
        <a-button type="primary" ghost @click="resetForm"><a-icon type="reload" /> Limpiar </a-button>
      </template>
    </a-card>

    <!--mODAL-->
    <a-modal
      v-model="displayModal"
      title="Entidades Asociadas"
      ok-text="Registrar"
      cancel-text="Cancelar"
      @ok="closeModal()"
      width="60%"
      :centered="true"
      :closable="false"
      :maskClosable="false"
      :okButtonProps = "{ style: { color:'white', background: '#339966', border: '0px' } }"
      :cancelButtonProps = "{ style: {  color:'white', background: 'red', border: '0px'  } }"
    >
      <EntidadLst :recaudadorObj="recaudadorObj" />  
    </a-modal>

     <!--MODAL COMISION---------------------------------------------------->
    <a-modal
      v-model="displayModalComision"
      title="Comisión Por Recaudadora"
      ok-text="OK"
      cancel-text="Cancelar"
      @ok="closeModalComision()"
      width="800px"
      :centered="true"
      :destroyOnClose="true"
      :footer="null"
    >
      <RecaudadoresComisiones :recaudadorId="recaudadorId" />
    </a-modal> 
  </div>
</template>
<script>
import Dominios from "../../service/Administraciones/Dominio.service";
import Recaudadores from "../../service/Administraciones/Recaudador.service";
import EntidadLst from "../../components/Administracion/EntidadesLst.vue";
import RecaudadoresComisiones from "../../components/Administracion/RecaudadoresComisiones.vue";
import Sidebar from "../../service/Home/Sidebar.service";

const sorter = (data) => {
  return data.slice().sort((a,b) => b.recaudadorId - a.recaudadorId)
};

const columns = [
  {
    title: "Datos Generales",
    dataIndex: "nombre",
    scopedSlots: { customRender: "datosGenerales" },
    width: "65%"
  },
  {
    title: "Estado",
    dataIndex: "estado",
    scopedSlots: { customRender: "estado" },
    width: "20%",
  },
  {
    title: "Opciones",
    dataIndex: "",
    scopedSlots: { customRender: "opciones" },
    width: "25%",
  },
];

export default {
  components: {
    EntidadLst,
    RecaudadoresComisiones,
  },
  data() {
    return {
      /*******LISTADO DE RECAUDADORES********* */
      /*Datos*/
      lstRecaudadores: [],
      recaudadorId: null,
      /*Tabla*/
      columns,
      selectedRowKeys: [],
      pagination: {
        pageSize: 5,
      },
      loading: false,
      /*menu*/
      lstOpciones: [],
      /**Otros */
      current: null,
      displayModal: false,

      /*******FORMULARIO RECAUDADORES********* */
      /*Datos*/
      recaudadorObj: {},
      /*Formulario*/
      subTitle: "",
      displayForm: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      rules: {
        nombre: [
          {
            required: true,
            message: "Debe registrar el nombre",
            trigger: "blur",
          },
          {
            min: 2,
            message: "Mínimante el nombre debe tener 2 caracteres",
            trigger: "blur",
          },
        ],
        tipoRecaudadorId: [
          {
            required: true,
            message: "Debe seleccionar un Tipo de Recaudador",
            trigger: "change",
          },
        ],
        direccion: [
          {
            required: true,
            message: "Debe registrar la dirección",
            trigger: "blur",
          },
          {
            min: 5,
            message: "Mínimante la dirección debe tener 5 caracteres",
            trigger: "blur",
          },
        ],
        telefono: [
          {
            required: true,
            message: "Debe registrar la dirección",
            trigger: "blur",
          },
          {
            min: 7,
            max: 10,
            message:
              "El teléfono debe contener al menos 7 caracteres y máximo 10",
            trigger: "blur",
          },
        ],
      },

      /*Dominios*/
      lstTipoRecaudadores: [],

      /**Modal Comision */
      displayModalComision: false,

      /**Filter */
      search: '',
      lstFilter: [],
      filter: 'Registros: 0/0',
    };
  },
  computed: {
    /*Tabla*/
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          this.selectedRowKeys = selectedRowKeys;

          //Opciones
          const mismoEstado = [...new Set(selectedRows.map(i => i.estado))];
          if(mismoEstado.length > 1) {
            this.$notification.warning("Debe seleccionar registros del mismo ESTADO para realizar operaciones múltiples.");
             this.cargarOpcionesByEstado("INICIAL");
          } else {
            if(selectedRows.length > 0) 
              this.cargarOpcionesByEstado(selectedRows[0].estado)
            else
              this.cargarOpcionesByEstado(null);
          }
        },
      };
    },
  },
  mounted() {
    this.cargarRecaudadores();
    this.cargarTipoRecaudadora();

    this.cargarOpcionesByEstado(null);
  },

  methods: {
    /*****LISTADO DE RECAUDADORES*** */
    /**Menú */
    cargarOpcionesByEstado(estadoInicial) {
      Sidebar.getOpcionesByEstado("RECAUDADORES", estadoInicial).then((r) => {
        console.log(r);
        this.lstOpciones = r.data.data;
        console.log(JSON.stringify(this.lstOpciones));
      });
    },
    seleccionarOpcion(opcion) {
      switch (opcion) {
        case "CREAR": //CREAR
          this.recaudadorObj = {};
          this.displayForm = true;
          this.subTitle = "Registro Nuevo";
          break;
        case "MODIFICAR": //Modiicar
          if (this.selectedRowKeys.length === 1) {
            this.cargarRecaudador(this.selectedRowKeys);
            this.displayForm = true;
            this.subTitle = "Modificación de Registro";

          } else {
            this.$notification.warning(
              "Debe seleccionar un solo registro para MODIFICAR"
            );
          }
          break;
        case "ELIMINAR": //ELIMINAR
          if (this.selectedRowKeys.length > 0) {
            this.$confirm({
              title:
                "¿Está seguro de ELIMINAR el(los) registro(s) seleccionado(s)?",
              content:
                "Considere que el(los) registro(s) ya no podrá(n) ser visualizado(s).",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                console.log("ok");
                this.actualizaListaRecaudadoresTransaccion(
                  this.selectedRowKeys,
                  "ELIMINAR"
                );
            
              },
              onCancel() {
                console.log("Cancel");
              },
              class: "test",
            });
          } else {
            this.$notification.warning(
              "Debe seleccionar al menos un registro para ELIMINAR"
            );
          }
          break;
        case "ACTIVAR": //ALTA
          if (this.selectedRowKeys.length > 0) {
            this.$confirm({
              title:
                "¿Está seguro de DAR ALTA el(los) registro(s) seleccionado(s)?",
              content:
                "Considere que el(los) registro(s) ingresará(n) en transacciones en el Sistema.",
              okText: "Aceptar",
              cancelText: "Cancelar",
              onOk: () => {
                console.log("ok");
                this.actualizaListaRecaudadoresTransaccion(
                  this.selectedRowKeys,
                  "ACTIVAR"
                );
              },
              onCancel() {
                console.log("Cancel");
              },
              class: "test",
            });
          } else {
            this.$notification.warning(
              "Debe seleccionar al menos un registro para DAR ALTA"
            );
          }
          break;
        case "INACTIVAR": //BAJAR
          if (this.selectedRowKeys.length > 0) {
            this.$confirm({
              title:
                "¿Está seguro de DAR BAJA el(los) registro(s) seleccionado(s)?",
              content:
                "Considere que el registro ya no podrá realizar transacciones en el Sistema.",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                console.log("ok");
                this.actualizaListaRecaudadoresTransaccion(
                  this.selectedRowKeys,
                  "INACTIVAR"
                );
              },
              onCancel() {
                console.log("Cancel");
              },
              class: "test",
            });
          } else {
            this.$notification.warning(
              "Debe seleccionar al menos un registro para DAR BAJA"
            );
          }
          break;
      }
    },
    /**Opeaciones */
    cargarRecaudadores() {
      this.loading = true;
      Recaudadores.getLstRecaudadores()
        .then((r) => {
          console.log(r);
          if (r.status === 204) {
            this.lstRecaudadores = [];
            this.lstFilter = [];
            this.$notification.warning(
              "No se ha encontrado ninguna Recaudador registrada"
            );
            this.loading = false;
            return;
          }
          console.log("aqui");
          this.lstRecaudadores = r.data.result;
          this.lstFilter = sorter(this.lstRecaudadores);
          this.countRows();
          this.loading = false;
        })
        .catch((error) => {
          this.lstRecaudadores = [];
          this.lstFilter = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.loading = false;
        });
    },
    actualizaRecaudadorTransaccion(recaudadorId, transaccion) {
      //Solo se usara el listado
      this.$Progress.start();
      Recaudadores.putRecaudadorTransaccion(recaudadorId, transaccion)
        .then((r) => {
          this.cargarRecaudadores();


          this.$notification.success(r.data.message);
          this.$Progress.finish();
        })
        .catch((error) => {
          console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },

    actualizaListaRecaudadoresTransaccion(recaudadorIdLst, transaccion) {
      Recaudadores.putLstRecaudadorTransaccion(recaudadorIdLst, transaccion)
        .then((r) => {
          this.$Progress.start();
          this.cargarRecaudadores();
          
          this.selectedRowKeys = [];

          this.$notification.success(r.data.message);
          this.$Progress.finish();
        })
        .catch((error) => {
          console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },
    /**Visualizaciones */
    mostrarSucursal(recaudadorId, nombre) {
      this.$router.push({
        name: "AbmSucursales",
        params: { recaudadorId: recaudadorId, nombre: nombre },
      });
    },

    /****FORMULARIO**** */
    /*Control de campos*/
    volverListado() {
      this.displayForm = !this.displayForm;
      this.recaudadorObj = {};
      this.selectedRowKeys = [];
    },

    /*Lista de Dominio*/
    cargarTipoRecaudadora() {
      Dominios.getListDominos("tipo_recaudador_id")
        .then((r) => {
          if (r.status === 204) {
            this.lstTipoRecaudadores = [];
            this.$notification.warning(
              "La parametrización de dominios no esta completa."
            );
            return;
          }

          this.lstTipoRecaudadores = r.data.result;
        })
        .catch((error) => {
          console.log(error);
          this.lstTipoRecaudadores = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },
    /*Operaciones*/
    cargarRecaudador(recaudadorId) {
      Recaudadores.getRecaudador(recaudadorId).then((r) => {
        this.recaudadorObj = r.data.result;
      });
    },
    guardarRecaudador() {
      this.$Progress.start();
      Recaudadores.postRecaudador(this.recaudadorObj)
        .then((r) => {
          console.log(r);
          this.displayForm = false;
          this.cargarRecaudadores();
          this.$notification.success(r.data.message);
          this.$Progress.finish();
        })
        .catch((error) => {
          console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },
    /*Acciones de Formulario*/
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.guardarRecaudador(this.recaudadorObj);
        } else {
          console.log("error submit!!");
          this.$notification.warning(
            "Debe resolver las validaciones del formulario."
          );
          return false;
        }
      });
    },
    resetForm() {
      this.recaudadorObj = {};
      this.$refs.ruleForm.resetFields();
    },


    /**Modal */
    openModal(recaudadorId) {
      this.cargarRecaudador(recaudadorId);
      this.displayModal = true;
    },
    closeModal() {
      this.guardarEntidades();
      this.displayModal = false;
    },
    abrirEntidad() {
      this.$confirm({
        title: "¿Está seguro de ingresar a Registro de Entidades?",
        content: "Considere que los datos se perderán.",
        okText: "Aceptar",
        cancelText: "Cancelar",
        onOk: () => {
          console.log("ok");
          this.$router.push({
            name: "AbmEntidades",
          });
        },
        onCancel() {
          console.log("Cancel");
        },
        class: "test",
      });
    },

    guardarEntidades() {
      this.$Progress.start();
      Recaudadores.postEntidadRecaudador(
        this.recaudadorObj.entidadIdLst,
        this.recaudadorObj.recaudadorId
      )
        .then((r) => {
          this.$notification.success(r.data.message);
          this.$Progress.finish();
        })
        .catch((error) => {
          (this.lstRecaudadores = []), console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },


    /**RECAUDADORES COMISIONES***************************************** */  
    /**Modal Comision */
    openModalComision(recaudadorId) {
      this.recaudadorId = recaudadorId;
      this.displayModalComision = true;
    },
    closeModalComision() {
      this.recaudadorId = null;
      this.displayModalComision = false;
    },

    /**Filtrado */
    filterTable() {
      this.lstFilter = this.lstRecaudadores.filter((s) => {
        console.log(this.search)
        if(this.search != null || this.search != '') {
          return s.nombre.toLowerCase().includes(this.search.toLowerCase()); 
        }  
      });
      this.countRows();
    },
    countRows() {
      let rowFilter = this.lstFilter.length;
      let rowTotal = this.lstRecaudadores.length;
      this.filter = "Registros: " + rowFilter + "/" + rowTotal;
    },

   
  },
};
</script>
<style scoped>
  .labelTittle {
    background-color:#FAFAFA; 
    font-weight:bold; 
    padding-right:5px;
    height: 100%;
  }
  .labelValue {
    border-width: 0.1px;
    border-color:#FAFAFA;
    border-style: solid;
  }
  .labelValueMain {
    border-width: 0.1px;
    border-color:#FAFAFA;
    border-style: solid;
    color: #839DFF;
    background-color:#FAFAFA; 
  }
</style>
