var storiesApp = angular.module('storiesApp', []);

storiesApp.factory('story', function() {
  var storyService = {};
  storyService.story = {};
  storyService.initStory = function() {
    var localData = localStorage.getItem("data");
    var hasStory = localData && storyService.initDataFromString(localData);
    if (!hasStory) {
      storyService.story = {};
      storyService.story.nodes = [
        { id: 0, label: 'The story starts here...', conditionalText: [{}] },
        { id: 1, label: 'And ends here. Write your own!', conditionalText: [{}] }
      ];
      storyService.story.edges = [
        { id: 0, from: 0, to: 1, label: "Continue", set: [{}], requires: [{}]}
      ];
    }
  };

  storyService.findNode = function(nodeId) {
    return storyService.story.nodes.find(n => n.id === nodeId);
  };

  storyService.findEdge = function(fromId, toId) {
    return storyService.story.edges.find(e => e.from === fromId && e.to === toId);
  };

  storyService.findEdgesFromNode = function(nodeId) {
    return storyService.story.edges.filter(e => e.from === nodeId);
  };

  storyService.findEdgesToNode = function(nodeId) {
    return storyService.story.edges.filter(e => e.to === nodeId);
  };

  storyService.reset = function() {
    localStorage.removeItem("data");
    storyService.initStory();
  };

  storyService.getNextId = function() {
    var currMaxId = storyService.story.nodes.reduce(
      (max, current) => Math.max(max, current.id), 0);
    return currMaxId + 1;
  };

  storyService.getNextEdgeId = function() {
    var currMaxId = storyService.story.edges.reduce(
      (max, current) => Math.max(max, current.id), 0);
    return currMaxId + 1;
  }

  storyService.dataToString = function() {
    return JSON.stringify(storyService.story);
  };

  storyService.initDataFromString = function(str) {
      var result = JSON.parse(str);
      if (result.nodes && result.edges) {
        storyService.story.nodes = result.nodes;
        storyService.story.edges = result.edges;
        return true;
      }
      return false;
  };

  storyService.saveToLocalStorage = function() {
    localStorage.setItem("data", storyService.dataToString());
  };

  storyService.initStory();

  return storyService;
});