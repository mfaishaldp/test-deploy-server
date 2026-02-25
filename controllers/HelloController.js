class HelloController {
    static getHello(req,res) {
        res.json({message : 'Hello World'})
    }
}

module.exports = HelloController