let currentCount = 1;
let pp = setInterval(() => {
    currentCount++;
    document.getElementById("counter").innerHTML = currentCount;
}, 100);




// let x = 0;
// function spinContainer() {
//     let scrollDiv = document.getElementsByClassName('scrollContainer')[0];
//     //console.log(scrollDiv);
//     let imgs = scrollDiv.getElementsByTagName("img");
//     //console.log(imgs);
//     let divRight = scrollDiv.getBoundingClientRect().right;
//     let divLeft = scrollDiv.getBoundingClientRect().left
    

//     setInterval(() => {
//         x+=10;

//         Array.from(imgs).forEach(element => {
//             console.log(element);
//             console.log("BORDER SIDE "+ scrollDiv.getBoundingClientRect().right)
//             let tempX = x;
//             if(element.x>divRight){
//                 tempX = x%divRight;
//             }
//             element.style.transform = `translate(${tempX}px)`
//         });

//     }, 100)
// }