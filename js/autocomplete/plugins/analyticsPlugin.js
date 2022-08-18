import {control_url_params } from "../functions/control_url_params.js";
import { setting } from "../../utility/global_setting.js";

/* AnalyticsPlugin */
export const analyticsPlugin = {
  /* The function called when Autocomplete starts (On load or on refresh) */
  subscribe({ onSelect, onActive, setQuery, state, refresh, setContext}) {
    //alert("subscribe");
    /* ######### ON LOAD FUNCTION Update data related to URL params ########## */
    refresh();

    /* #################################### 
                    onSelect (item on the list)
    ####################################### */
    onSelect(({ item, state } ) => {/* 👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈👈 */
      control_url_params(item.item.title, state.context.office, state.context.department, setting.redirect_on_select, false);
      setQuery(item.item.title);
      sessionStorage.setItem('query', item.item.title);
      refresh();
      /* if on click on search item you search (like google) use item.item.title else use feild query */
      if(setting.redirect_on_select){
        setQuery(item.item.title);
        refresh();
      }
    });
    onActive(({ item }) => {

    });
    /* ==> on submit 👈👈 related to  specific source not to the autocomplete global instance */
  },
}



