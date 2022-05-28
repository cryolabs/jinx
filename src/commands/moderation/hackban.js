const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
  name: "hackban",
  description: "Ban someone by only using their Discord ID.",
  permission: "BAN_MEMBERS",
  public: true,
  options: [
      {
          name: "target",
          description: "Specify a target.",
          type: "STRING",
          required: true
      },
      {
          name: "reason",
          description: "Provide a reason for the ban.",
          type: "STRING",
      },
  ],
    /**
     * @param {CommandInteraction} interaction 
     */
	async execute (interaction) {
    const target = interaction.options.getString("target");
    const reason = interaction.options.getString("reason") || "No reason provided.";

    interaction.guild.members.ban(target);
    const successEmbed = new MessageEmbed()
        .setColor('BLURPLE')
        .setDescription("This user has been banned successfully.");

    interaction.reply({
      embeds: [successEmbed], ephemeral: true
    });
  },
};