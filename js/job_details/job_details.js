import { get_parent_departmentName_byId } from "../utility/utility_functions.js";
import { api_departments_as_list, api_departments_as_tree} from "../api_get/api_paths.js";

import { convert_br_to_li_and_generateList } from "./convert_br_to_ul_list.js";

import { setting } from "../utility/global_setting.js"
import { addClassToAttributeSelector } from "../utility/utility_functions.js";
import { getItems } from "../utility/getItems.js";
let job_id = window.location.search.substring(1);

/* IMPORTANT - API node: Use id NOT internal_job_id */

async function getJob(api_path) {
  let url = api_path;
  try {
    /* First render (Get data from the API) */
    /* 1. API call */
    let res = await fetch(url); 
    /* 2. Return API data */

    $(".ui.loader").addClass("disabled");
    $("[data-loader]").remove();



    return await res.json();
  } catch (error) {
    console.log(error);
  } 
}

/* pagelist - search page */
if(window.location.host == "000688667.codepen.website"){
  //job_id = "4390126002";
}else{
}

const api_job = `https://boards-api.greenhouse.io/v1/boards/${setting.api_board_name}/jobs/${job_id}`;

/* Avoid errors: Notice office VS offices || department VS departments */
async function renderJob() {
  let job = await getJob(api_job);
  /* JOB not found */
  if(job.status == 404 || job_id == ""){
    window.location.href = "/not-found";
    /*
    const data_error = document.querySelector('[data-error]');
    document.querySelector('[data-loader]').style.display = "none";
    $("[data-job-position]").remove();
    $("[data-webflow]").remove();
    data_error.style.display = "block";
    data_error.style.opacity = "1";
    */
    /* remove the bottom sections */
    return;
  }

  let { departments } = await getItems(api_departments_as_tree);

  /* MANDATORY feilds */
  const title = job.title;
  const form_title = job.title; 
  const location = job.location.name.length > 0 ? job.location.name : "";
  const office_id = job.offices.length > 0 ? job.offices[0].id : "";
  const office_name = job.offices.length > 0 ? job.offices[0].name : "";
  /*  1. parent_department & child_department => A confusing idea because of the structure of the API
      The sub department always exist. If sub department do not have parent. The parent is null.
  */
  let parent_department =  get_parent_departmentName_byId(departments, job.departments[0].parent_id); 
  const child_department = job.departments.length > 0 ? job.departments[0].name : "";
  let seo_divider = child_department == "" ? "": ": ";
  /* SEO */
  document.title = `${title}, ${location}, ${parent_department !== "no_childs" ? parent_department + seo_divider : ""} ${child_department} • ${setting.companyName_for_seo_title}`

  /* 2. if the parent without childs ==> "he is not a parent" hide me */
  if(parent_department == "no_childs"){
    $("[data-element=parent_department]").remove();
    $("[data-element=parent_department_divider]").remove();
  }

  /* Date */
  const date = new Date(job.updated_at);
  let update_at =  getNumberOfDays(Date.now(),date); 

  if(update_at == 0){
    update_at = "1";
  }
  /* Rich text */
  const rich_text = decodeEntity(job.content);

  /* Warning: Do not change the names of this object */
  let jobs_feilds = {
    title,
    parent_department,
    child_department,
    form_title,
    office_name,
    update_at,
    rich_text,
    optional_feilds: {
      job_description: "",
      meta_skills_and_background: "",
      good_to_haves: "",
      responsibilities: "",
      benefits: ""
    }
  };

  /* metadata (Skills, Good-to-Haves and so on). Meta with a lot of null value */
  for (const [key, value] of Object.entries(jobs_feilds)) {
    /* MANDATORY feilds */    
    if(key !== "optional_feilds"){
      const node = document.querySelector(`[data-element="${key}"]`);
      if(node !== null && value !== undefined){
        node.innerHTML = value;
        node.classList.add("animate__fadeIn", "animate__animated");
      }else{
        console.error(`[${key}] data attribute - not found ==> Under webflow add this data attribute`);
      }
    }
    /* Optional feilds */
    else{
      let index = 0;
      for (const [key, value] of Object.entries(jobs_feilds.optional_feilds)) {
        const node = document.querySelector(`[data-element="${key}"]`);
        if(node !== null && value !== undefined && job.metadata[index] !== undefined){
          const name = job.metadata[index].name;
          const value = job.metadata[index].value;
          if(value !== null){
            node.classList.add("animate__fadeIn", "animate__animated");
            if(node.querySelector("[data-element=name]") !== null){node.querySelector("[data-element=name]").innerText  = name};
            if(node.querySelector("[data-element=value]") !== null){node.querySelector("[data-element=value]").innerText  = decodeEntity(value)};
            if(key !== "job_description"){          
              /* 👉️👉️ convert br text box to ul li markup 👉️👉️ */  
              convert_br_to_li_and_generateList(key); /* convert br text box to ul li markup */
            }
          }else{
            node.remove();
          }
          index++;
        }else{
          if(node !== null)node.remove();
        }
      }/* end for */
    }/* end else */
  }
  /* update the view */
  addClassToAttributeSelector("data-fade", "animate__animated");// 👉️ 
  addClassToAttributeSelector("data-fade", "animate__fadeIn");// 👉️

  let departments_Id = job.departments[0].parent_id == null ? job.departments[0].id : job.departments[0].parent_id

  /* id for the show_webflow_section_related_to_this_department function */
  parent_department = parent_department == "no_childs" ? parent_department : child_department;

  /* show Webflow div (under designer) matches to "this" job office & "this parent_department" */
  show_webflow_sections_related_to_jobs(departments_Id, "department");
  show_webflow_sections_related_to_jobs(office_id, "office");
  remove_rich_text_empty_p();
}

