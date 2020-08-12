window.addEventListener("DOMContentLoaded", function () {
    let min1 = document.getElementById("sec30")
    min1.addEventListener("click", function () {
        let time = min1.value
        urlSend(time)
    })

    let min3 = document.getElementById("min1")
    min3.addEventListener("click", function () {
        let time = min3.value
        urlSend(time)
    })
    let min5 = document.getElementById("min2")
    min5.addEventListener("click", function () {
        let time = min5.value
        urlSend(time)
    })

})

function urlSend(time) {
    let params = new URLSearchParams()
    params.append('time', time)
    let url = "typeit.html"
    window.location.assign(url + "?" + params.toString())
}