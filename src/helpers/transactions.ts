import { BigInt } from "@graphprotocol/graph-ts";
import { Royalty, Burn, Transfer, Mint } from "../../generated/schema";
import { transaction as transactionConstants } from "../constants";

export namespace transactions {

	export namespace mint {
		export function composeNewMintId(tokenId: string, toId: string): string {
			return tokenId + "@" + toId
		}

		export function getNewMint(
			mintId: string, toId: string,
			tokenId: string, timestamp: BigInt
		): Mint {
			let mint = new Mint(mintId)
			mint.to = toId
			mint.token = tokenId
			mint.timestamp = timestamp
			mint.type = transactionConstants.mintType
			return mint as Mint
		}
	}

	export namespace transfer {

		export function composeNewTransferId(fromId: string, toId: string): string {
			return fromId + "@" + toId
		}

		export function getNewTransfer(
			transferId: string, fromId: string, toId: string,
			tokenId: string, timestamp: BigInt
		): Transfer {
			let transfer = new Transfer(transferId)
			transfer.from = fromId
			transfer.to = toId
			transfer.token = tokenId
			transfer.timestamp = timestamp
			transfer.type = transactionConstants.transferType
			return transfer as Transfer
		}

	}

	export namespace burns {

		export function composeNewBurnId(accountId: string, printId: string): string {
			return accountId + "@" + printId
		}

		export function getNewBurn(
			burnId: string, accountId: string,
			printId: string, timestamp: BigInt,
		): Burn {
			let burn = new Burn(burnId)
			burn.from = accountId
			burn.token = printId
			burn.timestamp = timestamp
			burn.type = transactionConstants.burnType
			return burn as Burn
		}
	}

	export namespace royalties {

		export function composeNewRoyaltyId(ownerId: string, printId: string): string {
			return ownerId + "@" + printId
		}

		export function getNewRoyalty(
			royaltyId: string, receipentId: string,
			printId: string, amount: BigInt, timestamp: BigInt
		): Royalty {
			let royalty = new Royalty(royaltyId)
			royalty.token = printId
			royalty.to = receipentId
			royalty.amount = amount
			royalty.timestamp = timestamp
			royalty.type = transactionConstants.royaltyType
			return royalty as Royalty
		}
	}
}