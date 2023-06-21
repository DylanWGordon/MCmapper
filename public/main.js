const API_URL = 'https://mcmap-webservice.onrender.com';

//Active id
let activeId = 0





//show element func
function showHiddenEle(ele) {
    if (ele.style.display !== 'flex') {
        ele.style.display = 'flex'
    }
    const tableDiv = document.getElementById('populateMe')
    tableDiv.style.display = "none"
}



//Close Button Event Listeners
function closeBtnEvent() {
    function closeBtnFunc(ele) {
        ele.style.display = "none";
        const tableDiv = document.getElementById('populateMe');
        tableDiv.style.display = "flex"
    }
    function closeEvent() {
        const closeAdd = document.getElementById('addCloseBtn');
        const closeUpdate = document.getElementById('closeUpdateBtn');
        closeUpdate.addEventListener('click', () => {
            const updatePoi = document.getElementById('updatepoi')
            closeBtnFunc(updatePoi)
        })
        closeAdd.addEventListener('click', () => {
            const addPoiDiv = document.getElementById("addpoi")
            closeBtnFunc(addPoiDiv)
        })
    }
    closeEvent()
}
closeBtnEvent()




//delete function
async function deleteEle(ele, id) {
    const parent = ele.parentElement;
    console.log(id)
    const response = await fetch(`${API_URL}/poi/${id}`, {
        method: "DELETE"
    })
    parent.removeChild(ele)
    console.log(response)
}


//update function
async function updateEle(entry, id) {
    const data = await singleloader()
    const reqBody = {}
    for (let key in data) {
        //uKeys
        const uName = document.getElementById('updatepoiname').value;
        const uBiome = document.getElementById('updatebiomes').value;
        const uKind = document.getElementById('updateKind').value;
        const uX = document.getElementById('updatexcoord').value;
        const uY = document.getElementById('updateycoord').value;
        const uZ = document.getElementById('updatezcoord').value;
        const uComments = document.getElementById('updatecomments').value;

        const compareObj = {
            name: `${uName}`,
            biome: `${uBiome}`,
            kind: `${uKind}`,
            x: `${uX}`,
            y: `${uX}`,
            z: `${uZ}`,
            comments: `${uComments}`
        }

        if (compareObj[`${key}`] !== '' || undefined) {
            if (data[`${key}`] !== compareObj[`${key}`]) {
                reqBody[`"${key}"`] = compareObj[`${key}`]
            }
        }
    }
    const response = await fetch(`${API_URL}/poi/${activeId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody),
    })
    return response
}

//Update Btn Event Listener
function updateOpenEvent() {
    const submitUpdateBtn = document.getElementById('updatepoibtn')
    submitUpdateBtn.addEventListener('click', async () => {
        await updateEle()
        loader()
        populateDiv()
        const updatePoiDiv = document.getElementById('updatepoi')
        updatePoiDiv.style.display = 'none';
        const tableDiv = document.getElementById('populateMe')
        tableDiv.style.display = "flex"
    })
}
updateOpenEvent()

//show addpoi form
function openAddForm() {
    const poiShow = document.getElementById("addpoibtn");
    poiShow.addEventListener('click', () => {
        const addPoiDiv = document.getElementById("addpoi")
        showHiddenEle(addPoiDiv)
    })
}
openAddForm()


//Reload data funcs
async function loader() {
    const fetchPromise = await fetch(`${API_URL}/poi`);
    const response = await fetchPromise.json()
    return response
}

async function searchData(){
    const searchString = document.getElementById('searchBar').value
    const searchValue = encodeURIComponent(searchString);
    
    const fetchPromise = await fetch(`${API_URL}/search?${searchValue}`);
    const response = await fetchPromise.json();
    console.log(response)
    return response
}

async function singleloader() {
    const fetchPromise = await fetch(`${API_URL}/poi/${activeId}`);
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
        const btnDiv = document.createElement('div')
        const updateEntryBtn = document.createElement('button')
        updateEntryBtn.textContent = "Update"
        updateEntryBtn.classList.add('updateBtn', 'mc-button');
        updateEntryBtn.addEventListener('click', () => {
            const updatePoi = document.getElementById('updatepoi')
            showHiddenEle(updatePoi)
            activeId = id
            console.log(activeId)
        })
        btnDiv.append(updateEntryBtn)
        const deleteEntryBtn = document.createElement('button');
        deleteEntryBtn.textContent = "Delete"
        deleteEntryBtn.classList.add('deleteBtn', 'mc-button');
        deleteEntryBtn.addEventListener('click', async () => {
            deleteEle(entryDiv, id)
            data = await loader();
            populateDiv()
        })
        btnDiv.append(deleteEntryBtn)
        entryDiv.append(btnDiv)
    }
}

//Search Func
async function searchResults() {
    const tableDiv = document.getElementById('populateMe');
    const data = await searchData()
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
        const btnDiv = document.createElement('div')
        const updateEntryBtn = document.createElement('button')
        updateEntryBtn.textContent = "Update"
        updateEntryBtn.classList.add('updateBtn', 'mc-button');
        updateEntryBtn.addEventListener('click', () => {
            const updatePoi = document.getElementById('updatepoi')
            showHiddenEle(updatePoi)
            activeId = id
            console.log(activeId)
        })
        btnDiv.append(updateEntryBtn)
        const deleteEntryBtn = document.createElement('button');
        deleteEntryBtn.textContent = "Delete"
        deleteEntryBtn.classList.add('deleteBtn', 'mc-button');
        deleteEntryBtn.addEventListener('click', async () => {
            deleteEle(entryDiv, id)
            data = await searchData();
            populateDiv()
        })
        btnDiv.append(deleteEntryBtn)
        entryDiv.append(btnDiv)
    }
}

function searchEvent(){
const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', ()=>{
    searchResults()
})
}
searchEvent()


// submit event
function submitEvents() {
    const submitBtn = document.getElementById("submitpoi");
    let postBody = {};
    submitBtn.addEventListener('click', async () => {
        const name = document.querySelector('#poiname').value;
        const biome = document.getElementById('biomes').value;
        const kind = document.getElementById('kind').value;
        const x = parseInt(document.getElementById('xcoord').value);
        const y = parseInt(document.getElementById('ycoord').value);
        const z = parseInt(document.getElementById('zcoord').value);
        const comment = document.getElementById('comments').value;
        postBody = {
            "name": name,
            "biome": biome,
            "kind": kind,
            "x": x,
            "y": y,
            "z": z,
            "comments": comment,
        }
        const addPoiDiv = document.getElementById('addpoi')
        addPoiDiv.style.display = 'none';
        //Function to post
        async function postData(body) {
            const response = await fetch(`${API_URL}/poi`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
            })
            return response.json
        }
        const tableDiv = document.getElementById('populateMe')
        tableDiv.style.display = "flex";
        console.log(tableDiv)
        postData(postBody);
        data = await loader();
        populateDiv()
    })
}
submitEvents()


populateDiv()





