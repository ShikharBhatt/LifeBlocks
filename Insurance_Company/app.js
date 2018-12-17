var Tx = require('ethereumjs-tx')

const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/81398fec017846aa8da26497d992931e')

const account1 = '0x9302074F562879c3ec8660Ee8c9F09564d7e7BD5'
const account2 = '0xce0b0D9BA87836F4daceA0B8c6be9ae8c9D47A45'

//console.log(web3.eth.accounts.create())

const privateKey1 = Buffer.from(process.env.PRIVATE_KEY_1, 'hex')       //Buffer helps to convert string to binary data
const privateKey2 = Buffer.from(process.env.PRIVATE_KEY_2, 'hex')

// web3.eth.getBalance(account1 , (err , bal) => {
//     console.log('account 1 balance : ' , web3.utils.fromWei(bal , 'ether'))
// })

// web3.eth.getBalance(account2 , (err , bal) => {
//     console.log('account 2 balance : ' , web3.utils.fromWei(bal , 'ether'))
// })

//get the transaction count from account 1 as it is the sender
web3.eth.getTransactionCount(account1, (err , txCount) => {

    const txObject = {
        nonce : web3.utils.toHex(txCount),          //all paramters should be in Hex
        to : account2,
        value : web3.utils.toHex(web3.utils.toWei('1' , 'ether')),
        gasLimit : web3.utils.toHex(21000),
        gasPrice : web3.utils.toHex(web3.utils.toWei('10','gwei'))
    }

    //Sign a transaction
    const tx = new Tx(txObject)
    tx.sign(privateKey1)

    const serializedTransaction = tx.serialize()
    const raw = '0x' + serializedTransaction.toString('hex')

    //Broadcast a transaction
    web3.eth.sendSignedTransaction(raw , (err , txHash) => {
        console.log('txHash : ' , txHash)
    })
})

//Build Transaction
