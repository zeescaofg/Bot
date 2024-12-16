const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infoa')
        .setDescription('Displays the rules for the Galaxy Generator'),

    async execute(interaction) {
        const embed = {
            title: '☄️ Galaxy Generator | All Gens',
            description: '**💎 All Generators\n- 200+ Services\n- Access to All Generators\n- Availability to use All Generators at once\n- More Stock\n\n<:PAYPAL:1317532265659502672> Paypal\nWeekly - $5.00\nMonthly - $7.00\nLifetime - $10.00\n\n<:CASHAPP:1317531960251519048> CashApp\nWeekly - $5.00\nMonthly - $7.00\nLifetime - $10.00\n\n<:ROBUX:1317532131773120532> Robux\nWeekly - 600 Robux\nMonthly - 1,200 Robux\nLifetime - 2,400 Robux\n\nInterested to purchase?\nCreate a ticket at ⁠https://discord.com/channels/1317213094933561497/1317528098169946227, say which payment method you would be using to buy and wait for a staff member to help you.\n\nAcceptance\nBy purchasing, you automatically agree to our ⁠https://discord.com/channels/1317213094933561497/1317296493446697102\n\nWe reserve the rights to remove your generator access if you misuse or stealing stock.**',
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
