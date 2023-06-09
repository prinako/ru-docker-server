const express = require("express");
const router = express.Router();

const {
  isItNeedToNotify,
  verifyIsNewCardapio,
} = require("../lodash/verifyIsEqual");
const {
  postCardapio,
  todosOsCardpio,
  dropCollection,
  updateCardapio,
  findCardapioByDate,
  postUsersTokens,
  getCardapioFormatToVerify,
} = require("../databases/querys");

const { getAllCardapio } = require("../cardapio/getCardapio");
const {
  notifyUserCardapioDeHojeMudou,
  novoCardapioDaSemana,
} = require("../firebase/push-notification");

router.get("/", async (req, res) => {
  res.send("ok");
});

// router.post("/new", async (req, res) => {
//   main();
//   res.send("ok");
// });

router.get("/api", async (req, res) => {
  const resolute = await todosOsCardpio((doc) => doc);
  if (resolute.length > 5) {
    await dropCollection((e) => {
      if (e) {
        main();
        // notify all users
        novoCardapioDaSemana();
        return;
      }
    });
  }
  res.json(resolute);
});

// router.post("/token", async (req, res) => {
//   await postUsersTokens(req, (next) => {
//     // console.log(next +1);
//   });
//   res.send("ok");
// });

router.post("/drop", async (req, res) => {
  await dropCollection((e) => {
    // console.log(e);
    if (e) {
      main();
      // notify all users
      novoCardapioDaSemana();
      return res.send(e);
    } else {
      res.send(e);
    }
  });
});

// router.post("/update", async (req, res) => {
//   //for today date
//   const date = new Date();
//   const toDayDate = `${date.getDate()}-0${
//     date.getMonth() + 1
//   }-${date.getFullYear()}`;

//   const cardapioDeHoje = await findCardapioByDate(toDayDate, (e) => e);
//   //  console.log(cardapioDeHoje);

//   await update(async (callback) => {
//     await isItNeedToNotify(cardapioDeHoje, toDayDate, (next) => {
//       //console.log(next);
//       notifyUserCardapioDeHojeMudou({
//         almoco: next.almoco,
//         jantar: next.jantar,
//         nome: next.nomeDaRefei,
//       });
//     });
//     //console.log(callback);
//   });
//   res.send("ok");
// });

async function update() {
  console.log("up");

  const date = new Date();

  const toDayDate = `${date.getDate()}-0${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  const cardapioDeHoje = await findCardapioByDate(toDayDate, (e) => e);

  await getAllCardapio(async (next) => {
    await updateCardapio(next);
  });

  //  console.log(cardapioDeHoje);

  await isItNeedToNotify({ cardapioDeHoje, toDayDate }, async (next) => {
    //console.log(next);
    await notifyUserCardapioDeHojeMudou({
      almoco: next.almoco,
      jantar: next.jantar,
      nome: next.nomeDaRefei,
    });

    console.log(next);
  });
  //console.log(callback);

  return;
}

async function main() {
  await getAllCardapio(async (novoCardapioDoSiteRu) => {
    await postCardapio(novoCardapioDoSiteRu, (e) => {
      console.log(e);
    });
  });
  return;
}

module.exports = { main, router, update };
