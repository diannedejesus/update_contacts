const TimeSlotDB = require('../models/Reservations')
const ReservedSlotDB = require('../models/appointments')

module.exports = {
    setDates: async (req,res)=>{
        try{
            const todoItems = await TimeSlotDB.find().sort({dateTime: 'asc'})
            const itemsLeft = await TimeSlotDB.countDocuments({filled: false})
            //TODO: the items needs to be sorted by date
            res.render('setDates.ejs', {todos: todoItems, left: itemsLeft})
        }catch(err){
            console.log(err)
        }
    },

    selectTimeSlots: async (req,res)=>{
        try{
            let reservedSlots
            currentLink = {}
            if(req.params.id){
                currentLink = {linkId: req.params.id}
            }

            const todoItems = await TimeSlotDB.find(currentLink).sort({dateTime: 'asc'})
            const isFilled = todoItems[0].filled
            if(isFilled){
                reservedSlots = await ReservedSlotDB.find({name: todoItems[0].name}).select('dateTime')
                reservedSlots = reservedSlots[0].dateTime
            }else{
                const reservedSlotsData = await ReservedSlotDB.find().select('dateTime')
                reservedSlots = []

                for(slots of reservedSlotsData){
                    reservedSlots.push(slots.dateTime)
                }
            }
            //TODO: the items needs to be sorted by date
            res.render('selectTimeSlot.ejs', {todos: todoItems, isFilled: isFilled, reserved: reservedSlots})
        }catch(err){
            console.log(err)
        }
    },

    createTimeSlot: async (req, res)=>{
        try{
            await TimeSlotDB.create({
                dateTime: req.body.dateTimeItem,
                name: req.body.nameItem, 
                email: req.body.emailItem, 
                location: req.body.locationItem, 
                subject: req.body.subjectItem, 
                duration: req.body.durationItem,
                filled: false,
            })
            console.log('Todo has been added!')
            res.redirect('/setDates')
        }catch(err){
            console.log(err)
        }
    },

    assignTimeSlot: async (req, res)=>{
        console.log(req.body)
        try{
            await ReservedSlotDB.create({
                name: req.body.nameFromJSFile,
                dateTime: req.body.dateTimeFromJSFile,
            })
            //TODO: Make sure this is modified and the entry is added and not just one of the two
            await TimeSlotDB.findOneAndUpdate({_id:req.body.idFromJSFile},{
                filled: true
            })
            console.log('Time Slot Selected')
            res.json('Time Slot Selected')
        }catch(err){
            console.log(err)
        }
    },


    markComplete: async (req, res)=>{
        try{
            await TimeSlotDB.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                filled: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await TimeSlotDB.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                filled: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },

    deleteDates: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await TimeSlotDB.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    