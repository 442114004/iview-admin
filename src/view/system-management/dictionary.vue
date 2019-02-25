<template>
  <!-- 字典管理 -->
  <management
    ref="dictionary"
    :table-columns="columns"
    :data="{ table: '/api/dictionary/list' }"
    page-name="字典管理"
    add-button="/api/dictionary/ POST"
    refresh-button="/api/dictionary/list GET"
    @submit="submit($event, '/api/dictionary/')"
    @delete="deleteRow($event, '/api/dictionary/')"
    @refresh="search('dictionary')"
  >
    <Form ref="searchForm" :model="searchForm" inline :label-width="80" slot="searchForm">
      <FormItem prop="label" label-for="dic-search-form-label" label="字典名称">
        <i-input
          type="text"
          element-id="dic-search-form-label"
          v-model="searchForm.label"
          placeholder="输入字典名称搜索"
        />
      </FormItem>
      <FormItem prop="description" label-for="dic-search-form-desc" label="字典描述">
        <i-input
          type="text"
          v-model="searchForm.description"
          element-id="dic-search-form-desc"
          placeholder="输入字典描述搜索"
        />
      </FormItem>
      <FormItem>
        <Button type="primary" icon="md-search" v-permission="'/api/dictionary/list GET'" @click="search('dictionary')">搜索</Button>
        <Button icon="ios-redo" @click="$refs.searchForm.resetFields()" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
    <Form :model="modalForm" :label-width="80" :rules="modalRules" ref="modalForm" slot="modalForm">
      <FormItem label="字典名称" label-for="dic-modal-form-label" prop="label">
        <i-input element-id="dic-modal-form-label" v-model="modalForm.label" placeholder="请输入字典名称"></i-input>
      </FormItem>
      <FormItem label="字典描述" label-for="dic-modal-form-desc" prop="description">
        <i-input
          element-id="dic-modal-form-desc"
          v-model="modalForm.description"
          placeholder="请输入字典描述"
        ></i-input>
      </FormItem>
      <FormItem label="字典类型" label-for="dic-modal-form-type" prop="type">
        <i-input v-model="modalForm.type" element-id="dic-modal-form-type" placeholder="请输入字典类型"></i-input>
      </FormItem>
      <FormItem label="字典值" label-for="dic-modal-form-value" prop="value">
        <i-input element-id="dic-modal-form-value" v-model="modalForm.value" placeholder="请输入类型描述"></i-input>
      </FormItem>
      <FormItem label="备注" label-for="dic-modal-form-remark" prop="remark">
        <i-input
          element-id="dic-modal-form-remark"
          v-model="modalForm.remark"
          type="textarea"
          placeholder="请输入备注"
        ></i-input>
      </FormItem>
    </Form>
  </management>
</template>

<script>
import management from "_c/management";
import managementHelp from "./mixin";
export default {
  name: "dictionary",
  components: {
    management
  },
  mixins: [managementHelp],
  data() {
    return {
      searchForm: {
        label: "",
        description: ""
      },
      modalForm: {
        description: "",
        label: "",
        remark: "",
        type: "",
        value: ""
      },
      modalRules: {
        type: [{ required: true, message: "字典类型必须填写" }],
        description: [{ required: true, message: "字典描述必须填写" }],
        label: [{ required: true, message: "字典名称必须填写" }],
        value: [{ required: true, message: "字典值必须填写" }]
      },
      columns: [
        {
          title: "字典名称",
          key: "label",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "字典描述",
          key: "description",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "字典类型",
          key: "type",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "字典值",
          key: "value",
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
          minWidth: 80,
          tooltip: true
        },
        {
          title: "最后修改时间",
          key: "lastModifiedDate",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "备注",
          key: "remark",
          tooltip: true,
          minWidth: 80
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
                      this.edit(`/api/dictionary/info/${row.id}`, "dictionary");
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/dictionary/ PUT"
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
                      this.$refs.dictionary.delete(row);
                    }
                  },
                   directives: [
                    {
                      name: "permission",
                      value: "/api/dictionary/ DELETE"
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
                      this.changeActivated(row, value, '/api/dictionary/isActivated/');
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: '/api/dictionary/isActivated GET'
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
