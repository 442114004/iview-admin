<template>
  <!-- 字典管理 -->
  <management
    style="background-color: white; height: 100%; padding: 10px;"
    ref="dictionary"
    :tableColumns="columns1"
    :data="{table: '/api/dictionary/list' }"
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
        prop="label"
        label="字典名称"
      >
        <Input
          type="text"
          v-model="searchForm.label"
          placeholder="输入字典名称搜索"
        >
        </Input>
      </FormItem>
      <FormItem
        prop="description"
        label="字典描述"
      >
        <Input
          type="text"
          v-model="searchForm.description"
          placeholder="输入字典描述搜索"
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
        label="字典名称"
        prop="label"
      >
        <i-input
          v-model="modalForm.label"
          placeholder="字典名称"
        ></i-input>
      </FormItem>
      <FormItem
        label="字典描述"
        prop="description"
      >
        <i-input
          v-model="modalForm.description"
          placeholder="字典描述"
        ></i-input>
      </FormItem>
      <FormItem
        label="字典类型"
        prop="type"
      >
        <i-input
          v-model="modalForm.type"
          placeholder="字典类型"
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
  name: "dictionary",
  components: {
    management
  },
  data() {
    return {
      searchForm: {
        label: "",
        description: ""
      },
      modalForm: {
        activated: "",
        createdBy: 0,
        createdDate: "",
        deleted: "",
        description: "",
        dictGroup: "",
        id: 0,
        label: "",
        lastModifiedBy: "",
        lastModifiedDate: "",
        remark: "",
        sort: 0,
        type: null,
        value: null
      },
      modalRules: {
        type: [{ required: true, message: "字典类型必须填写" }],
        description: [{ required: true, message: "字典描述必须填写" }],
        label: [{ required: true, message: "字典名称必须填写" }],
        value: [{ required: true, message: "字典值必须填写" }]
      },
      columns1: [
        {
          title: "字典名称",
          key: "label",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "字典描述",
          key: "description",
          minWidth: 145,
          tooltip: true
        },
        {
          title: "字典类型",
          key: "type",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "字典值",
          key: "value",
          minWidth: 150,
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
          key: "createBy",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "创建时间",
          key: "createDate",
          minWidth: 180,
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
          minWidth: 180,
          tooltip: true
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 200,
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
                      this.$refs.dictionary.delete(row);
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
      ]
    };
  },
  methods: {
    deleteRow(request) {
      request("/api/dictionary/");
    },
    edit({ id }) {
      getInfo("/api/dictionary/info/" + id)
        .then(data => {
          Object.assign(this.modalForm, data, {
            activated: data.activated ? 1 : 0
          });
          this.$refs.dictionary.edit();
        })
        .catch(error => {
          this.$Notice.error({
            title: "打开编辑失败",
            desc: error
          });
        });
    },
    submit(pid, request) {
      // 添加和保存时，参数的处理
      let param = Object.assign({}, this.modalForm);
      param.activated = !!param.activated;
      request("/api/dictionary/", param, param.id ? "put" : "post");
    },
    search() {
      // 查询时，处理查询参数
      const param = Object.assign({}, this.searchForm);
      for (let i in param) {
        param[i] === "" && delete param[i];
      }
      this.$refs.dictionary.setTableData(param);
    },
    changeActivated(row, value) {
      row.activated = value;
      this.$set(row, "activated_loading", true);
      setActivated("/api/dictionary/isActivated/", row)
        .then(() => {
          this.$set(row, "activated_loading", false);
        })
        .catch(error => {
          row.activated = !value;
          this.$set(row, "activated_loading", false);
          this.$Notice.error({
            title: "状态修改失败",
            desc: error
          });
        });
    }
  }
};
</script>
