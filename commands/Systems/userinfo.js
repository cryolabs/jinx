const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "userinfo",
  description: "Shows information about a user.",
  options: [
    {
      name: "target",
      description: "Provide a target.",
      type: "USER",
      required: "false",
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const target =
      interaction.options.getMember("target") || interaction.member;
    await target.user.fetch();

    const Response = new MessageEmbed()
      .setColor("DARK_PURPLE")
      .setAuthor({
        name: `${target.user.tag}`,
        iconURL: `${target.user.avatarURL({ dynamic: true })}`,
      })
      .setThumbnail(target.user.avatarURL({ dynamic: true }))
      .addFields(
        { name: "ID", value: target.user.id },
        {
          name: "Member since",
          value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Discord member since",
          value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Roles",
          value:
            target.roles.cache
              .map((r) => r)
              .join(" ")
              .replace("@everyone", "") || "None",
        }
      );
    interaction.reply({ embeds: [Response], ephemeral: true });
  },
};
