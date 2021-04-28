import { ADDRESS_ZERO } from '@protofire/subgraph-toolkit'
import {
	TransferSingle as TransferSingleEvent,
	MintOriginal as MintOriginalEvent,
	PrintMinted as PrintMintedEvent,
	PrintBurned as PrintBurnedEvent,
	TransferBatch as TransferBatchEvent
} from "../generated/EulerBeats-genesis/EulerBeatsGenesis";

import { accounts, registry, tokens, transactions } from "./helpers";
import { registry as registryConstants } from './constants'
import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Original } from '../generated/schema';

function handleTransfer(
	fromId: string, toId: string,
	tokenId: string, timestamp: BigInt
): void {
	let transferId = transactions.transfer.composeNewTransferId(fromId, toId)
	let transfer = transactions.transfer.getNewTransfer(transferId, fromId, toId, tokenId, timestamp)
	transfer.save()

	// Try to load original and change owner 
	// otherwise load print and proceed

	let original = Original.load(tokenId)
	if (original != null) {
		original.owner = toId
		original.save()
	} else {
		let print = tokens.prints.loadPrint(tokenId)
		print.owner = toId
		print.save()
	}
}

export function handleTransferSingle(event: TransferSingleEvent): void {
	let fromId = event.params.from.toHex()
	let toId = event.params.to.toHex()
	let tokenId = event.params.id.toHex()
	let timestamp = event.block.timestamp

	// skip minting or burning
	// minting: transaction made by address zero
	// burning: transaction made to address zero
	if (fromId == ADDRESS_ZERO || toId == ADDRESS_ZERO) {
		return
	}
	handleTransfer(fromId, toId, tokenId, timestamp)
}


export function handleTransferBatch(event: TransferBatchEvent): void {
	let fromId = event.params.from.toHex()
	let toId = event.params.to.toHex()
	let idList = event.params.ids
	let timestamp = event.block.timestamp

	// skip minting or burning
	// minting: transaction made by address zero
	// burning: transaction made to address zero
	if (fromId == ADDRESS_ZERO || toId == ADDRESS_ZERO) {
		return
	}

	for (let i = 0; i < idList.length; ++i) {
		let tokenId = idList[i];
		handleTransfer(fromId, toId, tokenId.toHex(), timestamp)
	}
}



function handleMintOriginal(registryId: string, ownerAddress: Bytes, timestamp: BigInt, seed: BigInt): void {
	let ownerId = ownerAddress.toHex()
	let token = tokens.originals.getNewOriginal(registryId, seed, ownerId, timestamp)
	token.save()

	let currentRegistry = registry.increaseOriginalsMinted(registryId)
	currentRegistry.save()

	// create account
	let account = accounts.getAccount(ownerAddress)
	account.save()

	let mintId = transactions.mint.composeNewMintId(token.id, ownerId)
	let mint = transactions.mint.getNewMint(mintId, ownerId, token.id, timestamp)
	mint.save()
}

export function handleGenesisMintOriginal(event: MintOriginalEvent): void {
	handleMintOriginal(
		registryConstants.genesisId,
		event.params.to,
		event.block.timestamp,
		event.params.seed
	)
}

export function handleEnigmaMintOriginal(event: MintOriginalEvent): void {
	handleMintOriginal(
		registryConstants.enigmaId,
		event.params.to,
		event.block.timestamp,
		event.params.seed
	)
}

function handlePrintMinted(registryId: string, event: PrintMintedEvent): void {
	let originalId = event.params.seed.toHex()
	let royaltyRecipient = event.params.royaltyRecipient.toHex()
	let printId = event.params.id.toHex()
	let accountAddress = event.params.to
	let toId = accountAddress.toHex()
	let timestamp = event.block.timestamp
	let royaltyId = transactions.royalties.composeNewRoyaltyId(royaltyRecipient, printId)

	// at contract level, reserveCut value is sent as "nextBurnPrice" in *emit PrintMinted*
	let genesisOriginalsRegistry = registry.increaseReserveCut(registryId, event.params.nextBurnPrice)
	genesisOriginalsRegistry.save()

	// create account
	let account = accounts.getAccount(accountAddress)
	account.save()

	let token = tokens.originals.increasePrintsMinted(originalId)
	token.nextBurnPrice = event.params.nextBurnPrice
	token.nextPrintPrice = event.params.nextPrintPrice
	token.save()

	let print = tokens.prints.getNewPrint(
		printId,
		originalId,
		toId,
		royaltyId,
		event.params.pricePaid,
		timestamp
	)
	print.save()

	let royalty = transactions.royalties.getNewRoyalty(
		royaltyId,
		royaltyRecipient,
		printId,
		event.params.royaltyPaid,
		timestamp
	)
	royalty.save()


	let mintId = transactions.mint.composeNewMintId(token.id, toId)
	let mint = transactions.mint.getNewMint(mintId, toId, token.id, timestamp)
	mint.save()
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
	let accountAddress = event.params.to

	let genesisOriginalsRegistry = registry.reduceReserveCut(registryId, burnPrice)
	genesisOriginalsRegistry.save()

	let token = tokens.originals.reducePrintsMinted(tokenId)
	token.nextBurnPrice = event.params.nextBurnPrice
	token.nextPrintPrice = event.params.nextPrintPrice
	token.save()

	let print = tokens.prints.burnPrint(printId)
	print.save()

	let account = accounts.getAccount(accountAddress)
	account.ethBalance = account.ethBalance.plus(burnPrice)
	account.save()
}

export function handleGenesisPrintBurned(event: PrintBurnedEvent): void {
	handlePrintBurned(registryConstants.genesisId, event)
}

export function handleEnigmaPrintBurned(event: PrintBurnedEvent): void {
	handlePrintBurned(registryConstants.enigmaId, event)
}