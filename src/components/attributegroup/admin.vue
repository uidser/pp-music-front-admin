<template>
  <div style="width: 99%; margin: 10px auto;">
    <el-input v-model="queryVo.QueryText" placeholder="请输入内容" style="width: 10%;"></el-input>
    <el-button type="primary" icon="el-icon-search" @click="search" style="margin: 0px 10px"></el-button>
    <el-button type="primary" icon="el-icon-plus" @click="insert(0)"></el-button>
    <el-table
      :data="attrGroupList"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="groupName"
        label="属性分组名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="id"
        label="分组ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="categoryList"
        label="已关联分类">
        <template v-slot="scope">
          <el-tag v-for="category in scope.row.categoryList" :key="category.id">{{ category.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row.id)" v-show="scope.row.hasChildren"></el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addAttributeValue(scope.row.id)" v-show="scope.row.hasChildren"></el-button>
          <el-button type="primary" icon="el-icon-delete" @click="remove(scope.row.id)" v-show="scope.row.hasChildren"></el-button>
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
    <el-dialog :title="attrGroup.id? '修改分组': '添加分组'" :visible.sync="showDialog">
      <el-form :model="attrGroup">
        <el-form-item label="分组ID" v-show="attrGroup.id" label-width="100px">
          <el-input v-model="attrGroup.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分组名称" label-width="100px">
          <el-input v-model="attrGroup.groupName" autocomplete="off" style="width: 205px;"></el-input>
        </el-form-item>
        <el-form-item label="关联分类" label-width="100px">
          <el-select v-model="attrGroup.categoryIdList" multiple filterable default-first-option placeholder="请选择关联分类">
            <el-option v-for="category in categoryList" :key="category.id" :value="category.id" :label="category.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示状态" label-width="100px">
          <el-switch style="display: block" v-model="attrGroup.showStatus" active-color="#13ce66" inactive-color="#ff4949" active-text="显示" inactive-text="不显示" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="创建时间" v-show="attrGroup.id" label-width="100px">
          <el-input v-model="attrGroup.createTime" disabled autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="attributeValue.id? '修改属性值': '添加属性值'" :visible.sync="showAttributeValueDialog">
      <el-form :model="attributeValue">
        <el-form-item label="属性名称" label-width="150px">
          <el-input v-model="attributeValue.name" autocomplete="off" style="width: 205px"></el-input>
        </el-form-item>
        <el-form-item label="关联属性分组名称" label-width="150px">
          <el-tag>{{ attrGroup.groupName }}</el-tag>
        </el-form-item>
        <el-form-item label="关联分类名称" label-width="150px">
          <el-tag v-for="category in attrGroup.categoryList" :key="category.id">{{ category.name }}</el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAttributeValueDialog">取 消</el-button>
        <el-button type="primary" @click="commitAttributeValue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import categoryApi from '@/api/category/index'
import attributeGroupAPi from '@/api/attributegroup/index'
export default {
  name: "admin",
  data() {
    return {
      queryVo: {},
      attrGroupList: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      attrGroup: {},
      showDialog: false,
      categoryList: [],
      showAttributeValueDialog: false,
      attributeValue: {}
    }
  },
  created() {
    this.page({ current: this.currentPage, limit: 10 })
  },
  methods: {
    commit() {
      if (this.attrGroup.id) {

      } else {
        attributeGroupAPi.insert(this.attrGroup).then(
          response => {
            if (response.code === 200) {
              this.$message.success('新建成功')
              this.showDialog = false
              this.page({ current: this.currentPage, limit: 10 })
            } else {
              this.$message.error('新建失败')
            }
          }
        )
      }
    },
    getAttributeGroupById(id) {
      attributeGroupAPi.getById(id).then(
        response => {
          if (response.code === 200) {
            this.attrGroup = response.data
          }
        }
      )
    },
    cancelAttributeValueDialog() {
      this.showAttributeValueDialog = false
      this.attributeValue = {}
    },
    addAttributeValue(id) {
      this.getAttributeGroupById(id)
      this.showAttributeValueDialog = true
    },
    edit(id) {
      this.getCategory()
      this.getAttributeGroupById(id)
      this.showDialog = true
    },
    getCategory() {
      categoryApi.getAll().then(
        response => {
          if (response.code === 200) {
            this.categoryList = response.data
          }
        }
      )
    },
    cancel() {
      this.showDialog = false
      this.attrGroup = {}
    },
    insert(id) {
      this.getCategory()
      this.showDialog = true
    },
    search() {
      this.page({ ...this.queryVo, current: this.currentPage, limit: 10 })
    },
    changeCurrent(current) {
      this.page({ ...this.queryVo, current, limit: 10 })
    },
    page(queryVo) {
      attributeGroupAPi.page(queryVo).then(
        response => {
          if (response.code === 200) {
            this.attrGroupList = response.data.list
            this.songList = response.data.list
            this.total = response.data.total
            this.pageSize = response.data.pageSize
            this.currentPage = response.data.pageNum
          }
        }
      )
    },
    load(tree, treeNode, resolve) {
      attributeGroupAPi.getAttributeByAttributeGroupId(tree.id).then(
        response => {
          if (response.code === 200) {
            if (response.data) {
              let array = new Array()
              let data = response.data
              data.forEach((attr) => {
                array.push({ groupName: '属性值：' + attr.name, id: '属性ID：' + attr.id })
              })
              resolve(array)
            } else {
              this.$message.warning('当前属性分组没有关联属性')
              resolve([])
            }
          }
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
