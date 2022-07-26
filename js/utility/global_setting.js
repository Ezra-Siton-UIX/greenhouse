/*https://boards-api.greenhouse.io/v1/boards/lightricks/jobs/4319131002*/
let baseURL;
let jobPositionUrl;

/* pagelist - search page */
if(window.location.host == "000688667.codepen.website"){
  baseURL = "careers.html";
}else{
  baseURL = "careers";
}
/* collection item - job page */
if(window.location.host == "000688667.codepen.website"){
  jobPositionUrl = "position.html";
}else{
  jobPositionUrl = "position";
}

export const setting = {
  companyName_for_seo_title: "Lightricks Careers",
  api_board_name: "lightricks",
  baseURL,/* 👈👈👈 */
  jobPositionUrl,/* 👈👈👈 */
  redirect_on_select: false,/* 👈👈👈 */
  all_Offices_String: "All Locations",
  all_Departments_String: "All Teams"
}