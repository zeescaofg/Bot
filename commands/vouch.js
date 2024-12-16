const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'vouch',
        description: 'Vouch for a user and provide a reason, with an optional image.',
        options: [
            {
                name: 'user',
                type: 6, // USER type
                description: 'The user you are vouching for',
                required: true
            },
            {
                name: 'reason',
                type: 3, // STRING type
                description: 'The reason for the vouch',
                required: true
            },
            {
                name: 'image',
                type: 11, // ATTACHMENT type
                description: 'Optional image to include with the vouch',
                required: false
            }
        ]
    },
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const image = interaction.options.getAttachment('image'); // Get the optional image attachment
        const mentionChannelId = '1317213095546060816'; // Replace with your channel ID

        // Get the channel where you want to send the vouch message
        const mentionChannel = interaction.guild.channels.cache.get(mentionChannelId);
        if (!mentionChannel) {
            return interaction.reply({ content: 'Mention channel not found!', ephemeral: true });
        }

        // Create the embed message
        const embed = new EmbedBuilder()
            .setTitle("☄️ Galaxy Generator | Vouches")
            .setDescription(`You have vouched for <@${user.id}>\nReason: **${reason}**`)
            .setColor(2162851) // Custom color for the embed
            .setImage(image ? image.url : "https://i.postimg.cc/GtKmTKWF/standard-3.gif") // Use the uploaded image if available, otherwise fallback to default
            .setTimestamp() // Adds a timestamp to the embed
            .setFooter({ text: 'Galaxy Gen Information', iconURL: 'https://i.postimg.cc/x84BZbMr/standard-5.gif' }); // Footer with avatar

        try {
            // Send the embed to the specified channel
            await mentionChannel.send({
                content: null, // No direct content, only the embed
                embeds: [embed]
            });
            await interaction.reply({ content: `Successfully vouched for <@${user.id}>!`, ephemeral: true });
        } catch (error) {
            console.error('Error sending vouch message:', error);
            await interaction.reply({ content: 'There was an error while processing the vouch.', ephemeral: true });
        }
    }
};
