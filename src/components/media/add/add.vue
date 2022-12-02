<template>
  <div style="width: 99%; margin: 10px auto;">
    <el-steps :active="this.$route.query.step == ''? 1:this.$route.query.step" simple>
      <el-step title="填写信息" icon="el-icon-edit"></el-step>
      <el-step title="上传" icon="el-icon-upload"></el-step>
      <el-step title="检查" icon="el-icon-check"></el-step>
    </el-steps>
    <el-form ref="form" :model="media" label-width="100px" style="margin: 20px 0px" v-show="step === undefined">
      <el-form-item label="新增类型">
        <el-select v-model="categoryType" placeholder="请选择" style="width: 220px;" @change="changeCategoryType">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="歌曲名称">
        <el-input v-model="media.name" style="width: 220px;"></el-input>
      </el-form-item>
      <el-form-item label="专辑名称">
        <el-input v-model="media.album" style="width: 220px;"></el-input>
      </el-form-item>
      <el-form-item label="发行日期">
        <el-date-picker
          v-model="media.publishDate"
          type="date"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="专辑">
        <el-select
          v-model="media.albumId"
          filterable
          remote
          allow-create
          reserve-keyword
          placeholder="请输入歌手id或名称"
          :remote-method="remoteMethod"
          :loading="loading"
          style="width: 220px">
          <el-option
            v-for="item in albumList"
            :key="item.id"
            :label="'专辑名称:' + item.name + '  专辑id:' + item.id"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-card class="box-card" v-for="attrGroup in attributeGroupList" :key="attrGroup.id" style="width: 400px;">
        <div slot="header" class="clearfix">
        <span>{{ attrGroup.groupName }}</span>
        </div>
        <el-form-item :label="attribute.name" v-for="attribute in attrGroup.attributeList" :key="attribute.id">
<!--          <el-input v-model="attribute.value"></el-input>-->
          <component :is="attribute.inputName" :attributeId="attribute.id" @updateAttributeValue="updateAttributeValue"></component>
        </el-form-item>
      </el-card>
<!--      <el-form-item label="立即上架">-->
<!--        <el-switch v-model="media.nowPublish" :active-value="1" :inactive-value="0"></el-switch>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="预上架时间"  v-show="!song.nowPublish">-->
<!--        <el-date-picker-->
<!--          v-model="song.prePublishDate"-->
<!--          type="datetime"-->
<!--          placeholder="选择预上架时间">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->

      <el-form-item label="选择歌手">
        <el-select
          v-model="media.singerIdList"
          filterable
          remote
          reserve-keyword
          placeholder="请输入歌手id或名称"
          :remote-method="queryAlbum"
          :loading="loading"
          style="width: 220px">
          <el-option
            v-for="item in singerList"
            :key="item.id"
            :label="'歌手名称:' + item.name + '  歌手id:' + item.id"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="显示状态">
        <el-switch v-model="media.showStatus" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="是否有MV">
        <el-switch v-model="media.isHaveMv" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
    </el-form>
    <el-button @click="back">后退</el-button>
    <el-button type="primary" @click="nextUpload" v-show="step === undefined">下一步, 上传媒体</el-button>
    <el-button type="primary" @click="nexCheck" v-show="step == 2">下一步， 检查</el-button>
    <el-button type="primary" @click="nextPublish" v-show="step == 3">下一步， 发布</el-button>
    <el-upload class="upload-demo" drag :http-request="upload" v-show="step == 2" :auto-upload="true" :action="'https://www.baidu.com'">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
import mediaApi from '@/api/media/index'
import * as qiniu from 'qiniu-js'
import uploadApi from '@/api/uplaod/index'
import attributeAlbumInput from "@/components/attribute/attribute-album-input"
import attributeInput from "@/components/attribute/attribute-input"
import attributeSingerInput from "@/components/attribute/attribute-singer-input"
import attributeTextAreaInput from "@/components/attribute/attribute-text-area-input"
import attributeDateInput from "@/components/attribute/attribute-date-input"
import attributeApi from '@/api/attribute'
import categoryApi from '@/api/category'
import singerApi from '@/api/singer'
import albumApi from "@/api/album";
import media from "@/api/media/index";
export default {
  name: "index",
  components: {
    attributeDateInput,
    attributeSingerInput,
    attributeTextAreaInput,
    attributeInput,
    attributeAlbumInput
  },
  data() {
    return {
      albumList: [],
      media: {

      },
      singerList: [],
      loading: false,
      categoryList: [],
      categoryType: null,
      attributeGroupList: []
    }
  },
  created() {
    this.getALlCategoryList()
  },
  methods: {
    queryAlbumByNameOrId(queryText) {
      albumApi.query({ queryText }).then(
        response => {
          if (response.code === 200) {
            this.albumList = response.data
          }
        }
      )
    },
    queryAlbum(queryText) {
      if (queryText) {
        this.queryAlbumByNameOrId(queryText)
      }
    },
    upload(file) {
      console.log(file.file)
      uploadApi.getUploadToken().then(
        response => {
          if (response.code === 200) {
            const putExtra = {
              fname: file.file.name,
              mimeType: file.type,
              customVars: {
                'x:mediaId': this.$route.query.id.toString(),
                'x:type': 'song',
                'x:column': 'media_url'
              }
            }
            const config = {
              useCdnDomain: true,
              region: qiniu.region.z0
            }
            const observable = qiniu.upload(file.file, null, response.data, putExtra, config)
            const subscription = observable.subscribe((res) => {

            }, (error) => {

            }, (res) => {
              console.log(res.url)
              console.log(res.key)
              this.$message.success('上传成功')
            })
          }
        }
      )
    },
    updateAttributeValue(attributeId, value) {
      this.attributeGroupList.map((attributeGroup) => {
        attributeGroup.attributeList.map((attribute) => {
          if (attribute.id === attributeId) {
            attribute.value = value
          }
        })
      })
    },
    changeCategoryType(id) {
      this.media.type = id
      categoryApi.getAttributeGroupAndAttributeByCategoryId(id).then(
        response => {
          if (response.code === 200) {
            this.attributeGroupList = response.data
          }
        }
      )
    },
    getALlCategoryList() {
      categoryApi.getAll().then(
        response => {
          if (response.code === 200) {
            this.categoryList = response.data
          }
        }
      )
      if (this.$route.query.categoryType) {
        this.categoryType = Number(this.$route.query.categoryType)
        this.changeCategoryType(Number(this.$route.query.categoryType))
      }
    },
    querySingerByNameOrId(queryText) {
      singerApi.query(queryText).then(
        response => {
          if (response.code === 200) {
            this.singerList = response.data
          }
        }
      )
    },
    remoteMethod(queryText) {
      if (queryText) {
        this.querySingerByNameOrId(queryText)
      }
    },
    nextUpload() {
      this.next()
      mediaApi.insert(this.media).then(
        response => {
          if (response.code === 200) {
            this.$message.success('基本信息新增成功，请上传媒体')
            this.$router.push({ path: '/media/admin/add', query: { id: response.data, step: 2 }})
            console.log(this.$route.params)
          }
        }
      )
    },
    next() {
      if (this.step < 3) {
        this.step++
      }
    },
    back() {
      if (this.step > 1) {
        this.step--
      }
    }
  },
  computed: {
    step() {
      return this.$route.query.step
    }
  }
}
</script>

<style scoped>

</style>
