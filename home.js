(function() {
  document.title = CONFIG.siteTitle;

  document.getElementById("siteTitle").textContent = CONFIG.siteTitle;
  document.getElementById("siteTag").textContent = CONFIG.tagline;

  var total = QUESTIONS.length;
  var size = Math.min(CONFIG.examSize, total);
  var poolText;

  if (total >= 100) {
    poolText = "over " + (Math.floor(total / 100) * 100).toLocaleString("en-US");
  } else {
    poolText = String(total);
  }

  document.getElementById("realMinutes").textContent = CONFIG.examMinutes;
  document.getElementById("areaList").textContent = CONFIG.areas.join(", ");
  document.getElementById("poolText").textContent = poolText;
  document.getElementById("examSize").textContent = size;
  document.getElementById("mockMinutes").textContent = CONFIG.examMinutes;

  document.getElementById("creatorName").textContent = CONFIG.name;
  document.getElementById("creatorRole").textContent = CONFIG.role;
  document.getElementById("creatorFocus").textContent = CONFIG.focus;
  document.getElementById("linkedinLink").href = CONFIG.linkedin;
})();

//doantion button
function setupCoffee() {
  var coffeeModal = document.getElementById("coffeeModal");

  document.getElementById("whishNumber").textContent = CONFIG.whishNumber;

  //open popup
  document.getElementById("coffeeBtn").onclick = function() {
    coffeeModal.classList.remove("hide");
  };

  //close popup
  document.getElementById("closeBtn").onclick = function() {
    coffeeModal.classList.add("hide");
  };

  coffeeModal.onclick = function(e) {
    if (e.target === coffeeModal) {
      coffeeModal.classList.add("hide");
    }
  };

  //copy number
  document.getElementById("copyBtn").onclick = function() {
    var btn = this;

    try {
      navigator.clipboard.writeText(CONFIG.whishNumber).then(function() {
        btn.textContent = "Copied ✓";

        setTimeout(function() {
          btn.textContent = "Copy number";
        }, 1500);
      });
    } catch (e) {
      //number visisble anyway
    }
  };
}

setupCoffee();
