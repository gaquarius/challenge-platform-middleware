const express = require('express');
const router = express.Router();
const { Client } = require('dash');
require('dotenv').config();

router.post('/new', async (req, res) => {
  if (req.user.name && req.user.name === process.env.JWT_USERNAME) {
    const client = new Client({
      network: process.env.DASH_NETWORK,
      wallet: {
        mnemonic: null,
        offlineMode: true,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: 506776,
        },
      }
    });

    const account = await client.getWalletAccount();
    const address = account.getUnusedAddress().address;
    res.json({
      message: 'Successful',
      data: {
        address,
        mnemonic: client.wallet.exportWallet()
      }
    });
  } else {
    res.status(401).json({
      message: 'Unauthorized',
      error: 401
    });
  }
});

module.exports = router;
