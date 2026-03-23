#!/bin/bash

# Script para fazer push da LIVR3 para GitHub
# Uso: ./push.sh seu-usuario seu-repo

set -e

echo "🚀 LIVR3 - GitHub Push Helper"
echo "=============================="
echo ""

# Verificar se git está configurado
if ! command -v git &> /dev/null; then
    echo "❌ Git não encontrado! Instale em: https://git-scm.com"
    exit 1
fi

# Verificar argumentos
if [ $# -lt 2 ]; then
    echo "❌ Uso: ./push.sh seu-usuario seu-repo"
    echo ""
    echo "Exemplo:"
    echo "  ./push.sh joao livr3"
    echo ""
    echo "Isso criará e fará push para:"
    echo "  https://github.com/joao/livr3"
    echo ""
    exit 1
fi

USERNAME=$1
REPO=$2
REMOTE_URL="https://github.com/$USERNAME/$repo.git"

echo "📋 Informações do repositório:"
echo "   Usuário: $USERNAME"
echo "   Repositório: $REPO"
echo "   URL: $REMOTE_URL"
echo ""

# Verificar se é um repositório git válido
if [ ! -d .git ]; then
    echo "❌ Esta não é uma pasta git válida!"
    exit 1
fi

# Verificar status
echo "📊 Verificando status..."
git status

echo ""
read -p "✅ Continuar com o push? (s/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Cancelado pelo usuário"
    exit 1
fi

# Adicionar remote se não existir
if ! git remote get-url origin &> /dev/null; then
    echo ""
    echo "🔗 Adicionando remote..."
    git remote add origin "$REMOTE_URL"
    echo "✅ Remote adicionado!"
else
    echo ""
    echo "✅ Remote já existe"
fi

# Fazer push
echo ""
echo "🚀 Fazendo push para GitHub..."
git push -u origin main

echo ""
echo "✅ SUCESSO! Seu código foi enviado para:"
echo ""
echo "   📍 https://github.com/$USERNAME/$REPO"
echo ""
echo "Próximos passos:"
echo "  1. Vá para https://vercel.com"
echo "  2. Clique em 'Add New Project'"
echo "  3. Selecione seu repositório"
echo "  4. Clique 'Deploy'"
echo ""
echo "🎉 Pronto! Seu app estará online em ~1 minuto!"
