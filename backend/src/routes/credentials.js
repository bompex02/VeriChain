import express from "express";
import contract from "../services/contractService.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const count = await contract.credentialCount();

    const credentials = [];

    for (let i = 0; i < count; i++) {
      const credential = await contract.credentials(i);

      credentials.push({
        id: i,
        issuer: credential.issuer,
        recipient: credential.recipient,
        metadataURI: credential.metadataURI,
        timestamp: Number(credential.timestamp),
        revoked: credential.revoked
      });
    }

    res.json(credentials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/issue", async (req, res) => {
  try {
    const { recipient, uri } = req.body;

    const tx = await contract.issueCredential(recipient, uri);
    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/activate", async (req, res) => {
  try {
    const { id } = req.body;

    const tx = await contract.activateCredential(id);
    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/verify/:id", async (req, res) => {
  try {
    const valid = await contract.verifyCredential(req.params.id);

    res.json({ valid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/revoke", async (req, res) => {
  try {
    const { id } = req.body;
    const tx = await contract.revokeCredential(id);
    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;