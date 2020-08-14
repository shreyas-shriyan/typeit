
const RANDOM_TEXT_URL = 'http://quotes.stormconsultancy.co.uk/random.json' // Api for Fetching Data

let query = new URLSearchParams(window.location.search)
let time = query.get('time')

const paragraph_display_element = document.getElementById('paragraph')
const user_text_element = document.getElementById('user_text')
const timer_element = document.getElementById('timer')
const wpm_text = document.getElementById("wpm")
const accuracy_text = document.getElementById("accuracy")

let user_typed_char = []
user_text_element.addEventListener("input", ()=> {
    const array_of_para = paragraph_display_element.querySelectorAll("span")
    const array_of_usertext = user_text_element.value.split("")
    //console.log(array_of_usertext)
    user_typed_char = array_of_usertext

    let correct = true
    array_of_para.forEach((character_span, index) => {
        const character = array_of_usertext[index]
        
        //color coding mistakes and correct letters
        if( character == null ) {
            character_span.classList.remove("correct")
            character_span.classList.remove("incorrect")
            correct = false
        }
        else if(character == character_span.innerText) {
            correct_sound.play()
            character_span.classList.add("correct")
            character_span.classList.remove("incorrect")
        }
        else {
            wrong_sound.play()
            character_span.classList.remove("correct")
            character_span.classList.add("incorrect")
            correct = false
        }
        
    })
    if(correct) {
        render_new_text()    // After finishing 
    }
})

// Fetching random data Fn
function get_random_text() {
    return fetch(RANDOM_TEXT_URL)
    .then((res)=>res.json())
    .then(data => data.quote)
    /* .then(function(data){
        console.log(typeof(data.quote))
    }) */
}

function time_converter (){
    let temp = time/30
    return temp
}

let api_text = []
async function render_new_text() {
    let text = "" 
    let minutes = time_converter()
    let accumulator = minutes
    
    for(let i=0;i<accumulator;i++){
        text = text + await get_random_text() + " "
    }
    console.log(text)
    api_text = text.split("")

    paragraph_display_element.innerHTML = ""
    text.split("").forEach(character => {
        const character_span = document.createElement("span")
        character_span.innerText = character
        paragraph_display_element.appendChild(character_span)  
    })
    user_text_element.value = null
    start_timer()
}

function wpm_timer(){
    let temp = setInterval(()=>{
        if(count==1){
            clearInterval(temp)
        }
        update_wpm()
        update_accuracy()
    },1000)
}

let wpm_counter = 0                                               //
let wpm = []                                                      //
let times = []                                                    // 
let wpm_data = {wpm: wpm, time: times}                            //

function update_wpm(){
    let current_time = timer_element.innerHTML
    current_time = current_time.split(" ")[2]
    let elapsed_time = time-current_time
    let text = user_text_element.value
    let words = text.length/9
    let temp = Math.floor((120*words)/elapsed_time)

    if(elapsed_time!==30 && elapsed_time%5==0){                    //
        wpm.push(temp)                                             //
        times.push(elapsed_time)                                   //
        localStorage.setItem("wpm_data", JSON.stringify(wpm_data)) //
    }     


    if(wpm_counter==0 || temp==NaN){
        console.log("hello")
        wpm_text.innerHTML = "WPM : 0"
    }
    else{
        wpm_text.innerHTML = "WPM : "+temp
    }
    wpm_counter++    
}

let start_time;
let count = time
function start_timer() {
    timer_element.innerText = null
    let temp = setInterval(() => {
        if(count==1){
            clearInterval(temp)
            after_time_out()
        }
        timer.innerText = `Timer : ${get_timer_time(count)}`
    }, 1000)
}

function after_time_out(){
    let final_accuracy = accuracy_text.innerHTML
    final_accuracy = final_accuracy.split(" ")[2].split("%")[0]
    let final_wpm = wpm_text.innerHTML
    let query = new URLSearchParams(window.location.search)
    query.set('accuracy',final_accuracy)
    query.set('wpm',final_wpm)
    let pathname = `result.html`;
    window.location.href = `${pathname}?${query.toString()}`;
}

function get_timer_time(time) {
    count = count-1
    return time-1
}

render_new_text()
wpm_timer()

let acc_counter = 0

function update_accuracy(){
    let error = 0
    let accuracy = 0
    let temp1=[]
    
    if(user_typed_char.length==0 || acc_counter==0){
        accuracy_text.innerHTML = "Accuracy : 0%"
    }
    else{
        for(let i=0; i<user_typed_char.length; i++){
            if(user_typed_char[i]!==api_text[i]) {
            temp1.push(user_typed_char[i])
            }
            error = Math.round((temp1.length/user_typed_char.length)*100)
            accuracy = 100 - error

            accuracy_text.innerHTML = "Accuracy : "+accuracy+"%";

        }
    }
    acc_counter++
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

var correct_sound;
var wrong_sound;

function correct_key() {
    correct_sound = new sound("click.mp3");
}

function wrong_key(){
    wrong_sound = new sound("error.mp3");
}

correct_key()
wrong_key()

let restart = document.getElementById("restart")
restart.addEventListener("click",function(){
    window.location.href = `typeit.html?time=${time}`
})