var nodes = [
  { id: 0, label: 'You have entered a maze. Lush green hedges stretch ten feet into the air. You can go left or right.' },
  { id: 1, label: 'You come to a dead end.' },
  { id: 10, label: 'You round the corner and arrive at another split. The path continues on straight ahead, and a new path has opened to the right.' },
  { id: 11, label: 'You reach a dead end.' },
  { id: 20, label: 'You see a short nook to your left. The path appears to turn shortly ahead.' },
  { id: 21, label: 'It was just a nook. You\'ve reached a dead end.' },
  { id: 30, label: 'You arrive at the edge of the maze. Ahead is an exit. The path continues to your left.' },
  { id: 31, label: 'You reach a dead end. Why would you do this.' },
  { id: 32, label: 'You exit the maze.', success: true }
];

var edges = [
  { from: 0, to: 10, label: "Go left."},
  { from: 0, to: 1, label: "Go right."},
  { from: 10, to: 11, label: "Go straight."},
  { from: 10, to: 20, label: "Go right."},
  { from: 20, to: 21, label: "Go left."},
  { from: 20, to: 30, label: "Go straight."},
  { from: 30, to: 31, label: "Go left."},
  { from: 30, to: 32, label: "Go straight."},
];