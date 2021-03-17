<template>
  <div>
    <a-card v-if="!displayForm" style="width: 100%">
      <a-page-header
        style="border: 1px solid rgb(224,206,206)"
        title="Administración de Registro de Recaudadores"
      />
    </a-card>
    <a-card v-if="!displayForm" style="width: 100%">
      <template slot="actions" class="ant-card-actions">
        <a-button-group >
          <a-button  v-for="(item, i) in lstOpciones" 
            :key="i"
            @click="seleccionarOpcion(item.transaccion)">
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
        :data-source="lstRecaudadores"
        rowKey="recaudadorId"
        :pagination="pagination"
        :scroll="{ x: 1500 }"
      >      
        <template slot="estado" slot-scope="text, record" >
          <div v-if="record.estado == 'ACTIVO'" align="center">
            <a-tag color="green">
              <a-icon type="caret-up" :style="{ fontSize: '20px' }" />
              {{record.estado}}
            </a-tag>
          </div>
          <div v-if="record.estado == 'DESACTIVO'" align="center">
            <a-tag color="red">
              <a-icon type="caret-down" :style="{ fontSize: '20px' }" />
               {{record.estado}}
            </a-tag>
          </div>
          <div v-if="record.estado == 'CREADO'" align="center">
            <a-tag color="blue">
               {{record.estado}}
            </a-tag>
          </div>
        </template>
        <template slot="opciones" slot-scope="text, record" v-if="record.estado == 'ACTIVO' || record.estado == 'CREADO'">
            <a href="javascript:;" @click="mostrarSucursal(record.recaudadorId)">Sucursales</a>
            <br/>
            <a href="javascript:;" @click="openModal(record.recaudadorId)">Entidades</a>
        </template>
      </a-table>
    </a-card>
    <a-card v-if="displayForm">
      <a-page-header
        style="border: 1px solid rgb(224,206,206)"
        title="Administración de Recaudadoras"
        :sub-title="subTitle"
        @back="() => volverListado()"
      />
      <br/>
      <!--LISTADO DE RECAUDADORES-->
      <a-form-model
        ref="ruleForm"
        :model="recaudadorObj"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        size="small"
      >
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
        <a-form-model-item label="Entidades Habilitadas" v-if="recaudadorObj.recaudadorId == null">
          <a-select
            mode="multiple"
            v-model="recaudadorObj.entidadIdLst"
            style="width: 100%"
            placeholder="Seleccione las Recaudadoras"
          >
            <a-select-option v-for="(item) in lstEntidades"
              :key="item.entidadId">
              {{item.nombre}}
            </a-select-option>
          </a-select>
           <a-button type="primary" @click="abrirEntidad"> Nueva Empresa 
          </a-button>
        </a-form-model-item>
      </a-form-model>
      <template slot="actions" class="ant-card-actions">
         <a-button type="link" @click="onSubmit"> Registrar </a-button>
          <a-button type="link" @click="resetForm"> Limpiar </a-button>
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
    >
     <a-select
            mode="multiple"
            v-model="recaudadorObj.entidadIdLst"
            style="width: 100%"
            placeholder="Seleccione las Recaudadoras"
          >
            <a-select-option v-for="(item) in lstEntidades"
              :key="item.entidadId">
              {{item.nombre}}
            </a-select-option>
          </a-select>
           <a-button type="primary" @click="abrirEntidad"> Nueva Empresa 
          </a-button>
    </a-modal>


  </div>
</template>
<script>
import Dominios from "../../service/Administraciones/Dominio.service";
import Recaudadores from "../../service/Administraciones/Recaudador.service";

import Entidades from "../../service/Administraciones/Entidad.service";


const columns = [
  {
    title: "Nombre",
    dataIndex: "nombre",
    fixed: "left",
  },
  {
    title: "Tipo Recaudador",
    dataIndex: "tipoRecaudadorDescripcion",
  },
  {
    title: "Dirección",
    dataIndex: "direccion",
  },
  {
    title: "Teléfono",
    dataIndex: "telefono",
  },
  {
    title: "Estado",
    dataIndex: "estado",
    fixed: "right",
    scopedSlots: { customRender: "estado" },
  },
  {
    title: "Opciones",
    dataIndex: "",
    scopedSlots: { customRender: "opciones" },
    fixed: "right",
  },
];

