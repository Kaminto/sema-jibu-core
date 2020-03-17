import { AccountBalance } from "@material-ui/icons";
import { KioskList } from "./list";
import { KioskCreate } from "./create";
import { KioskEdit } from "./edit";

const kiosks = {
  name: "sema/kiosks/admin",
  options: {
    label: "Kiosks"
  },
  icon: AccountBalance,
  list: KioskList,
  create: KioskCreate,
  edit: KioskEdit
};

export default kiosks;
