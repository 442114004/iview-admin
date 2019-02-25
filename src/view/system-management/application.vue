<template>
  <management
    ref="application"
    :table-columns="columns"
    :data="{ table: '/api/app/list' }"
    page-name="数据"
    add-button="/api/app/ POST"
    refresh-button="/api/app/list GET"
    @submit="submit($event, '/api/app/')"
    @delete="deleteRow($event, '/api/app/')"
    @refresh="search('application')"
  >
    <Form ref="searchForm" :model="searchForm" inline :label-width="80" slot="searchForm">
      <FormItem prop="name" label="应用名称" label-for="app-search-form-name">
        <i-input
          type="text"
          element-id="app-search-form-name"
          v-model="searchForm.name"
          placeholder="输入应用名称搜索"
        />
      </FormItem>
      <FormItem>
        <Button type="primary" icon="md-search" v-permission="'/api/app/list GET'" @click="search('application')">搜索</Button>
        <Button icon="ios-redo" @click="$refs.searchForm.resetFields()" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
    <Form :model="modalForm" :label-width="80" :rules="modalRules" ref="modalForm" slot="modalForm">
      <FormItem label="应用名称" label-for="app-modal-form-name" prop="name">
        <i-input v-model="modalForm.name" element-id="app-modal-form-name" placeholder="请输入应用名称"/>
      </FormItem>
      <FormItem label="应用IP" label-for="app-modal-form-appIp" prop="appIp">
        <i-input element-id="app-modal-form-appIp" v-model="modalForm.appIp" placeholder="请输入应用IP"/>
      </FormItem>
      <FormItem label="应用URL" label-for="app-modal-form-url" prop="url">
        <i-input element-id="app-modal-form-url" v-model="modalForm.url" placeholder="请输入应用URL"/>
      </FormItem>
      <FormItem label="应用ID" label-for="app-modal-form-id" prop="id">
        <i-input v-model="modalForm.appId" element-id="app-modal-form-id" placeholder="请输入应用ID"/>
      </FormItem>
      <FormItem label="应用密钥" label-for="app-modal-form-appSecret" prop="appSecret">
        <i-input
          v-model="modalForm.appSecret"
          element-id="app-modal-form-appSecret"
          placeholder="请输入应用密钥"
        />
      </FormItem>
      <FormItem label="备注" label-for="app-modal-form-remark" prop="remark">
        <i-input
          v-model="modalForm.remark"
          element-id="app-modal-form-remark"
          type="textarea"
          placeholder="请输入备注"
        />
      </FormItem>
    </Form>
  </management>
</template>

<script>
import management from "_c/management";
import managementHelp from "./mixin";
export default {
  name: "application",
  components: {
    management
  },
  mixins: [managementHelp],
  data() {
    return {
      searchForm: {
        name: ""
      },
      modalForm: {
        appSecret: "",
        appId: '',
        name: "",
        appIp: '',
        remark: "",
        url: ""
      },
      modalRules: {
        name: [{ required: true, message: "应用名称必须填写" }],
        appId: [{ required: true, message: "应用ID必须填写" }],
        url: [{ required: true, message: "应用ID必须填写" }]
      },
      columns: [
        {
          title: "应用名称",
          key: "name",
          minWidth: 150,
          tooltip: true
        },
        {
          title: "应用IP",
          key: "appIp",
          minWidth: 180,
          tooltip: true
        },
        {
          title: "应用URL",
          key: "url",
          minWidth: 155,
          tooltip: true
        },
        {
          title: "应用ID",
          key: "appId",
          minWidth: 150,
          tooltip: true
        },
        {
          title: "应用密钥",
          key: "appSecret",
          minWidth: 150,
          tooltip: true
        },{
          title: "备注",
          key: "remark",
          minWidth: 150,
          tooltip: true
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          minWidth: 150,
          align: "center",
          render: (h, { row }) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.edit(`/api/app/info/${row.id}`, "application");
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/app/ PUT"
                    }
                  ],
                  style: {
                    marginRight: "10px"
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$refs.application.delete(row);
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/app/ DELETE"
                    }
                  ],
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  }
};
</script>
