export let fuse_setting = {
  "keys": [/* do not add id key (1234 and 4321 return values) */
    {  
      name: 'title', 
      getFn: (job) => job.title,
      weight: 0.7
    },
    { 
      name: 'office', 
      getFn: (job) =>  job.offices.length > 0 ? job.offices[0].name : "",
      weight: 0.1
    },
    { 
      name: 'department', 
      getFn: (job) => job.departments.length > 0  ? job.departments[0].name : "",
      weight: 0.1
    }
  ],
  "threshold": 0.5, // Default: 0.6
  "shouldSort": true,
  "minMatchCharLength": 1,
  "findAllMatches": false,
  "useExtendedSearch": true
}
