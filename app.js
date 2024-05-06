var storage = require('node-persist');
// storage.init();
storage.init();
// var account ={
//     "name":"keerti",
//     "age":"30",
//     "accountType":"regular"
// }
// // console.log(account)
// storage.getItem('accounts');
// storage.setItem('accounts',account);
//  var accountData =  storage.getItem('accounts');
// if(command === 'hello' && typeof argv.name !== 'undefined'){
//     console.log('yes its working!!! '
//     + argv.name+ ' '+argv.lastName);
// }else if (command === 'hello'){
//     console.log('hello how u are!!');
// }

// const yargs = require('yargs');
const crypto = require('crypto-js');


const argv = require('yargs')
            .command('create','create user',function(yargs){
                yargs.option({
                    name :{
                        demand: true,
                        alias: 'n',
                        description:'Your Name'
                    },
                    lastName :{
                        demand: true,
                        alias: 'l',
                        description:'Your Last Name'
                    },
                    password :{
                        demand: true,
                        alias: 'p',
                        description:'Your Password'
                    },
                    masterPassword:{
                        demand: true,
                        alias: 'm',
                        description:'Your Master Password' 
                    }
                }).help('help')
            })
            .command('getUser','Get the user', function(yargs){
                yargs.option({
                    name :{
                        demand: true,
                        alias: 'n',
                        description:'Your Name'  
                    },
                    masterPassword:{
                        demand: true,
                        alias: 'm',
                        description:'Your Master Password' 
                    }
                }).help('help') 
            })
            .help('help')            
            .argv;
            
var command = argv._[0];
console.log('all argv',argv);

async function getAccountsConverted(masterPassword){
    await storage.init();
    var encryptedAccount =await storage.getItem('accounts');
    console.log('encrypted val',encryptedAccount);
    var accounts;
    // encryptedAccount.forEach(accountObj =>{
    //     // console.log(typeof accountObj)
    //     if(typeof accountObj !== 'undefined'){
    //         console.log('insise if case',accountObj)
            var cipertext = crypto.AES.encrypt(JSON.stringify(encryptedAccount), masterPassword).toString();
            var bytes = crypto.AES.decrypt(cipertext,masterPassword)
            console.log('buytes>>>>>>',bytes);

             accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
            
            console.log('parse accounts',accounts);
    //         }
    // })
    
    return accounts;
}

function saveAccount(accounts,masterPassword){
    var myEnriptedAccount = crypto.AES.encrypt(JSON.stringify(accounts),masterPassword);
    console.log('myEncrypted acc',myEnriptedAccount)
    storage.setItem('accounts', myEnriptedAccount.toString());

    return accounts;
}

function createAccount(account,masterPassword){
    let accountdata;
    // console.log('<>create master pwd><',masterPassword)
// var accountdata =storage.getItem('accounts');
// if(typeof accountData === 'undefined'){
//     accountdata = [];
// }
// new
 getAccountsConverted(masterPassword)
        .then(account => {
            console.log('then me',account)
            accountdata = account; // Assign the value inside the .then() block
            console.log('Fetched account:', accountdata);
            // accountdata.push(account);
            saveAccount(accountdata,masterPassword);
            storage.setItem('accounts',accountdata);
            return accountdata;

        })
        .catch(error => {
            console.error('Error:', error);
        });
// console.log('accountdata>>create time',accountdata)
// return account;
}

async function getAccount(name,masterPassword){
    await storage.init();
    // var accounts =  await storage.getItem('accounts');
    // var accounts = getAccountsConverted(masterPassword);
    var matchedAccount;
    //     accounts.forEach(data => {
    //     if(data.name === name){
    //         matchedAccount = data;
    //     };
    // });    
    getAccountsConverted(masterPassword)
        .then(account => {
            if(account.name === name){
                        matchedAccount = account;
                    };
            console.log('mt',matchedAccount)

        })
        .catch(error => {
            console.error('Error:', error);
        });
 
    return matchedAccount;
}

if(command === 'create'){
    var creatAccount = createAccount({
        name: argv.name,
        lastName:argv.lastName,
        password:argv.password       
    },argv.masterPassword);
    console.log('creates successfully!!');
    console.log(creatAccount);

}else  if (command === 'get') {
    let fetchAccount;
    getAccount(argv.name,argv.masterPassword)
        .then(account => {
            fetchAccount = account; // Assign the value inside the .then() block
            // console.log('Fetched account:', account);
            if (typeof fetchAccount === 'undefined') {
                console.log('Account not found! try again');
            } else {
                console.log('Account found! Welcome to you!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}