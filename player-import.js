/*
	Request madden data from spreadsheet (https://docs.google.com/file/d/0B3UtEYGaz83gTHFra2hrR0VWR1U/edit) and then insert all of the team and player data into a mogo DB.
*/
var spreadSheetKey = '1-6XFD4QDoMcPSqo2WeY_o8LWM1LYI_GA6Z-FV6T4oY4';
var dbUri = 'mongodb://localhost:27017/madden15-dev';

var MongoClient = require('mongodb').MongoClient;
var GoogleSpreadsheets = require("google-spreadsheets");
var players = 0;

var teamSheets;
var teams = [];
var dbCollection;

connectToDb(function(err, collection){
	if (err) return console.log(err);

	getSpreadsheetData(function(err, spreadsheet){
		if (err) return console.log(err);

		// getTeamData(spreadsheet.worksheets, function(err, team){
		// 	if (err) return console.log(err);

		// 	getPlayerData(team, function(err, player){
		// 		if (err) console.log(err);

		// 		collection.insert(player, function(err, inserted){
		// 			if (err) return console.log(err);

		// 			//Player imported
		// 		});
		// 	});
		// });
		teamSheets = spreadsheet.worksheets;
		dbCollection = collection;
		return getTeamData(teamSheets.shift());
	});
});

// function getPlayerData(team, cb) {
// 	//Loop through each player
// 	team.forEach(function(player){
// 		//Cleanup Data
//     	player.team = team.title;
//     	delete player.id;
//     	delete player.updated;
//     	delete player.title;
//     	delete player.content;

//     	cb(null,player);
// 	});
// }

function teamsDone(){
	return console.log('All Teams Done');
}

function playersDone(team){
	return console.log('Players Done for ' + team.title);
}

function getPlayerData(player, team) {
	if(player){
		//Cleanup Data
    	player.team = team.title;
    	delete player.id;
    	delete player.updated;
    	delete player.title;
    	delete player.content;
    	//getPlayerData(rows.shift(), team);
		dbCollection.insert(player, function(err, inserted){
			if (err) return console.log(err);
			//Player imported
			//return playersDone(team);
			getPlayerData(teams[team.title].shift(), team);
		});
	}else {
		return playersDone(team);
	}
}

function getTeamData(team) {
	//Loop through each team (worksheet)
	if(team) {
		console.log(team.title);
		//Get teams rows (players)
		team.rows({},function(err, rows) {
			teams[team.title] = rows;
			getPlayerData(teams[team.title].shift(), team);
			getTeamData(teamSheets.shift());
		});
	} else {
		return teamsDone();
	}
}

// function getTeamData(teams, cb) {
// 	//Loop through each team (worksheet)
// 	teams.forEach(function(team){
// 		//Get teams rows (players)
// 		team.rows({},function(err, rows) {
// 			cb(null, rows);
// 		});
// 	});
// }

function getSpreadsheetData(cb) {
	GoogleSpreadsheets({
	    key: spreadSheetKey
	}, function(err, spreadsheet) {
		if (err) return cb(new Error(err));
		console.log(spreadsheet.title + " Loaded");
		console.log('Teams (' + spreadsheet.worksheets.length + '):');

		cb(null, spreadsheet);
	});
}

function connectToDb(cb) {
	// Connect to the db
	MongoClient.connect(dbUri, function(err, db) {
  		if(err) return cb(new Error(err));
  		console.log('Connected to DB');
  		db.createCollection('players', function(err, collection) {
  			cb(null, collection);
  		});

  	});
}