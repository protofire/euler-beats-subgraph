import { BigInt } from '@graphprotocol/graph-ts'
import { Token } from '../../generated/schema'
import { registry as registryConstants } from '../constants'

export namespace tokens {
	function getNewGenericToken(tokenId: string, registryId: string, timestamp: BigInt): Token {
		let token = new Token(tokenId)
		token.registry = registryId
		token.timestamp = timestamp
		return token as Token
	}
	export namespace genesisOriginals {
		export function getNewToken(tokenId: string, timestamp: BigInt): Token {
			let token = getNewGenericToken(tokenId, registryConstants.genesisOriginalsId, timestamp)
			return token // as Token ?? 
		}
	}
}