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
        <div class="optionButton" v-if="addButton || refreshButton || otherButton.length > 0">
          <Button
            v-for="(b, index) in otherButton"
            :key="index"
            :type="b.type || 'info'"
            :icon="b.icon"
            v-permission="b.permission"
            @click="b.click"
          >{{b.name}}</Button>
          <Button type="info" icon="md-refresh" v-if="refreshButton" v-permission="refreshButton" @click="$emit('refresh')">刷新</Button>
          <Button type="success" icon="md-add" v-if="addButton" v-permission="addButton" @click="add">添加</Button>
        </div>
        <i-table :columns="tableColumns" :loading="tableLoading" :data="tableData" stripe/>
        <Page
          v-if="!noPaging"
          class="page"
          show-sizer
          show-total
          show-elevator
          :total="total"
          :page-size="pageSize"
          :current.sync="currentPage"
          :page-size-opts="[10, 20, 30, 40, 50, 100, 500]"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
        />
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
    addButton: [Boolean, String],
    refreshButton: [Boolean, String],
    otherButton: {
      type: Array,
      default: () => []
    },
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
    },
    searchForm: Array,
    modalForm: Array,
    noPaging: {
      type: Boolean,
      default: false
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
  watch: {
    openModal(value) {
      !value && this.$emit("closeModal");
    }
  },
  methods: {
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
    changePage() {
      this.$emit("refresh");
    },
    changePageSize(pageSize) {
      this.currentPage = 1;
      this.pageSize = pageSize;
      this.$emit("refresh");
    },
    changeSelect() {
      this.currentPage = 1;
      this.$emit("refresh");
    },
    setTableData(param = {}) {
      if (!param.pid && this.data.tree) {
        param.parentId = param.pid = this.getSelectTreeId();
      }
      this.tableLoading = true;
      getTableData(this.data.table, this.currentPage, this.pageSize, param)
        .then(data => {
          this.tableData = data.recoreds || data;
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
      const data = await getTreeData(this.data.tree);
      let treeList = buildTree(data.recoreds || data);
      if (!this.autoInit) {
        treeList[0].selected = false;
      }
      this.treeData = treeList;
      this.autoInit && this.setTableData();
    },
    async refreshPage() {
      if (this.data.tree) {
        const data = await getTreeData(this.data.tree);
        let treeList = buildTree(data.recoreds || data);
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
          }, id);
        }
      });
    },
    detail() {
      if (!this.modal_form) return;
      this.titleModal = `${this.pageName}详情`;
      this.openModal = true;
    },
    edit() {
      if (!this.modal_form) return;
      this.titleModal = `编辑${this.pageName}`;
      this.openModal = true;
    },
    add() {
      if (!this.modal_form) return;
      this.titleModal = `添加${this.pageName}`;
      this.openModal = true;
    },
    okModal() {
      if (this.titleModal === `${this.pageName}详情`) {
        this.openModal = false;
        return;
      }
      this.modal_form.validate(valid => {
        this.modalLoading = false;
        this.$nextTick(() => {
          this.modalLoading = true;
        });
        if (!valid) return;
        this.closable = false;
        this.modalLoading = true;
        let cancelButton = document.getElementsByClassName(
          "management-component-form-modal"
        )[0].children[0].children[0].lastChild.children[0];
        cancelButton.setAttribute("disabled", "disabled");
        this.$emit("submit", {
          pid: this.getSelectTreeId() || -1,
          request: (url, data, method) => {
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
          }
        });
      });
    },
    reset() {
      this.modal_form.resetFields();
      for (let i in this.modal_form.model) {
        this.modal_form.model[i] = "";
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
        this.modal_form = modalForm;
      } else {
        delete this.modal_form;
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
  min-width: 1057px;
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
    overflow: auto;
  }
  .optionButton {
    text-align: right;
    margin-bottom: 10px;
    button:not(:last-child) {
      margin-right: 10px;
    }
  }
  .page {
    margin-top: 10px;
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