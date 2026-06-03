import { MemoryPublisher } from "@orpc/experimental-publisher/memory";

interface PubSubChannels {
	notification: {
		id: string;
		title: string;
		message: string;
	};
}

const publisher = new MemoryPublisher<Record<string, object>>();

function keyFor(channel: keyof PubSubChannels, userId: number) {
	return `${channel}:${userId}`;
}

export const PubSub = {
	subscribe<T extends keyof PubSubChannels>(
		channel: T,
		user: { id: number },
		signal?: AbortSignal,
	): AsyncIterable<PubSubChannels[T]> {
		return publisher.subscribe(keyFor(channel, user.id), {
			signal,
		}) as AsyncIterable<PubSubChannels[T]>;
	},

	publish<T extends keyof PubSubChannels>(
		channel: T,
		user: { id: number },
		payload: PubSubChannels[T],
	) {
		const key = keyFor(channel, user.id);

		return publisher.publish(key, payload);
	},
};
