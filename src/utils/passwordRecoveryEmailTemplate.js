export function generatePasswordResetEmail(baseUrl, token) {
  const resetUrl = `${baseUrl}/recuperar-senha?token=${token}`;

  const logo1 = 'cid:logoCapju';
  const logo2 = 'cid:logoUnb';
  const logo3 = 'cid:logoJusticaFederal';

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Recuperação de Senha - CAPJu</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                width: 80%;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .logos-container {
                display: flex;
                margin-top: 20px;
                justify-content: space-around; 
                align-items: center;
            }
            .logos-container img {
                flex-grow: 1;
                max-width: 100px;
                height: auto;
            }
            a {
                color: #0275d8;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Recuperação de Senha - CAPJu</h2>
            <p>Prezado(a) usuário(a),</p>
            <p>Você solicitou a recuperação de senha na plataforma CAPJu. Para prosseguir com a redefinição, por favor, clique no link abaixo:</p>
            <p><a href="${resetUrl}" target="_blank">Recuperar senha</a></p>
            <p><strong>Importante:</strong> Este link é válido por 10 minutos a partir do recebimento deste e-mail.</p>
            <p>Se você não solicitou a recuperação, desconsidere esta mensagem.</p>
            <p>Se precisar de ajuda ou tiver qualquer dúvida, não hesite em entrar em contato conosco.</p>
            <p>Atenciosamente,</p>
            <p>Equipe CAPJu.</p>
            <table width="100%">
            <tr>
                <td width="33%" style="text-align: left;">
                    <img src="${logo1}" alt="Logo CAPJu" style="max-width: 100px; height: auto;">
                </td>
                <td width="34%" style="text-align: center;">
                    <img src="${logo2}" alt="Logo UnB" style="max-width: 100px; height: auto;">
                </td>
                <td width="33%" style="text-align: right;">
                    <img src="${logo3}" alt="Logo Justiça Federal" style="max-width: 100px; height: auto;">
                </td>
            </tr>
        </table>
        </div>
    </body>
    </html>
    `;
}
