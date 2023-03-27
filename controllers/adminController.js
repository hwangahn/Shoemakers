const { shoe } = require('../models/shoe');
const { inventory } = require('../models/inventory');
const { Op } = require('sequelize');

let updateInventory = async (req, res) => {

    try {

        //create entry in shoe
        let createShoe = await shoe.findOrCreate({

            where: {
                [Op.and]: [
                    { name: {[Op.eq]: req.body.name }},
                    { gender: {[Op.eq]: req.body.gender }}
                ]
            },
            
            defaults: {
                name: req.body.name,
                gender: req.body.gender,
                imageURL: req.body.imageURL,
                price: req.body.price
            }

        });

        let sizes = req.body.size.replaceAll(' ', '').split(',');

        // create object for size
        sizes.forEach(async (element) => {

            let getInventory = await inventory.findOrCreate({
                where: {
                    [Op.and]: [
                        { sid: {[Op.eq]: createShoe[0].sid }}, 
                        { size: {[Op.eq]: parseInt(element) }}
                    ]
                },
                
                defaults: {
                    sid: createShoe[0].sid, 
                    size: parseInt(element), 
                    qtyInStock: 0
                }
            });

            let updateQty = await getInventory[0].increment({ qtyInStock: req.body.qty });
            
            updateQty;

        });

        res.send("Done");

    } catch(err) {

        // catch errors
        console.log(err);
        res.send("Try again");
    }
}

module.exports = {
    updateInventory,
}