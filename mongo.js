const mongoose = require('mongoose')

if (process.argv.length != 3 && process.argv.length != 5) {
    console.log('usage: node mongo.js password [name] [number]')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://henryclee:${password}@cluster0.hz943.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(() => {
        console.log("mongoose connected")

        const personSchema = new mongoose.Schema({
        name: String,
        number: String
        })

        const Person = mongoose.model('Person', personSchema)

        if (process.argv.length==3) {
            console.log("phonebook:")
            Person.find({})
                .then(result => {
                    result.forEach(person => {
                        console.log(`${person.name} ${person.number}`)
                    })
                    mongoose.connection.close()
                })
                .catch(error => {
                    console.log("error: ", error)
                    MongooseError.connection.close()
                })
        } else {
            const name = process.argv[3]
            const number = process.argv[4]

            // Shorthand syntax when key name is same as variable name
            const person = new Person({
            name,
            number,
            })

            person.save().then(result => {
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
            })
        }
    })
