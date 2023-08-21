<script setup>
import axios from '@axios'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@/@fake-db/utils'
import { ref, onMounted } from 'vue'
import debounce from 'lodash.debounce'
import { useRouter } from 'vue-router'

const route = useRouter()
const searchQuery = ref('')
const selectedSlug = ref('')
const selectedKategori = ref()
const artikelList = ref([])
const totalPage = ref(1)
const totalItems = ref(0)
const slugs = ref()
const kategoris = ref()
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

const isDialogVisible = ref(false)
const selectedArticleId = ref(null)
let userDatas = JSON.parse(localStorage.getItem('userData'))


// headers
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'JUDUL',
    key: 'judul',
  },
  {
    title: 'CATEGORY',
    key: 'kategori',
  },
  {
    title: 'CONTENT',
    key: 'konten',
  },
  {
    title: 'PENULIS',
    key: 'penulis',
  },
  {
    title: 'VIEWS',
    key: 'views',
    sortable: false,
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]


// open dialog and set selectedArticleId
const openDialog = id => {
  isDialogVisible.value = true
  selectedArticleId.value = id
}


// delete artikel by id from openDialog
const deleteArtikel = () => {
  axios.delete(`artikel/${selectedArticleId.value}`).then(res => {
    console.log(res)
    isDialogVisible.value = false
    getArticles()
  })
}

const getSlugs = () => {
  axios.get('slug').then(res => {
    // convert object to json
    
    slugs.value = res.data.slug.map(item => item.slug)
  })
}

const getKategoris = () => {
  axios.get('kategori').then(res => {
    // convert object to json
    kategoris.value = res.data.kategori.map(item => item.kategori)
  })
}

const handleSearch = debounce(() => {
  getArticles()
}, 300)

const getArticles = () => {
  axios.get('artikel/', { params: 
    {
      slug: selectedSlug.value,
      kategori: selectedKategori.value,
      search: searchQuery.value,
      options: options.value,
      user_id: userDatas.id,
    } }).then(res => {
    artikelList.value = res.data.data
    console.log(res.data.data)
    artikelList.value.forEach(item => {
      item.konten = item.konten.substring(0, 100) + '...'
    })
    totalItems.value = res.data.data.length
  })
}


// go to add artikel
const addView = () => {
  route.push({ name: 'artikels-add' })
}

const editView = id => {
  route.push({ path: `/artikels/edit/${id}` })
}

const viewsArtikel = slug => {
  route.push({ path: `/artikels/view/${slug}` })
}

onMounted(() => {
  watch(searchQuery, handleSearch)
  watch(selectedSlug, handleSearch)
  watch(selectedKategori, handleSearch)
  watch(options.value, handleSearch)
  getArticles()
  getSlugs()
  getKategoris()
})
</script>

<template>
  <div>
    <VDialog
      v-model="isDialogVisible"
      persistent
      class="v-dialog-sm"
    >
      <!-- Dialog Activator -->

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="Delete Artikel">
        <VCardText>
          Are you sure you want to delete this artikel? {{ itemId }}
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisible = false"
          >
            Disagree
          </VBtn>
          <VBtn
            color="error"
            @click="deleteArtikel"
          >
            Agree
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VCard>
      <section>
        <VRow>
          <VCol cols="12">
            <VCard title="Search Filter">
              <!-- 👉 Filters -->
              <VCardText>
                <VRow>
                  <!-- 👉 Select Role -->
                  <VCol
                    cols="12"
                    sm="4"
                  >
                    <AppSelect
                      :key="slugs"
                      v-model="selectedSlug"
                      label="Select Slug"
                      :items="slugs"
                      clearable
                      clear-icon="tabler-x"
                    />
                  </VCol>
                  <!-- 👉 Select Plan -->
                  <VCol
                    cols="12"
                    sm="4"
                  >
                    <AppSelect
                      :key="kategoris"
                      v-model="selectedKategori"
                      label="Select Kategori"
                      clearable
                      :items="kategoris"
                      clear-icon="tabler-x"
                    />
                  </VCol>
                </VRow>
              </VCardText>

              <VDivider />

              <VCardText class="d-flex flex-wrap py-4 gap-4">
                <div class="me-3 d-flex gap-3">
                  <AppSelect
                    :model-value="options.itemsPerPage"
                    :items="[
                      { value: 2, title: '2' },
                      { value: 25, title: '25' },
                      { value: 50, title: '50' },
                      { value: 100, title: '100' },
                      { value: -1, title: 'All' },
                    ]"
                    style="width: 6.25rem;"
                    @update:model-value="options.itemsPerPage = parseInt($event, 10)"
                  />
                </div>
                <VSpacer />

                <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                  <!-- 👉 Search  -->
                  <div style="inline-size: 10rem;">
                    <AppTextField
                      v-model="searchQuery"
                      placeholder="Search"
                      density="compact"
                    />
                  </div>

                  <!-- 👉 Add user button -->
                  <VBtn
                    prepend-icon="tabler-plus"
                    color="primary"
                    @click="addView"
                  >
                    Add New Artikel
                  </VBtn>
                </div>
              </VCardText>

              <VDivider />

              <!-- SECTION datatable -->
              <VDataTableServer
                v-model:items-per-page="options.itemsPerPage"
                v-model:page="options.page"
                :items="artikelList"
                :items-length="totalItems"
                :headers="headers"
                class="text-no-wrap"
                @update:options="options = $event"
              >
                <!-- Actions -->
                <template #item.actions="{ item }">
                  <IconBtn @click="openDialog(item.raw.id)">
                    <VIcon icon="tabler-trash" />
                  </IconBtn>

                  <IconBtn @click="editView(item.raw.id)">
                    <VIcon icon="tabler-edit" />
                  </IconBtn>

                  <VBtn
                    icon
                    variant="text"
                    size="small"
                    color="medium-emphasis"
                  >
                    <VIcon
                      size="24"
                      icon="tabler-dots-vertical"
                    />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem @click="viewsArtikel(item.raw.slug)">
                          <template #prepend>
                            <VIcon icon="tabler-eye" />
                          </template>

                          <VListItemTitle>View</VListItemTitle>
                        </VListItem>

                        <VListItem @click="editView(item.raw.id)">
                          <template #prepend>
                            <VIcon icon="tabler-pencil" />
                          </template>
                          <VListItemTitle>Edit</VListItemTitle>
                        </VListItem>

                        <VListItem @click="openDialog(item.raw.id)">
                          <template #prepend>
                            <VIcon icon="tabler-trash" />
                          </template>
                          <VListItemTitle>Delete</VListItemTitle>
                        </VListItem>
                      </VList>
                    </VMenu>
                  </VBtn>
                </template>

                <!-- pagination -->
                <template #bottom />
              </VDataTableServer>
              <v-pagination
                v-model="options.page"
                :length="2"
                :items-per-page="options.itemsPerPage"
                @update:page="options.page = $event"
              />
            <!-- SECTION -->
            </VCard>
          </VCol>
        </VRow>
      </section>
    </VCard>
  </div>
</template>

<route lang="yaml">
  name: 'artikels-list'
  path: '/artikels/list'
  layoutWrapperClasses: layout-content-height-fixed
</route>