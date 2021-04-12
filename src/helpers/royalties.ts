import { BigInt } from "@graphprotocol/graph-ts";
import { Royalty } from "../../generated/schema";

export namespace royalties {
	export function composeNewRoyaltyId(accountId: string, tokenId: string): string {
		return accountId + "@" + tokenId
	}
	export function getNewRoyalty(
		royaltyId: string, accountId: string,
		printId: string, amount: BigInt,
	): Royalty {
		let royalty = new Royalty(royaltyId)
		royalty.print = printId
		royalty.recipient = accountId
		royalty.amount = amount
		return royalty as Royalty
	}
}