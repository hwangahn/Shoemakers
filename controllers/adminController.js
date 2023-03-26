const { shoe } = require('../models/shoe');
const { inventory } = require('../models/inventory');

let createStock = async (req, res) => {

    try {

        //create entry in shoe
        let createShoe = await shoe.create({
            
            name: req.body.name,
            gender: req.body.gender,
            imageURL: req.body.imageURL,
            price: req.body.price

        });

        let sizes = req.body.size.replaceAll(' ', '').split(',');

        // create object for size
        sizes.forEach(element => {

            let createInventory = inventory.create({
                sid: createShoe.sid, 
                size: parseInt(element), 
                qtyInStock: parseInt(req.body.qty)
            });

            createInventory;

        });

        res.send("Done");

    } catch(err) {

        // catch errors
        console.log(err);
        res.send("Try again");
    }
}

module.exports = {
    createStock,
}