# [Euler Beats](https://eulerbeats.com/)

## Registry 

Since Euler Beats relys on two main "sides of the record" the Registry enteity is provided to cover these. Only two constant entities are covered: 

1. Genesis
2. Enigma

Each of these entities contains info about the current state of the token registry and it's originals and prints.

## Token 

Token is an interface which envelopes both Originals and Prints with it's proper owner and timestamp (and some domain specific fields such as "Royalty" for prints)

## Transaction

Transaction is an interface used to cover all the transactions in the protocol, following entities implements it:

1. Mint: Each time an Original or Print is minted
2. Transfer: An existing Original or Print changes it owner
3. Royalty: Every time a Print is minted, a Royalty transaction record will be generated (and will update receipent current balance)
4. Burn: When a print is burned, this transaction will be yield, also, the Print will be tagged as "burned" 
