const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('open')
    .setDescription('Unlocks the channel to allow non-admins to send messages.'),
  async execute(interaction) {
    const channel = interaction.channel;

    // Ensure the user has the "Administrator" permission
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        content: 'You do not have the required permissions to use this command.',
        ephemeral: true,
      });
    }

    try {
      // Allow sending messages for the @everyone role
      await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        [PermissionsBitField.Flags.SendMessages]: null, // Reset the permission to allow sending messages
      });

      // Send confirmation message
      await interaction.reply({
        content: `The channel ${channel} has been unlocked. Non-admins can now send messages.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error unlocking the channel:', error);
      await interaction.reply({
        content: 'There was an error trying to unlock the channel.',
        ephemeral: true,
      });
    }
  },
};
