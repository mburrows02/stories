var flags = [];
function play() {
  flags = [];
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
    if (!edge.requires || edge.requires.value === flags.includes(edge.requires.name)) {
      var p = document.createElement('p');
      var btn = document.createElement('button');
      btn.onclick = function() {
        if (edge.set) {
          if (edge.set.value) {
            flags.push(edge.set.name);
          } else {
            flags.splice(flags.indexOf(edge.set.name), 1);
          }
        }
        renderNode(edge.to);
      }
      btn.innerText = edge.label;
      btn.setAttribute('class', 'btn btn-primary btn-block');
      p.append(btn);
      optionsContainer.append(p);
    }
  });
}