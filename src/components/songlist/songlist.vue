<template>
  <div style="width: 99%; margin: 10px auto;">
    <el-input v-model="queryVo.QueryText" placeholder="请输入内容" style="width: 10%;"></el-input>
    <el-button type="primary" icon="el-icon-search" @click="search" style="margin: 0px 10px"></el-button>
    <el-button type="primary" icon="el-icon-plus" @click="insert"></el-button>
    <el-button type="primary" icon="el-icon-delete" @click="removeBatch">批量删除</el-button>
    <el-table
      ref="multipleTable"
      :data="songListList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="id"
        label="歌单ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="歌单名称">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="showStatus"
        label="显示状态">
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
          <el-button type="primary" icon="el-icon-s-data" @click="songListDetail(scope.row.id)"></el-button>
          <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row.id)"></el-button>
          <el-button type="primary" icon="el-icon-delete" @click="remove(scope.row.id)"></el-button>
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
    <el-dialog title="歌单信息" :visible.sync="showDialog">
      <el-form :model="songList">
        <el-form-item label="ID" label-width="200px" v-if="songList.id">
          <el-input v-model="songList.id" disabled autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="歌单名称" label-width="200px">
          <el-input v-model="songList.name" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="歌单介绍" label-width="200px">
          <el-input v-model="songList.introduction" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="歌单头像（地址）" label-width="200px">
          <img :src="songList.profilePicture" v-if="songList.profilePicture" width="50" />
          <el-input v-model="songList.profilePicture" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="歌单分类" label-width="200px">
          <el-cascader
            v-model="songList.categoryIdList"
            :props="{multiple: true,children: 'categoryChildrenList', label: 'name', value: 'id'}"
            :options="categoryList">
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="歌曲选择" label-width="200px">
          <attribute-media-input @update="(event) => {songList.songIdList = event}" :media-list="songList.songList" :value="songList.songIdList"></attribute-media-input>
        </el-form-item>
        <el-form-item label="显示状态" label-width="200px">
          <el-switch
            style="display: block"
            v-model="songList.showStatus"
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
  </div>
</template>

<script>
import songListApi from "@/api/songlist/songlist"
import categoryApi from "@/api/category"
import AttributeMediaInput from '@/components/attribute/attribute-media-input'
export default {
  name: "songlist",
  components: { AttributeMediaInput },
  data() {
    return {
      queryVo: {},
      songListList: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      showDialog: false,
      songList: {},
      mediaTypeList: [],
      categoryList: []
    }
  },
  created() {
    this.page({ ...this.queryVo, current: this.currentPage, limit: 10 })
  },
  methods: {
    songListDetail(id) {
      this.$router.push('/songList/detail' + '/' + id)
    },
    removeBatch() {
      let array = []
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach((songList) => {
          array.push(songlist.id)
        })
      }
      this.remove(array)
    },
    remove(id) {
      this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id instanceof Array) {

        } else {
          id = [id]
        }
        songListApi.batchDelete(id).then(
          response => {
            if (response.code === 200) {
              this.$message.success('删除成功')
              this.page({ ...this.queryVo, current: 1, limit: 10 })
            } else {
              this.$message.error('删除失败')
            }
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    edit(id) {
      this.getThreeLevelCategoryList()
      songListApi.get(id).then(
        response => {
          if (response.code === 200) {
            this.songList = response.data
            this.showDialog = true
          }
        }
      )
    },
    packageCategoryIdList: function() {
      let array = []
      for (let i = 0; i < this.songList.categoryIdList.length; i++) {
        array.push(this.songList.categoryIdList[i][this.songList.categoryIdList[i].length - 1])
      }
      this.songList.lastCategoryIdList = array
    },
    async commit() {
      if (this.songList.id) {
        await this.packageCategoryIdList()
        songListApi.edit(this.songList).then(
          response => {
            if (response.code === 200) {
              this.$message.success('新增成功')
              this.page({ ...this.queryVo, current: 1, limit: 10 })
              this.showDialog = false
            }
          }
        )
      } else {
        await this.packageCategoryIdList()
        songListApi.insert(this.songList).then(
          response => {
            if (response.code === 200) {
              this.$message.success('新增成功')
              this.page({ ...this.queryVo, current: 1, limit: 10 })
              this.showDialog = false
              this.songList = {}
            }
          }
        )
      }
    },
    cancel() {
      this.showDialog = false
      this.songList = {}
    },
    changeCurrent(current) {
      this.page({ ...this.queryVo, current, limit: 10 })
    },
    forEachCategoryList() {
      for (let i = 0; i < this.categoryList.length; i++) {
        this.packageMoreCategoryList(this.categoryList[i])
      }
    },
    getThreeLevelCategoryList: async function() {
      await categoryApi.getMoreLevelCategory().then(
        response => {
          this.categoryList = response.data
        }
      )
      this.forEachCategoryList()
    }, async insert() {
      await this.getThreeLevelCategoryList()
      this.showDialog = true
    },
    search() {
      this.page({ ...this.queryVo, current: 1, limit: 10 })
    },
    changeShowStatus(event, id) {
      songListApi.changeShowStatus(event, id).then(
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
      songListApi.page(queryVo).then(
        response => {
          if (response.code === 200) {
            this.songListList = response.data.list
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
    },
    packageMoreCategoryList(categoryListElement) {
      if (categoryListElement.categoryChildrenList.length) {
        for (let i = 0; i < categoryListElement.categoryChildrenList.length; i++) {
          this.packageMoreCategoryList(categoryListElement.categoryChildrenList[i])
        }
      } else {
        categoryListElement.categoryChildrenList = undefined
      }
    }
  }
}
</script>

<style scoped>

</style>
