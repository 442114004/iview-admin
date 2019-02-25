<template>
  <!-- 操作日志 -->
  <management
    ref="editlog"
    :table-columns="columns"
    :data="{ table: '/api/oper-log/list' }"
    page-name="操作日志"
  >
    <Form ref="searchForm" :model="searchForm" :label-width="80" inline slot="searchForm">
      <FormItem prop="IP" label="IP" label-for="editlog-search-form-IP">
        <i-input
          v-model="searchForm.IP"
          type="text"
          element-id="editlog-search-form-IP"
          style="width: 162px"
          placeholder="输入IP搜索"
        />
      </FormItem>
      <FormItem label="操作类型" prop="typeid" label-for="editlog-search-form-typeid">
        <i-select
          v-model="searchForm.typeid"
          style="width: 162px"
          element-id="editlog-search-form-typeid"
        >
          <i-option
            v-for="item in typeidList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</i-option>
        </i-select>
      </FormItem>
      <FormItem>
        <Button type="primary" icon="md-search" @click="search('editlog')">查询</Button>
        <Button icon="ios-redo" @click="$refs.searchForm.resetFields()" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
  </management>
</template>

<script>
import management from "_c/management";
import managementHelp from "../mixin";
export default {
  name: "editlog",
  components: {
    management
  },
  mixins: [managementHelp],
  data() {
    return {
      searchForm: {
        IP: "",
        typeid: ""
      },
      columns: [
        {
          title: "IP",
          key: "IP",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "操作类型",
          key: "ACTION_TYPE",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "操作者",
          key: "USER_NAME",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "操作时间",
          key: "ADD_TIME",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "终端",
          key: "PLATFORM_ID",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "操作简介",
          key: "DESC",
          minWidth: 80,
          tooltip: true
        }
      ],
      typeidList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "编辑"
        },
        {
          value: "2",
          label: "下载"
        },
        {
          value: "3",
          label: "删除"
        },
        {
          value: "4",
          label: "重命名"
        },
        {
          value: "5",
          label: "创建文件/文件夹"
        },
        {
          value: "6",
          label: "共享"
        },
        {
          value: "7",
          label: "取消共享"
        },
        {
          value: "8",
          label: "移动"
        },
        {
          value: "9",
          label: "复制"
        },
        {
          value: "10",
          label: "预览"
        },
        {
          value: "11",
          label: "文件描述"
        },
        {
          value: "12",
          label: "彻底删除"
        },
        {
          value: "13",
          label: "恢复"
        },
        {
          value: "14",
          label: "分配权限"
        },
        {
          value: "15",
          label: "创建链接分享"
        },
        {
          value: "16",
          label: "取消链接分享"
        },
        {
          value: "17",
          label: "更新链接分享"
        }
      ]
    };
  }
};
</script>
