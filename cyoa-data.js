storiesApp.controller('FileController', 
    ['$scope', 'story', function FileController($scope, storyService) {
  $scope.storyName;

  $scope.upload = function() {
    var filesInput = document.getElementById('fileInput');
    var files = filesInput.files;
    if (files.length <= 0) {
      return false;
    }

    var fr = new FileReader();
    fr.onload = function(e) {
      var fileStr = e.target.result;
      if (storyService.initDataFromString(fileStr)) {
        localStorage.setItem("data", fileStr);
      }
      filesInput.value = null;
    };

    fr.readAsText(files.item(0));
  };

  $scope.download = function() {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(storyService.dataToString());
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", $scope.storyName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  $scope.reset = storyService.reset;
  
  bsCustomFileInput.init();
}]);