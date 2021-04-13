import { ADDRESS_ZERO } from '@protofire/subgraph-toolkit'
import {
	TransferSingle as TransferSingleEvent,
	MintOriginal as MintOriginalEvent,
	PrintMinted as PrintMintedEvent,
	PrintBurned as PrintBurnedEvent
} from "../generated/EulerBeats-genesis/EulerBeatsGenesis";
import { Print, Token } from "../generated/schema";

import { accounts, registry, tokens, prints, royalties, shared } from "./helpers";
import { registry as registryConstants } from './constants'
import { BigInt } from '@graphprotocol/graph-ts';

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

function handleMint(registryId: string, ownerId: string, timestamp: BigInt, seed: BigInt): void {
	let token = tokens.getNewToken(registryId, seed, ownerId, timestamp)
	token.save()

	let currentRegistry = registry.increaseTokensMinted(registryId)
	currentRegistry.save()
}

export function handleGensisMintOriginal(event: MintOriginalEvent): void {
	handleMint(
		registryConstants.genesisId,
		event.params.to.toHex(),
		event.block.timestamp,
		event.params.seed
	)
}

export function handleEnigmaMintOriginal(event: MintOriginalEvent): void {
	handleMint(
		registryConstants.enigmaId,
		event.params.to.toHex(),
		event.block.timestamp,
		event.params.seed
	)
}

function handlePrintMinted(registryId: string, event: PrintMintedEvent): void {
	let tokenId = event.params.seed.toHex()
	let royaltyRecipient = event.params.royaltyRecipient.toHex()
	let printId = event.params.id.toHex()
	let royaltyId = royalties.composeNewRoyaltyId(royaltyRecipient, printId)

	// at contract level, reserveCut value is sent as "nextBurnPrice" in *emit PrintMinted*
	let genesisOriginalsRegistry = registry.addReserveCut(registryId, event.params.nextBurnPrice)
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


export function handleGenesisPrintMinted(event: PrintMintedEvent): void {
	handlePrintMinted(registryConstants.genesisId, event)
}

export function handleEnigmaPrintMinted(event: PrintMintedEvent): void {
	handlePrintMinted(registryConstants.enigmaId, event)
}

function handlePrintBurned(registryId: string, event: PrintBurnedEvent): void {
	let burnPrice = event.params.priceReceived
	let tokenId = event.params.seed.toHex()
	let printId = event.params.id.toHex()
	let accountId = event.params.to.toHex()

	let genesisOriginalsRegistry = registry.reduceReserveCut(registryId, burnPrice)
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

export function handleGenesisPrintBurned(event: PrintBurnedEvent): void {
	handlePrintBurned(registryConstants.genesisId, event)
}

export function handleEnigmaPrintBurned(event: PrintBurnedEvent): void {
	handlePrintBurned(registryConstants.enigmaId, event)
}