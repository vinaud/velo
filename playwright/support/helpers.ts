export function gerarCodigoPedido() {
    const prefixo = "VLO-";
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codigo = "";
  
    // Gera 6 caracteres aleatórios
    for (let i = 0; i < 6; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres[indice];
    }
  
    return prefixo + codigo;
  }