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
        label="用户ID">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名称">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="用户昵称">
      </el-table-column>
      <el-table-column
        prop="fansQuantity"
        label="粉丝总数">
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
            v-model="scope.row.isEnable"
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
      <el-form :model="user">
        <el-form-item label="ID" label-width="200px" v-if="user.id">
          <el-input v-model="user.id" disabled autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" label-width="200px">
          <el-input v-model="user.username" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" label-width="200px">
          <el-input v-model="user.password" autocomplete="off" style="width: 205px;" type="password"></el-input>
        </el-form-item>
        <el-form-item label="用户头像（地址）" label-width="200px">
          <img :src="user.profilePicture" v-if="user.profilePicture" width="50" />
          <el-input v-model="user.profilePicture" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="启用状态" label-width="200px">
          <el-switch
            style="display: block"
            v-model="user.isEnable"
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
import userApi from '@/api/user/index'
import categoryApi from "@/api/category"
export default {
  name: "admin",
  data() {
    return {
      queryVo: {},
      singerList: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      showDialog: false,
      user: {},
      mediaTypeList: [],
      categoryList: []
    }
  },
  created() {
    this.page({ ...this.queryVo, current: this.currentPage, limit: 10 })
  },
  methods: {
    edit(id) {
      this.getThreeLevelCategoryList()
      userApi.get(id).then(
        response => {
          if (response.code === 200) {
            this.user = response.data
            this.showDialog = true
          }
        }
      )
    },
    async commit() {
      if (this.user.id) {
        userApi.edit(this.user).then(
          response => {
            if (response.code === 200) {
              this.$message.success('新增成功')
              this.page({ ...this.queryVo, current: 1, limit: 10 })
              this.showDialog = false
            }
          }
        )
      } else {
        userApi.insert(this.user).then(
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
      userApi.changeEnableStatus(event, id).then(
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
      userApi.page(queryVo).then(
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
