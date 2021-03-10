<template>
  <a-card style="width: 100%">
    <a-card v-if="!displayForm" style="width: 100%">
      <a-page-header
        style="border: 1px solid rgb(224,206,206)"
        title="Administración de Registro de Entidades"
      />
      <!--LISTADO DE ENTIDADES-->
      <!--
      <a-menu v-model="current" mode="horizontal" align="right">
        <a-menu-item
          v-for="(item, i) in lstOpciones"
          :key="i"
          @click="seleccionarOpcion(item.transaccion)"
        >
          {{ item.etiqueta }}
        </a-menu-item>
      </a-menu>-->
     <a-page-header align="right">
        <a-button-group >
      <a-button  v-for="(item, i) in lstOpciones" 
          :key="i"
          @click="seleccionarOpcion(item.transaccion)">
          {{ item.etiqueta }}
      </a-button>
        </a-button-group>
     </a-page-header>
      <br/>
    <!--  <a-alert
      message="Success Tips"
      description="Detailed description and advices about successful copywriting."
      type="success"
      show-icon
      />-->
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="lstEntidades"
        rowKey="entidadId"
        :pagination="pagination"
        :scroll="{ x: 1500 }"
      >
        <template slot="comprobante" slot-scope="text, record" >
          <a-checkbox :checked="record.comprobanteEnUno">
          </a-checkbox>
        </template>
        <template slot="logo" slot-scope="text, record" >
          <a
            ><a-icon type="download" :style="{ fontSize: '20px' }" /> 
            {{ record.pathLogo }}</a
          >
        </template>
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
        <template slot="opciones" slot-scope="text, record">
            <a href="javascript:;" @click="mostrarSucursal(record.entidadId)">Sucursales</a>
            <br/>
            <a href="javascript:;">Recaudadoras</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-card v-if="displayForm">
      <a-page-header
        style="border: 1px solid rgb(224,206,206)"
        title="Administración de Empresas, Universidades y otros"
        :sub-title="subTitle"
        @back="() => volverListado()"
      />
      <br/>
      <a-form-model
        ref="ruleForm"
        :model="entidadObj"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        size="small"
      >
        <a-form-model-item ref="nombre" label="Nombre Empresa" prop="nombre">
          <a-input
            v-model="entidadObj.nombre"
            @blur="
              () => {
                $refs.nombre.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="Tipo Entidad" prop="tipoEntidadId">
          <a-select
            v-model="entidadObj.tipoEntidadId"
            placeholder="Seleccione Tipo Entidad"
            @change="habilitarNombreComercial"
          >
            <a-select-option
              v-for="(item, i) in lstTiposEntidades"
              :key="i"
              :value="item.dominioId"
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          ref="nombreComercial"
          label="Nombre Comercial"
          prop="nombreComercial"
        >
          <a-input
            v-model="entidadObj.nombreComercial"
            :disabled="disabledNombreComercial"
          />
        </a-form-model-item>
        <a-form-model-item ref="direccion" label="Dirección" prop="direccion">
          <a-input
            v-model="entidadObj.direccion"
            @blur="
              () => {
                $refs.direccion.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="telefono" label="Teléfono" prop="telefono">
          <a-input
            v-model="entidadObj.telefono"
            @blur="
              () => {
                $refs.telefono.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item
          label="Actividad Económica"
          prop="actividadEconomicaId"
        >
          <a-select
            v-model="entidadObj.actividadEconomicaId"
            placeholder="Seleccione Actividad Económica"
          >
            <a-select-option
              v-for="(item, i) in lstActividadesEconomicas"
              :key="i"
              :value="item.dominioId"
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Municipio" prop="municipioId">
          <a-select
            v-model="entidadObj.municipioId"
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
        <a-form-model-item ref="nit" label="Nit" prop="nit">
          <a-input
            v-model="entidadObj.nit"
            @blur="
              () => {
                $refs.nit.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="Comprobante en Uno" prop="comprobanteEnUno">
          <a-switch v-model="entidadObj.comprobanteEnUno" />
        </a-form-model-item>
        <a-form-model-item ref="pathLogo" label="Logo" prop="pathLogo">
          <a-input v-model="entidadObj.pathLogo" />
        </a-form-model-item>
        <a-form-model-item ref="pathLogo" label="Logo" prop="pathLogo">
          <a-upload action="" list-type="picture">
            <a-button> <a-icon type="upload" /> Cargar Logo </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
      <template slot="actions" class="ant-card-actions">
         <a-button type="link" @click="onSubmit"> Registrar </a-button>
          <a-button type="link" @click="resetForm"> Limpiar </a-button>
      </template>
    </a-card>

    <!--
      
    <a-modal v-model="displayModal" title="Confirmación" @ok="closeModal">
      <a-row>
        <a-col :span="6"
          ><a-icon
            type="question-circle"
            :style="{ fontSize: '105px', color: '#8EBDF5' }"
        /></a-col>
        <a-col :span="18">
          <a-alert
            message="Ver detalle del archivo."
            description="¿Quiere ingresar al detalle do los registros de las deudas enviadas en este archivo?"
            type="info"
          />
        </a-col>
      </a-row>

      <template slot="footer">
        <a-button key="back" @click="closeModal()"> Cancelar </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="ingresarDetalleArchivo()"
        >
          Aceptar
        </a-button>
      </template>
    </a-modal>-->
  </a-card>
</template>
<script>
import Dominios from "../../service/Administraciones/Dominio.service";
import Entidades from "../../service/Administraciones/Entidad.service";

const columns = [
  {
    title: "Nombre",
    dataIndex: "nombre",
    fixed: "left",
  },
  {
    title: "Tipo Entidad",
    dataIndex: "tipoEntidadDescripcion",
  },
  {
    title: "Nombre Comercial",
    dataIndex: "nombreComercial",
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
    title: "Actividad Económica",
    dataIndex: "actividadEconomicaDescripcion",
  },
  {
    title: "Municipio",
    dataIndex: "municipioDescripcion",
  },
  {
    title: "Nit",
    dataIndex: "nit",
  },
  {
    title: "Comprobante en uno",
    dataIndex: "comprobanteEnUno",
    scopedSlots: { customRender: "comprobante" },
  },
  {
    title: "Logo",
    dataIndex: "pathLogo",
    scopedSlots: { customRender: "logo" },
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
      /*******LISTADO DE ENTIDADES********* */
      /*Datos*/
      lstEntidades: [],
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
      displayModal: true,

      /*******FORMULARIO ENTIDADES********* */
      /*Datos*/
      entidadObj: {},
      /*Formulario*/
      subTitle: '',
      displayForm: false,
      disabledNombreComercial: true,
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
        tipoEntidadId: [
          {
            required: true,
            message: "Debe seleccionar un Tipo de Entidad",
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
            min: 5,
            max: 10,
            message: "El teléfono debe contener al menos 5 caracteres y máximo 10",
            trigger: "blur",
          },
        ],
        actividadEconomicaId: [
          {
            required: true,
            message: "Debe seleccionar una actividad económica",
            trigger: "change",
          },
        ],
        municipioId: [
          {
            required: true,
            message: "Debe seleccionar un municipo",
            trigger: "change",
          },
        ],
        telefono: [
          {
            required: true,
            message: "Debe registrar el teléfono",
            trigger: "blur",
          },
        ],
        nit: [
          {
            required: true,
            message: "Debe registrar el nit",
            trigger: "blur",
          },
          {
            min: 10,
            max: 13,
            message: "El teléfono debe contener al menos 10 caracteres y máximo 13",
            trigger: "blur",
          },
        ],
      },

      /*Dominios*/
      lstTiposEntidades: [],
      lstActividadesEconomicas: [],
      lstMunicipios: [],
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
    this.cargarEntidades();
    this.cargarTipoEntidades();
    this.cargarActividadesEconomicas();
    this.cargarMunicipios();
  },

  methods: {
    /*****LISTADO DE ENTIDADES*** */
    /**Menú */
    seleccionarOpcion(opcion) {
      switch (opcion) {
        case 'CREAR': //CREAR
          this.entidadObj = {};
          this.displayForm = true;
          this.subTitle = "Formulario Registro Nuevo";
          break;  
        case 'MODIFICAR': //Modiicar
          if(this.selectedRowKeys.length === 1) {
            this.cargarEntidad(this.selectedRowKeys);
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
                this.actualizaListaEntidadesTransaccion(this.selectedRowKeys, "ELIMINAR");
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
                this.actualizaListaEntidadesTransaccion(this.selectedRowKeys, "ACTIVAR");
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
                this.actualizaListaEntidadesTransaccion(this.selectedRowKeys, "DESACTIVAR");
              },
              onCancel() {  
                console.log('Cancel');
              },
              class: 'test',
            });
            //this.actualizaEntidadTransaccion(this.selectedRowKeys, "DESACTIVAR");
            
          } else {
            this.$notification.warning('Debe seleccionar al menos un registro para DAR BAJA')
          }
          break;
      }
    },
    /**Opeaciones */
    cargarEntidades() {
      Entidades.getLstEntidad().then((r) => {
        this.lstEntidades = r.data.result;
      });
    },
    actualizaEntidadTransaccion(entidadId, transaccion) { //Solo se usara el listado
      Entidades.putEntidadTransaccion(entidadId, transaccion).then((r) => {
        this.cargarEntidades();
        this.$notification.success(r.data.message);
      }).catch((error) => {
        console.log(error)
        this.$notification.error(error.response.data.message, error.response.data.code);
        //this.$message.error(error.response.data.message + '\n Código de error: ' + error.response.data.code );
        //this.loadMessageWarning(error.response.data.message);
      });
    },

    actualizaListaEntidadesTransaccion(entidadIdLst, transaccion) {
      Entidades.putLstEntidadTransaccion(entidadIdLst, transaccion).then((r) => {
        this.cargarEntidades();
        //this.success(r.data.message);
        this.$notification.success(r.data.message);
      }).catch((error) => {
        console.log(error)
        //this.$message.error(error.response.data.message + '\n Código de error: ' + error.response.data.code );
        //this.error(error.response.data.message, error.response.data.code);     
        this.$notification.error(error.response.data.message, error.response.data.code);
      });
    },
    /**Visualizaciones */
    mostrarSucursal(entidadId) {
      this.$router.push({
        name: "AbmSucursales",
        params: { entidadId: entidadId },
      });
    },


    /****FORMULARIO**** */
    /*Control de campos*/
    volverListado() {
      this.displayForm = !this.displayForm;
      this.entidadObj = {};
      this.selectedRowKeys = [];//erificar
    },
    habilitarNombreComercial(dominioId) {
      this.disabledNombreComercial = dominioId != 3;
    },
    /*Lista de Dominio*/
    cargarTipoEntidades() {
      Dominios.getListDominos("tipo_entidad_id").then((r) => {
        this.lstTiposEntidades = r.data.result;
      });
    },
    cargarActividadesEconomicas() {
      Dominios.getListDominos("actividad_economica_id").then((r) => {
        this.lstActividadesEconomicas = r.data.result;
      });
    },
    cargarMunicipios() {
      Dominios.getListDominos("municipio_id").then((r) => {
        this.lstMunicipios = r.data.result;
      });
    },
    /*Operaciones*/
    cargarEntidad(entidadId) {
      Entidades.getEntidad(entidadId).then((r) => {
        this.entidadObj = r.data.result;
      });
    },
    guardarEntidad() {
      Entidades.postEntidad(this.entidadObj)
        .then((r) => {
          console.log(r);
          this.displayForm = false;
          this.cargarEntidades();
          this.$notification.success(r.data.message);
        })
        .catch((error) => {
          console.log(error);
          this.$notification.error(error.response.data.message, error.response.data.code);
        });
      
    },
    /*Acciones de Formulario*/
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.guardarEntidad(this.entidadObj);
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
  },
};
</script>
<style scoped>
</style>



