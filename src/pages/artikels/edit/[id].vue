<template>
  <div>
    <v-alert v-model="showSuccessAlert" type="success" :value="true">
      Artikel berhasil diubah!
    </v-alert>
    <VCard>
      <VCardTitle>
        <span class="text-h5">Edit Artikel</span>
      </VCardTitle>
      <VCardText>
        <VForm @submit.prevent="submit">
          <VTextField
            v-model="judul"
            class="form-field"
            label="Judul"
            required
          />
          <VTextField
            v-model="slug"
            class="form-field"
            label="Slug"
            disabled="true"
          />
          <VTextField
            v-model="kategori"
            class="form-field"
            label="Kategori"
            required
          />
          <!-- button to edit stryle text in VTextarea -->
          <!-- group this VBtn  -->
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
            :rules="rules"
          />
          <VBtn
            type="submit"
            color="primary"
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
import axios from '@axios'
import { ref, onMounted } from 'vue'
// import component ButtonOption.vue
const route = useRoute()
const router = useRouter()
const showSuccessAlert = ref(false);
// get id from route
const id = route.params.id
const judul = ref('')
const kategori = ref('')
const konten = ref('')
const slug = ref('')
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


// get artikel by id
const penulis = localStorage.getItem('userData').id


// set header untuk auth
const submit = async () => {
  try {
    const response = await axios.put(`artikel/${id}`, {
      judul: judul.value,
      kategori: kategori.value,
      konten: konten.value,
      slug: slug.value,
      // get penulis from localstorage 
      penulis: penulis,
    });
    // Show success alert and redirect to artikels list use timeout
    setTimeout(() => {
      showSuccessAlert.value = true;
      setTimeout(() => {
        showSuccessAlert.value = false;
        router.push({ name: 'artikels-list' });
      }, 1000);
    }, 1000);
    
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  if (id) {
    const response = await axios.get(`/artikel/edit/${id}`)

    judul.value = response.data.artikel.judul
    // convert slug from judul value
    slug.value = judul.value.toLowerCase().replace(/ /g, '-')
    konten.value = response.data.artikel.konten
    kategori.value = response.data.artikel.kategori

  }
})


// set penulis from localstorage
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

<route lang="yaml">
  layoutWrapperClasses: layout-content-height-fixed
</route>