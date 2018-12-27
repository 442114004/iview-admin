<template>
  <!-- 用户管理 -->
  <management
    style="background-color: white; height: 100%;"
    ref="user"
    :tableColumns="tableColumns"
    :data="{table: '/api/user/list' }"
    page-name="用户"
    refresh-button
    add-button
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
        prop="realname"
        label-for="realname"
        label="姓名"
      >
        <Input
          type="text"
          v-model="searchForm.realname"
          element-id="realname"
          placeholder="请输入姓名搜索"
        >
        </Input>
      </FormItem>
      <FormItem
        prop="MOBILE"
        label="手机号"
      >
        <Input
          type="text"
          v-model="searchForm.MOBILE"
          placeholder="请输入手机号搜索"
        >
        </Input>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          icon="md-search"
          @click="search"
        >查询</Button>
        <Button
          @click="$refs.searchForm.resetFields()"
          style="margin-left: 8px"
        >重置</Button>
      </FormItem>
    </Form>
    <Form
      :model="modalForm"
      :label-width="100"
      :rules="modalRules"
      ref="modalForm"
      slot="modalForm"
    >
      <Row>
        <Col span="10">
        <FormItem
          prop="loginName"
          label="账号"
        >
          <Input
            type="text"
            v-model="modalForm.loginName"
            placeholder="账号"
          >
          </Input>
        </FormItem>
        </Col>
        <Col span="10">
        <FormItem
          prop="pwd"
          label="登录密码"
        >
          <Input
            type="text"
            v-model="modalForm.pwd"
            placeholder="若不修改密码，无需输入"
          >
          </Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="10">
        <FormItem
          prop="realName"
          label="姓名"
        >
          <Input
            type="text"
            v-model="modalForm.realName"
            placeholder="姓名"
          >
          </Input>
        </FormItem>
        </Col>
        <Col span="10">
        <FormItem
          prop="userNumber"
          label="工号"
        >
          <Input
            type="text"
            v-model="modalForm.userNumber"
            placeholder="工号"
          >
          </Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="10">
        <FormItem
          prop="mobilePhone"
          label="手机号"
        >
          <Input
            type="text"
            v-model="modalForm.mobilePhone"
            placeholder="手机号"
          >
          </Input>
        </FormItem>
        </Col>
        <Col span="10">
        <FormItem
          prop="status"
          label="状态"
        >
          <i-select
            v-model="modalForm.status"
            placeholder="状态"
          >
            <i-option :value="0">注册</i-option>
            <i-option :value="1">在用</i-option>
            <i-option :value="2">锁定</i-option>
          </i-select>
        </FormItem>
        </Col>
      </Row>
      <FormItem
        label="身份证号"
        prop="identityCard"
      >
        <Input
          type="text"
          v-model="modalForm.identityCard"
          placeholder="身份证号"
        />
      </FormItem>
      <FormItem
        label="备注"
        prop="remark"
      >
        <Input
          type="textarea"
          v-model="modalForm.remark"
          placeholder="备注"
        />
      </FormItem>
    </Form>
  </management>
</template>

<script>
import management from "_c/management";
import { getInfo, setActivated } from "@/api/system-management";
export default {
  name: "user",
  components: {
    management
  },
  data() {
    return {
      searchForm: {
        realname: "",
        mobilePhone: ""
      },
      modalForm: {
        addTime: "",
        avatar: "",
        deleted: true,
        id: null,
        lastLoginIp: "",
        lastLoginTime: "",
        locked: "",
        loginName: "",
        mobilePhone: "",
        onlineStatus: "",
        password: "",
        realname: "",
        remark: "",
        identityCard: ''
      },
      modalRules: {
        name: [{ required: true, message: "账号必填" }],
        realname: [{ required: true, message: "姓名必填" }],
        status: [{ required: true, message: "状态必须选择" }],
        mobilePhone: {
          trigger: "blur",
          validator(rule, value, callback) {
            if (value.trim() && !/^1[34578]\d{9}$/.test(value.trim())) {
              callback(new Error("请输入正确的手机号码"));
            } else {
              callback();
            }
          }
        }
      },
      tableColumns: [
        {
          title: "登录名",
          key: "loginName"
        },
        {
          title: "手机号",
          key: "mobilePhone"
        },
        {
          title: "真实姓名",
          key: "realname"
        },
        {
          title: "状态",
          key: "locked",
          tooltip: true,
          render: (h, { row }) => {
            return h("span", row.locked ? "锁定" : "解锁");
          }
        },
        {
          title: "注册时间",
          key: "addTime"
        },
        {
          title: "最后登录时间",
          key: "lastLoginTime"
        },
        {
          title: "备注",
          key: "note"
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          align: "center",
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
                      this.$refs.user.delete(row);
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
                    value: row.locked,
                    loading: row.activated_loading
                  },
                  on: {
                    "on-change": value => {
                      this.changeActivated(row, value);
                    }
                  }
                },
                [
                  h("span", { slot: "open" }, "锁定"),
                  h("span", { slot: "close" }, "解锁")
                ]
              )
            ]);
          }
        }
      ]
    }
  },
  methods: {
    search() {
      // 查询时，处理查询参数
      const param = Object.assign({}, this.searchForm);
      this.$refs.user.setTableData(param);
    },
    submit(pid, request) {
      // 添加和保存时，参数的处理
      let param = Object.assign({}, this.modalForm);
      param.pid = pid;
      param.extVo={
        identityCard:this.modalForm.identityCard
      }
      request(`/api/user/`, param,param.id ? "put" : "post");
    },
    deleteRow(request) {
      request("/api/user/");
    },
    edit({ id }) {
      // 编辑时，表单的回显
      getInfo("/api/user/info/" + id)
        .then(data => {
          Object.assign(this.modalForm, data, {
            activated: data.activated ? 1 : 0
          });
          this.$refs.user.edit();
        })
        .catch(error => {
          this.$Notice.error({
            title: "打开编辑失败",
            desc: error
          });
        });
    },
    state() {},
     changeActivated(row, value) {
      row.locked = value;
      this.$set(row, 'activated_loading', true);
      setActivated('/api/user/', row)
        .then(() => {
          this.$set(row, 'activated_loading', false);
        })
        .catch(error => {
          row.locked = !value;
          this.$set(row, 'activated_loading', false);
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
