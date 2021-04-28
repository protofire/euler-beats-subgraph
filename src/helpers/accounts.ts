import { Bytes } from '@graphprotocol/graph-ts';
import { integer } from '@protofire/subgraph-toolkit'

import { Account } from '../../generated/schema'

export namespace accounts {
	export function getAccount(accountAddress: Bytes): Account {
		let accountId = accountAddress.toHex()

		let account = Account.load(accountId)
		if (account == null) {
			account = new Account(accountId)
			account.ethBalance = integer.ZERO
			account.address = accountAddress
		}
		return account as Account
	}
}