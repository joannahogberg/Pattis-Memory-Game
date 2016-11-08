// JavaScript

// Globala variabler
var startGameBtn; // Ref till start-knappen
var nextBtn; // Ref till nästa-knappen
var msgElem; // Ref till div-elem för meddelande
var brickElems; // // Array med referenser till img-elementen för brickorna
var totPointsElem; // Ref till att skriva ut poäng
var totGamesElem; // Ref till att skriva ut totalt antal spelomgångar
var turnNrElem; // Ref till meddelande för antal "vändor"
var formElem; // Ref till elem för antal valda brickor för spelet
var userAverageElem; // Ref till snittpoäng
var showMore; // Array med ref till a-elem i div-elementet userInfo
var userInfoElem; // Ref till elem för den data som sparas

var gamesPlayed; // "Räknare" för antal gånger användaren spelat
var picsArr;	 // Array med alla bilder
var nextBrickNr; // "Räknare" för antal brickor som vänts
var brick1; // Ref till den första vända brickan
var brick2; // Ref till den andra vända brickan
var turns;	// Variabel för antal par brickor som vänts
var pairs; // Variabel för antal fundna par 
var points; // Ref till antal poäng för spelgång

var nrBricks;



// Funktion som körs då hela sidan är inladdad
// Initierar globala variabler och kopplar funktioner till knappar samt brickor
function init () { 
	var i; // Loop-variabel
	
	gamesPlayed=0; // 0 för första gången användaren spelar
	
	//picsArr =[/*"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20""0","0","1","1","2","2","3","3","4","4","5","5","6","6","7","7", "8", "8", "9", "9","10", "10", "11","11","12", "12","13","13","14","14","15","15","16","16","17","17", "18", "18", "19","19", "20", "20"*]; //Array för alla bilder
	
	startGameBtn = document.getElementById("startGameBtn");
	nextBtn = document.getElementById("nextBtn");
	
	userInfoElem = document.getElementById("userInfo");
	userAverageElem = document.getElementById("userMeanPoints");	
	
	totPointsElem = document.getElementById("userTotPoints");
	totGamesElem = document.getElementById("userCountGames");
		
	showSavedUserInfo(); // Anropar funktion för att visa lagrad användarinfo

	turnNrElem = document.getElementById("turnNr"); 
	
	msgElem = document.getElementById("message"); 
	
	
	brickElems = document.getElementById("bricks").getElementsByTagName("img"); // Array med ref till img-elem
	document.getElementById("bricks").style.width = "280px";
	
	for (i=16; i<brickElems.length; i++){
		if (brickElems === 16){
		brickElems[i].style.display="block"; 
		}
		else{
		brickElems[i].style.display="none";
		}
	}
	
	// Lägger på klick-händelse på a-taggen och kopplar till funktionen för att visa och dölja userMoreInfo
	showMore = document.getElementById("userInfo").getElementsByTagName("a");
	for(i=0; i<showMore.length; i++){
		addListener(showMore[i],"click", showMoreInfo);
	}
	
	formElem = document.getElementById("nrOfBricksMenu");
	
	for (i=0; i<formElem.length; i++){
	if(formElem[i].selected === false){
		numberOfBricks(formElem[0]);
		addListener(startGameBtn,"click",startGame);	
		
	}
	else{
	addListener(formElem,"change", numberOfBricks);
	addListener(formElem,"change", changeWidth); // Kopplar till funktionen changeWidth om användaren väljer att spela med fler än 16 brickor
	}
	}
	
	// Aktivera och inaktivera knappar
	startGameBtn.disabled = false;
	nextBtn.disabled = true;
	
} // End init

addListener(window,"load",init); // Se till att init aktiveras då sidan är inladdad
//Funktion för att ta fram värdet av antalet brickor användaren vill spela med

function numberOfBricks(){
	var i;	var selIndex;
	
//alert("bricks");
	
	selIndex = formElem.selectedIndex;
	
	//Lägger in value för antalet valda brickor ????
	for (i=0; i<formElem.length; i++){
		formElem[0].value=16;
		formElem[1].value=20;
		formElem[2].value=24;
		formElem[3].value=30;
		formElem[4].value=36;
	}
	
	nrBricks = Number(formElem.options[selIndex].value);
	
	for(i=0; i<nrBricks; i++){
		if (brickElems === nrBricks){
		brickElems[i].style.display="none";
		
		}
		else{
		brickElems[i].style.display="block";
		} 
		addListener(startGameBtn,"click",startGame);
	}

}

