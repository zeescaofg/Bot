const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infop')
        .setDescription('Displays the Premium Generator information'), // Ensure this description is valid

    async execute(interaction) {
        const embed = {
            content: null,
            embeds: [
                {
                    title: "☄️ Galaxy Generator | Premium Gen",
                    description: "**💎 Premium Generator\n\n- 125+ Services\n- 2 Seconds Cooldown\n- Private Drops Access\n- Best Hit Rate\n- More Stock\n\n<:PAYPAL:1317532265659502672> Paypal\nWeekly - $3.00\nMonthly - $5.00\nLifetime - $8.00\n\n<:CASHAPP:1317531960251519048> CashApp\nWeekly - $3.00\nMonthly - $5.00\nLifetime - $8.00\n\n<:ROBUX:1317532131773120532> Robux\nWeekly - 300 Robux\nMonthly - 700 Robux\nLifetime - 900 Robux\n\nInterested to purchase?\nCreate a ticket at ⁠https://discord.com/channels/1317213094933561497/1317528098169946227, say which payment method you would be using to buy and wait for a staff member to help you.\n\nAcceptance\nBy purchasing, you automatically agree to our ⁠https://discord.com/channels/1317213094933561497/1317296493446697102\n\nWe reserve the rights to remove your generator access if you misuse or stealing stock.**",
                    color: 2162851,
                    image: {
                        url: "https://i.postimg.cc/GtKmTKWF/standard-3.gif",
                    },
                }
            ],
            username: "Galaxy Gen Information",
            avatar_url: "https://i.postimg.cc/x84BZbMr/standard-5.gif",
            attachments: [],
        };

        try {
            await interaction.reply(embed);
        } catch (error) {
            console.error('Error sending the interaction response:', error);
            await interaction.reply({ content: 'There was an error while trying to execute this command!', ephemeral: true });
        }
    },
};
