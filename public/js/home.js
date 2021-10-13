const parsingSolanartBtn = document.querySelector('.parsingSolanart')
const getSolanartBtn = document.querySelector('.getSolanart')

let collectionNameSolanart = []
let collectionDataSolanart = []
let currentPaginator = 1
let sum = 0
async function start() {
    await parsingSolanart()
        .then((data) => {
            collectionNameSolanart = data.map(element => element.collection);
        })
    await parsing()
    outputData(currentPaginator)
}
function parsingSolanart() {
    return fetch('https://qzlsklfacc.medianetwork.cloud/query_volume_all').then((data) => {
        return data.json()
    })
}

function getSolanart(el) {
    return fetch(`https://qzlsklfacc.medianetwork.cloud/nft_for_sale?collection=${el}`).then((data) => {
        return data.json()
    })
}

async function parsing() {
    for (let index = 0; index < collectionNameSolanart.length; index++) {
        const el = collectionNameSolanart[index];
        await getSolanart(el)
            .then(function (response) {
                sum += response.length
                collectionDataSolanart = collectionDataSolanart.concat(response)
            }).catch(function (error) {
                console.log(error);
            })
    }
}
function outputData(paginator) {
    let allPagination = Math.ceil(sum / 100)
    console.log(currentPaginator);
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
            <td>цена</td>
            <td>${element.price}</td>
          </tr> <tr>
            <td>цена последней  продажи</td>
            <td>${element.lastSoldPrice}</td>
          </tr>
             <tr>
            <td>атрибуты</td>
            <td>${element.attributes}</td>
          </tr>
           <tr>
            <td>token</td>
            <td>${element.token_add}</td>
          </tr>
           <tr>
            <td>картинка</td>
            <td>${element.link_img}</td>
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