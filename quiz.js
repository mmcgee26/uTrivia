//this bit of code will pull questions from the JSON file, then push them into the myQuestions array

$.ajaxSetup({
    async: false
});

var quizdifficulty = $('#hiddencontent').text();
var quizcategory = $('#hiddencontent2').text();


var quizData;
var getData = function(array) {
   quizData = null;
    $.get( "/questions/" + quizdifficulty + "&" + quizcategory, function( data ) {
		var qarray = [{}];
		quizData = data;
		//alert(quizData.questions[0].ANSWER);
		console.log(quizData.questions);
		
		//logic to re-format array
		var reformatArray = function(questions) {
			return questions.map(function(question) {
			  // create a new object to store quiz questions.
			  	var newObj = {};
				
				var temp = question.ANSWER + ' ,' + question.INCORRECT_ANSWERS;
				temp = temp.split(',');
				
				for(i = 0; i < temp.length; i++){ //loop to remove spaces from the answers
					temp[i] = temp[i].trim();
				}

				//add random sort to temp array to randomize answers
				for (let i = temp.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[temp[i], temp[j]] = [temp[j], temp[i]];
				}
				
				newObj["question_id"] = question.QUESTION_ID;
				newObj["difficulty"] = question.DIFFICULTY;
				newObj["category"] = question.CATEGORY;
				newObj["question"] = question.QUESTION;

				if(temp.length > 2){
				newObj["answers"] = {"a": temp[0], "b": temp[1], "c": temp[2], "d": temp[3]};
				}
				else{
				newObj["answers"] = {"a": temp[0], "b": temp[1]};
				}

				newObj["correctAnswer"] = question.ANSWER;
		  
			  // return our new object.
			  return newObj;
			});
		  };
		
		  qarray = reformatArray(quizData.questions);
		  array = qarray;
		  console.log(qarray);
		  
		//end formatting logic
	});
	return array;
};

var questionsArray = getData(questionsArray);
//alert(questionsArray);

function generateQuiz(questions, $quizContainer, $resultsContainer, $submitButton){ //overall funtion for creating the quiz


	
	// we'll need a place to store the output and the answer choices
	const output = [];
	var answers;

	// for each question
	for(var i=0; i<questions.length; i++){
		
		//reset the list of answers
		answers = [];

		// for each available answer to this question
		for(letter in questions[i].answers){

			//add an html radio button
			answers.push(
				'<label>'
					+ '<input type="radio" name="question'+i+'" value="'+questions[i].answers[letter]+'">'
					+ letter + ': '
					+ questions[i].answers[letter]
				+ '</label>'
			);
		}

		// add this question and its answers to the output
		output.push(
			'<div class="slide">' +
			'<div class="question">' + questions[i].question + '</div><br>'
			+ '<div class="answers">' + answers.join('') + '</div>'
			+ '</div>'
		);
	}
	
	
	// finally combine our output list into one string of html and put it on the page
	document.getElementById("quiz").innerHTML = (output.join(''));
	
	
	
}


	function showResults(questions, $quizContainer, $resultsContainer){
	
	// gather answer containers from our quiz
	var answerContainers = document.getElementById("quiz").querySelectorAll('.answers');
	
	// keep track of user's answers
	var userAnswer = '';
	var numCorrect = 0;
	
	// for each question...
	for(var i=0; i<questions.length; i++){
		// find selected answer
		userAnswer = (answerContainers[i].querySelector('input[name=question'+i+']:checked')||{}).value;
		
		// if answer is correct
		if(userAnswer===questions[i].correctAnswer){
			// add to the number of correct answers
			numCorrect++;
			
			// color the answers green
			answerContainers[i].style.color = 'lightgreen';
		}
		// if answer is wrong or blank
		else{
			// color the answers red
			answerContainers[i].style.color = 'red';
		}
	}

	// show number of correct answers out of total
	document.getElementById("results").innerHTML = numCorrect + ' out of ' + questions.length;
	//$resultsContainer.html = numCorrect + ' out of ' + questions.length;

	
}

	

	// when user clicks submit, show results
	
	function showSlide(n) { //the following code allows for pagination, only showing one question at a time.
		
  slides[currentSlide].classList.remove("active-slide");
  slides[n].classList.add("active-slide");
  currentSlide = n;
 
  if(currentSlide===0){
    $previousButton.css("display", "none");
		//dont show previous button on first question
  }
  else{
    document.getElementById("previous").style.display = 'inline-block';
  }
  if(currentSlide===slides.length-1){ //dont show next button on last question
		$nextButton.css("display", "none");
		$submitButton.css("display", "inline-block");
  }
  else{
    $nextButton.css("display", "inline-block");
		$submitButton.css("display", "none");
  }
}

function showNextSlide() { //next slide function
  showSlide(currentSlide + 1);
}

function showPreviousSlide() { //previous slide function
  showSlide(currentSlide - 1);
}

var $quizContainer = $("#quiz"); //creating all of the objects needed
var $resultsContainer = $("#results");
var $submitButton = $("#submit");
var currentSlide = 0;
var $previousButton = $("#previous");
var $nextButton = $("#next");
generateQuiz(questionsArray, $quizContainer, $resultsContainer, $submitButton); //initializing the quiz

// pagination


const slides = document.querySelectorAll(".slide"); //declaring slides
	
 
	
	$previousButton.click(showPreviousSlide); //adding event listeners
$nextButton.click(showNextSlide);
$("#submit").click(function(){
		showResults(questionsArray, $quizContainer, $resultsContainer);
	});
$("#help").click(function(){
		$("#dialog").dialog({
			
		});
	});

showSlide(0);

