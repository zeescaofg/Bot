const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infob')
        .setDescription('Displays the rules for the Galaxy Generator'), // Ensure this description is valid

    async execute(interaction) {
        const embed = {
            content: null,
            embeds: [
                {
                    title: "☄️ Galaxy Generator | Booster Gen",
                    description: "**🚀 Booster Generator is the Second Best generator on this discord, offering you a lot of services with a best hit rates.\n\n💎 Booster Generator\n- 20+ Services\n- 15 Seconds Cooldown\n- Good Hit Rate\n- More Stock\n\nThis is automatic so do not create a ticket to get your access!**",
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
