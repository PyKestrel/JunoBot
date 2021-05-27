const fs = require('fs');
const { prefix, token } = require('./config.json');
const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const math = require('mathjs');
const mathsteps = require('mathsteps');
const yts = require( 'yt-search' );
const { json, string, arg } = require('mathjs');
const { strict } = require('assert');
const { Client } = require('discord.js');
const client = new Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES','GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_EMOJIS', 'GUILD_MESSAGE_REACTIONS',"GUILD_VOICE_STATES"]}});


client.once('ready', () => {
	console.log('Ready!');
});

//AUTOCONFIGURATIONS
client.on('guildMemberAdd', function(member){
  let role = member.guild.roles.cache.get("834534724922769488");
  member.roles.add(role.id);
});


client.login(token);

client.on('message', async message => {
    if(message.content === 'whagwan'){
      message.reply("Whagwan Mi Brudda", {
        tts: true
       });
    }
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (command === `server`) {
        message.channel.send(`This server's name is: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    }
    if (command === `whoami`) {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    }
    if (command === 'ping'){
      const msg = await message.channel.send("Pinging...");
      message.reply(msg.createdTimestamp - message.createdTimestamp + 'ms');
      //message.channel.send('Ping: ' + Date.now() - message.createdTimestamp + 'ms');
    }
    if (command === "hiphop") {
        var VC = message.member.voice.channel;
        if (!VC)
            return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL")
        VC.join()
        .then(connection => {
            const dispatcher = connection.play("http://icecast.omroep.nl/funx-hiphop-bb-mp3",{type: 'unknown'});
            dispatcher.on("finish", finish => {VC.leave()});
        })
        .catch(console.error);
    };
    if (command === "latin") {
        var VC = message.member.voice.channel;
        if (!VC)
            return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL")
        VC.join()
        .then(connection => {
            const dispatcher = connection.play("http://icecast.omroep.nl/funx-latin-sb-aac",{type: 'unknown'});
            dispatcher.on("finish", finish => {VC.leave()});
        })
        .catch(console.error);
    };
    //Play Radio Station
    if (command === "radio"){
        const args = message.content.slice(prefix.length).split(' ');
        if(args[1].search('help') != -1){
            message.reply({embed: {
                color: 3447003,
                title: 'Radio Help',
                fields: [{
                    name: "Stream Radio",
                    value: 'The Radio Command Allows Us to Stream Live Radio, Although Only Certain Links Are Supported Which Can Be Found Using The Link Below'
                  },
                  {
                    name: "Supported Links",
                    value: 'https://deluuxe.dev/streamlinks.html'
                  },
                  {
                    name: "Example",
                    value: 'pyplay http://icecast.omroep.nl/funx-hiphop-bb-mp3'
                  }
                ]
              }});
        }
        else{
            var VC = message.member.voice.channel;
            if (!VC)
                return message.reply("MESSAGE IF NOT IN A VOICE CHANNEL")
            VC.join()
            .then(connection => {
                const dispatcher = connection.play(args[1],{type: 'unknown'});
                dispatcher.on("finish", finish => {VC.leave()});
            })
            .catch(console.error);}
    };
    //Disconnect Bot From Voice Channel
    if (command === "disconnect" || command === "dc"){
        message.member.voice.channel.leave();
    };




    //Play YouTube Songs Using Links Or Key Words
    if (command === "play" || command ==="p") {
      const args = message.content.slice(prefix.length).split(' ');
      //CHECK FOR HELP COMMAND
      if(args[1].search('help') != -1){
          message.reply({embed: {
              color: 3447003,
              title: 'Play Help',
              fields: [{
                  name: "Youtube Search",
                  value: 'The Play Command Allows Us To Search Up Songs On YouTube, We Recommend The Name Of The Song And Artist'
                },
                {
                  name: "Example",
                  value: 'pyplay Dior Pop Smoke'
                },
                {
                  name: "YouTube Links",
                  value: 'The Play Command Also Allows Us To Use Direct YouTube Links'
                },
                {
                  name: "Example",
                  value: 'pyplay https://www.youtube.com/watch?v=oorVWW9ywG0'
                },
              ]
            }});
      }
      else{
        //CHECK IF COMMAND CONTAINS YT LINK
        if (ytdl.validateURL(args[1])){
          var VC = message.member.voice.channel;
          if (!VC)
            return message.reply("You're Not In A Voice Channel")
          else{
          VC.join()
          .then(connection => {
          const stream = ytdl(args[1], { filter : 'audioonly', highWaterMark: 50 });
          const dispatcher = connection.play(stream,{type: 'unknown'});
          dispatcher.on("finish", finish => {
            VC.leave();
          });
          }).catch(console.error); 
          }
        }
        //SEARCH YT FOR VIDEO
        else{
          var fullLink;
          const args = message.content.slice(prefix.length).split(' ');
          var VC = message.member.voice.channel;
          if (!VC)
            return message.reply("You're Not In A Voice Channel");
          else
          var i;
          var query;
          for(i =1; i < args.length; i++){
              query += args[i] + " ";
          }
          const r = await yts(query)
          const videos = r.videos
          fullLink = videos[0].url;
    message.reply({embed: {
              color: 3447003,
              title: "Video Details",
              fields: [{
                  name: videos[0].title,
                  value: videos[0].duration.timestamp
                },
        {
                  name: "Link",
                  value: videos[0].url
                }
              ]
            }});
      VC.join()
      .then(connection => {
          const stream = ytdl(fullLink, { filter : 'audioonly', highWaterMark: 50 });
          const dispatcher = connection.play(stream,{type: 'unknown'});
          dispatcher.on("finish", finish => {VC.leave();});
      })
      .catch(console.error);
      }

      }
  };
    //Rate My Professor
    if (command === "rmp") {
        const args = message.content.slice(prefix.length).split(' ');
        if(args[1].search('help') != -1){
            message.reply({embed: {
                color: 3447003,
                title: 'Rate My Professor Help',
                fields: [{
                    name: "Rate My Professor Search",
                    value: 'The rmp Command Allows Us To Search For A Professor, Currently Only City Tech Is Supported But Full Support Will Be Availiable Soon'
                  },
                  {
                    name: "Syntax",
                    value: 'pyrmp Henry Africk'
                  }
                ]
              }});
        }
        else{
        var name = args[1] + " " + args[2];
        var rating;
        var url = "https://www.ratemyprofessors.com/search.jsp?queryBy=schoolId&schoolName=New+York+City+College+of+Technology&schoolID=230&queryoption=TEACHER";
        message.reply("Ok Gimme A Sec <3");
        scrape(url);
        async function scrape(x){
            const chromeOptions = {
                headless:true,
                defaultViewport: null,
                executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            };

            function delay(time) {
                return new Promise(function(resolve) { 
                    setTimeout(resolve, time)
                });
            }
        
            const browser = await puppeteer.launch(chromeOptions);
            const page = await browser.newPage();
            await page.goto(x);
            await page.type("#professor-name", name);
            await delay(3000);
            await page.waitForSelector('span.name');
            var element = await page.$('.rating');
            rating = await page.evaluate(element => element.textContent, element);
            element = await page.$('span.info');
            info = await page.evaluate(element => element.textContent, element);

            message.reply({embed: {
                color: 3447003,
                title: name,
                fields: [{
                    name: "Overall Rating",
                    value: rating
                  },
                  {
                    name: "Number Of Ratings",
                    value: info
                  }
                ]
              }});
        };}
    };

    if (command === "math") {
        const args = message.content.slice(prefix.length).split(' ');
        var j;
        var problem = '';
        if(problem.search('steps') != -1){
            problem = '';
            for(j = 2; j < args.length; j++){
                problem += args[j] + " ";
            }
            console.log(problem);
            if (problem.search('=') != -1){
                console.log(problem);
                var steps = mathsteps.simplifyExpression(problem);
                message.reply(steps.forEach(step => {return "before change: " + step.oldNode.toString() + "change: " + step.changeType + "after change: " + step.newNode.toString() + "# of substeps: " + step.substeps.length})); 
            }
            else{
                var steps = mathsteps.solveEquation(problem);
                message.reply(steps.forEach(step => {return "before change: " + step.oldNode.toString() + "change: " + step.changeType + "after change: " + step.newNode.toString() + "# of substeps: " + step.substeps.length}));
            }
            
        }
        else{
            problem = '';
            for(j = 1; j < args.length; j++){
                problem += args[j] + " ";
            }
            message.reply(math.evaluate(problem));
        }
    };


    if(command === 'mathsteps'){
        const args = message.content.slice(prefix.length).split(' ');
        var j;
        var problem = '';
        for(j = 1; j < args.length; j++){
            problem += args[j] + " ";
        }
        if(args[1].search('help') != -1){
            message.reply({embed: {
                color: 3447003,
                title: 'MathSteps Help',
                fields: [{
                    name: "Equations",
                    value: 'For Equations, Make Sure That You Have Correctly Entered A Problem & That Your Equal Sign Is To The Right Hand Side'
                  },
                  {
                    name: "Example",
                    value: '2x+5 = 15 NOT 15 = 2x + 5'
                  },
                  {
                    name: "Expressions",
                    value: 'Make Sure To Leave Spaces Between Numbers/Operands/Variables'
                  },
                  {
                    name: "Example",
                    value: '2 x + 2 x + x + x NOT 2x + 2x + x + x'
                  },
                ]
              }});
        }
        else{
            console.log(problem.search('='));
            if (problem.search('=') != -1){
                const steps = mathsteps.solveEquation(problem);
                steps.forEach(step => {
                    message.reply("before change: " + step.oldEquation.ascii());  
                    message.reply("change: " + step.changeType);                  
                    message.reply("after change: " + step.newEquation.ascii());   
                });
            }
            else{
                const steps = mathsteps.simplifyExpression(problem);
                console.log(steps)   
                steps.forEach(step => {
                    message.reply("before change: " + step.oldNode.toString());
                    message.reply("change: " + step.changeType);                  
                    message.reply("after change: " + step.newNode.toString());    
                    message.reply("# of substeps: " + step.substeps.length);      
                });
            }
        }
    }


    if(command === "translate"){
        var url = "https://translate.google.com/#view=home&op=translate&sl=auto&tl=en";
        const args = message.content.slice(prefix.length).split(' ');
        var j;
        var problem = '';
        for(j = 1; j < args.length; j++){
            problem += args[j] + " ";
        }
        if(args[1].search('help') != -1){
            message.reply({embed: {
                color: 3447003,
                title: 'Language ISO`s',
                fields: [{
                    name: "English",
                    value: 'en'
                  },
                  {
                    name: "Spanish",
                    value: 'es'
                  },
                  {
                    name: "Chinese (Simplified)",
                    value: 'zh-CN'
                  },
                  {
                    name: "Dutch",
                    value: 'nl'
                  },
                  {
                    name: "Bengali (Bangla)",
                    value: 'bn'
                  },
                  {
                    name: "Russian",
                    value: "ru"
                  },
                  {
                    name: "More",
                    value: 'https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes'
                  },
                  {
                    name: "Syntax Example (Translate From English To Spanish):",
                    value: 'pytranslate !es Hello World'
                  }
                ]
              }});
        }
        else{
        if(args[1].search('!') != -1){
            var lang = args[1].replace('!',''); 
            url = "https://translate.google.com/#view=home&op=translate&sl=auto&tl=" + lang;
        };
        scrape(url);
        async function scrape(x){
          try{
            const chromeOptions = {
                headless:true,
                defaultViewport: null,
                executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            };

            function delay(time) {
                return new Promise(function(resolve) { 
                    setTimeout(resolve, time)
                });
            }
           
            const browser = await puppeteer.launch(chromeOptions);
            const page = await browser.newPage();
            await page.goto(x);
            await page.type('#source', problem);
            await delay(2000);

            let element = await page.$('body > div.container > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-results-container.results-container > div.tlid-result.result-dict-wrapper > div.result.tlid-copy-target > div.text-wrap.tlid-copy-target > div > span.tlid-translation.translation');
            let translation = await page.evaluate(element => element.textContent, element);
            message.reply(translation);}catch{
              message.reply("Sorry I Couldnt Translate At This Time")
              console.error();
            }
          
          }
    }
}

