export const pdfStyles = `
<style>
  body {
  font-family: Arial;
  padding: 25px;
}

/* CABEÇALHO */

.header {
  display: flex;
  align-items: center;
}

.header-left img {
  width: 130px;
  height: auto;
}


.header-center {
  flex: 1;
  text-align: center;
  font-weight: bold;
  font-size: 23px;
}

.header-right {
  text-align: right;
  font-size: 12px;
}

.header-right p {
  margin: 2px 0;
}

.label {
  font-weight: bold;
  display: inline-block;
  width: 90px;
}

.logo {
  height: 50px;
}

/* TÍTULO */

.title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
}

/* SEÇÕES */

.section {
  margin-top: 25px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 6px;
  border-bottom: 1px solid #ccc;
  text-align: center;
}

/* ITENS DA INSPEÇÃO */

.item {
  padding: 10px 0;
  margin-top: 10px;
  page-break-before: always;
}

/* STATUS */

.ok {
  color: green;
  font-weight: bold;
}

.nok {
  color: red;
  font-weight: bold;
}
  
.na {
  color: #f0ad4e;
  font-weight: bold;
}

/* FOTOS */

.fotos {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.foto-item {
  width: 32%;

  border: 1px solid #ddd;
  border-radius: 4px;

  overflow: hidden;
  box-sizing: border-box;

  page-break-inside: avoid;
  break-inside: avoid;
}

.foto-item img {
  width: 100%;
  height: 300px;

  object-fit: contain;

  display: block;
}
/* ASSINATURA */

.signature {
  margin-top: 60px;
  text-align: center;
}

.signature img {
  width: 400px;
  max-height: 140px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.signature-label {
  border-top: 2px solid #000;
  width: 280px;
  margin: 2px auto 0 auto;
  padding-top: 4px;
  font-weight: bold;
  font-size: 14px;
}

/* FINAL DO RELATÓRIO */

.report-end {
  margin-top: 40px;
  text-align: center;
  font-size: 11px;
  color: #666;
  border-top: 1px solid #ccc;
  padding-top: 10px;
}
</style>
`;