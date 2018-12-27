<template>
  <div class="management-component">
    <Row>
      <Col class="tree" span="4" v-if="data.tree">
        <Tree :data="treeData" ref="tree" @on-select-change="changeSelect"/>
      </Col>
      <Col class="table" :span="data.tree ? 20 : 24">
        <div class="searchForm">
          <slot name="searchForm"/>
        </div>
        <div class="add" v-if="addButton || refreshButton || loadButton">
          <Button type="info" icon="ios-cloud-download" v-show="loadButton" @click="loadMore">加载权限</Button>
          <Button type="info" icon="md-refresh" v-show="refreshButton" @click="$emit('refresh')">刷新</Button>
          <Button
            type="success"
            icon="md-add"
            v-show="addButton"
            @click="add"
            style="margin-left: 8px;"
          >添加</Button>
        </div>
        <i-table
          size="small"
          :columns="tableColumns"
          :loading="tableLoading"
          :data="tableData"
          stripe
        />
        <div class="paging">
          <Select class="select" v-model="pageSize" @on-change="changePageSize">
            <Option :value="10">10条/页</Option>
            <Option :value="20">20条/页</Option>
            <Option :value="50">50条/页</Option>
            <Option :value="100">100条/页</Option>
            <Option :value="500">500条/页</Option>
          </Select>
          <div class="total">共{{pages}}条</div>
          <Page class="page" :total="total" :current.sync="currentPage" @on-change="changePage"/>
        </div>
      </Col>
    </Row>
    <Modal
      v-model="openModal"
      :title="titleModal"
      :loading="modalLoading"
      :closable="closable"
      :mask-closable="false"
      :width="modelWidth"
      class-name="management-component-form-modal"
      @on-ok="okModal"
      @on-cancel="reset"
    >
      <slot name="modalForm"/>
    </Modal>
  </div>
</template>

