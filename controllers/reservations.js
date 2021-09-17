const TimeSlotDB = require('../models/TimeSlots')
const ReservedSlotDB = require('../models/Reservations')
const ewsOptions = require('../ewsConnections')
const { nanoid } = require('nanoid')

module.exports = { 
    setDates: async (req,res)=>{
        try{
            const slots = await TimeSlotDB.find()
            const itemsLeft = await TimeSlotDB.countDocuments({selectedSlot: ''})
            const reservationsMade = await ReservedSlotDB.find({owner: req.user.email})
            //TODO: the items needs to be sorted by date
            res.render('setDates.ejs', {timeSlots: slots, left: itemsLeft, reservations: reservationsMade})
        }catch(err){
            console.log(err)
        }
    },

    selectTimeSlots: async (req,res)=>{
        try{
            let availableSlots
            let unavailableSlots = []

            currentLink = {}
            if(req.params.id){
                currentLink = {linkId: req.params.id}
            }

            const reservation = await ReservedSlotDB.find(currentLink)
            const timeSlots = await TimeSlotDB.find(currentLink)
            const reservedSlots = await TimeSlotDB.find().select('selectedSlot')

            const isFilled = timeSlots[0].selectedSlot ? true : false

            if(isFilled){
                availableSlots = timeSlots[0].selectedSlot
            }else{
                availableSlots = timeSlots[0].slotChoices  
            }

            for(slots of reservedSlots){
                if(slots.selectedSlot){
                    unavailableSlots.push(`${slots.selectedSlot}`)
                }
            }
            
            //TODO: the items needs to be sorted by date
            res.render('selectTimeSlot.ejs', {todos: reservation, isFilled: isFilled, timeSlots: availableSlots, reserved: unavailableSlots})
        }catch(err){
            console.log(err)
        }
    },

    createTimeSlot: async (req, res)=>{
        try{
            const linkId = nanoid()

            await ReservedSlotDB.create({
                owner: req.user.email, 
                name: req.body.nameItem, 
                email: req.body.emailItem, 
                location: req.body.locationItem, 
                subject: req.body.subjectItem, 
                duration: req.body.durationItem,
                linkId: linkId,
            })
            await TimeSlotDB.create({
                slotChoices: req.body.dateTimeItem,
                linkId: linkId,
            })
            console.log('Todo has been added!')
            res.redirect('/setDates')
        }catch(err){
            console.log(err)
        }
    },

    assignTimeSlot: async (req, res)=>{
        try{
            // await TimeSlotDB.findOneAndUpdate({linkId: req.body.idFromJSFile},{
            //     selectedSlot: new Date(req.body.dateTimeFromJSFile),
            // })

            const reservationData = await ReservedSlotDB.findOne({linkId: req.body.idFromJSFile})
            let durationTime = reservationData.duration.split(' ')
            const endDate = new Date(req.body.dateTimeFromJSFile).getTime() + (Number(durationTime[0]) * 60000) //TODO use the duration but first set a standard for definition

            const options = {
                'Subject': reservationData.subject,
                'Body': `${reservationData.name} ${reservationData.email}`,
                'Start': new Date(req.body.dateTimeFromJSFile).toISOString(),
                'End': new Date(endDate).toISOString(),
                'Location': reservationData.location,
                'Email': reservationData.email,
            }
            //save to calendar
            ewsOptions.addDates(req.user.calendarPassword, req.user.calendarEmail, options)
            ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, options)

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