// Funktion för att kontrollera vilket antal brickor användaren valt att spela med och ändra vidd för div-elementet för samtliga brickor utifrån hur många brickor som valts att spela med
function changeWidth(){
	
	if(formElem.options[1].selected) { //Kontrollerar om valet är 5x4 och ändrar då till width till 350px
	document.getElementById("bricks").style.width = "350px";
	}	
	else { // Annars ändra till 460px
	document.getElementById("bricks").style.width = "460px";
	}
	
}
// Funktion för att starta spelet och ta fram slumpmässiga bilder som via händelsehanterare visas då man "flippar" en bricka
function startGame () {
	var i; // Loop-variabel
	
	pairs=0; // Vid ny omgång sätts pairs till 0
	gamesPlayed+=1; // Räknar upp varje gång en ny omgång startats
	
	startGameBtn.disabled = true; // Avaktiverar startGameBtn då nytt spel startas
	
	picsArr=[/*"0","0","1","1","2","2","3","3","4","4","5","5","6","6","7","7", "8", "8", "9", "9","10", "10", "11","11","12", "12","13","13","14","14","15","15","16","16","17","17", "18", "18", "19","19", "20", "20"*/];
	//for-loop för att gå igenom alla img-taggar och sedan lägga in de slumpmässigt valda bilderna
	for (i=0; i<nrBricks; i++) {
		//if(brickElems[i].style.display==="block"){
		randomPics(brickElems[i]); // Anrop till funktionen randomPics som slumpmässigt placerar ut bilder
		//}
	}
	//debugger;
	for (i=0; i<brickElems.length; i++){ 
		addListener(brickElems[i],"click",flipBricks);
	}
		//debugger;
} // End startGame


// Funktion som slumpmässigt placerar ut bilderna i img-taggarna
//function randomPics(elems) { // elems är ref till img-elem för brickorna
function randomPics(elems) { // elems är ref till img-elem för brickorna
	var picsIndex; // Index till array med alla bilder
	//var copyOfPicsArr;
	var i;
	nextBrickNr=0; // Startar på 0
 	turns=0; // Startar på 0
	var newArr;
	var maxImges;
	
	maxImges=nrBricks/2;
	
	newArr= ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
	//prompt(copyOfPicsArr);
	for(i=0; i<maxImges; i++){
	picsIndex = Math.floor(newArr.length*Math.random());
	//picsArr[i]=newArr[picsIndex];
	//picsArr[i]=newArr[picsIndex];
	//picsArr[i]=newArr[picsIndex];
	//picsArr[i]=newArr[picsIndex];
	//picsArr[i]=newArr[picsIndex];
	//picsArr[i]=newArr[picsIndex];
	picsArr.push(picsIndex, picsIndex);
	//picsArr.push(picsIndex);
	//elems.id = "pics/" + picsArr[i] + ".png";
	//elems.id = "pics/" + picsArr[i] + ".png";
	//picsArr.push(picsIndex);
	
	//elems.id = "pics/" + picsArr[i] + ".png";
	//elems.id = "pics/" + picsArr[i] + ".png";
	//elems.id = "pics/" + picsArr[picsIndex] + ".png";
	//elems.id = "pics/" + newArr[picsIndex] + ".png";
	//newArr.splice(picsIndex, 1);
	elems.id = "pics/" + picsArr[picsIndex] + ".png";
	picsIndex = newArr.pop();
	picsIndex = newArr.pop();
	//elems.id = "pics/" + picsArr[picsIndex] + ".png";
	}
	//elems.id = "pics/" + picsArr[i] + ".png";
	//picsIndex = Math.floor(picsArr.length*Math.random());
	//elems.id = "pics/" + picsArr[picsIndex] + ".png";
	//picsArr.splice(picsIndex,1);
	
	//debugger;
} // End randomPics


// Funktion för att vända brickorna samt lägga in nytt värde för de brickor som är vända
function flipBricks () {
	var i; // Loop-variabel
	
	nextBrickNr++; // Räkna upp med 1 när en bricka vänts
	
	if (nextBrickNr > 2) { // Kontrollera så att endast två brickor är vända
	msgElem.innerHTML = "klicka på nästa"; // Meddelande till användaren 
	return;
	}

	startGameBtn.disabled = true; // Avaktivera startknappen när spelet startats
	
	this.src = this.id;
	
	if(!brick1) { // Om brick1 har ett värde utför nedan
		brick1=this; // Lägger in värdet för den första vända brickan i brick1
		return; // Abryter för att gå vidare till nästa vändning
	}//End-if-sats
	
	else {
		// För att kontrollera att samma bricka ej går att trycka på 2ggr
		if ( this === brick1){
		nextBrickNr=nextBrickNr-1; 
		this.disabled=true;
		nextBtn.disabled = true;
		msgElem.innerHTML= "Du får ej välja samma bricka! Välj en annan bricka";
		return;
		}//End if-sats
		
		
		turns+=1; // Varje gång två brickor vänds räknas det upp som antal gånger ett par brickor vänts
		turnNrElem.innerHTML = turns;
		nextBtn.disabled = false; // Aktivera nextBtn då två brickor vänts
		brick2=this; // Lägger in värdet för den andra vända brickan i brick2
		addListener(nextBtn,"click",checkBricks);
	}// End else-sats
	
} // End flipBricks

