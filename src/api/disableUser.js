const admin = require('firebase-admin');
const express = require('express');
const router = express.Router();

router.post('/disableUser', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log('Disabling user with email:', user.email);
    await admin.auth().updateUser(user.uid, { disabled: true });
    res.status(200).send({ message: 'User disabled successfully' });
  } catch (error) {
    console.error('Error disabling user:', error);
    res.status(500).send({ message: 'Failed to disable user', error: error.message });
  }
});

module.exports = router; 