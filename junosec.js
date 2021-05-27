/* SECURITY */
//Pass Generator
if (command === "gen"){
    const args = message.content.slice(prefix.length).split(' ');
    var leng = 0;
    if(args[1] === undefined){
        leng = 16;
    }
    else{
        leng = parseInt(args[1]);
    }
    var length = leng
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&'*+,-./:;=?@~"
    var val = "";
      for (var i = 0; i < length; i++) {
          val += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      message.author.send("Random Pass: "+val);
  }
  
  //HaveIBeenPwned
  if(command === "pwned"){
    const args = message.content.slice(prefix.length).split(' ');
    if(args[1].search('help') != -1){
      message.reply({embed: {
        color: 3447003,
        title: 'Pwned Help',
        fields: [{
            name: "Avast Hack Check Service",
            value: 'This Command Allows You to Check For Compromised Email Accounts By Using Avasts Hack Check Site. This Service Will Email You The Results To The Email That Was Provided' 
          },
          {
            name: "Information On Avast Hack Check",
            value: "https://www.avast.com/hackcheck/"
          }
        ]
      }});
    }
    else{
    
    var j;
    var email = args[1];
    var url = 'https://www.avast.com/hackcheck/';
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
        await page.type('#app > main > section.section-check-email > section > div > form > div > input[type=email]', email);
        await page.click('#app > main > section.section-check-email > section > a');
        await delay(2000);
        message.reply({embed: {
            color: 3447003,
            title: 'Avast Hack Check',
            fields: [{
                name: "Proceed To Your Email",
                value: 'This Service Uses Avasts Hack Check Engine To See If Your Email & Passwords Have Been Compromised.\nThe Information is Kept Private And Is Emailed To The Email That You Provided.\nProceed To Your Email To View Your Results.'
              },
              {
                name: "Information On Avast Hack Check",
                value: "https://www.avast.com/hackcheck/"
              }
            ]
  
          }});}
    }
    
  
  }
  //GitPwned
  //Password Breaker
  if (command === 'crack'){
    if(message.member.id.localeCompare('213360430284800010') != 0){
      message.reply('You Dont Have The Permission To Use This Command');
    }
    else{
    const args = message.content.slice(prefix.length).split(' ');
    var file = fs.readFileSync('rockyou.txt','utf8');
      strtoarray = file.split('\n');
      newpass = strtoarray;
      var i;
      message.reply('This Might Take Sec <3');
      for(i=0; i < 14344392; i++){
          var hash = crypto.createHash('sha256').update(newpass[i].replace(/\s/g, "")).digest('hex');
          if(hash.search(args[1]) != -1){
            message.reply("Cracked Password: "+newpass[i]);
            break;
          }
          else{
              continue;
          }
      }
      message.reply("Task Completed!");
    }
  }
  
  
  //HashMaker
  if (command === "sha256"){
    const args = message.content.slice(prefix.length).split(' ');
    if(args[1].search('help') != -1){
      message.reply({embed: {
        color: 3447003,
        title: 'SHA-256 Help',
        fields: [{
            name: "SHA-256 Hash Algorithm",
            value: 'This Command Will Allow You To Hash Any Text That You Input. Hashes Are Commonly used To ensure that Information Has Not Been Tampred With. \nHashing "Hello" For Exaample Will Return teh Same Hash Everytime.'
          },
          {
            name: "Note",
            value: 'This Is Not An Encryption Method, Do Not Use This To "Encrpt" Sensitive Data!'
          },
          {
            name: "Learn More",
            value: 'https://en.wikipedia.org/wiki/SHA-2'
          },
        ]
      }});
    }
    else{
      
      var j;
      var string = '';
      for(j = 1; j < args.length; j++){
          string += args[j] + " ";
      }
      var hash = crypto.createHash('sha256').update(string.trim()).digest('hex');
      message.reply(hash);
    }
  }