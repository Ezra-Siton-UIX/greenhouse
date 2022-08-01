const { autocomplete } = window['@algolia/autocomplete-js'];

import {debouncePromise} from "../functions/debouncePromise.js";
import {render_list } from "../../render/job_list.js";
import { analyticsPlugin, control_url_params } from "../index.js";
import { setting } from "../../utility/global_setting.js";
import { getItems } from "../../utility/getItems.js";
import { get_parent_departmentName_byId } from "../../utility/utility_functions.js";
import { jobs, meta } from "../../api_get/jobs.js";
import { departments_as_tree } from "../../api_get/departments_as_tree.js";
import { departments_as_list } from "../../api_get/departments_as_list.js";
import { offices } from "../../api_get/offices.js";


export let departments_tree = departments_as_tree.departments;
export let departments_list = departments_as_list.departments;
export let meta_data = meta;

/* API DOCS */
/* https://developers.greenhouse.io/job-board.html */

/* control  search operations usage, wait until the user type before triggering a search request 
  ***instead of each keystroke
  */
const debounced = debouncePromise((items) => Promise.resolve(items), 50);

$('[data-fade="autocomplete"]').addClass('animate__animated animate__fadeIn animate__faster');
$('[data-fade="search"]').addClass('animate__animated animate__fadeIn animate__faster');

