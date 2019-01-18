const { Client, Attachment } = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var filter = 1;
var swears = ['fuck', 'shit', 'cunt', 'bitch', 'dick', 'fukk'];
const ownerID = 490266039884578833;
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
    channel.send(`Welcome ${member.user} to our Artificial Intelligence club!  You have taken the first step but not your last into the world of AI and our family. Your mission, should you choose to accept it, is to follow these next instructions:\n1)  Take some time and get familiar with Discord if you are not already\n2) Get comfortable with our club goals in the club-goals channel\n3) Go to the general chat and don't be shy, remember you are family now\n4) If you plan on getting involved and participating in projects post your n# in the server request channel\n5) Pick a project you find interesting in the VOID PROJECT (IDEAS) { } category\n6) Post in that projects channel and start getting involved\n7) Never give up!\n\nStephen Hawking once said, "AI is likely to be either the best or worst thing to happen to humanity," so lets make it the best.\n\nType !help to see a list of bot commands.`);
  });
bot.on("message", function (message) {
	//Bot listens to all messages to check for profanity
	if (filter == 1) {
		var words = message.content.split(/[^A-Za-z]/).join('').toLowerCase();
		for (i = 0; i < swears.length; i++) {
			if (words.includes(swears[i])) {
				message.delete();
				message.reply('<redacted>');
				break;
			}
		}
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