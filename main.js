var root = "images/deck"
var extension = ".jpg"
var transparent_extension = ".png"
var deck = []
var inverted = []
var total_cards = associations.length
var default_values = ["<h1>Problema</h1>", "<h1>Perspectiva</h1>", "<h1>Solução</h1>", "<em>Representa o problema o qual o querente enfrenta no momento da tiragem</em>", "<em>Representa qual a abordagem do querente para lidar com o problema</em>", "<em>Uma sugestão de como lidar com o problema apresentado na tiragem</em>"]
var intro_message = "<p>The Past-Present-Future spread is one of the most straightforward spreads. As the name suggests, it can offer great insight to help understand how the past influences present circumstance, what’s going on in the present moment…and how the choices you make in the present may unfold in the future.</p>"
var screen_to_card_ratio = 5
var min_card_width = 160
var chance_of_inverted = 0.4

var three_spread_count = 1

function threeSpread(element) {
    if (deck.length) {
        if (three_spread_count <= 3) {
            if (three_spread_count == 3)
                document.getElementById("draw-card").innerHTML = "New Spread"
            drawForElement(three_spread_count++)
            updateDeckCount()
        } else {
            three_spread_count = 1
            document.getElementById("draw-card").innerHTML = "Draw a Card"
            resetThreeCardSpread()
        }
    } else {
        updateDeckCount("Out of cards!<br/>Reshuffle?")
    }

}

function updateIntroMessage() {
    document.getElementById("intro").innerHTML = intro_message
}

function updateDeckCount(optional) {
    deck_count = document.getElementById("deck-count")
    if (optional != null) {
        deck_count.innerHTML = optional
        return
    }
    major_count = document.getElementById("count-major")
    minor_count = document.getElementById("count-minor")
    maj_count = 0;
    min_count = 0;
    deck.forEach(element => {
        if (element < 22) maj_count++;
        else min_count++;
    })
    major_count.innerHTML = maj_count
    minor_count.innerHTML = min_count
    deck_count.innerHTML = deck.length
}

function resetThreeCardSpread() {
    // resetar as imagens de volta pro estado inicial
    card1 = document.getElementById("card-1");
    card2 = document.getElementById("card-2");
    card3 = document.getElementById("card-3");
    card1.src = root + "/" + "back" + transparent_extension;
    card2.src = root + "/" + "back" + transparent_extension;
    card3.src = root + "/" + "back" + transparent_extension;

    // resetar detalhes
    details_collection = document.getElementsByClassName("card-details")

    for (let index = 0; index < details_collection.length; index++) {
        for (let j = 0; j < details_collection[index].childElementCount; j++) {
            details_collection[index].children[j].innerHTML = ""
            updateNameOfElement("card-" + (index + 1), null, default_values[index])
            updateDescriptionOfElement("card-" + (index + 1), null, default_values[index + 3])
        }
    }
}

function drawForElement(id) {
    card_id = "card-" + id
    cardelement = document.getElementById(card_id)
    card = deck.splice(0, 1)
    console.log("Drew a card(" + card + (inverted[card] ? "inv" : "") + "): ", deck)
    cardelement.src = root + "/" + associations[card].image_name + extension

    if (inverted[card]) {
        cardelement.classList.add("card-rotated")
        updateInvertedKeywordsOfElement(card_id, card)
    } else {
        cardelement.classList.remove("card-rotated")
        updateKeywordsOfElement(card_id, card)
    }

    updateCommonDetails(card_id, card)
}

function updateCommonDetails(card_id, card) {
    updateDescriptionOfElement(card_id, card)
    updateNameOfElement(card_id, card)
    updateShortDesc(card_id, card)
}

function updateShortDesc(id, card) {
    shortd = document.getElementById(id + "-short-desc")
    shortd.innerHTML = "<q>" + associations[card].short_description + "</q>"
}

function updateKeywordsOfElement(id, card) {
    keywords = document.getElementById(id + "-keywords")
    keywords.innerHTML = "<h3>Keywords</h3>" + associations[card].keywords
}

function updateInvertedKeywordsOfElement(id, card) {
    keywordsi = document.getElementById(id + "-keywords-inverted")
    keywordsi.innerHTML = "<h3>Inverted Keywords</h3>" + associations[card].reversed_keywords
}

function updateDescriptionOfElement(id, card, optional_desc) {
    description = document.getElementById(id + "-description")
    if (optional_desc != null) {
        description.innerHTML = optional_desc
        return
    }
    description.innerHTML = "<h3>Description</h3>" + associations[card].long_description
}

function updateNameOfElement(id, card, optional_name) {
    card_name = document.getElementById(id + "-name")
    if (optional_name != null) {
        card_name.innerHTML = "<h1>" + optional_name + "</h1>"
        return
    }
    card_name.innerHTML = "<h1>" + associations[card].name + (inverted[card] ? "(Inv)" : "") + "</h1>"
}

function randomcard() {
    let random_card = Math.floor(Math.random() * total_cards);
    return random_card
}

function create_deck() {
    random_order()
    resetThreeCardSpread()
    total_cards_element = document.getElementById("cards-total")
    total_cards_element.innerHTML = total_cards
    deck_cards_element = document.getElementById("deck-count")
    deck_cards_element.innerHTML = deck.length
    console.log("The deck is: ", deck, inverted)
}

function shuffle_deck() {
    cut()
    console.log("After shuffle the deck is: ", deck, inverted)
}

function cut() {
    cut_point = Math.floor(Math.random() * deck.length)
    console.log("Cut point: ", cut_point)
    first_half = deck.slice(0, cut_point)
    second_half = deck.slice(cut_point, deck.length)
    deck = second_half.concat(first_half)
}

function random_order() {
    let cards = []
    for (let index = 0; index < total_cards; index++) {
        // gerado conjunto de cartas
        cards[index] = index
        // normal ou invertido
        inverted[index] = Math.random() < chance_of_inverted ? 1 : 0;
    }
    // usado pra acompanhar o baralho principal
    index = 0
    while (cards.length > 0) {
        // seleciona uma carta do conjunto gerado
        random_point = Math.floor(Math.random() * cards.length)
        deck[index] = cards[random_point]
        // remove uma carta aleatória do conjunto gerado
        cards.splice(random_point, 1)
        index++
    }
}

function invertCard(position) {
    if (inverted[position])
        inverted[position] = 0
    else
        inverted[position] = 1
}

function set_card_height() {
    cardCollection = document.getElementsByClassName("card")
    cardArray = Array.prototype.slice.call(cardCollection)
    cardArray.forEach(element => { element.setAttribute("width", Math.min(window.innerWidth / screen_to_card_ratio, min_card_width)) })
}


function init() {

    // monta as dimensões da carta baseado na resolução
    set_card_height()

    // outros
    create_deck()
    shuffle_deck()
    updateIntroMessage()
    updateDeckCount()

    // removendo propriedades pra mobile por ora
    if(window.innerWidth < 600){
        col = document.getElementsByClassName("card-info")
        arr = Array.prototype.slice.call(col)
        arr.forEach(e=>e.remove())
    }
}