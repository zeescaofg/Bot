const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infof')
        .setDescription('Displays the rules for the Galaxy Generator'),

    async execute(interaction) {
        const embed = {
            title: '☄️ Galaxy Generator | Free Gen',
            description: '**To get Free Gen Access, Please put in your Status \".gg/jW3kRPfW6d\"\n\nThis is automatic, so you will be roled instantly, don\'t make a ticket for it!**',
            color: 2162851,
            image: {
                url: 'https://i.postimg.cc/GtKmTKWF/standard-3.gif',
            },
        };

        try {
            // Only defer if we haven't already responded
            if (!interaction.replied && !interaction.deferred) {
                await interaction.deferReply();
            }

            // Send the embed, visible to everyone
            await interaction.editReply({
                content: null, // No message content
                embeds: [embed],
            });

        } catch (error) {
            console.error('Error sending the interaction response:', error);
            // Ensure we don't reply twice
            if (!interaction.replied) {
                await interaction.reply({ content: 'There was an error while trying to execute this command!', ephemeral: true });
            }
        }
    },
};
