import {Client, TextChannel} from "discord.js";
import getFilesInDirectory from "./utils/getFilesInDirectory";
import { handlers_directory, AUTHENTICATION_MESSAGE_CHANNEL, AUTHENTICATION_MESSAGE_ID } from "./config.json";

const client = new Client();

(async() => {
	if (process.env.DISCORD_TOKEN) {
		try {
			await client.login(process.env.DISCORD_TOKEN);
			console.log(`Successfully logged in as ${client.user?.username}`);

			const handlerFiles = await getFilesInDirectory(
				`${__dirname}/${handlers_directory}`,
				"Handler.js"
			);

			handlerFiles.forEach((handler) => {
				const { default: Handler } = handler;
				const handlerInstance = new Handler();

				client.on(handlerInstance.getEvent(), handlerInstance.handle);
			});

			const authChannel = await client.channels.fetch(AUTHENTICATION_MESSAGE_CHANNEL) as TextChannel;

			await authChannel.messages.fetch(AUTHENTICATION_MESSAGE_ID);
		} catch (error) {
			console.error(error);
		}
	} else {
		throw new Error("You must supply the DISCORD_TOKEN environment variable.");
	}
})();