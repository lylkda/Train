  var config = {
  	apiKey: "AIzaSyB7g004KxfgNddtKb7PV5SZWF-K7DDHgp4",
  	authDomain: "fir-1e2ee.firebaseapp.com",
  	databaseURL: "https://fir-1e2ee.firebaseio.com",
  	projectId: "fir-1e2ee",
  	storageBucket: "fir-1e2ee.appspot.com",
  	messagingSenderId: "238898287591"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var connectionsRef = database.ref("/connections");
  var connectedRef = database.ref(".info/connected");
  connectedRef.on("value", function(snap){
    if (snap.val()){
      var con = connectionsRef.push(true);
      con.onDisconnect().remove();
    }
  })//End on value

connectionsRef.on("value", function(snap) {

  $("#connected-viewers").text(snap.numChildren());
});//End on value

  $("#add-train-btn").on("click", function(event){
  	event.preventDefault();

  	var trName = $("#name-input").val().trim();
  	var trDest = $("#destination-input").val().trim();
  	var trTime = moment($('#time-input').val().trim(), "HH:mm").format("hh:mmA");
  	var trFreq = $('#frequency-input').val().trim();

  	var newTrain = {
  		name: trName,
  		dest: trDest,
  		time: trTime,
  		frequency: trFreq
  	}

  	database.ref().push(newTrain);

  	console.log(newTrain.name + ", " + newTrain.dest + ", " + newTrain.time + ", " + newTrain.frequency);
  	alert("Train added, Commander.");

  	$("#name-input").val("");
  	$("#destination-input").val("");
  	$("#time-input").val("");
  	$("#frequency-input").val("");
  }) //End on click


  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  	var trName = childSnapshot.val().name;
  	var trDest = childSnapshot.val().dest;
  	var trTime = childSnapshot.val().time;
  	var trFreq = childSnapshot.val().frequency;

        var TimeConverted = moment(trTime, "HH:mm").subtract(1, "years");
    console.log(TimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(TimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trFreq;
    console.log(tRemainder);

    // Minute Until Train
    var minAway = trFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minAway);

    // Next Train
    var nArrival = moment().add(minAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nArrival).format("HH:mm"));

if (trName){ //prevents connection from appending
  	$("#train-schedule > tbody").append("<tr><td>" + trName + "</td><td>" + trDest + "</td><td>" +
  		   trFreq + "</td><td>" + moment(nArrival).format("hh:mm A") + "</td><td>" + minAway + "</td></tr>")
  }
  })