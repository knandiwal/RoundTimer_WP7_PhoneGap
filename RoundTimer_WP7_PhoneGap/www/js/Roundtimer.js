var d;

function OnReady() {

    if (localStorage.getItem("roundtime")) {
        d = new Date(localStorage.getItem("roundtime"));
    } else {
        d = new Date(0, 0, 0, 0, 1, 0, 0);
        localStorage.setItem("roundtime", d);
    }
    setDisplayTime();

    $(".time").change(function () {
        d = new Date(0, 0, 0, 0, parseInt($("#select-choice-1 option:selected").val()),
        parseInt($("#select-choice-2 option:selected").val()), 0);
        localStorage.setItem("roundtime", d);
        setDisplayTime();
    });

    addOptions(0, 16, "select-choice-1");
    addOptions(0, 60, "select-choice-2");
    $("#select-choice-1").val(d.getMinutes());
    $("#select-choice-2").val(d.getSeconds());

    $("#mainbutton").live("click", function () {
        ToggleTimer();
    });
}

function addOptions(start, end, control) {
    for (i = start; i < end; i++) {
        $("#" + control).append($("<option />").val(i).text((i < 10) ? "0" + i : i));
    }
}

function setDisplayTime() {
    d = new Date(localStorage.getItem("roundtime"));
    $("#timer").text(pad(d.getMinutes()) + ":" + pad(d.getSeconds()));
}

function pad(val) {
    return ((val < 10) ? "0" + val : val);
}

var TotalSeconds;
var CountingDown = false;
var timer;

function Tick() {
    if (TotalSeconds <= 0 || CountingDown == false) {
        PlayMP3("Horn.mp3");
        navigator.notification.vibrate(1000);
        setDisplayTime();
        $("#mainbutton").attr("src", "images/start.png");
        return;
    }

    if (TotalSeconds == 10 && d.getSeconds() >= 15) {
        PlayMP3("Clap.mp3");
    }

    TotalSeconds -= 1;
    UpdateTimer();
    timer = window.setTimeout("Tick()", 1000);
}

function UpdateTimer() {
    var Seconds = TotalSeconds;
    var Minutes = Math.floor(Seconds / 60);
    Seconds -= Minutes * (60);
    var TimeStr = pad(Minutes) + ":" + pad(Seconds)
    $("#timer").text(TimeStr);
}

function ToggleTimer() {

    if ($("#mainbutton").attr("src") == "images/stop.png") {
        CountingDown = false;
        $("#mainbutton").attr("src", "images/start.png");
        clearInterval(timer);
        return;
    }

    if ($("#mainbutton").attr("src") == "images/start.png") {
        PlayMP3("Bell.mp3");
        CountingDown = true;
        $("#mainbutton").attr("src", "images/stop.png");
    }

    TotalSeconds = (60 * d.getMinutes()) + d.getSeconds();
    UpdateTimer();
    Tick();
}

function PlayMP3(filename) {
    var mp3 = new Media("/app/www/media/" + filename,
    // success callback
    function () {
        console.log("playAudio():Audio Success");
    },
    // error callback
    function (err) {
        console.log("playAudio():Audio Error: " + err);
        console.log("playAudio():Audio Error: " + "/app/www/media/" + filename);
    });

    mp3.play();
}