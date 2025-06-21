// noteManager.js

function addAutoNote(summary) {
  const autoNote = document.createElement("div");
  autoNote.textContent = summary;
  autoNote.className = "note-entry";
  document.getElementById("noteHistory").prepend(autoNote);
}
