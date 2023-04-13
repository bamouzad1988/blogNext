import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, name, message } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !name ||
      !name.trim() ||
      !message ||
      !message.trim()
    ) {
      res.status(520).json({ message: "invalid input" });
      return;
    }

    const newMessage = { email, name, message };
    let client;
    try {
      client = await MongoClient.connect(
        "mongodb+srv://bamouzad1988:22mwLwryVah3Aurj@cluster1.e9a3rna.mongodb.net/mySite?retryWrites=true&w=majority"
      );
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "can not connect to db" });
      return;
    }
    const db = client.db();
    try {
      const result = await db.collection("messages").insertOne(newMessage);
      newMessage.id = result.insertedId;
    } catch (error) {
      client.close();
      res
        .status(500)
        .json({ message: error.message || "can not insert into db" });

      return;
    }
    client.close();

    res.status(200).json({ message: "done", newMessage });
  }
}
// 22mwLwryVah3Aurj
// mongodb+srv://bamouzad1988:<password>@cluster1.e9a3rna.mongodb.net/?retryWrites=true&w=majority
