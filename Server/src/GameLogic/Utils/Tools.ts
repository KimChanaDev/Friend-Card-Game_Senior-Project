export function RandomArrayElement<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}
export function ShuffleArray<T>(array: T[]): T[] {
	let currentIndex = array.length;
	let randomIndex: number;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}
export function GetRandomKeyFromMap <K, V>(map: Map<K, V>): K | undefined {
	const keysArray = Array.from(map.keys());
	const randomIndex = Math.floor(Math.random() * keysArray.length);
	return keysArray.at(randomIndex);
}