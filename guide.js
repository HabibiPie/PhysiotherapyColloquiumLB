var chipBox = document.getElementById("areaChips");

for (var i = 0; i < CONFIG.areas.length; i++) {
  var area = CONFIG.areas[i];
  var chip = document.createElement("span");

  chip.className = "chip";
  chip.textContent = area.charAt(0).toUpperCase() + area.slice(1);
  chipBox.appendChild(chip);
}

function setAll(open) {
  document.querySelectorAll("details").forEach(function(d) {
    d.open = open;
  });
}

document.getElementById("openAll").onclick = function() {
  setAll(true);
};

document.getElementById("closeAll").onclick = function() {
  setAll(false);
};