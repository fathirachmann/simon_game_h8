// Core Gameplay Script:
let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userPattern = [];
let gameLevel = 0;
let score = 0
let username = ""

// Restriction untuk keypress "Enter"
$("input").keypress(function(event) {
    if (event.keycode === 13 || event.which === 13) {
        event.preventDefault(); 
    }
});

$("input").keypress(function(event) {
    if (event.keycode === 32 || event.which === 32) {
        event.preventDefault(); 
    }
});

// Function gameStart() untuk memulai game
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
        setTimeout(nextColor(), 1500)
    }
}


// function untuk mengecek apakah jawaban sesuai sequence atau salah
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
        setTimeout(function() {
            $("body").removeClass("game-over"); 
        }, 50);
        $(".container").toggleClass("hidden");
        $("#final-score").text(`${score} pts`)
        $(".end-notification").toggleClass("hidden");
        $("#try-again").toggleClass("hidden")
    }
}

// function untuk generate warna berikutnya
function nextColor() { 
    let randomNumber = Math.floor(Math.random() * 4);
    let randomPickedColor = buttonColors[randomNumber];
    gamePattern.push(randomPickedColor);
    userPattern = [];
    gameLevel++;
    $("#title").text(`Level ${gameLevel}`);

    // Memainkan ulang seluruh urutan gamePattern
    let index = 0;
    function playSequence() {
        if (index < gamePattern.length) {
            let color = gamePattern[index];
            $("#" + color).fadeIn(100).fadeOut(100).fadeIn(100);
            playSound(color);
            index++;
            setTimeout(playSequence, 600); // Jeda 600ms antar warna
        }
    }
    setTimeout(playSequence, 500); // Mulai urutan setelah jeda 500ms
}

// DOM jQuery untuk klik button warna
$(".btn").click(function() { 
    let userChosenColour = $(this).attr("id");
    userPattern.push(userChosenColour);
    playSound(userChosenColour);
    // animatePress(userChosenColour); // UNCOMMENT JIKA INGIN MANIPULASI ANIMASI (CHECK CSS)
    checkAnswer(userPattern.length - 1);
});

// Function untuk memainkan suara button
function playSound(name) {
    let colorAudio = new Audio(`sounds/${name}.mp3`);
    colorAudio.play();
}

// Function untuk animasi button (UNCOMMENT JIKA INGIN MANIPULASI ANIMASI, CHECK CSS)
function animatePress(color) {
    $(`.${color}`).addClass("pressed");
    setTimeout(function () {
        $(`.${color}`).removeClass("pressed"); 
    }, 50);
}

// Function untuk memulai ulang setelah game over
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

//Leaderboard Script: (use vanilla DOM as jQuery cannot use localStorage)

function showLeaderboard() {
    $(".leaderboard-card").toggleClass("hidden")
}

// Function read data leaderboard
function readData() {
    let data = JSON.parse(localStorage.getItem("database")) || [];
    let leaderboardList = document.querySelector(".card ol");
    leaderboardList.innerHTML = ""; // Bersihkan daftar yang ada

    // Urutkan data berdasarkan skor secara menurun
    data.sort((a, b) => b.score - a.score);

    // Tampilkan 5 skor tertinggi
    let maxEntries = Math.min(data.length, 5);
    for (let i = 0; i < maxEntries; i++) {
        let listItem = document.createElement("li");
        listItem.textContent = `${data[i].username} - ${data[i].score} pts`;
        leaderboardList.appendChild(listItem);
    }

    // Jika kurang dari 5 entri, isi dengan placeholder
    for (let i = maxEntries; i < 5; i++) {
        let listItem = document.createElement("li");
        listItem.textContent = `Empty - 0 pts`;
        leaderboardList.appendChild(listItem);
    }
}

// Function database leaderboard
function createData() {
    let startDatabase = [];
    let id = 1;
    let data = JSON.parse(localStorage.getItem("database"));
    let username = $("#input-name").val();

    if (data === null) {
        let obj = {
            id: id,
            username: username,
            score: score
        };
        startDatabase.push(obj);
        localStorage.setItem("database", JSON.stringify(startDatabase));
    } else if (data.length > 0) {
        let flag = true;
        for (let i = 0; i < data.length; i++) {
            let perObj = data[i];
            if (perObj.username === username && score > perObj.score) {
                perObj.score = score;
                localStorage.setItem("database", JSON.stringify(data));
                break;
            } else if (perObj.username === username && score < perObj.score) {
                break;
            }
        }
        if (flag) {
            id = data[data.length - 1].id + 1;
            let obj = {
                id: id,
                username: username,
                score: score
            };   
            data.push(obj);
            localStorage.setItem("database", JSON.stringify(data));
        }
    }
    readData();
    startOver();
}

readData();

