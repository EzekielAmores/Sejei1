// data.js

const teams = [
  { teamId: 1, teamName: "Team 1", score: 0, players: [] }, // Crimson Falcons
  { teamId: 2, teamName: "team 2", score: 0, players: [] }, // Azure Tigers
  { teamId: 3, teamName: "Team 3", score: 0, players: [] }, // Goldern Bears
  { teamId: 4, teamName: "Team 4", score: 0, players: [] }, // Emerald Wolves
];

const players = [
  { id: 1, name: "Alice", teamId: 1, progress: {} },
  { id: 2, name: "Ben", teamId: 1, progress: {} },
  { id: 3, name: "Clara", teamId: 1, progress: {} },
  { id: 4, name: "Daniel", teamId: 2, progress: {} },
  { id: 5, name: "Eva", teamId: 2, progress: {} },
  { id: 6, name: "Felix", teamId: 2, progress: {} },
  { id: 7, name: "Grace", teamId: 3, progress: {} },
  { id: 8, name: "Henry", teamId: 3, progress: {} },
  { id: 9, name: "Isla", teamId: 3, progress: {} },
  { id: 10, name: "Jack", teamId: 4, progress: {} },
  { id: 11, name: "Kira", teamId: 4, progress: {} },
  { id: 12, name: "Leo", teamId: 4, progress: {} },
];

// Assign players to teams
players.forEach(player => {
  const team = teams.find(t => t.teamId === player.teamId);
  if (team) team.players.push(player.id);
});

const stories = [
  {
    id: "w1d1",
    title: "The Forest of Whispers",
    content: `
      Deep in the heart of the Forest of Whispers, a group of explorers stumbled upon an ancient tree 
      that glowed softly in the moonlight. The villagers said the tree was magical—able to speak to 
      those who truly listened. One curious girl, Mira, ventured alone to hear its message. 
      When she placed her hand on the bark, she felt a warmth and heard a gentle whisper: 
      "Protect what breathes, and you shall live in peace." Mira returned home changed, forever 
      devoted to guarding nature.
    `,
    questions: [101, 102]
  },
  {
    id: "w1d2",
    title: "The Clockmaker's Secret",
    content: `
      In a sleepy town, an old clockmaker named Thorne built a clock that could reverse time. 
      But he never used it—until his apprentice, Lila, fell from a ladder. In desperation, 
      Thorne turned back time by one minute, saving her. The secret of time now burdened him, 
      and he vowed to guard it, never to change fate again unless absolutely necessary.
    `,
    questions: [103, 104]
  },
  {
    id: "w1d3",
    title: "The Floating Library",
    content: `
      Once every hundred years, a library floats above the clouds, carrying the knowledge of lost civilizations. 
      Young Theo accidentally discovered its landing site during a storm. He entered and read scrolls about extinct 
      species, old magic, and forgotten heroes. But the librarian warned: "Knowledge must not be hoarded. Share it wisely." 
      Theo became a teacher to all, preserving stories and science.
    `,
    questions: [105, 106]
  },
  {
    id: "w1d4",
    title: "The Stone That Sang",
    content: `
      In the hills of Almaron, a stone sang only when touched by someone with a pure heart. Many tried, 
      but it remained silent—until young orphan Mina visited. As she sang her lullaby, the stone joined in. 
      From that day, music flowed through the hills, healing rifts among tribes. Mina was known as the 
      Heart of Almaron.
    `,
    questions: [107, 108]
  },
  {
    id: "w1d5",
    title: "The Last Ember",
    content: `
      In a frozen kingdom, a single ember was all that remained of the sun’s warmth. The villagers guarded it 
      in a lantern atop a mountain. One day, a blizzard nearly extinguished it—until a brave boy named Niko 
      carried it to a cave and shielded it with his coat. When the storm cleared, the ember had grown into 
      a flame again, ready to light the world.
    `,
    questions: [109, 110]
  }
];

const questions = [
  {
    id: 101,
    storyId: "w1d1",
    question: "What was special about the ancient tree?",
    options: ["It had golden leaves", "It could talk", "It glowed blue", "It was a portal"],
    answer: "It could talk"
  },
  {
    id: 102,
    storyId: "w1d1",
    question: "What message did the tree whisper?",
    options: ["Protect the forest", "Guard the tree", "Protect what breathes", "Follow your heart"],
    answer: "Protect what breathes"
  },
  {
    id: 103,
    storyId: "w1d2",
    question: "Why did Thorne use the clock?",
    options: ["To stop a storm", "To save Lila", "To travel to the future", "To change his past"],
    answer: "To save Lila"
  },
  {
    id: 104,
    storyId: "w1d2",
    question: "What did Thorne decide after using the clock?",
    options: ["To destroy it", "To use it again", "To hide it", "To never change fate again"],
    answer: "To never change fate again"
  },
  {
    id: 105,
    storyId: "w1d3",
    question: "Where was the floating library?",
    options: ["Underground", "In the ocean", "Above the clouds", "In a volcano"],
    answer: "Above the clouds"
  },
  {
    id: 106,
    storyId: "w1d3",
    question: "What lesson did Theo learn?",
    options: ["To hide knowledge", "To be careful", "To share knowledge", "To guard the library"],
    answer: "To share knowledge"
  },
  {
    id: 107,
    storyId: "w1d4",
    question: "Who made the stone sing?",
    options: ["A king", "A musician", "Mina", "The tribe chief"],
    answer: "Mina"
  },
  {
    id: 108,
    storyId: "w1d4",
    question: "What effect did the singing stone have?",
    options: ["Destroyed the hills", "Healed tribal rifts", "Summoned rain", "Scared villagers"],
    answer: "Healed tribal rifts"
  },
  {
    id: 109,
    storyId: "w1d5",
    question: "What was the ember’s importance?",
    options: ["Cook food", "Light homes", "Warm the kingdom", "Melt snow"],
    answer: "Warm the kingdom"
  },
  {
    id: 110,
    storyId: "w1d5",
    question: "How did Niko protect the ember?",
    options: ["Built a wall", "Used magic", "Covered it with snow", "Shielded it with his coat"],
    answer: "Shielded it with his coat"
  }
];
