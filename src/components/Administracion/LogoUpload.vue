<template>
  <div :style="{ textAlign: 'center' }">
    
    <a-space align="center">
      <a-upload
        name="file"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :action="this.url"
        :before-upload="beforeUpload"
        @change="handleChange"
        :headers="{ Authorization: 'Bearer ' + this.token }"
      
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          alt=""
          width="180px"
          height="180px"
        />
        <div v-else>
          <a-icon :type="loading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
    </a-space>
  </div>
</template>
<script>
/**Logo */
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
  props: {
    entidadId: null,
  },
  data() {
    return {
      /** Logo */
      //urlOriginal: process.env.VUE_APP_EXACTA_TESLA + "api/entidades/upload",
      url:
        process.env.VUE_APP_EXACTA_TESLA +
        "api/entidades/upload/logo/" +
        this.entidadId,
      token: "",
      loading: false,
      imageUrl: "",
    };
  },
  created() {
    this.token = localStorage.getItem("token");
  },
  methods: {
    /**LOGO******************************************************* */
    /**Operaciones */
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$notification.warning("Solo archivos *.jpg y *.png");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$notification.warning("¡Archivo debe ser menor o igual a 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
  },
};
</script>