<template>
  <!-- 用户管理 -->
  <management
    ref="user"
    :table-columns="tableColumns"
    :data="{ table: '/api/user/list' }"
    page-name="用户"
    refresh-button="/api/user/list GET"
    add-button="/api/user/ POST"
    @submit="submit($event, '/api/user/')"
    @delete="deleteRow($event, '/api/user/')"
    @refresh="search('user')"
  >
    <Form ref="searchForm" :model="searchForm" inline :label-width="80" slot="searchForm">
      <FormItem prop="loginName" label-for="user-search-form-loginName" label="登录名">
        <i-input
          type="text"
          v-model="searchForm.loginName"
          element-id="user-search-form-loginName"
          placeholder="请输入登录名名搜索"
        />
      </FormItem>
      <FormItem prop="mobilePhone" label-for="user-search-form-mobilePhone" label="手机号">
        <i-input
          type="text"
          element-id="user-search-form-mobilePhone"
          v-model="searchForm.mobilePhone"
          placeholder="请输入手机号搜索"
        />
      </FormItem>
      <FormItem>
        <Button type="primary" icon="md-search" v-permission="'/api/user/list GET'" @click="search('user')">查询</Button>
        <Button icon="ios-redo" @click="$refs.searchForm.resetFields()" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
    <Form :model="modalForm" :label-width="80" :rules="modalRules" ref="modalForm" slot="modalForm">
      <FormItem prop="loginName" label-for="user-modal-form-loginName" label="登录名">
        <i-input
          type="text"
          element-id="user-modal-form-loginName"
          v-model="modalForm.loginName"
          placeholder="请输入登录名"
        />
      </FormItem>
      <FormItem prop="realname" label-for="user-modal-form-realname" label="姓名">
        <i-input
          type="text"
          element-id="user-modal-form-realname"
          v-model="modalForm.realname"
          placeholder="请输入姓名"
        />
      </FormItem>
      <FormItem prop="mobilePhone" label-for="user-modal-form-mobilePhone" label="手机号">
        <i-input
          type="text"
          element-id="user-modal-form-mobilePhone"
          v-model="modalForm.mobilePhone"
          placeholder="请输入手机号"
        />
      </FormItem>
      <FormItem label="身份证号" label-for="user-modal-form-identityCard" prop="identityCard">
        <i-input
          type="text"
          v-model="modalForm.identityCard"
          element-id="user-modal-form-identityCard"
          placeholder="请输入身份证号"
        />
      </FormItem>
      <FormItem label="备注" label-for="user-modal-form-remark" prop="remark">
        <i-input
          type="textarea"
          v-model="modalForm.remark"
          element-id="user-modal-form-remark"
          placeholder="请输入备注"
        />
      </FormItem>
    </Form>
  </management>
</template>

<script>
import management from "_c/management";
import { setIsLocked, resetPassword } from "@/api/system-management";
import managementHelp from "./mixin";
export default {
  name: "user",
  components: {
    management
  },
  mixins: [managementHelp],
  data() {
    return {
      searchForm: {
        loginName: "",
        mobilePhone: ""
      },
      modalForm: {
        loginName: "",
        realname: "",
        userNumber: "",
        mobilePhone: "",
        identityCard: "",
        remark: ""
      },
      modalRules: {
        loginName: { required: true, message: "账号必填" },
        realname: { required: true, message: "姓名必填" },
        mobilePhone: {
          trigger: "blur",
          validator(rule, value, callback) {
            if (value && !/^1[345789]\d{9}$/.test(value.trim())) {
              callback(new Error("请输入正确的手机号码"));
            } else {
              callback();
            }
          }
        },
        identityCard: {
          trigger: "blur",
          validator(rule, value, callback) {
            if (
              value &&
              !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value.trim())
            ) {
              callback(new Error("请输入正确的身份证号码"));
            } else {
              callback();
            }
          }
        }
      },
      tableColumns: [
        {
          title: "登录名",
          key: "loginName",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "真实姓名",
          key: "realname",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "手机号",
          key: "mobilePhone",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "状态",
          key: "locked",
          minWidth: 100,
          tooltip: true,
          render: (h, { row }) => {
            return h("span", row.locked ? "锁定" : "解锁");
          }
        },
        {
          title: "注册时间",
          key: "addTime",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "最后登录时间",
          key: "lastLoginTime",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "备注",
          key: "note",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          align: "center",
          minWidth: 270,
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
                      this.edit(`/api/user/info/${row.id}`, "user");
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/user/ PUT"
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
                      this.$refs.user.delete(row);
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/user/ DELETE"
                    }
                  ],
                  style: {
                    marginRight: "10px"
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.resetPassword(row.id);
                    }
                  },
                  style: {
                    marginRight: "10px"
                  }
                },
                "重置密码"
              ),
              h(
                "i-switch",
                {
                  props: {
                    size: "large",
                    value: row.locked,
                    loading: row.locked_loading
                  },
                  on: {
                    "on-change": value => {
                      this.changeActivated(
                        row,
                        value,
                        `/api/user/isLocked/${row.id}`
                      );
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/user/isLocked/{id} GET"
                    }
                  ]
                },
                [
                  h("span", { slot: "open" }, "解锁"),
                  h("span", { slot: "close" }, "锁定")
                ]
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    submit(event, url) {
      // 添加和保存时，参数的处理
      let param = Object.assign({}, this.modalForm);
      param.extVo = {
        identityCard: this.modalForm.identityCard
      };
      event.request(url, param, param.id ? "put" : "post");
    },
    changeActivated(row, value, url) {
      row.locked = value;
      this.$set(row, "locked_loading", true);
      setIsLocked(url)
        .then(() => {
          this.$set(row, "locked_loading", false);
        })
        .catch(error => {
          row.locked = !value;
          this.$set(row, "locked_loading", false);
          this.$Notice.error({
            title: value ? "锁定失败" : "解锁失败",
            desc: error
          });
        });
    },
    resetPassword(id) {
      this.$Modal.confirm({
        title: "密码重置",
        content: "将密码重置为888888",
        loading: true,
        onOk: () => {
          let cancelButton = document.getElementsByClassName(
            "ivu-modal-confirm-footer"
          )[0].children[0];
          cancelButton.setAttribute("disabled", "disabled");
          resetPassword(id)
            .then(() => {
              cancelButton.removeAttribute("disabled");
              this.$Modal.remove();
              this.$Notice.success({
                title: "密码重置成功"
              });
            })
            .catch(error => {
              cancelButton.removeAttribute("disabled");
              this.$Modal.remove();
              this.$Notice.error({
                title: "密码重置成功失败",
                desc: error
              });
            });
        }
      });
    }
  }
};
</script>