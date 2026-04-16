
import express from "express";
import { CredentialController } from "../controllers/CredentialController.js";
import { CredentialService } from "../services/CredentialService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authWallet } from "../middlewares/authWallet.js";

const router = express.Router();
const credentialController = new CredentialController(new CredentialService());

router.get("/mine", authWallet, asyncHandler(credentialController.getMine)); // get own credentials (authenticated)
router.get("/public/:id", asyncHandler(credentialController.getPublic)); // get a public credential by id (no auth)
router.get("/shared/:id", authWallet, asyncHandler(credentialController.getShared)); // get a shared credential by id (authenticated)
router.get("/sharing/:id", authWallet, asyncHandler(credentialController.getSharing)); // get sharing status (only owner, authenticated)
router.post("/set-sharing", authWallet, asyncHandler(credentialController.setSharing)); // set sharing status (only owner, authenticated)


router.get("/all", asyncHandler(credentialController.getAll));
router.get("/verify/:id", asyncHandler(credentialController.verify));

export default router;