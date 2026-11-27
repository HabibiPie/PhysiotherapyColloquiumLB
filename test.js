var examQs = shuffle(QUESTIONS).slice(0, Math.min(CONFIG.examSize, QUESTIONS.length));
var endAt = Date.now() + CONFIG.examMinutes * 60000;
var timerId = null;
var inExam = true;

var quizArea = document.getElementById("quizBody");
var clockLabel = document.getElementById("clock");
var answeredLabel = document.getElementById("answered");

document.title = "Mock Test – " + CONFIG.siteTitle;

function makeNotice(text) {
  var notice = document.createElement("div");

  notice.className = "notice";
  notice.textContent = text;

  return notice;
}

//show questions
function renderExam() {
  if (!examQs.length) {
    quizArea.appendChild(makeNotice("No questions yet. Add them in questions.js."));

    clockLabel.classList.add("hide");
    answeredLabel.classList.add("hide");

    inExam = false;
    return;
  }

  if (USING_SAMPLE_QUESTIONS) {
    quizArea.appendChild(makeNotice("Sample questions only. The full question pool is coming soon."));
  }

  var form = document.createElement("form");
  form.id = "form";
  form.onsubmit = function() {
    return false;
  };

  for (var i = 0; i < examQs.length; i++) {
    form.appendChild(buildQuestionCard(examQs[i], i));
  }

  var submitBtn = document.createElement("button");
  submitBtn.className = "btn";
  submitBtn.id = "submitBtn";
  submitBtn.textContent = "Submit answers";

  quizArea.appendChild(form);
  quizArea.appendChild(submitBtn);

  form.onchange = updateAnswered;

  submitBtn.onclick = function() {
    var left = examQs.length - answeredCount();

    if (left && !confirm(left + " question(s) not answered. Submit anyway?")) {
      return;
    }

    finishExam();
  };

  updateAnswered();
  tick();

  timerId = setInterval(tick, 500);
}

function buildQuestionCard(question, index) {
  var card = document.createElement("div");
  card.className = "card";

  var title = document.createElement("p");
  title.className = "q";
  title.textContent = (index + 1) + ". " + question.q;
  card.appendChild(title);

  for (var j = 0; j < question.o.length; j++) {
    var label = document.createElement("label");
    label.className = "opt";

    var radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "q" + index;
    radio.value = j;

    label.appendChild(radio);
    label.appendChild(document.createTextNode(LETTERS[j] + ". " + question.o[j]));
    card.appendChild(label);
  }

  return card;
}

//questions answered
function answeredCount() {
  var count = 0;

  for (var i = 0; i < examQs.length; i++) {
    if (document.querySelector('input[name="q' + i + '"]:checked')) {
      count++;
    }
  }

  return count;
}

function updateAnswered() {
  answeredLabel.textContent = answeredCount() + "/" + examQs.length;
}

//timer
function tick() {
  var secondsLeft = Math.max(0, Math.round((endAt - Date.now()) / 1000));
  var minutes = Math.floor(secondsLeft / 60);
  var seconds = secondsLeft % 60;

  clockLabel.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

  if (secondsLeft === 0) {
    finishExam();
  }
}

//report button and link
function buildReportLink(question, picked) {
  var number = QUESTIONS.indexOf(question) + 1;

  var optionLines = [];
  for (var i = 0; i < question.o.length; i++) {
    optionLines.push(LETTERS[i] + ". " + question.o[i]);
  }

  var myAnswer = "none";
  if (picked >= 0) {
    myAnswer = LETTERS[picked];
  }

  var body = "Question #" + number + ":\n" + question.q + "\n\n" +
    optionLines.join("\n") + "\n\n" +
    "Answer marked as correct on the site: " + LETTERS[question.a] + "\n" +
    "My answer: " + myAnswer + "\n\n" +
    "What I think the correct answer is (and why):\n";

  var link = document.createElement("a");
  link.className = "flag";
  link.href = "mailto:" + CONFIG.reportEmail +
    "?subject=" + encodeURIComponent("Possible wrong answer - question #" + number) +
    "&body=" + encodeURIComponent(body);
  link.textContent = "?";

  var tip = document.createElement("span");
  tip.className = "tip";
  tip.textContent = "Think the answer is wrong? Email " + CONFIG.reportEmail + " and I will check and fix it.";
  link.appendChild(tip);

  return link;
}

function buildReviewCard(question, index, picked) {
  var card = document.createElement("div");
  card.className = "card rv";
  card.dataset.good = (picked === question.a) ? "1" : "0";

  var head = document.createElement("div");
  head.className = "qhead";

  var title = document.createElement("p");
  title.className = "q";
  title.textContent = (index + 1) + ". " + question.q;

  head.appendChild(title);
  head.appendChild(buildReportLink(question, picked));
  card.appendChild(head);

  for (var j = 0; j < question.o.length; j++) {
    var option = document.createElement("div");
    option.className = "opt";

    if (j === question.a) {
      option.classList.add("ok");
    } else if (j === picked) {
      option.classList.add("bad");
    }

    var text = LETTERS[j] + ". " + question.o[j];
    if (j === picked) {
      text += " (your answer)";
    }

    option.textContent = text;
    card.appendChild(option);
  }

  if (picked < 0) {
    var notAnswered = document.createElement("div");
    notAnswered.className = "muted";
    notAnswered.textContent = "Not answered";
    card.appendChild(notAnswered);
  }

  return card;
}

//check score and show results
function finishExam() {
  clearInterval(timerId);
  inExam = false;

  var picks = [];
  var score = 0;

  for (var i = 0; i < examQs.length; i++) {
    var checked = document.querySelector('input[name="q' + i + '"]:checked');

    if (checked) {
      picks.push(Number(checked.value));
    } else {
      picks.push(-1);
    }

    if (picks[i] === examQs[i].a) {
      score++;
    }
  }

  var percent = Math.round(score / examQs.length * 100);
  var message;

  if (percent >= 50) {
    message = "Pass";
  } else {
    message = "Fail. It is ok. You can try again.";
  }

  document.getElementById("scoreText").textContent = score + " / " + examQs.length;
  document.getElementById("percentText").textContent = percent + "% correct";
  document.getElementById("scoreMessage").textContent = message;
  document.getElementById("summary").classList.remove("hide");

  quizArea.textContent = "";

  for (i = 0; i < examQs.length; i++) {
    quizArea.appendChild(buildReviewCard(examQs[i], i, picks[i]));
  }

  clockLabel.classList.add("hide");
  answeredLabel.classList.add("hide");

  var onlyWrong = false;
  var wrongBtn = document.getElementById("wrongBtn");

  wrongBtn.onclick = function() {
    onlyWrong = !onlyWrong;

    document.querySelectorAll(".rv").forEach(function(card) {
      card.classList.toggle("hide", onlyWrong && card.dataset.good === "1");
    });

    if (onlyWrong) {
      wrongBtn.textContent = "Show all questions";
    } else {
      wrongBtn.textContent = "Show wrong answers only";
    }
  };

  document.getElementById("againBtn").onclick = function() {
    location.reload();
  };

  window.scrollTo(0, 0);
}

document.getElementById("homeLink").onclick = function(e) {
  if (inExam && !confirm("Leave the test? Your answers will be lost.")) {
    e.preventDefault();
  }
};

renderExam();