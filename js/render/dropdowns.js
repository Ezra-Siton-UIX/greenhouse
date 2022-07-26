/* ## RENDER DROPDOWNS ## */
export async function render_dropdown(data, $node, all_option_text, urlParamValue){
  data.unshift({name: all_option_text, value : "all"})
  let selected_index;

  let filter_data = _.filter(data, function(i, index){
    if(i.value === urlParamValue){
      selected_index = index;
    }
    return i.value === urlParamValue;
  });

  /* for example someone write department=bla_bla_no or department=""*/
  if(selected_index == undefined){
    console.error(`No such ${urlParamValue} Department/Office set the value to all`)
    data[0].selected = true;
  }else{
    data[selected_index].selected = true;
  }
  $node
    .dropdown({
    values: data, /* [array of objects] */
    direction: "downward"
  })
  ;

  //$node.dropdown('set selected', "Data", true);
  $('[data-fade="dropdown"]').addClass('animate__animated animate__fadeIn animate__faster');

  $node.removeClass("loading");
}