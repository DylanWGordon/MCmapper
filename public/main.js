// const API_URL = 'https://mcmap-webservice.onrender.com';

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
    const response = await fetch(`/poi/${id}`, {
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
    console.log(reqBody)
    console.log(JSON.stringify(reqBody))
    const response = await fetch(`/poi/${activeId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody),
    })
    console.log(response)
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
        const tableDiv = document.getElementById(populateMe)
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
    const fetchPromise = await fetch(`/poi`);
    const response = await fetchPromise.json()
    return response
}
async function singleloader() {
    const fetchPromise = await fetch(`/poi/${activeId}`);
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
        updateEntryBtn.textContent = "Update"
        updateEntryBtn.classList.add('updateBtn');
        updateEntryBtn.addEventListener('click', () => {
            const updatePoi = document.getElementById('updatepoi')
            showHiddenEle(updatePoi)
            activeId = id
            console.log(activeId)
        })
        entryDiv.append(updateEntryBtn)
        const deleteEntryBtn = document.createElement('button');
        deleteEntryBtn.textContent = "Delete"
        deleteEntryBtn.classList.add('deleteBtn');
        deleteEntryBtn.addEventListener('click', async () => {
            deleteEle(entryDiv, id)
            data = await loader();
            populateDiv()
        })
        entryDiv.append(deleteEntryBtn)
    }
}


// submit event
function submitUpdate() {
    const submitBtn = document.getElementById("submitpoi");
    submitBtn.addEventListener('click', async () => {
        const name = document.querySelector('#poiname').value;
        const biome = document.getElementById('biomes').value;
        const kind = document.getElementById('kind').value;
        const x = parseInt(document.getElementById('xcoord').value);
        const y = parseInt(document.getElementById('ycoord').value);
        const z = parseInt(document.getElementById('zcoord').value);
        const comment = document.getElementById('comments').value;
        const postBody = {
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
        const tableDiv = document.getElementById('populateMe')
        tableDiv.style.display = "flex;"
    })
}
submitUpdate()


populateDiv()





