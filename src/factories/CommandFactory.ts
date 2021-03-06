import { commands_directory } from "../config.json";
import { readDirectory } from "../utils/readDirectory";
import RunnableCommand from "../interfaces/RunnableCommand";

class CommandFactory {
	private commands: any = {};

	async loadCommands(): Promise<void> {
		const commandsDirectory = await readDirectory(`${__dirname}/../${commands_directory}`);
		const commandFiles = commandsDirectory
			.filter(file => file.endsWith("Command.js"))
			.map(file => require(`${__dirname}/../${commands_directory}/${file}`));

		commandFiles.forEach((command) => {
			const { default: Command } = command;
			const name = new Command().getName();

			this.commands[name] = () => new Command();
		});
	}

	commandExists(command: string): boolean {
		return typeof this.commands[command] !== "undefined";
	}

	getCommand(command: string): RunnableCommand {
		return this.commands[command]();
	}
}

export default CommandFactory;