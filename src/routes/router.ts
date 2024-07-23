import express from "express";
import {
  CreateLink,
 
  clicksCreate,
  deleteLink,
  fetchClicksForUrl,
  fetchLinkData,
  fetchUrls,
  getLongUrl,
  login,
  signup,
  totalClicksData,
} from "../controllers/controller";
import { ImageUpload } from "../middleware/multer";

const router = express.Router();

router.post("/create_link", ImageUpload.single("qrCode"), (req, res) =>
  CreateLink(req, res)
);
router.post("/signup", (req, res) => {signup(req, res)});
router.post("/login", (req, res) => {login(req, res)});
router.get("/fetch_urls/:id", (req, res) => {fetchUrls(req, res)});
router.patch("/delete_link", (req, res) => deleteLink(req, res));
router.get("/get_long_url/:shortUrl", (req, res) => getLongUrl(req, res));
router.post("/clicks_create", (req, res) => clicksCreate(req, res));
router.get("/fetch_link_data/:id/:userId", (req, res) =>
  fetchLinkData(req, res)
);
router.get("/fetch_clicks_for_url/:id", (req, res) =>
  fetchClicksForUrl(req, res)
);
router.get("/fetch_total_clicks", (req, res) => totalClicksData(req, res));

export default router;

//checking