export default {
  data() {
    return {
      /*******LISTADO DE RECAUDADORES********* */
      /*Datos*/
      lstRecaudadores: [],
      /*Tabla*/
      columns,
      selectedRowKeys: [],
      pagination: {
        pageSize: 5,
      },
      /*menu*/
      lstOpciones: [
        { transaccion: "CREAR", etiqueta: "CREAR", imagen: "imagen.png", orden: 1 },
        { transaccion: "MODIFICAR", etiqueta: "MODIFICAR", imagen: "imagen.png", orden: 2 },
        { transaccion: "ELIMINAR", etiqueta: "ELIMINAR", imagen: "imagen.png", orden: 3 },
        { transaccion: "ACTIVAR", etiqueta: "DAR ALTA", imagen: "imagen.png", orden: 4 },
        { transaccion: "DESACTIVAR", etiqueta: "DAR BAJA", imagen: "imagen.png", orden: 5 },
      ],
      /**Otros */
      current: null,
      displayModal: false,

      /*******FORMULARIO RECAUDADORES********* */
      /*Datos*/
      recaudadorObj: {},
      /*Formulario*/
      subTitle: '',
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
            message: "El teléfono debe contener al menos 7 caracteres y máximo 10",
            trigger: "blur",
          },
        ],
      },

      /*Dominios*/
      lstTipoRecaudadores: [],

      /**Entidades */
      lstEntidades: [],

    };
  },
  computed: {
    /*Tabla*/
    rowSelection() {
      return {
        //type: "radio",
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          this.selectedRowKeys = selectedRowKeys;
        },
      };
    },
  },
  mounted() {
    this.cargarRecaudadores();
    this.cargarTipoRecaudadora();

    this.cargarEntidades();
  },

  methods: {
    /*****LISTADO DE RECAUDADORES*** */
    /**Menú */
    seleccionarOpcion(opcion) {
      switch (opcion) {
        case 'CREAR': //CREAR
          this.recaudadorObj = {};
          this.displayForm = true;
          this.subTitle = "Formulario Registro Nuevo";
          break;  
        case 'MODIFICAR': //Modiicar
          if(this.selectedRowKeys.length === 1) {
            this.cargarRecaudador(this.selectedRowKeys);
            this.displayForm = true;
            this.subTitle = "Formulario Modificación de Registro";
          } else {
            this.$notification.warning('Debe seleccionar un solo registro para MODIFICAR');
          }
          break;
        case 'ELIMINAR': //ELIMINAR
          if(this.selectedRowKeys.length > 0) {
            this.$confirm({
              title: "¿Está seguro de ELIMINAR el(los) registro(s) seleccionado(s)?",
              content: "Considere que el(los) registro(s) ya no podrá(n) ser visualizado(s).",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                console.log('ok')
                this.actualizaListaRecaudadoresTransaccion(this.selectedRowKeys, "ELIMINAR");
              },
              onCancel() {  
                console.log('Cancel');
              },
              class: 'test',
            });
            
          } else {
            this.$notification.warning('Debe seleccionar al menos un registro para ELIMINAR')
          }
          break;
        case 'ACTIVAR': //ALTA
          if(this.selectedRowKeys.length > 0) {
            this.$confirm({
              title: "¿Está seguro de DAR ALTA el(los) registro(s) seleccionado(s)?",
              content: "Considere que el(los) registro(s) ingresará(n) en transacciones en el Sistema.",
              okText: "Aceptar",
              cancelText: "Cancelar",
              onOk: () => {
                console.log('ok')
                this.actualizaListaRecaudadoresTransaccion(this.selectedRowKeys, "ACTIVAR");
              },
              onCancel() {  
                console.log('Cancel');
              },
              class: 'test',
            });
            
          } else {
            this.$notification.warning('Debe seleccionar al menos un registro para DAR ALTA')
          }
          break;
        case 'DESACTIVAR': //BAJAR
          if(this.selectedRowKeys.length > 0) {
            this.$confirm({
              title: "¿Está seguro de DAR BAJA el(los) registro(s) seleccionado(s)?",
              content: "Considere que el registro ya no podrá realizar transacciones en el Sistema.",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                console.log('ok')
                this.actualizaListaRecaudadoresTransaccion(this.selectedRowKeys, "DESACTIVAR");
              },
              onCancel() {  
                console.log('Cancel');
              },
              class: 'test',
            });
          } else {
            this.$notification.warning('Debe seleccionar al menos un registro para DAR BAJA')
          }
          break;
      }
    },
    /**Opeaciones */
    cargarRecaudadores() {
      this.$Progress.start();
      Recaudadores.getLstRecaudadores().then((r) => {
        console.log(r)
        if(r.status === 204 ) {
          this.lstRecaudadores = [],
          this.$notification.warning("No se ha encontrado ninguna Recaudador registrada");
          this.$Progress.finish();
          return;
        }
        console.log('aqui')
        this.lstRecaudadores = r.data.result;
        this.$Progress.finish();
      }).catch((error) => {
          this.lstRecaudadores = [],
          console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },
    actualizaRecaudadorTransaccion(recaudadorId, transaccion) { //Solo se usara el listado
      this.$Progress.start();
      Recaudadores.putRecaudadorTransaccion(recaudadorId, transaccion).then((r) => {
        this.cargarRecaudadores();
        this.$notification.success(r.data.message);
        this.$Progress.finish();
      }).catch((error) => {
        console.log(error)
        this.$notification.error(error.response.data.message, error.response.data.code);
        this.$Progress.fail();
      });
    },

    actualizaListaRecaudadoresTransaccion(recaudadorIdLst, transaccion) {
      
      Recaudadores.putLstRecaudadorTransaccion(recaudadorIdLst, transaccion).then((r) => {
        this.$Progress.start();
        this.cargarRecaudadores();
        this.$notification.success(r.data.message);
        this.$Progress.finish();
      }).catch((error) => {
        console.log(error)
        this.$notification.error(error.response.data.message, error.response.data.code);
        this.$Progress.fail();
      });
    },
    /**Visualizaciones */
    mostrarSucursal(recaudadorId) {
      this.$router.push({
        name: "AbmSucursales",
        params: { recaudadorId: recaudadorId },
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
      Dominios.getListDominos("tipo_recaudador_id").then((r) => {
        if(r.status === 204) {
          this.lstTipoRecaudadores = [];
          this.$notification.warning("La parametrización de dominios no esta completa.");
          return;
        }

        this.lstTipoRecaudadores = r.data.result;
      }).catch((error) => {
          console.log(error);
          this.lstTipoRecaudadores = [];
          this.$notification.error(error.response.data.message, error.response.data.code);
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
          this.$notification.error(error.response.data.message, error.response.data.code);
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
          this.$notification.warning("Debe resolver las validaciones del formulario.");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },

     /**Entidaes */
      cargarEntidades() {

      this.$Progress.start();
      Entidades.getLstEntidad().then((r) => {
        if(r.status === 204 ) {
          this.lstEntidades = [],
          this.$notification.warning("No se ha encontrado ninguna Empresa registrada");
          this.$Progress.finish();
          return;
        }

        this.lstEntidades = r.data.result;
        console.log('cargando entidades')
        console.log(this.lstEntidades);
        this.$Progress.finish();
      }).catch((error) => {
        this.lstEntidades = [],
        console.log(error);
        this.$notification.error(
          error.response.data.message,
          error.response.data.code
        );
        this.$Progress.fail();
      });
    }, 
    
   /**Modal */
    openModal(recaudadorId){
        this.cargarRecaudador(recaudadorId);
        this.displayModal = true;
    },
    closeModal() {
      this.guardarEntidades();
      this.displayModal = false;
    },
    abrirEntidad() {
      this.$confirm({
              title: "¿Está seguro de ingresar a Registro de Empresas?",
              content: "Considere que los datos se perderán.",
              okText: "Aceptar",
              cancelText: "Cancelar",
              onOk: () => {
                console.log('ok');
                this.$router.push({
                  name: "AbmEntidades",
                });
              },
              onCancel() {  
                console.log('Cancel');
              },
              class: 'test',
            });
    },

    guardarEntidades(){
      this.$Progress.start();
      Recaudadores.postEntidadRecaudador(this.recaudadorObj.entidadIdLst, this.recaudadorObj.recaudadorId).then((r) => {
        this.$notification.success(r.data.message);
        this.$Progress.finish();
      }).catch((error) => {
          this.lstRecaudadores = [],
          console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },

    



  },
};
</script>
<style scoped>
</style>
