import { setting } from "../../utility/global_setting.js";

export function SEO_Meta_Data(job_title, job_office, job_department_param){
  /* change the meta title only on search results page */
  /* META TITLE */
  if(location.pathname == setting.base_url){
    document.title = `${job_title.length == 0 ? "All Jobs" : job_title} Search  ${job_office !== "all" ? "in " + job_office : ""} |  ${job_department_param == "all" ? "All Teams" : job_department_param } | ${setting.companyName_for_seo_title}`;
    //document.querySelector('meta[property="og:title"]').setAttribute("content", `${job_title} | Company Name`);
  }
}