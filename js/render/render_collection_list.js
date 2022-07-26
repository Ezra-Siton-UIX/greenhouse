import { addClassToAttributeSelector } from "../utility/utility_functions.js";

/* On webflow Add this data attributes (list_js_name and so on...) for the list */
addClassToAttributeSelector("list_js_name", "list_js_name");// 👉️ 
addClassToAttributeSelector("list_js_count", "list_js_count");// 👉️ 
addClassToAttributeSelector("list_js_href", "list_js_href");// 👉️ 
addClassToAttributeSelector("data_list_js_dep", "data_list_js_dep");// 👉️ 
addClassToAttributeSelector("data_list_js_offices", "data_list_js_offices");// 👉️ 
addClassToAttributeSelector("list_js_id", "list_js_id");// 👉️ 

/* the list section of offices/deps */
export function render_offices_collection_list(office_values){
  //console.log("office_values office_values", office_values);// 👉️

  /* ## LIST.js options ## */
  var office_list_options = {
    listClass: "data_list_js_offices",
    valueNames: [ 
      { name: 'list_js_href', attr: 'href' },
      { name: 'list_js_id', attr: 'id' },
      'list_js_name', /* should match the data feild name */
      'list_js_count',/* should match the data feild name */
      'list_js_order'/* should match the data feild name */
    ],
  };

  /* on webflow add data-list="departments" attribute **FOR DRY move this outside of the function later */
  var $offices_list_section = document.querySelector(`[data-list="offices"]`);

  if($offices_list_section !== null){
    var officesList = new List($offices_list_section, office_list_options);
    officesList.clear();
    officesList.add(office_values);
    officesList.sort('list_js_order', { order: "asc" }); // Sorts the list by mannualy order
    $("[data-list='offices'] .list_js_href").addClass('animate__animated animate__fadeIn');
  }

}

/* the list section of offices/deps */
export function render_departments_collection_list(departments_values){
  //console.log("office_values office_values", office_values);// 👉️
  //console.log("departments_values", departments_values); // 👉️

  /* ## LIST.js options ## */
  var dep_list_options = {
    listClass: "data_list_js_dep",
    valueNames: [ 
      { name: 'list_js_href', attr: 'href' },
      { name: 'list_js_id', attr: 'id' },
      'list_js_name', /* should match the data feild name */
      'list_js_count',/* should match the data feild name */
      'list_js_order'/* should match the data feild name */
    ]
  };

  /* on webflow add data-list="departments" attribute **FOR DRY move this outside of the function later */ 
  var $departments_list_section = document.querySelector(`[data-list="departments"]`);

  if($departments_list_section !== null){
    var dept_list = new List($departments_list_section, dep_list_options, departments_values);
    dept_list.clear();
    dept_list.add(departments_values);
    dept_list.sort('list_js_order', { order: "asc" }); // Sorts the list by mannualy order

    dept_list.on('updated', function (list) {
      //every updated item take animation with their id
      list.matchingItems.forEach(function (element) {
        var id = element._values.list_js_id;
        $('#' + id).addClass('animate__animated animate__fadeIn');
      });
    });
    dept_list.update();
  }

}




