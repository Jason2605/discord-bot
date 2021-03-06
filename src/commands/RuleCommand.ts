import { Message, MessageEmbed } from "discord.js";
import { rules } from "../config.json";
import Command from "../abstracts/Command";
import RunnableCommand from "../interfaces/RunnableCommand";

class RuleCommand extends Command implements RunnableCommand {
	constructor() {
		super(
			"rule",
			"Get a specific rule."
		);
	}

	async run(message: Message, args: string[]): Promise<void> {
		const embed = new MessageEmbed();

		if (!args || typeof args[0] === "undefined") {
			embed.setTitle("Error");
			embed.setDescription("You must define a rule number.");
			embed.addField("Correct Usage", "?rule <rule number/trigger>");
		} else {
			const rule = rules.find(rule => rule.triggers.includes(args[0]));

			if (rule !== undefined) {
				embed.setTitle(rule.name);
				embed.setDescription(rule.description);
			} else {
				embed.setTitle("Error");
				embed.setDescription("Unknown rule number/trigger.");
				embed.addField("Correct Usage", "?rule <rule number/trigger>");
			}
		}

		await message.channel.send({ embed });
 	}
}

export default RuleCommand;