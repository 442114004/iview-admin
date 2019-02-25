<template>
  <!-- 访问日志 -->
  <management
    ref="accesslog"
    :table-columns="columns"
    :data="{ table: '/api/access-log/list' }"
    page-name="访问日志"
  >
    <Form ref="searchForm" :model="searchForm" :label-width="80" inline slot="searchForm">
      <FormItem prop="lastUpdAcct" label="用户名" label-for="accesslog-search-form-lastUpdAcct">
        <i-input
          type="text"
          element-id="accesslog-search-form-lastUpdAcct"
          v-model="searchForm.lastUpdAcct"
          placeholder="输入用户名搜索"
        />
      </FormItem>
      <FormItem prop="IP" label="IP" label-for="accesslog-search-form-IP">
        <i-input
          type="text"
          element-id="accesslog-search-form-IP"
          v-model="searchForm.IP"
          placeholder="输入IP搜索"
        />
      </FormItem>
      <FormItem prop="url" label="url" label-for="accesslog-search-form-url">
        <i-input
          type="text"
          element-id="accesslog-search-form-url"
          v-model="searchForm.url"
          placeholder="输入url搜索"
        />
      </FormItem>
      <FormItem>
        <Button type="primary" icon="md-search" @click="search('accesslog')">查询</Button>
        <Button icon="ios-redo" @click="$refs.searchForm.resetFields()" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
  </management>
</template>

<script>
import management from "_c/management";
import managementHelp from "../mixin";
export default {
  name: "accesslog",
  components: {
    management
  },
  mixins: [managementHelp],
  data() {
    return {
      searchForm: {
        lastUpdAcct: "",
        IP: "",
        url: ""
      },
      columns: [
        {
          title: "用户ID",
          key: "adminId",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "用户",
          key: "lastUpdAcct",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "请求url",
          key: "url",
          minWidth: 180,
          tooltip: true
        },
        {
          title: "来源",
          key: "from",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "客户端IP",
          key: "clientIp",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "浏览器",
          key: "browser",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "操作",
          key: "operation",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "访问时间",
          key: "accessTime",
          minWidth: 100,
          tooltip: true
        }
      ]
    };
  }
};
</script>
