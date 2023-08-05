let ipAddress = document.getElementById("ipAddress");
let getStartedBtn = document.getElementById("getStartedBtn");




getStartedBtn.addEventListener("click", function(){
    window.location.href = "./info";
})

async function getIpAdress(){
    let received = await fetch('https://api.ipify.org?format=json')

    .then((res) => res.json())
    .then((data) => ipAddress.innerText = data.ip)
    .catch((error) => {
        ipAddress.innerText = "...-....-...";
        console.log(error);
    })
}


getIpAdress()