if(command === "wiki"){
    const args = message.content.slice(prefix.length).split(' ');
    var url = "https://www.wikipedia.org/";
    var j;
    var problem = '';
    for(j = 1; j < args.length; j++){
        problem += args[j] + " ";
    }
    console.log("Searching For: " + problem);

    scrape(url);
    async function scrape(x){
        const chromeOptions = {
            headless:true,
            defaultViewport: null,
            executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        };

        function delay(time) {
            return new Promise(function(resolve) { 
                setTimeout(resolve, time)
            });
        }
       
        const browser = await puppeteer.launch(chromeOptions);
        const page = await browser.newPage();
        await page.goto(x);
        console.log("Running Your Search");
        await page.type('#searchInput', problem);
        await page.click("#search-form > fieldset > button > i");
        await delay(2000);
        await page.screenshot({ path: 'debug.jpg', type: 'jpeg' });
        let element = await page.$('#firstHeading');
        let heading = await page.evaluate(element => element.textContent, element);

        let element2 = await page.$('#mw-content-text > div');
        let info = await page.evaluate(element2 => element2.textContent, element2);

        var infoForm = info.substring(0, 1024);
        var infoForm2 = info.substring(1024, 2048);

        const images = await page.evaluate(() => Array.from(document.images, e => e.src));

        var current = page.url();

        message.reply({embed: {
            color: 3447003,
            title: 'Wiki Search',
            thumbnail: {
                url: images[0],
            },
            fields: [{
                name: heading,
                value: infoForm
              },
              {
                name: "Continued",
                value: infoForm2
              },
              {
                name: "Wiki Link",
                value: current
              },
            ]
          }});
    }
}

