const btnValider = document.getElementById("valider")
const divParametres = document.querySelector(".parametres")
const divPoints = document.querySelector(".points")
const modalAnnonce = document.getElementById("modal-annonce")
const modalBelote = document.getElementById("modal-belote")
const modalCompter = document.getElementById("modal-compter")
const modalScore = document.getElementById("modal-score")
const btnBelote = document.getElementById("belote")
const btnAnnonce = document.getElementById("annonce")
const btnCompter = document.getElementById("compter")
const pAnnonce = document.getElementById("pAnnonce")
const pDonneur = document.getElementById("pDonneur")
const pBelote = document.getElementById("pBelote")
const listeNoms = ["nord", "ouest", "sud", "est"].map(pos => document.getElementById(pos).value)
const btnNS = document.getElementById("btnNS")
const btnEO = document.getElementById("btnEO")
const labelNS = document.getElementById("labelNS")
const labelEO = document.getElementById("labelEO")
const btnBeloteNS = document.getElementById("beloteNS")
const btnBeloteEO = document.getElementById("beloteEO")
const btnNonContree = document.getElementById("noncontree")
const textNS = document.getElementById("compterNS")
const textEO = document.getElementById("compterEO")
const textePointsNS = document.getElementById("scoreNS")
const textePointsEO = document.getElementById("scoreEO")
const tableScore = document.querySelector("table.points")

let donneur = Math.floor(Math.random()*4)
let scoreNS = 0
let scoreEO = 0
const ann = {qui: null, combien: null, couleur: null, contree: "noncontree"}

function arrondi(points, defense) {
    if (points % 10 == 5) {
        if (defense) {
            return 10*Math.ceil(points/10)
        }
    }
    if (points % 10 > 5) {
        return 10*Math.ceil(points/10)
    }
    return 10*Math.floor(points/10)
}

function valider() {
    const listePos = ["nord", "ouest", "sud", "est"]
    listePos.forEach(pos => {
        const nom = document.getElementById(pos).value
        const th = document.querySelector(`th.${pos}`)
        th.textContent = nom
    })
    divParametres.style.display = "none"
    divPoints.style.display = ""
    pDonneur.textContent = `${listeNoms[donneur]} distribue.`
    btnBelote.style.display = "none"
    btnCompter.style.display = "none"
}

function showModal(modal) {
    modal.style.display = ""
}

function select(btn, groupe) {
    groupe.forEach(item => item.style.backgroundColor = "#333333")
    btn.style.backgroundColor = "#ea0e0e"
}

function nouvelleDonne() {
    donneur = (donneur + 1) % 4
    pDonneur.textContent = `${listeNoms[donneur]} distribue.`
    ann.qui = null
    ann.combien = null
    ann.couleur = null
    ann.contree = "noncontree"
    ann.belote = null
    pBelote.textContent = ""
    textNS.value = ""
    textEO.value = ""
    pAnnonce.textContent = ""
    btnBelote.style.display = "none"
    btnCompter.style.display = "none"
    select(btnNonContree, Array.from(document.querySelectorAll("div.modal button")))
}

function handleEventAnnonce(event) {
    if (event.target.id == "btnNS") {
        select(btnNS, [btnEO])
        ann.qui = "NS"
    } else if (event.target.id == "btnEO") {
        select(btnEO, [btnNS])
        ann.qui = "EO"
    } else if (event.target.className == "combien") {
        select(event.target, Array.from(document.querySelectorAll(".combien")))
        ann.combien = parseInt(event.target.id)
    } else if (event.target.className == "couleur") {
        select(event.target, Array.from(document.querySelectorAll(".couleur")))
        ann.couleur = event.target.textContent
    } else if (event.target.id == "noncontree" || event.target.id == "contree" || event.target.id == "surcontree") {
        select(event.target, [document.getElementById("noncontree"), document.getElementById("contree"), document.getElementById("surcontree")])
        ann.contree = event.target.id
    } else if (event.target.id == "validerAnnonce" && ann.qui && ann.combien && ann.couleur) {
        modalAnnonce.style.display = "none"
        pAnnonce.textContent = `${ann.qui == "NS" ? listeNoms[0] : listeNoms[1]} et ${ann.qui == "NS" ? listeNoms[2] : listeNoms[3]} ont annoncé ${ann.combien}${ann.couleur}.`
        if (ann.contree == "contree") {
            pAnnonce.textContent += " Cette annonce est contrée."
        }
        if (ann.contree == "surcontree") {
            pAnnonce.textContent += " Cette annonce est contrée puis surcontrée."
        }
        btnBelote.style.display = "inline-block"
        btnCompter.style.display = "inline-block"
    } else if (event.target.id == "passer") {
       modalAnnonce.style.display = "none"
       nouvelleDonne()
    }
}

