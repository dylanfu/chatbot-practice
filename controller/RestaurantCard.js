var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls 'getYelpData' in RestClient.js with 'displayRestaurantCards' as callback to get list of restaurant information
exports.displayRestaurantCards = function getRestaurantData(foodName, location, session){
    var url ='https://api.yelp.com/v3/businesses/search?term='+foodName+'&location='+location + '&limit=5';
    // yelp auth token
    var auth ='UFiaHFLHTYpyzibjfoGJypyVObpqgpgPp7grDMrL4Uec4WBYrmF2_8H7SEU5S1sI0M06GTgl7ciJK5UD2uKa_T0arX_rD_8MGIycpzTKKqxRsvCkf2iACaUAwxIWWnYx';
    rest.getYelpData(url,auth,session,displayRestaurantCards);
}

function displayRestaurantCards(message, session) {
    var attachment = [];
    var restaurants = JSON.parse(message);
    
    //For each restaurant, add herocard with name, address, image and url in attachment
    for (var index in restaurants.businesses) {
        var restaurant = restaurants.businesses[index];
        var name = restaurant.name;
        var imageURL = restaurant.image_url;
        var url = restaurant.url;
        var address = restaurant.location.address1 + ", " + restaurant.location.city;

        var card = new builder.HeroCard(session)
            .title(name)
            .text(address)
            .images([
                builder.CardImage.create(session, imageURL)])
            .buttons([
                builder.CardAction.openUrl(session, url, 'More Information')
            ]);
        attachment.push(card);

    }

    //Displays restaurant hero card carousel in chat box 
    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
    session.send(message);
}