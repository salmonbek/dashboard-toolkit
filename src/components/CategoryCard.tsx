import { Button, Card } from "antd";

import Category from "../types/category";

const { Meta } = Card;

interface CategoryProps extends Category {
  editCategory: (id: string) => void;
  deleteCategory: (id: string) => void;
}

const CategoryCard = ({
  image,
  id,
  name,
  editCategory,
  deleteCategory,
}: CategoryProps) => {
  return (
    <Card
      hoverable
      cover={
        <img
          height="200"
          width="100%"
          style={{ objectFit: "cover" }}
          alt="example"
          src={image}
        />
      }
    >
      <Meta title={name} style={{ marginBottom: "20px" }} />
      <Button type="primary" onClick={() => editCategory(id)}>
        Edit
      </Button>
      <Button danger type="primary" onClick={() => deleteCategory(id)}>
        Delete
      </Button>
    </Card>
  );
};

export default CategoryCard;
