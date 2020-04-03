var myQuestions = "default";
$.ajaxSetup({
    async: false
});
$.getJSON('questions.json', function(jd) {
	myQuestions = jd;
 });
 alert(tempQ.question);

var myQuestions = [ //all of the questions and answers are stored in this data structure.
	{
		question: "1.) What do you need to run Java?",
		answers: {
			a: 'Usain Bolt',
			b: 'Java JDK',
			c: 'Java compiler'
		},
		correctAnswer: 'b'
	},
	{
		question: "2.) What was the original name for Java?",
		answers: {
			a: 'Javapower',
			b: 'Jala',
			c: 'Oak'
		},
		correctAnswer: 'c'
	},
	{
		question: "3.) Which company created Java?",
		answers: {
			a: 'Microsoft',
			b: 'Apple',
			c: 'Sun Microsystems'
		},
		correctAnswer: 'c'
	},
	{
		question: "4.) Which of the following is a keyword in Java?",
		answers: {
			a: 'repeat',
			b: 'final',
			c: 'elseif'
		},
		correctAnswer: 'b'
	},
	{
		question: "5.) All Java classes inherit this class: _______",
		answers: {
			a: 'class',
			b: 'Object',
			c: 'private'
		},
		correctAnswer: 'b'
	},
	{
		question: "6.) TRUE/FALSE: Java is case-sensitive",
		answers: {
			a: 'True',
			b: 'False'
		},
		correctAnswer: 'a'
	},
	{
		question: "7.) TRUE/FALSE: whitespace is ignored in Java",
		answers: {
			a: 'True',
			b: 'False'
		},
		correctAnswer: 'a'
	},
	{
		question: "8.) What must be at the end of every Java statement?",
		answers: {
			a: 'end',
			b: 'done',
			c: ';'
		},
		correctAnswer: 'c'
	},
	{
		question: "9.) What is the syntax for creating a multi-line comment in Java?",
		answers: {
			a: 'comment: ',
			b: '//.....\\',
			c: '/*......*/'
		},
		correctAnswer: 'c'
	},
	{
		question: "10.) What is the syntax for creating a single-line comment in Java?",
		answers: {
			a: 'comment: ',
			b: '//',
			c: '/*......*/'
		},
		correctAnswer: 'b'
	},
];


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
					+ '<input type="radio" name="question'+i+'" value="'+letter+'">'
					+ letter + ': '
					+ questions[i].answers[letter]
				+ '</label>'
			);
		}

		// add this question and its answers to the output
		output.push(
			'<div class="slide">' +
			'<div class="question">' + questions[i].question + '</div>'
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
generateQuiz(myQuestions, $quizContainer, $resultsContainer, $submitButton); //initializing the quiz

// pagination


const slides = document.querySelectorAll(".slide"); //declaring slides
	
 
	
	$previousButton.click(showPreviousSlide); //adding event listeners
$nextButton.click(showNextSlide);
$("#submit").click(function(){
		showResults(myQuestions, $quizContainer, $resultsContainer);
	});
$("#help").click(function(){
		$("#dialog").dialog({
			
		});
	});

showSlide(0);

