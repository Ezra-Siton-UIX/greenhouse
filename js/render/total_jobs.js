export function render_total_jobs(total_jobs){
  /* update count of jobs for data X and Node Y */
  let total_node = document.querySelectorAll(`[data-total-element]`);
  [].forEach.call(total_node, function(div) {
    // do whatever
    div.textContent = total_jobs;
  });

}
