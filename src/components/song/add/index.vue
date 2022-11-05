<template>
  <div style="width: 99%; margin: 10px auto;">
    <el-steps :active="step" simple>
      <el-step title="填写信息" icon="el-icon-edit"></el-step>
      <el-step title="上传" icon="el-icon-upload"></el-step>
      <el-step title="检查" icon="el-icon-check"></el-step>
    </el-steps>
    <el-form ref="form" :model="song" label-width="100px" style="margin: 20px 0px" v-show="step === 1">
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
      <el-card class="box-card" v-for="attrGroup in attributeGroupList" :key="attrGroup.id" style="width: 320px;">
        <div slot="header" class="clearfix">
          <span>{{ attrGroup.groupName }}</span>
        </div>
        <el-form-item :label="attribute.name" v-for="attribute in attrGroup.attributeList" :key="attribute.id">
          <el-input v-model="attribute.value"></el-input>
        </el-form-item>
      </el-card>
      <el-form-item label="歌曲名称">
        <el-input v-model="song.name" style="width: 220px;"></el-input>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="song.publishDate"
          type="datetime"
          placeholder="选择发布时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="立即上架">
        <el-switch v-model="song.nowPublish" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="预上架时间"  v-show="!song.nowPublish">
        <el-date-picker
          v-model="song.prePublishDate"
          type="datetime"
          placeholder="选择预上架时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="选择歌手">
        <el-select
          v-model="song.singerId"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入歌手id或名称"
          :remote-method="remoteMethod"
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
        <el-switch v-model="song.showStatus" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="是否有MV">
        <el-switch v-model="song.isHaveMv" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-button @click="back">后退</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
    </el-form>
  </div>
</template>

<script>
import attributeApi from '@/api/attribute/index'
import categoryApi from '@/api/category/index'
import singerApi from '@/api/singer/index'
export default {
  name: "index",
  data() {
    return {
      step: 1,
      song: {
        nowPublish: 1
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
    changeCategoryType(id) {
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
  }
}
</script>

<style scoped>

</style>
