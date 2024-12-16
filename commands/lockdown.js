const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Locks the channel to prevent non-admins from sending messages.'),
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
      // Deny sending messages for the @everyone role
      await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        [PermissionsBitField.Flags.SendMessages]: false, // Deny permission for sending messages
      });

      // Send confirmation message
      await interaction.reply({
        content: `The channel ${channel} has been locked down. Non-admins can no longer send messages.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error locking down the channel:', error);
      await interaction.reply({
        content: 'There was an error trying to lock down the channel.',
        ephemeral: true,
      });
    }
  },
};
