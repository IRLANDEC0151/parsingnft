import { Router } from "express"
import axios from "axios"

const router = Router();
let collectionNameSolanart = []
let collectionDataSolanart = []
let promise = []

router.get('/', async (req, res) => {
    try {
        res.render("home", {
            title: "Парсинг NFT",
            style: '/home.css',
            script: '/home.js'
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/parsingSolanart', async (req, res) => {
    try {
        await parsingSolanartCollectionName()
        let data = await parsingSolanartCollectionData()
        res.status(200).json({ data })
    } catch (error) {
        console.log(error);
    }
})
router.get('/getSolanart', async (req, res) => {
    try {
        res.status(200).json({ data: collectionDataSolanart })
    } catch (error) {
        console.log(error);
    }
})
async function parsingSolanartCollectionName() {
    // парсим названия коллекций
    await axios.get('https://qzlsklfacc.medianetwork.cloud/query_volume_all')
        .then(function (response) {
            collectionNameSolanart = response.data.map(element => axios.get(`https://qzlsklfacc.medianetwork.cloud/nft_for_sale?collection=${element.collection}`));
        })
        .catch(function (error) {
            console.log(error);
        })
}
async function parsingSolanartCollectionData() {
   
    collectionNameSolanart.forEach((el) => {

        axios.get('https://qzlsklfacc.medianetwork.cloud/nft_for_sale', {
            params: {
                collection: el
            }
        }).then(function (response) {
            collectionDataSolanart.push(response.data)
            console.log(response.data.length);
            console.log('collectionDataSolanart.length: ', collectionDataSolanart.length);

        })
            .catch(function (error) {
                console.log(error);
            })
    });
    return collectionDataSolanart
}
export default router
