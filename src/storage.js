const MongoClient = require('mongodb').MongoClient;

class Storage {
  constructor() {
    this.data = {}
    this.characters = null
  }

  async init() {
    const uri = process.env.DB_CONNECTION_STRING.replace('DB_NAME', process.env.DB_NAME)
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect()
    this.characters = await client.db(process.env.DB_NAME).collection("characters");
  }
  
  async get(key) {
    let value = this.data[key] || null
    if (value == null) {
      value = await this.characters.findOne({name: key})
      this.data[key] = value
    }
    return value
  }

  async set(key, value) {
    this.data[key] = value
    await this.characters.insertOne(value)
  }
}

module.exports = Storage