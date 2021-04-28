import { log } from '@graphprotocol/graph-ts'

export namespace shared {
	export namespace logs {
		export function logInfo(functionName: string, message: string): void {
			log.info(functionName + ": " + message, [])
		}
		export function logCritical(functionName: string, message: string): void {
			log.critical(functionName + ": " + message, [])
		}
	}
}