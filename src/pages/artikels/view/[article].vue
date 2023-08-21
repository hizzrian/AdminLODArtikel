<template>
  <div>
    <VCard>
      <VCardText class="pb-0">
        <VBtn
          variant="tonal"
          :to="{
            name: 'artikels-list',
          }"
        >
          <VIcon
            icon="tabler-chevron-left"
            class="flip-in-rtl"
          />
          <span>Back to Artikel</span>
        </VBtn>
      </VCardText>
      <VCardItem>
        <template #prepend>
          <VAvatar
            color="primary"
            variant="tonal"
            rounded
          >
            <VIcon icon="tabler-file" />
          </VAvatar>
          <!-- show date -->
          <!-- disbelah kanan -->
        </template>
        <VCardTitle>{{ artikel.judul }}</VCardTitle>
        <VCardSubtitle>{{ artikel.tanggal_publikasi }}</VCardSubtitle>
      </VCardItem>
      <VDivider />
      <VContainer fluid>
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <VCardTitle>
              <span class="text-h6">Kategori</span>
            </VCardTitle>
            <VCardText>
              <VChipGroup>
                <VChip
                  label
                  color="primary"
                  text-color="white"
                >
                  {{ artikel.kategori }}
                </VChip>
              </VChipGroup>
            </VCardText>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VCardTitle>
              <span class="text-h6">Reading Time</span>
            </VCardTitle>
            <VCardText>
              <VChip
                label
                color="primary"
                text-color="white"
              >
                {{ readingTime }}
              </VChip>
            </VCardText>
          </VCol>
        </VRow>
      </VContainer>
      <VDivider />
      
      <!-- //random image from https://picsum.photos/ -->
      <VSkeletonLoader
        v-if="loading"
        class="mx-auto border"
        type="image"
        max-width="100%"
      >
        <VImg
          src="https://picsum.photos/400/300?random"
          max-height="400"
          max-width="100%"
          cover
          class="bg-grey-lighten-2"
        />
      </VSkeletonLoader>
      <!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component -->
      <VCardText
        class="help-center-article-content"
        v-html="artikel.konten"
      />
      <!-- eslint-enable vue/no-v-html vue/no-v-text-v-html-on-component -->
  
      <VDivider />
  
      <VCardText>
        <div class="d-flex justify-space-between flex-wrap mb-2">
          <div class="article-info">
            <h6 class="text-h6 mb-1">
              {{ artikel.judul }}
            </h6>
            <p class="mb-1">
              {{ artikel.views }} Views
            </p>
          </div>  
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import axios from '@/plugins/axios'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

const route = useRoute()
const router = useRouter()
const artikel = ref({})
const readingTime = ref(0)
const loading = ref(false)


// set loading time to 1 second then set loading to false
setTimeout(() => {
  loading.value = true
}, 3000)


// back to artikel list
const backToArtikelList = () => {
  router.push({ name: 'artikels-list' })
}

onMounted(async () => {
  const slug = route.params.article // Make sure you access it inside onMounted
  // console.log(slug)
  if (slug) {
    const response = await axios.get(`/artikel/${slug}`)

    artikel.value = response.data.artikel
    readingTime.value = response.data.readingTime
    console.log(readingTime.value)
  }
})
</script>

<route lang="yaml">
  name: 'artikel-view'
  path: '/artikels/view/:article'
  layoutWrapperClasses: layout-content-height-fixed
</route>