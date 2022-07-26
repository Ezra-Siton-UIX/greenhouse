import { api_departments_as_list } from "./api_paths.js";
import { getItems } from "../utility/getItems.js";

export let departments_as_list = await getItems(api_departments_as_list);
