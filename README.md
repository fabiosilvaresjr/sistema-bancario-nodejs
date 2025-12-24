# 🏦 Accounts - Sistema Bancário CLI

> 🆙 **Atualização Recente:** Implementação do sistema de transferências entre contas.

Projeto desenvolvido para consolidar os fundamentos do **Node.js**, manipulação de arquivos (**File System**) e lógica de programação via terminal.

## 🚀 Tecnologias
- **Node.js** (Runtime)
- **Inquirer** (Interfaces interativas no terminal)
- **Chalk** (Feedback visual e estilização)
- **FS (File System)** (Persistência de dados em JSON)

## ⚙️ Funcionalidades
- [x] Criar conta bancária
- [x] Consultar saldo
- [x] Depositar valores
- [x] Sacar valores
- [x] **Transferência entre contas** (Novo! 💸)
- [x] Persistência de dados (as contas ficam salvas localmente na pasta `accounts`)

## 🧠 Desafios e Aprendizados
A implementação da função de **Transferência** exigiu uma lógica mais complexa:
1. Verificar a existência da conta de origem.
2. Verificar a existência da conta de destino.
3. Validar se há saldo suficiente.
4. Realizar a operação matemática (débito em uma, crédito na outra) e salvar ambos os arquivos de forma síncrona para garantir a integridade dos dados.

## 📦 Como rodar
1. Clone o repositório.
2. Rode `npm install` para baixar as dependências.
3. Inicie com `node index.js`.

---
Desenvolvido por **Fabio** durante estudos de Backend e Node.js.