import { BigInt } from '@graphprotocol/graph-ts'
import { Print } from '../../generated/schema';

export namespace prints {

	export function composeNewPrintId(tokenId: string, timestamp: string): string {
		return tokenId + '@' + timestamp
	}

	export function getNewPrint(
		printId: string, tokenId: string, accountId: string, royaltyId: string,
		pricePaid: BigInt, nextPrintPrice: BigInt, nextBurnPrice: BigInt,
	): Print {
		let print = new Print(printId)
		print.token = tokenId
		print.owner = accountId
		print.royalty = royaltyId
		print.pricePaid = pricePaid
		print.nextBurnPrice = nextBurnPrice
		print.nextPrintPrice = nextPrintPrice
		return print as Print
	}
}