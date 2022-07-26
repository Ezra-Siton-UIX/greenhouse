import { addClassToAttributeSelector } from "../utility/utility_functions.js";
import { setting } from "../utility/global_setting.js";

export function list_meta_data(num_of_jobs, query, office, department){
  // 1. total 

  $("[counter_total]").text(num_of_jobs);

  // 2. query & office & department
  if(query == "all"){
    $("[list_meta_query]").text("");
    $("[list_meta_query]").css("display", "none");
  }else{
    $("[list_meta_query]").text(" " + query); 
    $("[list_meta_query]").css("display", "initial");
  }
  // 3. show
  $('[data-fade="data-meta-list"]').addClass('animate__animated animate__fadeIn animate__faster');

}