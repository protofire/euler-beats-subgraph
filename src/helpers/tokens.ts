import { BigInt } from '@graphprotocol/graph-ts'
import { integer } from '@protofire/subgraph-toolkit'
import { Token } from '../../generated/schema'
import { shared } from "./shared";

export namespace tokens {

	export function getNewToken(registryId: string, tokenId: BigInt, ownerId: string, timestamp: BigInt): Token {
		let token = new Token(tokenId.toHex())
		token.seed = tokenId
		token.registry = registryId
		token.timestamp = timestamp
		token.owner = ownerId
		token.printsMinted = integer.ZERO
		token.nextPrintPrice = integer.ZERO
		token.nextBurnPrice = integer.ZERO
		return token as Token
	}

	export function loadToken(tokenId: string): Token {
		let token = Token.load(tokenId)
		if (token == null) {
			shared.logs.logCritical(
				"loadToken",
				"Couldn't find token w/ id: " + tokenId)
		}
		return token as Token
	}

	export function changeOwner(tokenId: string, newOwnerId: string): Token {
		let token = loadToken(tokenId)
		token.owner = newOwnerId
		return token as Token
	}

	export function increasePrintsMinted(tokenId: string): Token {
		let token = loadToken(tokenId)
		token.printsMinted = token.printsMinted.plus(integer.ONE)
		return token as Token
	}

	export function reducePrintsMinted(tokenId: string): Token {
		let token = loadToken(tokenId)
		token.printsMinted = token.printsMinted.minus(integer.ONE)
		return token as Token
	}
}