/* Webflow SHOW/HIDE the section below the job position*/
/* DOCS:
      HOW TO:
      1. Get the id of this office/dep by the API (Or greenhouse dashboard) Or ask the Developer
      2. Set this id for the Office/dep CMS item
      Example: Jerusalem office id is: 4015181002. 
      Webdlow => CMS => Collections => Offices collection => Create new office (or edit) => id integer feild => Paste "4015181002" => Publish 
      3. The switch-case code show the match location (Job from usa? show "usa section" && hide all other sections).

      ** Why id? Office name could change over time (From "tel aviv" to "TLV")
      */
async function show_webflow_sections_related_to_jobs(id, department){
  var sections = document.querySelectorAll(`[data-webflow=${department}]`);
  let isFound = false;

  [].forEach.call(sections, function(section) {
    const findChild = section.querySelector(`[data-${department}]`);

    // do whatever
    section.style.display = "none"; 

    /* show only the match section location */

    if(findChild !== null){
      if(id == findChild.dataset[department]){
        section.style.display = "block"; 
        section.style.opacity = "1";
        isFound = true;
      }
    }
  });//end forEach

  /* no office section found ?
        Example the location Italy added but not added to WB cms)*/  
  if(!isFound && document.querySelector('[data-office=general]') !== null){
    document.querySelector('[data-office=general]').closest("[data-webflow]").style.display = "block"; 
  }
}


/* Helper functions */
function getNumberOfDays(start, end) {
  const date1 = new Date(start);
  const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return Math.abs(diffInDays);
}

function decodeEntity(inputStr) {
  /* ## Small FIXES for the txt before decode */
  /* 1. remove double line breaks <br> */
  inputStr = inputStr.replaceAll("\n\n", "\n");
  /* 2. remove empty <p></p> */
  inputStr = inputStr.replaceAll("&lt;p&gt;&amp;nbsp;&lt;/p&gt;", '');
  /* 3. Now decode */
  var textarea = document.createElement("textarea");
  textarea.innerHTML = inputStr;
  /* 4. Return value : string */
  return textarea.value;
}

function remove_rich_text_empty_p(){
  let pElements = document.getElementsByTagName("p");

  for (let i = 0; i < pElements.length; i++) {
    if(pElements[i].innerText.length < 2){
      pElements[i].remove();
    }
  }
}

renderJob();

let backButton = document.querySelector('[data-btn-back]');

if(backButton !== null){
  
  let office = sessionStorage.getItem('office');
  let department = sessionStorage.getItem('department');
  let query = sessionStorage.getItem('query');
  
  if(query == null){
    query = "";
  }
  
  let url = `${setting.baseURL}?query=${query}&office=${office}&department=${department}`;
  
  backButton.addEventListener('click', function(event) {
    window.location.href = url;
  });

}







