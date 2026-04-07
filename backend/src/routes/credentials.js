import express from "express";
import { CredentialController } from "../controllers/CredentialController.js";
import { CredentialService } from "../services/CredentialService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = express.Router();
const credentialController = new CredentialController(new CredentialService());

router.get("/all", asyncHandler(credentialController.getAll));
router.post("/issue", asyncHandler(credentialController.issue));
router.post("/activate", asyncHandler(credentialController.activate));
router.get("/verify/:id", asyncHandler(credentialController.verify));
router.post("/revoke", asyncHandler(credentialController.revoke));

export default router;