/* ######################################################
                     API CALL 
    #########################################################*/
/* Debouncing a search input for less API calls (Wait until the user finish to type) */
export function debouncePromise(fn, time) {
  let timerId = undefined;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    return new Promise((resolve) => {
      timerId = setTimeout(() => resolve(fn(...args)), time);
    });
  };
}