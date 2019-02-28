storiesApp.controller('VisualizeController', 
    ['$scope', 'story', function VisualizeController($scope, storyService) {
  $scope.options = {
    edges: {
      font: { size: 12, align: 'horizontal' },
      widthConstraint: { maximum: 90 },
      arrows: { to: { enabled: true } },
      smooth: { enabled: true, type: 'curvedCW', roundness: .25 }
    },
    nodes: {
      shape: 'box',
      margin: 10,
      widthConstraint: { maximum: 200 }
    },
    physics: { enabled: false },
    interaction: { keyboard: true }
  };
  $scope.network = null;

  $scope.initNetwork = function() {
    var container = document.getElementById('map');
    $scope.network = new vis.Network(container, storyService.story, $scope.options);
    $scope.savePositions($scope.network.getPositions());
    $scope.network.on("dragEnd", function(params) {
      var movedId = this.getNodeAt(params.pointer.DOM);
      if (movedId) {
        var movedNode = storyService.findNode(movedId);
        var nodePosition = this.getPositions(movedId);
        movedNode.x = nodePosition[movedId].x;
        movedNode.y = nodePosition[movedId].y;
        storyService.saveToLocalStorage();
      }
    });
    $scope.network.on("doubleClick", function(params) {
      if (params.nodes.length > 0) {
        window.location = "build.html#" + params.nodes[0];
      }
    });
  };

  $scope.savePositions = function(positions) {
    storyService.story.nodes.forEach(function(node) {
      if (positions[node.id]) {
        node.x = positions[node.id].x;
        node.y = positions[node.id].y;
      }
    });
    storyService.saveToLocalStorage();
  };

  $scope.initNetwork();
}]);