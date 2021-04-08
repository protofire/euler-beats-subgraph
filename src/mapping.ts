import {
	TransferSingle as TransferSingleEvent,
	MintOriginal as MintOriginalEvent,
	PrintMinted as PrintMintedEvent
} from "../generated/EulerBeats-genesis/EulerBeatsGenesis";

import { accounts, registry, tokens, prints, royalties } from "./helpers";

export function handleTransferSingle(event: TransferSingleEvent): void {
	let toId = event.params.to.toHex()

	// This is duplication
	let tokenId = event.params.id.toHex()
	let token = tokens.changeOwner(tokenId, toId)
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
	let accountId = event.params.to.toHex()
	let tokenId = event.params.seed.toHex()
	let printId = prints.composeNewPrintId(accountId, tokenId)
	let royaltyId = royalties.composeNewRoyaltyId(accountId, printId, event.block.timestamp.toHex())

	let token = tokens.increasePrintsMinted(tokenId)
	token.save()

	let royalty = royalties.getNewRoyalty(
		royaltyId,
		accountId,
		printId,
		event.params.royaltyPaid
	)
	royalty.save()

	let print = prints.getNewPrint(
		printId,
		tokenId,
		royaltyId,
		event.params.pricePaid,
		event.params.nextPrintPrice,
		event.params.nextBurnPrice
	)
	print.save()
	/*
			address indexed to,
		uint256 id,
		uint256 indexed seed,
		uint256 pricePaid,
		uint256 nextPrintPrice,
		uint256 nextBurnPrice,
		uint256 printsSupply,
		uint256 royaltyPaid,
		uint256 reserve,
		address indexed royaltyRecipient
	*/

}

export function handlePrintBurned() { }
