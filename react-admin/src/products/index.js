import { Book } from "@material-ui/icons";
import { CreateProduct } from "./create";
import { EditProduct } from "./edit";
import { ListProducts } from "./list";

const products = {
  name: "sema/products/admin",
  options: {
    label: "Products"
  },
  icon: Book,
  create: CreateProduct,
  edit: EditProduct,
  list: ListProducts,
};

export default products;
