<template>
  <div style="width: 99%; margin: 10px auto;">
    <el-input v-model="queryVo.QueryText" placeholder="请输入内容" style="width: 10%;"></el-input>
    <el-button type="primary" icon="el-icon-search" @click="search" style="margin: 0px 10px"></el-button>
    <el-button type="primary" icon="el-icon-plus" @click="insert"></el-button>
    <el-table
      ref="multipleTable"
      :data="categoryList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="id"
        label="分类ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="分类名称">
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
    <el-dialog title="收货地址" :visible.sync="showDialog">
      <el-form :model="category">
        <el-form-item label="ID" label-width="100px" v-if="category.id">
          <el-input v-model="category.id" disabled autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" label-width="100px">
          <el-input v-model="category.name" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="显示状态" label-width="100px">
          <el-switch
            style="display: block"
            v-model="category.showStatus"
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
import categoryApi from '@/api/category/index'
export default {
  name: "admin",
  data() {
    return {
      queryVo: {},
      categoryList: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      showDialog: false,
      category: {}
    }
  },
  created() {
    this.page({ ...this.queryVo, current: this.currentPage, limit: 10 })
  },
  methods: {
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
        categoryApi.batchDelete(id).then(
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

    },
    commit() {
      if (this.category.id) {
        categoryApi.edit(this.category).then(
          response => {
            if (response.code === 200) {
              this.$message.success('修改成功')
              this.page({ ...this.queryVo, current: 1, limit: 10 })
              this.cancel()
            } else {
              this.$message.error('修改失败')
            }
          }
        )
      } else {
        categoryApi.insert(this.category).then(
          response => {
            if (response.code === 200) {
              this.$message.success('新增成功')
              this.cancel()
              this.page({ ...this.queryVo, current: 1, limit: 10 })
            } else {
              this.$message.error('新增失败')
            }
          }
        )
      }
    },
    cancel() {
      this.showDialog = false
      this.category = {}
    },
    changeCurrent(current) {
      this.page({ ...this.queryVo, current, limit: 10 })
    },
    insert() {
      this.showDialog = true
    },
    search() {
      this.page({ ...this.queryVo, current: 1, limit: 10 })
    },
    changeShowStatus(event, id) {
      categoryApi.changeShowStatus(event, id).then(
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
      categoryApi.page(queryVo).then(
        response => {
          if (response.code === 200) {
            this.categoryList = response.data.list
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
