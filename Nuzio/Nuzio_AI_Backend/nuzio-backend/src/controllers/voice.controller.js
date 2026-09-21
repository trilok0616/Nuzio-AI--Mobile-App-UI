const voices = [
  {
    id: "aria",
    name: "Aria",
    language: "English",
    locale: "en-GB",
    accent: "British",
    badge: "EN"
  },
  {
    id: "kai",
    name: "Kai",
    language: "English",
    locale: "en-US",
    accent: "American",
    badge: "EN"
  },
  {
    id: "meera",
    name: "Meera",
    language: "Hindi",
    locale: "hi-IN",
    accent: "Indian",
    badge: "HI"
  }
];

async function listVoices(_req, res) {
  res.json({ success: true, voices });
}

module.exports = { listVoices };
