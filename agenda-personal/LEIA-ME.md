# Agenda para personal trainer

- index.html : estrutura
- style.css  : cores e aparência (variáveis no começo)
- app.js     : lógica. Dados de exemplo na função seed()

## Abrir no celular

O projeto também pode ser instalado como um app (PWA), com ícone na tela inicial e
uso offline depois da primeira visita. O workflow em `.github/workflows/pages.yml`
publica o site no GitHub Pages com HTTPS automaticamente.

- **Android:** abra o endereço HTTPS no Chrome e toque em **Instalar app** (ou use
  o menu ⋮ > **Instalar app** / **Adicionar à tela inicial**).
- **iPhone:** abra o endereço HTTPS no Safari, toque em **Compartilhar** e depois
  em **Adicionar à Tela de Início**.

O endereço `http://192.168...` da rede local serve para testar, mas não permite
instalar o app. No computador, também é possível testar com o Live Server do VS
Code.

### Publicar no GitHub Pages

1. Instale o Git ou o GitHub Desktop e crie um repositório vazio no GitHub.
2. Inicialize o Git **nesta pasta do projeto** (`agenda-personal`) e envie os
   arquivos para a branch `main`. Pelo terminal, dentro desta pasta:

   ```text
   git init -b main
   git add .
   git commit -m "Publica agenda como PWA"
   git remote add origin https://github.com/SEU_USUARIO/agenda-personal.git
   git push -u origin main
   ```

   Troque `SEU_USUARIO` pelo seu usuário do GitHub e use a URL do repositório
   criado. Se o Git já estiver inicializado, não repita `git init`.
3. No GitHub, abra **Settings > Pages**, selecione **GitHub Actions** como fonte
   de publicação e salve. O workflow publica o site a cada envio para `main`.
4. Quando a ação **Deploy to GitHub Pages** terminar, abra o endereço exibido em
   **Settings > Pages** no celular e instale-o.

O site publicado é acessível publicamente. Os dados da agenda são salvos no
navegador de cada aparelho e não são enviados ao GitHub nem sincronizados. Revise
os dados de exemplo antes de publicar o código.

## Diferenciais desta versão
- Pacote de aulas por aluno: ao tocar em "Concluir", desconta 1 aula automaticamente
- Alerta de pacote acabando (2 aulas ou menos) com mensagem de renovação no WhatsApp
- Objetivo e observações de saúde de cada aluno

Os dados ficam salvos no navegador (localStorage). Para vários aparelhos, ligar a um banco online (Supabase ou Firebase).