/* ############### GREENHOUSE API PLUGIN ############### */
export function createGreenhouseJobsPlugin(options) {
  return {
    /* subscribe works only for onSelect and onActive (lifecycle) ==> onReset & onSubmit handle inside the greenhouse plugin */
    getSources({ query, state }) {
      return debounced([
        {
          //{jobs, meta} = options;
          sourceId: 'greenhouse',
          getItems({ query, state }) {
            //return jobs;
            let filter_data;
            let all = state.context.all_data_filter;

            /* filter case 1 of 4 - only office set */
            if(state.context.office !== all && state.context.department == all){
              filter_data = _.filter(jobs, function(job){
                if(job.offices.length > 0){
                  return job.offices[0].name.toLowerCase().replace('&', '_') === state.context.office.toLowerCase().replace('&', '_');
                }
              });
            }/* end if */

            /* filter case 2 of 4 - only department set */
            if(state.context.department !== all && state.context.office == all){
              filter_data = _.filter(jobs, function(job){
                if(job.departments.length > 0){
                  let value = get_parent_departmentName_byId(options.departments_list, job.departments[0].parent_id); 
                  /* if no child dep - the parent is null so compare (very confusing API idea) */
                  return value == "no_childs" ? job.departments[0].name.toLowerCase().replace('&', '_') == state.context.department.replace('&', '_').toLowerCase() : value.toLowerCase().replace('&', '_') === state.context.department.replace('&', '_').toLowerCase();
                }
              });
            }/* end if */

            /* filter case 3 of 4 - both office & department set */
            if(state.context.office !== all && state.context.department !== all){
              filter_data = _.filter(jobs, function(job){
                let value = get_parent_departmentName_byId(options.departments_list, job.departments[0].parent_id);   
                /* if no child dep - the parent is null so compare (very confusing API idea) */
                let step1, step2 = false;
                /* match department */
                if(value == "no_childs" ? job.departments[0].name.replace('&', '_').toLowerCase() == state.context.department.toLowerCase().replace('&', '_') : value.toLowerCase().replace('&', '_') === state.context.department.replace('&', '_').toLowerCase()){
                  step1 = true;
                }
                /* match office */
                if(job.offices.length > 0){
                  if(job.offices[0].name.toLowerCase() === state.context.office.toLowerCase()){
                    step2 = true
                  }  
                }
                return step1 && step2;
              });
            }
            /* filter case 4 of 4 - ALL => none is set */
            if(state.context.office == all && state.context.department == all){
              filter_data = _.filter(jobs, function(o) { return true; });
            }

            /* if no query (empty Search bar) */
            if (!query || query == "") {
              query = "!return_all"; /* return all by: "!" (extended search feature) Items that do not include return_all */
            }

            /* STEP 2 Search inside the Filter Data */
            const fuse = new Fuse(filter_data, options.fuse_setting)

            // 3. Now Search
            const fuse_data =  fuse.search(query);

            /* 4. Search panel - Remove duplicate jobs by title (For example "BI - haifa & BI - London" should be BI only) */
            let uniq_jobs_by_title = _.uniqBy(fuse_data, job => { 
              //console.log(job.item.title);
              let job_title_toLowerCase_remove_spaces = job.item.title.toLowerCase().replace(/ /g, '');
              /* For example remove: "BI dev" VS "bi  dev"; */
              return job_title_toLowerCase_remove_spaces;
            });

            // 5. Now render the list (On search page only) 
            if(location.pathname !== "/"){
              render_list(fuse_data, query, state.context.office, state.context.department) ;
            }

            // 6. Now display this items under search panel (Limit by slice)
            if(query.length > 0){
              return _.slice(uniq_jobs_by_title, 0, 8);
            }

          },/* ### End GetItems() */  
          /* templates */
          templates: {
            /*
                header({ items, html }) {
                  if (items.length === 0) {
                    return null;
                  }
                  return html`<span class="aa-SourceHeaderTitle">Jobs</span>
                                  <div class="aa-SourceHeaderLine" />`;
                },*/
            item({ item, html }) {          
              return html `<li class="aa-Item" id="autocomplete-0-item-1" role="option" aria-selected="false">
                          <div class="aa-ItemWrapper">
                            <div class="aa-ItemContent">
                              <div class="aa-ItemIcon aa-ItemIcon--noBorder"
                              style="margin: 0px; position: relative; top: 0px;" 
                              >
                              <svg 
                              style="position: relative; top: 0px;"
                              viewBox="0 0 24 24" fill="#c7c7c7"

                              ><path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path></svg>
                              </div>
                              <div class="aa-ItemContentBody">
                                <div class="aa-ItemContentTitle">
                                  ${item.item !== undefined  ? item.item.title : ""}
                                  <span class="aa-ItemContentSubtitle aa-ItemContentSubtitle--inline" style="display:none">
                                    <span class="aa-ItemContentSubtitleIcon"></span>
                                    <span class="aa-ItemContentSubtitleCategory"> 
                                    ${item.item !== undefined && item.item.departments.length > 0 ? " " + " in "+ item.item.departments[0].name : "" }
                                    </span>
                                  </span>

                                   <span class="aa-ItemContentSubtitle aa-ItemContentSubtitle--inline" style="display:none">
                                    <span class="aa-ItemContentSubtitleIcon"></span>  
                                    <span class="aa-ItemContentSubtitleCategory"> 
                                      ${item.item !== undefined && item.item.offices.length > 0 ? " " + "in " + item.item.offices[0].name : "" }
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>`; /* inner item beacuse this is the way fuse.js return the data */
            },
            noResults({state, html}) {
              //return html`No results found ${query !== "" ? "for " : "" + query}<b>${query == "" ? "change search filters" : query}</b>`;
              return html`<span>No results found</span>`;
            },
          },
        },
      ]);
    },/* end getSources */   
    /* ### Plugin Scope Events ### */
    /* ################################ 
                            1. onReset
                ################################### */
    onReset: function ({setQuery,setIsOpen, item, state, refresh}) {
      control_url_params("", state.context.office, state.context.department, setting.redirect_on_select);
    },
    /* ################################ 
                            2. onSubmit (the search form feild)
    ################################### */
    onSubmit({ item, state, setIsOpen, refresh }){ /* works only on Form submit (click enter or search icon) */

      /* 👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈 */

      control_url_params(state.query, state.context.office, state.context.department, setting.redirect_on_select, false);
      
      //control_url_params(state.query, state.context.office, state.context.department, redirect_on_select);
      if(location.pathname !== setting.baseURL){
        /* on homepage we dont use the state - its "all" by deafult + we do not use URL params */

        /* if 🏠 Redirect to search result */
        const url = new URL(window.location); 

        let office = sessionStorage.getItem('office') == null ? "all" : sessionStorage.getItem('office');
        let department = sessionStorage.getItem('department') == null ? "all" : sessionStorage.getItem('department')
        let url_redirect = `${setting.baseURL}?query=${state.query}&office=${office}&department=${department}`;
        /* js redirect */
        window.location.href = url_redirect;

      }else{
        setIsOpen(false);
        control_url_params(state.query, state.context.office, state.context.department, false, false);
        refresh();
      }
    },
  };
}/* end gitHubReposPlugin_API*/

