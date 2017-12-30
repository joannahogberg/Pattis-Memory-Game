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

    // var turnNrElem = document.getElementById("turnNr");

    // var msgElem = document.getElementById("message");

    $("#nrOfBricksMenu").change(function() {
        $("#bricks").empty();

        bricks = this.value;
        for (var i = 0; i < this.value; i++) {
            $("#bricks").append('<img src="pics/backside.png" class="brickBack">');

        }
        if (this.value > 20) {
            for (i = 0; i < brickElems.length; i++) {
                $("#bricks").css("maxWidth", "900px");
                $("img").css("width", "15%");
            }
        } else {
            $("#bricks").css("maxWidth", "750px");
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
        // if (brickElems.length > 20) {
        //     for (i = 0; i < brickElems.length; i++) {
        //         $("#bricks").css("maxWidth", "900px");
        //         $("img").css("width", "15%");
        //     }
        // }

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
            // msgElem.innerHTML = "Click the NEXT button";
            // $('#message').text("Click the NEXT button");
            checkBricks();
            return;
        }

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
                //msgElem.innerHTML = "You can not choose the same brick twice! Choose another brick";
                $('#message').text("You can not choose the same brick twice! Choose another brick");
                return;
            } //End if-sats


            turns += 1; // Varje gång två brickor vänds räknas det upp som antal gånger ett par brickor vänts
            //turnNrElem.innerHTML = turns;
            // $('#turnNr').text(turns);
            $('#nextBtn').prop('disabled', false);
            brick2 = this; // Lägger in värdet för den andra vända brickan i brick2          
            //$("#nextBtn").click(checkBricks);



        } // End else-sats


        if (nextBrickNr < 2) {
            checkBricks();
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

        // for (var i = 0; i < userInfoElem.length; i++) {
        //     //addListener(userInfoElem[i].nextBtn, "click", countPoints);
        //     $("#nextBtn").click(countPoints);
        // }


    } // End checkBricks

    // Funktion för då alla par är funna. Ändrar tillbaka brickorna till baksida samt gör dem synliga igen
    function endGame() {
        $("#bricks").empty();
        $("#bricks").append('<i class="material-icons">thumb_up</i>');
        $('#nrOfBricksMenu').prop('disabled', false);
        // $('#nextBtn').prop('disabled', true);

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

// // Globala variabler
// var startGameBtn; // Ref till start-knappen
// var nextBtn; // Ref till nästa-knappen
// var msgElem; // Ref till div-elem för meddelande
// var brickElems; // // Ref till img-elementen för brickorna
// var totPointsElem; // Ref till att skriva ut poäng
// var totGamesElem; // Ref till att skriva ut totalt antal spelomgångar
// var turnNrElem; // Ref till meddelande för antal "vändor"
// var formElem; // Ref till elem för antal valda brickor för spelet
// var userAverageElem; // Ref till snittpoäng
// var showMore; // Array med ref till a-elem i div-elementet userInfo
// var userInfoElem; // Ref till elem för den data som sparas
// var bricks;
// var img;
// var icon;
// var icon2;
// var gamesPlayed; // "Räknare" för antal gånger användaren spelat
// var picsArr; // Array med alla bilder
// var nextBrickNr; // "Räknare" för antal brickor som vänts
// var brick1; // Variabel för den första vända brickan
// var brick2; // Variabel för den andra vända brickan
// var turns; // Variabel för antal par brickor som vänts
// var pairs; // Variabel för antal fundna par 
// var points; // Ref till antal poäng för spelgång



// // Funktion som körs då hela sidan är inladdad
// // Initierar globala variabler och kopplar funktioner till knappar samt brickor
// function init() {
//     var i; // Loop-variabel

//     gamesPlayed = 0; // 0 för första gången användaren spelar

//     startGameBtn = document.getElementById("startGameBtn");
//     nextBtn = document.getElementById("nextBtn");

//     userInfoElem = document.getElementById("userInfo");
//     userAverageElem = document.getElementById("userMeanPoints");

//     totPointsElem = document.getElementById("userTotPoints");
//     totGamesElem = document.getElementById("userCountGames");

//     showSavedUserInfo(); // Anropar funktion för att visa lagrad användarinfo


//     bricks = document.getElementById("bricks");

//     brickElems = document.getElementById("bricks").getElementsByTagName("img"); // Array med ref till img-elem

//     turnNrElem = document.getElementById("turnNr");

//     msgElem = document.getElementById("message");


//     formElem = document.getElementById("nrOfBricksMenu");
//     addListener(formElem, "change", numberOfBricks);

//     // bricks.style.display = "none";

//     // Lägger på klick-händelse på a-taggen och kopplar till funktionen för att visa och dölja userMoreInfo
//     // showMore = document.getElementById("userInfo").getElementsByTagName("i");
//     // for (i = 0; i < showMore.length; i++) {
//     //     addListener(showMore[i], "click", showMoreInfo);
//     // }

//     //Händelsehanterare för start-knapp med anrop till startGame
//     // addListener(startGameBtn, "click", startGame);

//     // Aktivera och inaktivera knappar
//     // startGameBtn.disabled = false;
//     nextBtn.disabled = true;
//     formElem.disabled = false;
//     // numberOfBricks();

// } // End init

// //addListener(window, "load", init); // Se till att init aktiveras då sidan är inladdad


// //Funktion för att ta fram värdet av antalet brickor användaren vill spela med
// function numberOfBricks() {
//     var i; // Loop-variabel
//     var selIndex;
//     var nrBricks;
//     selIndex = formElem.selectedIndex;
//     bricks.innerHTML = "";

//     if (bricks)
//     //Lägger in value för antalet valda brickor ????
//         for (i = 0; i < formElem.length; i++) {
//         formElem[0].value = 16;
//         formElem[1].value = 20;
//         formElem[2].value = 24;
//         formElem[3].value = 30;
//         formElem[4].value = 36;

//     }
//     nrBricks = Number(formElem.options[selIndex].value);

//     displayBricks(nrBricks);
// }

// function displayBricks(x) {
//     var i; // Loop-variabel
//     for (i = 0; i < x; i++) {
//         img = document.createElement("img");
//         bricks.appendChild(img);
//         img.setAttribute("class", "brickBack");
//         img.src = "pics/backside.png";
//     }

// }

// Funktion för att starta spelet och ta fram slumpmässiga bilder som via händelsehanterare visas då man "flippar" en bricka
// function startGame() {
//     var i; // Loop-variabel
//     pairs = 0; // Vid ny omgång sätts pairs till 0
//     gamesPlayed += 1; // Räknar upp varje gång en ny omgång startats

//     var nrArr = [];
//     for (var i = 0; i < brickElems.length; i++) {
//         nrArr.push(i);
//         nrArr.push(i);
//     }

//     picsArr = nrArr.filter(picsNr => picsNr < brickElems.length / 2);

//     if (brickElems.length > 20) {
//         for (i = 0; i < brickElems.length; i++) {
//             brickElems[i].style.width = "15%";
//             brickElems[i].style.height = "15%";
//             bricks.style.maxWidth = "900px";
//         }
//     }
//     console.log(picsArr)
//     startGameBtn.disabled = true; // Inaktiverar startGameBtn då nytt spel startas
//     formElem.disabled = true; // Inaktiverar menyn för att välja antal brickor då nytt spel startats

//     //for-loop för att gå igenom alla img-taggar och anropa randomPics
//     for (i = 0; i < brickElems.length; i++) {
//         randomPics(brickElems[i]); // Anrop till funktionen randomPics som tar fram slumptal

//     }

//     // for-loop som går igenom img-taggarna och händelsehanterare för att lägga på klickhändelse på den bricka som användaren klickar på som då kopplas till funktionen flipBricks
//     for (i = 0; i < brickElems.length; i++) {
//         addListener(brickElems[i], "click", flipBricks);
//         turnNrElem.innerHTML = ""; // Tömmer span-taggen vid ny spelomgång
//         msgElem.innerHTML = ""; // Tömmer span-taggen vid ny spelomgång
//     }


// } // End startGame


// // Funktion som tar fram slumptal och sedan tilldelar img-elementens id ny URL
// function randomPics(elems) { // elems är ref till img-elem för brickorna genom anrop i startGame funktionen
//     var picsIndex; // Index till array med alla bilder. Lokal variabel

//     nextBrickNr = 0; // Startar på 0 vid varje ny spelomgång
//     turns = 0; // Startar på 0 vid varje ny spelomgång

//     picsIndex = Math.floor(picsArr.length * Math.random());
//     elems.id = "pics/" + picsArr[picsIndex] + ".png"; // Lägger för varje varv i loopen in ny URL i img-elem
//     picsArr.splice(picsIndex, 1);

// } // End randomPics


// // Funktion för att vända brickorna samt lägga in nytt värde för de brickor som är vända
// function flipBricks() {
//     var i; // Loop-variabel
//     formElem.disabled = true;
//     nextBrickNr++; // Räkna upp med 1 när en bricka vänts

//     if (nextBrickNr > 2) { // Kontrollera så att endast två brickor är vända
//         msgElem.innerHTML = "Click the NEXT button";
//         return;
//     }


//     this.src = this.id; // This.id = elems.id från randomPics så när man klickar på en bricka visas URL för brickan upp

//     if (!brick1) { // Om brick1 har ett värde/har vänts utför nedan
//         brick1 = this; // Lägger in värdet för den första vända brickan i brick1
//         return; // Abryter för att gå vidare till nästa vändning
//     } //End-if-sats
//     else {
//         // För att kontrollera att samma bricka ej går att trycka på 2ggr
//         if (this === brick1) {
//             nextBrickNr = nextBrickNr - 1;
//             nextBtn.disabled = true;
//             msgElem.innerHTML = "You can not choose the same brick twice! Choose another brick";
//             return;
//         } //End if-sats


//         turns += 1; // Varje gång två brickor vänds räknas det upp som antal gånger ett par brickor vänts
//         turnNrElem.innerHTML = turns;
//         nextBtn.disabled = false; // Aktivera nextBtn då två brickor vänts
//         brick2 = this; // Lägger in värdet för den andra vända brickan i brick2
//         addListener(nextBtn, "click", checkBricks);
//     } // End else-sats

// } // End flipBricks

// // Funktion för att kontrollera värden för de två vända brickorna och byta klass för de som dragits fram som par
// function checkBricks() {
//     var i; // Loop-variabel

//     nextBrickNr = 0; // Återställer nextBrickNr för att sedan kunna påbörja ny vändning
//     msgElem.innerHTML = ""; // Töm span-taggen vid ny vändning


//     if (brick1.id === brick2.id) {
//         pairs += 1; // Varje gång ett par hittas så räknas det upp som ett par
//         icon = document.createElement("i");
//         icon2 = document.createElement("i");
//         brick1.replaceWith(icon);
//         brick2.replaceWith(icon2);
//         icon.setAttribute("class", "material-icons md-48");
//         icon.innerHTML = "done";
//         icon2.setAttribute("class", "material-icons md-48");
//         icon2.innerHTML = "done";

//         // if-sats för att jämföra om par=antal brickor/2. Då anropas funktionen endGame samt countPoints
//         if (pairs === (brickElems.length) / 2) {
//             endGame();
//             countPoints();
//         } // End if-sats

//         brick1 = null; //Ta bort de "gamla" referenserna för ny vändning
//         brick2 = null; //Ta bort de "gamla" referenserna för ny vändning
//     } else {
//         brick1.src = "pics/backside.png";
//         brick2.src = "pics/backside.png";

//         brick1 = null; //Ta bort de "gamla" referenserna för ny vändning
//         brick2 = null; //Ta bort de "gamla" referenserna för ny vändning
//     }

//     for (i = 0; i < userInfoElem.length; i++) {
//         addListener(userInfoElem[i].nextBtn, "click", countPoints);
//     }

// } // End checkBricks


// // Funktion för då alla par är funna. Ändrar tillbaka brickorna till baksida samt gör dem synliga igen
// function endGame() {
//     var i; // Loop-variabel

//     for (i = 0; i < brickElems.length; i++) {
//         brickElems[i].style.visibility = "visible";
//         brickElems[i].src = "pics/backside.png";
//         brickElems[i].className = "brickBack";
//         removeListener(brickElems[i], "click", flipBricks);
//     }

//     nextBtn.disabled = true;
//     startGameBtn.disabled = false;
//     formElem.disabled = false;

// } // End endGame

// // Funktion för att räkna ut poäng samt lägga in data i web storage för att spara till kommande spelomgångar
// function countPoints() {
//     var totalPoints; // Värdet för totalpoäng
//     var totalGames; // Värdet för antalet spelomgångar


//     // Läser av värdet från span taggarna och lagrar dem i web storage för att sedan summera ihop poäng samt spelomgångar med poäng för ny spelomgång
//     totalPoints = Number(document.getElementById("userTotPoints").innerHTML);
//     totalGames = Number(document.getElementById("userCountGames").innerHTML);
//     sessionStorage.totalPoints = Number(totalPoints);
//     sessionStorage.totalGames = Number(totalGames);

//     points = parseInt(20 - (turns - pairs) * 1.2); // parseInt för att runda till heltal

//     if (points > 0) {
//         msgElem.innerHTML = "Your score for this round is: " + points + " and the number of times a pair of bricks was turned: " + turns;
//         totPointsElem.innerHTML = Number(sessionStorage.totalPoints) + Number(points);
//         totGamesElem.innerHTML = Number(sessionStorage.totalGames) + 1;
//         userAverageElem.innerHTML = parseInt(Number(sessionStorage.totalPoints) / Number(localStorage.totalGames));
//     } else {
//         msgElem.innerHTML = "Your score for this round is: 0 and the number of times a pair of bricks was turned: " + turns;
//         totPointsElem.innerHTML = Number(sessionStorage.totalPoints);
//         totGamesElem.innerHTML = Number(sessionStorage.totalGames) + 1;
//         userAverageElem.innerHTML = parseInt(Number(sessionStorage.totalPoints) / Number(localStorage.totalGames));
//     }


//     //Lägger in de nya värdena i web storage
//     localStorage.totalPoints = Number(totPointsElem.innerHTML);
//     localStorage.totalGames = Number(totGamesElem.innerHTML);

// } // End countPoints

// // Funktion för att ta fram data som sparats i web storage och visa då sidan läses in på nytt
// function showSavedUserInfo() {

//     if (localStorage.totalPoints) {
//         totPointsElem.innerHTML = Number(localStorage.totalPoints);
//     } else {
//         totPointsElem.innerHTML = 0;
//     }

//     if (localStorage.totalGames) {
//         totGamesElem.innerHTML = Number(localStorage.totalGames);
//     } else {
//         totGamesElem.innerHTML = 0;
//     }

//     if (localStorage.totalPoints > 0) {
//         // Räknar ut snittresultat
//         userAverageElem.innerHTML = parseInt(Number(localStorage.totalPoints) / Number(localStorage.totalGames));
//     } else {
//         userAverageElem.innerHTML = 0;
//     }

// } // End showSavedUserInfo


// Funktion för att visa och dölja menyn för mer info
// Lägg in ny text i a-taggen när hela info-rutan visas
function showMoreInfo() {
    var showMenu; // Ref till undermenyn för mer info

    showMenu = document.getElementById("userMoreInfo");
    // if (showMenu.style.display === "block") {
    //     showMenu.style.display = "none";
    //     document.getElementById("userInfo").getElementsByTagName("i")[0].innerHTML = "expand_more";
    // } else {
    //     showMenu.style.display = "block";
    //     document.getElementById("userInfo").getElementsByTagName("i")[0].innerHTML = "expand_less";
    // }

} // End showMoreInfo




var app = new Vue({

    el: "#userInfo",
    data: {
        collapsed: true,
        showInfo: true
    }
});