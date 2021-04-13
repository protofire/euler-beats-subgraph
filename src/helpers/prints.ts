import { BigInt, ADDRESS_ZERO } from '@graphprotocol/graph-ts'
import { Print } from '../../generated/schema';
import { shared } from "./shared";


export namespace prints {

	export function loadGenericPrint(printId: string): Print {
		let print = Print.load(printId)
		if (print == null) {
			shared.logs.logCritical(
				"loadGenericPrint",
				"Couldn't find print w/ id: " + printId)
		}
		return print as Print
	}

	export function getNewPrint(
		printId: string, tokenId: string, accountId: string,
		royaltyId: string, pricePaid: BigInt
	): Print {
		let print = new Print(printId)
		print.token = tokenId
		print.owner = accountId
		print.royalty = royaltyId
		print.pricePaid = pricePaid
		return print as Print
	}

	export function burnPrint(printId: string): Print {
		let print = loadGenericPrint(printId)
		print.owner = ADDRESS_ZERO
		return print as Print
	}

}