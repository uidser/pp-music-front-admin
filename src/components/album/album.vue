<template>
  <div style="width: 99%; margin: 10px auto;">
    <el-input v-model="queryVo.queryText" placeholder="请输入内容" style="width: 10%;"></el-input>
    <el-button type="primary" icon="el-icon-search" @click="search" style="margin: 0px 10px"></el-button>
    <el-button type="primary" icon="el-icon-plus" @click="insert"></el-button>
    <el-table
      ref="multipleTable"
      :data="singerList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="id"
        label="专辑ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="专辑名称">
      </el-table-column>
      <el-table-column
        prop="favoriteQuantity"
        label="收藏总数">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="isEnable"
        label="启用状态">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.showStatus"
            active-text="显示"
            inactive-text="隐藏"
            :inactive-value="0"
            :active-value="1"
            @change="changeShowStatus($event, scope.row.id)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-s-data" @click="relation(scope.row.id)"></el-button>
          <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changeCurrent">
    </el-pagination>
    <el-dialog title="排行榜信息" :visible.sync="showDialog">
      <el-form :model="album">
        <el-form-item label="ID" label-width="200px" v-if="album.id">
          <el-input v-model="album.id" disabled autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="专辑名称" label-width="200px">
          <el-input v-model="album.name" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="专辑封面" label-width="200px">
          <img :src="album.profilePicture" v-if="album.profilePicture" width="50" />
          <el-input v-model="album.profilePicture" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="专辑作者" label-width="200px">
          <attribute-singer-input @update="(event) => {album.singerIds = event}" :singer-list="album.singerList" :value="album.singerIds"></attribute-singer-input>
        </el-form-item>
        <el-form-item label="发行时间" label-width="200px">
          <el-date-picker
            v-model="album.publishDate"
            type="date"
            placeholder="发行日期"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="专辑详情" label-width="200px">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入专辑详情"
            v-model="album.detail">
          </el-input>
        </el-form-item>
        <el-form-item label="启用状态" label-width="200px">
          <el-switch
            style="display: block"
            v-model="album.showStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="显示"
            inactive-text="不显示"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="showRelation"
      width="30%"
      :before-close="handleClose">
      <span>{{ album.name }}</span>
      <br/>
      <attribute-media-input @update="(event) => {albumRelation = event}" :media-list="album.mediaList" :value="album.mediaIdList"></attribute-media-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showRelation = false">取 消</el-button>
    <el-button type="primary" @click="commitRelation">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import albumApi from '@/api/album/index'
import AttributeSingerInput from '@/components/attribute/attribute-singer-input'
import AttributeMediaInput from '@/components/attribute/attribute-media-input'
export default {
  name: "admin",
  components: { AttributeMediaInput, AttributeSingerInput },
  data() {
    return {
      queryVo: {},
      singerList: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      showDialog: false,
      album: {},
      showRelation: false,
      albumRelation: [],
      count: 0,
      mediaList: []
    }
  },
  created() {
    this.page({ ...this.queryVo, current: this.currentPage, limit: 10 })
  },
  methods: {
    handleClose() {
      this.albumRelation = []
    },
    relation(id) {
      albumApi.getMediaByAlbumId(id).then(
        response => {
          this.album = response.data
          this.showRelation = true
        }
      )
    },
    commitRelation() {
      if (this.albumRelation.length) {
        albumApi.editRelation({ albumId: this.album.id, mediaIdList: this.albumRelation }).then(
          response => {
            this.$message.success('修改成功')
            this.showRelation = false
          }
        )
      }
    },
    edit(id) {
      albumApi.get(id).then(
        response => {
          this.album = response.data
          this.showDialog = true
        }
      )
    },
    insert() {
      this.showDialog = true
    },
    async commit() {
      if (this.album.id) {
        albumApi.edit(this.album).then(
          response => {
            if (response.code === 200) {
              this.$message.success('新增成功')
              this.page({ ...this.queryVo, current: 1, limit: 10 })
              this.showDialog = false
            }
          }
        )
      } else {
        albumApi.insert(this.album).then(
          response => {
            if (response.code === 200) {
              this.$message.success('新增成功')
              this.page({ ...this.queryVo, current: 1, limit: 10 })
              this.showDialog = false
            }
          }
        )
      }
    },
    cancel() {
      this.showDialog = false
      this.singer = {}
    },
    changeCurrent(current) {
      this.page({ ...this.queryVo, current, limit: 10 })
    },
    search() {
      this.page({ ...this.queryVo, current: 1, limit: 10 })
    },
    changeShowStatus(event, id) {
      albumApi.changeShowStatus(event, id).then(
        response => {
          if (response.code === 200) {
            this.$message.success('修改成功')
            this.page({ ...this.queryVo, current: 1, limit: 10 })
          } else {
            this.$message.error('修改失败')
          }
        }
      )
    },
    page(queryVo) {
      albumApi.page(queryVo).then(
        response => {
          if (response.code === 200) {
            this.singerList = response.data.list
            this.total = response.data.total
            this.pageSize = response.data.pageSize
            this.currentPage = response.data.currentPage
          }
        }
      )
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>

</style>

