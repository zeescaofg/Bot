const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up a channel for welcome messages.')
        .addStringOption(option => 
            option.setName('channel')
                .setDescription('The channel ID to send the welcome message to.')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Get the channel ID provided by the user
        const channelId = interaction.options.getString('channel');
        const channel = interaction.guild.channels.cache.get(channelId);

        if (!channel) {
            return interaction.reply({ content: 'Invalid channel ID!', ephemeral: true });
        }

        // Save the channel ID to a JSON file
        try {
            fs.writeFileSync('welcomeChannel.json', JSON.stringify({ channelId: channel.id }));
            await interaction.reply({ content: `Welcome message will be sent to <#${channelId}>!`, ephemeral: true });
        } catch (error) {
            console.error('Error saving channel ID:', error);
            await interaction.reply({ content: 'There was an error saving the channel ID.', ephemeral: true });
        }
    },
};
