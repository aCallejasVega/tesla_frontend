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
            <h2><b style="color: #21618c"><a-icon type="arrow-left" @click="$router.back()" v-if="nombreEntidad != null"/> {{title}} </b></h2></a-col
          >
          <a-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
            <a-row type="flex" justify="end">
              <a-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4"
                ><b></b></a-col
              >
              <a-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20" align="right">
                 <a-input-search
            v-model="search"
            placeholder="Buscar por nombre..."
            @search="filterTable"
            enter-button=" Buscar "
            :maxLength="50"
            size="small"
          />
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
    <a-card v-if="!displayForm" style="width: 100%">
      <template slot="actions" class="ant-card-actions">
        <b>{{filter}}</b>
        <a-button-group >
          <a-button v-for="(item, i) in lstOpciones"
            :key="i"
            @click="seleccionarOpcion(item.transaccion)"
            type="primary">
            {{ item.etiqueta }}
          </a-button>
        </a-button-group>
      </template>
    </a-card>
    <a-card v-if="!displayForm" style="width: 100%">
      <!--LISTADO DE SUCURSALES-->
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="lstFilter"
        rowKey="sucursalEntidadId"
        :pagination="pagination"
        :loading = "loading"
        :scroll="{ x: 1000 }"
      >      
        <template slot="estado" slot-scope="text, record" >
          <div v-if="record.estado == 'ACTIVO'" align="center">
            <a-tag color="green">
              <a-icon type="caret-up" :style="{ fontSize: '20px' }" />
              {{record.estado}}
            </a-tag>
          </div>
          <div v-if="record.estado == 'INACTIVO'" align="center">
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
         <template slot="datosGenerales" slot-scope="text, record">
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Nombre
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              <a-tooltip v-if="record.nombreSucursal.length > 30" :key="record.nombreSucursal" :title="record.nombreSucursal">
                <a-tag :key="record.nombreSucursal" color="blue">
                  {{ `${record.nombreSucursal.slice(0, 30)}...` }}
                </a-tag>
              </a-tooltip>
              <a-tag v-else color="blue">
                  {{ record.nombreSucursal }}
              </a-tag>
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
           <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Departamento
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              {{record.departamentoDescripcion}} 
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Municipio
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              {{record.municipioDescripcion}} 
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Correo Electrónico
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              {{record.email}} 
            </a-col>
          </a-row>
         </template>
         <template slot="informacionTributaria" slot-scope="text, record">
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Numero Sucursal SIN
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              {{record.numeroSucursalSin}} 
            </a-col>
          </a-row>
        </template>
        <template slot="parametrizacion" slot-scope="text, record" >
         <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Emite Factura Tesla
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              {{record.emiteFacturaTesla == true ? 'SI' : 'NO' }} 
            </a-col>
          </a-row>
        </template>
         <template 
          slot="opciones"
          slot-scope="text, record"
          v-if="(record.estado == 'ACTIVO' || record.estado == 'CREADO') && record.emiteFacturaTesla"
        >
          <a href="javascript:; " @click="abrirModal(record.entidadId, record.sucursalEntidadId)" v-if="entidadId != null">
            Credenciales Facturacion
          </a>
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
            <h2><b style="color: #21618c"><a-icon type="arrow-left" @click="volverListado"/> {{title}}: {{subTitle}} </b></h2>
            </a-col
          >
        </a-row>
    </div>
    <a-card v-if="displayForm">
      <!--LISTADO DE SUCURSALES-->
      <a-form-model
        ref="ruleForm"
        :model="sucursalEntidadObj"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        size="small"
      >
        <a-divider orientation="left">Información General</a-divider>
        <a-form-model-item ref="nombreSucursal" label="Nombre Sucursal" prop="nombreSucursal">
          <a-input
            v-model="sucursalEntidadObj.nombreSucursal"
            @blur="
              () => {
                $refs.nombreSucursal.onFieldBlur();
              }
            "
            :maxLength="250"
          />
        </a-form-model-item>
        <a-form-model-item ref="direccion" label="Dirección" prop="direccion">
          <a-input
            v-model="sucursalEntidadObj.direccion"
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
            v-model="sucursalEntidadObj.telefono"
            @blur="
              () => {
                $refs.telefono.onFieldBlur();
              }
            "
            :maxLength="10"
          />
        </a-form-model-item>
         <a-form-model-item label="Departamento" prop="departamentoId">
          <a-select
            v-model="sucursalEntidadObj.departamentoId"
            placeholder="Seleccione Departamento"
            @change="cargarMunicipios(sucursalEntidadObj.departamentoId)"
          >
            <a-select-option
              v-for="(item, i) in lstDepartamentos"
              :key="i"
              :value="item.dominioId" 
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Municipio" prop="municipioId">
          <a-select
            v-model="sucursalEntidadObj.municipioId"
            placeholder="Seleccione Municipio"
          >
            <a-select-option
              v-for="(item, i) in lstMunicipios"
              :key="i"
              :value="item.dominioId"
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="email" label="Correo Electrónico" prop="email">
          <a-input
            v-model="sucursalEntidadObj.email"
            @blur="
              () => {
                $refs.email.onFieldBlur();
              }
            "
            :maxLength="50"
          />
        </a-form-model-item>
        <a-divider orientation="left">Información Tributaria</a-divider>
        <a-form-model-item ref="numeroSucursalSin" label="Número Sucursal SIN" prop="numeroSucursalSin">
          <a-input-number v-model="sucursalEntidadObj.numeroSucursalSin" :min="0" :max="50" />
        </a-form-model-item>
        <a-divider orientation="left" >Parametrización</a-divider>
        <a-form-model-item ref="emiteFacturaTesla" label="¿Emite Factura Tesla?" prop="emiteFacturaTesla">
          <a-switch v-model="sucursalEntidadObj.emiteFacturaTesla" />
        </a-form-model-item>
      </a-form-model>
      <template slot="actions" class="ant-card-actions">
         <a-button type="link" @click="onSubmit" style="color:white; background-color:#339966;border:0px" > 
          <a-icon type="form" />
            Registrar 
          </a-button>
          <a-button type="primary" ghost @click="resetForm"><a-icon type="reload" /> Limpiar </a-button>
      </template>
    </a-card>

    <a-modal
      v-model="displayModalCredenciales"
      title="Registrar Credenciales Facturación"
      ok-text="Registrar"
      cancel-text="Cancelar"
      @ok="closeModal()"
      width="60%"
      :centered="true"
      :destroyOnClose="true"
      :footer="null"
    >
      <Credenciales :entidadId="entidadIdSelect" :sucursalEntidadId="sucursalEntidadIdSelect" 
        @closeComponent="closeComponente"/>
    </a-modal>
   
  </div>
