const { Client, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');


// Read the token from the token.txt file
const token = fs.readFileSync('token.txt', 'utf8').trim();
if (!token) {
    console.error('Token not found or is empty!');
    process.exit(1); // Exit if no token is found
}

// Replace these with your actual values
const GUILD_ID = "1317213094933561497"; // Replace with your server's ID
const ROLE_ID = "1317218855566708776"; // Replace with the ID of the role to assign for the keyword
const BOOST_ROLE_ID = "1317213094933561500"; // Replace with the ID of the role to assign for boosting
const KEYWORD = ".gg/jW3kRPfW6d"; // The keyword to check in statuses
const REQUIRED_ROLE_ID = "1318002317806801027"; // Replace with the ID of the role required to use commands
let welcomeChannelId = null;
let mentionChannelId = null; // New variable for the channel to mention users

// Load the stored channel ID from the welcomeChannel.json file
try {
    const data = fs.readFileSync('welcomeChannel.json', 'utf8');
    const parsedData = JSON.parse(data);
    welcomeChannelId = parsedData.channelId;
    mentionChannelId = parsedData.mentionChannelId; // Add this line to load the mention channel ID
} catch (error) {
    console.error('Error loading welcome channel ID:', error);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.GuildMember],
});


let commands = []; // Define the `commands` array outside the `client.once('ready')` event

client.once('ready', async () => {
    console.log(`Bot is ready as ${client.user.tag}`);
    monitorStatus();
    setInterval(monitorStatus, 2000); // Check every 2 seconds

    // Register commands dynamically from the commands folder
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    commandFiles.forEach(file => {
        try {
            const command = require(path.join(__dirname, 'commands', file));
            console.log(`Loaded command file: ${file}`); // Log file being loaded

            if (command.data) { // Ensure command has the data property
                commands.push(command);
            } else {
                console.error(`Command in file ${file} lacks 'data' property.`);
            }
        } catch (error) {
            console.error(`Error loading command from file: ${file}`); // Log the specific file causing the issue
            console.error(error); // Print the detailed error
        }
    });

    // Register commands to the guild
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) {
        console.error('Guild not found!');
        return;
    }

    try {
        await guild.commands.set(commands.map(cmd => cmd.data)); // Register only command metadata
        console.log('Commands have been registered!');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
});

// Monitor status and assign roles based on keyword in custom status
async function monitorStatus() {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) {
        console.log("Guild not found!");
        return;
    }

    const role = guild.roles.cache.get(ROLE_ID);
    if (!role) {
        console.log("Role not found!");
        return;
    }

    const members = await guild.members.fetch(); // Fetch all members

    members.forEach(async (member) => {
        if (member.user.bot) return; // Skip bots

        const activity = member.presence?.activities.find(act => act.type === 4); // Custom Status

        if (activity && activity.state && activity.state.includes(KEYWORD)) {
            if (!member.roles.cache.has(ROLE_ID)) {
                await member.roles.add(role);
                console.log(`Added role to ${member.user.tag}`);
            }
        } else {
            if (member.roles.cache.has(ROLE_ID)) {
                await member.roles.remove(role);
                console.log(`Removed role from ${member.user.tag}`);
            }
        }
    });
}


// Handle member boost events
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (oldMember.premiumSince !== newMember.premiumSince) {
        const guild = newMember.guild;
        const boostRole = guild.roles.cache.get(BOOST_ROLE_ID);

        if (!boostRole) {
            console.log("Boost role not found!");
            return;
        }

        if (newMember.premiumSince) {
            if (!newMember.roles.cache.has(BOOST_ROLE_ID)) {
                await newMember.roles.add(boostRole);
                console.log(`Assigned boost role to ${newMember.user.tag}`);
            }
        } else {
            if (newMember.roles.cache.has(BOOST_ROLE_ID)) {
                await newMember.roles.remove(boostRole);
                console.log(`Removed boost role from ${newMember.user.tag}`);
            }
        }
    }
});