if(command === "define"){
  const args = message.content.slice(prefix.length).split(' ');
  var j;
  var problem = '';
  for(j = 1; j < args.length; j++){
      problem += args[j] + "";
  }
  var url = "https://www.urbandictionary.com/define.php?term=" + problem;
  console.log("Searching For: " + problem);

  scrape(url);
  async function scrape(x){
      const chromeOptions = {
          headless:true,
          defaultViewport: null,
          executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
      };

      function delay(time) {
          return new Promise(function(resolve) { 
              setTimeout(resolve, time)
          });
      }
     
      const browser = await puppeteer.launch(chromeOptions);
      const page = await browser.newPage();
      await page.goto(x);
      console.log("Running Your Search");
      await delay(2000);
      await page.screenshot({ path: 'debug.jpg', type: 'jpeg' });
      let element = await page.$('#content > div:nth-child(1) > div.def-header');
      let heading = await page.evaluate(element => element.textContent, element);

      let element2 = await page.$('#content > div:nth-child(1) > div.meaning');
      let info = await page.evaluate(element2 => element2.textContent, element2);

      //const images = await page.evaluate(() => Array.from(document.images, e => e.src));

      console.log("Its Coming");
      var current = page.url();
      console.log(current);

      message.reply({embed: {
          color: 3447003,
          title: 'Urban Dictionary Search',
          fields: [{
              name: heading,
              value: info
            },
            {
              name: "Link",
              value: current
            }
          ]

        }});
  }
}


