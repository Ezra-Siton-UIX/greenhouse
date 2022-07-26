import { api_jobs } from "./api_paths.js";
import { getItems } from "../utility/getItems.js";

export let {jobs, meta} = await getItems(api_jobs);
