require('dotenv').config();
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

const express = require("express");
const app = express();

let chatIds = [];
let sendHour = 16;
let sendMinute = "00";
let sendTiming;
let botName;
let user = {name:"@Ivanlowkey",type:"username"};
let userId;
let name;

bot.onText(/\/start/,(msg,match)=>{
    botName = match.input.split("@")[1]
    const chatId = msg.chat.id;
    if (botName == undefined || botName == "huixx_bot"){
        if (chatIds.includes(chatId)){
            if (user.type == "username"){
                bot.sendMessage(chatId,`I cannot take more care of ${user.name}!`);
            } else if (user.type == "userid"){
                bot.sendMessage(chatId,`I cannot take more care of ${user.name}\\!`,{parse_mode:"MarkdownV2"});
            }
        } else {
            chatIds.push(chatId);
            if (user.type == "username"){
                bot.sendMessage(chatId,`I will now take care of ${user.name}!`);
            } else if (user.type == "userid"){
                bot.sendMessage(chatId,`I will now take care of ${user.name}\\!`,{parse_mode:"MarkdownV2"});
            }
        }
    }
})

bot.onText(/\/stop/,(msg,match)=>{
    botName = match.input.split("@")[1]
    const chatId = msg.chat.id;
    if (botName == undefined || botName == "huixx_bot"){
        if (user.type == "username"){
            bot.sendMessage(chatId,`I will now stop taking care of ${user.name}.`);
        } else if (user.type == "userid"){
            bot.sendMessage(chatId,`I will now stop taking care of ${user.name}\\.`,{parse_mode:"MarkdownV2"});
        }
        for( let i = 0; i < chatIds.length; i++){ 
            if ( chatIds[i] === chatId) { 
                chatIds.splice(i, 1); 
            }
        }
    }
})

bot.onText(/\/time/,(msg,match)=>{
    botName = match.input.split("@")[1]
    const chatId = msg.chat.id;
    if (botName == undefined || botName == "huixx_bot"){
        if (chatIds.includes(chatId)){
            if (match.input.split(' ')[1] < 2400 && match.input.split(' ')[1] >= 0){
                sendTiming = match.input.split(' ')[1];
                if (sendTiming.substring(sendTiming.length-4,sendTiming.length-2).length == 2 && sendTiming.substring(sendTiming.length-2,sendTiming.length) < 60){
                    sendHour = sendTiming.substring(sendTiming.length-4,sendTiming.length-2);
                    sendMinute = sendTiming.substring(sendTiming.length-2,sendTiming.length);
                    if (user.type == "username"){
                        bot.sendMessage(chatId,`I will check on ${user.name} everyday at `+sendHour+sendMinute+`.`);
                    } else if (user.type == "userid"){
                        bot.sendMessage(chatId,`I will check on ${user.name} everyday at `+sendHour+sendMinute+`\\.`,{parse_mode:"MarkdownV2"});
                    }
                } else {
                    bot.sendMessage(chatId,"Invalid response, /time <timing in 24hr clock>, eg. /time 1600");
                }
            } else if (match.input.split(' ')[1] == undefined){
                if (user.type == "username"){
                    bot.sendMessage(chatId,`I will check on ${user.name} everyday at `+sendHour+sendMinute+".");
                } else if (user.type == "userid"){
                    bot.sendMessage(chatId,`I will check on ${user.name} everyday at `+sendHour+sendMinute+"\\.",{parse_mode:"MarkdownV2"});
                }
            } else {
                bot.sendMessage(chatId,"Invalid response, /time <timing in 24hr clock>, eg. /time 1600");
            }
        } else {
            if (user.type == "username"){
                bot.sendMessage(chatId,`/start to start taking care of ${user.name}!`);
            } else if (user.type == "userid"){
                bot.sendMessage(chatId,`/start to start taking care of ${user.name}\\!`, {parse_mode:"MarkdownV2"});   
            }
        }
    }
})

bot.onText(/\/user/,(msg,match)=>{
    const chatId = msg.chat.id;
    botName = match.input.split(" ")[0].split("@")[1]
    if (botName == undefined || botName == "huixx_bot"){
        if (msg.entities[1].type == "mention"){
            user.name = msg.text.split(" ")[1];
            bot.sendMessage(chatId,`I will now care of ${user.name}!`);
        } else if (msg.entities[1].type == "text_mention"){
            userId = msg.entities[1].user.id;
            name = msg.entities[1].user.first_name;
            user.name = `[${name}](tg://user?id=${userId})`;
            user.type = "userid";
            bot.sendMessage(chatId,`I will now care of ${user.name}\\!`, {parse_mode:"MarkdownV2"});
        }
    }
})

bot.onText(/\/help/,(msg,match)=>{
    const chatId = msg.chat.id;
    botName = match.input.split(" ")[0].split("@")[1]
    if (botName == undefined || botName == "huixx_bot"){
        if (user.type == "username"){
            bot.sendMessage(chatId,`‎‎‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎  ‎‏‏‎ ‎‏‏              Commands List\n\n/start@huixx_bot - start caring for ${user.name}\n/help@huixx_bot - display help menu\n/user@huixx_bot <tag> - start caring for somebody else\n/time@huixx_bot <time in 24hr clock> - change time to show care\n/stop@huixx_bot - stop caring for ${user.name}`);
        } else if (user.type == "userid"){
            bot.sendMessage(chatId,`‎‎‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎ ‏‏‎ ‎‏‏              Commands List\n\n/start@huixx\\_bot \\- start caring for ${user.name}\n/help@huixx\\_bot \\- display help menu\n/user@huixx\\_bot <tag\\> \\- start caring for somebody else\n/time@huixx\\_bot <time in 24hr clock\\> \\- change time to show care\n/stop@huixx\\_bot \\- stop caring for ${user.name}`,{parse_mode:"MarkdownV2"});
        }
    }
})

bot.onText(/water/,(msg,match)=>{
    console.log('water detected!');
})

function getCurrentTime(){
    let [hour,minute,second] = new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Singapore'}).split(":");
    if (hour == sendHour && minute == sendMinute && second == 00){
        for (let i = 0;i<chatIds.length;i++){
            if (user.type == "username"){
                bot.sendMessage(chatIds[i],`How are you ${user.name}?`);
            } else if (user.type == "userid"){
                bot.sendMessage(chatIds[i],`How are you ${user.name}?`,{parse_mode:"MarkdownV2"});
            }
        }
    }
}

setInterval(getCurrentTime,1000);

port = process.env.PORT;
if (port == "" || port == null){
  port=3000;
}

app.listen(port, function() {
  console.log("Server started on port",port);
});