if(command === "pirate"){
  const args = message.content.slice(prefix.length).split(' ');
  var j;
  var problem = '';
  for(j = 1; j < args.length; j++){
      problem += args[j] + " ";
  }
  var url = "https://1337x.to/";
  console.log("Searching For: " + problem);

  scrape(url);
  async function scrape(x){
      const chromeOptions = {
          headless:true,
          defaultViewport: null,
          executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
      };

      function delay(time) {
          return new Promise(function(resolve) { 
              setTimeout(resolve, time)
          });
      }
     
      const browser = await puppeteer.launch(chromeOptions);
      const page = await browser.newPage();
      await page.goto(x);
      console.log("Running Your Search");
      await delay(2000);
      await page.type('#autocomplete',problem);
      await page.click('#search-index-form > button');
      await page.screenshot({ path: 'debug.jpg', type: 'jpeg' });
      await delay(2000);
      let element = await page.$('body > main > div > div > div > div.box-info-detail.inner-table > div.table-list-wrap > table > tbody > tr:nth-child(1) > td.coll-1.name > a:nth-child(2)');
      let name = await page.evaluate(element => element.textContent, element);

      let element2 = await page.$('body > main > div > div > div > div.box-info-detail.inner-table > div.table-list-wrap > table > tbody > tr:nth-child(1) > td.coll-2.seeds');
      let seeders = await page.evaluate(element2 => element2.textContent, element2);

      let element3 = await page.$('body > main > div > div > div > div.box-info-detail.inner-table > div.table-list-wrap > table > tbody > tr:nth-child(1) > td.coll-3.leeches');
      let leechers = await page.evaluate(element3 => element3.textContent, element3);

      let element5 = await page.$('body > main > div > div > div > div.box-info-detail.inner-table > div.table-list-wrap > table > tbody > tr:nth-child(1) > td.coll-1.name > a:nth-child(2)');
      let link = await page.evaluate(element5 => element5.href, element5);

      //const images = await page.evaluate(() => Array.from(document.images, e => e.src));

      console.log("Its Coming");
      var current = page.url();
      console.log(current);

      message.reply({embed: {
          color: 3447003,
          title: 'What We Found (Top Result)',
          fields: [{
              name: name,
              value: ' Seeders: ' + seeders + ' Leechers: ' + leechers
            },
            {
              name: "Link",
              value: link
            }
          ]

        }});
  }
}

