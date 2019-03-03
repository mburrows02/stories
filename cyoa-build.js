storiesApp.controller('BuildController', 
    ['$scope', 'story', function BuildController($scope, storyService) {
  $scope.curr = {};
  $scope.nodes = storyService.story.nodes;
  $scope.edges = storyService.story.edges;

  $scope.goToNode = function(nodeId) {
    $scope.curr = storyService.findNode(nodeId);
  };

  $scope.isNextOption = function(edge) {
    return edge.from === $scope.curr.id;
  };

  $scope.isPrevOption = function(edge) {
    return edge.to === $scope.curr.id;
  };

  $scope.saveToLocalStorage = storyService.saveToLocalStorage;
  $scope.findNode = storyService.findNode;

  $scope.deleteEdge = function(edge) {
    storyService.story.edges.splice(storyService.story.edges.indexOf(edge), 1);
    $scope.checkForFloaterNode(edge.to);
    var currNodeDeleted = $scope.checkForFloaterNode(edge.from);
    storyService.saveToLocalStorage();
    if (currNodeDeleted) {
      $scope.goToNode(0);
    }
  };

  $scope.checkForFloaterNode = function(nodeId) {
    var edgesFrom = storyService.findEdgesFromNode(nodeId).length;
    var edgesTo = storyService.findEdgesToNode(nodeId).length;
    if (edgesFrom === 0 && edgesTo === 0) {
      var node = storyService.findNode(nodeId);
      storyService.story.nodes.splice(storyService.story.nodes.indexOf(node), 1);
      return true;
    }
    return false;
  };

  $scope.moveEdge = function(edge, up) {
    var edgeIndex = storyService.story.edges.indexOf(edge);
    var inc = up ? -1 : 1;
    var moved = false;
    for (var i = edgeIndex + inc; i >= 0 && i < storyService.story.edges.length; i += inc) {
      if (storyService.story.edges[i].from === edge.from) {
        storyService.story.edges.splice(storyService.story.edges.indexOf(edge), 1);
        storyService.story.edges.splice(i, 0, edge);
        moved = true;
        break;
      }
    }
    if (moved) {
      storyService.saveToLocalStorage();
    }
  };

  $scope.saveNewOption = function() {
    var destNodeId = $scope.addOrFindNodeForNewOption();
    $scope.addEdgeForNewOption(destNodeId);
    $scope.resetNewOption();
    storyService.saveToLocalStorage();
    $('#addEdgeModal').modal('hide');
  };

  $scope.addOrFindNodeForNewOption = function() {
    var destNodeId;
    if ($scope.newOption.toNodeType === 'new') {
      destNodeId = storyService.getNextId();
      var newNode = {
        id: destNodeId,
        label: $scope.newOption.newNode.label
      };
      storyService.story.nodes.push(newNode);
    } else {
      destNodeId = parseInt($scope.newOption.toNodeId);
    }
    return destNodeId;
  };

  $scope.addEdgeForNewOption = function(destNodeId) {
    var newEdgeId = storyService.getNextEdgeId();
    var newEdge = Object.assign({id: newEdgeId, to: destNodeId, from: $scope.curr.id}, 
      $scope.newOption.option);
    storyService.story.edges.push(newEdge);
  };

  $scope.init = function() {
    var target = new URL(window.location.href).hash;
    $scope.goToNode(target ? parseInt(target.substring(1)) : 0);
    $scope.resetNewOption();
  };

  $scope.resetNewOption = function() {
    $scope.newOption = {
      toNodeType:'new',
      option: {
        set: [{}],
        requires: [{}]
      },
      newNode: {}
    };
  };

  $scope.init();

}]);