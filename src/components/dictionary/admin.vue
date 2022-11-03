<template>
  <div style="width: 99%; margin: 10px auto;">
    <el-input v-model="queryVo.QueryText" placeholder="请输入内容" style="width: 10%;"></el-input>
    <el-button type="primary" icon="el-icon-search" @click="search" style="margin: 0px 10px"></el-button>
    <el-button type="primary" icon="el-icon-plus" @click="insert(0)"></el-button>
    <el-table
      :data="dictionaryList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="id"
        label="ID"
        sortable>
      </el-table-column>
      <el-table-column
        prop="name"
        label="关键词"
        sortable>
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row.id)"></el-button>
          <el-button type="primary" icon="el-icon-plus" @click="insert(scope.row.id)"></el-button>
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
    <el-dialog :title="dictionary.id? '修改字典': '新建字典'" :visible.sync="showDialog">
      <el-form :model="dictionary">
        <el-form-item v-show="dictionary.id" label="ID" label-width="100px">
          <el-input disabled v-model="dictionary.id"></el-input>
        </el-form-item>
        <el-form-item label="关键词" label-width="100px">
          <el-input v-model="dictionary.name" style="width: 205px" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="跳转路径" label-width="100px">
          <el-input placeholder="请输入内容" v-model="dictionary.redirectUrl" style="width: 205px">
          </el-input>
        </el-form-item>
        <el-form-item label="父级名称" label-width="100px">
          <el-select v-model="dictionary.parentId" filterable placeholder="请选择（可搜索）">
            <el-option :value="0" label="顶级"></el-option>
            <el-option
              v-for="item in selectList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型名称" label-width="100px">
          <el-select v-model="dictionary.typeId" filterable placeholder="请选择（可搜索）">
            <el-option
              v-for="item in typeSelectList"
              :key="item.typeId"
              :label="item.description"
              :value="item.typeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示状态" label-width="100px">
          <el-switch
            style="display: block"
            v-model="dictionary.showStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="显示"
            inactive-text="不显示"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item v-show="dictionary.id" label="创建时间" label-width="100px">
          <el-input disabled v-model="dictionary.createTime"></el-input>
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
import typeApi from'@/api/type/idnex'
import dictionaryApi from '@/api/dictionary/index'
export default {
  name: "admin",
  data() {
    return {
      showDialog: false,
      dictionaryList: [],
      total: 0,
      pageSize: 0,
      currentPage: 0,
      queryVo: {
        QueryText: ''
      },
      dictionary: {

      },
      selectList: [],
      typeSelectList: []
    }
  },
  created() {
    this.page({ current: 1, limit: 100000 })
  },
  methods: {
    getTypeId() {
      typeApi.getAll().then(
        response => {
          if (response.code === 200) {
            this.typeSelectList = response.data
          }
        }
      )
    },
    search() {
      this.page({ ...this.queryVo, current: 1, limit: 100000 })
    },
    cancel() {
      this.showDialog = false
      this.dictionary = {}
    },
    async edit(id) {
      this.getTypeId()
      await dictionaryApi.getById(id).then(
        response => {
          if (response.code === 200) {
            this.dictionary = response.data
            this.showDialog = true
          }
        }
      )
      var array = new Array()
      this.getChildren(this.dictionaryList, array)
    },
    getChildren(source, array) {
      for (let i = 0; i < source.length; i++) {
        if (source[i].id) {
          array.push({ id: source[i].id, name: source[i].name })
          if (source[i].children) {
            this.getChildren(source[i].children, array)
          }
        }
        this.selectList = array.filter((k) => {
          return k.id !== this.dictionary.id
        })
      }
    },
    insert(id) {
      if (id) {
        this.dictionary.parentId = id
      }
      this.getTypeId()
      var array = new Array()
      this.getChildren(this.dictionaryList, array)
      this.showDialog = true
    },
    commit() {
      if (this.dictionary.id) {
        dictionaryApi.edit(this.dictionary).then(
          response => {
            if (response.code === 200) {
              this.$message.success('修改成功')
              this.showDialog = false
              this.dictionary = {}
              this.page({ current: 1, limit: 100000 })
            } else {
              this.$message.error('修改失败')
            }
          }
        )
      } else {
        dictionaryApi.insert(this.dictionary).then(
          response => {
            if (response.code === 200) {
              this.$message.success('新建成功')
              this.showDialog = false
              this.dictionary = {}
              this.page({ current: 1, limit: 100000 })
            } else {
              this.$message.error('新建失败')
            }
          }
        )
      }
    },
    changeCurrent(current) {
      this.page({ current, limit: 100000 })
    },
    page(queryVo) {
      dictionaryApi.page(queryVo).then(
        response => {
          if (response.code === 200) {
            this.dictionaryList = response.data.list
            this.total = response.data.total
            this.pageSize = response.data.pageSize
            this.currentPage = response.data.currentPage
          }
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
