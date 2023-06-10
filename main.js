const aside = document.querySelector("aside"),
    btn = document.querySelector("header button"),
    canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d"),
    range = document.querySelector("#range"),
    time = document.querySelector("#time"),
    circle_container = document.querySelector("main div")

let is_portrait = window.innerWidth < window.innerHeight,
    about_open = false,
    active = false,
    funs = JSON.parse(window.localStorage.getItem("funs") || "[]"),
    colors = [
        "#e6194B",
        "#3cb44b",
        "#42d4f4",
        "#f032e6",
        "#ffe119",
        "#f58231",
        "#4363d8",
        "#9A6324",
        "#469990",
        "#000075",
        "#808000",
        "#911eb4",
        "#800000",
        "#bfef45",
    ]
window.addEventListener("resize", resize)

document.querySelectorAll("nav easing-function").forEach(element => {
    if (funs.includes(element.innerText)){
        element.style.outline = "solid var(--accent-color) 2px"
    }
})

//Update locations in case the app is resized
function resize() {
    is_portrait = window.innerWidth < window.innerHeight
    console.log(is_portrait)
    if (is_portrait) {
        aside.style.top = "101vh"
        aside.style.height = "40vh"
        aside.style.width = "100vw"
        btn.innerText = "i"
    } else {
        aside.style.top = "10vh"
        aside.style.left = "101vw"
        aside.style.height = "89.7vh"
        aside.style.width = "50vw"
        btn.innerText = "About"
    }
}
resize()
//Animate the about section
function about() {
    if (active) { return }
    active = true
    if (about_open) {
        if (is_portrait) {
            $(aside).animate({
                top: "101vh"
            }, 500, () => {
                about_open = false
                active = false
            })
        } else {
            $(aside).animate({
                left: "101vw"
            }, 500, () => {
                about_open = false
                active = false
            })
        }
    } else {
        if (is_portrait) {
            $(aside).animate({
                top: "60vh"
            }, 500, () => {
                about_open = true
                active = false
            })
        } else {
            $(aside).animate({
                left: "50vw"
            }, 500, () => {
                about_open = true
                active = false
            })
        }
    }
}
//Add a function to the function list
function addFun(ev) {
    if (funs.includes(ev.target.innerText)) {
        funs.splice(funs.indexOf(ev.target.innerText), 1)
        ev.target.style.outline = null
    } else {
        funs.push(ev.target.innerText)
        ev.target.style.outline = "solid var(--accent-color) 2px"
    }
    window.localStorage.setItem("funs", JSON.stringify(funs))
    drawCanvas()
}
//Reset canvas and draw all the lines, as well as add the circles with values in them
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    ctx.strokeStyle = "gray"
    ctx.lineWidth = 1
    ctx.moveTo(108, 302)
    ctx.lineTo(108, 2)
    ctx.moveTo(208, 302)
    ctx.lineTo(208, 2)
    ctx.moveTo(308, 302)
    ctx.lineTo(308, 2)
    ctx.moveTo(8, 2)
    ctx.lineTo(308, 2)
    ctx.moveTo(8, 102)
    ctx.lineTo(308, 102)
    ctx.moveTo(8, 202)
    ctx.lineTo(308, 202)
    ctx.stroke()
    ctx.beginPath()
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    ctx.moveTo(8, 302)
    ctx.lineTo(8, 2)
    ctx.lineTo(13, 7)
    ctx.moveTo(8, 2)
    ctx.lineTo(3, 7)
    ctx.moveTo(8, 302)
    ctx.lineTo(308, 302)
    ctx.lineTo(303, 307)
    ctx.moveTo(308, 302)
    ctx.lineTo(303, 297)
    ctx.stroke()
    clearCircles()
    for (let i = 0; i < funs.length; i++) {
        const fun = funs[i]

        ctx.beginPath()
        ctx.strokeStyle = color_for(fun)
        ctx.moveTo(8, 302)
        for (let i2 = 0; i2 <= 100; i2++) {
            const t = i2 / 100,
                sol = equation(t, fun)
            ctx.lineTo(8 + (300 * t), 302 - (300 * sol))
        }
        ctx.lineWidth = 1
        ctx.stroke()
        addCircle(fun)
    }
}
drawCanvas()
//Clear all existing circles
function clearCircles() {
    document.querySelectorAll("easing-circle").forEach(element => {
        element.remove()
    })
}
//Add a single circle corresponding to function name
function addCircle(name) {
    let div = document.createElement("easing-circle")
    div.style.border = `solid ${color_for(name)} 2px`
    div.style.top = `${292 - (300 * equation((range.value / 100), name))}px`
    div.style.left = `${-2 + (300 * (range.value / 100))}px`
    div.setAttribute("name", name)
    div.innerText = Math.round(equation((range.value / 100), name) * 100)
    circle_container.append(div)
}
//Calculate the updated position of all circles
function calculateCircles() {
    document.querySelectorAll("easing-circle").forEach(element => {
        let name = element.getAttribute("name")
        element.style.top = `${292 - (300 * equation((range.value / 100), name))}px`
        element.style.left = `${-2 + (300 * (range.value / 100))}px`
        element.innerText = Math.round(equation((range.value / 100), name) * 100)
    })
}
//Animate value of range going to 100
function playAnimation() {
    if(range.value == "100"){
        range.value = "0"
    }
    range.disabled = true
    $(range).animate({
        value: 100
    }, {easing: "linear", duration: (100 - range.value) * parseInt(time.value) * 10, complete: () => {
        range.disabled = null
        range.value = "100"
        setTimeout(calculateCircles, 10)
        calculateCircles
    }, step: calculateCircles})
}
range.oninput = calculateCircles
//Calculate value of a function with "name" and time "t"
function equation(t, name) {
    switch (name) {
        case "linear":
            return t
        case "easeInQuad":
            return t*t
        case "easeOutQuad":
            return t*(2-t)
        case "easeInOutQuad":
            return t<.5 ? 2*t*t : -1+(4-2*t)*t
        case "easeInCubic":
            return t*t*t
        case "easeOutCubic":
            return (--t)*t*t+1
        case "easeInOutCubic":
            return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1
        case "easeInQuart":
            return t*t*t*t
        case "easeOutQuart":
            return 1-(--t)*t*t*t
        case "easeInOutQuart":
            return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t
        case "easeInQuint":
            return t*t*t*t*t
        case "easeOutQuint":
            return 1+(--t)*t*t*t*t
        case "easeInOutQuint":
            return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
    }
}
//Get color for function name
function color_for(name) {
    switch (name) {
        case "linear":
            return colors[0]
        case "easeInQuad":
            return colors[1]
        case "easeOutQuad":
            return colors[2]
        case "easeInOutQuad":
            return colors[3]
        case "easeInCubic":
            return colors[4]
        case "easeOutCubic":
            return colors[5]
        case "easeInOutCubic":
            return colors[6]
        case "easeInQuart":
            return colors[7]
        case "easeOutQuart":
            return colors[8]
        case "easeInOutQuart":
            return colors[9]
        case "easeInQuint":
            return colors[10]
        case "easeOutQuint":
            return colors[11]
        case "easeInOutQuint":
            return colors[12]
    }
}