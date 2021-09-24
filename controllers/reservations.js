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
            let duration = req.body.durationItem
            
            if(req.body.timeframItem === 'hours'){
                duration = duration * 60
            }

            await ReservedSlotDB.create({
                owner: req.user.email, 
                name: req.body.nameItem, 
                email: req.body.emailItem, 
                location: req.body.locationItem, 
                subject: req.body.subjectItem, 
                duration: duration,
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
            let durationTime = reservationData.duration
            const endDate = new Date(req.body.dateTimeFromJSFile).getTime() + (Number(durationTime) * 60000) //TODO use the duration but first set a standard for definition

            const options = {
                'Name': reservationData.name,
                'Subject': reservationData.subject,
                'Body': `${reservationData.name} ${reservationData.email}`,
                'Start': new Date(req.body.dateTimeFromJSFile).toISOString(),
                'End': new Date(endDate).toISOString(),
                'Location': reservationData.location,
                'Email': reservationData.email,
            }

            const optionsEmailUser = {
                'Name': reservationData.name,
                'Subject': reservationData.subject,
                'Body': `Hello ${req.user.email},\n\n${options.Name} has selected the date ${new Date(req.body.dateTimeFromJSFile).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date(options.Start).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} - ${new Date(endDate).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} for their appointment. \n\nThe apppointment will be at ${reservationData.location} and you will be discussing: ${reservationData.subject}.\n\n`, //Body: name email
                'Start': new Date(req.body.dateTimeFromJSFile).toISOString(),
                'End': new Date(endDate).toISOString(),
                'Location': reservationData.location,
                'Email': req.user.calendarEmail,
            }

            const optionsEmailClient = {
                'Name': reservationData.name,
                'Body': `Hello ${options.Name},\n\nYou have selected the date ${new Date(req.body.dateTimeFromJSFile).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date(options.Start).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} - ${new Date(endDate).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} for your appointment. \n\nLike the selection page indicated the apppointment will be at ${reservationData.location}. \n\nWe will be discussing: ${reservationData.subject}.\n\n`, //Body: name email
                'Email': reservationData.email,
            }
            //save to calendar
            ewsOptions.addDates(req.user.calendarPassword, req.user.calendarEmail, options)
            ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailClient)
            ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailUser)

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