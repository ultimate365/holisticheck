const admin = require("../config/firebase");
const User = require("../models/user");

const sendNotification = async (req, res) => {
  const { token, title, description, imageUrl } = req.body;
  try {
    const response = await admin.messaging().send({
      token: token,
      data: {
        title: title,
        body: description,
        imageUrl: imageUrl,
      },
    });
    res.status(200).send("Notification sent successfully");
  } catch (error) {
    res.status(500).send(`Error sending Notification: ${error.message}`);
  }
};

const broadcastNotification = async (req, res) => {
  const { title, description, imageUrl } = req.body;
  try {
    const users = await User.find().select("device_token-_id");
    const deviceTokens = users?.map((user) => user.device_token);
    const response = await admin.messaging().sendEachForMulticast({
      tokens: deviceTokens,
      data: {
        title: title,
        body: description,
        imageUrl: imageUrl,
      },
    });
    res.status(200).send("Notification Broadcast sent successfully");
  } catch (error) {
    res.status(500).send(`Error sending Notification: ${error.message}`);
  }
};

const registerToken = async (req, res) => {
  const { device_token } = req.body;

  try {
    let user = await User.findOne({ device_token });
    if (!user) {
      user = new User({ device_token });
      await user.save();
      return res.status(201).send("Device token registered successfully");
    } else {
      return res.status(200).send("Device token already registered");
    }
  } catch (error) {
    res.status(500).send(`Error updating device token: ${error.message}`);
  }
};

module.exports = {
  sendNotification,
  broadcastNotification,
  registerToken,
};