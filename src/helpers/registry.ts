import { BigInt } from '@graphprotocol/graph-ts'
import { integer } from '@protofire/subgraph-toolkit'

import { Registry } from '../../generated/schema'

export namespace registry {

	export function getRegistry(registryId: string): Registry {
		let registry = Registry.load(registryId)
		if (registry == null) {
			registry = new Registry(registryId)
			registry.tokensMinted = integer.ZERO
			registry.totalPrintsMinted = integer.ZERO
			registry.reserve = integer.ZERO
		}
		return registry as Registry
	}

	export function increaseTokensMinted(registryId: string): Registry {
		let genesisOriginals = getRegistry(registryId)
		genesisOriginals.tokensMinted = genesisOriginals.tokensMinted.plus(integer.ONE)
		return genesisOriginals as Registry
	}

	export function addReserveCut(registryId: string, reserveCut: BigInt): Registry {
		let genesisOriginals = getRegistry(registryId)
		genesisOriginals.reserve = genesisOriginals.reserve.plus(reserveCut)
		return genesisOriginals as Registry
	}

	export function reduceReserveCut(registryId: string, consumedReserveCut: BigInt): Registry {
		let genesisOriginals = getRegistry(registryId)
		genesisOriginals.reserve = genesisOriginals.reserve.minus(consumedReserveCut)
		return genesisOriginals as Registry
	}

}