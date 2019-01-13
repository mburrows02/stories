var options = {
  edges: {
    font: { size: 12 },
    widthConstraint: { maximum: 90 },
    arrows: {
      to: { enabled: true }
    },
    smooth: { enabled: false }
  },
  nodes: {
    shape: 'box',
    margin: 10,
    widthConstraint: { maximum: 200 }
  },
  physics: { enabled: false },
  layout: {
      hierarchical: {
          direction: 'LR',
          levelSeparation: 300,
          edgeMinimization: false
      }
  },
  interaction: {
    keyboard: true
  }
};
var network;