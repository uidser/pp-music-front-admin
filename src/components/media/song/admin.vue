<template>
  <div style="width: 99%; margin: 10px auto;">
    <el-input v-model="queryVo.QueryText" placeholder="请输入内容" style="width: 10%; margin: 0px 10px"></el-input>
    <el-date-picker v-model="queryVo.startTime" type="datetime" placeholder="选择开始日期时间" value-format="yyyy-MM-dd:HH:mm:ss"></el-date-picker>
    <el-date-picker v-model="queryVo.endTime" type="datetime" placeholder="选择结束时间" value-format="yyyy-MM-dd:HH:mm:ss" style="margin: 0px 10px">
    </el-date-picker>
    <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
    <el-button type="primary" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
    <el-button type="primary" icon="el-icon-plus" @click="$router.push('/song/admin/add')"></el-button>
    <el-table
      ref="multipleTable"
      :data="songList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="id"
        label="歌曲ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="歌曲名称">
      </el-table-column>
      <el-table-column
        prop="author"
        label="歌手名称">
      </el-table-column>
      <el-table-column
        prop="publishDate"
        label="发布日期">
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
  </div>
</template>

<script>
import songApi from '@/api/song'
export default {
  name: "admin",
  data() {
    return {
      songList: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      queryVo: {
        startTime: null,
        endTime: null,
        QueryText: '',
        limit: 10
      }
    }
  },
  created() {
    this.page({ current: this.currentPage, limit: 10 })
  },
  methods: {
    remove(id) {
      this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        songApi.batchDelete([id]).then(
          response => {
            if (response.code === 200) {
              this.$message.success('删除成功')
              this.page({ current: 1, limit: 10 })
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
    batchDelete() {
      this.$confirm('此操作将永久删除这些记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let array = new Array()
        for (let i = 0; i < this.multipleSelection.length; i++) {
          array.push(this.multipleSelection[i].id)
        }
        songApi.batchDelete(array).then(
          response => {
            if (response.code === 200) {
              this.$message.success('批量删除成功')
              this.page({ current: 1, limit: 10 })
            } else {
              this.$message.error('批量删除失败')
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
    search() {
      this.page({ current: 1, ...this.queryVo, startTime: this.queryVo.startTime })
    },
    changeShowStatus(event, songId) {
      songApi.changeShowStatus(songId, event).then(
        response => {
          if (response.code === 200) {
            this.$message.success('修改成功')
          } else {
            this.$message.error('修改失败')
          }
        }
      )
    },
    changeCurrent(current) {
      this.page({ current, limit: 10 })
    },
    page(queryVo) {
      songApi.page(queryVo).then(
        response => {
          if (response.code === 200) {
            this.songList = response.data.list
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
