const parsingSolanartBtn = document.querySelector('.parsingSolanart')
const getSolanartBtn = document.querySelector('.getSolanart')

let collectionNameSolanart = []
let collectionDataSolanart = []
let collectionNameMagiceden = []
let collectionDataMagiceden = []
let currentPaginator = 1
let sumSolanart = 0
let sumMagiceden = 0
async function start() {
  //Solanart
  while (true) {
    let start = new Date()
    collectionDataSolanart = []
    await parsingSolanartCollectionName()
      .then((data) => {
        collectionNameSolanart = data.map(element => element.collection);
      })
    await parsingSolanartCollectionData()
    outputData(currentPaginator)
    let end = new Date()
    const convertTime = Math.round((end - start) % 60000 / 1000) + 'сек'
    console.log('круг: ' + convertTime);
    console.log('карточек: ' + collectionDataSolanart.length);
  }

  //Magiceden
  // await parsingMagicedenCollectionName()
  //   .then((data) => {
  //     collectionNameMagiceden = data.collections.map(element => element.symbol);
  //   })
  //  await parsingMagicedenCollectionData()

}
//Solanart
function parsingSolanartCollectionName() {
  return fetch('https://qzlsklfacc.medianetwork.cloud/query_volume_all').then((data) => {
    return data.json()
  })
}

function getSolanart(el) {
  return fetch(`https://qzlsklfacc.medianetwork.cloud/nft_for_sale?collection=${el}`).then((data) => {
    return data.json()
  })
}
//Magiceden
function parsingMagicedenCollectionName() {
  return fetch('https://api-mainnet.magiceden.io/all_collections').then((data) => {
    return data.json()
  })
}

function getMagiceden(el) {
  return fetch(`https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q=%7B%22%24match%22%3A%7B%22collectionSymbol%22%3A%22${el}%22%7D%2C%22%24sort%22%3A%7B%22createdAt%22%3A-1%7D%2C%22%24skip%22%3A0%2C%22%24limit%22%3A1000000%7D`).then((data) => {
    return data.json()
  })
}

async function parsingSolanartCollectionData() {
  for (let index = 0; index < collectionNameSolanart.length; index++) {
    const el = collectionNameSolanart[index];
    await getSolanart(el)
      .then(function (response) {
        sumSolanart += response.length
        collectionDataSolanart = collectionDataSolanart.concat(response)
      }).catch(function (error) {
        console.log(error);
      })
  }
}
//Magiceden
async function parsingMagicedenCollectionData() {
  for (let index = 0; index < collectionNameMagiceden.length; index++) {
    const el = collectionNameMagiceden[index];
    await getMagiceden(el)
      .then(function (response) {
        console.log('response: ', response);
        sumMagiceden += response.results.length
        collectionDataMagiceden = collectionDataMagiceden.concat(response.results)
      }).catch(function (error) {
        console.log(error);
      })
  }
}
function outputData(paginator) {
  let allPagination = Math.ceil(sumMagiceden / 100)
  // document.querySelector('.paginationNext').insertAdjacentHTML('beforebegin', `
  // <li class="page-item"><a class="page-link" href="#">...</a></li>
  // <li class="page-item"><a class="page-link" href="#">${allPagination}</a></li>
  // `)
  document.querySelector('.data').innerHTML = ""
  for (let index = (paginator - 1) * 100; index < paginator * 100; index++) {
    const element = collectionDataSolanart[index];
    document.querySelector('.data').insertAdjacentHTML('beforeend', `
            <div class="col">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${element.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Коллекция: ${element.type}</h6>
                <table class="table">
                  <tbody  id="${element.token_add}">
                  </tbody>
                </table>
              </div>
            </div>
          </div>
            `)
    document.getElementById(`${element.token_add}`).insertAdjacentHTML('beforeend', `
    <tr>
    <td>id</td>
    <td>${element.id}</td>
  </tr> 
    <tr>
    <td>token</td>
    <td>${element.token_add}</td>
  </tr>
           <tr>
            <td>цена</td>
            <td>${element.price}</td>
          </tr>
          <tr>
            <td>цена последней  продажи</td>
            <td>${element.lastSoldPrice}</td>
          </tr>
             <tr>
            <td>атрибуты</td>
            <td>${element.attributes}</td>
          </tr>
         
           <tr>
            <td>картинка</td>
            <td><a href="${element.link_img}" target="_blank">${element.link_img}</a></td>
          </tr> 
             <tr>
            <td>programId</td>
            <td>${element.programId}</td>
          </tr> 
           <tr>
            <td>владелец</td>
            <td>${element.escrowAdd}</td>
          </tr> 
           <tr>
            <td>Последний покупатель</td>
            <td>${element.seller_address}</td>
          </tr> 
            `)

  }
}
document.querySelector('.paginationBack').addEventListener('click', () => {
  if (currentPaginator - 1 != 0) {
    outputData(--currentPaginator)
  }
})
document.querySelector('.paginationNext').addEventListener('click', () => {
  outputData(++currentPaginator)
})

start()