<template>
  <management
    ref="authorization"
    :table-columns="columns"
    :data="{ table: '/api/permission/load' }"
    page-name="权限管理"
    :other-button="[{ name: '加载权限', type: 'info', icon: 'ios-cloud-download', permission: '/api/permission/load POST', click: search }]"
    :auto-init="false"
    @refresh="search"
  >
    <Form
      :model="searchForm"
      inline
      :label-width="80"
      ref="searchForm"
      slot="searchForm"
    >
      <FormItem
        prop="description"
        label-for="auth-search-form-desc"
        label="权限描述"
      >
        <i-input
          type="text"
          element-id="auth-search-form-desc"
          v-model="searchForm.description"
          placeholder="输入权限描述搜索"
        />
      </FormItem>
      <FormItem>
        <Button
          icon="md-search"
          type="primary"
          v-permission="'/api/menu/list GET'"
          @click="search"
        >搜索</Button>
        <Button
          icon="ios-redo"
          @click="$refs.searchForm.resetFields()"
          style="margin-left: 8px"
        >重置</Button>
      </FormItem>
    </Form>
  </management>
</template>

<script>
import management from "_c/management";
export default {
  name: "authorization",
  components: {
    management
  },
  data() {
    return {
      searchForm: {
        description: ""
      },
      columns: [
        {
          title: "ID",
          key: "id",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "url",
          key: "url",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "请求方式",
          key: "requestType",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "权限描述",
          key: "description",
          minWidth: 105,
          tooltip: true
        },
        {
          title: "创建时间",
          key: "createdDate",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 100,
          tooltip: true
        }
      ]
    };
  },
  methods: {
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
