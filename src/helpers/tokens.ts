import { BigInt } from '@graphprotocol/graph-ts'
import { integer, ADDRESS_ZERO } from '@protofire/subgraph-toolkit'
import { Original, Print } from '../../generated/schema'
import { shared } from "./shared";
export namespace tokens {
	export namespace prints {

		export function getNewPrint(
			printId: string, original_id: string, accountId: string,
			royaltyId: string, pricePaid: BigInt, timestamp: BigInt
		): Print {
			let print = new Print(printId)
			print.original = original_id
			print.owner = accountId
			print.royalty = royaltyId
			print.pricePaid = pricePaid
			print.timestamp = timestamp
			print.burned = false
			return print as Print
		}

		export function loadPrint(printId: string): Print {
			let print = Print.load(printId)
			if (print == null) {
				shared.logs.logCritical(
					"loadPrint",
					"Couldn't find print w/ id: " + printId)
			}
			return print as Print
		}

		export function burnPrint(printId: string): Print {
			let print = loadPrint(printId)
			print.owner = ADDRESS_ZERO
			print.burned = true
			return print as Print
		}

	}

	export namespace originals {

		export function getNewOriginal(
			registryId: string, original_id: BigInt,
			ownerId: string, timestamp: BigInt
		): Original {
			let token = new Original(original_id.toHex())
			token.seed = original_id
			token.registry = registryId
			token.timestamp = timestamp
			token.owner = ownerId
			token.printsMinted = integer.ZERO
			token.nextPrintPrice = integer.ZERO
			token.nextBurnPrice = integer.ZERO
			return token as Original
		}

		export function loadOriginal(original_id: string): Original {
			let token = Original.load(original_id)
			if (token == null) {
				shared.logs.logCritical(
					"loadOriginal",
					"Couldn't find token w/ id: " + original_id)
			}
			return token as Original
		}

		export function changeOwner(original_id: string, newOwnerId: string): Original {
			let token = loadOriginal(original_id)
			token.owner = newOwnerId
			return token as Original
		}

		export function increasePrintsMinted(original_id: string): Original {
			let token = loadOriginal(original_id)
			token.printsMinted = token.printsMinted.plus(integer.ONE)
			return token as Original
		}

		export function reducePrintsMinted(original_id: string): Original {
			let token = loadOriginal(original_id)
			token.printsMinted = token.printsMinted.minus(integer.ONE)
			return token as Original
		}
	}
}