import { api_offices } from "./api_paths.js";
import { getItems } from "../utility/getItems.js";

export let { offices } = await getItems(api_offices);