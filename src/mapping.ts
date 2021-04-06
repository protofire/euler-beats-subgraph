import {
	TransferSingle as TransferSingleEvent
} from "../generated/EulerBeats-genesis/EulerBeatsGenesis";

import { accounts } from "./helpers";

export function handleTransferSingle(event: TransferSingleEvent): void {
	let fromId = event.params.from.toHex()
	let from = accounts.getAccount(fromId)

	let toId = event.params.to.toHex()
	let to = accounts.getAccount(toId)

	let tokenId = event.params.id.toHex()

}

export function handleMintOriginal() { }

export function handlePrintMinted() { }

export function handlePrintBurned() { }
