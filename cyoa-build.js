var build = {
  prev: []
};

function clearElement(elem) {
  while (elem.hasChildNodes()) { 
    elem.removeChild(elem.lastChild);
  }
}

function initBuildPage() {
  build.curr = 0;
  updateBuildPage();
}

function goToNode(nodeId) {
  build.prev.push(build.curr);
  build.curr = nodeId;
  updateBuildPage();
}

function goBack() {
  build.curr = build.prev.pop();
  updateBuildPage();
}

function updateBuildPage() {
  if (build.prev.length) {
    var prevNode = findNode(build.prev[build.prev.length - 1]);
    document.getElementById('prevCard').removeAttribute('hidden');
    document.getElementById('prevLabel').innerText = prevNode.label;
  } else {
    document.getElementById('prevCard').setAttribute('hidden', '');
  }
  var currNode = findNode(build.curr);
  document.getElementById('currLabel').value = currNode.label;
  var nextCardTemplate = document.getElementById('nextCardTemplate');
  var nextCol = document.getElementById('nextCol');
  clearElement(nextCol);
  var nextOptions = findEdgesFromNode(build.curr);
  nextOptions.forEach(function(edge) {
    var otherNode = findNode(edge.to);
    var card = nextCardTemplate.cloneNode(true);
    card.removeAttribute('id');
    card.removeAttribute('hidden');

    card.querySelector("[name='edgeLabel'").value = edge.label;
    card.querySelector("[name='saveEdgeLabel'").onclick = function(e) {
      saveEdgeLabel(e, edge);
    }

    card.querySelector("[name='nextLabel']").innerText = otherNode.label;
    card.querySelector("[name='selectNext']").onclick = function() {
      goToNode(otherNode.id);
    }
    nextCol.append(document.createElement('br'));
    nextCol.append(card);
  }); 
}

function saveCurrentLabel() {
  var labelText = document.getElementById('currLabel').value;
  var currNode = findNode(build.curr);
  currNode.label = labelText;
  saveToLocalStorage();
}

function saveEdgeLabel(event, edge) {
  var parent = event.target.parentNode.parentNode;
  var newLabel = parent.querySelector("[name='edgeLabel']").value;
  edge.label = newLabel;
  saveToLocalStorage();
}

function selectNewTarget() {
  document.getElementById('existingNodeSelector').setAttribute('hidden', '');
  document.getElementById('newNodeLabel').remomveAttribute('hidden');
  //document.getElementById('toNewNode').setAttribute('checked', '');
  //document.getElementById('toExistingNode').removeAttribute('checked');
}

function selectExistingTarget() {
  document.getElementById('newNodeLabel').setAttribute('hidden', '');
  document.getElementById('existingNodeSelector').removeAttribute('hidden');
  //document.getElementById('toExistingNode').setAttribute('checked', '');
  //document.getElementById('toNewNode').removeAttribute('checked');
  var select = document.getElementById('existingNodeSelector');
  clearElement(select);
  data.nodes.forEach(function(node) {
    var opt = document.createElement('option');
    opt.innerText = node.label;
    opt.value = node.id;
    select.append(opt);
  });
}

function saveNewOption() {
  var newEdgeLabel = document.getElementById('newOptionText').value;
  var destNodeType = document.querySelector('[name="toNodeType"]:checked').value;
  var destNodeId;
  if (destNodeType === 'new') {
    destNodeId = getNextId();
    var newNode = {
      id: destNodeId,
      label: document.getElementById('newNodeLabel').value
    };
    data.nodes.push(newNode);
  } else {
    destNodeId = parseInt(document.getElementById('existingNodeSelector').value);
  }
  var newEdge = {
    to: destNodeId,
    from: build.curr,
    label: newEdgeLabel
  }
  data.edges.push(newEdge);
  saveToLocalStorage();
  $('#addEdgeModal').modal('hide');
  updateBuildPage();
}