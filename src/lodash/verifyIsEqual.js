const isEqual = require("lodash/isEqual");
const toRemove = require("lodash/dropWhile");
const { findCardapioByDate, todosOsCardapio } = require("../databases/querys");

async function isItNeedToNotify({ cardapioDeHoje, toDayDate }, next) {
  if (cardapioDeHoje != null) {
    const b = await findCardapioByDate(toDayDate, (e) => e);
    const almoco = isEqual(cardapioDeHoje.amoco, b.amoco);
    const jantar = isEqual(cardapioDeHoje.jantar, b.jantar);
    const nomeDaRefei = isEqual(cardapioDeHoje.nomeDaRefei, b.nomeDaRefei);
    // console.log(almoco);
    return next({ almoco, jantar, nomeDaRefei });
  }
}

async function verifyIsNewCardapio({ cardapioFormatado, index }, next) {
  const fromDatabes = await todosOsCardapio((d) => d[index]);
  if (fromDatabes) {
    const getCardapioFromDatabase = toRemove([fromDatabes], [!'_id']);
    console.log(getCardapioFromDatabase);
    const isNewCardapioToUpdate = isEqual(
      getCardapioFromDatabase,
      cardapioFormatado
    );
    return next(isNewCardapioToUpdate);
  // } else {
  //   return next(false);
  }
}

module.exports = { isItNeedToNotify, verifyIsNewCardapio };
