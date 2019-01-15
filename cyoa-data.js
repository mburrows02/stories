var data;
initData();
function initData() {
  data = {};
  data.nodes = [
    { id: 0, label: 'The story starts here...' },
    { id: 1, label: 'And ends here. Write your own!', success: true }
  ];
  data.edges = [
    { from: 0, to: 1, label: "Continue"}
  ];
}

function findNode(nodeId) {
  return data.nodes.find(n => n.id === nodeId);
}

function findEdge(fromId, toId) {
  return data.edges.find(e => e.from === fromId && e.to === toId);
}

function findEdgesFromNode(nodeId) {
  return data.edges.filter(e => e.from === nodeId);
}

function findEdgesToNode(nodeId) {
  return data.edges.filter(e => e.to === nodeId);
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
