import { integer } from '@protofire/subgraph-toolkit'

import { Account } from '../../generated/schema'

export namespace accounts {
	export function getAccount(accountId: string): Account {
		let account = Account.load(accountId)
		if (account == null) {
			account = new Account(accountId)
			account.burnRewardAmount = integer.ZERO
		}
		return account as Account
	}
}