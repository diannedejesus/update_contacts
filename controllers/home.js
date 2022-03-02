module.exports = {
    getIndex: (req,res)=>{
        let currentMessages = req.query.messages ? req.query.messages : ''
        res.render('index', {messages: currentMessages});
    }
}