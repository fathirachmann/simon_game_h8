// Core Gameplay Script:

let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userPattern = [];
let gameLevel = 0;
let score = 0
let username = ""

$("input").keypress(function(event) {
    if (event.keycode === 13 || event.which === 13) {
        event.preventDefault(); 
    }
});

function gameStart() {
    let vUsername = $("#input-name").val()
    
    if (vUsername.length === 0) {
        let wrongAudio = new Audio("sounds/wrong.mp3");
        wrongAudio.play();
        $(".notification").removeClass("hidden");
        setTimeout(function() {
            $(".notification").addClass("hidden");
        }, 1000);
    } else {
        let startAudio = new Audio("sounds/start.mp3");
        startAudio.play();
        $("#title").text(`Level ${gameLevel}`);
        $(".form").toggleClass("hidden");
        $(".score-counter").toggleClass("hidden");
        $(".container").toggleClass("hidden");
        $("#username").text(vUsername);
        $("#score").text(`${score} pts`);
        nextSequence();
    }
}

$(".btn").click(function() { 
    let userChosenColour = $(this).attr("id");
    userPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userPattern.length - 1);
});

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userPattern[currentLevel]) {
        if (userPattern.length === gamePattern.length) {
            score += 10
            $("#score").text(`${score} pts`);
            setTimeout(function() {
            nextSequence();
            }, 500);
        }
    } else {
        $("h1").text("Game Over!");
        let wrongAudio = new Audio("sounds/wrong.mp3");
        wrongAudio.play();
        $("body").addClass("game-over");
        setTimeout(function () {
            $("body").removeClass("game-over"); 
        }, 50);
        $(".container").toggleClass("hidden");
        $("#final-score").text(`${score} pts`)
        $(".end-notification").toggleClass("hidden");
        $("#try-again").toggleClass("hidden")
    }
}

function nextSequence() { 
    let randomNumber = Math.floor(Math.random() * 4);
    let randomPickedColor = buttonColors[randomNumber];
    gamePattern.push(randomPickedColor);

    setTimeout(function() {
        userPattern = [];
        gameLevel++;
        $("#title").text(`Level ${gameLevel}`);
        $("#" + randomPickedColor).fadeIn(100).fadeOut(100).fadeIn(100);
        playSound(randomPickedColor);
    }, 500)
}

function playSound(name) {
    let colorAudio = new Audio(`sounds/${name}.mp3`);
    colorAudio.play();
}

function animatePress(color) {
    $(`.${color}`).addClass("pressed");
    setTimeout(function () {
        $(`.${color}`).removeClass("pressed"); 
    }, 50);
}

function startOver() {
    gameLevel = 0;
    gamePattern = []
    score = 0
    username = ""
    $(".end-notification").toggleClass("hidden");
    $("#try-again").toggleClass("hidden")
    $("#title").text(`Simon Game`);
    $(".form").toggleClass("hidden");
    $(".score-counter").toggleClass("hidden");
}

//Leaderboard Script: (use vanilla DOM as jQuery cannot use localstorage)

let database = [{}]

function showLeaderboard() {
    $(".leaderboard-card").toggleClass("hidden")
}

function addData() {

}