</template>
<script>
import Dominios from "../../service/Administraciones/Dominio.service";
import SucursalesEntidades from "../../service/Administraciones/SucursalEntidad.service";
import Sidebar from "../../service/Home/Sidebar.service";
import Credenciales from "../../components/Administracion/CredencialesFacturacion.vue"


const sorter = (data) => {
  return data.slice().sort((a,b) => b.sucursalEntidadId - a.sucursalEntidadId)
};

const columns = [
  {
    title: "Información General",
    dataIndex: "nombreSucursal",
    //fixed: "left",
    scopedSlots: { customRender: "datosGenerales" },
    width: "25%"
  },
  {
    title: "Información Tributaria",
    scopedSlots: { customRender: "informacionTributaria" },
    width: "25%"
  },
  {
    title: "Parametrización",
    scopedSlots: { customRender: "parametrizacion" },
    width: "20%"
  },
  {
    title: "Estado",
    dataIndex: "estado",
    scopedSlots: { customRender: "estado" },
    width: "15%"
  },
   {
    title: "Opciones",
    dataIndex: "",
    scopedSlots: { customRender: "opciones" },
    width: "15%"
  },
];

export default {
  props: {
    entidadId: null,
    nombreEntidad: null,
  },
  components: {
    Credenciales,
  },
  data() {
    return {
      /*******LISTADO DE SUCURSALES********* */
      /*Datos*/
      //entidadId: null,
      lstSucursalesEntidades: [],
      title: (this.nombreEntidad != null ? this.nombreEntidad + ": " : "")+ "Administración Sucursales",
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
      displayModal: true,
      /*Dominios*/
      lstDepartamentos: [],
      lstMunicipios: [],

      /*******FORMULARIO SUCRUSALES********* */
      /*Datos*/
      sucursalEntidadObj: {},
      /*Formulario*/
      subTitle: '',
      displayForm: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      rules: {
        nombreSucursal: [
          {
            required: true,
            message: "Debe registrar el nombre.",
            trigger: "blur",
          },
          {
            min: 2,
            message: "Mínimante el nombre debe tener 2 caracteres",
            trigger: "blur",
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
            message: "Debe registrar el teléfono.",
            trigger: "blur",
          },
          {
            min: 7,
            max: 10,
            message: "El teléfono debe contener al menos 7 caracteres y máximo 10",
            trigger: "blur",
          },
        ],
        departamentoId: [
          {
            required: true,
            message: "Debe seleccionar un Departamento.",
            trigger: "change",
          },
        ],
        municipioId: [
          {
            required: true,
            message: "Debe seleccionar un Municipo",
            trigger: "change",
          },
        ],
        numeroSucursalSin: [
          {
            required: true,
            message: "Debe ingresar el numero asignado por el SIN",
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: "El rango de es de 0 - 20.",
            pattern:  /^[0-9]?$|^20$/ 
          },
        ],
        codigoActividadEconomica: [
          {
            required: true,
            message: "Debe registrar el código de la Actividad Económica",
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: "Debe registrar solo números.",
            pattern:  /^[0-9,$]*$/ 
          },
        ],
        actividadEconomica: [
          {
            required: true,
            message: "Debe registrar la Actividad Económica",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "Debe registrar el Correo Electrónico",
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: "El correo electrónico esta incorrecto.",
            pattern:  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
          },
        ],
        
      },
       /**Filter */
      search: '',
      lstFilter: [],
      filter: 'Registros: 0/0',

      /**Modal */
      displayModalCredenciales: false,
      sucursalEntidadIdSelect: null,
      entidadIdSelect: null,
    };
  },
  computed: {
    /*Tabla*/
    rowSelection() {
      return {
        //type: "radio",
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          /*console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );*/
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
  created() {
    this.entidadId = this.$route.params.entidadId;
    this.cargarSucursalEntidadesPorEntidad(this.entidadId);
    this.cargarDepartamentos();

    this.cargarOpcionesByEstado(null);
  },

  methods: {
    /*Lista de Dominio*/
    cargarDepartamentos() {
      Dominios.getListDominos("departamento_id").then((r) => {
        if(r.status === 204) {
          this.lstDepartamentos = [];
          this.$notification.warning("La parametrización de dominios no esta completa.");
          return;
        }

        this.lstDepartamentos = r.data.result;
      }).catch((error) => {
          this.lstDepartamentos = [];
          this.$notification.error(error.response.data.message, error.response.data.code);
        });
    },
    cargarMunicipios(agrupadorId) {
      Dominios.getListDominosByAgrupador(agrupadorId).then((r) => {
        if(r.status === 204) {
          this.lstMunicipios = [];
          this.$notification.warning("La parametrización de dominios no esta completa.");
          return;
        }

        this.lstMunicipios = r.data.result;
      }).catch((error) => {
          this.lstMunicipios = [];
          this.$notification.error(error.response.data.message, error.response.data.code);
        });
    },
    /*****LISTADO DE SUCURSALES*** */
    /**Menú */
    cargarOpcionesByEstado(estadoInicial) {
      Sidebar.getOpcionesByEstado("SUCURSALES_ENTIDADES", estadoInicial).then((r) => {
        this.lstOpciones = r.data.data;
      });
    },
    seleccionarOpcion(opcion) {
      switch (opcion) {
        case 'CREAR': //CREAR
          this.sucursalEntidadObj = {};
          this.displayForm = true;
          this.subTitle = "Registro Nuevo";
          break;  
        case 'MODIFICAR': //Modiicar
          if(this.selectedRowKeys.length === 1) {
            this.cargarSucursalEntidad(this.selectedRowKeys);
            this.displayForm = true;
            this.subTitle = "Modificación de Registro";
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
                this.actualizaListaSucursalEntidadTransaccion(this.selectedRowKeys, "ELIMINAR");
              },
              onCancel() {  
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
                this.actualizaListaSucursalEntidadTransaccion(this.selectedRowKeys, "ACTIVAR");
              },
              onCancel() {  
              },
              class: 'test',
            });
            
          } else {
            this.$notification.warning('Debe seleccionar al menos un registro para DAR ALTA')
          }
          break;
        case 'INACTIVAR': //BAJAR
          if(this.selectedRowKeys.length > 0) {
            this.$confirm({
              title: "¿Está seguro de DAR BAJA el(los) registro(s) seleccionado(s)?",
              content: "Considere que el registro ya no podrá realizar transacciones en el Sistema.",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                this.actualizaListaSucursalEntidadTransaccion(this.selectedRowKeys, "INACTIVAR");
              },
              onCancel() {  
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
    cargarSucursalEntidadesPorEntidad(entidadId) {
      this.loading = true;
      SucursalesEntidades.getLstSucursalEntidadByEntidadId(entidadId).then((r) => {
        if(r.status === 204 ) {
          this.lstSucursalesEntidades = [];
          this.lstFilter = [];
          this.$notification.warning("No se ha encontrado ninguna Sucursal registrada para Entidad.");
          this.loading = false;
          return;
        }
        this.lstSucursalesEntidades = sorter(r.data.result);
        this.lstFilter = this.lstSucursalesEntidades;
        this.countRows();
        this.loading = false;
      }).catch((error) => {
        this.lstSucursalesEntidades = [];
        this.lstFilter = [];
        this.$notification.error(
          error.response.data.message,
          error.response.data.code
        );
        this.loading = false;
      });
    },
    actualizaListaSucursalEntidadTransaccion(sucursalIdLst, transaccion) {
      SucursalesEntidades.putLstSucursalEntidadTransaccion(sucursalIdLst, transaccion).then((r) => {
        this.$Progress.start();
        this.cargarSucursalEntidadesPorEntidad(this.entidadId);
        
        this.selectedRowKeys = [];
        
        this.$notification.success(r.data.message);
        this.$Progress.finish();
      }).catch((error) => {
        this.$notification.error(error.response.data.message, error.response.data.code);
        this.$Progress.fail();
      });
    },
   
    /****FORMULARIO**** */
    /*Control de campos*/
    volverListado() {
      this.displayForm = !this.displayForm;
      this.sucursalEntidadObj = {};
      this.selectedRowKeys = [];
    },
    
    /*Operaciones*/
    cargarSucursalEntidad(sucursalId) {
      SucursalesEntidades.getSucursalEntidad(sucursalId).then((r) => {
        this.sucursalEntidadObj = r.data.result;
        this.cargarMunicipios(this.sucursalEntidadObj.departamentoId);
      });
    },
    guardarSucursalEntidad() {
      this.$Progress.start();
      this.sucursalEntidadObj.entidadId = this.entidadId;
      SucursalesEntidades.postSucursalEntidad(this.sucursalEntidadObj)
        .then((r) => {
          this.displayForm = false;
          this.cargarSucursalEntidadesPorEntidad(this.entidadId);
          this.$notification.success(r.data.message);
          this.$Progress.finish();
        })
        .catch((error) => {
          this.$notification.error(error.response.data.message, error.response.data.code);
          this.$Progress.fail();
        });
      
    },
    /*Acciones de Formulario*/
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.guardarSucursalEntidad(this.sucursalEntidadObj);

          this.selectedRowKeys = [];
        } else {
          this.$notification.warning("Debe resolver las validaciones del formulario.");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },


    /**Filtrado */
    filterTable() {
      this.lstFilter = this.lstSucursalesEntidades.filter((s) => {
        if(this.search != null || this.search != '') {
          return s.nombreSucursal.toLowerCase().includes(this.search.toLowerCase());  
        } 
      });
      this.countRows();
    },
    countRows() {
      let rowFilter = this.lstFilter.length;
      let rowTotal = this.lstSucursalesEntidades.length;
      this.filter = "Registros: " + rowFilter + "/" + rowTotal;
    },

    /**Modal */
    closeModal() {
      this.displayModalCredenciales = false;
    },
    abrirModal(entidadId, sucursalEntidadId) {
      this.displayModalCredenciales = true;
      this.entidadIdSelect = entidadId;
      this.sucursalEntidadIdSelect = sucursalEntidadId;
    },

    closeComponente(value) {
      this.displayModalCredenciales = value;
    }
    
    
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
  
</style>
