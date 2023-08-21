<template>
<div>
    <v-alert v-model="showSuccessAlert" type="success" :value="true">
      Artikel berhasil dibuat!
    </v-alert>
    <v-alert v-model="errorAlert" type="error" :value="true">
        Artikel gagal dibuat!
    </v-alert>
    <VCard>
      <VCardTitle>
        <span class="text-h5">Add Artikel</span>
      </VCardTitle>
      <VCardText>
        <VForm @submit.prevent="submit">
          <VTextField
            v-model="judul"
            class="form-field"
            label="Judul"
            :rules="[requiredValidator]"
          />
          <VTextField
            v-model="kategori"
            class="form-field"
            label="Kategori"
            :rules="[requiredValidator]"
          />
          <VTextField
            v-model.lazy="slug"
            class="form-field"
            label="Slug"
            :rules="[requiredValidator]"
          />
          <VCard>
            <VBtn
            class="group"
            color="primary"
            @click="bold"
            >
              Bold
            </VBtn>
            <VBtn
              class="group"
              color="primary"
              @click="italic"
            >
              Italic
            </VBtn>
            <VBtn
              class="group"
              color="primary"
              @click="underline"
            >
              Underline
            </VBtn>
            <VBtn
              class="group"
              color="primary"
              @click="strike"
            >
              Strike
            </VBtn>
            <VBtn
              class="group"
              color="primary"
              @click="link"
            >
              Link
            </VBtn>
          </VCard>
          <VTextarea
            v-model="konten"
            counter
            label="Konten"
            :rules="[requiredValidator, lenghtValidatorMinMax(konten, 50,100000)]"
          />
            
          <VBtn
            type="submit"
            color="primary"
            @click="refForm?.validate()"
          >
            Submit
          </VBtn>

          <VBtn
            class="ml-2"
            color="error"
            :to="{ name: 'artikels-list' }"
          >
            Cancel
          </VBtn>
        </VForm>
      </VCardText>
    </VCard>
</div>

</template>
<script setup>
import axios from '@/plugins/axios'
import { ref } from 'vue'
import {
  requiredValidator,
  lenghtValidatorMinMax,
} from '@validators'
import { watch } from 'vue';

const router = useRouter()
const showSuccessAlert = ref(false);
const errorAlert = ref(false);
const judul = ref('')
// slug diambil dari judul yang diubah menjadi slug dengan slugify
const slug = ref('')
const kategori = ref('')
const konten = ref('')
const bold = () => {
  konten.value += '<b></b>'
}
// italic text use html tag
const italic = () => {
  konten.value += '<i></i>'
}
// underline text use html tag
const underline = () => {
  konten.value += '<u></u>'
}
// strike text use html tag
const strike = () => {
  konten.value += '<s></s>'
}
// link text use html tag
const link = () => {
  konten.value += '<a href=""></a>'
}
const rules = [
  v => v.length <= 100000 || 'Max 100000 characters',
]


const items = [
  'Programming',
  'Design',
  'Vue',
]

// set penulis from localstorage
const penulis = localStorage.getItem('userData')


// set header untuk auth
const submit = () => {
  axios.post('artikel', {
    judul: judul.value,
    kategori: kategori.value,
    konten: konten.value,

    // get penulis from localstorage 
    penulis: JSON.parse(penulis).id,
  }).then(res => {
    setTimeout(() => {
      showSuccessAlert.value = true;
      setTimeout(() => {
        showSuccessAlert.value = false;
        router.push({ name: 'artikels-list' });
      }, 1000);
    }, 1000);
  }).catch(err => {
    errorAlert.value = true;
    setTimeout(() => {
      errorAlert.value = false;
    }, 1000);
  })
}
watch(judul, (value) => {
  slug.value = value.toLowerCase().replace(/ /g, '-')
})
</script>
<style scoped>
  /* Add spacing between form fields */
  .form-field {
    margin-bottom: 20px; /* Adjust this value as needed */
  }
  .group {
    margin-right: 10px;
    /* group button */
    margin-bottom: 5px;
  }
</style>