<template>
  <management
    ref="organization"
    :table-columns="tableColumns"
    :data="{ tree: '/api/org/list', table: '/api/org/list' }"
    page-name="组织结构"
    add-button="/api/org/ POST"
    refresh-button="/api/org/list GET"
    @submit="submit($event, '/api/org/')"
    @delete="deleteRow($event, '/api/org/')"
    @refresh="search('organization')"
  >
    <Form :model="searchForm" inline :label-width="80" ref="searchForm" slot="searchForm">
      <FormItem prop="name" label-for="org-search-form-name" label="机构名">
        <i-input
          type="text"
          v-model="searchForm.name"
          element-id="org-search-form-name"
          placeholder="输入机构名搜索"
          style="width: 162px;"
        />
      </FormItem>
      <FormItem prop="type" label-for="org-search-form-type" label="机构类型">
        <i-select
          v-model="searchForm.type"
          element-id="org-search-form-type"
          placeholder="选择机构类型搜索"
          clearable
          style="width: 162px;"
        >
          <i-option :value="0">单位</i-option>
          <i-option :value="1">部门</i-option>
        </i-select>
      </FormItem>
      <FormItem>
        <Button type="primary" icon="md-search" v-permission="'/api/org/list GET'" @click="search('organization')">搜索</Button>
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
      <FormItem prop="name" label-for="org-modal-form-name" label="机构名">
        <i-input
          type="text"
          v-model="modalForm.name"
          element-id="org-modal-form-name"
          placeholder="请输入机构名"
        />
      </FormItem>
      <FormItem prop="address" label-for="org-modal-form-address" label="机构地址">
        <i-input
          type="text"
          v-model="modalForm.address"
          element-id="org-modal-form-address"
          placeholder="请输入机构地址"
        />
      </FormItem>
      <FormItem prop="areacode" label-for="org-modal-form-areacode" label="地区编码">
        <i-input
          type="text"
          v-model="modalForm.areacode"
          element-id="org-modal-form-areacode"
          placeholder="请输入地区编码"
        />
      </FormItem>
      <FormItem prop="type" label-for="org-modal-form-type" label="机构类型">
        <i-select v-model="modalForm.type" element-id="org-modal-form-type" placeholder="请选择机构类型">
          <i-option value="0">单位</i-option>
          <i-option value="1">部门</i-option>
        </i-select>
      </FormItem>
      <FormItem prop="code" label-for="org-modal-form-code" label="机构编码">
        <i-input
          type="text"
          v-model="modalForm.code"
          element-id="org-modal-form-code"
          placeholder="请输入机构编码"
        />
      </FormItem>
      <FormItem prop="remark" label-for="org-modal-form-remark" label="备注">
        <i-input
          v-model="modalForm.remark"
          type="textarea"
          element-id="org-modal-form-remark"
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
  name: "organization",
  components: {
    management
  },
  mixins: [managementHelp],
  data() {
    return {
      modalForm: {
        name: "",
        address: "",
        areacode: "",
        type: "",
        code: "",
        remark: ""
      },
      modalRules: {
        name: [{ required: true, message: "机构名必填" }],
        address: [{ required: true, message: "机构地址必填" }],
        areacode: [{ required: true, message: "地区编码必填" }],
        type: [{ required: true, message: "机构类型必填" }],
        code: [{ required: true, message: "机构编码必填" }]
      },
      searchForm: {
        name: "",
        type: ""
      },
      tableColumns: [
        {
          title: "机构名",
          key: "name",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "机构地址",
          key: "address",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "地区编码",
          key: "areacode",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "机构类型",
          key: "type",
          minWidth: 100,
          tooltip: true,
          render: (h, { row }) => {
            return h("span", row.type == 0 ? "单位" : "部门");
          }
        },
        {
          title: "机构编码",
          key: "code",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "级别",
          key: "level",
          minWidth: 80,
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
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.edit(`/api/org/info/${row.id}`, "organization");
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/org/ PUT"
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
                      this.$refs.organization.delete(row);
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/org/ DELETE"
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
                    loading: row.activated_loading
                  },
                  on: {
                    "on-change": value => {
                      this.changeActivated(row, value, "/api/org/");
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/org/ PUT"
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
  }
};
</script>
