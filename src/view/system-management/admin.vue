<template>
  <management
    ref="admin"
    :table-columns="columns"
    :data="{ table: '/api/admin/list' }"
    page-name="管理员"
    add-button="/api/admin/ POST"
    refresh-button="/api/admin/list GET"
    @submit="submit($event, '/api/admin/')"
    @delete="deleteRow($event, '/api/admin/')"
    @refresh="search('admin')"
    @closeModal="isEdit = false"
  >
    <Form
      ref="searchForm"
      :model="searchForm"
      inline
      :label-width="80"
      slot="searchForm"
    >
      <FormItem
        prop="userName"
        label-for="admin-search-form-userName"
        label="管理员帐号"
      >
        <i-input
          type="text"
          style="width: 162px;"
          v-model="searchForm.userName"
          element-id="admin-search-form-userName"
          placeholder="输入管理员帐号搜索"
        />
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          icon="md-search"
          v-permission="'/api/admin/list GET'"
          @click="search('admin')"
        >搜索</Button>
        <Button
          icon="ios-redo"
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
        label="管理帐号"
        prop="username"
        label-for="admin-modal-form-username"
      >
        <i-input
          :disabled="isEdit ? true:false"
          v-model="modalForm.username"
          element-id="admin-modal-form-username"
          placeholder="请输入管理帐号"
        />
      </FormItem>
      <FormItem
        label="邮箱"
        prop="email"
        label-for="admin-modal-form-email"
      >
        <i-input
          type="email"
          v-model="modalForm.email"
          element-id="admin-modal-form-email"
          placeholder="请输入邮箱"
        />
      </FormItem>
      <FormItem
        label="手机号码"
        prop="mobile"
        label-for="admin-modal-form-mobile"
      >
        <i-input
          v-model="modalForm.mobile"
          element-id="admin-modal-form-mobile"
          placeholder="请输入手机号码"
        />
      </FormItem>
      <FormItem
        label="密码"
        prop="password"
        label-for="admin-modal-form-password"
        v-if="!isEdit"
      >
        <i-input
          v-model="modalForm.password"
          element-id="admin-modal-form-password"
          placeholder="请输入初始密码"
        />
      </FormItem>
      <FormItem
        label="姓氏"
        prop="firstName"
        label-for="admin-modal-form-firstName"
      >
        <i-input
          v-model="modalForm.firstName"
          element-id="admin-modal-form-firstName"
          placeholder="请输入姓氏"
        />
      </FormItem>
      <FormItem
        label="名字"
        prop="lastName"
        label-for="admin-modal-form-lastName"
      >
        <i-input
          v-model="modalForm.lastName"
          element-id="admin-modal-form-lastName"
          placeholder="请输入名字"
        />
      </FormItem>
      <FormItem
        label="性别"
        prop="gender"
        label-for="admin-modal-form-gender"
      >
        <i-select
          v-model="modalForm.gender"
          element-id="admin-modal-form-gender"
          placeholder="请选择性别"
        >
          <i-option :value="0">未知</i-option>
          <i-option :value="1">男</i-option>
          <i-option :value="2">女</i-option>
        </i-select>
      </FormItem>
      <FormItem
        label="角色"
        prop="roles"
      >
        <i-select
          v-model="modalForm.roles"
          multiple
        >
          <i-option
            v-for="item in roles"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</i-option>
        </i-select>
      </FormItem>
      <FormItem
        label="备注"
        prop="remark"
        label-for="admin-modal-form-remark"
      >
        <i-input
          type="textarea"
          v-model="modalForm.remark"
          element-id="admin-modal-form-remark"
          placeholder="请输入备注"
        />
      </FormItem>
    </Form>
  </management>
</template>

<script>
import management from "_c/management";
import managementHelp from "./mixin";
import { getInfo } from "@/api/system-management";
export default {
  name: "admin",
  components: {
    management
  },
  mixins: [managementHelp],
  data() {
    return {
      cityList: [
        {
          value: "001",
          label: "New York"
        },
        {
          value: "002",
          label: "London"
        },
        {
          value: "003",
          label: "Sydney"
        },
        {
          value: "004",
          label: "Ottawa"
        },
        {
          value: "005",
          label: "Paris"
        },
        {
          value: "006",
          label: "Canberra"
        }
      ],
      isEdit: true,
      searchForm: {
        userName: ""
      },
      columns: [
        {
          title: "管理员账号",
          key: "username",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "姓名",
          key: "name",
          minWidth: 100,
          tooltip: true,
          render: (h, { row }) => {
            return h("span", row.firstName + row.lastName);
          }
        },
        {
          title: "邮箱",
          key: "email",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "手机号码",
          key: "mobile",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "性别",
          key: "gender",
          minWidth: 80,
          tooltip: true,
          render: (h, { row }) => {
            return h(
              "span",
              row.gender.value == 0
                ? "未知"
                : row.gender.value == 1
                ? "男"
                : "女"
            );
          }
        },
        {
          title: "最后登录时间",
          key: "lastLoginTime",
          minWidth: 120,
          tooltip: true
        },
        {
          title: "创建时间",
          key: "createdDate",
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
          title: "重置日期",
          key: "resetDate",
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
          title: "状态",
          key: "activated",
          minWidth: 80,
          tooltip: true,
          render: (h, { row }) => {
            return h("span", row.activated ? "启用" : "停用");
          }
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          minWidth: 270,
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
                      this.isEdit = true;
                      this.edit(`/api/admin/info/${row.id}`, "admin");
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/admin/ PUT"
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
                      this.$refs.admin.delete(row);
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/admin/ DELETE"
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
                    size: "small",
                    disabled:true
                  },
                  on: {
                    click: () => {
                      // this.$refs.admin.delete(row);
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
                    value: !row.activated,
                    loading: row.activated_loading,
                    disabled:true
                  },
                  on: {
                    "on-change": value => {
                      this.changeActivated(row, value, "/api/admin/");
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/admin/ PUT"
                    }
                  ]
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
      roles: [],
      modalForm: {
        username: "",
        roles: [],
        email: "",
        mobile: "",
        password: "123456",
        firstName: "",
        lastName: "",
        gender: "",
        remark: ""
      },
      modalRules: {
        username: {
          required: this.isEdit ? true : false,
          message: "管理员帐号必填"
        },
        password: { required: true, message: "密码必填" },
        email: { type: "email", message: "邮箱格式不正确", trigger: "blur" },
        roles: { type: "array", required: true, message: "角色必须选择" },
        mobile: {
          trigger: "blur",
          validator(rule, value, callback) {
            if (value && !/^1[345789]\d{9}$/.test(value.trim())) {
              callback(new Error("手机号码格式不正确"));
            } else {
              callback();
            }
          }
        }
      }
    };
  },
  mounted() {
    getInfo("/api/role/own").then(data => {
      for (var i = 0; i < data.length; i++) {
        data[i].value = data[i].id;
        data[i].label = data[i].name;
      }
      this.roles = data;
    });
  }
};
</script>
