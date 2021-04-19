import { BigInt } from '@graphprotocol/graph-ts'
import { integer } from '@protofire/subgraph-toolkit'

import { Registry } from '../../generated/schema'
import { registry as registryConstants } from '../constants'

export namespace registry {

	function getRegistryName(registryId: string): string {
		return registryId == registryConstants.genesisId ?
			registryConstants.genesisName : registryConstants.enigmaName;
	}

	function getMaxPrintSupply(registryId: string): BigInt {
		return registryId == registryConstants.genesisId ?
			BigInt.fromI32(119) : BigInt.fromI32(160);
	}

	export function getRegistry(registryId: string): Registry {
		let registry = Registry.load(registryId)
		if (registry == null) {
			registry = new Registry(registryId)
			registry.totalOriginalsMinted = integer.ZERO
			registry.maxSeedSupply = BigInt.fromI32(27)
			registry.reserve = integer.ZERO
			registry.totalPrintsMinted = integer.ZERO
			registry.maxPrintSupply = getMaxPrintSupply(registryId)
			registry.name = getRegistryName(registryId)
		}
		return registry as Registry
	}

	export function increaseOriginalsMinted(registryId: string): Registry {
		let registry = getRegistry(registryId)
		registry.totalOriginalsMinted = registry.totalOriginalsMinted.plus(integer.ONE)
		return registry as Registry
	}

	export function increaseReserveCut(registryId: string, reserveCut: BigInt): Registry {
		let registry = getRegistry(registryId)
		registry.reserve = registry.reserve.plus(reserveCut)
		return registry as Registry
	}

	export function reduceReserveCut(registryId: string, consumedReserveCut: BigInt): Registry {
		let registry = getRegistry(registryId)
		registry.reserve = registry.reserve.minus(consumedReserveCut)
		return registry as Registry
	}

}