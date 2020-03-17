import AccountCircle from "@material-ui/icons/SupervisorAccount";

import { UserList } from "./list";
import { UserCreate } from "./create";
import { UserEdit } from "./edit";

const users = {
  name: "sema/users/admin",
  options: {
    label: "Users"
  },
  icon: AccountCircle,
  list: UserList,
  create: UserCreate,
  edit: UserEdit
};

export default users;
