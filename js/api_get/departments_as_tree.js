import { api_departments_as_tree } from "./api_paths.js";
import { getItems } from "../utility/getItems.js";

export let departments_as_tree = await getItems(api_departments_as_tree);
