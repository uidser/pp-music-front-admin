<template>
  <div style="width: 99%; margin: 10px auto;">
    <el-input v-model="queryVo.QueryText" placeholder="请输入内容" style="width: 10%;"></el-input>
    <el-button type="primary" icon="el-icon-search" @click="search" style="margin: 0px 10px"></el-button>
    <el-button type="primary" icon="el-icon-plus" @click="insert"></el-button>
    <el-button type="primary" icon="el-icon-delete" @click="removeBatch">批量删除</el-button>
    <el-table
      ref="multipleTable"
      :data="rankList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="id"
        label="排行榜ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="排行榜名称">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="rankUpdateTime"
        label="最后一次排行时间">
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
          <el-button type="primary" icon="el-icon-s-data" @click="rankDetail(scope.row.id)"></el-button>
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
    <el-dialog title="排行榜信息" :visible.sync="showDialog">
      <el-form :model="rank">
        <el-form-item label="ID" label-width="200px" v-if="rank.id">
          <el-input v-model="rank.id" disabled autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="排行榜名称" label-width="200px">
          <el-input v-model="rank.name" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="排行榜标题" label-width="200px">
          <el-input v-model="rank.title" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="排行榜介绍" label-width="200px">
          <el-input v-model="rank.introducation" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="排行榜总数" label-width="200px">
          <el-input v-model="rank.showLength" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="排行榜显示顺序（降序）" label-width="200px">
          <el-input v-model="rank.sort" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="媒体类型" label-width="200px">
          <el-select v-model="rank.type" placeholder="请选择">
            <el-option
              v-for="item in mediaTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排行榜周期（以小时为单位）" label-width="200px">
          <el-input-number v-model="rank.rankTime" :min="24" :max="168" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="显示状态" label-width="200px">
          <el-switch
            style="display: block"
            v-model="rank.showStatus"
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
import categoryApi from "@/api/category"
import rankApi from "@/api/rank"
export default {
  name: "admin",
  data() {
    return {
      queryVo: {},
      rankList: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      showDialog: false,
      rank: {},
      mediaTypeList: []
    }
  },
  created() {
    this.page({ ...this.queryVo, current: this.currentPage, limit: 10 })
  },
  methods: {
    rankDetail(id) {
      this.$router.push('/rank/detail' + '/' + id)
    },
    removeBatch() {
      let array = []
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach((rank) => {
          array.push(rank.id)
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
        rankApi.batchDelete(id).then(
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
      rankApi.get(id).then(
        response => {
          if (response.code === 200) {
            this.rank = response.data
            this.showDialog = true
          }
        }
      )
    },
    commit() {
      if (this.rank.id) {
        rankApi.edit(this.rank).then(
          response => {
            if (response.code === 200) {
              this.$message.success('新增成功')
              this.page({ ...this.queryVo, current: 1, limit: 10 })
              this.showDialog = false
            }
          }
        )
      } else {
        rankApi.insert(this.rank).then(
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
      this.rank = {}
    },
    changeCurrent(current) {
      this.page({ ...this.queryVo, current, limit: 10 })
    },
    insert() {
      this.showDialog = true
      categoryApi.getAll().then(
        response => {
          this.mediaTypeList = response.data
        }
      )
    },
    search() {
      this.page({ ...this.queryVo, current: 1, limit: 10 })
    },
    changeShowStatus(event, id) {
      rankApi.changeShowStatus(event, id).then(
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
      rankApi.page(queryVo).then(
        response => {
          if (response.code === 200) {
            this.rankList = response.data.list
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
