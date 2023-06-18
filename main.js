const API_URL = 'https://corsproxy.io/?https://mcmap-webservice.onrender.com';

function showHiddenEle(ele) {
    if (ele.style.display !== 'flex') {
        ele.style.display = 'flex'
    }
}

//show addpoi form
const poiShow = document.getElementById("addpoibtn");
const addPoiDiv = document.getElementById("addpoi")
poiShow.addEventListener('click', () => {
    showHiddenEle(addPoiDiv)
})


//update data func
async function loader() {
    const fetchPromise = await fetch(`${API_URL}/poi`);
    const response = await fetchPromise.json()
    return response
}

//Fill Display div 
async function populateDiv() {
    const tableDiv = document.getElementById('populateMe');
    const data = await loader()
    tableDiv.innerHTML = '';
    for (let i = 0; i < data.length; i++) {

        const entry = document.createElement('p')
        entry.textContent = JSON.stringify(data[i]);
        tableDiv.append(entry)
    }
}
populateDiv()


//Add 1 to poi on submit click
const clickme = document.getElementById("submitpoi");
clickme.addEventListener('click', async () => {
    const name = document.querySelector('#poiname').value;
    const biome = document.getElementById('biomes').value;
    const kind = document.getElementById('kind').value;
    const x = parseInt(document.getElementById('xcoord').value);
    const y = parseInt(document.getElementById('ycoord').value);
    const z = parseInt(document.getElementById('zcoord').value);
    const comment = document.getElementById('comment').value;
    const postBody = {
        "name": name,
        "biome": biome,
        "kind": kind,
        "x": x,
        "y": y,
        "z": z,
        "comments": comment,
    }
    async function postData() {
        const response = await fetch(`${API_URL}/poi`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postBody),
        })
        return response.json
    }
    postData();
    data = await loader();
    populateDiv()
})

