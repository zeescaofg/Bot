const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setupcount')
        .setDescription('Creates 3 voice channels for counting members, bots, and total members.'),
    async execute(interaction) {
        const guild = interaction.guild;
        const client = interaction.client;

        // Command-specific permission check
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: 'You need Administrator permissions to use this command.',
                ephemeral: true,
            });
        }

        try {
            // Defer the reply to allow asynchronous work
            await interaction.deferReply({ ephemeral: true });

            // Create channels (if they do not exist yet)
            const memberCountChannel = await guild.channels.create({
                name: `Members: ${guild.members.cache.filter(member => !member.user.bot).size}`,
                type: 2, // Voice channel
                permissionOverwrites: [
                    {
                        id: guild.id, // Deny everyone from connecting
                        deny: [PermissionsBitField.Flags.Connect],
                    },
                ],
            });

            const botCountChannel = await guild.channels.create({
                name: `Bots: ${guild.members.cache.filter(member => member.user.bot).size}`,
                type: 2, // Voice channel
                permissionOverwrites: [
                    {
                        id: guild.id, // Deny everyone from connecting
                        deny: [PermissionsBitField.Flags.Connect],
                    },
                ],
            });

            const totalCountChannel = await guild.channels.create({
                name: `Total: ${guild.memberCount}`,
                type: 2, // Voice channel
                permissionOverwrites: [
                    {
                        id: guild.id, // Deny everyone from connecting
                        deny: [PermissionsBitField.Flags.Connect],
                    },
                ],
            });

            // Send a reply to acknowledge the channel creation
            await interaction.editReply({
                content: 'Channels have been created for member, bot, and total counts.',
            });

            // Function to update the channel names dynamically
            const updateChannelNames = async () => {
                const members = guild.members.cache;
                const memberCount = members.filter(member => !member.user.bot).size;
                const botCount = members.filter(member => member.user.bot).size;

                try {
                    // Update each channel name only if the channel exists
                    if (memberCountChannel && memberCountChannel.guild) {
                        await memberCountChannel.setName(`Members: ${memberCount}`);
                    }

                    if (botCountChannel && botCountChannel.guild) {
                        await botCountChannel.setName(`Bots: ${botCount}`);
                    }

                    if (totalCountChannel && totalCountChannel.guild) {
                        await totalCountChannel.setName(`Total: ${guild.memberCount}`);
                    }
                } catch (error) {
                    console.error('Error updating channel name:', error);
                }
            };

            // Update channels when a member joins or leaves
            client.on('guildMemberAdd', async () => {
                await updateChannelNames();  // Update when a member joins
            });

            client.on('guildMemberRemove', async () => {
                await updateChannelNames();  // Update when a member leaves
            });

            // Initial update when the bot starts
            await updateChannelNames();

        } catch (error) {
            console.error('Error creating channels:', error);
            interaction.editReply({ content: 'An error occurred while creating the channels.' });
        }
    },
};
