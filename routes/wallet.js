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

router.post('/balance', async (req, res) => {
  if (req.user.name && req.user.name === process.env.JWT_USERNAME) {
    const { mnemonic } = req.body;
    if (!mnemonic) {
      res.status(400).json({
        message: 'Bad request',
        error: 400
      });
      return;
    }
    try {
      console.log(process.env.DASH_NETWORK);
      const client = new Client({
        network: process.env.DASH_NETWORK,
        wallet: {
          mnemonic
        }
      });
      console.log('client created');
      const account = await client.getWalletAccount();
      console.log(account);
      res.json({
        message: 'success',
        data: {
          balance: account.getConfirmedBalance()
        }
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: e.toString(),
        error: 500
      });
    }
  } else {
    res.status(401).json({
      message: 'Unauthorized',
      error: 401
    });
  }
});

router.post('/transfer', async (req, res) => {
  if (req.user.name && req.user.name === process.env.JWT_USERNAME) {
    const { from, to } = req.body;
    if (!from || !to) {
      res.status(400).json({
        message: 'Bad request',
        error: 400
      });
      return;
    }
    try {
      const client = new Client({
        network: process.env.DASH_NETWORK,
        wallet: {
          mnemonic: from
        }
      });
      const account = await client.getWalletAccount();
      const transaction = account.createTransaction({
        recipient: to,
        amount: 0.1
      });
      await account.broadcastTransaction(transaction);
      res.json({
        message: 'success',
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: e.toString(),
        error: 500
      });
    }
  } else {
    res.status(401).json({
      message: 'Unauthorized',
      error: 401
    });
  }
});

module.exports = router;
