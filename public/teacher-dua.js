for(const mount of document.querySelectorAll('[data-dua-tool]')){
 const labels=createDuaLabels({url:'tool:'+mount.dataset.duaTool});if(labels)mount.append(labels);
}
