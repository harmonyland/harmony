import { Client, Message, Intents } from '../mod.ts'

const client = new Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("messageCreate", (msg: Message) => {
    if (msg.content === "!ping") {
        console.log("Command Used: Ping");
        msg.reply("pong!");
    }
});

console.log("discord.deno - ping example");

const token = prompt("Input Bot Token:");
if (!token) {
    console.log("No token provided");
    Deno.exit();
}

const intents = prompt("Input Intents (0 = All, 1 = Presence, 2 = Server Members, 3 = None):");
if (!intents || !["0", "1", "2", "3"].includes(intents)) {
    console.log("No intents provided");
    Deno.exit();
}

let ints;
if (intents == "0") {
    ints = Intents.All;
} else if (intents == "1") {
    ints = Intents.Presence;
} else if (intents == "2") {
    ints = Intents.GuildMembers;
} else {
    ints = Intents.None;
}

client.connect(token, ints);