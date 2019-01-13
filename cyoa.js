var container = document.getElementById('map');
$('.nav-link').on('shown.bs.tab', function (e) {
  if (e.target.id === 'visualize-tab') {
    network = new vis.Network(container, data, options);
  } else if (e.target.id === 'play-tab') {
    play();
  } else if (e.target.id === 'build-tab') {
    initBuildPage();
  }
});

var localData = localStorage.getItem("data");
if (localData && initDataFromString(localData)) {
  $('#build-tab').tab('show');
} else {
  $('#file-tab').tab('show');
}

bsCustomFileInput.init();