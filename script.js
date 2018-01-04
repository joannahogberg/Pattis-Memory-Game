// JavaScript

$(document).ready(function() {
    var gamesPlayed; // "Räknare" för antal gånger användaren spelat
    var nextBrickNr; // "Räknare" för antal brickor som vänts
    var brick1; // Variabel för den första vända brickan
    var brick2; // Variabel för den andra vända brickan
    var turns; // Variabel för antal par brickor som vänts
    var pairs; // Variabel för antal fundna par 
    var points; // Ref till antal poäng för spelgång
    var gamesPlayed = 0; // 0 för första gången användaren spelar
    var picsArr = [];
    var bricks = 0;
    var userInfoElem = document.getElementById("userStats");
    var userAverageElem = document.getElementById("userMeanPoints");
    var totPointsElem = document.getElementById("userTotPoints");
    var totGamesElem = document.getElementById("userCountGames");

    showSavedUserInfo(); // Anropar funktion för att visa lagrad användarinfo

    var brickElems = document.getElementById("bricks").getElementsByTagName("img"); // Array med ref till img-elem

    $("#nrOfBricksMenu").change(function() {
        $("#bricks").empty();
        bricks = this.value;
        for (var i = 0; i < this.value; i++) {
            $("#bricks").append('<img src="pics/backside.png" class="brickBack">');
        }
        $('#startGameBtn').prop('disabled', false);

    });

    $("#startGameBtn").click(function() {
        $('#nrOfBricksMenu').prop('disabled', true);
        pairs = 0; // Vid ny omgång sätts pairs till 0
        gamesPlayed += 1; // Räknar upp varje gång en ny omgång startats    
        for (var i = 0; i < brickElems.length; i++) {
            picsArr.push(i);
            picsArr.push(i);
            randomPics(brickElems[i]);
        }
        $("img").click(flipBricks);
    });

    function randomPics(elems) { // elems är ref till img-elem för brickorna genom anrop i startGame funktionen
        var picsIndex; // Index till array med alla bilder. Lokal variabel
        nextBrickNr = 0; // Startar på 0 vid varje ny spelomgång
        turns = 0; // Startar på 0 vid varje ny spelomgång
        picsArr = picsArr.filter(picsNr => picsNr < brickElems.length / 2);
        picsIndex = Math.floor(picsArr.length * Math.random());
        elems.id = "pics/" + picsArr[picsIndex] + ".png"; // Lägger för varje varv i loopen in ny URL i img-elem
        picsArr.splice(picsIndex, 1);
        $('#startGameBtn').prop('disabled', true);

    } // End randomPics

    // Funktion för att vända brickorna samt lägga in nytt värde för de brickor som är vända
    function flipBricks() {
        var i; // Loop-variabel
        nextBrickNr++; // Räkna upp med 1 när en bricka vänts

        if (nextBrickNr > 2) { // Kontrollera så att endast två brickor är vända
            checkBricks();
            return;
        }
        console.log(this)
        this.src = this.id; // This.id = elems.id från randomPics så när man klickar på en bricka visas URL för brickan upp

        if (!brick1) { // Om brick1 har ett värde/har vänts utför nedan
            brick1 = this; // Lägger in värdet för den första vända brickan i brick1
            return; // Abryter för att gå vidare till nästa vändning
        } //End-if-sats
        else {
            // För att kontrollera att samma bricka ej går att trycka på 2ggr
            if (this === brick1) {
                nextBrickNr = nextBrickNr - 1;
                $('#nextBtn').prop('disabled', true);
                $('#message').text("You can not choose the same brick twice! Choose another brick");
                return;
            } //End if-sats
            turns += 1; // Varje gång två brickor vänds räknas det upp som antal gånger ett par brickor vänts
            $('#nextBtn').prop('disabled', false);
            brick2 = this; // Lägger in värdet för den andra vända brickan i brick2          

        } // End else-sats

        if ($('.brickBack').length === 2) {
            setTimeout(function() {
                checkBricks();
            }, 2000);
        }
    } // End flipBricks

    // Funktion för att kontrollera värden för de två vända brickorna och byta klass för de som dragits fram som par
    function checkBricks() {

        nextBrickNr = 0; // Återställer nextBrickNr för att sedan kunna påbörja ny vändning
        //msgElem.innerHTML = ""; // Töm span-taggen vid ny vändning
        $('#message').text("");
        if (brick1.id === brick2.id) {
            pairs += 1; // Varje gång ett par hittas så räknas det upp som ett par
            icon = document.createElement("i");
            icon2 = document.createElement("i");
            brick1.replaceWith(icon);
            brick2.replaceWith(icon2);
            icon.setAttribute("class", "material-icons");
            icon.innerHTML = "done";
            icon2.setAttribute("class", "material-icons");
            icon2.innerHTML = "done";

            if (bricks > 20) {
                $(".material-icons").css("width", "15%");
            }

            // if-sats för att jämföra om par=antal brickor/2. Då anropas funktionen endGame samt countPoints
            if (pairs === (bricks / 2)) {
                endGame();
                countPoints();
            } // End if-sats

            brick1 = null; //Ta bort de "gamla" referenserna för ny vändning
            brick2 = null; //Ta bort de "gamla" referenserna för ny vändning
        } else {
            brick1.src = "pics/backside.png";
            brick2.src = "pics/backside.png";
            brick1 = null; //Ta bort de "gamla" referenserna för ny vändning
            brick2 = null; //Ta bort de "gamla" referenserna för ny vändning
        }

    } // End checkBricks

    // Funktion för då alla par är funna. Ändrar tillbaka brickorna till baksida samt gör dem synliga igen
    function endGame() {
        $("#bricks").empty();
        $("#bricks").append('<i class="material-icons">thumb_up</i>');
        $('#nrOfBricksMenu').prop('disabled', false);

    } // End endGame

    // Funktion för att räkna ut poäng samt lägga in data i web storage för att spara till kommande spelomgångar
    function countPoints() {
        var totalPoints; // Värdet för totalpoäng
        var totalGames; // Värdet för antalet spelomgångar
        // Läser av värdet från span taggarna och lagrar dem i web storage för att sedan summera ihop poäng samt spelomgångar med poäng för ny spelomgång
        totalPoints = Number(document.getElementById("userTotPoints").innerHTML);
        totalGames = Number(document.getElementById("userCountGames").innerHTML);
        sessionStorage.totalPoints = Number(totalPoints);
        sessionStorage.totalGames = Number(totalGames);

        points = parseInt(20 - (turns - pairs) * 1.2); // parseInt för att runda till heltal

        if (points > 0) {
            $('#message').text("Your score for this round is: " + points + " and the number of times a pair of bricks was turned: " + turns);
            totPointsElem.innerHTML = Number(sessionStorage.totalPoints) + Number(points);
            totGamesElem.innerHTML = Number(sessionStorage.totalGames) + 1;
            userAverageElem.innerHTML = parseInt(Number(sessionStorage.totalPoints) / Number(localStorage.totalGames));
        } else {
            // msgElem.innerHTML = "Your score for this round is: 0 and the number of times a pair of bricks was turned: " + turns;
            $('#message').text("Your score for this round is: 0 and the number of times a pair of bricks was turned: " + turns);
            totPointsElem.innerHTML = Number(sessionStorage.totalPoints);
            totGamesElem.innerHTML = Number(sessionStorage.totalGames) + 1;
            userAverageElem.innerHTML = parseInt(Number(sessionStorage.totalPoints) / Number(localStorage.totalGames));
        }
        //Lägger in de nya värdena i web storage
        localStorage.totalPoints = Number(totPointsElem.innerHTML);
        localStorage.totalGames = Number(totGamesElem.innerHTML);

    } // End countPoints

    // Funktion för att ta fram data som sparats i web storage och visa då sidan läses in på nytt
    function showSavedUserInfo() {

        if (localStorage.totalPoints) {
            totPointsElem.innerHTML = Number(localStorage.totalPoints);
        } else {
            totPointsElem.innerHTML = 0;
        }

        if (localStorage.totalGames) {
            totGamesElem.innerHTML = Number(localStorage.totalGames);
        } else {
            totGamesElem.innerHTML = 0;
        }

        if (localStorage.totalPoints > 0) {
            // Räknar ut snittresultat
            userAverageElem.innerHTML = parseInt(Number(localStorage.totalPoints) / Number(localStorage.totalGames));
        } else {
            userAverageElem.innerHTML = 0;
        }

    } // End showSavedUserInfo


});



new Vue({
    el: '#app',
    data: {
        collapsed: true,
        showInfo: true,
        selected: '0',
        options: [
            { text: 'Select nr of bricks', value: '0' },
            { text: '4x4', value: '16' },
            { text: '4x5', value: '20' },
            { text: '5x5', value: '25' },
            { text: '5x6', value: '30' },
            { text: '6x6', value: '36' }
        ]
    }
})