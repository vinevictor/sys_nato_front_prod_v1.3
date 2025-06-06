export async function createForm(
  construtora: {
    nome: string;
    telefone: string;
    email: string;
    cnpj: string;
    end: string;
  },
  totalValor: string,
  qtCert: number,
  msg: string,
  NProtocolo: string
) {
  const DateAtual = new Date()
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("/");

  const Produto = "BirdI500";

  function quebrarStringPorEspacos(string: string, limiteEspacos: number) {
    let resultado = "";
    let espacosContador = 0;

    for (let i = 0; i < string.length; i++) {
      resultado += string[i];
      if (string[i] === " ") espacosContador++;
      if (espacosContador === limiteEspacos) {
        resultado += "<br>";
        espacosContador = 0;
      }
    }
    return resultado;
  }

  const html = `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        width: 210mm;
        min-height: 297mm;
        letter-spacing: 0.05em;
        font-family: 'Cambria', Cochin, Georgia, Times, Times New Roman, serif;
        font-size: 12px;
        background: white;
        margin: 0 auto;
      }
      .container {
        width: 190mm;
        margin: 10mm auto;
        padding: 0 10mm;
      }
      .title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
      }
      .header {
        font-size: 13px;
      }
      .line {
        border-top: 1px solid black;
        margin: 10px 0;
      }
      .section {
        margin: 20px 0;
      }
      .info-container {
        display: flex;
        gap: 60px;
        width: 100%;
        padding-inline: 10px;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .table th,
      .table td {
        border: 1px solid black;
        padding: 5px;
        text-align: left;
        font-size: 13px;
      }
      .total-box {
        width: 100%;
        border: 1px solid black;
        padding: 10px;
        min-height: 100px;
        margin: 20px 0;
      }
      .footer {
        font-size: 18px;
        font-weight: bold;
        margin-top: 20px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
      @media print {
        body {
          width: 210mm;
          height: 297mm;
        }
        .page-break {
          page-break-before: always;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div style="display: flex; align-items: center; gap: 20px;">
        <div>
          <img src="" alt="">
        </div>
        <div>
          <div class="title">AR Interface certificador</div>
          <div class="header">Relatório de Emissão nº.: <span style="font-weight: 700;">${NProtocolo}</span></div>
          <div class="header">Data: ${DateAtual}</div>
        </div>
      </div>

      <div class="line"></div>

      <div class="info-container" style="padding-inline: 15px;">
        <div class="section" style="width: 300px">
          <div style="display: flex; flex-direction: column;">
            <span>AR INTERFACE CERTIFICADORA</span>
            <span>Tel: (16) 33252-4134</span>
            <span>email: atendimento@arinterfacecertificador.com.br</span>
            <span>site: https://arinterfacecertificador.com.br</span>
            <span>cnpj: 14.000.930/0001-50</span>
            <span>end: R. Américo Brasiliense, 284</span>
            <span>complemento: 3° Andar Sala 32 - Centro</span>
            <span>Cidade: Ribeirão Preto - SP</span>
            <span>Cep: 14015-050</span>
          </div>
        </div>
  
        <div class="section" style="width: 300px">
        
            <div style="display: flex; flex-direction: column;">
              <span>${construtora.nome}</span>
              <span>email: ${construtora.email}</span>
              <span>cnpj: ${construtora.cnpj}</span>
              <span>${construtora.end.split(",").join("<br />")}</span>
            </div>
            

        </div>
      </div>

      <div class="line"></div>

      <div style="padding-inline: 15px;">
        <div style="height: 200px;">
          <table class="table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Descrição</th>
                <th>Qtd</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${Produto}</td>
                <td>${quebrarStringPorEspacos(msg, 7)}</td>
                <td>${qtCert}</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="total-box">
          <div>Obs:</div>
        </div>
        <div class="footer">
          <div>Valor total: ${totalValor}</div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;

  return html;
}
