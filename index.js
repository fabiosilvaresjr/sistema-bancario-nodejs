//modulos externos
import inquirer from 'inquirer'
import chalk from 'chalk'

//modulos internos
import fs from 'fs'

console.log('Iniciamos o Accounts')
operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: [
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Transferir',
                'Sair',
            ],
        },
    ])
        .then((answer) => {
            const action = answer['action']

            if (action === 'Criar Conta') {
                createAccount()
            } else if (action === 'Depositar') {
                deposit()
            } else if (action === 'Consultar Saldo') {
                getAccountBalance()
            } else if (action === 'Sacar') {
                withdraw()
            } else if (action === 'Transferir') {
                transfer()
            } else if (action === 'Sair') {
                console.log(chalk.bgBlue.black('Obrigado por usar o Accounts'))
                process.exit()
            }
        })
        .catch((err) => console.log(err))
}

// criar conta
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))
    buildAccount()
}

// criar conta
function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta:',
        }
    ]).then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(
                chalk.bgRed.black('Esta conta já existe, escolha outro nome!'),
            )
            buildAccount()
            return
        }

        try {
            fs.writeFileSync(
                `accounts/${accountName}.json`,
                '{"balance": 0}'
            )
            console.log(chalk.green('Parabéns, a sua conta foi criada!'))
        } catch (err) {
            console.log(chalk.red('Erro ao criar conta: ', err))
        }

        return operation()
    }).catch((err) => console.log(err))
}

// depositar valor na conta
function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        //verify if account exists
        if (!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar',
            },
        ]).then((answer) => {
            const amount = answer['amount']

            // checking if the answer can be summed
            if (!amount || isNaN(amount) || amount <= 0) {
                console.log(chalk.red('Por favor, insira um valor numérico válido e positivo!'));
                return operation();
            }

            addAmount(accountName, amount)
            return operation()

        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

// verificar se a conta existe
function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, crie uma conta primeiro!'))
        return false
    }
    return true
}

// adicionar valor na conta
function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
}

// pega as informações da conta
function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r',
    })
    return JSON.parse(accountJSON)
}

// mostrar saldo da conta
function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return operation()
        }

        const accountData = getAccount(accountName)

        console.log(
            chalk.bgBlue.black(
                `Olá ${accountName}, o saldo da sua conta é de R$${accountData.balance}!`,
            ),
        )
        return operation()

    }).catch(err => console.log(err))
}

// sacar valor da conta
function withdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return operation()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?',
            }
        ]).then((answer) => {
            const amount = answer['amount']
            removeAmount(accountName, amount)
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

// remover valor da conta, de pois de sacar
function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return operation()
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('Valor indisponível!'))
        return operation()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(
        chalk.green(`Foi realizado um saque de R$${amount} da sua conta, Sr(a). ${accountName}!`)
    )
    return operation()
}


// transferir valor da conta
function transfer() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return operation()
        }

        inquirer.prompt([
            {
                name: 'receiverName',
                message: 'Qual o nome da conta de destino?',
            }
        ]).then((answer2) => {
            const receiverName = answer2['receiverName']

            if (!checkAccount(receiverName)) {
                return operation()
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Quanto você deseja transferir?',
                }
            ]).then((answer3) => {
                const amount = answer3['amount']

                if (!amount || isNaN(amount) || amount <= 0) {
                    console.log(chalk.bgRed.black('Por favor, insira um valor numérico válido e positivo!'))
                    return transfer()
                }

                performTransfer(accountName, receiverName, amount)
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

// realizar transferência
function performTransfer(accountName, receiverName, amount) {
    const accountData = getAccount(accountName)
    const receiverData = getAccount(receiverName)

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('Saldo insuficiente!'))
        return operation()
    }

    //debita da origem
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) { console.log(err) }
    )

    //credita na conta de destino
    receiverData.balance = parseFloat(receiverData.balance) + parseFloat(amount)
    fs.writeFileSync(
        `accounts/${receiverName}.json`,
        JSON.stringify(receiverData),
        function (err) { console.log(err) }
    )

    console.log(chalk.green(`Foi transferido o valor de R$${amount} da sua conta para a conta de ${receiverName}!`))
    return operation()
}

