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
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @expand-change="changeRow">
      <el-table-column
        prop="groupName"
        label="属性分组名称">
      </el-table-column>
      <el-table-column
        prop="id"
        label="分组ID">
      </el-table-column>
      <el-table-column
        prop="categoryList"
        label="已关联分类">
        <template v-slot="scope">
          <el-tag v-for="category in scope.row.categoryList" :key="category.id">{{ category.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
      prop="showStatus"
      label="快速展示">
      <template v-slot="scope">
        <el-tag :type="scope.row.showStatus? '': 'danger'">{{ scope.row.showStatus?'是': '否' }}</el-tag>
      </template>
    </el-table-column>
      <el-table-column
        prop="id"
        label="操作">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row.id, scope.row.hasChildren)"></el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addAttribute(scope.row.id)" v-show="scope.row.categoryAttributeGroupRelationArrayList"></el-button>
          <el-button type="primary" icon="el-icon-delete" @click="remove(scope.row.id, scope.row.hasChildren)"></el-button>
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
    <el-dialog :title="attrGroup.id? '修改分组': '添加分组'" :visible.sync="showDialog" :before-close="cancel">
      <el-form :model="attrGroup">
        <el-form-item label="分组ID" v-show="attrGroup.id" label-width="100px">
          <el-input v-model="attrGroup.id" disabled autocomplete="off"></el-input>
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
    <el-dialog :title="attribute.id? '修改属性': '添加属性'" :visible.sync="showAttributeDialog">
      <el-form :model="attribute">
        <el-form-item label="属性名称" label-width="150px">
          <el-input v-model="attribute.name" autocomplete="off" style="width: 205px"></el-input>
        </el-form-item>
        <el-form-item label="显示状态" label-width="150px">
          <el-switch
            style="display: block"
            v-model="attribute.showStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="显示"
            inactive-text="不显示"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="关联属性分组名称" label-width="150px" v-if="!attribute.id">
          <el-tag>{{ attrGroup.groupName }}</el-tag>
        </el-form-item>
        <el-form-item label="关联分类名称" label-width="150px" v-if="!attribute.id">
          <el-tag v-for="category in attrGroup.categoryList" :key="category.id">{{ category.name }}</el-tag>
        </el-form-item>
        <el-form-item label="关联属性分组名称" label-width="150px" v-if="attribute.id">
          <el-tag>{{ attribute.attributeGroup.groupName }}</el-tag>
        </el-form-item>
        <el-form-item label="关联分类名称" label-width="150px" v-if="attribute.id">
          <el-tag v-for="category in attribute.categoryList" :key="category.id">{{ category.name }}</el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAttributeDialog">取 消</el-button>
        <el-button type="primary" @click="commitAttribute">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import attributeApi from '@/api/attribute/index'
import categoryApi from '@/api/category'
import attributeGroupAPi from '@/api/attributegroup'
export default {
  name: "admin",
  data() {
    return {
      queryVo: {},
      attrGroupList: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      attrGroup: {
        showStatus: 0
      },
      showDialog: false,
      categoryList: [],
      showAttributeDialog: false,
      attribute: {
        showStatus: 0,
        attributeGroup: {
          groupName: ''
        }
      },
      expanded: 0,
      tempAttrGroup: {}
    }
  },
  created() {
    this.page({ current: this.currentPage, limit: 10 })
  },
  methods: {
    getAttribute(id, treeNode, resolve) {
      this.treeNode = treeNode
      this.resolve = resolve
      attributeGroupAPi.getAttributeByAttributeGroupId(id).then(
        response => {
          if (response.code === 200) {
            if (response.data) {
              let array = new Array()
              let data = response.data
              data.forEach((attr) => {
                array.push({ groupName: '属性名称：' + attr.name, id: '属性ID：' + attr.id, showStatus: attr.showStatus })
              })
              resolve(array)
            } else {
              this.$message.warning('当前属性分组没有关联属性')
              resolve([])
            }
          }
        }
      )
    },
    changeRow(row, expanded) {
      this.expanded = row.id
    },
    commitAttribute() {
      if (this.attribute.id) {
        attributeApi.edit(this.attribute).then(
          response => {
            if (response.code === 200) {
              this.$message.success('修改成功')
              this.page({ ...this.queryVo, current: this.currentPage, limit: 10 })
              this.getAttribute(this.expanded, null, this.resolve)
              this.showAttributeDialog = false
              this.attribute = {}
            } else {
              this.$message.error('修改失败')
            }
          }
        )
      } else {
        attributeApi.insert({ ...this.attribute, attributeGroupId: this.attrGroup.id }).then(
          response => {
            if (response.code === 200) {
              this.$message.success('新建成功')
              this.page({ ...this.queryVo, current: this.currentPage, limit: 10 })
              this.getAttribute(this.expanded, null, this.resolve)
              this.showAttributeDialog = false
              this.attribute = {}
            } else {
              this.$message.error('新建失败')
            }
          }
        )
      }
    },
    remove(id, flag) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (flag) {
          attributeGroupAPi.delete(id).then(
            response => {
              if (response.code === 200) {
                this.$message.success('删除成功')
                this.page({ current: this.currentPage, limit: 10 })
              } else {
                this.$message.error('删除失败')
              }
            }
          )
        } else {
          attributeApi.delete(id.replace('属性ID：', '')).then(
            response => {
              if (response.code === 200) {
                this.$message.success('删除成功')
                attributeGroupAPi.getAttributeByAttributeGroupId(this.expanded).then(
                  response => {
                    if (response.code === 200) {
                      if (response.data) {
                        if (response.data.length > 0) {
                          this.getAttribute(this.expanded, null, this.resolve)
                        }
                      } else {
                        this.attrGroupList.map((attrGroup) => {
                          if (attrGroup.id === this.expanded[this.expanded[this.expanded.length - 1]]) {
                            attrGroup.hasChildren = false
                          }
                        })
                      }
                    }
                  }
                )
              } else {
                this.$message.error('删除失败')
              }
            }
          )
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    commit() {
      if (this.attrGroup.id) {
        attributeGroupAPi.edit(this.attrGroup).then(
          response => {
            if (response.code === 200) {
              this.$message.success('修改成功')
              this.showDialog = false
              this.page({ current: this.currentPage, limit: 10 })
            } else {
              this.$message.error('修改失败')
            }
          }
        )
      } else {
        attributeGroupAPi.insert(this.attrGroup).then(
          response => {
            if (response.code === 200) {
              this.$message.success('新建成功')
              this.showDialog = false
              this.attrGroup = {}
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
    cancelAttributeDialog() {
      this.showAttributeDialog = false
      this.attribute = {}
    },
    addAttribute(id) {
      this.attribute.showStatus = 0
      this.expanded = id
      this.getAttributeGroupById(id)
      this.showAttributeDialog = true
    },
    edit(id, flag) {
      if (flag) {
        this.getCategory()
        this.getAttributeGroupById(id)
        this.showDialog = true
      } else {
        this.getCategory()
        attributeApi.getById(id.replace('属性ID：', '')).then(
          response => {
            if (response.code === 200) {
              this.attribute = response.data
            }
          }
        )
        this.showAttributeDialog = true
      }
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
            if (response.data) {
              this.attrGroupList = response.data.list
            } else {
              this.attrGroupList = []
            }
            this.songList = response.data.list
            this.total = response.data.total
            this.pageSize = response.data.pageSize
            this.currentPage = response.data.pageNum
          }
        }
      )
    },
    load(tree, treeNode, resolve) {
      this.getAttribute(tree.id, treeNode, resolve)
    }
  }
}
</script>

<style scoped>

</style>
