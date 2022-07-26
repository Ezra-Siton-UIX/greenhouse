/* PRE STEP: 
      List Js "valueNames" support only class selectors:
      To avoid the risk that someone will rename the class names under WB editor 
      1. Add data attribute under webflow to item X
      2. By code add class to this item.
*/

/*addClassToAttributeSelector(webflow attribute added under the designer, class added to this item by code) */
export function addClassToAttributeSelector(attributeSelector, className){
  const items = document.querySelectorAll(`[${attributeSelector}]`);
  if(items.length == 0){
    console.error(`[${attributeSelector}] selector not found in your HTML markup. Add [${attributeSelector}] attribute to your desire element`);
  }
  items.forEach((item) => {
    item.classList.add(`${className}`);
  });
}


export function get_parent_departmentName_byId(departments, parent_id){
  var found = departments.find(function(parent_element) {
    return parent_element.id == parent_id;
  });

  // console.log("result", found);
  if(found != undefined){
    /* for Data is the parent of BI */
    return found.name;
  }else{
    /* for example Operations is no parent (no childs) */
    return "no_childs";
  }

}
