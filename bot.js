const { Client, Attachment } = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var filter = 1;
var swears = ['fuck', 'shit', 'cunt', 'bitch', 'dick', 'fukk'];
const ownerID = 490266039884578833;
var user;
//Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
	colorize: true
});
logger.level = 'debug';
//Initialize Discord Bot
var bot = new Client();
bot.login(auth.token);

bot.on('ready', function (evt) {
	logger.info('Connected');
});
bot.on("guildMemberAdd", member => {
    const channel = member.guild.channels.find(ch => ch.name === 'general');
    if (!channel) return;
    channel.send(`Welcome ${member.user} to our Artificial Intelligence club!  You have taken the first step but not your last into the world of AI and our family.\n\nGo to #welcome to learn more about our club.\n\nType !help to see a list of bot commands.`);
  });
bot.on("message", function (message) {
	//Bot listens to all messages to check for profanity
	var words = message.content.split(/[^A-Za-z]/).join('').toLowerCase();
	if (filter == 1) {
		for (i = 0; i < swears.length; i++) {
			if (words.includes(swears[i])) {
				message.delete();
				message.reply('<redacted>');
				break;
			}
		}
	}
	if (words.includes('dude')) {
		message.reply('bro');
	}
	
	//Our bot needs to know if it will execute a command
	//It will listen for messages that start with '!'
	if (message.content.substring(0,1) == '!') {
		var args = message.content.substring(1).split(' ');
		var cmd = args[0];
		var poll = [];
		
		args = args.splice(1);
		switch(cmd) {
			//!ping
			case 'ping':
				message.channel.send('pong!');
				break;
			//!server
			case 'server':
				message.channel.send('cis-gpu1.ccec.unf.edu');
				break;
			case 'atme':
				message.reply(args.join(' '));
				message.delete();
				break;
			case 'dontatme':
				message.reply(':middle_finger:');
				break;
			case 'meme':
				var fullurl = "https://www.reddit.com/r/programmerhumor.json";
				var json = JSON.parse(Get(fullurl));
				var postToPick = parseInt(Math.random() * 24) + 1;
				var listings = json.data.children;
				var post = listings[postToPick];
				message.channel.send(post.data.url);
				break;
			case 'news':
				var topurl = "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
				var json = JSON.parse(Get(topurl));
				var story = json[parseInt(Math.random() * 500)];
				var posturl = "https://hacker-news.firebaseio.com/v0/item/" + story + ".json?print=pretty";
				json = JSON.parse(Get(posturl));
				console.log(json);
				message.channel.send(json.title + '\n' + json.url);
				break;
			case 'stackoverflow':
				message.channel.send("https://stackoverflow.com/search?q=" + args.join('+'));
				break;
			case 'togglefilter':
				if (filter == 1) {
					filter = 0;
					message.channel.send('filter off');
				} else {
					filter = 1;
					message.channel.send('filter on');
				}
				break;
			case 'canadianize':
				var msg = args.join(' ');
				msg = msg.split('?').join(', eh?');
				var end = parseInt(Math.random() * 3);
				switch (end) {
					case 0:
						msg = msg.split('.').join('. Whoa!');
						break;
					case 1:
						msg = msg.split('.').join('. Whoa, eh!');
						break;
					case 2:
						msg = msg.split('.').join('. Beauty!');
						break;
				}
				message.channel.send(msg + ' Sorry.');
				break;
			case 'rip':
				const attachment = new Attachment('https://i.imgur.com/w3duR07.png');
				message.channel.send(attachment);
				break;
			case 'f':
				const attachment2 = new Attachment('https://i.imgur.com/dmyRFNV.gif');
				message.channel.send(attachment2);
				break;
			case 'help':
				message.channel.send('COMMAND LIST\n------------\n!ping\n!server\n!f\n!rip\n!atme {string}\n!dontatme\n!meme\n!news\n!stackoverflow {string}\n!togglefilter\n!canadianize {string}');
				break;
			case 'eval':
				if(message.author.id != ownerID) return;
				try {
					const code = args.join(" ");
					let evaled = eval(code);
 
					if (typeof evaled !== "string")
					evaled = require("util").inspect(evaled);
 
					message.channel.send(clean(evaled), {code:"xl"});
				} catch (err) {
					message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
				}
				break;
			case 'kick':
				if(!message.member.roles.find("name", "Moderator")) return;
				user = message.mentions.users.first();
				// If we have a user mentioned
				if (user) {
					// Now we get the member from the user
					const member = message.guild.member(user);
					// If the member is in the guild
					if (member) {
					/**
					* Kick the member
					* Make sure you run this on a member, not a user!
					* There are big differences between a user and a member
					*/
						member.kick('You have been kicked from the AIRO Discord').then(() => {
						// We let the message author know we were able to kick the person
						message.reply(`Successfully kicked ${user.tag}`);
						}).catch(err => {
						// An error happened
						// This is generally due to the bot not being able to kick the member,
						// either due to missing permissions or role hierarchy
						message.reply('I was unable to kick the member');
						// Log the error
						console.error(err);
						});
					} else {
						// The mentioned user isn't in this guild
						message.reply('That user isn\'t in this guild!');
					}
				// Otherwise, if no user was mentioned
				} else {
					message.reply('You didn\'t mention the user to kick!');
				}
				break;
			case 'ban':
				if(!message.member.roles.find("name", "Moderator")) return;
				user = message.mentions.users.first();
				if (user) {
					const member = message.guild.member(user);
					if (member) {
						member.ban({
							reason: 'Bad stuff',
						}).then(() => {
							message.reply('Successfully banned ${user.tag}');
						}).catch(err => {
							message.reply('I was unable to ban the member');
							console.error(err);
						});
					} else {
						message.reply('That user isn\'t in this guild!');
					}
				} else {
					message.reply('You didn\'t mention the user to ban!');
				}
				break;
			case 'discomods':
				let theRole = message.guild.roles.find(role => role.name === "Moderator");
				for (i = 0; i < 50; i++) {
					let random = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
					theRole.edit({color: random});
					sleep(10);
				}
				theRole.edit({color: "#1abc9c"});
        }
	}
});
function Get(yourUrl){
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open("GET",yourUrl,false);
	Httpreq.send(null);
	return Httpreq.responseText;          
}
function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}