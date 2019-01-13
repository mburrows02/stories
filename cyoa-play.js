function play() {
  renderNode(0);
}
function renderNode(nodeId) {
  var optionsContainer = document.getElementById('options');
  while (optionsContainer.hasChildNodes()) { 
    optionsContainer.removeChild(optionsContainer.lastChild);
  }
  var node = findNode(nodeId);
  document.getElementById('text').innerText = node.label;
  renderEdges(node);
  if (optionsContainer.children.length === 0) {
      var btn = document.createElement('button');
      btn.onclick = play;
      btn.innerText = 'Restart';
      btn.setAttribute('class', 'btn btn-primary');
      optionsContainer.append(btn);
  }
}
function renderEdges(node) {
  var optionsContainer = document.getElementById('options');
  var edgesFromNode = findEdgesFromNode(node.id);
  edgesFromNode.forEach(function(edge) {
    var btn = document.createElement('button');
    btn.onclick = function() {
      renderNode(edge.to);
    }
    btn.innerText = edge.label;
    btn.setAttribute('class', 'btn btn-primary');
    optionsContainer.append(btn);
  });
}