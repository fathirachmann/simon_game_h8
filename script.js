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
        $(".notification").toggleClass("hidden");
        
        setTimeout(function() {
            $(".notification").toggleClass("hidden");
        }, 1500);

    } else {
        let startAudio = new Audio("sounds/start.mp3");
        startAudio.play();
        $("#title").text(`Level ${gameLevel}`);
        $(".form").toggleClass("hidden");
        $(".score-counter").toggleClass("hidden");
        $(".container").toggleClass("hidden");
        $("#username").text(vUsername);
        $("#score").text(`${score} pts`);
        nextColor();
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
            nextColor();
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

function nextColor() { 
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

function showLeaderboard() {
    $(".leaderboard-card").toggleClass("hidden")
}

function createData() {
    let startDatabase = []
    let id = 1
    let data = JSON.parse(localStorage.getItem("database"))
    let username = $("#input-name").val()

    if (data === null) {
        let obj = {
            id: id,
            username: username,
            score: score
        }
        startDatabase.push(obj)
        localStorage.setItem("database", JSON.stringify(startDatabase));
    } else if (data.length > 0) {
        let flag = false
        let obj = {}
        for (i = 0; i < data.length; i++) {
            let perObj = data[i]
            if (perObj.username === username && score > perObj.score) {
                perObj.score = score;
                localStorage.setItem("database", JSON.stringify(data));
            } else {
                flag = true
                break;
            }
        }
        
        if (flag === true) {
            id = data[data.length - 1].id + 1
            obj = {
                id: id,
                username: username,
                score: score
            }   
            data.push(obj)
            localStorage.setItem("database", JSON.stringify(data))
            flag = false
        }
    }
    startOver()
}

function readData() {
    let data = JSON.parse(localStorage.getItem("database"))
    // for (i = 0; i < data.length; i++) {
    //     let score = 
    // }

}