<!--
<template>
  <a-form-model
    ref="ruleForm"
    :model="entidadObj"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item ref="name" label="Activity name" prop="name">
      <a-input
        v-model="entidadObj.name"
        @blur="
          () => {
            $refs.name.onFieldBlur();
          }
        "
      />
    </a-form-model-item>
    <a-form-model-item label="Activity zone" prop="region">
      <a-select v-model="entidadObj.region" placeholder="please select your zone">
        <a-select-option value="shanghai">
          Zone one
        </a-select-option>
        <a-select-option value="beijing">
          Zone two
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="Activity time" required prop="date1">
      <a-date-picker
        v-model="entidadObj.date1"
        show-time
        type="date"
        placeholder="Pick a date"
        style="width: 100%;"
      />
    </a-form-model-item>
    <a-form-model-item label="Instant delivery" prop="delivery">
      <a-switch v-model="entidadObj.delivery" />
    </a-form-model-item>
    <a-form-model-item label="Activity type" prop="type">
      <a-checkbox-group v-model="entidadObj.type">
        <a-checkbox value="1" name="type">
          Online
        </a-checkbox>
        <a-checkbox value="2" name="type">
          Promotion
        </a-checkbox>
        <a-checkbox value="3" name="type">
          Offline
        </a-checkbox>
      </a-checkbox-group>
    </a-form-model-item>
    <a-form-model-item label="Resources" prop="resource">
      <a-radio-group v-model="entidadObj.resource">
        <a-radio value="1">
          Sponsor
        </a-radio>
        <a-radio value="2">
          Venue
        </a-radio>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item label="Activity form" prop="desc">
      <a-input v-model="entidadObj.desc" type="textarea" />
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">
        Create
      </a-button>
      <a-button style="margin-left: 10px;" @click="resetForm">
        Reset
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
export default {
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      other: '',
      entidadObj: {
          name: '',
          region: undefined,
          date1: undefined,
          delivery: false,
          type: [],
          resource: '',
          desc: '',
      },
      rules: {
        name: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
        ],
        region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
        date1: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
        type: [
          {
            type: 'array',
            required: true,
            message: 'Please select at least one activity type',
            trigger: 'change',
          },
        ],
        resource: [
          { required: true, message: 'Please select activity resource', trigger: 'change' },
        ],
        desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
      },
    };
  },
  mount() {

  },

  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>
-->