// Monitor new members joining
client.on('guildMemberAdd', async (member) => {
    if (welcomeChannelId) {
        const channel = member.guild.channels.cache.get(welcomeChannelId);
        if (channel) {
            try {
                await channel.send({
                    content: null, // No direct content, only the embed
                    embeds: [
                        {
                            title: "☄️ Galaxy Generator | Welcome",
                            description: `**🚀Welcome to galaxy gen <@${member.id}>! We hope you enjoy your stay, check out this quick tutorial on where to go.**\n\n` +
                                `- ❗ Before you do anything, we highly suggest you check out the [Rules](https://discord.com/channels/1317213094933561497/1317296493446697102) of the server, just in case, so you don't make any mistakes.\n\n` +
                                `- 🥉 Click here to go to the [Free Generator](https://discord.com/channels/1317213094933561497/1317213095546060811) and [Here](https://discord.com/channels/1317213094933561497/1317661047892742244) to learn more.\n\n` +
                                `- 🥈 Click here to go to the [Booster Generator](https://discord.com/channels/1317213094933561497/1317213095546060812) and [Here](https://discord.com/channels/1317213094933561497/1317661079148560395) to learn more.\n\n` +
                                `- 🥇 Click here to go to the [Premium Generator](https://discord.com/channels/1317213094933561497/1317213095546060813) and [Here](https://discord.com/channels/1317213094933561497/1317661109725040670) to learn more.\n\n` +
                                `- 💬 If you're more of a talkative person and like to communicate with other users, go [Here](https://discord.com/channels/1317213094933561497/1317213095382225024) to get to know some people in the community.`,
                            color: 2162851, // Custom color for the embed
                            image: {
                                url: "https://i.postimg.cc/GtKmTKWF/standard-3.gif" // Image URL
                            },
                        }
                    ],
                    username: "Galaxy Gen Information", // Custom username for the bot's message
                    avatar_url: "https://i.postimg.cc/x84BZbMr/standard-5.gif", // Custom avatar URL for the bot's message
                    attachments: [],
                });
            } catch (error) {
                console.error('Error sending welcome message:', error);
            }
        }
    }

    // Mention the new member in a separate channel and delete the message after 1 second
    if (mentionChannelId) {
        const mentionChannel = member.guild.channels.cache.get(mentionChannelId);
        if (mentionChannel) {
            try {
                const mentionMessage = await mentionChannel.send(`<@${member.id}> Welcome to the server!`);
                setTimeout(() => {
                    mentionMessage.delete().catch(console.error);
                }, 1000); // 1000ms = 1 second
            } catch (error) {
                console.error('Error sending mention message:', error);
            }
        }
    }
});


client.on('interactionCreate', async (interaction) => {
    // Handle command interactions
    if (interaction.isCommand()) {
        const command = commands.find(cmd => cmd.data.name === interaction.commandName);
        if (command) {
            // Check if the user has the required role
            const member = interaction.member; // Get the member who triggered the interaction
            if (!member.roles.cache.has(REQUIRED_ROLE_ID)) {
                return await interaction.reply({
                    content: 'You do not have the required role to use this command.',
                    ephemeral: true
                });
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error('Command execution failed:', error);
                await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
            }
        } else {
            console.error('Command not found!');
        }
    }

    // Handle button press for creating a ticket
    if (interaction.isButton() && interaction.customId === 'create_ticket') {
        try {
            // Check if the user already has an open ticket (channel exists)
            const channelName = `purchase-${interaction.user.username}`;
            const existingChannel = interaction.guild.channels.cache.find(channel => channel.name === channelName);

            if (existingChannel) {
                return interaction.reply({
                    content: 'You already have an open ticket!',
                    ephemeral: true
                });
            }

            // Create the ticket channel
            const channel = await interaction.guild.channels.create({
                name: channelName,
                type: 0, // Use numeric value for text channel
                parent: '1317566534826332258', // Optional: put the ticket in a specific category
                permissionOverwrites: [
                    {
                        id: interaction.guild.id, // @everyone
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id, // The user creating the ticket
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: '1317218995912310805', // Replace with the actual support role ID
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    }
                ]
            });

            // Send a message in the new ticket channel
            await channel.send({
                content: null,
                embeds: [
                    {
                        title: "☄️ Galaxy Generator | Tickets",
                        description: `**Hello <@${interaction.user.id}> please wait until a <@&1317218995912310805> responds. Here's some things to do while you wait.\n\n~ State what you would like to buy.\n\n~ State how you are purchasing the product.**`,
                        color: 2162851,
                        image: {
                            url: "https://i.postimg.cc/GtKmTKWF/standard-3.gif",
                        },
                    },
                ],
                username: "Galaxy Gen Information",
                avatar_url: "https://i.postimg.cc/x84BZbMr/standard-5.gif",
            });

            // Notify the user about the ticket creation
            await interaction.reply({
                content: `Your ticket has been created: ${channel}`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error creating ticket:', error);
            await interaction.reply({
                content: 'There was an error creating your ticket. Please try again later.',
                ephemeral: true,
            });
        }
    }
});

client.login(token).catch(error => {
    console.error('Failed to log in:', error);
});