
const RANDOM_TEXT_URL = 'http://api.quotable.io/random'
// const RANDOM_TEXT_URL = `http://www.randomtext.me/api/lorem/p-1/6-10`

let query = new URLSearchParams(window.location.search)
let time = query.get('time')

const paragraph_display_element = document.getElementById('paragraph')
const user_text_element = document.getElementById('user_text')
const timer_element = document.getElementById('timer')
const wpm_text = document.getElementById("wpm")

user_text_element.addEventListener("input", ()=> {
    const array_of_para = paragraph_display_element.querySelectorAll("span")
    const array_of_usertext = user_text_element.value.split("")
    //console.log(array_of_usertext)
    let correct = true
    array_of_para.forEach((character_span, index) => {
        const character = array_of_usertext[index]

        if( character == null ) {
            character_span.classList.remove("correct")
            character_span.classList.remove("incorrect")
            correct = false
        }
        else if(character == character_span.innerText) {
            character_span.classList.add("correct")
            character_span.classList.remove("incorrect")
        }
        else {
            character_span.classList.remove("correct")
            character_span.classList.add("incorrect")
            correct = false
        }
    })
    if(correct) {
        render_new_text()
    }
})

function get_random_text() {
    return fetch(RANDOM_TEXT_URL)
    .then((res)=>res.json())
    .then(data => data.content)
}

function time_converter (){
    let temp = time/30
    return temp
}

async function render_new_text() {
    let text = "" 
    let minutes = time_converter()
    let accumulator = minutes * 2
    
    for(let i=0;i<accumulator;i++){
        text = text + await get_random_text() + " "
    }
    console.log(text)
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
    },1000)
}

function update_wpm(){
    let current_time = timer_element.innerHTML
    current_time = current_time.split(" ")[2]
    let elapsed_time = time-current_time
    let text = user_text_element.value
    let words = text.length/5
    let temp = Math.floor((120*words)/elapsed_time)
    console.log(temp)
    if(temp==NaN){
        console.log("hello")
        wpm_text.innerHTML = `WPM : 0`
    }
    else{
        wpm_text.innerHTML = `WPM : ${temp}`
    }
    
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
  alert("timeout!!!")
}

function get_timer_time(time) {
    count = count-1
    return time-1
}

render_new_text()
wpm_timer()

