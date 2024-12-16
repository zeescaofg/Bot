// commands/hticket.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crules')
        .setDescription('Displays rules embed'),

    async execute(interaction) {
        // Updated embed structure with rules
        const embed = {
            title: '☄️ Galaxy Generator | Rules',
            description: '**- No advertising.\n\n- No scamming.\n\n- No slurs or aggressive swear words.\n\n- No toxicity.\n\n- No self bots.\n\n- NSFW IS NOT TOLERATED.\n\n- No impersonating anyone.\n\n- Server Raiding - Raiding or speaking about raiding is not allowed.\n\n- Direct & Indirect Threats - Threats to other users of DDoS, Death, DoX, abuse, and other malicious threats are absolutely prohibited and disallowed.\n\n- Any Topic about Rape, Suicide or any Sensitive topics of any kind is strictly prohibited.**',
            color: 2162851,
            image: {
                url: 'https://i.postimg.cc/GtKmTKWF/standard-3.gif',
            },
        };

        try {
            // Send the embed in the response
            await interaction.reply({
                content: null,
                embeds: [embed],
                username: 'Galaxy Gen Information', // Set the bot's name
                avatar_url: 'https://i.postimg.cc/x84BZbMr/standard-5.gif', // Set the bot's avatar
            });
        } catch (error) {
            console.error('Error sending the interaction response:', error);
            await interaction.reply({ content: 'There was an error while trying to execute this command!', ephemeral: true });
        }
    },
};
