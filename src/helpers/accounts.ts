import { Account } from '../../generated/schema'

export namespace accounts {
	export function getAccount(accountId: string): Account {
		let account = Account.load(accountId)
		if (account == null) {
			account = new Account(proposerId)
		}
		return account as Account
	}


}
}