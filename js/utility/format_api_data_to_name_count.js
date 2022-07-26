import { setting } from "./global_setting.js";
import { jobs, meta } from "../api_get/jobs.js";
import { departments_as_tree } from "../api_get/departments_as_tree.js";
//import { departments_as_list } from "/js/api_get/departments_as_list.js";
import { offices } from "../api_get/offices.js";

/* The mission of this function */

/* 1. convert the Complex API data to this structure (For pagelists section) 
1. haifa 12 
2. jerusalem 56
{{name}} {{total jobs} {{order}}}
*/
/* 2 . Reorder mannualy the data
1. jerusalem 56 (order 1)
2. haifa 12 (order 2)
 */
/* departments => same idea */
/*
1. R & D : 26
1. Marketing : 16
*/

//let departments_list = departments_as_list.departments;

/* ############################################### Render ############################################## */
export async function reformat_api_data(departments_tree, offices, show_empty_items = true) {

  let group_office = _.groupBy(jobs, "offices[0].name"); /* group jobs by office */
  let office_values =  data_under_office(offices, group_office);/* list of objects { name, count, order } */
  let departments_values = data_under_department(departments_tree, show_empty_items);/* list of objects { name, count, order } */
  departments_values.pop();/* remove no department item */
  
  //render_items(office_values,departments_values);
  // Use of _.sortBy() method
  let office_values_sort = _.sortBy(office_values, 
                                    [function(o) { return o.list_js_order; }]);

  let departments_values_sort = _.sortBy(departments_values, 
                                         [function(o) { return o.list_js_order; }]);

  let data = {
    offices_reformat: office_values_sort, 
    departments_reformat: departments_values_sort
  };

  return data;
}

/* Trick beacuse thier is deparemtnet and sub dep */
function data_under_department(departments, show_empty_items){
  var departments_object = [];
  departments.forEach(item => {
    let total_jobs_under_parent_department = 0; 
    /* 
                                  For example for Data:
                                  count how much jobs under: 
                                  Data 
                                  Data > BI
                                  Data > Data Engineering 
                                  Data > Data Science 
                                  */
    //total_jobs_under_parent_department += item.jobs.length; /* parent count */
    if(item.children.length > 0){ /* childs count */
      item.children.forEach(department_children => {
        total_jobs_under_parent_department += department_children.jobs.length;
      });
    }else{
      total_jobs_under_parent_department += item.jobs.length;
    }

    /*## HELPER - set the order mannualy (No way to make this with some auto logic) */
    let manually_order = setDepartmentOrder__Mannualy(item.name);
    
    if(total_jobs_under_parent_department > 0){

      let item_value = item.name.replace('&', '_');
      let mode_showEmpty = true;
      let toShowEmpty = total_jobs_under_parent_department == 0 || mode_showEmpty ? true : false;
      let href = `${setting.baseURL}?query=&office=all&department=${item_value}`;


      var obj = {
        list_js_name: item.name,
        list_js_count: total_jobs_under_parent_department,
        list_js_order: manually_order,
        list_js_href: href,
        list_js_id: item.id,
        // dropdown values
        name: item.name,
        value: item_value,
        selected: ""
      };

      if(toShowEmpty){
        departments_object.push(obj);
      }
    }
  }); /* end forEach */

  function setDepartmentOrder__Mannualy(dep_name){
    var order; /* number */
    switch (dep_name) {
      case 'R&D':
        order = 1;
        break;
      case 'Creative & Design':
        order = 2;
        break;
      case 'Data':
        order = 3;
        break;
      case 'Marketing':
        order = 4;
        break;
      case 'Product Management':
        order = 5;
        break;
      case 'Business & Partnerships':
        order = 6;
        break;
      case 'IT & Security':
        order = 7;
        break;
      case 'Customer Experience':
        order = 8;
        break;
      case 'Operations':
        order = 9;
        break;
      case 'People (HR)':
      case 'People(HR)':
      case 'People':
        order = 10;
        break;
      case 'Finance ':
        order = 11;
        break;
      case 'Legal':
      case 'Finance & Legal':
        order = 12;
        break;
      default:
        order = 9999;/*no match put the item in the end of the list */
    }
    return order;
  }

  return departments_object;

}

function data_under_office(offices, group_office){
  var objects_office = [];

  for (var i = 0; i < offices.length; i++) {

    var order = setOfficeOrder__Mannualy(offices[i].name);
    var name = group_office[offices[i].name];
    if(name !== undefined){
      var count = group_office[offices[i].name].length;
      /* Mode (Show empty list -or- not) */
      let mode_showEmpty = false;
      let toShowEmpty = count > 0 || mode_showEmpty ? true : false;
      let href = `${setting.baseURL}?query=&office=${offices[i].name}&department=all`
      var obj = {
        list_js_name: offices[i].name,
        list_js_count: count,
        list_js_order: order,
        list_js_href: href,
        list_js_id: offices[i].id,
        // dropdown values
        name: offices[i].name,
        value: `${offices[i].name}`,
        selected: ""
      };
      if(toShowEmpty){
        objects_office.push(obj);
      }/* inner IF */

    }
  }// end for

  function setOfficeOrder__Mannualy(office_name){
    var order; /* number */
    switch (office_name) {
      case 'Jerusalem':
        order = 1;
        break;
      case 'Haifa':
        order = 2;
        break;
      case 'London':
        order = 3;
        break;
      case 'Shenzhen':
        order = 4;
        break;
      case 'USA':
      case 'US':
        order = 5;
        break;
      default:
        order = 9999;/*no match put the item in the end of the list */
    }
    return order;
  }

  return objects_office;
}








