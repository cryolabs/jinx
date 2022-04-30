const ms = require('ms');
const humanizeDuration = require('humanize-duration');

module.exports = {
	name: 'timeout',
	description: 'Timeout user from typing or joining voice channel or react to messages',
	options: [
		{
			name: 'user',
			description: 'User to timeout.',
			type: 6,
			required: true,
		},
		{
			name: 'time',
			description: 'Time for user to timeout. example: (1m, 1d, 1mo).',
			type: 3,
			required: true,
		},
	],
	permissions: 'MODERATE_MEMBERS',
	run: async (interaction) => {
		const member = interaction.options.getMember('user');
		const time = interaction.options.getString('time');
		if (member.permissions.has('ADMINISTRATOR')) {
			return interaction
				.reply({
					content: "You can't timeout member with **Administrator** permission.",
					ephemeral: true,
				})
				.catch((e) => {});
		}
		await member.disableCommunicationUntil(Date.now() + ms(time), `By: ${interaction.user.tag}`).catch(console.error);
		interaction.reply({
			content: `${member} has been timeout for **${humanizeDuration(ms(time), { round: true })}.**`,
		});
	},
};
