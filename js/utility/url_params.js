var $URL_Object = new URL(window.location).searchParams;
export var job_office_param = $URL_Object.get('office') == null ? "all" : $URL_Object.get('office');
export var job_department_param = $URL_Object.get('department') == null ? "all" : $URL_Object.get('department');
export var job_title_param = $URL_Object.get('query') == null ? "" : $URL_Object.get('query'); 