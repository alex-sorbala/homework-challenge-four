//Question objects
var question1 = {
    question: "This is question 1 ?",
    options: [
        "abc1",
        "abc2",
        "abc3",
        "abc4"
    ],
    answer: "abc2"
}

var question2 = {
    question: "This is question 2 ?",
    options: [
        "abc123",
        "abc123",
        "abc123",
        "abc123"
    ],
    answer: "abc123"
}

var question3 = {
    question: "This is question 3 ?",
    options: [
        "abc123",
        "abc123",
        "abc123",
        "abc123"
    ],
    answer: "abc123"
}

//Global Variables
var questions = [question1, question2, question3];
var listOfScores;
var timeLeft;
var timeInterval;
var initials;
var questionDisplayEL = document.getElementById("questionDisplay");
var interactiveSectionEL = document.getElementById("interactiveSection");
var statusEL = document.getElementById("status");
var timerEl = document.getElementById("timer");


function start(){
    document.getElementById("start").remove();
    displayQuestion(0);
    startTimer();
}

//Creting and appending the elements based on the question object
function displayQuestion(questionNumber){
    //verifying that we haven't reached the end of questions list
    if (questionNumber < questions.length) {
        //displaying question
        questionDisplayEL.textContent = questions[questionNumber].question;

        //displaying options
        var list = document.createElement("ul");
        interactiveSectionEL.appendChild(list);

        for (let index = 0; index < 4; index++) {
            var option = document.createElement("li");
            option.textContent = (index+1) + ".  " + questions[questionNumber].options[index];
            //adding onclick function to every line and passin info about the object in it
            option.setAttribute("onclick","verifyResult(" + questionNumber + ", " + index + ")");
            option.setAttribute("data-option", questions[questionNumber].options[index]);
            list.appendChild(option);
        }
    } else {
        //end of quiz
        clearInterval(timeInterval);
        displayScoreSaver();
    }
}

//Verifying result after an option has been selected and triggeting displayAnswer and displayQuestion
function verifyResult(questionNumber, optionNumber){
    document.querySelector("ul").remove();
    if(questions[questionNumber].options[optionNumber] === questions[questionNumber].answer){
        displayAnswer(true);
        displayQuestion(questionNumber+1);
    }else{
        displayAnswer(false);
        displayQuestion(questionNumber+1);
        timeLeft = timeLeft - 5;
    }
}

//Displaying the correctness of the answer to the user
function displayAnswer(result){
    var newElement = document.createElement("h4");
    //Verifying and displaying the apropriate text Correct/Wrong
    if (result) {
        newElement.textContent = "Correct";
        newElement.style = "color:green;";
    } else {
        newElement.textContent = "Wrong";
        newElement.style ="color:red;";
    }
    //appending element and removing it after 3 seconds
    statusEL.appendChild(newElement);
    setTimeout(function(){
        newElement.remove();
    }, 3000);
}

//Timer
function startTimer(){
    timeLeft = 20;
    timeInterval = setInterval(function () {

        if(timeLeft === 0){
            displayScoreSaver();
            clearInterval(timeInterval);
        }else{
            timeLeft--;
            timerEl.textContent = "Time: " + timeLeft;
        }
    }, 1000);
}

//display score and the save score elements
function displayScoreSaver(){
    questionDisplayEL.textContent = "All done!"
    
    //displaying the score in a new paragraph element
    var scoreEL = document.createElement("p")
    scoreEL.textContent = "Your score is: " + timeLeft;
    interactiveSectionEL.appendChild(scoreEL);
    
    //adding the save highscore field
    initials = document.createElement("input");
    initials.setAttribute("id","initials");
    //adding label
    var label = document.createElement("label");
    label.setAttribute("for","initials");
    label.textContent = "Enter initial: "
    // adding Save button
    var save = document.createElement("button");
    save.setAttribute("onclick","saveHighscore()");
    save.textContent="Save";
    
    //append
    interactiveSectionEL.append(label, initials, save);
}

//saving data to local storage
function saveHighscore(){ 
    var initial = document.getElementById("initials").value;

    //verify an imput has been provided
    if(initial === ""){
        window.alert("Eneter an initial or nickname");
    }else{
        var record = initial + " - " + timeLeft;
        //getting record from local storage
        listOfScores = JSON.parse(localStorage.getItem("highscores"));
        //initiating array if it is null
        if(listOfScores == null){
            listOfScores=[];
        }
        //pushing new record and saving to local storage
        listOfScores.push(record);
        console.log(listOfScores);
        localStorage.setItem("highscores", JSON.stringify(listOfScores));
    }
}