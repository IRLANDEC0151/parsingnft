import axios from 'axios'
import async from "async"
let collectionNameSolanart = []
let collectionDataSolanart = []
let startTime 
const concurrency = 100;
export const taskQueue = async.queue(async (task, done) => {
    try {
        await task();
        console.log('Task completed, tasks left: ' + taskQueue.length() + '\n');
        //done();
    } catch (err) { 
        throw err; 
    }
}, concurrency);

taskQueue.drain(function () {
    const endTime = new Date();
    console.log(`🎉  All items completed [${(endTime - startTime) / 1000}s]\n`);
   console.log('collectionDataSolanart: ', collectionDataSolanart.length);
   // process.exit();
});

async function main() {
    try {
        startTime = new Date();
        await axios('https://qzlsklfacc.medianetwork.cloud/query_volume_all')
            .then((data) => {
                collectionNameSolanart = data.data.map(element => element.collection);
            })
            for (let index = 0; index < collectionNameSolanart.length; index++) {
                const collection = collectionNameSolanart[index];
                taskQueue.push(
                    () => parsingSolanartCollectionData(collection),
                    (err) => {
                        if (err) {
                            throw new Error('🚫 Error getting data from collection' + collection);
                        }
                        console.log(`Completed getting data from collection#${collection}\n`);
                    }
                );
            }
    } catch (error) {
        console.log(error);
    }
 
}

    function parsingSolanartCollectionData(collection) {
    try { 
         axios(`https://qzlsklfacc.medianetwork.cloud/nft_for_sale?collection=${collection}`)
            .then(function (response) {
                collectionDataSolanart = collectionDataSolanart.concat(response.data)
                console.log('collectionDataSolanart: ', collectionDataSolanart.length);
            }).catch(function (error) {
                throw new Error('🚫 Error getting data from collection' + collection); 
            })
    } catch (err) {
        console.log(err);
    }
}

//Solanart
main()  