<template>
  <management
    style="background-color: white; height: 100%;"
    ref="admin"
    :tableColumns="columns1"
    :data="{table: '/api/admin/list' }"
    page-name="管理员"
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
        prop="username"
        label="管理员名称"
      >
        <Input
          type="text"
          v-model="searchForm.username"
          placeholder="输入管理员名称搜索"
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
        label="管理员名称"
        prop="username"
      >
        <i-input
          v-model="modalForm.username"
          placeholder="管理员名称"
        ></i-input>
      </FormItem>
      <FormItem
        label="邮箱"
        prop="email"
      >
        <i-input
          v-model="modalForm.email"
          placeholder="字典描述"
        ></i-input>
      </FormItem>
      <FormItem
        label="手机号码"
        prop="mobile"
      >
        <i-input
          v-model="modalForm.mobile"
          placeholder="手机号码"
        ></i-input>
      </FormItem>
      <FormItem
        label="字典值"
        prop="value"
      >
        <i-input
          v-model="modalForm.value"
          placeholder="类型描述"
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
import { getInfo, setActivated } from "@/api/system-management";
export default {
  name: "admin",
  components: {
    management
  },
  data() {
    return {
      searchForm: {
        username: ""
      },
      columns1: [
        {
          title: "管理员名称",
          key: "username",
          width: 220,
          tooltip: true
        },
        {
          title: "邮箱",
          key: "email",
          width: 320,
          tooltip: true
        },
        {
          title: "状态",
          key: "activated",
          minWidth: 80,
          tooltip: true,
          render: (h, { row }) => {
            return h("span", row.activated ? "启用" : "停用");
          }
        },
        {
          title: "创建人",
          key: "createdBy",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "创建时间",
          key: "createdDate",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "最后修改人",
          key: "lastModifiedBy",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "最后修改时间",
          key: "lastModifiedDate",
          minWidth: 110,
          tooltip: true
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "Action",
          key: "action",
          fixed: "right",
          width: 200,
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
                      this.delete(row);
                    }
                  },
                  style: {
                    marginRight: "10px"
                  }
                },
                "删除"
              ),
              h(
                "i-switch",
                {
                  props: {
                    size: "large",
                    value: row.activated,
                    loading: row.activated_loading
                  },
                  on: {
                    "on-change": value => {
                      this.changeActivated(row, value);
                    }
                  }
                },
                [
                  h("span", { slot: "open" }, "启用"),
                  h("span", { slot: "close" }, "停用")
                ]
              )
            ]);
          }
        }
      ],
      modalForm: {
        activated: '',
        avatar: "",
        createdBy: 0,
        createdDate: "",
        deleted: false,
        email: "",
        firstName: "",
        gender: "",
        id: 0,
        lastLoginTime: "",
        lastModifiedBy: 0,
        lastModifiedDate: "",
        lastName: "",
        mobile: "",
        orgs: [],
        password: "",
        remark: "",
        resetDate: "",
        status: "",
        username: ""
      },
      modalRules:{

      }
    };
  },
  methods: {
    state() {},
    submit(pid, request) {
      // 添加和保存时，参数的处理
      let param = Object.assign({}, this.modalForm);
      param.activated = !!param.activated;
      param.pid = pid;
      request("/api/admin/", param, param.id ? "put" : "post");
    },
    deleteRow(request) {
      request("/api/admin/");
    },
    edit({ id }) {
      // 编辑时，表单的回显
      getInfo("/api/admin/info/" + id)
        .then(data => {
          Object.assign(this.modalForm, data, {
            activated: data.activated ? 1 : 0
          });
          this.$refs.admin.edit();
        })
        .catch(error => {
          this.$Notice.error({
            title: "打开编辑失败",
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
      this.$refs.admin.setTableData(param);
    },
    changeActivated(row, value) {
      row.activated = value;
      row.activated_loading = true;
      setActivated('/api/adim/', row)
        .then(() => {
          row.activated_loading = false;
        })
        .catch(error => {
          row.activated = !value;
          row.activated_loading = false;
          this.$Notice.error({
            title: "状态修改失败",
            desc: error
          });
        });
    }
  }
};
</script>

<style>
</style>
