# 🚀 LIVR3 - Hábitos, Metas & Finanças

App completo de rastreamento de hábitos, metas, finanças e investimentos com interface dark mode.

## ✨ Features

- ✅ **Rastreamento de Hábitos** - Acompanhe seus hábitos diários com gráficos
- 🎯 **Metas de Crescimento** - Defina metas em 4 categorias (Profissional, Intelectual, Físico, Emocional)
- 💰 **Gestão Financeira** - Receitas, despesas fixas e variáveis
- 📈 **Investimentos** - Acompanhe seus aportes e patrimônio
- 💾 **localStorage** - Todos os dados salvos localmente (sem servidor)
- 📱 **Responsivo** - Funciona em desktop, tablet e mobile

## 🛠️ Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool (⚡ super rápido)
- **Recharts** - Gráficos
- **CSS-in-JS** - Styled components inline
- **localStorage** - Persistência de dados

## 📋 Estrutura do Projeto

```
.
├── index.html           # Entry point HTML
├── package.json         # Dependências
├── vite.config.js       # Configuração Vite
├── vercel.json          # Configuração Vercel
├── .gitignore           # Arquivos ignorados
├── src/
│   ├── main.jsx         # Entry point React
│   └── App.jsx          # Componente principal
└── README.md            # Este arquivo
```

## 🚀 Deploy na Vercel (Rápido!)

### Pré-requisitos
- Conta GitHub com este repositório
- Conta Vercel (gratuita em vercel.com)

### Passo a Passo

1. **Faça push do projeto para GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/livr3.git
   git push -u origin main
   ```

2. **Vá para vercel.com e faça login**

3. **Clique em "Add New..." → "Project"**

4. **Selecione seu repositório `livr3`**

5. **Vercel detectará automaticamente:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Clique "Deploy"** ✅

Pronto! Seu app está em produção! 🎉

## 📈 Performance Otimizada para Vercel

✅ **Build rápido** - Vite compila em ~2s  
✅ **Tamanho pequeno** - ~150KB (gzipped)  
✅ **Zero dependências backend** - Só frontend  
✅ **Caching automático** - Assets imutáveis  

## 💡 Principais Características

### Hábitos
- Rastreie até 7 dias anteriores
- Gráfico de progresso mensal
- Customização de cores

### Metas
- 4 categorias de crescimento
- Barra de progresso visual
- Atalho +R$100 para atualizar

### Finanças
- **Receitas**: Salário, Comissões, Outros
- **Despesas Fixas**: Aluguel, Internet, etc.
- **Despesas Variáveis**: Alimentação, Lazer, etc.
- **Contas**: Corrente, Poupança, Investimento, Carteira

### Investimentos
- Registre aportes com tipo
- Observações (ticker de ação, etc.)
- Total investido

## 📱 Suporte Mobile

Interface totalmente responsiva:
- Scroll horizontal em tabs
- Touch-friendly buttons
- Date pickers nativos

## 🔒 Privacidade

✅ **Sem servidor** - Dados armazenados localmente apenas  
✅ **Sem API** - Nada é enviado para a internet  
✅ **localStorage** - Backups você mesmo  

## 📝 Como Usar Localmente

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm preview
```

## 🎨 Customização

### Mudar tema
Edite as constantes de cor em `src/App.jsx`:
```javascript
const RED="#ef4444"
const GREEN="#22c55e"
const BG="#0d0d0d"
```

### Adicionar categorias
Modifique os arrays de categorias:
```javascript
const CATEGORIAS=["Profissional","Intelectual","Físico","Emocional/Espiritual"]
```

## 🐛 Troubleshooting

**Dados não estão sendo salvos?**
- Verifique se localStorage está habilitado
- Tente em modo anônimo/private

**App carregando lento?**
- Limpe cache do navegador
- Verifique conexão de internet

**Erro ao fazer deploy na Vercel?**
- Confirme que `package.json` está correto
- Verifique se todos os imports estão certos

## 📞 Suporte

Dúvidas? Verifique:
- Vite docs: vite.dev
- React docs: react.dev
- Vercel docs: vercel.com/docs

## 📄 Licença

MIT - Livre para usar, modificar e distribuir

---

**Feito com ❤️ para produtividade**
# livr3
