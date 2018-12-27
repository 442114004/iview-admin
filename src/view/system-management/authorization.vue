<template>
  <management
    ref="authorization"
    :tableColumns="columns1"
    :data="{table: '/api/menu/list' }"
    page-name="权限管理"
    load-button
    :autoInit="autoInit"
  >
    <Form
      :model="searchForm"
      inline
      :label-width="80"
      ref="searchForm"
      slot="searchForm"
    >
      <FormItem
        prop="name"
        label="角色名称"
      >
        <i-input
          type="text"
          v-model="searchForm.name"
          placeholder="输入角色名称搜索"
        />
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          @click="search"
        >查询</Button>
        <Button
          @click="$refs.searchForm.resetFields()"
          style="margin-left: 8px"
        >重置</Button>
      </FormItem>
    </Form>
  </management>
</template>

<script>
import management from "_c/management";
import { getInfo, setActivated } from "@/api/system-management";
export default {
  name: "authorization",
  components: {
    management
  },
  data() {
    return {
      autoInit: false,
      searchForm: {
        name: ""
      },
      columns1: [
        {
          title: "ID",
          key: "id",
          width: 250,
          tooltip: true
        },
        {
          title: "url",
          key: "url",
          width: 400,
          tooltip: true
        },
        {
          title: "请求方式",
          key: "requestType",
          width: 250,
          tooltip: true
        },
        {
          title: "权限描述",
          key: "description",
          width: 385,
          tooltip: true
        },
        {
          title: "创建时间",
          key: "createdDate",
          width: 300,
          tooltip: true
        }
      ],
      modalForm: {
        input: "",
        select: "",
        radio: "male",
        checkbox: [],
        switch: true,
        date: "",
        time: "",
        slider: [20, 50],
        textarea: ""
      }
    };
  },
  methods: {
    submit(pid, request) {
      // 添加和保存时，参数的处理
      let param = Object.assign({}, this.modalForm);
      param.activated = !!param.activated;
      param.pid = pid;
      request("/api/org/", param, param.id ? "put" : "post");
    },
    deleteRow(request) {
      request("/api/org/");
    },
    edit({ id }) {
      // 编辑时，表单的回显
      getInfo("/api/org/info/" + id)
        .then(data => {
          Object.assign(this.modalForm, data, {
            activated: data.activated ? 1 : 0
          });
          this.$refs.organization.edit();
        })
        .catch(error => {
          this.$Notice.error({
            title: "打开编辑失败",
            desc: error
          });
        });
    },
    changeActivated(row, value) {
      row.activated = value;
      this.$set(row, "activated_loading", true);
      setActivated("/api/org/", row)
        .then(() => {
          this.$set(row, "activated_loading", false);
        })
        .catch(error => {
          row.activated = !value;
          this.$set(row, "activated_loading", false);
          this.$Notice.error({
            title: "状态修改失败",
            desc: error
          });
        });
    },
    search() {
      // 查询时，处理查询参数
      const param = Object.assign({}, this.searchForm);
      for (let i in param) {
        param[i] === "" && delete param[i];
      }
      this.$refs.authorization.setTableData(param);
    }
  }
};
</script>

<style>
</style>
