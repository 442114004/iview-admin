<template>
  <management
    style="background-color: white; height: 100%; padding: 10px;"
    ref="application"
    :tableColumns="columns1"
    :data="{table: '/api/app/list' }"
    page-name="数据"
    add-button
    refresh-button
    @submit="submit"
    @delete="deleteRow"
    @refresh="search"
  >
    <Form
      ref="searchForm"
      :model="searchForm"
      inline
      :label-width="80"
      slot="searchForm"
    >
      <FormItem
        prop="name"
        label="应用名称"
      >
        <Input
          type="text"
          v-model="searchForm.name"
          placeholder="输入应用名称搜索"
        >
        </Input>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          icon="md-search"
          @click="search"
        >搜索</Button>
        <Button
          @click="$refs.searchForm.resetFields()"
          style="margin-left: 8px"
        >重置</Button>
      </FormItem>
    </Form>
    <Form
      :model="modalForm"
      :label-width="80"
      :rules="modalRules"
      ref="modalForm"
      slot="modalForm"
    >
      <FormItem
        label="应用名称"
        prop="name"
      >
        <i-input
          v-model="modalForm.name"
          placeholder="应用名称"
        ></i-input>
      </FormItem>
      <FormItem
        label="应用IP"
        prop="appIp"
      >
        <i-input
          v-model="modalForm.appIp"
          placeholder="应用IP"
        ></i-input>
      </FormItem>
      <FormItem
        label="应用URL"
        prop="url"
      >
        <i-input
          v-model="modalForm.url"
          placeholder="应用URL"
        ></i-input>
      </FormItem>
      <FormItem
        label="应用ID"
        prop="id"
      >
        <i-input
          v-model="modalForm.appId"
          placeholder="应用ID"
        ></i-input>
      </FormItem>
      <FormItem
        label="应用密钥"
        prop="appSecret"
      >
        <i-input
          v-model="modalForm.appSecret"
          placeholder="应用密钥"
        ></i-input>
      </FormItem>
      <FormItem
        label="备注"
        prop="remark"
      >
        <i-input
          v-model="modalForm.remark"
          type="textarea"
          placeholder="备注"
        ></i-input>
      </FormItem>
    </Form>
  </management>
</template>

<script>
import management from "_c/management";
import { getInfo } from "@/api/system-management";
export default {
  name: "application",
  components: {
    management
  },
  data() {
    return {
      searchForm: {
        name: ""
      },
      modalForm: {
        activated: "",
        appKey: "",
        appSecret: "",
        createdBy: null,
        createdDate: "",
        deleted: "",
        id: null,
        appId: null,
        lastModifiedBy: null,
        lastModifiedDate: "",
        name: "",
        remark: "",
        url: ""
      },
      modalRules: {
        name: [{ required: true, message: "应用名称必须填写" }],
        appId: [{ required: true, message: "应用ID必须填写" }],
        url: [{ required: true, message: "应用ID必须填写" }]
      },
      columns1: [
        {
          title: "应用名称",
          key: "name",
          minWidth: 250,
          tooltip: true
        },
        {
          title: "应用IP",
          key: "appIp",
          minWidth: 280,
          tooltip: true
        },
        {
          title: "应用URL",
          key: "url",
          minWidth: 255,
          tooltip: true
        },
        {
          title: "应用ID",
          key: "appId",
          minWidth: 250,
          tooltip: true
        },
        {
          title: "应用密钥",
          key: "appSecret",
          minWidth: 250,
          tooltip: true
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          align: "center",
          minWidth: 200,
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
                      this.edit(row);
                    }
                  },
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
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    submit(pid, request) {
      // 添加和保存时，参数的处理
      let param = Object.assign({}, this.modalForm);
      param.activated = !!param.activated;
      param.appId = pid;
      console.log(param.id);
      request("/api/app/", param, param.id ? "put" : "post");
    },
    search() {
      // 查询时，处理查询参数
      const param = Object.assign({}, this.searchForm);
      for (let i in param) {
        param[i] === "" && delete param[i];
      }
      this.$refs.application.setTableData(param);
    },
    edit({ id }) {
      getInfo("/api/app/info/" + id)
        .then(data => {
          Object.assign(this.modalForm, data, {
            activated: data.activated ? 1 : 0
          });
          this.$refs.application.edit();
        })
        .catch(error => {
          this.$Notice.error({
            title: "打开编辑失败",
            desc: error
          });
        });
    },
    state() {},
    deleteRow(request) {
      request("/api/app/");
    }
  }
};
</script>
