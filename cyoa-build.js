var build = {
  prev: []
};

function clearElement(elem) {
  while (elem.hasChildNodes()) { 
    elem.removeChild(elem.lastChild);
  }
}

function initBuildPage() {
  build.prev = [];
  build.curr = 0;
}

function goToNode(nodeId) {
  if (build.curr !== undefined) {
    build.prev.push({node: build.curr, edge: findEdge(build.curr, nodeId).label});
  }
  build.curr = nodeId;
  updateBuildPage();
}

function goBack() {
  build.curr = build.prev.pop().node;
  updateBuildPage();
}

function updateBuildPage() {
  if (build.curr === undefined) {
    initBuildPage();
  }
  if (build.prev.length) {
    var prev = build.prev[build.prev.length - 1];
    var prevNode = findNode(prev.node);
    document.getElementById('prevCard').removeAttribute('hidden');
    document.getElementById('prevOption').innerText = prev.edge;
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
  nextOptions.forEach(addOptionCard);
  if (nextOptions.length > 0) {
    var upButtons = nextCol.querySelectorAll("[name='moveUpButton']");
    upButtons.item(0).setAttribute("hidden", "");
    var downButtons = nextCol.querySelectorAll("[name='moveDownButton']");
    downButtons.item(downButtons.length - 1).setAttribute("hidden", "");
  }
  var select = document.getElementById('existingNodeSelector');
  clearElement(select);
  data.nodes.forEach(function(node) {
    var opt = document.createElement('option');
    opt.innerText = node.label;
    opt.value = node.id;
    select.append(opt);
  });
}

function addOptionCard(edge) {
    var otherNode = findNode(edge.to);
    var card = nextCardTemplate.cloneNode(true);
    card.removeAttribute('id');
    card.removeAttribute('hidden');

    card.querySelectorAll('input').forEach(function(input) {
      input.onblur = e => saveEdge(e, edge);
    });
    card.querySelectorAll('select').forEach(function(input) {
      input.onchange = e => saveEdge(e, edge);
    });
    card.querySelector("[name='edgeLabel'").value = edge.label;
    card.querySelector("[name='edgeSetFlag'").value = edge.set ? edge.set.name : '';
    card.querySelector("[name='edgeSetFlagValue'").value = edge.set ? '' + edge.set.value : null;
    card.querySelector("[name='edgeRequiresFlag'").value = edge.requires ? edge.requires.name : '';
    card.querySelector("[name='edgeRequiresFlagValue'").value = edge.requires ? '' + edge.requires.value : null;

    card.querySelector("[name='nextLabel']").innerText = otherNode.label;
    card.querySelector("[name='selectNext']").onclick = () => goToNode(otherNode.id);
    card.querySelector("[name='moveUpButton'").onclick = () => moveEdge(edge, true);
    card.querySelector("[name='moveDownButton'").onclick = () => moveEdge(edge, false);
    card.querySelector("[name='deleteButton'").onclick = () => deleteEdge(edge);
    nextCol.append(document.createElement('br'));
    nextCol.append(card);
}

/** EDIT FUNCTIONS **/

function saveCurrentLabel() {
  var labelText = document.getElementById('currLabel').value;
  var currNode = findNode(build.curr);
  currNode.label = labelText;
  saveToLocalStorage();
  updateBuildPage();
}

function saveEdge(event, edge) {
  var parent = event.target.closest('.card');
  edge.label = parent.querySelector("[name='edgeLabel']").value;
  var setName = parent.querySelector("[name='edgeSetFlag'").value;
  var setValue = parent.querySelector("[name='edgeSetFlagValue'").value === 'true';
  edge.set = setName ? { name: setName, value: setValue } : null;
  var requiresName = parent.querySelector("[name='edgeRequiresFlag'").value;
  var requiresValue = parent.querySelector("[name='edgeRequiresFlagValue'").value === 'true';
  edge.requires = requiresName ? { name: requiresName, value: requiresValue } : null;
  saveToLocalStorage();
}

function deleteEdge(edge) {
  var destNode = findNode(edge.to);
  data.edges.splice(data.edges.indexOf(edge), 1);
  var edgesFrom = findEdgesFromNode(destNode.id).length;
  var edgesTo = findEdgesToNode(destNode.id).length;
  if (edgesFrom === 0 && edgesTo === 0) {
    data.nodes.splice(data.nodes.indexOf(destNode), 1);
  }
  saveToLocalStorage();
  updateBuildPage();
}

function moveEdge(edge, up) {
  var edgeIndex = data.edges.indexOf(edge);
  var inc = up ? -1 : 1;
  var moved = false;
  for (var i = edgeIndex + inc; i >= 0 && i < data.edges.length; i += inc) {
    if (data.edges[i].from === edge.from) {
      data.edges.splice(data.edges.indexOf(edge), 1);
      data.edges.splice(i, 0, edge);
      moved = true;
      break;
    }
  }
  if (moved) {
    saveToLocalStorage();
    updateBuildPage();
  }
}

/** ADD FUNCTIONS **/

function selectNewTarget() {
  document.getElementById('existingNodeSelector').setAttribute('hidden', '');
  document.getElementById('newNodeLabel').removeAttribute('hidden');
}

function selectExistingTarget() {
  document.getElementById('newNodeLabel').setAttribute('hidden', '');
  document.getElementById('existingNodeSelector').removeAttribute('hidden');
}

function saveNewOption() {
  var destNodeId = addOrFindNodeForNewOption();
  addEdgeForNewOption(destNodeId);
  saveToLocalStorage();
  [].forEach.call(document.getElementsByClassName('new-option-field'), e => e.value = '');
  $('#addEdgeModal').modal('hide');
  updateBuildPage();
}

function addOrFindNodeForNewOption() {
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
  return destNodeId;
}

function addEdgeForNewOption(destNodeId) {
  var newEdgeLabel = document.getElementById('newOptionText').value;
  var newEdge = {
    to: destNodeId,
    from: build.curr,
    label: newEdgeLabel
  }
  var setFlag = document.getElementById('newOptionFlag').value;
  if (setFlag) {
    var setFlagValue = document.getElementById('newOptionFlagValue').value;
    newEdge.set = { name: setFlag, value: setFlagValue==='true' };
  }
  var requiresFlag = document.getElementById('newOptionRequires').value;
  if (requiresFlag) {
    var requiresFlagValue = document.getElementById('newOptionRequiresValue').value;
    newEdge.requires = { name: requiresFlag, value: requiresFlagValue==='true' };
  }
  data.edges.push(newEdge);
}