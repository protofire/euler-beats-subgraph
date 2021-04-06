import {
	TransferSingle as TransferSingleEvent,
	MintOriginal as MintOriginalEvent
} from "../generated/EulerBeats-genesis/EulerBeatsGenesis";

import { accounts, registry } from "./helpers";

export function handleTransferSingle(event: TransferSingleEvent): void {
	let fromId = event.params.from.toHex()
	let from = accounts.getAccount(fromId)

	let toId = event.params.to.toHex()
	let to = accounts.getAccount(toId)

	let tokenId = event.params.id.toHex()

}

export function handleMintOriginal(event: MintOriginalEvent): void {
	let toId = event.params.to.toHex()
	let to = accounts.getAccount(toId)

	let tokenId = event.params.seed.toHex()
	// let token = 

	let genesisOriginalsRegistry = registry.genesisOriginals.increaseOriginalsMinted()
	genesisOriginalsRegistry.save()
}

export function handlePrintMinted() { }

export function handlePrintBurned() { }
