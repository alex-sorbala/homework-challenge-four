//Question objects
var question1 = {
    question: "Suppose we have a text 'human' that we want to convert into string without using the 'new' operator. Which is the correct way from the following to do so:",
    options: [
        "toString()",
        "String(human)",
        "String newvariable='human'",
        "Both human.toString() and String(human)"
    ],
    answer: "Both human.toString() and String(human)"
}

var question2 = {
    question: "What we will get if we compare the 'one' with '8' using the less than operator ('one'<8)?",
    options: [
        "False",
        "True",
        "NaN",
        "Undefined"
    ],
    answer: "False"
}

var question3 = {
    question: " A set of unordered properties that, has a name and value is called______",
    options: [
        "String",
        "Array",
        "Serialized Object",
        "Object"
    ],
    answer: "Object"
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
    removeElements(interactiveSectionEL);
    displayQuestion(0);
    startTimer();
}

//Creating and appending the elements based on the question object
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
    removeElements(interactiveSectionEL);
    if(questions[questionNumber].options[optionNumber] === questions[questionNumber].answer){
        displayAnswer(true);
        displayQuestion(questionNumber+1);
    }else{
        timeLeft = timeLeft - 5;
        displayAnswer(false);
        displayQuestion(questionNumber+1);
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
    }, 2000);
}

//Timer
function startTimer(){
    timeLeft = 45;
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
    removeElements(interactiveSectionEL);

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
        //pushing new record to array and saving to local storage
        listOfScores.push(record);
        console.log(listOfScores);
        localStorage.setItem("highscores", JSON.stringify(listOfScores));
        
        //displaying the highscore view
        displayHighscore();
    }
}

//displaying the highscore view 
function displayHighscore(){
    questionDisplayEL.textContent = "Highscore:";
    
    //Remove existing elements
    removeElements(interactiveSectionEL);

    //getting record from local storage
    listOfScores = JSON.parse(localStorage.getItem("highscores"));

    //initiating array if it is null
    if(listOfScores == null){
        listOfScores=[];
    }

    //create and append the scores
    var list = document.createElement("ol");
    interactiveSectionEL.appendChild(list);

    for (let index = 0; index < listOfScores.length; index++) {
        var line = document.createElement("li");
        line.textContent = (1+index) +": " + listOfScores[index];
        //alternating background colors
        if(index % 2 == 0){
            line.style = "background-color: rgba(128, 128, 128, 0.75);";
        }else{
            line.style = "background-color: rgba(128, 128, 128, 0.25);";
        }

        list.appendChild(line);
    }

    //removing any previus elements
    removeElements(statusEL);

    //adding Go back and clear buttons
    var goBackBtn = document.createElement("button");
    var clearScoreBtn = document.createElement("button");

    goBackBtn.textContent = "Go Back";
    clearScoreBtn.textContent = "Clear Score";

    goBackBtn.setAttribute("onclick","goBack()");
    clearScoreBtn.setAttribute("onclick","clearScore()");

    goBackBtn.style = "width: 50%";
    clearScoreBtn.style = "width: 50%";

    statusEL.append(goBackBtn);
    statusEL.append(clearScoreBtn);
}

//clearing score
function clearScore(){
    localStorage.removeItem("highscores");

    //Remove existing list
    removeElements(interactiveSectionEL);
}

//go back to start by simply reloading the page
function goBack(){
    location.reload();
}

//remove existing child elements
function removeElements(parent){
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}