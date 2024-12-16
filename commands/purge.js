const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete a specified number of messages or all messages')
    .addStringOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete, or type "any" to delete all messages')
        .setRequired(true)
    ),
  async execute(interaction) {
    const amount = interaction.options.getString('amount');

    // Acknowledge the interaction immediately to prevent timeout
    await interaction.reply({
      content: 'Processing your request...',
      ephemeral: true
    });

    if (amount === 'any') {
      try {
        // Fetch and delete all messages in the channel (limit to 1000 messages per request)
        let messages = await interaction.channel.messages.fetch({ limit: 100 });
        while (messages.size > 0) {
          await interaction.channel.bulkDelete(messages);
          messages = await interaction.channel.messages.fetch({ limit: 100 });
        }

        // After all messages are deleted, edit the response to inform the user
        await interaction.editReply({
          content: 'All messages have been deleted.',
        });
      } catch (error) {
        console.error('Error deleting messages:', error);
        await interaction.editReply({
          content: 'There was an error trying to delete messages.',
        });
      }
    } else {
      const numMessages = parseInt(amount);

      // Check if the amount is valid (between 1 and 100)
      if (isNaN(numMessages) || numMessages < 1 || numMessages > 100) {
        return interaction.editReply({
          content: 'You can only delete between 1 and 100 messages at a time.',
        });
      }

      try {
        // Delete the specified number of messages
        await interaction.channel.bulkDelete(numMessages, true);
        await interaction.editReply({
          content: `${numMessages} message(s) have been deleted.`,
        });
      } catch (error) {
        console.error('Error deleting messages:', error);
        await interaction.editReply({
          content: 'There was an error trying to delete messages.',
        });
      }
    }
  }
};