function handleEventBelote(event) {
    if (event.target.id == "beloteNS") {
        ann.belote = "NS"
        pBelote.textContent = `${listeNoms[0]} et ${listeNoms[2]} ont annoncé une belote.`
        modalBelote.style.display = "none"
    } else if (event.target.id == "beloteEO") {
        ann.belote = "EO"
        pBelote.textContent = `${listeNoms[1]} et ${listeNoms[3]} ont annoncé une belote.`
        modalBelote.style.display = "none"
    } else if (event.target.id == "beloteAnnuler") {
        ann.belote = null
        pBelote.textContent = ""
        modalBelote.style.display = "none"
    }
}

function handleEventCompter(event) {
    if (event.target.id == "compterValider") {
        modalCompter.style.display = "none"
        let pointsPreneurs
        let pointsDefense
        if (ann.qui == "NS") {
            pointsPreneurs = parseInt(textNS.value)
            pointsDefense = parseInt(textEO.value)
        } else {
            pointsPreneurs = parseInt(textEO.value)
            pointsDefense = parseInt(textNS.value)
        }
        if (pointsPreneurs < ann.combien || pointsPreneurs < pointsDefense) {
            if (ann.qui == "NS") {
                pointsNS = 0
                pointsEO = 160
            } else {
                pointsNS = 160
                pointsEO = 0
            }
        } else {
            if (ann.qui == "NS") {
                pointsNS = ann.combien
                pointsEO = arrondi(pointsDefense)
            } else {
                pointsNS = arrondi(pointsDefense)
                pointsEO = ann.combien
            }
        }
        textePointsNS.textContent = `${listeNoms[0]} et ${listeNoms[2]} ont marqué ${pointsNS} point${pointsNS>1?'s':''}.`
        textePointsEO.textContent = `${listeNoms[1]} et ${listeNoms[3]} ont marqué ${pointsEO} point${pointsEO>1?'s':''}.`
        scoreNS += pointsNS
        scoreEO += pointsEO
        const tr = document.createElement("tr")
        tr.innerHTML = `<td class="points">${scoreNS}</td><td class="points">${scoreEO}</td>`
        tableScore.appendChild(tr)
        showModal(modalScore)
    } else if (event.target.id == "compterAnnuler") {
        modalCompter.style.display = "none"
    }
}

function handleEventScore(event) {
    if (event.target.id == "nouvelleDonne") {
        modalScore.style.display = "none"
        nouvelleDonne()
    }
}

function handleChange(event) {
    if (event.target == textNS) {
        textEO.value = 162 - textNS.value
    } else {
        textNS.value = 162 - textEO.value
    }
}

textNS.value = ""
textEO.value = ""
divPoints.style.display = "none"
modalAnnonce.style.display = "none"
modalBelote.style.display = "none"
modalCompter.style.display = "none"
modalScore.style.display = "none"
btnNS.textContent = `${listeNoms[0]} et ${listeNoms[2]}`
btnEO.textContent = `${listeNoms[1]} et ${listeNoms[3]}`
btnBeloteNS.textContent = `${listeNoms[0]} et ${listeNoms[2]}`
btnBeloteEO.textContent = `${listeNoms[1]} et ${listeNoms[3]}`
labelNS.textContent = `${listeNoms[0]} et ${listeNoms[2]}`
labelEO.textContent = `${listeNoms[1]} et ${listeNoms[3]}`
btnNonContree.style.backgroundColor = "#ea0e0e"
btnValider.addEventListener("click", valider)
btnAnnonce.addEventListener("click", event => showModal(modalAnnonce))
btnBelote.addEventListener("click", event => showModal(modalBelote))
btnCompter.addEventListener("click", event => showModal(modalCompter))
modalAnnonce.addEventListener("click", handleEventAnnonce)
modalBelote.addEventListener("click", handleEventBelote)
modalCompter.addEventListener("click", handleEventCompter)
modalScore.addEventListener("click", handleEventScore)
textNS.addEventListener("keyup", handleChange)
textEO.addEventListener("keyup", handleChange)
