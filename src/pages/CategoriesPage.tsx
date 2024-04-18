import { useEffect, useState } from "react";

import { Button, Col, Flex, Form, Input, Modal, Row, Spin } from "antd";

import CategoryCard from "../components/CategoryCard";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { controlLoading, getCategories } from "../redux/slices/category";
import request from "../server/request";
import Category from "../types/category";

const CategoriesPage = () => {
  const { categories, total, loading } = useAppSelector(
    (state) => state.category
  );
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [selected, setSelected] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [callback, setCallback] = useState(false);

  useEffect(() => {
    dispatch(getCategories({ search }));
  }, [dispatch, callback, search]);

  const refetch = () => {
    setCallback(!callback);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
    setSelected(null);
    form.resetFields();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    refetch();
  };

  const handleOk = async () => {
    try {
      setIsModalLoading(true);
      const values = await form.validateFields();
      if (selected === null) {
        await request.post("category", values);
      } else {
        await request.put(`category/${selected}`, values);
      }
      refetch();
      closeModal();
      form.resetFields();
    } finally {
      setIsModalLoading(false);
    }
  };

  const editCategory = async (id: string) => {
    try {
      setSelected(id);
      dispatch(controlLoading());
      const { data } = await request.get<Category>(`category/${id}`);
      setIsModalOpen(true);
      form.setFieldsValue(data);
    } finally {
      dispatch(controlLoading());
    }
  };

  const deleteCategory = async (id: string) => {
    await request.delete(`category/${id}`);
    refetch();
  };

  return (
    <Spin spinning={loading}>
      <Flex align="center" justify="space-between" gap={36}>
        <h1>Total ({total})</h1>
        <Input
          value={search}
          onChange={handleSearch}
          style={{ width: "auto", flexGrow: 1 }}
          placeholder="Searching..."
        />
        <Button type="dashed" onClick={showModal}>
          Add
        </Button>
      </Flex>
      <Row gutter={[8, 8]}>
        {categories.map((category) => (
          <Col sm={12} md={8} lg={6} xs={24}>
            <CategoryCard
              key={category.id}
              {...category}
              editCategory={editCategory}
              deleteCategory={deleteCategory}
            />
          </Col>
        ))}
      </Row>
      <Modal
        title="Category data"
        maskClosable={false}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Add category" : "Save category"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          name="category"
          autoComplete="off"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Image"
            name="image"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
};

export default CategoriesPage;
