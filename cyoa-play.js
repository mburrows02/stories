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
    return !opt.requires || 
        (opt.requires.value == 'true') === $scope.flags.includes(opt.requires.name);
  };

  $scope.selectEdge = function(edge) {
    if (edge.set) {
      if (edge.set.value == 'true') {
        $scope.flags.push(edge.set.name);
      } else {
        $scope.flags.splice($scope.flags.indexOf(edge.set.name), 1);
      }
    }
    $scope.renderNode(edge.to);
  };

  $scope.play();
}]);