// Funktion för att kontrollera värden för de två vända brickorna och byta klass för de som dragits fram som par
function checkBricks () { 
 	var i; // Loop-variabel
	
	nextBrickNr=0; // Återställer nextBrickNr för att sedan kunna påbörja ny vändning
	msgElem.innerHTML=""; // Töm span-taggen vid ny vändning
	
	
	if (brick1.id === brick2.id){	
	alert("rätt");	
	pairs+=1; // Varje gång ett par hittas så räknas det upp som ett par
	brick1.src = "pics/empty.png"; 		
	brick1.className="brickEmpty";		
	brick2.src = "pics/empty.png"; 		
	brick2.className="brickEmpty";
	// Sätt img-taggarna för brickor som är par till oklickbara
	if (brick1.src === brick2.src){
		brick1.style.visibility = "hidden"; // Dölj de img-element med klass brickEmpty
		brick2.style.visibility = "hidden"; // Dölj de img-element med klass brickEmpty
	}
	
	// if-sats för att jämföra om par=antal brickor/2. Då anropas funktionen endGame
	if(pairs===(brickElems.length)/2){
		endGame();
		countPoints();
	} // End if-sats
	
	brick1=null; //Ta bort de "gamla" referenserna för ny vändning
	brick2=null; //Ta bort de "gamla" referenserna för ny vändning
	}	
	
	else {		
	brick1.src = "pics/backside.png"; 			
	brick2.src = "pics/backside.png"; 		
	
	brick1=null; //Ta bort de "gamla" referenserna för ny vändning
	brick2=null; //Ta bort de "gamla" referenserna för ny vändning
	}	
	
	for (i=0; i<userInfoElem.length; i++){
		addListener(userInfoElem[i].nextBtn,"click", countPoints);
		}

} // End checkBricks


// Funktion för då alla par är funna. Ändrar tillbaka brickorna till baksida samt gör dem synliga igen
function endGame(){
		var i; // Loop-variabel
		
		for (i=0; i<brickElems.length; i++) {
		brickElems[i].style.visibility="visible"; 
		brickElems[i].src = "pics/backside.png"; 
		brickElems[i].className = "brickBack";	
		removeListener(brickElems[i],"click",flipBricks);
		}
		
		nextBtn.disabled = true;
		startGameBtn.disabled = false;
		
} // End endGame

// Funktion för att räkna ut poäng samt lägga in data i web storage för att spara till kommande spelomgångar
function countPoints(){
	var totalPoints; // Värdet för totalpoäng
	var totalGames; // Värdet för antalet spelomgångar
	
		
	// Läser av värdet från span taggarna och 
	totalPoints = Number(document.getElementById("userTotPoints").innerHTML);
	totalGames = Number(document.getElementById("userCountGames").innerHTML);
	localStorage.totalPoints = Number(totalPoints);
	localStorage.totalGames = Number(totalGames);
		
		points=parseInt(20-(turns-pairs)*1.2);
		
		if (points > 0) {
		msgElem.innerHTML= "Din poäng för denna spelomgång blev: "+points+" Antalet ett par brickor vänts var:"+turns;
		
		totPointsElem.innerHTML = Number(localStorage.totalPoints)+ Number(points);
		
		totGamesElem.innerHTML = Number(localStorage.totalGames)+1;
		}
		else {
		msgElem.innerHTML= "Din poäng för denna spelomgång blev: 0. Antalet ett par brickor vänts var:"+turns;
		totPointsElem.innerHTML = Number(localStorage.totalPoints);
		totGamesElem.innerHTML = Number(localStorage.totalGames)+1;
		}
	
		
		//Lägger in de nya värdena i web storage
		localStorage.totalPoints = Number(totPointsElem.innerHTML);
		localStorage.totalGames = Number(totGamesElem.innerHTML);
	
} // End countPoints

// Funktion för att ta fram data som sparats i web storage och visa då sidan läses in
function showSavedUserInfo(){
	
	if(localStorage.totalPoints){
		totPointsElem.innerHTML = Number(localStorage.totalPoints);

	}
	else{
		totPointsElem.innerHTML = 0;
	}
	
	if(localStorage.totalGames){
		totGamesElem.innerHTML = Number(localStorage.totalGames);
	}
	else{
		totGamesElem.innerHTML = 0;
	}

	if (localStorage.totalPoints > 0){
	// Räknar ut snittresultat
	userAverageElem.innerHTML = parseInt(Number(localStorage.totalPoints)/Number(localStorage.totalGames));
	}
	else {
		userAverageElem.innerHTML = 0;
	}
	
}// End showSavedUserInfo


// Funktion för att visa och dölja menyn för mer info
// Lägg in ny text i a-taggen när hela info-rutan visas
function showMoreInfo(){
	var showMenu; // Ref till undermenyn för mer info
	
	showMenu = document.getElementById("userMoreInfo");
	if(showMenu.style.display==="block") {
		showMenu.style.display="none";
	}
	else{
		showMenu.style.display="block";
			document.getElementById("userInfo").getElementsByTagName("a")[0].innerHTML = "Visa mindre";
	}
	
	
	
} // End showMoreInfo
	
