let ipAddressElement = document.getElementById("ipAddress");
let latitudeEle = document.getElementById("latitude");
let longitudeEle = document.getElementById("longitude");
let cityEle = document.getElementById("city");
let regionEle = document.getElementById("region");
let organisationEle = document.getElementById("organisation");
let hostNameEle = document.getElementById("hostName");

let mapContEle = document.getElementById("mapCont");

let timeZoneEle = document.getElementById("timeZone");
let datetimeEle = document.getElementById("datetime");
let pincodeEle = document.getElementById("pincode");
let messageEle = document.getElementById("message");

let allPostOfficeCont = document.getElementById("allPostOfficeCont");

let inputEle = document.getElementById("input");

let errorMsgEle = document.getElementById("error-msg");



let ipAddress = null;

let postOfficeArr = [];


function makeCard(obj){
    let div = document.createElement("div");
    div.classList.add("each-card");

    //name
    let nameEle = document.createElement("h3");
    nameEle.innerText = "Name : ";

    let nameAns = document.createElement("span");
    nameAns.innerText = obj.Name;
    nameEle.appendChild(nameAns);

    div.appendChild(nameEle);

    // branch type
    let branchTypeEle = document.createElement("h3");
    branchTypeEle.innerText = "Branch Type : ";

    let branchTypeAns = document.createElement("span");
    branchTypeAns.innerText = obj.BranchType;
    branchTypeEle.appendChild(branchTypeAns);

    div.appendChild(branchTypeEle);

    // delivery status

    let deliveryStatusEle = document.createElement("h3");
    deliveryStatusEle.innerText = "Delivery Status : ";

    let deliveryStatusAns = document.createElement("span");
    deliveryStatusAns.innerText = obj.DeliveryStatus;
    deliveryStatusEle.appendChild(deliveryStatusAns);

    div.appendChild(deliveryStatusEle);

    // district


    let districtEle = document.createElement("h3");
    districtEle.innerText = "District : ";

    let districtAns = document.createElement("span");
    districtAns.innerText = obj.District;
    districtEle.appendChild(districtAns);

    div.appendChild(districtEle);

    // division

    let divisionEle = document.createElement("h3");
    divisionEle.innerText = "Division : ";

    let divisionAns = document.createElement("span");
    divisionAns.innerText = obj.Division;
    divisionEle.appendChild(divisionAns);

    div.appendChild(divisionEle);

    //append

    allPostOfficeCont.appendChild(div);

}

inputEle.addEventListener("keyup", function(event){
    let searchStr = event.target.value.trim();

    searchStr = searchStr.toLowerCase();

    let filteredArr = postOfficeArr.filter((each) => {
        if(each.Name.toLowerCase().startsWith(`${searchStr}`) === true || each.BranchType.toLowerCase().startsWith(`${searchStr}`) === true){
            return each;
        }
    })

    console.log("filterd Arr = ", filteredArr)

    // clearing the previous 

    allPostOfficeCont.innerText = "";

    // calling to make each card

    if(filteredArr.length === 0){
        allPostOfficeCont.innerHTML = `
        <div class = "error-cont" id = "error-msg">
            <p> Sorry, No Post Offices were located... </p>
            <img src = "https://i.pinimg.com/originals/ec/c0/15/ecc015d4e89f77b435df3cd81928ad48.gif" width = "50px" height = "50px">
        </div>
        `
    }else{
        allPostOfficeCont.innerHTML = '';
        for(let i = 0; i < filteredArr.length; i++){
            makeCard(filteredArr[i])
        }
    }

})

async function getIpAdress(){
   let received = await fetch('https://api.ipify.org?format=json')

    .then((res) => res.json())
    .then((data) => {
        ipAddressElement.innerText = data.ip
        ipAddress = data.ip;
    })
    .catch((error) => {
        alert(`Sorry, could not fetch ip address, due to error`);
        console.log(error);
    })

    //getting ip address info 

    let Info = await fetch(`https://ipinfo.io/${ipAddress}?token=9692db051c452b`)

    .then((res) => res.json())
    .then((data) => {
        console.log(data)

        cityEle.innerText = data.city;
        regionEle.innerText = data.region;
        organisationEle.innerText =  data.org;
        hostNameEle.innerText  =  data.hostname;

        let locationArr = data.loc.split(",");
        let lati = parseFloat(locationArr[0]);
        let longi = parseFloat(locationArr[1]);

        latitudeEle.innerText =  lati;
        longitudeEle.innerText = longi;

        //embedding map of location 

        mapContEle.innerHTML = `
               <h3> Your Current Location </h3>
            <iframe src="https://maps.google.com/maps?q=${lati}, ${longi}&z=15&output=embed" width="80%" height="470" frameborder="0" style="border:0" allowfullscreen = "true"></iframe>
            
        `


        // fetching current more details regarding post office 

        let date = new Date();

        let options = {
        timeZone: `${data.timezone}`,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        };

        timeZoneEle.innerText = `${data.timezone}`;
        datetimeEle.innerText = date.toLocaleString('en-US', options);
        pincodeEle.innerText =  `${data.postal}`;

        // fetching postal details 

        let postalreceived = fetch(`https://api.postalpincode.in/pincode/${data.postal}`)

        .then((res) => res.json())
        .then((data) => {
            
            for(let i = 0; i < data.length; i++){
                
                messageEle.innerText = data[i].Message;
                postOfficeArr = data[i].PostOffice;

                if(postOfficeArr.length === 0){
                    allPostOfficeCont.innerHTML = `
                    <div class = "error-cont" id = "error-msg">
                        <p> Sorry, No Post Offices were located... </p>
                        <img src = "https://i.pinimg.com/originals/ec/c0/15/ecc015d4e89f77b435df3cd81928ad48.gif" width = "50px" height = "50px">
                    </div>
                    `
                }else{
                    allPostOfficeCont.innerHTML = '';

                    for(let j = 0; j < postOfficeArr.length; j++){
                        makeCard(postOfficeArr[j])
                    }
                }

                

            }
        })
        
        .catch((err) => {
            alert(`Sorry, could not fetch information, due to error`);
            console.log(err)
        })

     })
     
    .catch((error) => {
        alert(`Sorry, could not fetch information, due to error`);
        console.log(error)
    })

    

}


getIpAdress()