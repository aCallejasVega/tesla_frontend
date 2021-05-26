<template>
  <div>
    <div
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
          <h2>
            <b style="color: #21618c">
              Generación de Código de Control
            </b>
          
          </h2></a-col
        >
        <a-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14" align="right">
          <a-row type="flex" justify="end">
            <a-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20" align="right">
              
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>

    <a-card style="width: 100%">
      <a-form-model
        ref="ruleForm"
        :model="codigoControlObj"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        size="small"
      >
      <div style="background-color:rgb(150,197,203)">
        <a-form-model-item v-if="codigoControl != null" 
          label="CÓDIGO DE CONTROL"
        >
         <b>{{codigoControl}}</b>
        </a-form-model-item>
      </div>
        <a-form-model-item
          ref="numeroAutorizacion"
          label="N° Autorización"
          prop="numeroAutorizacion"
        >
          <a-input
            v-model="codigoControlObj.numeroAutorizacion"
            :maxLength="200"
            @blur="
              () => {
                $refs.numeroAutorizacion.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
       
        <a-form-model-item
          ref="numeroFactura"
          label="N° Factura"
          prop="numeroFactura"
        >
          <a-input
            v-model="codigoControlObj.numeroFactura"
            :maxLength="200"
            @blur="
              () => {
                $refs.numeroFactura.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item
          ref="numeroDocumento"
          label="NIT/CI"
          prop="numeroDocumento"
        >
          <a-input
            v-model="codigoControlObj.numeroDocumento"
            :maxLength="200"
            @blur="
              () => {
                $refs.numeroDocumento.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item
          ref="fechaFactura"
          label="Fecha Factura"
          prop="fechaFactura"
        >
        
          <a-date-picker 
            format="DD/MM/YYYY"
            :locale="locale"
            v-model="codigoControlObj.fechaFactura"
            @blur="
              () => {
                $refs.fechaFactura.onFieldBlur();
              }
            "
          />
          <!--
           <a-input
            v-model="codigoControlObj.fechaFactura"
            :maxLength="200"
            @blur="
              () => {
                $refs.fechaFactura.onFieldBlur();
              }
            "
          />-->
        </a-form-model-item>
        <a-form-model-item ref="montoTotal" label="Monto Total Factura" prop="montoTotal">
          <money
            v-model="codigoControlObj.montoTotal"
            v-bind="money"
            class="ant-input"
            size="small"
          ></money>
        </a-form-model-item>
        <a-form-model-item
          ref="llaveDosificacion"
          label="Llave Dosificación"
          prop="llaveDosificacion"
        >
          <a-textarea
            v-model="codigoControlObj.llaveDosificacion"
            :maxLength="200"
            @blur="
              () => {
                $refs.llaveDosificacion.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
       <template slot="actions" class="ant-card-actions">
        <a-button type="link" @click="generarCodigoControl" style="color:white; background-color:#339966;border:0px" > 
          <a-icon type="form" />
            Generar 
          </a-button>
        <a-button type="primary" ghost @click="resetForm"><a-icon type="reload" /> Limpiar </a-button>
      </template>
    </a-card>
   
  </div>
</template>
<script>
import Invoices from "../../service/Facturacion/Invoices.service";
import locale from "ant-design-vue/es/date-picker/locale/es_ES";
import moment from "moment";
moment.locale("es");
import { Money } from "v-money";

export default {
  components: { Money },
  data() {
    return {
      codigoControlObj: {},
      codigoControl: null,
      locale,
      money: {
        decimal: ".",
        thousands: ",",
        //prefix: 'Bs ',
        precision: 2,
        masked: false,
        maxlength: 17,
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      rules: {
        numeroAutorizacion: [
          {
            required: true,
            message: "Debe registrar el N° Autorizacion",
            trigger: "blur",
          },
        ],
        numeroFactura: [
          {
            required: true,
            message: "Debe registrar el N° Factura",
            trigger: "blur",
          },
        ],
        numeroDocumento: [
          {
            required: true,
            message: "Debe registrar el NIT/CI",
            trigger: "blur",
          },
        ],
        fechaFactura: [
          {
            required: true,
            message: "Debe registrar la Fecha Factura",
            trigger: "change",
          },
        ],
        montoTotal: [
          {
            required: true,
            message: "Debe registrar el Monto Total de la Factura",
            trigger: "blur",
          },
        ],
        llaveDosificacion: [
          {
            required: true,
            message: "Debe registrar la Llave de Dosificacion",
            trigger: "blur",
          },
        ],
      }
    };
  },

  methods: {
    moment,
    FormatearFechaSinHoras(pFecha) {
      if (pFecha != null && pFecha != "")
        return moment(pFecha, "YYYY-MM-DDTHH:mm:ssZ").format("YYYY-MM-DD");
      return null;
    },
    generarCodigoControl() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {

          this.codigoControlObj.fechaFactura = this.FormatearFechaSinHoras(this.codigoControlObj.fechaFactura);
          this.$Progress.start();
          console.log(JSON.stringify(this.codigoControlObj));
          Invoices.postCodigoControl(this.codigoControlObj)
            .then((r) => {
              this.codigoControl = r.data.result;
              this.$Progress.finish();
              this.$notification.success(r.data.message);
            })
            .catch((error) => {
              this.codigoControl = null;
              this.$notification.error(
                error.response.data.message,
                error.response.data.code
              );
              this.$Progress.fail();
            });
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
      this.codigoControl = null;
      this.$refs.ruleForm.resetFields();
    },
   
  },
};
</script>