import { integer } from '@protofire/subgraph-toolkit'

import { GenesisOriginals } from '../../generated/schema'
import { registry as registryConstants } from '../constants'

export namespace registry {
	export namespace genesisOriginals {

		export function getRegistry(): GenesisOriginals {
			let genesisOriginals = GenesisOriginals.load(registryConstants.genesisOriginalsId)
			if (genesisOriginals == null) {
				genesisOriginals = new GenesisOriginals(registryConstants.genesisOriginalsId)
				genesisOriginals.originalsMinted = integer.ZERO
			}
			return genesisOriginals as GenesisOriginals
		}

		export function increaseOriginalsMinted() {
			let genesisOriginals = getRegistry()
			genesisOriginals.originalsMinted = genesisOriginals.originalsMinted.plus(integer.ONE)
			return genesisOriginals as GenesisOriginals
		}
	}
}