<template>
  <div style="width: 99%; margin: 10px auto;">
    <span>当前排行榜：{{ this.rank.name }}，当前排行榜ID：{{ this.$route.params.id }}，最后一次排行时间：{{ this.rank.rankUpdateTime }}</span>&nbsp;&nbsp;&nbsp;
    <el-input v-model="queryVo.QueryText" placeholder="请输入内容" style="width: 10%;"></el-input>&nbsp;&nbsp;&nbsp;
    <el-select v-model="frequency" placeholder="默认显示第一期数据" @change="changeFrequency">
      <el-option
        v-for="item in rank.rankFrequency"
        :key="item"
        :label="'第' + item + '期'"
        :value="'第' + item + '期'">
      </el-option>
    </el-select>
    <el-button type="primary" icon="el-icon-search" @click="search" style="margin: 0px 10px"></el-button>
    <el-button type="primary" icon="el-icon-plus" @click="insert"></el-button>
    <el-button type="primary" icon="el-icon-delete" @click="removeBatch">批量删除</el-button>
    <el-table
      ref="multipleTable"
      :data="mediaList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="id"
        label="排名">
        <template v-slot="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="媒体ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="媒体名称">
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
          <el-button type="primary" icon="el-icon-s-data" @click="mediaDetail(scope.row.id)"></el-button>
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
import rankApi from "@/api/rank"
import mediaApi from "@/api/media"
export default {
  name: "admin",
  data() {
    return {
      queryVo: {
        current: 1,
        limit: 100
      },
      rankMediaDetailList: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      mediaList: [],
      mediaIdList: [],
      rank: {},
      frequency: null
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getRankDetailMediaList(this.$route.params.id, 1)
    }
  },
  methods: {
    changeFrequency(event) {
      event = event.replace('第', '').replace('期', '')
      console.log(event)
      this.getRankDetailMediaList(this.$route.params.id, event)
    },
    getMediaList(queryVo) {
      mediaApi.getRankMediaList(this.mediaIdList, queryVo).then(
        response => {
          this.mediaList = response.data.list
          this.total = response.data.total
          this.pageSize = response.data.pageSize
          this.currentPage = response.data.pageNum
        }
      )
    },
    getRankDetailMediaList(rankId, frequency) {
      rankApi.getRankDetailMediaList(rankId, frequency).then(
        response => {
          if (response.code === 200) {
            this.mediaIdList = response.data.rankMediaIdList
            this.rank = response.data
            this.getMediaList({ ...this.queryVo, current: this.currentPage, limit: 100, frequency: this.rank.frequency })
          }
        }
      )
    },
    mediaDetail(id) {
      this.$router.push('/rank/singleMediaMap' + '/' + id + '/' + this.rank.id)
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
              this.getMediaList({ ...this.queryVo, current: this.currentPage, limit: 100, frequency: this.rank.frequency })
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

    },
    cancel() {
      this.showDialog = false
      this.category = {}
    },
    changeCurrent(current) {
      this.getMediaList({ ...this.queryVo, current: this.currentPage, limit: 100, frequency: this.rank.frequency })
    },
    insert() {
      this.showDialog = true
    },
    search() {
      this.getMediaList({ ...this.queryVo, current: this.currentPage, limit: 100, frequency: this.rank.frequency })
    },
    changeShowStatus(event, id) {
      mediaApi.changeShowStatus(event, id).then(
        response => {
          if (response.code === 200) {
            this.$message.success('修改成功')
            this.getRankDetailMediaList(this.$route.params.id, )
          } else {
            this.$message.error('修改失败')
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
