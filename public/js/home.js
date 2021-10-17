const parsingSolanartBtn = document.querySelector('.parsingSolanart')
const getSolanartBtn = document.querySelector('.getSolanart')

let collectionNameSolanart = []
let collectionDataSolanart = []
let collectionNameMagiceden = []
let collectionDataMagiceden = []
let currentPaginator = 1
let sumSolanart = 0
let sumMagiceden = 0
let userAgent = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
]
let startTime
async function start() {
  //Solanart
  console.log("Solanart");
  collectionDataSolanart = []
  startTime = new Date()
  // await parsingSolanartCollectionName()
  //   .then((data) => {
  //     collectionNameSolanart = data.map(element => element.collection);
  //   })
  // await parsingSolanartCollectionData()
  // Magiceden
  collectionDataMagiceden = []
  console.log("Magiceden");
  await parsingMagicedenCollectionName()
    .then((data) => {
      collectionNameMagiceden = data.collections.map(element => element.symbol);
    })
  await parsingMagicedenCollectionData()

}
//Solanart
async function parsingSolanartCollectionName() {
  const data = await fetch('https://qzlsklfacc.medianetwork.cloud/query_volume_all')
  return await data.json()
}

async function getSolanart(el) {
  const data = await fetch(`https://qzlsklfacc.medianetwork.cloud/nft_for_sale?collection=${el}`)
  return await data.json()
}
//Magiceden
async function parsingMagicedenCollectionName() {
  const data = await fetch('https://api-mainnet.magiceden.io/all_collections')
  return await data.json()
}

async function getMagiceden(el, user) {
  const data = await fetch(`https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q=%7B%22%24match%22%3A%7B%22collectionSymbol%22%3A%22${el}%22%7D%2C%22%24sort%22%3A%7B%22createdAt%22%3A-1%7D%2C%22%24skip%22%3A0%2C%22%24limit%22%3A1000000%7D`,
    {
      'User-Agent': user
    }
  )
  return await data.json()
}

async function parsingSolanartCollectionData() {
  for (let index = 0; index < collectionNameSolanart.length; index++) {
    const el = collectionNameSolanart[index];
    getSolanart(el)
      .then(function (response) {
        sumSolanart += response.length
        collectionDataSolanart = collectionDataSolanart.concat(response)
      }).catch(function (error) {
        console.log(error);
      })
  }
  setTimeout(() => {
    outputData(currentPaginator)
    const convertTime = Math.round((new Date() - startTime)) + 'сек'
    console.log('круг: ' + convertTime);
    console.log('карточек #Solanart: ' + collectionDataSolanart.length);
    start()
  }, 3000);
}
//Magiceden
async function parsingMagicedenCollectionData() {
  for (let index = 0; index < collectionNameMagiceden.length; index++) {
    const el = collectionNameMagiceden[index];
    let user = userAgent[Math.ceil(Math.random() * 8)]
    getMagiceden(el, user)
      .then(function (response) {
        sumMagiceden += response.results.length
        collectionDataMagiceden = collectionDataMagiceden.concat(response.results)
      }).catch(function (error) {
        console.log(error);
      })
  }
  setTimeout(() => {
    //outputData(currentPaginator)
    const convertTime = Math.round((new Date() - startTime)) + 'сек'
    console.log('круг: ' + convertTime);
    console.log('карточек #Magiceden: ' + collectionDataMagiceden.length);
    //start()
  }, 5000);
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

function parsingSolanart() {
  fetch('/parsingSolanart')
    .then(data => data.json())
    .then(data => {
      console.log(data);
    })
}
//parsingSolanart()