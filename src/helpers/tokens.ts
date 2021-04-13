import { BigInt } from '@graphprotocol/graph-ts'
import { integer } from '@protofire/subgraph-toolkit'
import { Token } from '../../generated/schema'
import { registry as registryConstants } from '../constants'
import { shared } from "./shared";

export namespace tokens {
	export function loadGenericToken(tokenId: string): Token {
		let token = Token.load(tokenId)
		if (token == null) {
			shared.logs.logCritical(
				"loadGenericToken",
				"Couldn't find token w/ id: " + tokenId)
		}
		return token as Token
	}

	export function changeOwner(tokenId: string, newOwnerId: string): Token {
		let token = loadGenericToken(tokenId)
		token.owner = newOwnerId
		return token as Token
	}

	export function increasePrintsMinted(tokenId: string): Token {
		let token = loadGenericToken(tokenId)
		token.printsMinted = token.printsMinted.plus(integer.ONE)
		return token as Token
	}

	export function reducePrintsMinted(tokenId: string): Token {
		let token = loadGenericToken(tokenId)
		token.printsMinted = token.printsMinted.minus(integer.ONE)
		return token as Token
	}

	// function getNewGenericToken(tokenId: string, registryId: string, ownerId: string, timestamp: BigInt): Token {
	// 	let token = new Token(tokenId)
	// 	token.registry = registryId
	// 	token.timestamp = timestamp
	// 	token.owner = ownerId
	// 	return token as Token
	// }
	export namespace genesisOriginals {
		export function getNewToken(tokenId: BigInt, ownerId: string, timestamp: BigInt): Token {
			// let token = getNewGenericToken(tokenId, registryConstants.genesisOriginalsId, ownerId, timestamp)
			let token = new Token(tokenId.toHex())
			token.seed = tokenId
			token.registry = registryConstants.genesisOriginalsId
			token.timestamp = timestamp
			token.owner = ownerId
			token.printsMinted = integer.ZERO
			token.nextPrintPrice = integer.ZERO
			token.nextBurnPrice = integer.ZERO
			return token as Token
		}
	}
}