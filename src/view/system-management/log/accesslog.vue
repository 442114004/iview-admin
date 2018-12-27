<template>
  <!-- 访问日志 -->
  <management
    style="background-color: white; height: 100%; padding: 10px;"
    ref="accesslog"
    :tableColumns="columns1"
    :data="{table: '/api/access-log/list' }"
    page-name="访问日志"
  >
    <Form
      ref="searchForm"
      :model="searchForm"
      :label-width="80"
      inline
      slot="searchForm"
    >
      <FormItem prop="user" label="用户名">
        <Input
          type="text"
          v-model="searchForm.user"
          placeholder="输入用户名搜索"
        >
        </Input>
      </FormItem>
      <FormItem prop="IP" label="IP">
        <Input
          type="text"
          v-model="searchForm.IP"
          placeholder="输入IP搜索"
        >
        </Input>
      </FormItem>
      <FormItem prop="URL" label="URL">
        <Input
          type="text"
          v-model="searchForm.URL"
          placeholder="输入URL搜索"
        >
        </Input>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          icon="md-search"
          @click="search()"
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
export default {
  name: "accesslog",
  components: {
    management
  },
  data() {
    return {
      searchForm: {
        user: "",
        IP: "",
        URL: ''
      },
      columns1: [
        {
          title: "用户ID",
          key: "adminId",
          tooltip: true
        },
        {
          title: "用户",
          key: "lastUpdAcct",
          tooltip: true
        },
        {
          title: "请求url",
          key: "url",
          tooltip: true
        },
        {
          title: "来源",
          key: "from",
          tooltip: true
        },
        {
          title: "客户端IP",
          key: "clientIp",
          tooltip: true
        },
        {
          title: "浏览器",
          key: "browser",
          tooltip: true
        },
        {
          title: "操作",
          key: "operation",
          tooltip: true
        },
        {
          title: "访问时间",
          key: "accessTime",
          tooltip: true
        }
      ]
    };
  },
  methods: {
    search() {
      // 查询时，处理查询参数
      const param = Object.assign({}, this.searchForm);
      this.$refs.application.setTableData(param);
    }
  }
};
</script>

<style>
</style>
