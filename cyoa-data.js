initData();
function initData() {
  var data = {};
  data.nodes = [
    { id: 0, label: 'The story starts here...' },
    { id: 1, label: 'And ends here. Write your own!', success: true }
  ];
  data.edges = [
    { from: 0, to: 1, label: "Continue"}
  ];
}

function findNode(nodeId) {
  var node = data.nodes.find(n => n.id === nodeId);
  return node;
}

function findEdgesFromNode(nodeId) {
  var edgesFromNode = data.edges.filter(e => e.from === nodeId);
  return edgesFromNode;
}

function dataToString() {
  var objectData = { 'nodes': data.nodes, 'edges': data.edges};
  return JSON.stringify(objectData);
}

function initDataFromString(str) {
    var result = JSON.parse(str);
    if (result.nodes && result.edges) {
      data.nodes = result.nodes;
      data.edges = result.edges;
      return true;
    }
    return false;
}

function saveToLocalStorage() {
  localStorage.setItem("data", dataToString());
}

function upload() {
  var files = document.getElementById('fileInput').files;
  if (files.length <= 0) {
    return false;
  }

  var fr = new FileReader();

  fr.onload = function(e) {
    var fileStr = e.target.result;
    if (initDataFromString(fileStr)) {
      localStorage.setItem("data", fileStr);
    }
    document.getElementById('uploadForm').reset();
  }

  fr.readAsText(files.item(0));
}

function download() {
  var storyName = document.getElementById('storyName').value;
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(dataToString());
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", storyName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function reset() {
  localStorage.removeItem("data");
  initData();
}

function getNextId() {
  var currMaxId = data.nodes.reduce((max, current) => Math.max(max, current.id), 0);
  return currMaxId + 1;
}
