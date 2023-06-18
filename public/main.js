// const API_URL = 'https://mcmap-webservice.onrender.com';

function showHiddenEle(ele) {
    if (ele.style.display !== 'flex') {
        ele.style.display = 'flex'
    }
}

async function deleteEle(ele, id) {
    const parent = ele.parentElement;
    console.log(id)
    const response = await fetch(`/poi/${id}`, {
        method: "DELETE"
    })
    parent.removeChild(ele)
    console.log(response)
}

//show addpoi form
const poiShow = document.getElementById("addpoibtn");
const addPoiDiv = document.getElementById("addpoi")
poiShow.addEventListener('click', () => {
    showHiddenEle(addPoiDiv)
})


//update data func
async function loader() {
    const fetchPromise = await fetch(`/poi`);
    const response = await fetchPromise.json()
    return response
}

//Fill Display div 
async function populateDiv() {
    const tableDiv = document.getElementById('populateMe');
    const data = await loader()
    tableDiv.innerHTML = '';
    for (let i = 0; i < data.length; i++) {

        const entryDiv = document.createElement('div')
        entryDiv.classList.add('entryCard');
        const entry = document.createElement('p')
        const id = data[i]['id']
        entry.innerHTML = `<h2>${data[i].name}</h2>
        <p>Biome: ${data[i].biome}</p>
        <p>Structure: ${data[i].kind}</p>
        <p>Coordinates: ${data[i].x} ${data[i].y} ${data[i].z}</p>
        <p>Comments: <br>
        ${data[i].comments}</p>
        `;


        entryDiv.append(entry)
        tableDiv.append(entryDiv)
        const updateEntryBtn = document.createElement('button')
        updateEntryBtn.classList.add('updateBtn');
        updateEntryBtn.addEventListener('click', () => {
            function updateEle(entry, id) {
                for (let key in data[i]) {
                    // const uName = document.getElementById('updatepoiname');
                    // const uBiome = document.getElementById('updatebiomes');
                    // const uKind = document.getElementById('updatekind');
                    // const uX = document.getElementById('updatexcoord');
                    // const uY = document.getElementById('updateycoord');
                    // const uZ = document.getElementById('updatezcoord');
                    // const uComments = document.getElementById('updatecomment');
                    console.log(key)
                }
            }
        })
        entryDiv.append(updateEntryBtn)
        const deleteEntryBtn = document.createElement('button');
        deleteEntryBtn.classList.add('deleteBtn');
        deleteEntryBtn.addEventListener('click', () => {
            deleteEle(entryDiv, id)
            loader();
            populateDiv()
        })
        entryDiv.append(deleteEntryBtn)
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
    //Function to post
    async function postData() {
        const response = await fetch(`/poi`, {
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

//delete one entry

