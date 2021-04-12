import {
	TransferSingle as TransferSingleEvent,
	MintOriginal as MintOriginalEvent,
	PrintMinted as PrintMintedEvent
} from "../generated/EulerBeats-genesis/EulerBeatsGenesis";

import { ADDRESS_ZERO } from '@protofire/subgraph-toolkit'

import { accounts, registry, tokens, prints, royalties } from "./helpers";

export function handleTransferSingle(event: TransferSingleEvent): void {
	let fromId = event.params.from.toHex()

	if (fromId == ADDRESS_ZERO) {
		return
	}

	let token = tokens.loadGenericToken(event.params.id.toHex())
	token.owner = event.params.to.toHex()
	token.save()
}

// _mint yields handleTransferSingle 
// will this be duplicated
export function handleMintOriginal(event: MintOriginalEvent): void {
	let timestamp = event.block.timestamp
	let ownerId = event.params.to.toHex()

	let token = tokens.genesisOriginals.getNewToken(event.params.seed, ownerId, timestamp)
	token.save()

	let genesisOriginalsRegistry = registry.genesisOriginals.increaseTokensMinted()
	genesisOriginalsRegistry.save()
}

export function handlePrintMinted(event: PrintMintedEvent): void {
	let tokenId = event.params.seed.toHex()
	let royaltyRecipient = event.params.royaltyRecipient.toHex()

	let printId = prints.composeNewPrintId(tokenId, event.block.timestamp.toHex())
	let royaltyId = royalties.composeNewRoyaltyId(royaltyRecipient, printId)

	// at contract level, reserveCut value is sent as "nextBurnPrice" in *emit PrintMinted*
	let genesisOriginalsRegistry = registry.genesisOriginals.addReserveCut(event.params.nextBurnPrice)
	genesisOriginalsRegistry.save()


	let token = tokens.increasePrintsMinted(tokenId)
	token.save()

	let royalty = royalties.getNewRoyalty(
		royaltyId,
		royaltyRecipient,
		printId,
		event.params.royaltyPaid
	)
	royalty.save()

	let print = prints.getNewPrint(
		printId,
		tokenId,
		event.params.to.toHex(),
		royaltyId,
		event.params.pricePaid,
		event.params.nextPrintPrice,
		event.params.nextBurnPrice
	)
	print.save()

}

export function handlePrintBurned() { }
