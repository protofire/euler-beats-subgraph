import { BigInt } from '@graphprotocol/graph-ts'
import { integer } from '@protofire/subgraph-toolkit'

import { GenesisOriginals } from '../../generated/schema'
import { registry as registryConstants } from '../constants'

export namespace registry {
	export namespace genesisOriginals {

		export function getRegistry(): GenesisOriginals {
			let genesisOriginals = GenesisOriginals.load(registryConstants.genesisOriginalsId)
			if (genesisOriginals == null) {
				genesisOriginals = new GenesisOriginals(registryConstants.genesisOriginalsId)
				genesisOriginals.tokensMinted = integer.ZERO
				genesisOriginals.totalPrintsMinted = integer.ZERO
				genesisOriginals.reserve = integer.ZERO
			}
			return genesisOriginals as GenesisOriginals
		}

		export function increaseTokensMinted(): GenesisOriginals {
			let genesisOriginals = getRegistry()
			genesisOriginals.tokensMinted = genesisOriginals.tokensMinted.plus(integer.ONE)
			return genesisOriginals as GenesisOriginals
		}

		export function addReserveCut(reserveCut: BigInt): GenesisOriginals {
			let genesisOriginals = getRegistry()
			genesisOriginals.reserve = genesisOriginals.reserve.plus(reserveCut)
			return genesisOriginals as GenesisOriginals
		}
	}
}