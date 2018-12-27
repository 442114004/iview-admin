<template>
  <management
    ref="menu"
    :tableColumns="tableColumns"
    :data="{table: '/api/menu/list' }"
    page-name="菜单管理"
    add-button
    refresh-button
    @submit="submit"
    @delete="deleteRow"
    @refresh="search"
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
        <Button type="primary" @click="search">查询</Button>
        <Button @click="$refs.searchForm.resetFields()" style="margin-left: 8px">重置</Button>
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
      <Row>
        <Col span="8">
          <FormItem prop="name" label-for="org-modal-form-name" label="机构名">
            <i-input
              type="text"
              v-model="modalForm.name"
              element-id="org-modal-form-name"
              placeholder="请输入机构名"
            />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem prop="address" label-for="org-modal-form-address" label="机构地址">
            <i-input
              type="text"
              v-model="modalForm.address"
              element-id="org-modal-form-address"
              placeholder="请输入机构地址"
            />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem prop="areacode" label-for="org-modal-form-areacode" label="地区编码">
            <i-input
              type="text"
              v-model="modalForm.areacode"
              element-id="org-modal-form-areacode"
              placeholder="请输入地区编码"
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem prop="type" label-for="org-modal-form-type" label="机构类型">
            <i-select
              v-model="modalForm.type"
              element-id="org-modal-form-type"
              placeholder="请选择机构类型"
            >
              <i-option value="0">单位</i-option>
              <i-option value="1">部门</i-option>
            </i-select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem prop="code" label-for="org-modal-form-code" label="机构编码">
            <i-input
              type="text"
              v-model="modalForm.code"
              element-id="org-modal-form-code"
              placeholder="请输入机构编码"
            />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem prop="activated" label="状态">
            <RadioGroup v-model="modalForm.activated">
              <Radio :label="1">启用</Radio>
              <Radio :label="0">停用</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem prop="remark" label-for="org-modal-form-remark" label="备注">
            <i-input
              v-model="modalForm.remark"
              type="textarea"
              element-id="org-modal-form-remark"
              placeholder="请选择备注"
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
  </management>
</template>

<script>
import management from "_c/management";
import { getInfo, setActivated } from "@/api/system-management";
export default {
  name: "menu",
  components: {
    management
  },
  data() {
    return {
      url: "/api/org/",
      modalForm: {
        name: "",
        address: "",
        areacode: "",
        type: "",
        code: "",
        activated: "",
        remark: ""
      },
      modalRules: {
        name: [{ required: true, message: "机构名必填" }],
        address: [{ required: true, message: "机构地址必填" }],
        areacode: [{ required: true, message: "地区编码必填" }],
        type: [{ required: true, message: "机构类型必填" }],
        code: [{ required: true, message: "机构编码必填" }],
        activated: [{ required: true, message: "状态必填" }]
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
          title: "操作",
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
                      this.$refs.organization.delete(row);
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
    state() {},
    submit(pid, request) {
      // 添加和保存时，参数的处理
      let param = Object.assign({}, this.modalForm);
      param.activated = !!param.activated;
      param.pid = pid;
      request("/api/org/", param, param.id ? "put" : "post");
    },
    deleteRow(request) {
      request("/api/org/");
    },
    edit({ id }) {
      // 编辑时，表单的回显
      getInfo("/api/org/info/" + id)
        .then(data => {
          Object.assign(this.modalForm, data, {
            activated: data.activated ? 1 : 0
          });
          this.$refs.organization.edit();
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
      this.$refs.organization.setTableData(param);
    },
    changeActivated(row, value) {
      row.activated = value;
      row.activated_loading = true;
      setActivated(this.url, row)
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
