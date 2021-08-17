const e = require("express");

// READ
const slots = async (req, res) => {

    try {
        const Slots = await req.app.get('models').Slot;
        const SlotsList = await Slots.find()
            .populate('customers')
            .populate('coach');

        if (!SlotsList) {
            return res.json({
                status: false,
                message: 'No Slots found'
            });
        }

        return res.json(slots);
    } catch (error) {
        return res.json(error.message);
    }
}

// CREATE
const slotCreate = async (req, res) => {
    if (req.role !== 'manager') {
        return res.json('unautohrized');
    }

    try {
        const models = req.app.get('models');

        // Create the slots
        const NewSlot = await new models.Slot({
            date: req.body.date,
            startHour: req.body.startHour,
            endHour: req.body.endHour,
            label: req.body.label,
            peopleLimit: req.body.peopleLimit,
            coach: req.body.coach,
            customers: [],
        }).save();

        // Add the coach
        const coach = await models.Coach.findById(req.body.coach);
        theCoach.slots.push(NewSlot._id);
        theCoach.save();

        return res.json(NewSlot);
    } catch (error) {
        return res.json(error.message);
    }
}

// BOOK
const slotBook = async (req, res) => {
    if (req.role !== 'manager') {
        return res.json('unautohrized');
    }

    try {
        const models = req.app.get('models');
        const Slot = await models.Slot.findById(req.body.slot);

        if (Slot.customers.length >= Slot.peopleLimit) {
            return res.json({
                status: false,
                message: 'Slot is full'
            });
        }

        const Customer = await models.Customer.findById(req.body.customer)
            .populate('suscriptions');

        // Check the subscription goes with the date
        let isSubscribed = false;
        for (const subscription of Customer.suscriptions) {
            if (
                subscription.beginningDate <= Slot.date &&
                subscription.endingDate >= Slot.date
            ) {
                isSubscribed = true;
            }
        }

        if (!isSubscribed) {
            return res.json({
                status: false,
                message: 'Customer is not subscribed to the date'
            });
        } else {
            Slot.customers.push(Customer._id);
            await Slot.save();
            Customer.slots.push(Slot._id);
            await Customer.save();
            return res.json("Booked!");
        }
    } catch (error) {
        return res.json(error.message);
    }
}

// UPDATE
const slotUpdate = async (req, res) => {
    if (req.role !== 'coach') {
        return res.json('unautohrized');
    }

    try {
        if (!req.body._id) {
            return res.json('No id provided');
        }

        const Slot = await req.app.get('models').Slot;

        let toModifySlot = await Slot.findById(req.body._id);
        let toModifyKeys = Object.keys(req.body.toModify);

        for (const key of toModifyKeys) {
            toModifySlot[key] = req.body.toModify[key];
        }

        await toModifySlot.save();
        res.json(toModifySlot);
    } catch (error) {
        return res.json(error.message);
    }
}

// DELETE
const slotDelete = async (req, res) => {
    if (req.role !== 'coach') {
        return res.json('unautohrized');
    }

    try {
        if (!req.body._id) {
            return res.json('No id provided');
        }

        const Slot = await req.app.get('models').Slot;
        const toDeleteSlot = await Slot.findById(req.body._id);

        if (!toDeleteSlot) {
            return res.json({
                status: false,
                message: 'Slot is not empty'
            });
        }

        // Delete the slot to all customers
        for (const customer of toDeleteSlot.customers) {
            let customer = await models.Customer.findById(customer);
            let toDeleteIndex = customer.slots.indexOf(toDeleteSlot._id);
            customer.slots.splice(toDeleteIndex, 1);
            await customer.save();
        }

        // Delete the slot to the coach
        let coach = await models.Coach.findById(toDeleteSlot.coach);
        let toDeleteIndex = coach.slots.indexOf(toDeleteSlot._id);
        coach.slots.splice(toDeleteIndex, 1);
        await coach.save();

        await toDeleteSlot.remove();
        res.json({
            status: true,
            message: 'Slot deleted'
        });
    } catch (error) {
        return res.json(error.message);
    }
}

module.exports = { slots, slotCreate, slotBook, slotUpdate, slotDelete };