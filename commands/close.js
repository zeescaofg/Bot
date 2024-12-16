module.exports = {
    data: {
        name: 'close',
        description: 'Close your support ticket',
    },
    async execute(interaction) {
        // Check if the interaction is in a ticket-created channel (based on name pattern)
        if (!interaction.channel.name.startsWith('purchase-')) {
            // Remove the reply here to make it silent
            return;
        }

        // Check if the user is the one who created the ticket
        if (interaction.user.tag !== interaction.channel.name.split('-')[1]) {
            // Remove the reply here to make it silent
            return;
        }

        // Delete the channel
        await interaction.channel.delete();
        
        // Remove the reply here to make it silent
        return;
    }
};