if(command === 'books'){
  const args = message.content.slice(prefix.length).split(' ');
  var j;
  var problem = '';
  for(j = 1; j < args.length; j++){
      problem += args[j] + " ";
  }
  var url = "https://libribook.com/";
  scrape(url);
  async function scrape(x){
      const chromeOptions = {
          headless:true,
          defaultViewport: null,
          executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
      };

      function delay(time) {
          return new Promise(function(resolve) { 
              setTimeout(resolve, time)
          });
      }
     
      const browser = await puppeteer.launch(chromeOptions);
      const page = await browser.newPage();
      await page.goto(x);
      console.log("Running Your Search");
      await delay(2000);
      await page.type('#CheckBook',problem);
      await page.click('body > div.container-wrapper > div.main-wrapper.scrollspy-container > div.hero > div > div > div > form > div > span.input-group-btn > button');
      await delay(2000);
      let element = await page.$('body > div.container-wrapper > div.main-wrapper.scrollspy-container > div.equal-content-sidebar-wrapper > div > div > div > div.GridLex-col-9_sm-8_xs-12_xss-12 > div > div.course-item-wrapper.alt-bg-light.clearfix > div > div.GridLex-grid-noGutter-equalHeight > div:nth-child(1) > div > a > div.course-item-content > h3');
      let title = await page.evaluate(element => element.textContent, element);

      let element2 = await page.$('body > div.container-wrapper > div.main-wrapper.scrollspy-container > div.equal-content-sidebar-wrapper > div > div > div > div.GridLex-col-9_sm-8_xs-12_xss-12 > div > div.course-item-wrapper.alt-bg-light.clearfix > div > div.GridLex-grid-noGutter-equalHeight > div:nth-child(1) > div > a > div.course-item-content > p');
      let description = await page.evaluate(element2 => element2.textContent, element2);

      let element3 = await page.$('body > div.container-wrapper > div.main-wrapper.scrollspy-container > div.equal-content-sidebar-wrapper > div > div > div > div.GridLex-col-9_sm-8_xs-12_xss-12 > div > div.course-item-wrapper.alt-bg-light.clearfix > div > div.GridLex-grid-noGutter-equalHeight > div:nth-child(1) > div > a > div.course-item-image > img');
      let image = await page.evaluate(element3 => element3.src, element3);

      let element4 = await page.$('body > div.container-wrapper > div.main-wrapper.scrollspy-container > div.equal-content-sidebar-wrapper > div > div > div > div.GridLex-col-9_sm-8_xs-12_xss-12 > div > div.course-item-wrapper.alt-bg-light.clearfix > div > div.GridLex-grid-noGutter-equalHeight > div:nth-child(1) > div > a');
      let link = await page.evaluate(element4 => element4.href, element4);
      //const images = await page.evaluate(() => Array.from(document.images, e => e.src));
      message.reply({embed: {
          color: 3447003,
          title: 'Results',
          thumbnail: {url:image},
          fields: [{
              name: title,
              value: description
            },
            {
              name: "Link",
              value: link
            }
          ]

        }});
  }
}

