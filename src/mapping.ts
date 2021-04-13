import {
	TransferSingle as TransferSingleEvent,
	MintOriginal as MintOriginalEvent,
	PrintMinted as PrintMintedEvent,
	PrintBurned as PrintBurnedEvent
} from "../generated/EulerBeats-genesis/EulerBeatsGenesis";
import { shared } from "./helpers";


import { ADDRESS_ZERO } from '@protofire/subgraph-toolkit'

import { accounts, registry, tokens, prints, royalties } from "./helpers";
import { Print, Token } from "../generated/schema";

export function handleTransferSingle(event: TransferSingleEvent): void {
	let fromId = event.params.from.toHex()
	let toId = event.params.to.toHex()
	let id = event.params.id.toHex()

	// skip minting handling
	// minting: transaction made by address zero
	if (fromId == ADDRESS_ZERO) {
		return
	}

	// try to load a token or print 
	// should I create a generic token an use "implement" for originals and prints?
	// this is easier but less elegant
	let token = Token.load(id)
	if (token != null) {
		token.owner = toId
		token.save()
	} else {
		let print = Print.load(id)
		if (print == null) {
			shared.logs.logCritical(
				"handleTransferSingle",
				"Couldn't find print or token w/ id: " + id)
		}
		print.owner = toId
		print.save()
	}

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
	let printId = event.params.id.toHex()
	let royaltyId = royalties.composeNewRoyaltyId(royaltyRecipient, printId)

	// at contract level, reserveCut value is sent as "nextBurnPrice" in *emit PrintMinted*
	let genesisOriginalsRegistry = registry.genesisOriginals.addReserveCut(event.params.nextBurnPrice)
	genesisOriginalsRegistry.save()

	let token = tokens.increasePrintsMinted(tokenId)
	token.nextBurnPrice = event.params.nextBurnPrice
	token.nextPrintPrice = event.params.nextPrintPrice
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
		event.params.pricePaid
	)
	print.save()

}

export function handlePrintBurned(event: PrintBurnedEvent): void {
	let burnPrice = event.params.priceReceived
	let tokenId = event.params.seed.toHex()
	let printId = event.params.id.toHex()
	let accountId = event.params.to.toHex()

	let genesisOriginalsRegistry = registry.genesisOriginals.reduceReserveCut(burnPrice)
	genesisOriginalsRegistry.save()

	let token = tokens.reducePrintsMinted(tokenId)
	token.nextBurnPrice = event.params.nextBurnPrice
	token.nextPrintPrice = event.params.nextPrintPrice
	token.save()

	let print = prints.burnPrint(printId)
	print.save()

	let account = accounts.getAccount(accountId)
	account.burnRewardAmount = account.burnRewardAmount.plus(burnPrice)
	account.save()
}
/*
event PrintBurned(
	address indexed to,
	uint256 id,
	uint256 indexed seed,
	uint256 priceReceived,
	uint256 nextPrintPrice,
	uint256 nextBurnPrice,
	uint256 printsSupply,
	uint256 reserve
);
*/