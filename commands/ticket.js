const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: {
        name: 'ticket',
        description: 'Create a support ticket',
    },
    async execute(interaction) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('Create Ticket')
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            content: null,
            embeds: [
                {
                    title: "☄️ Galaxy Generator | Information",
                    description: "**💵 How to purchase\n\n- 🎫 Create a ticket and state what you're purchasing and how you are paying.\n\n- 🕒 Wait patiently for support to respond\n\n- ✅ Once you have paid you will receive your product.**",
                    color: 2162851,
                    image: { url: "https://i.postimg.cc/GtKmTKWF/standard-3.gif" }
                }
            ],
            components: [row],
            username: 'Galaxy Gen Information',
            avatar_url: 'https://i.postimg.cc/x84BZbMr/standard-5.gif'
        });
    }
};
