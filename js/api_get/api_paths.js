import { setting } from "../utility/global_setting.js";

export const api_jobs = `https://api.greenhouse.io/v1/boards/${setting.api_board_name}/jobs?content=true`;
export const api_departments_as_tree = `https://boards-api.greenhouse.io/v1/boards/${setting.api_board_name}/departments?render_as=tree`;
export const api_departments_as_list = `https://boards-api.greenhouse.io/v1/boards/${setting.api_board_name}/departments?render_as=list`;
export const api_offices = `https://boards-api.greenhouse.io/v1/boards/${setting.api_board_name}/offices`;