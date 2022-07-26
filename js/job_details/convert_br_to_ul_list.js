/* VERY TRICKY CODE (Used only for Greenhouse issue (No rich text custom feild - we must convert text feild with <br> to ul li list))
**NO support for rich text custom feilds !
*/



export function convert_br_to_li_and_generateList(element_name){

  function onlySpaces(str) {
    /* case when the text is only one or more empty spaces <br>    </br> */
    return /^\s*$/.test(str);
  }

  const parent = document.querySelector(`[data-element="${element_name}"] [data-element='value']`);
  if(parent == null){
    console.error(`[data-element="${element_name}"] not found on your html markup`);
    return;
  }
  const childNodes = parent.childNodes; 

  const ul = document.createElement("ul");

  [].forEach.call(childNodes, function($node) {
    var li = document.createElement("li");
    console.log($node);
    //console.log("hi", $node instanceof Text);
    if($node !== null){
      /* very tricky - sometimes between two br thier is only empty spaces <br>   <br> - 
        avoid creating li empty string for this case */
      if(!onlySpaces($node.nodeValue)){
        $node instanceof Text == true /* true it is only text without any outer tags like span or h1 */
          ? li.appendChild(document.createTextNode($node.nodeValue)) 
        : li.appendChild(document.createTextNode($node.innerText));
        ul.appendChild(li);
      }
    }
    /* clean the unwarp data (The original markup) */
    if($node.nodeType == 3){
      $node.data = ""; 
    }
    /* remove empty br */
    let br_elements = parent.getElementsByTagName('br');
    [].forEach.call(br_elements, function(br) {
      br.remove();
    });/* end forEach */

  });/* end forEach */ 
  parent.appendChild(ul);
}

