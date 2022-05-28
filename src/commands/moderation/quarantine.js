const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../structures/schemas/lockdownDB.js");
const ms = require("ms");

module.exports = {
  name: "quarantine",
  description: "Quarantine a channel.",
  permission: "MANAGE_CHANNELS",
  public: true,
  options: [
    {
      name: "time",
      description: "How long would you like the quarantine to last?",
      type: "STRING",
    },
    {
      name: "reason",
      description: "Provide a reason for the quarantine.",
      type: "STRING",
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, channel, options } = interaction;
    const reason = options.getString("reason") || "Unknown";
    const Embed = new MessageEmbed();

    if (!channel.permissionsFor(guild.id).has("SEND_MESSAGES"))
      return interaction.reply({
        embeds: [
          Embed.setDescription(
            "🔹 | This channel is already quarantined."
          ).setColor("BLURPLE"),
        ],
      });

    channel.permissionOverwrites.edit(guild.id, {
      SEND_MESSAGES: false,
    });
    interaction.reply({
      embeds: [
        Embed.setDescription(
          `🔹 | This channel is now quarantined for: ${reason}`
        ).setColor("BLURPLE"),
      ],
    });

    const time = options.getString("time");
    if (time) {
      const expiredate = Date.now() + ms(time);
      DB.create({ GuildID: guild.id, ChannelID: channel.id, Time: expiredate });

      setTimeout(async () => {
        channel.permissionOverwrites.edit(guild.id, {
          SEND_MESSAGES: null,
        });
        interaction.editReply({
          embeds: [
            Embed.setDescription("🔹 | The quarantine has been lifted."
            ).setColor("BLURPLE"),
          ],
        })
        .catch(() => {});
      await DB.deleteOne({ ChannelID: channel.id });
      }, ms(time));
    }
  },
};
