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
export function FindKeyByValue(obj: { [key: string]: any }, value: any): string | undefined {
	let result: string | undefined = undefined
	for (const key in obj) {
		if (obj.hasOwnProperty(key) && obj[key] === value) {
			result =  key;
			break
		}
	}
	return result;
}