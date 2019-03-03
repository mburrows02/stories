storiesApp.controller('PlayController', 
    ['$scope', 'story', function PlayController($scope, storyService) {
  $scope.flags = [];
  $scope.node = {};
  $scope.options = [];

  $scope.play = function() {
    $scope.flags = [];
    $scope.renderNode(0);
  };

  $scope.renderNode = function(nodeId) {
    $scope.node = storyService.findNode(nodeId);
    $scope.options = storyService.findEdgesFromNode(nodeId);
  };

  $scope.filterOptions = function(opt) {
    if (opt.requires) {
      for (flag of opt.requires) {
        if (flag && flag.name && 
            (flag.value == 'true') !== $scope.flags.includes(flag.name)) {
          return false;
        }
      }
    }
    return true;
  };

  $scope.selectEdge = function(edge) {
    if (edge.set) {
      for (flag of edge.set) {
        if (flag && flag.name) {
          if (flag.value == 'true') {
            $scope.flags.push(flag.name);
          } else {
            $scope.flags.splice($scope.flags.indexOf(flag.name), 1);
          }
        }
      }
    }
    $scope.renderNode(edge.to);
  };

  $scope.play();
}]);