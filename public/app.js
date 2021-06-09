document.getElementById('newdata').addEventListener('submit',newdata);
// let button=document.querySelector('button');
// button.addEventListener('click', () => {
//     if(!window.Notification)return;
//     Notification.requestPermission()
// })
let slot=false,cut=false;
function newdata(e){
    e.preventDefault();
    let pincode=document.getElementById('pincode').value;
    let date=document.getElementById('date').value;
    url=`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`;//API setu url for given input pincode and date
    getapi(url);//get data and send request until slot found
    
}

async function getapi(api_url){
    let response=await fetch(api_url);//fetch
    var data= await response.json();//data in json format
    const call=setInterval(() => {
        findslots(data);
        if(slot)
        {
            clearInterval(call);//stop 
        }
    },3000)//every 3 sec
}
function findslots(data){
let age=document.getElementById('age').value;//one of the input element
const sessions=data.sessions;//through json data
for(let i=0;i<sessions.length;i++)
{
    if(sessions[i].available_capacity>0 && sessions[i].min_age_limit<age)
    {
        slot=true;//need to set it true to stop the request in line 22
        // console.log("slot found");
        notify();//function set to notify when slot available
        break;//since a request runs for every 3sec it causes multiple notifications(multiple sessions) not infinite breaks on 1st case
    }
    
}
if(!slot&&!cut)
    {
        window.alert("currently slots are not available turn on notifictions to receive a notification when slot is available")//alert msg for user 
        cut=true;
        Notification.requestPermission();//ask for notification permission if it is not granted.
    }
}
function notify(){
    
    //  console.log(Notification.permission);
    if(Notification.permission !== 'granted') 
    {window.alert("currently slots are available. you havent turned on notifications to receive a desktop notification")//alert msg for user 
    Notification.requestPermission();}
    ; 
    let notification =new Notification('vaccine available',{
        body:"click here",
        icon:'icon.png'
    })
    notification.onclick= () => {
        window.open('https://www.cowin.gov.in/')
    }
}
