import { setting } from "../../utility/global_setting.js";
import { SEO_Meta_Data } from "./SEO_Meta_Data.js";

//import { offices_dropdown, departments_dropdown }  from "/js/render_dropdowns_and_sections.js";

export async function control_url_params(job_title = "", job_office = "all", job_department = "all", redirect = false, pushState = false){
  /* URL structure
    jobs?query="{query}"&office={office name}&department={ department name }
    */
  const url = new URL(window.location);
  // 1. Set Change URL Query
  let urlParamsInterface = {
    "query" : job_title,
    "office": job_office,
    "department": job_department
  }

  for (const property in urlParamsInterface) {
    url.searchParams.set(property, urlParamsInterface[property]);
  }

  /*We handle the dropdown values both in URL params & localStorage */

  let pushObj = {
    query: job_title,
    office: job_office,
    department: job_department.replace('&', '_').replace(' ', '')
  };

  if(location.pathname=="/"){
    window.history.pushState(pushObj, ''); /*on homepage do not change url */
  }else{
    /* ReplaceState OR pushState*/
    switch (pushState) {
      case true:
        window.history.pushState(pushObj, '', `${url.pathname}${url.search}`);
        break;
      case false:
        console.log("replaceState");
        window.history.replaceState(pushObj, '', `${url.pathname}${url.search}`);
        break;
      default:
        console.log(`Sorry, we are out of ${expr}.`);
    }

    /* 3. meta data */
    SEO_Meta_Data(job_title, job_office);

    /* 4. Focus out from the search feild */
    $('#autocomplete .aa-Input').blur();

    /* 5. Update Dropdowns */
  }

}