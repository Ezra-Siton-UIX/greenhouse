/* https://github.com/marcuswestin/store.js/ */

/* Handle the data return when user type on search */
export async function getItems(api_path) {
  let url = api_path;
  try {
    /* First render (Get data from the API) */
    if(sessionStorage.getItem(api_path) == null){
      console.log("get items server", api_path)
      /* 1. API call */
      let res = await fetch(url); 
      /* 2. Save the return data in localStorage */
      let my_json = await res.clone().json();
      sessionStorage.setItem(api_path, JSON.stringify(my_json));

      /* 3. Return API data */
      return await res.json();
    }{/* Second render (Get data from localStorage (Save API call)) */
      //console.log("no need to fetch get the data from local storage");
      let val = await sessionStorage.getItem(api_path);
      var obj = JSON.parse(val)
      console.log("get items sessionStorage", api_path)
      return await obj;               
    }
  } catch (error) {
    console.log(error);
  } 
}


