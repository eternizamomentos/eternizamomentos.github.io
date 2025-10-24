# 🧠 Documentação Técnica — Studio Art Hub

**Versão:** Fase 1 – Deploy Automático + Modo Manutenção Premium  
**Responsável:** Josué Silva Galvão  
**Atualizado em:** Outubro/2025  

---

## 🎯 Propósito
Este documento registra decisões técnicas, padrões e restrições adotadas no projeto **Studio Art Hub**, garantindo rastreabilidade e continuidade profissional do desenvolvimento.

---

## ⚙️ Configuração de Build e Deploy

| Item | Valor |
|------|--------|
| Framework | **Next.js 15.5.6** |
| Modo de build | `output: "export"` (site 100% estático) |
| Hospedagem | GitHub Pages |
| Deploy | Automático via GitHub Actions |
| Node.js | v20.x |
| CI/CD | `.github/workflows/deploy.yml` |

---

## 📁 Estrutura de Diretórios
studioarthub/
├── components/
│ ├── Header.tsx
│ ├── Footer.tsx
│ ├── Layout.tsx
│ ├── Hero.tsx
│ └── CTAButton.tsx
├── pages/
│ ├── _app.tsx
│ ├── index.tsx
│ ├── contato.tsx
│ ├── preco/
│ ├── como-funciona/
│ └── ...
├── public/
│ ├── favicon.ico
│ └── ...
├── styles/
│ ├── globals.css
│ └── Home.module.css
├── docs/
│ └── NOTAS.md
└── next.config.js

---

## 🚫 Rotas de API (`/pages/api`)

O projeto **não suporta rotas de API** devido ao uso de `output: "export"`, que gera **arquivos estáticos HTML/JS/CSS** sem servidor Node.js.  

| Item | Descrição |
|------|------------|
| **Motivo técnico** | Hospedagens estáticas (como GitHub Pages) não executam código de servidor. |
| **Decisão** | Pasta `pages/api` removida do repositório. |
| **Arquivo arquivado** | `pages/_archived/hello.ts` (referência técnica). |
| **Alternativas de comunicação** | Google Forms, WhatsApp Business API, Google Analytics, Meta Pixel. |

---

## 🧰 Modo de Desenvolvimento

| Comando | Função |
|----------|--------|
| `npm run dev` | Executa ambiente local de desenvolvimento |
| `npm run build` | Gera o build estático na pasta `out/` |
| `git push` | Aciona o deploy automático via GitHub Actions |

---

## 💎 Padrões Visuais e UX

| Área | Padrão |
|------|--------|
| **Paleta Oficial** | Midnight Navy `#101828`, Blush Rose `#E9B8C7`, Soft Gold `#E7B75F`, CTA Raspberry `#C7355D` |
| **Layout Global** | `components/Layout.tsx` — estrutura: Header + Conteúdo + Footer |
| **Responsividade** | TailwindCSS — abordagem mobile-first |
| **Seção Hero** | Gradiente “Noite & Ouro”, cobrindo da borda do Header ao conteúdo |
| **Acessibilidade** | Compatibilidade AA + link “Pular para o conteúdo” ativo |
| **CTA Buttons** | Consistentes com padrão da página de manutenção (rosa com hover mais escuro) |

---

## 🔒 Modo de Manutenção Premium

| Item | Valor |
|------|--------|
| **Localização** | `/maintenance.html` |
| **Controle de acesso** | Redirecionamento condicional implementado em `_app.tsx` |
| **Visual** | Estilo premium consistente com o design system oficial |
| **Acesso interno** | Parâmetro `?preview=1` libera visualização real do site |

---

## 🧩 Decisões Técnicas Relevantes

| Nº | Decisão | Justificativa | Impacto |
|----|----------|----------------|----------|
| 1 | **Remoção da pasta `/pages/api`** | Incompatível com `output: "export"` | Nenhum (site é 100% estático) |
| 2 | **Ativação de `overflow: hidden` no `<main>` do Layout** | Elimina colapso de margens e gaps visuais | Corrige espaçamento entre Header e Hero |
| 3 | **Ajuste no gradiente do Hero** | Remove gap visual acima do gradiente principal | Alinhamento perfeito entre Header e Hero |
| 4 | **Deploy via GitHub Actions** | Automatiza build e push para GH Pages | Deploy confiável e reprodutível |
| 5 | **Manutenção condicional via `_app.tsx`** | Garante modo preview privado | Evita exposição de conteúdo parcial |

---

## 🧾 Observações Finais

- Todo código segue **padrão premium de qualidade**, sem gambiarras.  
- Componentes novos devem respeitar o design system e a hierarquia atual.  
- Documentação deve ser atualizada a cada modificação estrutural.  
- Padrão de commit: emojis + descrição objetiva (`🧠 Doc:`, `🚀 Deploy:`, `💄 Style:` etc.).  

---

📄 **Copyright © Studio Art Hub**  
Desenvolvido com excelência, precisão e atenção aos detalhes.
