var options = {
  edges: {
    font: { 
      size: 12,
      align: 'horizontal'
    },
    widthConstraint: { maximum: 90 },
    arrows: {
      to: { enabled: true }
    },
    smooth: { 
      enabled: true,
      type: 'curvedCW',
      roundness: .25
    }
  },
  nodes: {
    shape: 'box',
    margin: 10,
    widthConstraint: { maximum: 200 }
  },
  physics: { enabled: false },
  interaction: {
    keyboard: true
  }
};
var network;

function initNetwork() {
  var container = document.getElementById('map');
  network = new vis.Network(container, data, options);
  savePositions(network.getPositions());
  network.on("dragEnd", function(params) {
    var movedId = this.getNodeAt(params.pointer.DOM);
    if (movedId) {
      var movedNode = findNode(movedId);
      var nodePosition = this.getPositions(movedId);
      movedNode.x = nodePosition[movedId].x;
      movedNode.y = nodePosition[movedId].y;
      saveToLocalStorage();
    }
  });
  network.on("doubleClick", function(params) {
    if (params.nodes.length > 0) {
      initBuildPage();
      build.curr = params.nodes[0];
      $('#build-tab').tab('show');
    }
  });
}

function savePositions(positions) {
  data.nodes.forEach(function(node) {
    if (positions[node.id]) {
      node.x = positions[node.id].x;
      node.y = positions[node.id].y;
    }
  });
  saveToLocalStorage();
}
