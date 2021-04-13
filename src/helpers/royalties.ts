import { BigInt } from "@graphprotocol/graph-ts";
import { Royalty } from "../../generated/schema";

export namespace royalties {
	export function composeNewRoyaltyId(ownerId: string, printId: string): string {
		return ownerId + "@" + printId
	}
	export function getNewRoyalty(
		royaltyId: string, ownerId: string,
		printId: string, amount: BigInt,
	): Royalty {
		let royalty = new Royalty(royaltyId)
		royalty.print = printId
		royalty.recipient = ownerId
		royalty.amount = amount
		return royalty as Royalty
	}
}