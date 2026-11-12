const evaluationFunctionNames={self:'Autoevaluación',meta:'Metacognición',feedback:'Retroalimentación docente'};
function createEvaluationClassification(resource){
 if(!resource.evaluationFunctions?.length)return null;
 const box=document.createElement('div');box.className='evaluation-functions';
 const label=document.createElement('span');label.className='evaluation-caption';label.textContent='Función del ticket';box.append(label);
 const tags=document.createElement('div');tags.className='evaluation-function-tags';
 for(const id of resource.evaluationFunctions){const tag=document.createElement('span');tag.textContent=evaluationFunctionNames[id];tags.append(tag);}
 const detail=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Por qué esta clasificación';const text=document.createElement('p');text.textContent=resource.evaluationRationale;detail.append(summary,text);box.append(tags,detail);return box;
}