if(command === 'download'){
  var url = "https://libribook.com/";
  scrape(url);
  async function scrape(x){
      const chromeOptions = {
          headless:true,
          defaultViewport: null,
          executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
      };

      function delay(time) {
          return new Promise(function(resolve) { 
              setTimeout(resolve, time)
          });
      }
     
      const browser = await puppeteer.launch(chromeOptions);
      const page = await browser.newPage();
      await page.goto(x);
      console.log("Running Your Search");
      var all = document.getElementsByTagName("a");
      for (var i=0, max=all.length; i < max; i++) {
      // Do something with the element here
      }

  }

}

//Private DM
if(command === "private"){
  message.author.send("We Now Have A Private Session <3");
}

/* ROLE MODERATION */
if(command === "nsfw"){
  let role = message.member.guild.roles.cache.find(role => role.name === "NSFW");
  if (message.member.roles.cache.has(role.id)){
    message.reply("You already have this role")
  }
  else {
    message.member.roles.add(role.id);
  }
}

if(command === "reactionroles" && message.member.hasPermission('ADMINISTRATOR')){
  const msg = await message.channel.send({
    embed: {
      image: {
        url: 'https://i.imgur.com/3MbkPId.png'
      },
      title: "Its Time To Role Up",
      description: "🕹 **Gamer**: You Into Video Games? Well use this role to get access to our gaming channels where you can meet and chat with fellow gamers. We also give you the latest updates in the gaming world and all you need to do is react with 🕹. \n\n 🔞 **NSFW**: We understand that not everyone wants to see NSFW content so react to thsi role with a 🔞 to get access to the available NSFW channels. \n\n **More To Come Soon!**",
      color: 	1752220,
      footer: {
        icon_url: "https://cdn.discordapp.com/app-icons/827310463804768266/630e55b5f005abe0b917d8114e6c6710.png?size=512",
        text: "Enjoy your stay here!"
      }
    } 
  });

  msg.react('🕹').then(msg.react("🔞"));
  message.delete();
}


/* Reaction Role */

client.on('messageReactionAdd', async function(reaction, user){
  if(reaction.message.partial) await reaction.message.fetch()
  if(reaction.partial) await reaction.fetch()
  if(user.bot) return
  if(reaction.message.channel.id == "834846676203339818"){
    if(reaction.emoji.name == "🕹") await reaction.message.guild.members.cache.get(user.id).roles.add("834964933635735630");
    if(reaction.emoji.name == "🔞") await reaction.message.guild.members.cache.get(user.id).roles.add("706964017029185609");
  }
});

client.on('messageReactionRemove', async function(reaction, user){
  if(reaction.message.partial) await reaction.message.fetch()
  if(reaction.partial) await reaction.fetch()
  if(user.bot) return

  if(reaction.message.channel.id == "834846676203339818"){
    if(reaction.emoji.name == "🕹") await reaction.message.guild.members.cache.get(user.id).roles.remove("834964933635735630");
    if(reaction.emoji.name == "🔞") await reaction.message.guild.members.cache.get(user.id).roles.remove("706964017029185609");
  }
});

/* Add Reaction Role */














});



