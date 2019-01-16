var options = {
  edges: {
    font: { 
      size: 12,
      align: 'horizontal'
    },
    widthConstraint: { maximum: 90 },
    arrows: {
      to: { enabled: true }
    },
    smooth: { 
      enabled: true,
      type: 'curvedCW',
      roundness: .25
    }
  },
  nodes: {
    shape: 'box',
    margin: 10,
    widthConstraint: { maximum: 200 }
  },
  physics: { enabled: false },
  interaction: {
    keyboard: true
  }
};
var network;