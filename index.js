const { readFile, writeFile } = require('fs').promises;
const axios = require('axios').default;
const { Client, Enums } = require('fnbr');
const config = require('./config.json')

const client = new Client();

const fetchCosmetic = async (name, type) => {
  try {
    const { data: cosmetic } = (await axios(`https://fortnite-api.com/v2/cosmetics/br/search?name=${encodeURI(name)}&type=${type}`)).data;
    return cosmetic;
  } catch (err) {
    return undefined;
  }
};

const handleCommand = async (m, a) => {
  if (!m.content.startsWith(config.prefix)) return;
  const args = m.content.slice(1).split(' ');
  const command = args.shift().toLowerCase();


  if (command === 'outfit' || command === 'skin') {
    const skin = await fetchCosmetic(args.join(' '), 'outfit');
    if (skin) {
      m.client.party.me.setOutfit(skin.id);
      m.reply(`Set the skin to ${skin.name}!`);
    } else m.reply(`The skin ${args.join(' ')} wasn't found!`);
  } else if (command === 'emote' || command === 'dance') {
    const emote = await fetchCosmetic(args.join(' '), 'emote');
    if (emote) {
      m.client.party.me.setEmote(emote.id);
      m.reply(`Set the emote to ${emote.name}!`);
    } else m.reply(`The emote ${args.join(' ')} wasn't found!`);
  } else if (command === 'backpack' || command === 'backbling') {
    const backpack = await fetchCosmetic(args.join(' '), 'backpack');
    if (backpack) {
      m.client.party.me.setBackpack(backpack.id);
      m.reply(`Set the Backpack to ${backpack.name}!`);
    } else m.reply(`The Backpack ${args.join(' ')} wasn't found!`);
  } else if (command === 'pickaxe' || command === 'pickaxe') {
    const pickaxe = await fetchCosmetic(args.join(' '), 'pickaxe');
    if (pickaxe) {
      m.client.party.me.setPickaxe(pickaxe.id);
      m.reply(`Set the Pickaxe to ${pickaxe.name}!`);
    } else m.reply(`The Pickaxe ${args.join(' ')} wasn't found!`);
  }
  if (command === 'help' || command === 'commands') {
    m.reply(' \n +-------------------------------+ \n !skin \n !emot \n !Backpack \n !Pickaxe \n !pinkghoul \n !checkeredrenegade \n !set \n !Ready \n !Unready \n !setcrowns \n !hide \n !unhide  \n !Level \n +-------------------------------+')
  }
  if (command == 'set') {
    m.client.party.me.setOutfit('CID_636_Athena_Commando_M_GalileoGondola_78MFZ');
    m.reply('Set Skin to SET_01_OA')
  }
  if (command == 'hide') {
    m.client.party.hideMembers(true);
    m.reply('Hid everyone in the party.')
  }
  if (command == 'unhide') {
    m.client.party.hideMembers(false);
    m.reply('Unhid all players.')
  }
  if(command == 'setcrowns') {
    m.client.party.me.setCrowns(args.join(' '), 'setcrowns');
    m.reply(`Crowns set to: ${args.join(' ')}`)
  }
  if(command == 'level') {
    m.client.party.me.setLevel(args.join(' '), 'Level');
    m.reply(`Set Level to: ${args.join(' ')}`)
  }
  if(command == 'pinkghoul') {
    m.client.party.me.setOutfit("CID_029_Athena_Commando_F_Halloween",[{channel:"Material",dE:0,variant:"Mat3"}])
  }
  if(command == 'checkeredrenegade') {
    m.client.party.me.setOutfit("CID_028_Athena_Commando_F",[{channel:"Material",dE:0,variant:"Mat2"}])
  }
  if(command == 'purpleskull') {
    m.client.party.me.setOutfit("CID_030_Athena_Commando_M_Halloween",[{channel:"Material",dE:0,variant:"Mat1"}])
  }
  if(command == 'goldpeely') {
    m.client.party.me.setOutfit('CID_701_Athena_Commando_M_BananaAgent', [{ channel: 'Progressive', variant: 'Stage4' }], [2, 350]);
  }
  if(command == 'invisible') {
    m.client.party.me.setOutfit('CID_Invisible')
    m.reply('I am now invisible.')
  }
  if(command == 'ready') {
    m.client.party.me.setReadiness(true);
    m.reply("Ready!")
  }
  if(command == 'unready') {
    m.client.party.me.setReadiness(false);
    m.reply("Unready!")
  }
  if(m.author.id == config.FullAccess) {
    if(command == 'Kick') {
      m.reply('test11')
    }
  }
};

(async () => {
  let auth;
  try {
    auth = { deviceAuth: JSON.parse(await readFile('./deviceAuth.json')) };
  } catch (e) {
    auth = { authorizationCode: async () => Client.consoleQuestion('Please enter an authorization code: ') };
  }


  const client = new Client({ 
    auth,
    platform: config.platform,
     });

  client.on('deviceauth:created', (da) => writeFile('./deviceAuth.json', JSON.stringify(da, null, 2)));
  client.on('party:member:message', handleCommand);
  client.on('friend:message', handleCommand);
  client.on('friend:request', request => {
    if (config.friendaccept == 'true') {
      request.accept();
    } if (config.friendaccept == 'false') {
      request.abort();
    }
  });

  client.on('party:member:joined', member => {
    if (member.displayName === client.user.displayName) return;
    client.party.sendMessage(`Welcom ${member.displayName}! \n TikTok:LeakeBySkull \n Insta:LeakeBySkull \n Twitter:LeakeBySkull`)
    client.party.me.setEmote(config.eid)
    console.log(`${member.displayName} has joined the party.`);
    client.party.me.setOutfit(config.cid),
    client.party.me.setBackpack(config.bid),
    client.party.me.setPickaxe(config.pid),
    client.party.me.setBanner(config.banner),
    client.party.me.setLevel(config.level)
    client.setStatus(`😝 ${client.party.members.size}/16 | Made by LeakeBySkullツ 😝`);
  });

  client.on('party:member:left', member => {
    if (member.displayName === client.user.displayName) return;
    console.log(`${member.displayName} has leave the party.`);
    client.setStatus(`😝 ${client.party.members.size}/16 | Made by LeakeBySkullツ 😝`);
  });

  await client.login();
  console.log(`---------------------------------------------------`);
  console.log(`Logged in as: ${client.user.displayName}`);
  console.log(`User id: ${client.user.id}`);
  console.log(`---------------------------------------------------`);
  client.party.me.setOutfit(config.cid);
  client.party.me.setBackpack(config.bid);
  client.party.me.setPickaxe(config.pid);
  client.party.me.setBanner(config.banner);
  client.party.me.setLevel(config.level);
  client.party.me.setBattlePass(true, config.bp_tier);
  client.party.me.setCrowns(config.crown_wins);
  client.setStatus(`😝 ${client.party.members.size}/16 | Made by LeakeBySkullツ 😝`);
})();
