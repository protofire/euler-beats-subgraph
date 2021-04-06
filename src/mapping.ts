import {
	TransferSingle as TransferSingleEvent,
	MintOriginal as MintOriginalEvent
} from "../generated/EulerBeats-genesis/EulerBeatsGenesis";

import { accounts, registry, tokens } from "./helpers";

export function handleTransferSingle(event: TransferSingleEvent): void {
	let fromId = event.params.from.toHex()
	let from = accounts.getAccount(fromId)

	let toId = event.params.to.toHex()
	let to = accounts.getAccount(toId)

	let tokenId = event.params.id.toHex()

}

// _mint yields handleTransferSingle 
// will this be duplicated?

export function handleMintOriginal(event: MintOriginalEvent): void {
	// handleTransferSingle will take care of this
	// let toId = event.params.to.toHex()
	// let to = accounts.getAccount(toId)

	let timestamp = event.block.timestamp

	let tokenId = event.params.seed.toHex()
	let token = tokens.genesisOriginals.getNewToken(tokenId, timestamp)
	token.save()

	let genesisOriginalsRegistry = registry.genesisOriginals.increaseOriginalsMinted()
	genesisOriginalsRegistry.save()
}

export function handlePrintMinted() { }

export function handlePrintBurned() { }
