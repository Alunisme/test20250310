let table;
let questions = [];
let radio;
let input;
let submitButton;
let currentQuestionIndex = 0;
let congratsMessage = false;
let retryButton;
let errorMessage = false;
let correctAnswers = 0;
let incorrectAnswers = 0;

function preload() {
  table = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
  textSize(16);

  // 讀取 CSV 檔案中的題目和選項
  for (let i = 0; i < table.getRowCount(); i++) {
    let question = table.getString(i, 'question');
    let type = table.getString(i, 'type');
    let options = [];
    if (type === 'multiple-choice') {
      options = [
        table.getString(i, 'option1'),
        table.getString(i, 'option2'),
        table.getString(i, 'option3'),
        table.getString(i, 'option4'),
        table.getString(i, 'option5')
      ];
    }
    questions.push({ question, type, options });
  }

  // 建立選擇題
  radio = createRadio();
  radio.style('width', '700px');
  radio.position(width / 2 - 350, height / 2);

  // 建立填空題輸入框
  input = createInput();
  input.position(width / 2 - 350, height / 2);
  input.hide();

  // 建立送出按鈕
  submitButton = createButton('送出答案');
  submitButton.position(width - 800, height - 450);
  submitButton.mousePressed(checkAnswer);

  // 顯示第一題
  displayQuestion(currentQuestionIndex);
}

function draw() {
  background("#00AEAE");
  textSize(50);
  text(`413730267 教科一B 伍志倫`, 1000, 100);
  if (congratsMessage) {
    textSize(32);
    text('恭喜！你已經完成所有題目！', width / 2, height / 2 - 20);
    textSize(20);
    text(`答對題數: ${correctAnswers}`, 100, 50);
    text(`錯誤題數: ${incorrectAnswers}`, 100, 80);
  } else {
    text(questions[currentQuestionIndex].question, width / 2, height / 2 - 40);
    if (errorMessage) {
      textSize(20);
      fill(255, 0, 0);
      text('再試一次', width / 2, height / 2 + 40);
      fill(0);
    }
  }
}

function displayQuestion(index) {
  radio.hide();
  input.hide();
  radio.html(''); // 清空之前的選項
  let question = questions[index];
  if (question.type === 'multiple-choice') {
    radio.show();
    for (let option of question.options) {
      radio.option(option);
    }
  } else if (question.type === 'fill-in-the-blank') {
    input.show();
  }
  errorMessage = false; // 清除錯誤訊息
}

function checkAnswer() {
  let question = questions[currentQuestionIndex];
  let selected;
  if (question.type === 'multiple-choice') {
    selected = radio.value();
  } else if (question.type === 'fill-in-the-blank') {
    selected = input.value();
  }
  let correct = table.getString(currentQuestionIndex, 'correct');
  if (selected === correct) {
    correctAnswers++;
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion(currentQuestionIndex);
    } else {
      congratsMessage = true;
      submitButton.hide();
      radio.hide();
      input.hide();
      retryButton = createButton('再來一次');
      retryButton.position(width / 2 - 50, height / 2 + 20);
      retryButton.mousePressed(restartQuiz);
    }
  } else {
    incorrectAnswers++;
    errorMessage = true;
  }
}

function restartQuiz() {
  currentQuestionIndex = 0;
  congratsMessage = false;
  errorMessage = false;
  correctAnswers = 0;
  incorrectAnswers = 0;
  retryButton.remove();
  submitButton.show();
  radio.show();
  input.hide();
  displayQuestion(currentQuestionIndex);
}
