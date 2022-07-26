const { autocomplete } = window['@algolia/autocomplete-js'];
import { setting } from "../js/utility/global_setting.js";
import { fuse_setting } from "../js/autocomplete/fuse-js/setting.js";
import { job_office_param, job_department_param, job_title_param } from "../js/utility/url_params.js";
import { reformat_api_data } from "../js/utility/format_api_data_to_name_count.js";
import { addClassToAttributeSelector } from "../js/utility/utility_functions.js";
import { createGreenhouseJobsPlugin, departments_list } from "../js/autocomplete/plugins/createGreenhouseJobsPlugin.js";
import { analyticsPlugin, control_url_params } from "../js/autocomplete/index.js";
import { jobs, meta } from "../js/api_get/jobs.js";
import { offices } from "../js/api_get/offices.js";
import { departments_as_tree } from "../js/api_get/departments_as_tree.js";
import { render_total_jobs } from "../js/render/total_jobs.js";
import { render_dropdown } from "../js/render/dropdowns.js";
import {render_offices_collection_list, render_departments_collection_list} from "../js/render/render_collection_list.js";


function onLoad(){
  /* deafult to "all" homepage on load */
  if(location.pathname =="/"){
    /* localStorage **/
    sessionStorage.setItem('office', "all");
    sessionStorage.setItem('department', "all");
    sessionStorage.setItem('query', "");
  }
  addClassToAttributeSelector("animate__animated", "animate__animated");// 👉️ 
  $(".animate__animated").addClass('animate__animated', 'animate__fadeIn animate__faster');// 👉️ 
  
  

}


/* reformat as: name, total jobs => exmaple "title: Haifa, total jobs: 12"*/
const greenhouse_plugin = createGreenhouseJobsPlugin({
  departments_list,
  jobs,
  meta,
  fuse_setting
});

/* ############### 👨👨👨👨 INSTALL AUTOCOMPLETE ############### */
const {
  getInputProps, setActiveItemId,setQuery,setCollections,setIsOpen,setStatus,setContext,refresh,update
} = autocomplete({
  container: '#autocomplete',
  placeholder: 'Position title',
  openOnFocus: true,
  debug: false,
  //defaultActiveItemId: 0,
  detachedMediaQuery: 'none',
  plugins: [greenhouse_plugin, analyticsPlugin],
  initialState: {
    // This uses the `search` query parameter as the initial query
    query: job_title_param,
    context: {   
      "all_data_filter": "all",
      "office": job_office_param,
      "department": job_department_param
    }
  },
  onStateChange({ state }) {
    //console.log("onStateChange onStateChange onStateChange onStateChange onStateChange", state);
  },
});

$(".ui.loader").addClass("disabled");
$("[data-loader]").remove();
console.log("loader hide");

window.addEventListener('popstate', (event) => {
  let $URL_Object = new URL(window.location).searchParams;
  let job_office_param = $URL_Object.get('office') == null ? "all" : $URL_Object.get('office');
  let job_department_param = $URL_Object.get('department') == null ? "all" : $URL_Object.get('department');
  var job_title = $URL_Object.get("query") == null ? "" : $URL_Object.get("query"); 

  $('[data-ui-dropdown="offices"] .text')
    .text(job_office_param == "all" ? setting.all_Offices_String : job_office_param.replace('_', '&'));

  $('[data-ui-dropdown="departments"] .text')
    .text(job_department_param == "all" ? setting.all_Departments_String :job_department_param.replace('_', '&')); 

  if(event.state == null){
    setQuery(job_title);
  }else{
    setQuery(event.state.query);    
  }
  update();
});

/* RENDER only for this demo */
$( "#search" ).on( "click", function() {  
  $( ".aa-SubmitButton" ).click();
});


/* #############################################################################################
🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒 RENDER Elements  🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒🧒
################################################################################################ */

let $node_Offices = $(`[data-ui-dropdown="offices"]`);
let $node_Departments = $(`[data-ui-dropdown="departments"]`);

let {departments_reformat, offices_reformat} = await reformat_api_data(departments_as_tree.departments, offices);

render_total_jobs(meta.total);

/* 1 of 2 - collection lists */
render_offices_collection_list(offices_reformat);
render_departments_collection_list(departments_reformat);

/* 2 of 2 - dropdown lists */
render_dropdown(departments_reformat, $node_Departments, setting.all_Departments_String, job_department_param);
render_dropdown(offices_reformat, $node_Offices, setting.all_Offices_String, job_office_param);

/* dropdown On Change */
let offices_dropdown = $(`[data-ui-dropdown="offices"]`);
let departments_dropdown = $(`[data-ui-dropdown="departments"]`);

offices_dropdown.dropdown('setting', 'onChange', function(value, text, $selectedItem){
  update_dropdown_Context(value);
});/* end onChange offices_dropdown*/

departments_dropdown.dropdown('setting', 'onChange', function(value, text, $selectedItem){
  update_dropdown_Context(value);
});/* end onChange departments_dropdown */


/* ############# Dropdown onChange function #############*/
function update_dropdown_Context(value){
  let v_query = document.getElementById("autocomplete-0-input").value;  
  let office_dropdown_value = offices_dropdown.dropdown("get value");
  let departments_dropdown_value = departments_dropdown.dropdown("get value");

  /* localStorage - use only to create the current url string from homepage to => (search page)
  **onLoad of homepage the value returns to all 
  **/
  sessionStorage.setItem('office', office_dropdown_value);
  sessionStorage.setItem('department', departments_dropdown_value);
  sessionStorage.setItem('query', v_query);

  setContext(
    {   
      "office": office_dropdown_value ,
      "department": departments_dropdown_value
    }
  )
  setQuery(v_query);

  /* urlParams **/
  control_url_params(v_query, office_dropdown_value, departments_dropdown_value, false, false);

  setTimeout(function(){ 
    refresh(); // Runs AnalyticsPlugin.js
  }, 100);//delay before update
}

onLoad();
