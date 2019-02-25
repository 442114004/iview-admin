<template>
  <management
    ref="menu"
    no-paging
    :table-columns="tableColumns"
    :data="{ tree: '/api/menu/tree', table: '/api/menu/tree' }"
    page-name="菜单管理"
    add-button="/api/menu/ POST"
    refresh-button="/api/menu/list GET"
    @submit="submit($event, '/api/menu/')"
    @delete="deleteRow"
    @refresh="search('menu')"
  >
    <Form :model="searchForm" inline :label-width="80" ref="searchForm" slot="searchForm">
      <FormItem prop="name" label-for="menu-search-form-name" label="菜单名">
        <i-input
          type="text"
          v-model="searchForm.name"
          element-id="menu-search-form-name"
          placeholder="输入菜单名搜索"
          style="width: 162px;"
        />
      </FormItem>
      <FormItem prop="url" label-for="menu-search-form-url" label="菜单url">
        <i-input
          type="text"
          v-model="searchForm.url"
          element-id="menu-search-form-url"
          placeholder="输入菜单url搜索"
          style="width: 162px;"
        />
      </FormItem>
      <FormItem prop="code" label-for="menu-search-form-code" label="菜单编码">
        <i-input
          type="text"
          v-model="searchForm.code"
          element-id="menu-search-form-code"
          placeholder="输入菜单编码搜索"
          style="width: 162px;"
        />
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          icon="md-search"
          v-permission="'/api/menu/list GET'"
          @click="search('menu')"
        >搜索</Button>
        <Button icon="ios-redo" @click="$refs.searchForm.resetFields()" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
    <Form
      :model="modalForm"
      inline
      :label-width="80"
      :rules="modalRules"
      ref="modalForm"
      slot="modalForm"
    >
      <FormItem prop="name" label-for="menu-modal-form-name" label="菜单名">
        <i-input
          type="text"
          v-model="modalForm.name"
          element-id="menu-modal-form-name"
          placeholder="请输入菜单名"
        />
      </FormItem>
      <FormItem prop="url" label-for="menu-modal-form-url" label="菜单url">
        <i-input
          type="text"
          v-model="modalForm.url"
          element-id="menu-modal-form-url"
          placeholder="请输入菜单url"
        />
      </FormItem>
      <FormItem prop="code" label-for="menu-modal-form-code" label="菜单编码">
        <i-input
          type="text"
          v-model="modalForm.code"
          element-id="menu-modal-form-code"
          placeholder="请输入菜单编码"
        />
      </FormItem>
      <FormItem prop="icon" label-for="menu-modal-form-icon" label="菜单图标">
        <i-input
          type="text"
          v-model="modalForm.icon"
          element-id="menu-modal-form-icon"
          placeholder="请输入菜单图标"
        />
      </FormItem>
      <FormItem prop="sort" label-for="menu-modal-form-sort" label="菜单排序">
        <i-input
          type="text"
          v-model="modalForm.sort"
          element-id="menu-modal-form-sort"
          placeholder="请输入菜单排序"
        />
        <!-- <InputNumber v-model="modalForm.sort" element-id="menu-modal-form-sort" placeholder="请输入菜单排序" /> -->
      </FormItem>
      <FormItem prop="description" label-for="menu-modal-form-description" label="菜单描述">
        <i-input
          type="text"
          v-model="modalForm.description"
          element-id="menu-modal-form-description"
          placeholder="请输入菜单描述"
        />
      </FormItem>
      <FormItem prop="remark" label-for="menu-modal-form-remark" label="备注">
        <i-input
          v-model="modalForm.remark"
          type="textarea"
          element-id="menu-modal-form-remark"
          placeholder="请输入备注"
        />
      </FormItem>
    </Form>
  </management>
</template>

<script>
import { mapState } from 'vuex';
import management from "_c/management";
import managementHelp from "./mixin";
export default {
  name: "sysmenu",
  components: {
    management
  },
  mixins: [managementHelp],
  data() {
    return {
      modalForm: {
        name: "",
        url: "",
        code: "",
        icon: "",
        description: "",
        activated: "",
        remark: "",
        sort: ""
      },
      modalRules: {
        name: { required: true, message: "菜单名必填" },
        url: { required: true, message: "菜单url必填" },
        sort: { trigger: "blur",
          validator(rule, value, callback) {
            if (value && !/^\d+$/.test(value.trim())) {
              callback(new Error("请输入非负整数"));
            } else {
              callback();
            }
          } }
      },
      searchForm: {
        name: "",
        code: "",
        url: ""
      },
      tableColumns: [
        {
          title: "菜单名",
          key: "name",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "菜单url",
          key: "url",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "菜单编码",
          key: "code",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "菜单排序",
          key: "sort",
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
          title: "菜单描述",
          key: "description",
          minWidth: 100,
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
          title: "备注",
          key: "remark",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 200,
          align: "center",
          render: (h, { row }) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    disabled: !this.superAdmin && !row.own
                  },
                  on: {
                    click: () => {
                      this.edit(`/api/menu/info/${row.id}`, "menu");
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/menu/ PUT"
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
                    size: "small",
                    disabled: !this.superAdmin && !row.own
                  },
                  on: {
                    click: () => {
                      this.$refs.menu.delete(row);
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/menu/ DELETE"
                    }
                  ],
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
                    value: !row.activated,
                    loading: row.activated_loading,
                    disabled: !this.superAdmin && !row.own
                  },
                  on: {
                    "on-change": value => {
                      this.changeActivated(row, value, "/api/menu/");
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/menu/ PUT"
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
      ]
    };
  },
  computed: {
    ...mapState({
      superAdmin: state => state.user.superAdmin
    })
  },
  methods: {
    deleteRow(request, id) {
      request(`/api/menu/${id}`, id);
    }
  }
};
</script>
