const isEqual = require("lodash/isEqual");
const { findCardapioByDate } = require("../databases/querys");

async function isItNeedToNotify({cardapioDeHoje, toDayDate}, next) {
  if (cardapioDeHoje!= null) {
    const b = await findCardapioByDate(toDayDate, (e) => e);
    const almoco = isEqual(cardapioDeHoje.amoco, b.amoco);
    const jantar = isEqual(cardapioDeHoje.jantar, b.jantar);
    const nomeDaRefei = isEqual(cardapioDeHoje.nomeDaRefei, b.nomeDaRefei);
    // console.log(almoco);
    return next({ almoco, jantar, nomeDaRefei });
  }
}

module.exports = { isItNeedToNotify };