<script>
import {
  getTableData,
  getTreeData,
  addTableData,
  deleteTableData
} from "@/api/system-management";
import { buildTree, setSelectTreeById } from "@/libs/util";
export default {
  props: {
    data: {
      type: Object,
      required: true,
      validator(value) {
        return !!value.table;
      }
    },
    tableColumns: {
      type: Array,
      required: true
    },
    addButton: Boolean,
    loadButton: Boolean,
    refreshButton: Boolean,
    pageName: {
      type: String,
      default: ""
    },
    modelWidth: {
      type: [Number, String],
      default: 800
    },
    autoInit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      treeData: [],
      tableData: [],
      tableLoading: false,
      tableHeight: 0,
      pageSize: 10,
      pages: 0,
      total: 0,
      currentPage: 1,
      openModal: false,
      closable: true,
      titleModal: "",
      modalLoading: true
    };
  },
  created() {
    if (this.data.tree) {
      this.setTreeData();
    } else {
      if (!this.autoInit) return;
      this.setTableData();
    }
  },
  mounted() {
    // this.getSearchForm();
    this.getModalForm();
  },
  activated() {
    // this.setTreeData();
  },
  methods: {
    loadMore() {
      this.setTableData();
    },
    getSelectTreeId() {
      if (!this.data.tree || this.treeData.length === 0) return;
      const select = this.$refs.tree.getSelectedNodes()[0];
      if (!select) {
        this.treeData[0].selected = true;
        return this.treeData[0].id;
      } else {
        return select.id;
      }
    },
    changePage(e) {
      console.log(e);
      this.currentPage = e;
      this.$emit("refresh");
    },
    changePageSize() {
      this.currentPage = 1;
      this.$emit("refresh");
    },
    changeSelect() {
      this.currentPage = 1;
      this.$emit("refresh");
    },
    setTableData(param = {}) {
      if (!param.pid && this.data.tree) {
        param.pid = this.getSelectTreeId();
      }
      this.tableLoading = true;
      getTableData(this.data.table, this.currentPage, this.pageSize, param)
        .then(data => {
          this.tableData = data.recoreds;
          this.pageSize = data.pageSize;
          this.pages = data.pages;
          this.total = data.total - 0;
          this.currentPage = data.currentPage;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    async setTreeData() {
      const { recoreds } = await getTreeData(this.data.tree);
      let treeList = buildTree(recoreds);
      if (!this.autoInit) {
        treeList[0].selected = false;
      }
      this.treeData = treeList;
      this.autoInit && this.setTableData();
    },
    async refreshPage() {
      if (this.data.tree) {
        const { recoreds } = await getTreeData(this.data.tree);
        let treeList = buildTree(recoreds);
        setSelectTreeById(treeList, this.getSelectTreeId());
        this.treeData = treeList;
      }
      // this.setTableData();
      this.$emit("refresh");
    },
    delete({ id }) {
      this.$Modal.confirm({
        title: "确定删除",
        loading: true,
        onOk: () => {
          let cancelButton = document.getElementsByClassName(
            "ivu-modal-confirm-footer"
          )[0].children[0];
          cancelButton.setAttribute("disabled", "disabled");
          this.$emit("delete", url => {
            deleteTableData(url, id)
              .then(() => {
                cancelButton.removeAttribute("disabled");
                this.$Modal.remove();
                // this.$emit('refresh');
                this.refreshPage();
                this.$Notice.success({
                  title: `删除此${this.pageName}成功`
                });
              })
              .catch(error => {
                cancelButton.removeAttribute("disabled");
                this.$Modal.remove();
                this.$Notice.error({
                  title: `删除此${this.pageName}失败`,
                  desc: error
                });
              });
          });
        }
      });
    },
    detail() {
      if (!this.modalForm) return;
      this.titleModal = `${this.pageName}详情`;
      this.openModal = true;
    },
    edit() {
      if (!this.modalForm) return;
      this.titleModal = `编辑${this.pageName}`;
      this.openModal = true;
    },
    add() {
      if (!this.modalForm) return;
      this.titleModal = `添加${this.pageName}`;
      this.openModal = true;
    },
    okModal() {
      this.modalForm.validate(valid => {
        this.modalLoading = false;
        this.$nextTick(() => {
          this.modalLoading = true;
        });
        if (!valid) return;
        this.closable = false;
        this.modalLoading = true;
        let cancelButton = document.getElementsByClassName(
          "management-component-form-modal"
        )[0].children[0].children[0].children[3].children[0];
        cancelButton.setAttribute("disabled", "disabled");
        this.$emit("submit", this.getSelectTreeId(), (url, data, method) => {
          addTableData(url, data, method)
            .then(() => {
              this.openModal = false;
              this.reset();
              cancelButton.removeAttribute("disabled");
              this.closable = true;
              this.titleModal === `添加${this.titleModal}` &&
                (this.currentPage = 1);
              // this.$emit('refresh');
              this.refreshPage();
              this.$Notice.success({
                title: `${this.titleModal}成功`
              });
            })
            .catch(error => {
              this.modalLoading = false;
              cancelButton.removeAttribute("disabled");
              this.closable = true;
              this.$Notice.error({
                title: `${this.titleModal}失败`,
                desc: error
              });
            });
        });
      });
    },
    reset() {
      this.modalForm.resetFields();
      for (let i in this.modalForm.model) {
        this.modalForm.model[i] = "";
      }
    },
    getModalForm() {
      let modalForm = this.$slots.modalForm;
      if (
        modalForm &&
        modalForm[0] &&
        modalForm[0].context &&
        modalForm[0].context.$refs.modalForm
      ) {
        modalForm = modalForm[0].context.$refs.modalForm;
        this.modalForm = modalForm;
      } else {
        delete this.modalForm;
      }
    }
    // getSearchForm() {
    //   let searchForm = this.$slots.searchForm;
    //   if (
    //     searchForm &&
    //     searchForm[0] &&
    //     searchForm[0].context &&
    //     searchForm[0].context.$refs.searchForm
    //   ) {
    //     searchForm = searchForm[0].context.$refs.searchForm;
    //     this.searchForm = searchForm;
    //   } else {
    //     delete this.searchForm;
    //   }
    // }
  }
};
</script>
<style lang="less" scoped>
.management-component {
  background-color: white;
  height: 100%;
  min-height: 628px;
  > div {
    height: 100%;
  }
  .tree {
    height: 100%;
    overflow: auto;
    padding: 10px;
    border-right: 1px solid #eeeeee;
  }
  .table {
    padding: 10px;
    height: 100%;
  }
  .add {
    text-align: right;
    margin-bottom: 10px;
  }
  .paging {
    margin-top: 10px;
    overflow: hidden;
  }
  .select {
    float: right;
    width: 82px;
    margin-left: 10px;
  }
  .total {
    float: right;
    height: 32px;
    line-height: 32px;
    margin-left: 10px;
  }
  .page {
    float: right;
  }
  .searchForm {
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 10px;
  }
}
</style>
<style>
.management-component-form-modal .ivu-form-item {
  width: 100% !important;
}
</style>